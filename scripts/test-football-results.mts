// Football results settlement tests. No network, no file writes.
import assert from "node:assert/strict";
import type { MatchPreview } from "../src/types/index.ts";
import { evaluatePredictionSettlement } from "../src/lib/prediction-results.ts";
import { applyDailyFixtureUpdate } from "../src/lib/fixture-live-refresh.ts";
import {
  buildResultsDataset, emptyResultsDataset, latestResults, overlayStoredResult, settleFromMatch, summarizeResults, toPublicResult,
} from "../src/lib/football-results.ts";
import { maskSettledResultRecords } from "./lib/leak-context.mjs";

const NOW = "2026-10-07T23:00:00.000Z";
const match = (pick: string, score: [number, number] | null, extra: Partial<MatchPreview> = {}): MatchPreview => ({
  id: "x", slug: "cruzeiro-vs-sao-paulo", league: "brasileirao-serie-a", round: "Matchday 29",
  homeTeam: "Cruzeiro", awayTeam: "São Paulo", date: "2026-10-07", time: "21:30", status: "published",
  title: "t", mainPrediction: pick, odds: 1.67, predictions: [],
  fixtureStatus: score ? "completed" : "scheduled",
  homeScore: score ? score[0] : null, awayScore: score ? score[1] : null, ...extra,
} as unknown as MatchPreview);
const status = (pick: string, score: [number, number] | null, extra: Partial<MatchPreview> = {}) =>
  evaluatePredictionSettlement(match(pick, score, extra)).status;

// Markets
assert.equal(status("Cruzeiro to Win", [2, 0]), "green");
assert.equal(status("Cruzeiro to Win", [1, 1]), "red");
assert.equal(status("Cruzeiro or Draw (1X)", [1, 1]), "green");
assert.equal(status("Cruzeiro or Draw (1X)", [0, 1]), "red");
assert.equal(status("São Paulo or Draw (X2)", [0, 0]), "green");
assert.equal(status("São Paulo or Draw (X2)", [2, 0]), "red");
assert.equal(status("Over 2.5 Goals", [2, 1]), "green");
assert.equal(status("Under 2.5 Goals", [2, 1]), "red");
assert.equal(status("Under 2.5 Goals", [1, 1]), "green");
assert.equal(status("Both Teams to Score — Yes", [1, 1]), "green");
assert.equal(status("Both Teams to Score — Yes", [1, 0]), "red");
assert.equal(status("Cruzeiro or Draw (1X) + Over 1.5 Goals", [1, 1]), "green");
assert.equal(status("Cruzeiro or Draw (1X) + Over 1.5 Goals", [1, 0]), "red", "one losing leg loses the combined pick");
assert.equal(status("Cruzeiro -1", [2, 1]), "push");
assert.equal(status("Cruzeiro -1", [3, 1]), "green");
assert.equal(status("Cruzeiro -0.75 Handicap", [1, 0]), "half-green");
assert.equal(status("Over 2 Goals", [1, 1]), "push");

// Unsettled lifecycle states are never WIN/LOSS
for (const fixtureStatus of ["scheduled", "in-progress", "postponed", "canceled"] as const) {
  const evaluation = evaluatePredictionSettlement(match("Cruzeiro to Win", null, { fixtureStatus }));
  assert.equal(evaluation.status, "pending", fixtureStatus);
  assert.equal(settleFromMatch(match("Cruzeiro to Win", null, { fixtureStatus }), NOW), null);
}
// Live with a partial score is still pending
assert.equal(settleFromMatch(match("Cruzeiro to Win", [2, 0], { fixtureStatus: "in-progress" }), NOW), null);

// Markets lacking required statistics need data, never a false result
const corners = evaluatePredictionSettlement(match("Over 8.5 Corners", [1, 1]));
assert.equal(corners.status, "awaiting-data");
assert.equal(corners.pendingReason, "MARKET_DATA_MISSING");
assert.equal(settleFromMatch(match("Over 8.5 Corners", [1, 1]), NOW), null);
assert.equal(
  settleFromMatch(match("Over 8.5 Corners", [1, 1], { marketStats: { homeCorners: 6, awayCorners: 4, source: "t", capturedAt: NOW } }), NOW)?.result,
  "green"
);

