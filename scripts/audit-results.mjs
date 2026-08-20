import { readFileSync } from "node:fs";
import { join } from "node:path";
import { collectEditorialState } from "./editorial-baseline-lib.mjs";

const root = process.cwd();
const html = readFileSync(join(root, "out", "results", "index.html"), "utf8");
const baseline = JSON.parse(readFileSync(join(root, "editorial-baseline.json"), "utf8"));
const current = collectEditorialState(root);
const errors = [];
const allowedStatuses = new Set(["pending", "green", "red", "push", "half-green", "half-red", "void"]);

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
}));
const rowBySlug = new Map(rows.map((row) => [row.slug, row]));
if (rowBySlug.size !== rows.length) errors.push("duplicate result rows found");
if (rows.length !== current.entries.length) errors.push(`archive has ${rows.length} rows; expected ${current.entries.length}`);

for (const entry of current.entries) {
  const row = rowBySlug.get(entry.slug);
  if (!row) { errors.push(`${entry.slug}: missing from results archive`); continue; }
  if (row.pick !== entry.mainPick) errors.push(`${entry.slug}: displayed pick differs from editorial source`);
  if (row.odds !== (entry.odds === null ? "" : String(entry.odds))) errors.push(`${entry.slug}: displayed odds differs from editorial source`);
  if (row.publishedAt !== (entry.publishedAt ?? "")) errors.push(`${entry.slug}: displayed publishedAt differs from editorial source`);
  if (!allowedStatuses.has(row.status)) errors.push(`${entry.slug}: invalid result status ${row.status}`);
  if (!html.includes(`href="/match/${entry.slug}/"`)) errors.push(`${entry.slug}: missing match-page link`);
  if (entry.resultStatus && row.status !== entry.resultStatus) errors.push(`${entry.slug}: stored result status was not preserved`);
  const expectedScore = entry.finalScore ? `${entry.finalScore.home}-${entry.finalScore.away}` : "";
  if (expectedScore && row.finalScore !== expectedScore) errors.push(`${entry.slug}: stored final score was not preserved`);
}

for (const row of rows) if (!current.entries.some((entry) => entry.slug === row.slug)) errors.push(`${row.slug}: result row has no published prediction`);
if (!html.includes('data-default-filter="all"')) errors.push("complete ALL history is not the default");
if (!html.includes('aria-pressed="true">ALL')) errors.push("ALL filter is not visibly selected by default");
if (!html.includes('aria-label="Prediction result:')) errors.push("accessible result-status text is missing");
if (baseline.publishedCount !== current.entries.length || baseline.draftCount !== current.drafts) errors.push("published/draft counts diverge from baseline");

const counts = Object.fromEntries([...allowedStatuses].map((status) => [status, rows.filter((row) => row.status === status).length]));
console.log(`Published predictions: ${current.entries.length}`);
console.log(`Results archive entries: ${rows.length}`);
console.log(`Pending: ${counts.pending}`);
console.log(`Won: ${counts.green}`);
console.log(`Lost: ${counts.red}`);
console.log(`Push: ${counts.push}`);
console.log(`Half won: ${counts["half-green"]}`);
console.log(`Half lost: ${counts["half-red"]}`);
console.log(`Void: ${counts.void}`);
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exitCode = 1;
} else console.log("Results archive audit: PASS");
