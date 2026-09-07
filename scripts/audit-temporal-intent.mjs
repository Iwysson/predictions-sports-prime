import { getMatchTemporalIntent } from "../src/lib/search-intent-v2.ts";

const kickoff = Date.parse("2026-09-10T18:00:00Z");
const match = { status: "published", fixtureStatus: "scheduled", kickoffUtc: new Date(kickoff).toISOString(), date: "2026-09-10", time: "15:00", timeConfirmed: true };
const checks = [
  ["UPCOMING_LONG", kickoff - 8 * 24 * 60 * 60 * 1000],
  ["UPCOMING_72H", kickoff - 60 * 60 * 60 * 1000],
  ["TOMORROW", kickoff - 24 * 60 * 60 * 1000],
  ["TODAY", kickoff - 5 * 60 * 1000],
  ["HISTORICAL", kickoff + 60 * 1000],
];
const errors = checks.flatMap(([expected, now]) => getMatchTemporalIntent(match, new Date(now)) === expected ? [] : [`${expected} boundary failed`]);
if (getMatchTemporalIntent({ ...match, fixtureStatus: "in-progress" }, new Date(kickoff + 60 * 1000)) !== "LIVE") errors.push("LIVE boundary failed");
if (getMatchTemporalIntent({ ...match, fixtureStatus: "completed" }, new Date(kickoff + 120 * 60 * 1000)) !== "FINAL") errors.push("FINAL boundary failed");
console.log("Temporal intent states: UPCOMING_LONG, UPCOMING_72H, TOMORROW, TODAY, LIVE, FINAL, HISTORICAL.");
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); process.exitCode = 1; }
else console.log("Temporal intent audit: PASS");
