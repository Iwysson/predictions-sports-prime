import { readFile, rename, writeFile } from "node:fs/promises";
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
import { parsePredictionMarket } from "../src/lib/prediction-results.ts";

const outputPath = resolve("src/data/fixtures.snapshot.json");
const marketResultsPath = resolve("src/data/market-results.snapshot.json");
const previous = JSON.parse(await readFile(outputPath, "utf8"));
const previousMarketResults = JSON.parse(await readFile(marketResultsPath, "utf8"));
const snapshot = {
  version: 1,
  generatedAt: new Date().toISOString(),
  siteTimezone: "America/Fortaleza",
  displayTimezonePolicy: "league-local",
  leagues: {},
  predictionIds: {},
  leagueUpdatedAt: {},
  manualFixtures: previous.manualFixtures ?? {},
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
  if (typeof source !== "string" || source.trim() === "") {
    return null;
  }
  if (source.startsWith("/")) {
    return readFile(resolve("public", source.replace(/^\/+/, "")), "utf8");
  }
  const response = await fetch(source, { headers: { Accept: "text/plain" }, cache: "no-store" });
  if (!response.ok) throw new Error(`${source}: ${response.status}`);
  return response.text();
}

await Promise.all(leagues.map(async (league) => {
  const leaguePredictions = matches.filter((match) => match.league === league.slug);
  try {
    const text = await sourceText(league.sources.fixtures);
    if (text === null && !league.liveDataId) {
      console.log(`${league.name}: skipped (no automatic fixture feed configured)`);
      continue;
    }
    // Knockout competitions do not have a compatible season registry. Their
    // published editorial fixtures provide the matching base while ESPN remains
    // authoritative for kickoff state, provider ID and final score.
    const base = text === null
      ? [{
          round: 1,
          games: leaguePredictions.map((prediction) => ({
            round: 1,
            date: prediction.date,
            time: prediction.time,
            homeTeam: prediction.homeTeam,
            awayTeam: prediction.awayTeam,
            homeScore: null,
            awayScore: null,
            status: "scheduled",
            dataSource: "snapshot",
          })),
        }]
      : parseFootballSeason(text);
    const espnRounds = await hydrateLiveResults(league.slug, base);
    const rounds = await hydrateTheSportsDb(league.slug, espnRounds);
    const previousGames = (previous.leagues?.[league.slug] ?? []).flatMap((round) => round.games);
    const previousById = new Map(previousGames.map((game) => [game.id, game]));
    for (const fixture of rounds.flatMap((round) => round.games)) {
      const saved = (fixture.id ? previousById.get(fixture.id) : undefined) ?? previousGames
        .filter((game) => teamNamesMatch(game.homeTeam, fixture.homeTeam) && teamNamesMatch(game.awayTeam, fixture.awayTeam))
        .sort((left, right) =>
          Math.abs(Date.parse(`${left.date}T12:00:00Z`) - Date.parse(`${fixture.date}T12:00:00Z`)) -
          Math.abs(Date.parse(`${right.date}T12:00:00Z`) - Date.parse(`${fixture.date}T12:00:00Z`))
        )[0];
      const dateChanged = saved && saved.date !== fixture.date;
      // Provider feeds are occasionally updated out of order. Once a valid
      // final score has been observed it is immutable and must never be rolled
      // back by a stale scheduled/live response from another provider.
      if (saved?.status === "completed" && Number.isInteger(saved.homeScore) && Number.isInteger(saved.awayScore) &&
          (fixture.status !== "completed" || !Number.isInteger(fixture.homeScore) || !Number.isInteger(fixture.awayScore))) {
        fixture.status = "completed";
        fixture.homeScore = saved.homeScore;
        fixture.awayScore = saved.awayScore;
        fixture.id = saved.id;
        fixture.dataSource = saved.dataSource;
      }
      if (fixture.status === "scheduled" && (saved?.status === "rescheduled" || dateChanged)) {
        fixture.status = "rescheduled";
      }
    }
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
    snapshot.leagueUpdatedAt[league.slug] = snapshot.generatedAt;
    console.log(`${league.name}: ${rounds.flatMap((round) => round.games).length} fixtures, ${leaguePredictions.length} predictions linked`);
  } catch (error) {
    const savedRounds = previous.leagues?.[league.slug];
    if (!savedRounds?.length) throw error;
    snapshot.leagues[league.slug] = savedRounds;
    snapshot.leagueUpdatedAt[league.slug] = previous.leagueUpdatedAt?.[league.slug] ?? previous.generatedAt;
    for (const [key, id] of Object.entries(previous.predictionIds ?? {})) {
      if (key.startsWith(`${league.slug}:`)) snapshot.predictionIds[key] = id;
    }
    // Recover links for newly published predictions from the last valid
    // snapshot. One failing league must not abort result updates from every
    // healthy league.
    for (const prediction of leaguePredictions) {
      const key = `${league.slug}:${prediction.slug}`;
      if (snapshot.predictionIds[key]) continue;
      const savedFixture = findPredictionFixture(savedRounds, prediction);
      if (savedFixture?.id) snapshot.predictionIds[key] = savedFixture.id;
    }
    console.error(`SOURCE_REFRESH_FAILED ${league.slug}: ${error instanceof Error ? error.message : String(error)}`);
  }
}));

