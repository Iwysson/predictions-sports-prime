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
import { normalizeMatchTime } from "../src/lib/match-time.ts";

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
  manualFixtures: structuredClone(previous.manualFixtures ?? {}),
};
const changes = [];

function findPredictionFixture(rounds, prediction) {
  const games = rounds.flatMap((round) => round.games);
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

const fotmobDailyPromises = new Map();
function fetchFotmobDay(date) {
  if (!fotmobDailyPromises.has(date)) {
    const compactDate = date.replace(/-/g, "");
    const url = `https://www.fotmob.com/api/data/matches?date=${compactDate}`;
    fotmobDailyPromises.set(date, fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    }).then(async (response) => {
      if (!response.ok) throw new Error(`FotMob matches HTTP ${response.status}`);
      return response.json();
    }));
  }
  return fotmobDailyPromises.get(date);
}

function canonicalTeamSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function nearbyIsoDates(...values) {
  const dates = new Set();
  for (const value of values) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) continue;
    const base = new Date(`${value}T12:00:00Z`);
    for (const offset of [0, -1, 1]) {
      const candidate = new Date(base);
      candidate.setUTCDate(candidate.getUTCDate() + offset);
      dates.add(candidate.toISOString().slice(0, 10));
    }
  }
  return [...dates];
}

