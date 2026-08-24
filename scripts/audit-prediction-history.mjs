import assert from "node:assert/strict";
import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { buildPredictionHistoryState } from "../src/lib/results.ts";
import { isCompletedFixture, isNonPlayableFixture } from "../src/lib/fixture-status.ts";
import { evaluatePredictionSettlement, parsePredictionMarket, resolvePredictionResult } from "../src/lib/prediction-results.ts";

const publishedSource = matches.filter((match) => match.status === "published");
const published = await hydratePredictions(publishedSource.map(toMatchPreview));
const history = buildPredictionHistoryState(published).entries;
const historySlugs = new Set(history.map((match) => match.slug));
let completedMissingHistory = 0;
let completedStillActive = 0;
let futureInHistory = 0;
let postponedInHistory = 0;
let duplicateHistory = 0;
let automaticSettled = 0;
let manualPreserved = 0;
let settlementMismatches = 0;
const unresolvedReasons = new Map();
const unresolvedItems = [];
const marketCoverage = new Map();
const unsupportedMarkets = [];

const seen = new Set();
for (const match of history) {
  const key = `${match.league}:${match.slug}`;
  if (seen.has(key)) duplicateHistory += 1;
  seen.add(key);
}

for (const match of published) {
  const completed = isCompletedFixture(match.fixtureStatus);
  const nonPlayable = isNonPlayableFixture(match.fixtureStatus);
  const inHistory = historySlugs.has(match.slug);

  if (completed && !inHistory) completedMissingHistory += 1;
  if (completed && !nonPlayable && !inHistory) completedStillActive += 1;
  if (!completed && inHistory) futureInHistory += 1;
  if (match.fixtureStatus === "postponed" && inHistory) postponedInHistory += 1;

  const parsed = parsePredictionMarket(match.mainPrediction ?? "");
  parsed.legs.forEach((leg) => marketCoverage.set(leg.kind, (marketCoverage.get(leg.kind) ?? 0) + 1));
  unsupportedMarkets.push(...parsed.unsupportedLegs.map((leg) => `${match.slug}: ${leg}`));

  if (completed) {
    const settlement = evaluatePredictionSettlement(match);
    if (match.betResultSource === "manual") {
      manualPreserved += 1;
      if (settlement.status !== match.betResult) settlementMismatches += 1;
    } else if (settlement.status === "pending") {
      const reason = settlement.pendingReason ?? "UNKNOWN";
      unresolvedReasons.set(reason, (unresolvedReasons.get(reason) ?? 0) + 1);
      unresolvedItems.push({ slug: match.slug, pick: match.mainPrediction, reason });
    } else {
      automaticSettled += 1;
      if (match.betResult && settlement.status !== match.betResult) settlementMismatches += 1;
    }
  }
}

const settlementFixture = published.find((match) => isCompletedFixture(match.fixtureStatus)) ?? published[0];
const combinationRegression = evaluatePredictionSettlement({
  ...settlementFixture,
  homeTeam: "Regression Home",
  awayTeam: "Regression Away",
  homeScore: 2,
  awayScore: 0,
  fixtureStatus: "completed",
  betResult: undefined,
  betResultSource: undefined,
  mainPrediction: "Regression Home to Win + Over 2 Goals",
});
const unavailableCornersRegression = evaluatePredictionSettlement({
  ...settlementFixture,
  homeTeam: "Regression Home",
  awayTeam: "Regression Away",
  homeScore: 2,
  awayScore: 0,
  fixtureStatus: "completed",
  betResult: undefined,
  betResultSource: undefined,
  mainPrediction: "Regression Home Over 4.5 Corners",
});
const manualOverride = {
  ...settlementFixture,
  betResult: "red",
  betResultSource: "manual",
  mainPrediction: "Regression Home to Win",
};
const manualOverrideResolution = resolvePredictionResult(manualOverride);

console.log("Prediction History Health");
console.log(`Published completed predictions: ${published.filter((match) => isCompletedFixture(match.fixtureStatus)).length}`);
console.log(`Correctly in History: ${history.length}`);
console.log(`Completed still active: ${completedStillActive}`);
console.log(`Future in History: ${futureInHistory}`);
console.log(`Duplicate history entries: ${duplicateHistory}`);
console.log(`Completed missing History: ${completedMissingHistory}`);
console.log(`Postponed in History: ${postponedInHistory}`);
console.log(`Automatic settled: ${automaticSettled}`);
console.log(`Manual results preserved: ${manualPreserved}`);
console.log(`Settlement mismatches: ${settlementMismatches}`);
console.log(`Unsupported published market legs: ${unsupportedMarkets.length}`);
console.log(`Unresolved completed predictions: ${[...unresolvedReasons.values()].reduce((sum, count) => sum + count, 0)}`);
console.log(`Manual override regression: ${manualOverrideResolution === manualOverride ? "PASS" : "FAIL"}`);
for (const [reason, count] of [...unresolvedReasons].sort()) console.log(`Pending reason ${reason}: ${count}`);
for (const item of unresolvedItems) console.log(`UNRESOLVED ${item.slug}: ${item.reason} | ${item.pick}`);
for (const [market, count] of [...marketCoverage].sort()) console.log(`Market ${market}: ${count}`);

assert.equal(completedMissingHistory, 0, "Completed match missing history");
assert.equal(completedStillActive, 0, "Completed match still active");
assert.equal(futureInHistory, 0, "Future match in history");
assert.equal(postponedInHistory, 0, "Postponed match in history");
assert.equal(duplicateHistory, 0, "Duplicate history entries detected");
assert.equal(settlementMismatches, 0, "Stored results diverge from deterministic settlement");
assert.equal(unsupportedMarkets.length, 0, `Unsupported published markets: ${unsupportedMarkets.join(", ")}`);
assert.equal(combinationRegression.status, "green", "Winning combination with a push must settle green");
assert.equal(unavailableCornersRegression.status, "pending", "Corners cannot settle from a football score");
assert.equal(unavailableCornersRegression.pendingReason, "MARKET_DATA_MISSING", "Missing market data needs an explicit pending reason");
assert.equal(manualOverrideResolution, manualOverride, "Manual result must never be overwritten");

console.log("Prediction history audit: PASS");
