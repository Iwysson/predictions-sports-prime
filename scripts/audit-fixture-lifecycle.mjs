import assert from "node:assert/strict";
import {
  DEFAULT_STALE_SCHEDULE_GRACE_MS,
  classifyFixture,
  isFixtureLiveNow,
  isWaitingForFixtureData,
} from "../src/lib/fixture-state.ts";
import { buildPredictionHistoryState } from "../src/lib/results.ts";
import { filterCompletedPredictions, filterTodaysPublishedPredictions } from "../src/lib/match-feed.ts";

const kickoffUtc = "2026-08-29T18:00:00Z";
const beforeKickoff = new Date("2026-08-29T17:59:59Z");
const duringMatch = new Date(Date.parse(kickoffUtc) + DEFAULT_STALE_SCHEDULE_GRACE_MS - 1);
const waitingForData = new Date(Date.parse(kickoffUtc) + DEFAULT_STALE_SCHEDULE_GRACE_MS);
const base = {
  id: "lifecycle-regression",
  slug: "lifecycle-regression",
  league: "premier-league",
  round: "Regression",
  homeTeam: "Home",
  awayTeam: "Away",
  date: "2026-08-29",
  time: "18:00",
  kickoffUtc,
  status: "published",
  fixtureStatus: "in-progress",
  title: "Lifecycle regression",
};

assert.equal(isFixtureLiveNow(base, beforeKickoff), false, "LIVE must not appear before kickoff");
assert.equal(isFixtureLiveNow(base, duringMatch), true, "LIVE must remain visible during the 110-minute window");
assert.equal(isFixtureLiveNow(base, waitingForData), false, "LIVE must expire exactly 110 minutes after kickoff");
assert.equal(classifyFixture(base, waitingForData), "stale-schedule", "A stale provider live status must not override the clock");
assert.equal(isWaitingForFixtureData(base, waitingForData), true, "The match must wait for authoritative data after 110 minutes");
assert.equal(filterTodaysPublishedPredictions([base], "2026-08-29", waitingForData).length, 0, "A 110-minute-old match must leave Today");
const history = buildPredictionHistoryState([base], waitingForData).entries;
assert.equal(history.length, 1, "A match must enter prediction history after 110 minutes while awaiting its result");
assert.equal(filterCompletedPredictions([base], waitingForData).length, 1, "Home history must receive the match after 110 minutes");

const scheduledBase = { ...base, fixtureStatus: "scheduled" };
assert.equal(filterTodaysPublishedPredictions([scheduledBase], "2026-08-29", duringMatch).length, 1, "A scheduled provider status remains in Today during the match window");
assert.equal(filterTodaysPublishedPredictions([scheduledBase], "2026-08-29", waitingForData).length, 0, "A scheduled provider status must leave Today exactly at 110 minutes");
assert.equal(buildPredictionHistoryState([scheduledBase], waitingForData).entries.length, 1, "A scheduled provider status must enter history exactly at 110 minutes");

console.log("Fixture lifecycle automation audit: PASS");