// Transition: LIVE -> FINAL yields exactly one new settlement and recomputed stats
{
  const settled = [
    match("Cruzeiro to Win", [1, 0], { slug: "a" }),
    match("Cruzeiro to Win", [1, 0], { slug: "b" }),
    match("Cruzeiro to Win", [0, 1], { slug: "c" }),
  ];
  const live = match("Cruzeiro or Draw (1X) + Over 1.5 Goals", null, { fixtureStatus: "in-progress" });
  const before = buildResultsDataset([...settled, live], emptyResultsDataset(), NOW);
  assert.equal(Object.keys(before.records).length, 3);
  assert.equal(summarizeResults(Object.values(before.records)).winRate, 2 / 3);
  const final = match("Cruzeiro or Draw (1X) + Over 1.5 Goals", [2, 0], { fixtureStatus: "completed" });
  const after = buildResultsDataset([...settled, final], before, "2026-10-08T01:00:00.000Z");
  assert.equal(Object.keys(after.records).length, 4, "exactly one result added");
  assert.equal(after.records["brasileirao-serie-a:cruzeiro-vs-sao-paulo"].result, "green");
  assert.equal(summarizeResults(Object.values(after.records)).winRate, 3 / 4);
  // Idempotent: re-processing the same FINAL changes nothing (including settledAt).
  const again = buildResultsDataset([...settled, final], after, "2026-10-09T00:00:00.000Z");
  assert.equal(JSON.stringify(again), JSON.stringify(after));
}

// Win rate excludes push / pending
{
  const records = Object.values(buildResultsDataset([
    match("Cruzeiro to Win", [1, 0], { slug: "w" }),
    match("Cruzeiro to Win", [0, 1], { slug: "l" }),
    match("Cruzeiro -1", [2, 1], { slug: "p" }),
  ], emptyResultsDataset(), NOW).records);
  const stats = summarizeResults(records);
  assert.equal(stats.settled, 3);
  assert.equal(stats.pushes, 1);
  assert.equal(stats.winRate, 0.5);
}

// Provider failure / stale snapshot: a stored settlement is never lost or downgraded
{
  const stored = buildResultsDataset([match("Cruzeiro to Win", [2, 0])], emptyResultsDataset(), NOW);
  const stale = match("Cruzeiro to Win", null, { fixtureStatus: "scheduled" });
  assert.equal(JSON.stringify(buildResultsDataset([stale], stored, NOW)), JSON.stringify(stored));
  const restored = overlayStoredResult(stale, stored);
  assert.equal(restored.fixtureStatus, "completed");
  assert.equal(restored.homeScore, 2);
  assert.equal(evaluatePredictionSettlement(restored).status, "green");
  assert.equal(overlayStoredResult(match("Cruzeiro to Win", null, { slug: "other" }), stored).fixtureStatus, "scheduled");
  // The original pick and odds are frozen in the record.
  assert.equal(stored.records["brasileirao-serie-a:cruzeiro-vs-sao-paulo"].prediction, "Cruzeiro to Win");
  assert.equal(stored.records["brasileirao-serie-a:cruzeiro-vs-sao-paulo"].odds, 1.67);
}

// Latest-first ordering for the homepage preview
{
  const dataset = buildResultsDataset([
    match("Cruzeiro to Win", [1, 0], { slug: "old", date: "2026-10-01" }),
    match("Cruzeiro to Win", [1, 0], { slug: "new", date: "2026-10-07" }),
  ], emptyResultsDataset(), NOW);
  assert.deepEqual(latestResults(dataset, 1).map((record) => record.slug), ["new"]);
}

