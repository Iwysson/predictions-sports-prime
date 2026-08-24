import assert from "node:assert/strict";
import {
  canRenderComingSoon,
  fixtureStatusCategory,
  isCompletedFixture,
  isHistoryEligibleFixture,
  isValidFinalScore,
  isNonPlayableFixture,
  normalizeProviderStatus,
  selectFixtureKickoff,
} from "../src/lib/fixture-status.ts";
import { eventKickoffInSiteTimezone } from "../src/lib/openfootball.ts";
import { resolveCompetitionRounds } from "../src/lib/match-lifecycle.ts";
import snapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };

const fixture = (id, status, round = 1) => ({ id, status, round });

assert.equal(fixtureStatusCategory("scheduled"), "upcoming", "A: scheduled must be upcoming");
assert.equal(canRenderComingSoon("postponed", false), false, "B: postponed must not be coming soon");
assert.equal(canRenderComingSoon("canceled", false), false, "C: canceled must not be coming soon");
assert.equal(fixtureStatusCategory("completed"), "completed", "D: finished must not be upcoming");

const centralRoundAdvance = resolveCompetitionRounds([
  { round: 1, games: [fixture("round-1-a", "postponed")] },
  { round: 2, games: [fixture("round-2-a", "scheduled", 2)] },
  { round: 3, games: [fixture("round-3-a", "scheduled", 3)] },
]);
assert.equal(centralRoundAdvance.currentRound?.round, 2, "E: terminal non-playable round must promote centrally");
assert.equal(centralRoundAdvance.nextRound?.round, 3, "E2: explicit matchday sequence selects Next Round");

assert.deepEqual(selectFixtureKickoff({
  fallbackDate: "2026-08-22",
  fallbackTime: "17:00",
  providerDate: "2026-08-21",
  providerTime: "15:45",
  providerIsAuthoritative: true,
}), { date: "2026-08-21", time: "15:45" }, "E4: authoritative provider kickoff must replace stale editorial fallback");
assert.deepEqual(selectFixtureKickoff({
  fallbackDate: "2026-08-22",
  fallbackTime: "17:00",
  providerDate: "2026-08-21",
  providerTime: "15:45",
  providerIsAuthoritative: false,
}), { date: "2026-08-22", time: "17:00" }, "E5: non-authoritative season feed must not replace editorial fallback");
assert.deepEqual(selectFixtureKickoff({
  fallbackDate: "2026-08-22",
  fallbackTime: "17:00",
  providerDate: "2026-08-23",
  providerTime: "TBD",
  providerIsAuthoritative: true,
}), { date: "2026-08-23", time: "TBD" }, "E6: authoritative TBD must suppress a stale manual time");

assert.deepEqual(
  eventKickoffInSiteTimezone("2026-08-23T01:30:00Z"),
  { date: "2026-08-22", time: "22:30" },
  "Timezone A: UTC after midnight must remain on the previous Fortaleza date"
);
assert.deepEqual(
  eventKickoffInSiteTimezone("2026-08-23T03:30:00Z"),
  { date: "2026-08-23", time: "00:30" },
  "Timezone B: kickoff after local midnight must use the new Fortaleza date"
);

for (const league of ["premier-league", "la-liga", "bundesliga", "serie-a", "liga-portugal", "ligue-1", "eredivisie", "brasileirao-serie-a"]) {
  const sample = snapshot.leagues[league]?.flatMap((round) => round.games)[0];
  assert.ok(sample?.id && sample.kickoffUtc, `${league}: representative normalized fixture is required`);
}

assert.equal(canRenderComingSoon("scheduled", true), false, "G: published scheduled fixture uses prediction card");
assert.equal(canRenderComingSoon("scheduled", false), true, "H: unpublished scheduled fixture may be coming soon");
assert.equal(isCompletedFixture("completed"), true, "I: finished fixture may enter history");
assert.equal(isNonPlayableFixture("postponed"), true, "J: postponed fixture cannot settle");

const publishedPostponed = [
  { ...fixture("published-postponed", "postponed"), published: true },
  { ...fixture("scheduled-coming-soon", "scheduled"), published: false },
].filter((item) => !isNonPlayableFixture(item.status));
assert.deepEqual(
  publishedPostponed.map(({ id }) => id),
  ["scheduled-coming-soon"],
  "K: a published prediction must not make a postponed fixture displayable"
);

const providerCases = [
  [{ name: "STATUS_SCHEDULED", state: "pre", completed: false }, "scheduled"],
  [{ name: "STATUS_HALFTIME", state: "in", completed: false }, "in-progress"],
  [{ name: "STATUS_FULL_TIME", state: "post", completed: true }, "completed"],
  [{ name: "STATUS_FINAL_AET", state: "post", completed: true }, "completed"],
  [{ name: "STATUS_POSTPONED", state: "pre", completed: false }, "postponed"],
  [{ name: "STATUS_CANCELED", state: "pre", completed: false }, "canceled"],
  [{ name: "STATUS_ABANDONED", state: "post", completed: false }, "abandoned"],
  [{ name: "STATUS_SUSPENDED", state: "in", completed: false }, "suspended"],
  [{ name: "STATUS_AWARDED", state: "post", completed: false }, "awarded"],
];

for (const [input, expected] of providerCases) {
  assert.equal(normalizeProviderStatus(input), expected, `provider normalization: ${input.name}`);
}

console.log("Fixture pipeline audit: PASS (A-K + provider normalization)");

assert.equal(isHistoryEligibleFixture({ status: "completed", homeScore: 2, awayScore: 1 }), true, "History A: completed 2-1 eligible");
assert.equal(isHistoryEligibleFixture({ status: "completed", homeScore: 0, awayScore: 0 }), true, "History B: completed 0-0 eligible");
assert.equal(isHistoryEligibleFixture({ status: "completed" }), false, "History C: missing scores excluded");
assert.equal(isHistoryEligibleFixture({ status: "completed", homeScore: 1 }), false, "History D: partial score excluded");
assert.equal(isHistoryEligibleFixture({ status: "completed", homeScore: Number.NaN, awayScore: 1 }), false, "History E: NaN excluded");
assert.equal(isHistoryEligibleFixture({ status: "completed", homeScore: -1, awayScore: 1 }), false, "History F: negative excluded");
assert.equal(isHistoryEligibleFixture({ status: "scheduled", homeScore: 2, awayScore: 1 }), false, "History G: scheduled excluded");
assert.equal(isHistoryEligibleFixture({ status: "postponed", homeScore: 2, awayScore: 1 }), false, "History H: postponed excluded");
assert.equal(isHistoryEligibleFixture({ status: "canceled", homeScore: 2, awayScore: 1 }), false, "History I: canceled excluded");
assert.equal(isValidFinalScore(2, 1), true, "History J: valid completed score may settle automatically");

console.log("History final-score audit: PASS (A-J)");
