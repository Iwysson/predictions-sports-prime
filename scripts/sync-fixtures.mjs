import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { leagues } from "../src/data/leagues.ts";
import { matches } from "../src/data/matches.ts";
import {
  findFixtureByTeams,
  hydrateLiveResults,
  hydrateTheSportsDb,
  parseFootballSeason,
  teamNamesMatch,
} from "../src/lib/openfootball.ts";
import { validateLeagueRounds } from "../src/lib/data-validation.ts";

const outputPath = resolve("src/data/fixtures.snapshot.json");
const previous = JSON.parse(await readFile(outputPath, "utf8"));
const snapshot = {
  version: 1,
  generatedAt: new Date().toISOString(),
  siteTimezone: "America/Fortaleza",
  displayTimezonePolicy: "league-local",
  leagues: {},
  predictionIds: {},
};
const changes = [];

function findPredictionFixture(rounds, prediction) {
  const games = rounds.flatMap((round) => round.games).filter((game) => game.id);
  const candidates = games.filter((game) =>
    (teamNamesMatch(game.homeTeam, prediction.homeTeam) && teamNamesMatch(game.awayTeam, prediction.awayTeam)) ||
    (teamNamesMatch(game.homeTeam, prediction.awayTeam) && teamNamesMatch(game.awayTeam, prediction.homeTeam))
  );
  const referenceDate = prediction.date || prediction.publishedAt?.slice(0, 10) || "0000-00-00";
  const referenceTime = Date.parse(`${referenceDate}T12:00:00Z`);
  return candidates.sort((left, right) =>
    Math.abs(Date.parse(`${left.date}T12:00:00Z`) - referenceTime) -
    Math.abs(Date.parse(`${right.date}T12:00:00Z`) - referenceTime)
  )[0];
}

async function sourceText(source) {
  if (source.startsWith("/")) {
    return readFile(resolve("public", source.replace(/^\/+/, "")), "utf8");
  }
  const response = await fetch(source, { headers: { Accept: "text/plain" }, cache: "no-store" });
  if (!response.ok) throw new Error(`${source}: ${response.status}`);
  return response.text();
}

for (const league of leagues) {
  const base = parseFootballSeason(await sourceText(league.sources.fixtures));
  const espnRounds = await hydrateLiveResults(league.slug, base);
  const rounds = await hydrateTheSportsDb(league.slug, espnRounds);
  const validation = validateLeagueRounds(rounds, {
    slug: league.slug,
    source: league.sources.fixtures,
    expectedClubs: league.expectedClubs,
    expectedGamesPerRound: league.expectedGamesPerRound,
    label: league.name,
  });
  if (!validation.valid) {
    throw new Error(`${league.name}: ${validation.errors.join(" | ")}`);
  }
  const leaguePredictions = matches.filter((match) => match.league === league.slug);
  const linkedIds = new Set();
  for (const prediction of leaguePredictions) {
    const fixture = findPredictionFixture(rounds, prediction);
    if (!fixture?.id) {
      const candidates = rounds.flatMap((round) => round.games)
        .filter((game) => game.homeTeam.includes(prediction.homeTeam.split(" ")[0]) || game.awayTeam.includes(prediction.awayTeam.split(" ")[0]))
        .slice(0, 8)
        .map((game) => `${game.homeTeam} vs ${game.awayTeam} [${game.id ?? "no id"}]`);
      throw new Error(`${league.name}: no authoritative fixture ID for ${prediction.slug}. Candidates: ${candidates.join(" | ")}`);
    }
    snapshot.predictionIds[`${league.slug}:${prediction.slug}`] = fixture.id;
    linkedIds.add(fixture.id);
    if (prediction.date !== fixture.date || prediction.time !== fixture.time) {
      changes.push({
        prediction: prediction.slug,
        from: `${prediction.date || "unknown"} ${prediction.time || "TBD"}`,
        to: `${fixture.date} ${fixture.time}`,
      });
    }
  }
  const generatedDay = snapshot.generatedAt.slice(0, 10);
  const windowStart = new Date(`${generatedDay}T00:00:00Z`);
  windowStart.setUTCDate(windowStart.getUTCDate() - 30);
  const windowEnd = new Date(`${generatedDay}T00:00:00Z`);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + 90);
  snapshot.leagues[league.slug] = rounds.filter((round) =>
    round.games.some((game) => linkedIds.has(game.id)) ||
    round.games.some((game) => {
      const date = new Date(`${game.date}T00:00:00Z`);
      return date >= windowStart && date <= windowEnd;
    })
  );
  console.log(`${league.name}: ${rounds.flatMap((round) => round.games).length} fixtures, ${leaguePredictions.length} predictions linked`);
}

if (Object.keys(snapshot.predictionIds).length !== matches.length) {
  throw new Error(`Expected ${matches.length} prediction links, produced ${Object.keys(snapshot.predictionIds).length}.`);
}

await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Fixture snapshot updated: ${snapshot.generatedAt}`);
console.log(`Provider differences retained for editorial review: ${changes.length}`);
for (const change of changes) console.log(`  ${change.prediction}: ${change.from} -> ${change.to}`);
if (previous.generatedAt) console.log(`Previous snapshot: ${previous.generatedAt}`);
