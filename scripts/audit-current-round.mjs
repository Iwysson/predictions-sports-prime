import assert from "node:assert/strict";
import { leagues } from "../src/data/leagues.ts";
import { loadLeagueSeason } from "../src/lib/openfootball.ts";
import { getCentralCurrentRound } from "../src/lib/openfootball.ts";
import { getMatchLifecycleStatus, isRoundCompleted } from "../src/lib/match-lifecycle.ts";
import { validateLeagueRounds } from "../src/lib/data-validation.ts";

const now = new Date("2026-08-24T12:00:00Z");

const lifecycleBoundaries = [
  { expected: "upcoming", fixture: { status: "scheduled", kickoffUtc: "2026-08-24T12:00:01Z" } },
  { expected: "live", fixture: { status: "in-progress", kickoffUtc: "2026-08-24T12:00:00Z" } },
  { expected: "completed", fixture: { status: "completed", kickoffUtc: "2026-08-24T11:59:59Z" } },
  { expected: "postponed", fixture: { status: "postponed", kickoffUtc: "2026-08-24T12:00:01Z" } },
  { expected: "cancelled", fixture: { status: "canceled", kickoffUtc: "2026-08-24T12:00:01Z" } },
];
for (const boundary of lifecycleBoundaries) {
  assert.equal(getMatchLifecycleStatus(boundary.fixture, now), boundary.expected, `Lifecycle boundary failed for ${boundary.expected}`);
}

const currentRoundRegression = getCentralCurrentRound([
  { round: 1, games: [{ round: 1, date: "2026-08-23", time: "12:00", homeTeam: "A", awayTeam: "B", homeScore: 1, awayScore: 0, status: "completed" }] },
  { round: 2, games: [{ round: 2, date: "2026-08-24", time: "13:00", homeTeam: "C", awayTeam: "D", homeScore: null, awayScore: null, status: "scheduled" }] },
], now);
assert.equal(currentRoundRegression?.round, 2, "Completed round must advance to the next playable round");
console.log("Lifecycle boundary regressions: PASS");

for (const league of leagues) {
  if (league.manualOnly) continue;
  const rounds = await loadLeagueSeason(league.slug);
  if (!rounds.length) continue;
  const validation = validateLeagueRounds(rounds, { ...league, source: league.sources.fixtures } );
  const currentRound = getCentralCurrentRound(rounds, now);
  const lifecycleCounts = { upcoming: 0, live: 0, completed: 0, postponed: 0, cancelled: 0, unknown: 0 };

  for (const round of rounds) {
    for (const game of round.games) {
      const lifecycle = getMatchLifecycleStatus(game, now);
      lifecycleCounts[lifecycle] += 1;
    }
  }

  const roundCompleted = currentRound ? isRoundCompleted(currentRound.games) : false;
  console.log([
    league.name,
    `Detected round: ${currentRound?.round ?? "none"}`,
    `Fixtures: ${rounds.flatMap((round) => round.games).length}`,
    `Upcoming: ${lifecycleCounts.upcoming}`,
    `Live: ${lifecycleCounts.live}`,
    `Completed: ${lifecycleCounts.completed}`,
    `Postponed: ${lifecycleCounts.postponed}`,
    `Cancelled: ${lifecycleCounts.cancelled}`,
    `Unknown: ${lifecycleCounts.unknown}`,
    `Round completed?: ${roundCompleted ? "yes" : "no"}`,
    `Status: ${validation.valid ? "PASS" : "FAIL"}`,
  ].join(" | "));

  assert.ok(validation.valid, `${league.name}: fixture validation failed`);
  if (currentRound && roundCompleted) {
    throw new Error(`${league.name}: completed round selected as current round`);
  }
}

console.log("Current round audit: PASS");
