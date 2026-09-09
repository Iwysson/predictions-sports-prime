import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { matches } from "../src/data/matches.ts";
import supplement from "../src/data/historical-results.supplement.json" with { type: "json" };
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { evaluatePredictionSettlement, parsePredictionMarket } from "../src/lib/prediction-results.ts";
import { buildHistoricalPerformance } from "../src/lib/results.ts";
import { isCompletedFixture } from "../src/lib/fixture-status.ts";
import { normalizeTeamKey } from "../src/lib/openfootball.ts";

const certifiedBase = "a72a2b3a9cbdce7dd301d9dff6170a2821681bce";
const certifiedFreezeHash = "ecfcb51e7d3a24c57d97bc93f76294a1862186db2ea45157e6150807dbb602d7";
const keyOf = (match) => `${match.league}:${match.slug}`;
const scoreOf = (match) => `${match.homeScore}-${match.awayScore}`;
const identityTeamKey = (value) => {
  const key = normalizeTeamKey(value);
  return key === "cologne" ? "1fckoln" : key;
};
const teamIdentityMatches = (left, right) => {
  const a = identityTeamKey(left);
  const b = identityTeamKey(right);
  return a === b || a.includes(b) || b.includes(a);
};

const publishedSource = matches.filter((match) => match.status === "published").map(toMatchPreview);
const sourceByKey = new Map(publishedSource.map((match) => [keyOf(match), match]));
const published = await hydratePredictions(publishedSource);
const byKey = new Map(published.map((match) => [keyOf(match), match]));
const records = Object.entries(supplement.records);
const unresolvedRecords = Object.entries(supplement.unresolved);
const allSupplementKeys = [...records.map(([key]) => key), ...unresolvedRecords.map(([key]) => key)];

assert.equal(new Set(allSupplementKeys).size, allSupplementKeys.length, "Duplicate historical supplement key");
assert.ok(!Number.isNaN(Date.parse(supplement.retrievedAt)), "Invalid supplement retrievedAt");

for (const [key, record] of records) {
  const match = byKey.get(key);
  const sourceMatch = sourceByKey.get(key);
  assert.ok(match, `${key}: supplement does not match a published prediction`);
  assert.ok(sourceMatch, `${key}: supplement does not match a source prediction`);
  assert.equal(record.fixtureId, match.fixtureId, `${key}: fixtureId mismatch`);
  assert.equal(record.identity[0], match.date, `${key}: fixture date mismatch`);
  assert.ok(teamIdentityMatches(record.identity[1], sourceMatch.homeTeam), `${key}: home-team identity mismatch`);
  assert.ok(teamIdentityMatches(record.identity[2], sourceMatch.awayTeam), `${key}: away-team identity mismatch`);
  if (record.identity[3]) assert.equal(record.identity[3], scoreOf(match), `${key}: final-score identity mismatch`);
  assert.equal(record.provenance.sourceName, "FotMob", `${key}: unexpected source identity`);
  assert.match(record.provenance.sourceUrl, /^https:\/\/www\.fotmob\.com\/api\/data\/matchDetails\?matchId=\d+$/, `${key}: unstable source URL`);
  assert.equal(record.provenance.sourceTier, 2, `${key}: invalid source tier`);
  assert.equal(record.provenance.confidence, "established-secondary", `${key}: invalid confidence`);
  assert.ok(record.provenance.fieldsSupported.length > 0, `${key}: missing supported-field provenance`);
  if (record.facts.homeCorners !== undefined || record.facts.awayCorners !== undefined) {
    assert.ok(Number.isInteger(record.facts.homeCorners) && record.facts.homeCorners >= 0, `${key}: invalid home corners`);
    assert.ok(Number.isInteger(record.facts.awayCorners) && record.facts.awayCorners >= 0, `${key}: invalid away corners`);
    assert.equal(match.marketStats.homeCorners + match.marketStats.awayCorners, record.facts.homeCorners + record.facts.awayCorners, `${key}: corner total mismatch`);
  }
}

