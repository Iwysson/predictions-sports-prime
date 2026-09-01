import { readFileSync } from "node:fs";
import { join } from "node:path";
import { collectEditorialState } from "./editorial-baseline-lib.mjs";
import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { buildPredictionHistoryState } from "../src/lib/results.ts";

const root = process.cwd();
const html = readFileSync(join(root, "out", "results", "index.html"), "utf8");
const baseline = JSON.parse(readFileSync(join(root, "editorial-baseline.json"), "utf8"));
const current = collectEditorialState(root);
const published = await hydratePredictions(matches.filter((match) => match.status === "published").map(toMatchPreview));
const history = buildPredictionHistoryState(published);
const errors = [];
const allowedStatuses = new Set(["pending", "awaiting-data", "green", "red", "push", "half-green", "half-red", "void"]);

function decode(value) {
  return value.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}

function attribute(tag, name) {
  return decode(tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "");
}

const tags = [...html.matchAll(/<article\b[^>]*class="result-card"[^>]*>/g)].map((match) => match[0]);
const rows = tags.map((tag) => ({
  slug: attribute(tag, "data-result-slug"),
  status: attribute(tag, "data-result-status"),
  pick: attribute(tag, "data-pick"),
  odds: attribute(tag, "data-odds"),
  publishedAt: attribute(tag, "data-published-at"),
  finalScore: attribute(tag, "data-final-score"),
  settlementMissing: attribute(tag, "data-settlement-missing"),
  settlementReason: attribute(tag, "data-settlement-reason"),
}));
const rowBySlug = new Map(rows.map((row) => [row.slug, row]));
const editorialBySlug = new Map(published.map((entry) => [entry.slug, entry]));
const eligibleHistorySlugs = new Set(history.entries.map((entry) => entry.slug));
if (rowBySlug.size !== rows.length) errors.push("duplicate result rows found");

for (const row of rows) {
  const entry = editorialBySlug.get(row.slug);
  if (!entry) { errors.push(`${row.slug}: result row has no published prediction`); continue; }
  if (row.pick !== entry.mainPrediction) errors.push(`${entry.slug}: displayed pick differs from editorial source`);
  if (row.odds !== (entry.odds == null ? "" : String(entry.odds))) errors.push(`${entry.slug}: displayed odds differs from editorial source`);
  if (row.publishedAt !== (entry.publishedAt ?? "")) errors.push(`${entry.slug}: displayed publishedAt differs from editorial source`);
  if (!allowedStatuses.has(row.status)) errors.push(`${entry.slug}: invalid result status ${row.status}`);
  if (!html.includes(`href="/match/${entry.slug}/"`)) errors.push(`${entry.slug}: missing match-page link`);
  if (entry.betResult && row.status !== entry.betResult) errors.push(`${entry.slug}: stored result status was not preserved`);
  const expectedScore = entry.homeScore !== null && entry.homeScore !== undefined && entry.awayScore !== null && entry.awayScore !== undefined ? `${entry.homeScore}-${entry.awayScore}` : "";
  if (expectedScore && row.finalScore !== expectedScore) errors.push(`${entry.slug}: stored final score was not preserved`);
  if (!eligibleHistorySlugs.has(entry.slug)) errors.push(`${entry.slug}: ineligible prediction leaked into History`);
  if (row.status === "awaiting-data" && !row.settlementMissing) {
    errors.push(`${entry.slug}: Awaiting Data row does not identify its missing factual field`);
  }
}

for (const entry of history.entries) {
  if (!rowBySlug.has(entry.slug)) errors.push(`${entry.slug}: eligible result is missing from History`);
}
if (!html.includes('data-default-filter="all"')) errors.push("complete ALL history is not the default");
if (!html.includes('aria-pressed="true">ALL')) errors.push("ALL filter is not visibly selected by default");
if (!html.includes('aria-label="Prediction result:')) errors.push("accessible result-status text is missing");
if (baseline.publishedCount !== current.entries.length || baseline.draftCount !== current.drafts) {
  console.warn(`WARNING: legacy editorial baseline counts differ (baseline ${baseline.publishedCount}/${baseline.draftCount}, current ${current.entries.length}/${current.drafts}); result integrity is validated against current published source records`);
}

const counts = Object.fromEntries([...allowedStatuses].map((status) => [status, rows.filter((row) => row.status === status).length]));
const awaitingMarketData = rows.filter((row) => row.status === "awaiting-data" && row.settlementReason === "MARKET_DATA_MISSING").length;
const awaitingExecutionData = rows.filter((row) => row.status === "awaiting-data" && row.settlementReason === "EXECUTION_DATA_MISSING").length;
console.log(`Published predictions: ${published.length}`);
console.log(`Completed History entries: ${rows.length}`);
console.log(`Pending: ${counts.pending}`);
console.log(`Awaiting Market Data: ${awaitingMarketData}`);
console.log(`Awaiting Execution Data: ${awaitingExecutionData}`);
console.log(`Won: ${counts.green}`);
console.log(`Lost: ${counts.red}`);
console.log(`Push: ${counts.push}`);
console.log(`Half won: ${counts["half-green"]}`);
console.log(`Half lost: ${counts["half-red"]}`);
console.log(`Void: ${counts.void}`);
const completedPending = rows.filter((row) => row.status === "pending" && editorialBySlug.get(row.slug)?.fixtureStatus === "completed").length;
if (completedPending > 0) errors.push(`${completedPending} completed matches are still marked ordinary PENDING`);
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exitCode = 1;
} else console.log("Results archive audit: PASS");
