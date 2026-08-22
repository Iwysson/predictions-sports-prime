import assert from "node:assert/strict";
import snapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };
import { leagues } from "../src/data/leagues.ts";
import { matches } from "../src/data/matches.ts";
import { validateLeagueRounds } from "../src/lib/data-validation.ts";
import { hydratePrediction } from "../src/lib/live-predictions.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";

assert.equal(snapshot.version, 1, "Unsupported fixture snapshot version.");
assert.equal(snapshot.siteTimezone, "America/Fortaleza", "Unexpected fixture timezone.");
assert.equal(snapshot.displayTimezonePolicy, "league-local", "Fixtures must be displayed in the competition timezone.");
assert.ok(Number.isFinite(Date.parse(snapshot.generatedAt)), "Snapshot generatedAt is invalid.");
assert.ok(Date.now() - Date.parse(snapshot.generatedAt) < 24 * 60 * 60 * 1000, "Fixture snapshot is older than 24 hours.");

const ids = new Set();
for (const league of leagues) {
  const rounds = snapshot.leagues[league.slug];
  assert.ok(rounds?.length, `${league.name}: missing fixture snapshot.`);
  const result = validateLeagueRounds(rounds, {
    slug: league.slug,
    source: league.sources.fixtures,
    expectedClubs: league.expectedClubs,
    expectedGamesPerRound: league.expectedGamesPerRound,
    label: league.name,
  });
  assert.equal(result.valid, true, `${league.name}: ${result.errors.join(" | ")}`);
  for (const game of rounds.flatMap((round) => round.games)) {
    assert.ok(game.id, `${league.name}: fixture without provider ID.`);
    assert.ok(!ids.has(`${league.slug}:${game.id}`), `${league.name}: duplicate provider ID ${game.id}.`);
    ids.add(`${league.slug}:${game.id}`);
    assert.ok(game.kickoffUtc && Number.isFinite(Date.parse(game.kickoffUtc)), `${league.name}: invalid UTC kickoff.`);
    assert.ok(game.timeConfirmed === false ? game.time === "TBD" : /^\d{2}:\d{2}$/.test(game.time), `${league.name}: invalid confirmation/time pair.`);
  }
}

for (const match of matches) {
  assert.ok(snapshot.predictionIds[`${match.league}:${match.slug}`], `${match.slug}: prediction is not linked to a provider fixture ID.`);
  const hydrated = await hydratePrediction(toMatchPreview(match));
  if (match.date) assert.equal(hydrated.date, match.date, `${match.slug}: provider overwrote verified editorial date.`);
  if (match.time && match.time !== "TBD") assert.equal(hydrated.time, match.time, `${match.slug}: provider overwrote verified editorial time.`);
}

console.log(`Fixture snapshot validation: PASS (${ids.size} fixtures, ${matches.length} predictions)`);
