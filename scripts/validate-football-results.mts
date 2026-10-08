// results:validate — integrity audit of the central football results dataset.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { settlementPreviews } from "../src/lib/settlement-source.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { evaluatePredictionSettlement } from "../src/lib/prediction-results.ts";
import { resultKey, settleFromMatch, SETTLED_STATUSES, summarizeResults, type FootballResultsDataset } from "../src/lib/football-results.ts";

const dataset: FootballResultsDataset = JSON.parse(await readFile(resolve("src/data/football-results.snapshot.json"), "utf8"));
assert.equal(dataset.version, 1, "Unsupported results dataset version.");

const published = settlementPreviews();
const publishedByKey = new Map(published.map((match) => [resultKey(match), match]));
const hydrated = await hydratePredictions(published);
const hydratedByKey = new Map(hydrated.map((match) => [resultKey(match), match]));
const errors: string[] = [];

const identities = new Map<string, string>();
for (const [key, record] of Object.entries(dataset.records)) {
  if (record.key !== key) errors.push(`${key}: record key mismatch.`);
  const original = publishedByKey.get(key);
  if (!original) { errors.push(`${key}: settlement without a matching published prediction.`); continue; }
  if (record.prediction !== original.mainPrediction) errors.push(`${key}: original prediction modified ("${record.prediction}" vs "${original.mainPrediction}").`);
  if (record.odds !== (original.odds ?? null)) errors.push(`${key}: original odds modified (${record.odds} vs ${original.odds}).`);
  if (record.predictionAccess !== (original.predictionAccess === "free" ? "free" : "vip")) errors.push(`${key}: access tier changed since settlement.`);
  if (!SETTLED_STATUSES.has(record.result)) errors.push(`${key}: invalid settled status ${record.result}.`);
  if (!Number.isInteger(record.finalScore?.home) || !Number.isInteger(record.finalScore?.away)) errors.push(`${key}: invalid final score.`);
  const identity = `${record.league}|${record.homeTeam}|${record.awayTeam}|${record.date}`;
  const duplicate = identities.get(identity);
  if (duplicate) errors.push(`${key}: duplicate settlement of the same fixture as ${duplicate}.`);
  identities.set(identity, key);
  const current = hydratedByKey.get(key);
  const recomputed = current ? settleFromMatch(current, record.settledAt) : null;
  if (recomputed && recomputed.result !== record.result) errors.push(`${key}: stored ${record.result} differs from recomputed ${recomputed.result}.`);
  if (recomputed && (recomputed.finalScore.home !== record.finalScore.home || recomputed.finalScore.away !== record.finalScore.away)) {
    errors.push(`${key}: stored final score differs from the official fixture.`);
  }
}

const unsettled: string[] = [];
const needsData: string[] = [];
let live = 0;
for (const match of hydrated) {
  const key = resultKey(match);
  if (dataset.records[key]) continue;
  const evaluation = evaluatePredictionSettlement(match);
  if (match.fixtureStatus === "in-progress") live += 1;
  if (match.fixtureStatus !== "completed") continue;
  if (SETTLED_STATUSES.has(evaluation.status)) unsettled.push(key);
  else needsData.push(`${key} (${evaluation.pendingReason ?? evaluation.status})`);
}
for (const key of unsettled) errors.push(`${key}: completed supported prediction without a settlement.`);

const summary = summarizeResults(Object.values(dataset.records));
console.log(`results:validate — ${summary.settled} settled (W ${summary.wins} / L ${summary.losses} / push ${summary.pushes}), win rate ${summary.winRate === null ? "n/a" : (summary.winRate * 100).toFixed(1) + "%"}`);
console.log(`  completed supported without settlement: ${unsettled.length}`);
console.log(`  duplicate settlements: ${errors.filter((e) => e.includes("duplicate")).length}`);
console.log(`  settlements without published prediction: ${errors.filter((e) => e.includes("without a matching")).length}`);
console.log(`  original predictions modified: ${errors.filter((e) => e.includes("prediction modified")).length}`);
console.log(`  original odds modified: ${errors.filter((e) => e.includes("odds modified")).length}`);
console.log(`  live / in progress (not counted): ${live}; completed awaiting market data: ${needsData.length}`);
for (const item of needsData) console.warn(`  NEEDS_DATA ${item}`);
if (errors.length) {
  for (const error of errors) console.error(`RESULTS_INTEGRITY ${error}`);
  process.exit(1);
}
console.log("results:validate — PASS");