// Fixture refresh: LIVE -> FINAL, accent tolerance, reverse fixtures, final immutability
{
  const fixture: any = { round: 29, date: "2026-10-07", time: "21:30", homeTeam: "Cruzeiro", awayTeam: "São Paulo", homeScore: null, awayScore: null, status: "scheduled" };
  const daily = (extra: any = {}) => [{ id: "999", homeTeam: "Cruzeiro", awayTeam: "Sao Paulo", date: "2026-10-07", status: "in-progress", homeScore: 1, awayScore: 0, ...extra }];
  assert.equal(applyDailyFixtureUpdate(fixture, daily()), true);
  assert.equal(fixture.status, "in-progress");
  assert.equal(fixture.homeScore, null, "partial live score is not stored");
  assert.equal(fixture.espnEventId, "999");
  assert.equal(applyDailyFixtureUpdate(fixture, daily({ status: "completed", homeScore: 2, awayScore: 0 })), true);
  assert.equal(fixture.status, "completed");
  assert.equal(fixture.homeScore, 2);
  // Final score is immutable against a stale/incorrect later observation
  applyDailyFixtureUpdate(fixture, daily({ status: "scheduled", homeScore: null, awayScore: null }));
  applyDailyFixtureUpdate(fixture, daily({ status: "completed", homeScore: 0, awayScore: 5 }));
  assert.deepEqual([fixture.status, fixture.homeScore, fixture.awayScore], ["completed", 2, 0]);
  // Reverse fixture never matches
  const other: any = { ...fixture, status: "scheduled", homeScore: null, awayScore: null, espnEventId: undefined };
  assert.equal(applyDailyFixtureUpdate(other, [{ id: "1", homeTeam: "São Paulo", awayTeam: "Cruzeiro", date: "2026-10-07", status: "completed", homeScore: 3, awayScore: 0 }]), false);
  assert.equal(other.status, "scheduled");
  // Postponed / cancelled are recorded as such, never as a result
  const postponed: any = { ...other };
  applyDailyFixtureUpdate(postponed, daily({ status: "postponed", homeScore: null, awayScore: null }));
  assert.equal(postponed.status, "postponed");
  // Completed without a valid score is not accepted
  const noScore: any = { ...other, status: "in-progress" };
  applyDailyFixtureUpdate(noScore, daily({ status: "completed", homeScore: null, awayScore: null }));
  assert.equal(noScore.status, "in-progress");
}

// VIP / BEST BET / PRIME VIP: protected before and during the match, public in Results only once FINAL + settled
{
  for (const access of ["vip", "free"] as const) {
    for (const fixtureStatus of ["scheduled", "in-progress"] as const) {
      const dataset = buildResultsDataset([match("Cruzeiro to Win", null, { predictionAccess: access, fixtureStatus })], emptyResultsDataset(), NOW);
      assert.equal(Object.keys(dataset.records).length, 0, `${access} ${fixtureStatus} must not enter the results dataset`);
    }
    const final = settleFromMatch(match("Cruzeiro to Win", [2, 0], { predictionAccess: access, bestAnalysis: access === "vip" }), NOW)!;
    assert.equal(toPublicResult(final).prediction, "Cruzeiro to Win");
    assert.equal(toPublicResult(final).odds, 1.67);
    assert.equal(toPublicResult(final).result, "green");
    assert.equal(toPublicResult(final).predictionAccess, access);
    // Only track-record fields: no analysis text can be part of a record.
    assert.deepEqual(Object.keys(final).sort(), [
      "awayTeam", "date", "finalScore", "homeTeam", "key", "league", "odds", "prediction", "predictionAccess", "result", "settledAt", "slug",
    ].sort());
  }
}

// check-vip-leak contextual exception: only the serialized settled record is exempt
{
  const record = { key: "l:s", slug: "s", finalScore: { home: 1, away: 0 }, result: "green" };
  const records = { "l:s": record };
  const PICK = "Secret Pick";
  const card = `<article class="result-card" data-result-slug="s" data-pick="${PICK}"><dd>${PICK}</dd></article>`;
  const json = `{"key":"l:s","prediction":"${PICK}","odds":1.9,"settledAt":"2026-10-07T23:00:00.000Z"}`;
  const escaped = json.replaceAll('"', '\\"');
  assert.equal(maskSettledResultRecords(card + json + escaped, records).includes(PICK), false, "settled record contexts are exempt");
  const upcoming = `<a href="/match/s/">${PICK}</a>`;
  assert.equal(maskSettledResultRecords(upcoming, records).includes(PICK), true, "match page / upcoming context still leaks");
  assert.equal(maskSettledResultRecords(`{"key":"l:other","prediction":"${PICK}","settledAt":"x"}`, records).includes(PICK), true, "unsettled predictions are never exempt");
  assert.equal(maskSettledResultRecords(`<article class="result-card" data-result-slug="other">${PICK}</article>`, records).includes(PICK), true);
  assert.equal(maskSettledResultRecords(`<p>${PICK}</p>` + card, records).includes(PICK), true, "a pick outside the card is still reported");
  // No settled record -> nothing is exempt
  assert.equal(maskSettledResultRecords(card, {}).includes(PICK), true);
}

console.log("Football results tests: PASS");