function cornerValue(statistics) {
  const item = statistics?.find((stat) => /^(wonCorners|cornerKicks|corners)$/i.test(stat.name ?? stat.label ?? ""));
  if (!item) return null;
  const value = Number(item.value ?? item.displayValue);
  return Number.isInteger(value) && value >= 0 ? value : null;
}

const marketResults = { ...previousMarketResults };
const cornerPredictions = matches.filter((match) =>
  parsePredictionMarket(match.mainPrediction ?? "").legs.some((leg) => leg.kind === "corners")
);
await Promise.all(cornerPredictions.map(async (prediction) => {
  const fixtureId = snapshot.predictionIds[`${prediction.league}:${prediction.slug}`];
  if (!fixtureId || fixtureId.startsWith("tsdb:") || fixtureId.startsWith("official:")) return;
  const fixture = Object.values(snapshot.leagues).flatMap((rounds) => rounds ?? [])
    .flatMap((round) => round.games).find((game) => game.id === fixtureId);
  if (fixture?.status !== "completed") return;
  const key = `${prediction.league}:${prediction.slug}`;
  if (marketResults[key]) return;
  try {
    const source = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagues.find((item) => item.slug === prediction.league)?.liveDataId}/summary?event=${fixtureId}`;
    const response = await fetch(source, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const teams = data.boxscore?.teams ?? [];
    const home = teams.find((team) => team.homeAway === "home") ?? teams[0];
    const away = teams.find((team) => team.homeAway === "away") ?? teams[1];
    const homeCorners = cornerValue(home?.statistics);
    const awayCorners = cornerValue(away?.statistics);
    if (homeCorners === null || awayCorners === null) throw new Error("corner statistics unavailable");
    marketResults[key] = { homeCorners, awayCorners, source, capturedAt: snapshot.generatedAt };
    console.log(`${prediction.slug}: captured corners ${homeCorners}-${awayCorners}`);
  } catch (error) {
    console.error(`MARKET_DATA_REFRESH_FAILED ${prediction.slug}: ${error instanceof Error ? error.message : String(error)}`);
  }
}));

const automaticPredictions = matches.filter((match) => {
  const league = leagues.find((item) => item.slug === match.league);
  return Boolean(league?.sources.fixtures || league?.liveDataId);
});
if (Object.keys(snapshot.predictionIds).length !== automaticPredictions.length) {
  throw new Error(`Expected ${automaticPredictions.length} automatic prediction links, produced ${Object.keys(snapshot.predictionIds).length}.`);
}

// Frequent polling is important around full time, but generatedAt alone must
// not trigger a commit and deployment every 15 minutes. Persist immediately
// when fixture data changes and otherwise write a twice-daily freshness
// heartbeat so snapshot-age validation remains meaningful.
const fixtureDataChanged =
  JSON.stringify(snapshot.leagues) !== JSON.stringify(previous.leagues) ||
  JSON.stringify(snapshot.predictionIds) !== JSON.stringify(previous.predictionIds);
const marketDataChanged = JSON.stringify(marketResults) !== JSON.stringify(previousMarketResults);
const previousGeneratedAt = Date.parse(previous.generatedAt ?? "");
const heartbeatDue =
  !Number.isFinite(previousGeneratedAt) ||
  Date.now() - previousGeneratedAt >= 12 * 60 * 60 * 1000;

if (!fixtureDataChanged && !marketDataChanged && !heartbeatDue) {
  console.log(`Fixture data unchanged; snapshot write skipped (${snapshot.generatedAt}).`);
  console.log(`Previous snapshot: ${previous.generatedAt}`);
  process.exit(0);
}

const temporaryPath = `${outputPath}.next`;
await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
await rename(temporaryPath, outputPath);
if (marketDataChanged) {
  const temporaryMarketPath = `${marketResultsPath}.next`;
  await writeFile(temporaryMarketPath, `${JSON.stringify(marketResults, null, 2)}\n`, "utf8");
  await rename(temporaryMarketPath, marketResultsPath);
}
console.log(`Fixture snapshot updated: ${snapshot.generatedAt}`);
console.log(`Provider differences retained for editorial review: ${changes.length}`);
for (const change of changes) console.log(`  ${change.prediction}: ${change.from} -> ${change.to}`);
if (previous.generatedAt) console.log(`Previous snapshot: ${previous.generatedAt}`);