async function hydrateMissingFixtureIdFromFotmob(league, fixture, prediction) {
  if (!fixture || fixture.id) return fixture;

  // Provider season feeds can place late-evening fixtures on the adjacent
  // calendar day because of UTC/local-time conversion. Search the fixture and
  // editorial dates, plus one day either side, but still require an exact
  // home/away team match before promoting an authoritative FotMob event ID.
  const searchDates = nearbyIsoDates(fixture.date, prediction.date);
  let event = null;
  let matchedDate = null;
  for (const date of searchDates) {
    try {
      const daily = await fetchFotmobDay(date);
      event = (daily.leagues ?? []).flatMap((item) => item.matches ?? []).find((match) =>
        teamNamesMatch(match.home?.name ?? "", fixture.homeTeam) &&
        teamNamesMatch(match.away?.name ?? "", fixture.awayTeam)
      );
      if (event?.id) {
        matchedDate = date;
        break;
      }
    } catch (error) {
      console.warn(`${prediction.slug}: FotMob ${date} lookup failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (!event?.id) return fixture;

  // "official:" is the project's existing canonical-id convention for
  // provider-verified fixtures that do not expose an ESPN/TheSportsDB id.
  // The real FotMob event id is retained separately for future result/stats hydration.
  const eventKickoffUtc =
    typeof event.status?.utcTime === "string" && Number.isFinite(Date.parse(event.status.utcTime))
      ? new Date(event.status.utcTime).toISOString()
      : Number.isFinite(Number(event.timeTS))
        ? new Date(Number(event.timeTS)).toISOString()
        : null;

  if (!eventKickoffUtc) {
    console.warn(`${prediction.slug}: FotMob event ${event.id} matched, but kickoffUtc is unavailable; fixture ID was not promoted.`);
    return fixture;
  }

  const canonicalDate = eventKickoffUtc.slice(0, 10);
  fixture.id = `official:${league.slug}:${canonicalTeamSlug(fixture.homeTeam)}-vs-${canonicalTeamSlug(fixture.awayTeam)}:${canonicalDate}`;
  fixture.fotmobMatchId = Number(event.id);
  fixture.dataSource = "fotmob";
  fixture.sourceAgreement = true;
  fixture.kickoffUtc = eventKickoffUtc;
  fixture.timeConfirmed = true;

  console.log(`${prediction.slug}: linked via FotMob event ${event.id} (query ${matchedDate}) -> ${fixture.id} @ ${fixture.kickoffUtc}`);
  return fixture;
}


function promoteVerifiedMlsEditorialFixture(league, fixture, prediction) {
  if (league.slug !== "mls" || !fixture || fixture.id) return fixture;

  // MLS is manual-only in this project. When ESPN/TheSportsDB/FotMob's daily
  // endpoint exposes the exact fixture but omits a usable provider id, keep
  // the verified editorial fixture rather than aborting the entire snapshot.
  // This does NOT invent an external provider id: it creates a namespaced,
  // deterministic manual id and retains the locally verified kickoff.
  const sameTeams =
    teamNamesMatch(fixture.homeTeam, prediction.homeTeam) &&
    teamNamesMatch(fixture.awayTeam, prediction.awayTeam);
  if (!sameTeams || !prediction.date || !prediction.time || prediction.time === "TBD") {
    return fixture;
  }

  const normalized = normalizeMatchTime({
    league: prediction.league,
    kickoffUtc: prediction.kickoffUtc,
    date: prediction.date,
    time: prediction.time,
    timeConfirmed: prediction.timeConfirmed,
    venue: prediction.venue,
  });
  if (!normalized?.kickoffUtc) return fixture;

  const manualId = `manual:${league.slug}:${prediction.slug}:${prediction.date}`;
  fixture.id = manualId;
  fixture.date = prediction.date;
  fixture.time = prediction.time;
  fixture.kickoffUtc = normalized.kickoffUtc;
  fixture.timeConfirmed = true;
  fixture.dataSource = "editorial-manual";
  fixture.sourceAgreement = false;

  console.warn(
    `${prediction.slug}: provider id unavailable; using verified MLS editorial fixture ${manualId} @ ${fixture.kickoffUtc}`
  );
  return fixture;
}

async function hydrateFotmobFinalScores(rounds) {
  const fixtures = rounds.flatMap((round) => round.games);
  const staleDates = [...new Set(fixtures
    .filter((fixture) => fixture.status !== "completed" && fixture.date <= snapshot.generatedAt.slice(0, 10))
    .map((fixture) => fixture.date))];
  for (const date of staleDates) {
    const daily = await fetchFotmobDay(date);
    const events = (daily.leagues ?? []).flatMap((league) => league.matches ?? []);
    for (const fixture of fixtures.filter((item) => item.date === date && item.status !== "completed")) {
      const event = events.find((match) =>
        match.status?.finished === true &&
        teamNamesMatch(match.home?.name ?? "", fixture.homeTeam) &&
        teamNamesMatch(match.away?.name ?? "", fixture.awayTeam)
      );
      const score = event?.status?.scoreStr?.match(/^(\d+)\s*-\s*(\d+)$/);
      if (!event?.id || !score) continue;
      fixture.status = "completed";
      fixture.homeScore = Number(score[1]);
      fixture.awayScore = Number(score[2]);
      fixture.dataSource = "fotmob";
      fixture.fotmobMatchId = Number(event.id);
      console.log(`${fixture.homeTeam} vs ${fixture.awayTeam}: FotMob final ${fixture.homeScore}-${fixture.awayScore}`);
    }
  }
  return rounds;
}

async function syncLeague(league) {
  const leaguePredictions = matches.filter((match) => match.league === league.slug);
  let refreshedRounds = null;
  try {
    const text = await sourceText(league.sources.fixtures);
    if (text === null && !league.liveDataId) {
      console.log(`${league.name}: skipped (no automatic fixture feed configured)`);
      return;
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
    const rounds = await hydrateFotmobFinalScores(await hydrateTheSportsDb(league.slug, espnRounds));
    // Keep the hydrated feed available to the recovery path. A provider can
    // return valid fixture IDs while the season source has malformed round
    // grouping; in that case we retain the last display-safe rounds but can
    // still link newly published predictions to authoritative provider IDs.
    refreshedRounds = rounds;
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
      let fixture = findPredictionFixture(rounds, prediction);

      if (fixture && !fixture.id) {
        fixture = await hydrateMissingFixtureIdFromFotmob(league, fixture, prediction);
      }
      if (fixture && !fixture.id) {
        fixture = promoteVerifiedMlsEditorialFixture(league, fixture, prediction);
      }

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
    snapshot.leagues[league.slug] = await hydrateFotmobFinalScores(structuredClone(savedRounds));
    snapshot.leagueUpdatedAt[league.slug] = previous.leagueUpdatedAt?.[league.slug] ?? previous.generatedAt;
    for (const [key, id] of Object.entries(previous.predictionIds ?? {})) {
      if (key.startsWith(`${league.slug}:`)) snapshot.predictionIds[key] = id;
    }
    // Recover links for newly published predictions from the hydrated refresh
    // first, even when its round structure failed validation. Only the fixture
    // ID is retained; malformed rounds never replace the last valid snapshot.
    // Fall back to saved rounds for predictions that were already known.
    for (const prediction of leaguePredictions) {
      const key = `${league.slug}:${prediction.slug}`;
      const existingId = snapshot.predictionIds[key];
      const existingFixtureAvailable = existingId && (
        savedRounds.flatMap((round) => round.games).some((fixture) => fixture.id === existingId) ||
        Boolean(snapshot.manualFixtures[existingId])
      );
      if (existingFixtureAvailable) continue;
      const refreshedFixture = refreshedRounds
        ? refreshedRounds.flatMap((round) => round.games)
            .find((fixture) => existingId && fixture.id === existingId) ??
          findPredictionFixture(refreshedRounds, prediction)
        : null;
      const savedFixture = refreshedFixture?.id
        ? null
        : findPredictionFixture(savedRounds, prediction);
      let recoveredFixture = refreshedFixture;
      if (recoveredFixture && !recoveredFixture.id) {
        recoveredFixture = await hydrateMissingFixtureIdFromFotmob(league, recoveredFixture, prediction);
      }
      if (recoveredFixture && !recoveredFixture.id) {
        recoveredFixture = promoteVerifiedMlsEditorialFixture(league, recoveredFixture, prediction);
      }
      const fixtureId = recoveredFixture?.id ?? savedFixture?.id;
      if (fixtureId) {
        snapshot.predictionIds[key] = fixtureId;
        const fixtureExistsInSavedRounds = savedRounds
          .flatMap((round) => round.games)
          .some((fixture) => fixture.id === fixtureId);
        if (recoveredFixture?.id && !fixtureExistsInSavedRounds) {
          snapshot.manualFixtures[fixtureId] = recoveredFixture;
        }
      }
    }
    console.error(`SOURCE_REFRESH_FAILED ${league.slug}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Keep network work concurrent without bursting provider rate limits. Two
// leagues at a time substantially reduces wall time compared with the former
// sequential loop while avoiding a dozen simultaneous TheSportsDB requests.
for (let index = 0; index < leagues.length; index += 2) {
  await Promise.all(leagues.slice(index, index + 2).map(syncLeague));
}

// Parallel provider requests finish in a nondeterministic order. Canonicalize
// object keys before change detection so identical data never causes a noisy
// snapshot rewrite or deployment.
snapshot.leagues = Object.fromEntries(
  leagues.filter((league) => snapshot.leagues[league.slug])
    .map((league) => [league.slug, snapshot.leagues[league.slug]])
);
snapshot.leagueUpdatedAt = Object.fromEntries(
  leagues.filter((league) => snapshot.leagueUpdatedAt[league.slug])
    .map((league) => [league.slug, snapshot.leagueUpdatedAt[league.slug]])
);
snapshot.predictionIds = Object.fromEntries(
  Object.entries(snapshot.predictionIds).sort(([left], [right]) => left.localeCompare(right))
);

function cornerValue(statistics) {
  const item = statistics?.find((stat) => /^(wonCorners|cornerKicks|corners)$/i.test(stat.name ?? stat.label ?? ""));
  if (!item) return null;
  const value = Number(item.value ?? item.displayValue);
  return Number.isInteger(value) && value >= 0 ? value : null;
}

async function fetchFotmobCorners(prediction, fixture) {
  let eventId = fixture.fotmobMatchId;
  if (!eventId) {
    const daily = await fetchFotmobDay(fixture.date);
    const event = (daily.leagues ?? []).flatMap((league) => league.matches ?? []).find((match) =>
      teamNamesMatch(match.home?.name ?? "", prediction.homeTeam) &&
      teamNamesMatch(match.away?.name ?? "", prediction.awayTeam)
    );
    eventId = event?.id;
  }
  if (!eventId) throw new Error("FotMob fixture not found");

  const source = `https://www.fotmob.com/api/data/matchDetails?matchId=${eventId}`;
  const detailResponse = await fetch(source, {
    headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  if (!detailResponse.ok) throw new Error(`FotMob details HTTP ${detailResponse.status}`);
  const detail = await detailResponse.json();
  const corners = detail.content?.stats?.Periods?.All?.stats
    ?.flatMap((group) => group.stats ?? [])
    .find((stat) => stat.key === "corners" || stat.title === "Corners")?.stats;
  const homeCorners = Number(corners?.[0]);
  const awayCorners = Number(corners?.[1]);
  if (!Number.isInteger(homeCorners) || !Number.isInteger(awayCorners)) {
    throw new Error("FotMob corner statistics unavailable");
  }
  return { homeCorners, awayCorners, source };
}

const marketResults = { ...previousMarketResults };
const cornerPredictions = matches.filter((match) =>
  parsePredictionMarket(match.mainPrediction ?? "").legs.some((leg) => leg.kind === "corners")
);
await Promise.all(cornerPredictions.map(async (prediction) => {
  const fixtureId = snapshot.predictionIds[`${prediction.league}:${prediction.slug}`];
  if (!fixtureId) return;
  const fixture = Object.values(snapshot.leagues).flatMap((rounds) => rounds ?? [])
    .flatMap((round) => round.games).find((game) => game.id === fixtureId);
  if (fixture?.status !== "completed") return;
  const key = `${prediction.league}:${prediction.slug}`;
  if (marketResults[key]) return;
  try {
    let captured = null;
    if (!fixtureId.startsWith("tsdb:") && !fixtureId.startsWith("official:")) {
      try {
        const source = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagues.find((item) => item.slug === prediction.league)?.liveDataId}/summary?event=${fixtureId}`;
        const response = await fetch(source, { headers: { Accept: "application/json" }, cache: "no-store" });
        if (!response.ok) throw new Error(`ESPN HTTP ${response.status}`);
        const data = await response.json();
        const teams = data.boxscore?.teams ?? [];
        const home = teams.find((team) => team.homeAway === "home") ?? teams[0];
        const away = teams.find((team) => team.homeAway === "away") ?? teams[1];
        const homeCorners = cornerValue(home?.statistics);
        const awayCorners = cornerValue(away?.statistics);
        if (homeCorners === null || awayCorners === null) throw new Error("ESPN corner statistics unavailable");
        captured = { homeCorners, awayCorners, source };
      } catch (error) {
        console.error(`ESPN_MARKET_DATA_FAILED ${prediction.slug}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    captured ??= await fetchFotmobCorners(prediction, fixture);
    marketResults[key] = { ...captured, capturedAt: snapshot.generatedAt };
    console.log(`${prediction.slug}: captured corners ${captured.homeCorners}-${captured.awayCorners}`);
  } catch (error) {
    console.error(`MARKET_DATA_REFRESH_FAILED ${prediction.slug}: ${error instanceof Error ? error.message : String(error)}`);
  }
}));

const automaticPredictions = matches.filter((match) => {
  const league = leagues.find((item) => item.slug === match.league);
  return Boolean(league?.sources.fixtures || league?.liveDataId);
});
const automaticPredictionKeys = automaticPredictions
  .map((prediction) => `${prediction.league}:${prediction.slug}`);
const automaticPredictionKeySet = new Set(automaticPredictionKeys);

// Remove orphaned links for predictions that are no longer present in the
// automatic prediction registry. Keeping them makes raw object counts drift
// after a league's current-round index is rotated.
snapshot.predictionIds = Object.fromEntries(
  Object.entries(snapshot.predictionIds)
    .filter(([key]) => automaticPredictionKeySet.has(key))
    .sort(([left], [right]) => left.localeCompare(right))
);

const missingPredictionKeys = automaticPredictionKeys
  .filter((key) => !snapshot.predictionIds[key]);

if (missingPredictionKeys.length > 0) {
  throw new Error(
    `Expected ${automaticPredictions.length} automatic prediction links, produced ${Object.keys(snapshot.predictionIds).length}. ` +
    `Missing: ${missingPredictionKeys.join(", ")}.`
  );
}

// Frequent polling is important around full time, but generatedAt alone must
// not trigger a commit and deployment every 15 minutes. Persist immediately
// when fixture data changes and otherwise write a twice-daily freshness
// heartbeat so snapshot-age validation remains meaningful.
const fixtureDataChanged =
  JSON.stringify(snapshot.leagues) !== JSON.stringify(previous.leagues) ||
  JSON.stringify(snapshot.predictionIds) !== JSON.stringify(previous.predictionIds) ||
  JSON.stringify(snapshot.manualFixtures) !== JSON.stringify(previous.manualFixtures);
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
