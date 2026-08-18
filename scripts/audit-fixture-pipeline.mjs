import assert from "node:assert/strict";
import {
  canRenderComingSoon,
  findCurrentOrNextDatedRound,
  findFirstActiveRound,
  filterPlayableBeforeLimit,
  fixtureStatusCategory,
  isCompletedFixture,
  isHistoryEligibleFixture,
  isValidFinalScore,
  isNonPlayableFixture,
  normalizeProviderStatus,
} from "../src/lib/fixture-status.ts";

const fixture = (id, status, round = 1) => ({ id, status, round });

assert.equal(fixtureStatusCategory("scheduled"), "upcoming", "A: scheduled must be upcoming");
assert.equal(canRenderComingSoon("postponed", false), false, "B: postponed must not be coming soon");
assert.equal(canRenderComingSoon("canceled", false), false, "C: canceled must not be coming soon");
assert.equal(fixtureStatusCategory("completed"), "completed", "D: finished must not be upcoming");

const roundAdvance = filterPlayableBeforeLimit([
  fixture("round-1-a", "postponed", 1),
  fixture("round-1-b", "postponed", 1),
  fixture("round-2-a", "scheduled", 2),
  fixture("round-2-b", "scheduled", 2),
], 2);
assert.deepEqual(roundAdvance.map(({ id }) => id), ["round-2-a", "round-2-b"], "E/F: filter non-playable before limit");
assert.equal(findFirstActiveRound([
  { round: 1, games: [fixture("round-1-a", "postponed")] },
  { round: 2, games: [fixture("round-2-a", "scheduled", 2)] },
])?.round, 2, "E: postponed round must not block the next active round");
assert.equal(findCurrentOrNextDatedRound([
  { round: 1, games: [{ date: "2026-08-09", status: "scheduled" }] },
  { round: 3, games: [{ date: "2026-08-22", status: "scheduled" }] },
], "2026-08-18")?.round, 3, "E2: stale scheduled fixtures must not block the current dated round");

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
