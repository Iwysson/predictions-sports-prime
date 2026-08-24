import assert from "node:assert/strict";
import { matches } from "../src/data/matches.ts";
import { normalizeMatchTime, resolveMatchTimezone } from "../src/lib/match-time.ts";
import { leaguesBySlug } from "../src/data/leagues.ts";

const fixtures = matches.filter((match) => match.status === "published");
let invalidKickoff = 0;
let tbdKickoff = 0;
let unknownTimezone = 0;
let competitionFallback = 0;
let confirmed = 0;
let derived = 0;
let mismatchRisk = 0;

for (const match of fixtures) {
  const normalized = normalizeMatchTime(match);
  const resolved = resolveMatchTimezone(match);

  if (!normalized) {
    if (match.time === "TBD" || !match.time) {
      tbdKickoff += 1;
    } else {
      invalidKickoff += 1;
    }
    continue;
  }

  if (normalized.confidence === "confirmed") confirmed += 1;
  if (normalized.confidence === "derived") derived += 1;
  if (!normalized.timezone) unknownTimezone += 1;
  if (resolved.timezoneSource === "competition") competitionFallback += 1;

  const leagueTimezone = leaguesBySlug[match.league]?.timezone ?? null;
  if (leagueTimezone && normalized.timezone && leagueTimezone !== normalized.timezone) {
    mismatchRisk += 1;
  }
}

console.log("Match Time Health");
console.log(`Fixtures: ${fixtures.length}`);
console.log(`UTC normalized: ${fixtures.length - invalidKickoff}`);
console.log(`Venue/city timezone: 0`);
console.log(`Competition fallback: ${competitionFallback}`);
console.log(`Unknown timezone: ${unknownTimezone}`);
console.log(`TBD kickoff: ${tbdKickoff}`);
console.log(`Invalid kickoff: ${invalidKickoff}`);
console.log(`Cross-surface mismatches: ${mismatchRisk}`);

assert.equal(invalidKickoff, 0, "Invalid kickoff detected");
assert.equal(unknownTimezone, 0, "Unknown timezone detected");
assert.equal(mismatchRisk, 0, "Cross-surface time mismatch detected");

console.log("Match time audit: PASS");
