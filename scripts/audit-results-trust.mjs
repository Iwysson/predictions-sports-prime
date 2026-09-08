import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { buildHistoricalPerformance } from "../src/lib/results.ts";
import { evaluatePredictionSettlement, parsePredictionMarket } from "../src/lib/prediction-results.ts";

const root = process.cwd();
const requireHtml = process.argv.includes("--html");
const publishedSource = matches.filter((match) => match.status === "published");
const sourcePreviews = publishedSource.map(toMatchPreview);
const resolved = await hydratePredictions(sourcePreviews);
const performance = buildHistoricalPerformance(resolved);
const sourceBySlug = new Map(sourcePreviews.map((match) => [match.slug, match]));

assert.equal(performance.published, publishedSource.length, "published count must use every published record");
assert.equal(performance.historical, performance.entries.length, "historical count must match eligible records");
assert.equal(
  performance.settled,
  performance.won + performance.lost + performance.push + performance.halfWon + performance.halfLost + performance.void,
  "settled math is inconsistent"
);
assert.equal(performance.decided, performance.won + performance.lost, "win-rate denominator is inconsistent");
assert.ok(performance.winRate === null || (Number.isFinite(performance.winRate) && performance.winRate >= 0 && performance.winRate <= 1), "invalid win rate");
assert.equal(performance.winRate, performance.decided ? performance.won / performance.decided : null, "win rate is not reproducible");

const ids = new Set();
let combinations = 0;
for (const match of performance.entries) {
  assert.ok(!ids.has(match.slug), `${match.slug}: duplicate historical observation`);
  ids.add(match.slug);
  const source = sourceBySlug.get(match.slug);
  assert.ok(source, `${match.slug}: historical entry has no published source`);
  assert.equal(match.mainPrediction, source.mainPrediction, `${match.slug}: published prediction changed`);
  assert.equal(match.odds, source.odds, `${match.slug}: published odds changed`);
  const settlement = evaluatePredictionSettlement(match);
  if (settlement.status === "pending" || settlement.status === "awaiting-data") {
    assert.ok(!["green", "red", "push", "half-green", "half-red", "void"].includes(settlement.status), `${match.slug}: unresolved entry counted as settled`);
  }
  const parsed = parsePredictionMarket(match.mainPrediction ?? "");
  if (parsed.legs.length > 1) combinations += 1;
}
assert.equal(ids.size, performance.entries.length, "combined or duplicate selections inflated the denominator");

const methodologySource = fs.readFileSync(path.join(root, "src/app/(en)/methodology/page.tsx"), "utf8");
for (const disclosure of ["Published odds", "Combined predictions", "wins divided by wins plus losses", "unresolved", "not rewritten", "does not contain a complete, auditable record of stakes"]) {
  assert.ok(methodologySource.toLowerCase().includes(disclosure.toLowerCase()), `methodology disclosure missing: ${disclosure}`);
}
const publicPresentation = [
  "src/app/(en)/results/page.tsx",
  "src/app/(en)/methodology/page.tsx",
  "src/components/PredictionResultsArchive.tsx",
].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
const dishonestClaims = [/guaranteed profit/i, /profitable system/i, /sure win/i, /easy money/i, /risk[- ]free/i, /always wins/i];
for (const pattern of dishonestClaims) assert.ok(!pattern.test(publicPresentation), `prohibited trust claim: ${pattern}`);
assert.ok(!/\bROI\b.{0,30}\d|\bprofit\b.{0,30}\d|\byield\b.{0,30}\d/i.test(publicPresentation), "unsupported financial performance metric exposed");

if (requireHtml) {
  const resultsPath = path.join(root, "out/results/index.html");
  assert.ok(fs.existsSync(resultsPath), "production Results HTML is missing");
  const html = fs.readFileSync(resultsPath, "utf8");
  assert.ok(html.includes('rel="canonical" href="https://predictions-sports-prime.com/results/"'), "Results canonical is incorrect");
  assert.ok(html.includes('"@type":"CollectionPage"'), "Results CollectionPage schema missing");
  assert.ok(html.includes('"@type":"ItemList"'), "Results ItemList schema missing");
  assert.ok(html.includes("wins + losses only"), "win-rate denominator is not visible");
  assert.ok(html.includes("No ROI or profit is calculated"), "financial-metric limitation is not visible");
  assert.ok(html.includes('href="/methodology/"'), "Results to Methodology link missing");
  const rows = [...html.matchAll(/<article\b[^>]*class="result-card"[^>]*>/g)].map((item) => item[0]);
  assert.equal(rows.length, Math.min(60, performance.historical), "recent Results slice has the wrong size");
  for (const row of rows) {
    const slug = row.match(/data-result-slug="([^"]+)"/)?.[1];
    assert.ok(slug && html.includes(`href="/match/${slug}/"`), `${slug}: historical match link missing`);
  }
  for (const match of performance.entries.filter((entry) => entry.fixtureStatus === "completed").slice(0, 25)) {
    const matchPath = path.join(root, "out/match", match.slug, "index.html");
    assert.ok(fs.existsSync(matchPath), `${match.slug}: historical match HTML missing`);
    const matchHtml = fs.readFileSync(matchPath, "utf8");
    assert.ok(matchHtml.includes("Historical prediction"), `${match.slug}: historical status missing`);
    assert.ok(matchHtml.includes("Published prediction"), `${match.slug}: published-prediction label missing`);
    assert.ok(matchHtml.includes("Prediction result:"), `${match.slug}: result label missing`);
    assert.ok(matchHtml.includes('href="/results/"'), `${match.slug}: Results link missing`);
    assert.ok(matchHtml.includes('href="/methodology/"'), `${match.slug}: Methodology link missing`);
    assert.ok(matchHtml.includes('rel="canonical" href="https://predictions-sports-prime.com/match/'), `${match.slug}: canonical match ownership missing`);
  }
}

console.log("Results & Trust v2");
console.log(`Published: ${performance.published}`);
console.log(`Historical: ${performance.historical}`);
console.log(`Settled: ${performance.settled}`);
console.log(`Wins: ${performance.won}`);
console.log(`Losses: ${performance.lost}`);
console.log(`Push/Void: ${performance.pushOrVoid}`);
console.log(`Pending result: ${performance.awaitingResult}`);
console.log(`Unresolved: ${performance.unresolved}`);
console.log(`Combined selections counted once: ${combinations}`);
console.log(`Win rate: ${performance.winRate === null ? "N/A" : `${(performance.winRate * 100).toFixed(1)}%`} (${performance.winRateDenominator})`);
console.log(`Historical HTML: ${requireHtml ? "PASS" : "not requested"}`);
console.log("Results trust audit: PASS");
