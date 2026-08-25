import snapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };
import { leagues } from "../src/data/leagues.ts";
import { matches } from "../src/data/matches.ts";
import { resolveCompetitionRounds } from "../src/lib/match-lifecycle.ts";
import { classifyFixture } from "../src/lib/fixture-state.ts";

const now = process.env.FIXTURE_AUDIT_NOW
  ? new Date(process.env.FIXTURE_AUDIT_NOW)
  : new Date(snapshot.generatedAt);

console.log(`Fixture round state audit @ ${now.toISOString()}`);
console.log("League | Current | Current fixtures | Next | Next fixtures | Completed included | Postponed included | Stale schedules | Published unmatched");

let violations = 0;
for (const league of leagues) {
  const rounds = snapshot.leagues[league.slug] ?? [];
  const resolved = resolveCompetitionRounds(rounds, now);
  const current = resolved.currentFixtures ?? [];
  const next = resolved.nextFixtures ?? [];
  const active = [...current, ...next];
  const completedIncluded = active.filter((fixture) => classifyFixture(fixture, now) === "completed").length;
  const postponedIncluded = active.filter((fixture) => classifyFixture(fixture, now) === "postponed").length;
  const staleSchedules = rounds.flatMap((round) => round.games)
    .filter((fixture) => classifyFixture(fixture, now) === "stale-schedule").length;
  const publishedUnmatched = matches
    .filter((match) => match.league === league.slug && match.status === "published")
    .filter((match) => Boolean(league.sources.fixtures))
    .filter((match) => !snapshot.predictionIds[`${league.slug}:${match.slug}`]).length;
  violations += completedIncluded + postponedIncluded;
  console.log(`${league.name} | ${resolved.currentRound?.round ?? "-"} | ${current.length} | ${resolved.nextRound?.round ?? "-"} | ${next.length} | ${completedIncluded} | ${postponedIncluded} | ${staleSchedules} | ${publishedUnmatched}`);
}

if (violations) throw new Error(`ROUND_STATE_INVALID: ${violations} active-feed violations`);
console.log("Fixture round state audit: PASS");
