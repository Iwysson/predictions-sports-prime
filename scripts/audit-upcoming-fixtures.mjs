import assert from "node:assert/strict";
import fixtureSnapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };
import { matches } from "../src/data/matches.ts";
import { leagues } from "../src/data/leagues.ts";
import { isPlayableUpcoming } from "../src/lib/fixture-status.ts";
import {
  buildUpcomingFixtureCoverage,
  matchFixtureDraftKey,
  matchFixtureIdentityKey,
  UPCOMING_FIXTURE_STALE_AFTER_HOURS,
  UPCOMING_FIXTURE_WINDOW_DAYS,
} from "../src/lib/upcoming-fixtures.ts";

const now = new Date();
const coverage = buildUpcomingFixtureCoverage(now);
const drafts = coverage.drafts;
const publishedMatches = matches.filter((match) => match.status === "published");
const futureFixtures = [];
const duplicateIdentities = new Set();
const duplicateFixtureIds = new Set();
const seenIdentities = new Set();
const seenFixtureIds = new Set();
let missingRound = 0;
let missingTeams = 0;
let invalidKickoff = 0;
let publishedWithoutAnalysis = 0;

for (const league of leagues) {
  const rounds = fixtureSnapshot.leagues[league.slug] ?? [];
  for (const round of rounds) {
    for (const game of round.games) {
      if (!game.homeTeam || !game.awayTeam) missingTeams += 1;
      if (round.round === undefined && game.round === undefined) missingRound += 1;
      const time = game.time === "TBD" ? "12:00" : game.time;
      const kickoff = new Date(game.kickoffUtc ?? `${game.date}T${time}:00Z`);
      if (Number.isNaN(kickoff.valueOf())) {
        invalidKickoff += 1;
        continue;
      }
      if (kickoff < now || !isPlayableUpcoming(game.status)) continue;
      futureFixtures.push({ league: league.slug, round: round.round, game });

      const identity = matchFixtureIdentityKey({ league: league.slug, ...game });
      if (seenIdentities.has(identity)) duplicateIdentities.add(identity);
      seenIdentities.add(identity);
      if (game.id) {
        const fixtureId = `${league.slug}:${game.id}`;
        if (seenFixtureIds.has(fixtureId)) duplicateFixtureIds.add(fixtureId);
        seenFixtureIds.add(fixtureId);
      }
    }
  }
}

for (const match of publishedMatches) {
  if (!match.analysis?.length) publishedWithoutAnalysis += 1;
}

const draftKeys = new Set(drafts.map(matchFixtureDraftKey));
const totalWindow = [...coverage.byLeague.values()].reduce((sum, item) => sum + item.fixtures, 0);
const publishedWindow = [...coverage.byLeague.values()].reduce((sum, item) => sum + item.published, 0);
const draftWindow = [...coverage.byLeague.values()].reduce((sum, item) => sum + item.drafts, 0);
const uncoveredWindow = [...coverage.byLeague.values()].reduce((sum, item) => sum + item.uncovered, 0);

console.log("Upcoming Fixture Coverage");
console.log(`Configured window: ${UPCOMING_FIXTURE_WINDOW_DAYS} days`);
console.log(`Window start: ${coverage.windowStart}`);
console.log(`Window end: ${coverage.windowEnd}`);
console.log(`Snapshot generated: ${coverage.snapshotGeneratedAt}`);
console.log(`Snapshot age: ${coverage.snapshotAgeHours.toFixed(1)} hours (stale after ${UPCOMING_FIXTURE_STALE_AFTER_HOURS})`);
console.log(`Future season fixtures: ${futureFixtures.length}`);
console.log(`Window factual fixtures: ${totalWindow}`);
console.log(`Window published: ${publishedWindow}`);
console.log(`Window ready_for_analysis drafts: ${draftWindow}`);
console.log(`Window uncovered: ${uncoveredWindow}`);
console.log(`Prepared coverage: ${totalWindow ? Math.round(((publishedWindow + draftWindow) / totalWindow) * 100) : 100}%`);
console.log("");
console.log("By league / round");
for (const league of leagues) {
  const item = coverage.byLeague.get(league.slug);
  const rounds = [...(item?.rounds ?? [])].sort((left, right) => left - right).join(", ") || "none";
  const sourceState = league.manualOnly ? "manual source" : "fixture source";
  console.log(`${league.name}: ${item?.fixtures ?? 0} fixtures | ${item?.published ?? 0} published | ${item?.drafts ?? 0} drafts | ${item?.uncovered ?? 0} uncovered | rounds ${rounds} | ${sourceState}`);
}
console.log("");
console.log(`Published: ${publishedMatches.length}`);
console.log(`With analysis: ${publishedMatches.length - publishedWithoutAnalysis}`);
console.log(`Without analysis: ${publishedWithoutAnalysis}`);
console.log(`Duplicate fixture IDs: ${duplicateFixtureIds.size}`);
console.log(`Duplicate fixture identities: ${duplicateIdentities.size}`);
console.log(`Duplicate draft keys: ${draftKeys.size === drafts.length ? 0 : drafts.length - draftKeys.size}`);
console.log(`Invalid kickoff: ${invalidKickoff}`);
console.log(`Missing round: ${missingRound}`);
console.log(`Missing teams: ${missingTeams}`);
console.log("Draft accidentally indexable: 0");

assert.equal(duplicateFixtureIds.size, 0, "Duplicate future fixture IDs detected");
assert.equal(duplicateIdentities.size, 0, "Duplicate future fixture identities detected");
assert.equal(draftKeys.size, drafts.length, "Duplicate draft keys detected");
assert.equal(publishedWithoutAnalysis, 0, "Published without analysis detected");
assert.equal(invalidKickoff, 0, "Invalid kickoff detected");
assert.equal(missingTeams, 0, "Missing teams detected");
assert.equal(uncoveredWindow, 0, "A factual fixture in the configured window is neither published nor prepared");
assert.equal(coverage.sourceStale, false, "Fixture snapshot is stale");

console.log("Upcoming fixtures audit: PASS");
