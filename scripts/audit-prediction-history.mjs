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
let awaitingData = 0;
let awaitingMarketData = 0;
let awaitingExecutionData = 0;
let completedPlainPending = 0;
let resolvableButUnsettled = 0;
let manualPreserved = 0;
let settlementMismatches = 0;
const unresolvedReasons = new Map();
const unresolvedItems = [];
const marketCoverage = new Map();
const unsupportedMarkets = [];
const marketDataErrors = [];
const marketDataItems = [];

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
    if (match.marketStats) {
      if (!Number.isInteger(match.marketStats.homeCorners) || match.marketStats.homeCorners < 0 || !Number.isInteger(match.marketStats.awayCorners) || match.marketStats.awayCorners < 0) {
        marketDataErrors.push(`${match.slug}: invalid corner totals`);
      }
      if (!match.marketStats.source.startsWith("https://")) marketDataErrors.push(`${match.slug}: market-data source must be HTTPS`);
      if (Number.isNaN(Date.parse(match.marketStats.capturedAt))) marketDataErrors.push(`${match.slug}: invalid market-data capturedAt`);
      marketDataItems.push({ slug: match.slug, corners: `${match.marketStats.homeCorners}-${match.marketStats.awayCorners}`, source: match.marketStats.source, result: settlement.status });
    }
    if (match.betResultSource === "manual") {
      manualPreserved += 1;
      if (settlement.status !== match.betResult) settlementMismatches += 1;
    } else if (settlement.status === "awaiting-data") {
      awaitingData += 1;
      if (settlement.pendingReason === "EXECUTION_DATA_MISSING") awaitingExecutionData += 1;
      else awaitingMarketData += 1;
      const reason = settlement.pendingReason ?? "UNKNOWN";
      unresolvedReasons.set(reason, (unresolvedReasons.get(reason) ?? 0) + 1);
      unresolvedItems.push({ slug: match.slug, pick: match.mainPrediction, reason, missingFields: settlement.missingFields });
    } else if (settlement.status === "pending") {
      completedPlainPending += 1;
      resolvableButUnsettled += settlement.pendingReason === "UNSUPPORTED_MARKET" || settlement.pendingReason === "TEAM_NOT_RESOLVED" ? 1 : 0;
      const reason = settlement.pendingReason ?? "UNKNOWN";
      unresolvedReasons.set(reason, (unresolvedReasons.get(reason) ?? 0) + 1);
      unresolvedItems.push({ slug: match.slug, pick: match.mainPrediction, reason, missingFields: settlement.missingFields });
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
const unavailableExecutionRegression = evaluatePredictionSettlement({
  ...settlementFixture,
  homeTeam: "Regression Home",
  awayTeam: "Regression Away",
  homeScore: 2,
  awayScore: 0,
  fixtureStatus: "completed",
  betResult: undefined,
  betResultSource: undefined,
  mainPrediction: "Over 1.5 Goals — Live Entry",
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
console.log(`Won: ${published.filter((match) => isCompletedFixture(match.fixtureStatus) && evaluatePredictionSettlement(match).status === "green").length}`);
console.log(`Lost: ${published.filter((match) => isCompletedFixture(match.fixtureStatus) && evaluatePredictionSettlement(match).status === "red").length}`);
console.log(`Push: ${published.filter((match) => isCompletedFixture(match.fixtureStatus) && evaluatePredictionSettlement(match).status === "push").length}`);
console.log(`Half won: ${published.filter((match) => isCompletedFixture(match.fixtureStatus) && evaluatePredictionSettlement(match).status === "half-green").length}`);
console.log(`Half lost: ${published.filter((match) => isCompletedFixture(match.fixtureStatus) && evaluatePredictionSettlement(match).status === "half-red").length}`);
console.log(`Void: ${published.filter((match) => isCompletedFixture(match.fixtureStatus) && evaluatePredictionSettlement(match).status === "void").length}`);
console.log(`Awaiting Market Data: ${awaitingMarketData}`);
console.log(`Awaiting Execution Data: ${awaitingExecutionData}`);
console.log(`Completed incorrectly marked match PENDING: ${completedPlainPending}`);
console.log(`Resolvable but unsettled: ${resolvableButUnsettled}`);
console.log(`Manual results preserved: ${manualPreserved}`);
console.log(`Settlement mismatches: ${settlementMismatches}`);
console.log(`Unsupported published market legs: ${unsupportedMarkets.length}`);
console.log(`Unresolved completed predictions: ${[...unresolvedReasons.values()].reduce((sum, count) => sum + count, 0)}`);
console.log(`Manual override regression: ${manualOverrideResolution === manualOverride ? "PASS" : "FAIL"}`);
for (const [reason, count] of [...unresolvedReasons].sort()) console.log(`Pending reason ${reason}: ${count}`);
for (const item of unresolvedItems) console.log(`UNRESOLVED ${item.slug}: ${item.reason} | missing ${item.missingFields.join(", ") || "none classified"} | ${item.pick}`);
for (const item of marketDataItems) console.log(`MARKET DATA ${item.slug}: corners ${item.corners} | result ${item.result} | ${item.source}`);
for (const [market, count] of [...marketCoverage].sort()) console.log(`Market ${market}: ${count}`);

assert.equal(completedMissingHistory, 0, "Completed match missing history");
assert.equal(completedStillActive, 0, "Completed match still active");
assert.equal(futureInHistory, 0, "Future match in history");
assert.equal(postponedInHistory, 0, "Postponed match in history");
assert.equal(duplicateHistory, 0, "Duplicate history entries detected");
assert.equal(settlementMismatches, 0, "Stored results diverge from deterministic settlement");
assert.equal(unsupportedMarkets.length, 0, `Unsupported published markets: ${unsupportedMarkets.join(", ")}`);
assert.equal(marketDataErrors.length, 0, `Invalid market settlement data: ${marketDataErrors.join(", ")}`);
assert.equal(combinationRegression.status, "green", "Winning combination with a push must settle green");
assert.equal(unavailableCornersRegression.status, "awaiting-data", "Corners cannot settle from a football score");
assert.equal(unavailableCornersRegression.pendingReason, "MARKET_DATA_MISSING", "Missing market data needs an explicit pending reason");
assert.deepEqual(unavailableCornersRegression.missingFields, ["corners"], "Missing factual fields must be explicit");
assert.equal(unavailableExecutionRegression.status, "awaiting-data", "Live entry cannot settle from the final score");
assert.equal(unavailableExecutionRegression.pendingReason, "EXECUTION_DATA_MISSING", "Live entry requires a distinct execution-data reason");
assert.deepEqual(unavailableExecutionRegression.missingFields, ["live-entry execution"], "Missing execution evidence must be explicit");
assert.equal(manualOverrideResolution, manualOverride, "Manual result must never be overwritten");
assert.equal(completedPlainPending, 0, "A completed match must not be presented as ordinary PENDING");
assert.equal(resolvableButUnsettled, 0, "A deterministically resolvable prediction remains unsettled");

console.log("Prediction history audit: PASS");
