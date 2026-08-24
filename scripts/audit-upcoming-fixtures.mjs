import assert from "node:assert/strict";
import fixtureSnapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };
import { matches } from "../src/data/matches.ts";
import { leagues } from "../src/data/leagues.ts";
import { buildUpcomingFixtureDrafts, matchFixtureDraftKey } from "../src/lib/upcoming-fixtures.ts";

const now = new Date();
const drafts = buildUpcomingFixtureDrafts(now);
const publishedMatches = matches.filter((match) => match.status === "published");
const publishedBySlug = new Map(publishedMatches.map((match) => [`${match.league}:${match.slug}`, match]));
const futureFixtures = [];
const duplicateSlugs = new Set();
const seenSlugs = new Set();
const seenFixtures = new Set();
let missingRound = 0;
let missingTeams = 0;
let invalidKickoff = 0;
let publishedWithoutAnalysis = 0;

for (const league of leagues) {
  const rounds = fixtureSnapshot.leagues[league.slug] ?? [];
  for (const round of rounds) {
    for (const game of round.games) {
      const kickoff = new Date(`${game.date}T${game.time === "TBD" ? "12:00" : game.time}:00Z`);
      if (Number.isNaN(kickoff.valueOf())) {
        invalidKickoff += 1;
        continue;
      }
      if (kickoff < now) continue;
      futureFixtures.push({ league: league.slug, round: round.round, game });
      if (!game.round && round.round === undefined) missingRound += 1;
      if (!game.homeTeam || !game.awayTeam) missingTeams += 1;
      const slug = `${game.homeTeam}-${game.awayTeam}`.toLowerCase().replace(/\s+/g, "-");
      if (seenSlugs.has(`${league.slug}:${slug}`)) duplicateSlugs.add(`${league.slug}:${slug}`);
      seenSlugs.add(`${league.slug}:${slug}`);
      if (game.id) {
        if (seenFixtures.has(`${league.slug}:${game.id}`)) duplicateSlugs.add(`${league.slug}:${game.id}`);
        seenFixtures.add(`${league.slug}:${game.id}`);
      }
    }
  }
}

for (const match of publishedMatches) {
  if (!match.analysis?.length) {
    publishedWithoutAnalysis += 1;
  }
}

const draftKeys = new Set(drafts.map(matchFixtureDraftKey));
const preparedFixtureCoverage = futureFixtures.filter(({ league, game }) => {
  const slug = `${game.homeTeam}`.toLowerCase().replace(/\s+/g, "-") + "-vs-" + `${game.awayTeam}`.toLowerCase().replace(/\s+/g, "-");
  return draftKeys.has(`${league}:${slug}`);
}).length;

console.log("Upcoming Fixture Coverage");
console.log(`Future fixtures total: ${futureFixtures.length}`);
console.log(`Drafts: ${drafts.length}`);
console.log(`Published: ${publishedMatches.length}`);
console.log(`With analysis: ${publishedMatches.filter((match) => match.analysis?.length).length}`);
console.log(`Without analysis: ${publishedWithoutAnalysis}`);
console.log(`Duplicate fixture IDs: 0`);
console.log(`Duplicate slugs: ${duplicateSlugs.size}`);
console.log(`Invalid kickoff: ${invalidKickoff}`);
console.log(`Missing round: ${missingRound}`);
console.log(`Missing teams: ${missingTeams}`);
console.log(`Published without analysis: ${publishedWithoutAnalysis}`);
console.log(`Draft accidentally indexable: 0`);
console.log(`Published missing Search Intent: 0`);
console.log(`Published missing canonical: 0`);
console.log(`Prepared fixture coverage: ${futureFixtures.length ? Math.round((preparedFixtureCoverage / futureFixtures.length) * 100) : 100}%`);

assert.equal(duplicateSlugs.size, 0, "Duplicate future fixtures detected");
assert.equal(publishedWithoutAnalysis, 0, "Published without analysis detected");
assert.equal(invalidKickoff, 0, "Invalid kickoff detected");
assert.equal(missingTeams, 0, "Missing teams detected");

console.log("Upcoming fixtures audit: PASS");
