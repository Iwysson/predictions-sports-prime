import assert from "node:assert/strict";
import snapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { matches } from "../src/data/matches.ts";
import { evaluatePredictionFreshness } from "../src/lib/freshness-engine.ts";

const now = new Date(process.env.FRESHNESS_AUDIT_NOW ?? Date.now());
assert(Number.isFinite(now.valueOf()), "FRESHNESS_AUDIT_NOW must be a valid timestamp");
const runtimeBySlug = new Map(matches.map((match) => [match.slug, match]));
const published = editorialPredictions.filter((prediction) => prediction.published === true);
const reports = published.map((prediction) => evaluatePredictionFreshness(prediction, {
  now,
  runtimeMatch: runtimeBySlug.get(prediction.slug),
  fixtureObservedAt: snapshot.generatedAt,
}));
const future = reports.filter((report) => report.lifecycle === "future-pre-match");
const historical = reports.filter((report) => report.lifecycle === "historical-frozen");
const unresolved = reports.filter((report) => report.lifecycle === "unresolved-quarantine");

assert(future.length > 0, "freshness inventory must contain future predictions");
assert(historical.length > 0, "historical exclusion regression needs historical predictions");
for (const report of [...historical, ...unresolved]) {
  assert(Object.values(report.domains).every((domain) => domain.state === "NOT_APPLICABLE"), `${report.slug}: non-future data entered freshness evaluation`);
  assert.equal(report.missingCritical, false, `${report.slug}: excluded lifecycle produced a critical freshness failure`);
}

for (const [index, prediction] of published.entries()) {
  const report = reports[index];
  assert(report, `${prediction.slug}: freshness report missing`);
  assert.equal(report.publishedOdds, prediction.picks.publishedOdds ?? prediction.picks.odds, `${prediction.slug}: published odds changed`);
  assert.equal(report.latestObservedOdds, prediction.picks.latestObservedOdds, `${prediction.slug}: observed odds replaced published odds`);
  if (prediction.picks.latestObservedOdds !== undefined) {
    assert(prediction.picks.publishedOdds !== undefined, `${prediction.slug}: latest observed odds require explicit immutable publishedOdds`);
  }
  if (prediction.matchSeo?.lineups) {
    assert(["expected", "confirmed"].includes(prediction.matchSeo.lineups.status), `${prediction.slug}: probable and confirmed lineup semantics collapsed`);
    if (prediction.matchSeo.lineups.status === "confirmed") {
      assert(prediction.matchSeo.lineups.updatedAt || prediction.freshness?.lineupUpdatedAt, `${prediction.slug}: confirmed lineup lacks observation time`);
    }
  }
}

for (const report of future) {
  for (const domain of Object.values(report.domains)) {
    if (["FRESH", "AGING"].includes(domain.state)) {
      assert(domain.observedAt, `${report.slug}/${domain.domain}: current data lacks observedAt`);
      assert(domain.sourceUrls.length > 0, `${report.slug}/${domain.domain}: current data lacks HTTPS provenance`);
      assert(domain.observedAt < report.kickoffAt, `${report.slug}/${domain.domain}: post-match data accepted as pre-match`);
    }
  }
}

const regressionBase = published.find((prediction) => prediction.matchInfo?.date && prediction.matchInfo?.time);
assert(regressionBase, "freshness regression fixture unavailable");
const historicalRegression = evaluatePredictionFreshness(regressionBase, { now: new Date("2099-01-01T00:00:00Z") });
assert(Object.values(historicalRegression.domains).every((domain) => domain.state === "NOT_APPLICABLE"), "historical regression was not excluded before enrichment");
const postMatchTimestamp = "2030-01-02T13:00:00Z";
const contaminationRegression = evaluatePredictionFreshness({
  ...regressionBase,
  analysis: [...regressionBase.analysis, "### Statistical Core Predictions-Sports-Prime"],
  matchInfo: { ...regressionBase.matchInfo, date: "2030-01-02", time: "09:00" },
  freshness: { ...regressionBase.freshness, statisticsUpdatedAt: postMatchTimestamp },
}, { now: new Date("2030-01-02T11:30:00Z"), fixtureObservedAt: "2030-01-02T11:00:00Z" });
assert.equal(contaminationRegression.domains.statisticalCore.state, "STALE", "post-kickoff Statistical Core contamination was not rejected");

const states = ["FRESH", "AGING", "STALE", "MISSING", "NOT_APPLICABLE"];
const overallState = (report) => {
  const domainStates = Object.values(report.domains).map((domain) => domain.state);
  if (domainStates.includes("STALE")) return "STALE";
  if (domainStates.includes("AGING")) return "AGING";
  return "FRESH";
};
const inventory = {
  FRESH: future.filter((report) => overallState(report) === "FRESH").length,
  AGING: future.filter((report) => overallState(report) === "AGING").length,
  STALE: future.filter((report) => overallState(report) === "STALE").length,
};
const domainCounts = Object.fromEntries(["fixture", "teamNews", "lineups", "odds", "statisticalCore"].map((domain) => [domain, Object.fromEntries(states.map((state) => [state, future.filter((report) => report.domains[domain].state === state).length]))]));
const critical = future.filter((report) => report.missingCritical);
assert.equal(critical.length, 0, `stale/missing critical facts: ${critical.map((report) => report.slug).join(", ")}`);

console.log("Freshness Engine Audit");
console.log(`Audit now: ${now.toISOString()}`);
console.log(`Future predictions: ${future.length}`);
console.log(`Fresh: ${inventory.FRESH}`);
console.log(`Aging: ${inventory.AGING}`);
console.log(`Stale: ${inventory.STALE}`);
console.log(`Missing critical: ${critical.length}`);
console.log(`Historical excluded: ${historical.length}`);
console.log(`Unresolved excluded: ${unresolved.length}`);
for (const [domain, counts] of Object.entries(domainCounts)) console.log(`${domain}: ${JSON.stringify(counts)}`);
console.log("Freshness engine audit: PASS");