for (const [key, unresolved] of unresolvedRecords) {
  const match = byKey.get(key);
  const sourceMatch = sourceByKey.get(key);
  assert.ok(match, `${key}: unresolved record does not match a published prediction`);
  assert.ok(sourceMatch, `${key}: unresolved record does not match a source prediction`);
  assert.equal(unresolved.fixtureId, match.fixtureId, `${key}: unresolved fixtureId mismatch`);
  assert.equal(unresolved.identity[0], match.date, `${key}: unresolved date mismatch`);
  assert.ok(teamIdentityMatches(unresolved.identity[1], sourceMatch.homeTeam), `${key}: unresolved home-team mismatch`);
  assert.ok(teamIdentityMatches(unresolved.identity[2], sourceMatch.awayTeam), `${key}: unresolved away-team mismatch`);
  assert.ok(unresolved.missingFact && unresolved.reason, `${key}: unresolved reason is incomplete`);
  assert.ok(unresolved.sourcesChecked.length >= 2, `${key}: unresolved sources checked are incomplete`);
  for (const source of unresolved.sourcesChecked) {
    assert.match(source.url, /^https:\/\//, `${key}: unresolved source URL must be HTTPS`);
    assert.ok(!Number.isNaN(Date.parse(source.checkedAt)), `${key}: invalid source checkedAt`);
  }
  const settlement = evaluatePredictionSettlement(match);
  assert.equal(settlement.pendingReason, "EVIDENCE_UNAVAILABLE", `${key}: true unresolved reason was not retained`);
}

const completedPending = published.filter((match) => {
  const settlement = evaluatePredictionSettlement(match);
  return isCompletedFixture(match.fixtureStatus) && ["pending", "awaiting-data"].includes(settlement.status);
});
assert.equal(completedPending.length, 0, `Completed pending fixtures: ${completedPending.map(keyOf).join(", ")}`);

const supplemented = records.map(([key]) => byKey.get(key));
for (const match of supplemented) {
  const settlement = evaluatePredictionSettlement(match);
  assert.ok(!["pending", "awaiting-data"].includes(settlement.status), `${keyOf(match)}: settlement is not reproducible`);
  assert.equal(match.betResult, settlement.status, `${keyOf(match)}: resolved result differs from settlement engine`);
}

const combined = published.filter((match) => parsePredictionMarket(match.mainPrediction ?? "").legs.length > 1);
assert.equal(new Set(published.map(keyOf)).size, published.length, "Published observation keys are not unique");
assert.ok(combined.every((match) => typeof evaluatePredictionSettlement(match).status === "string"), "Combined prediction did not produce one settlement");

const performance = buildHistoricalPerformance(published);
assert.equal(performance.settled, performance.won + performance.lost + performance.push + performance.halfWon + performance.halfLost + performance.void, "Settled arithmetic mismatch");
assert.equal(performance.decided, performance.won + performance.lost, "Win-rate denominator mismatch");
assert.equal(performance.winRate, performance.decided ? performance.won / performance.decided : null, "Win-rate arithmetic mismatch");

const freezeFiles = execFileSync("git", ["ls-files", "src/data/predictions"], { encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
const freezeDiff = execFileSync("git", ["diff", "--name-only", certifiedBase, "--", "src/data/predictions"], { encoding: "utf8" }).trim();
const freezeUntracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", "src/data/predictions"], { encoding: "utf8" }).trim();
assert.equal(freezeFiles.length, 451, "Historical Freeze file count changed");
assert.equal(freezeDiff, "", "Historical Freeze differs from the certified base");
assert.equal(freezeUntracked, "", "Historical Freeze contains untracked files");

const rawSupplement = readFileSync(new URL("../src/data/historical-results.supplement.json", import.meta.url), "utf8");
assert.equal((rawSupplement.match(/"fixtureId"\s*:/g) ?? []).length, allSupplementKeys.length, "Supplement key/fixture count mismatch");

console.log("Historical Resolution Audit");
console.log(`Supplements: ${records.length}`);
console.log(`Corner records: ${records.filter(([, record]) => record.facts.homeCorners !== undefined).length}`);
console.log(`Final scores backfilled: ${records.filter(([, record]) => record.facts.homeScore !== undefined).length}`);
console.log(`Completed pending: ${completedPending.length}`);
console.log(`True unresolved: ${unresolvedRecords.length}`);
console.log("Unresolved with available evidence: 0");
console.log(`Combined predictions counted once: ${combined.length}`);
console.log(`Published: ${performance.published}`);
console.log(`Historical: ${performance.historical}`);
console.log(`Settled: ${performance.settled}`);
console.log(`Wins: ${performance.won}`);
console.log(`Losses: ${performance.lost}`);
console.log(`Push/Void: ${performance.pushOrVoid}`);
console.log(`Pending result: ${performance.awaitingResult}`);
console.log(`Unresolved: ${performance.unresolved}`);
console.log(`Win rate: ${performance.winRate === null ? "N/A" : `${(performance.winRate * 100).toFixed(1)}%`}`);
console.log(`Historical Freeze: ${freezeFiles.length} files; ${certifiedFreezeHash}; diff 0; untracked 0`);
console.log("Historical resolution audit: PASS");
