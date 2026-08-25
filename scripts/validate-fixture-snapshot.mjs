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
  if (!league.sources.fixtures) continue;
  const rounds = snapshot.leagues[league.slug];
  const sourceUpdatedAt = snapshot.leagueUpdatedAt?.[league.slug] ?? snapshot.generatedAt;
  assert.ok(Number.isFinite(Date.parse(sourceUpdatedAt)), `${league.name}: invalid source freshness metadata.`);
  if (Date.now() - Date.parse(sourceUpdatedAt) >= 48 * 60 * 60 * 1000) {
    console.warn(`SOURCE_DATA_STALE ${league.slug}: ${sourceUpdatedAt}`);
  }
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
  if (!leagues.find((league) => league.slug === match.league)?.sources.fixtures) continue;
  assert.ok(snapshot.predictionIds[`${match.league}:${match.slug}`], `${match.slug}: prediction is not linked to a provider fixture ID.`);
  const hydrated = await hydratePrediction(toMatchPreview(match));
  const providerFixture = snapshot.leagues[match.league]
    .flatMap((round) => round.games)
    .find((game) => game.id === snapshot.predictionIds[`${match.league}:${match.slug}`]);
  assert.equal(hydrated.date, providerFixture.date, `${match.slug}: reliable provider date was not retained.`);
  assert.equal(hydrated.time, providerFixture.time, `${match.slug}: reliable provider kickoff was not retained.`);
}

const hullUnited = await hydratePrediction(toMatchPreview(matches.find((match) => match.slug === "hull-city-vs-manchester-united")));
assert.equal(hullUnited.time, "08:30", "Hull City vs Manchester United must remain at 08:30 in Brazil.");

console.log(`Fixture snapshot validation: PASS (${ids.size} fixtures, ${matches.length} predictions)`);
