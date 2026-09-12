import fixtureSnapshot from "@/data/fixtures.snapshot.json";
import manualData from "@/data/editorial-data/manual-verified.json";
import { EDITORIAL_DATA_FRESHNESS, isFresh } from "./policy";
import {
  CORE_METRICS,
  type FixtureProvider,
  type LineupProvider,
  type ProjectedLineup,
  type ResolvedFixture,
  type StatisticalCoreData,
  type StatisticalCoreProvider,
  type TeamNews,
  type TeamNewsProvider,
} from "./types";

type SnapshotGame = {
  date?: string;
  time?: string;
  homeTeam?: string;
  awayTeam?: string;
  kickoffUtc?: string;
  round?: number;
  venue?: string;
  sourceUrl?: string;
  dataSource?: string;
  sourceAgreement?: boolean;
  timeConfirmed?: boolean;
};

type ManualStore = {
  fixtures: ResolvedFixture[];
  statisticalCores: StatisticalCoreData[];
  lineups: ProjectedLineup[];
  teamNews: TeamNews[];
};

const store = manualData as ManualStore;
const NETWORK_TIMEOUT_MS = 12_000;
const NETWORK_FLAG = "--network";
const networkEnabled = () => process.env.EDITORIAL_DATA_NETWORK === "1" || process.argv.includes(NETWORK_FLAG);
const CORE_DEBUG_FLAG = "--debug-core";
const coreDebugEnabled = (team?: string) => {
  if (!(process.env.EDITORIAL_DATA_DEBUG === "1" || process.argv.includes(CORE_DEBUG_FLAG))) return false;
  const filter = String(process.env.EDITORIAL_DATA_DEBUG_TEAM ?? "").trim();
  return !filter || !team || same(team, filter);
};
const coreDebug = (team: string, stage: string, data?: unknown) => {
  if (!coreDebugEnabled(team)) return;
  const suffix = data === undefined ? "" : ` ${JSON.stringify(data)}`;
  console.log(`[fotmob-core] team=${team} stage=${stage}${suffix}`);
};

const normalize = (value: unknown) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
const same = (left: unknown, right: unknown) => normalize(left) === normalize(right);
const snapshotGeneratedAt = String(fixtureSnapshot.generatedAt);

function validUrl(value: string) {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

function snapshotCandidate(match: { home: string; away: string }) {
  for (const rounds of Object.values(fixtureSnapshot.leagues as Record<string, Array<{ games: SnapshotGame[] }>>)) {
    const game = rounds.flatMap((round) => round.games).find((candidate) => same(candidate.homeTeam ?? "", match.home) && same(candidate.awayTeam ?? "", match.away));
    if (game) return game;
  }
}

async function fetchJson<T>(url: string): Promise<T | undefined> {
  if (!networkEnabled()) return undefined;
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Predictions-Sports-Prime editorial-data/1.0" },
      cache: "no-store",
      signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS),
    });
    if (!response.ok) return undefined;
    return await response.json() as T;
  } catch {
    return undefined;
  }
}

export const snapshotFixtureProvider: FixtureProvider = {
  capability: {
    id: "versioned-fixture-snapshot",
    kind: "fixture",
    competitions: "configured",
    homeAway: true,
    attribution: "src/data/fixtures.snapshot.json",
    freshness: `generatedAt=${snapshotGeneratedAt}`,
    reliability: "primary",
  },
  async resolve(match) {
    const leagueEntries = Object.entries(fixtureSnapshot.leagues as Record<string, Array<{ games: SnapshotGame[] }>>);
    for (const [competition, rounds] of leagueEntries) {
      const game = rounds.flatMap((round) => round.games).find((candidate) => same(candidate.homeTeam ?? "", match.home) && same(candidate.awayTeam ?? "", match.away));
      if (!game?.date || !game.kickoffUtc || !game.timeConfirmed || !game.sourceAgreement || !game.round || !game.venue || !game.sourceUrl) continue;
      return {
        slug: match.slug,
        home: game.homeTeam!,
        away: game.awayTeam!,
        competition,
        round: String(game.round),
        date: game.date,
        kickoffUtc: game.kickoffUtc,
        timezone: "UTC",
        venue: game.venue,
        source: game.dataSource ?? "fixture snapshot",
        sourceUrl: game.sourceUrl,
        fetchedAt: snapshotGeneratedAt,
        verifiedAt: snapshotGeneratedAt,
        provider: this.capability.id,
      };
    }
  },
};

export const fotmobFixtureProvider: FixtureProvider = {
  capability: {
    id: "fotmob-fixture",
    kind: "fixture",
    competitions: "configured",
    homeAway: true,
    attribution: "FotMob daily matches and matchDetails endpoints",
    freshness: "live request; opt-in with EDITORIAL_DATA_NETWORK=1",
    reliability: "secondary",
  },
  async resolve(match) {
    const candidate = snapshotCandidate(match);
    if (!candidate?.date) return undefined;

    const dayUrl = `https://www.fotmob.com/api/data/matches?date=${candidate.date.replaceAll("-", "")}`;
    const day = await fetchJson<{ leagues?: Array<{ name?: string; matches?: Array<{ id?: number; home?: { name?: string }; away?: { name?: string }; status?: { utcTime?: string } }> }> }>(dayUrl);
    if (!day) return undefined;

    const event = (day.leagues ?? []).flatMap((league) => league.matches ?? []).find((game) => same(game.home?.name ?? "", match.home) && same(game.away?.name ?? "", match.away));
    if (!event?.id) return undefined;

    const detailUrl = `https://www.fotmob.com/api/data/matchDetails?matchId=${event.id}`;
    const detail = await fetchJson<{
      general?: {
        matchRound?: string;
        matchTimeUTCDate?: string;
        homeTeam?: { name?: string };
        awayTeam?: { name?: string };
        leagueName?: string;
      };
      content?: { matchFacts?: { infoBox?: { Stadium?: { name?: string } | string } } };
    }>(detailUrl);
    if (!detail) return undefined;

    const stadium = detail.content?.matchFacts?.infoBox?.Stadium;
    const venue = typeof stadium === "string" ? stadium : stadium?.name;
    const kickoffUtc = detail.general?.matchTimeUTCDate ?? event.status?.utcTime;
    const resolvedHome = detail.general?.homeTeam?.name ?? match.home;
    const resolvedAway = detail.general?.awayTeam?.name ?? match.away;

    // Never promote a detail payload that resolves to a different fixture.
    if (!same(resolvedHome, match.home) || !same(resolvedAway, match.away)) return undefined;
    if (!venue || !kickoffUtc || !detail.general?.matchRound || !Number.isFinite(Date.parse(kickoffUtc))) return undefined;

    const fetchedAt = new Date().toISOString();
    return {
      slug: match.slug,
      home: resolvedHome,
      away: resolvedAway,
      competition: match.competition,
      round: detail.general.matchRound,
      date: kickoffUtc.slice(0, 10),
      kickoffUtc,
      timezone: "UTC",
      venue,
      source: "FotMob match details",
      sourceUrl: detailUrl,
      fetchedAt,
      verifiedAt: fetchedAt,
      provider: this.capability.id,
    };
  },
};

function validFixture(value: ResolvedFixture) {
  return Boolean(
    value.home && value.away && value.competition && value.round && value.date &&
    Number.isFinite(Date.parse(value.kickoffUtc)) && value.timezone && value.venue && value.source &&
    validUrl(value.sourceUrl) && Number.isFinite(Date.parse(value.fetchedAt)) && Number.isFinite(Date.parse(value.verifiedAt))
  );
}

export const manualFixtureProvider: FixtureProvider = {
  capability: {
    id: "manual-verified-fixture",
    kind: "fixture",
    competitions: "configured",
    homeAway: true,
    attribution: "manual-verified.json with mandatory source URL",
    freshness: `${EDITORIAL_DATA_FRESHNESS.fixtureMaximumAgeDays} days`,
    reliability: "manual-verified",
  },
  async resolve(match) {
    return store.fixtures.find((fixture) =>
      fixture.slug === match.slug &&
      same(fixture.home, match.home) && same(fixture.away, match.away) &&
      fixture.competition === match.competition &&
      validFixture(fixture) &&
      isFresh(fixture.verifiedAt, EDITORIAL_DATA_FRESHNESS.fixtureMaximumAgeDays * 86400000)
    );
  },
};


type FotMobSearchCandidate = {
  id?: unknown;
  name?: unknown;
  title?: unknown;
  type?: unknown;
  teamName?: unknown;
};

type FotMobMatchLike = {
  id?: number | string;
  matchId?: number | string;
  home?: { id?: number | string; name?: string; score?: number | string };
  away?: { id?: number | string; name?: string; score?: number | string };
  homeTeam?: { id?: number | string; name?: string; score?: number | string };
  awayTeam?: { id?: number | string; name?: string; score?: number | string };
  league?: { id?: number | string; name?: string };
  tournament?: { id?: number | string; name?: string };
  leagueName?: string;
  tournamentName?: string;
  status?: {
    finished?: boolean;
    started?: boolean;
    scoreStr?: string;
    reason?: string;
    utcTime?: string;
  };
  timeTS?: number;
};

const COMPETITION_ALIASES: Record<string, string[]> = {
  "champions-league": ["champions league", "uefa champions league"],
  "uefa-europa-league": ["europa league", "uefa europa league", "uefa cup"],
  "efl-cup": ["efl cup", "carabao cup", "league cup"],
  "eredivisie": ["eredivisie"],
  "scottish-premiership": ["scottish premiership", "premiership"],
  "liga-portugal": ["liga portugal", "primeira liga", "liga portugal betclic"],
  "copa-sudamericana": ["copa sudamericana", "conmebol sudamericana"],
  "copa-libertadores": ["copa libertadores", "conmebol libertadores", "libertadores"],
};

function walkObjects(value: unknown, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (!value || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    for (const item of value) walkObjects(item, out);
    return out;
  }
  const object = value as Record<string, unknown>;
  out.push(object);
  for (const child of Object.values(object)) walkObjects(child, out);
  return out;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace("%", "").trim());
    if (Number.isFinite(parsed)) return parsed;
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function fotmobCompetitionMatches(inputCompetition: string, rawName: string | undefined) {
  if (!rawName) return false;
  const normalized = normalize(rawName);
  const aliases = COMPETITION_ALIASES[inputCompetition] ?? [inputCompetition.replaceAll("-", " ")];
  return aliases.some((alias) => normalized.includes(normalize(alias)));
}


const fotmobLeagueIdPromises = new Map<string, Promise<number | undefined>>();
const fotmobLeaguePayloadPromises = new Map<string, Promise<unknown | undefined>>();

function fotmobSeasonParam(season: string) {
  const split = season.match(/^(\d{4})\/(\d{2}|\d{4})$/);
  if (!split) return season;
  const startYear = Number(split[1]);
  const rawEnd = Number(split[2]);
  const endYear = split[2].length === 2 ? Math.floor(startYear / 100) * 100 + rawEnd : rawEnd;
  return `${startYear}/${endYear}`;
}

function leagueDirectoryCandidates(payload: unknown) {
  return walkObjects(payload).flatMap((object) => {
    const id = asNumber(object.id ?? object.leagueId ?? object.primaryId);
    const name = asString(object.name ?? object.title ?? object.leagueName);
    return id && name ? [{ id, name }] : [];
  });
}

async function resolveFotMobLeagueId(competition: string): Promise<number | undefined> {
  if (!fotmobLeagueIdPromises.has(competition)) {
    fotmobLeagueIdPromises.set(competition, (async () => {
      const aliases = COMPETITION_ALIASES[competition] ?? [competition.replaceAll("-", " ")];
      const urls = [
        "https://www.fotmob.com/api/allLeagues",
        "https://www.fotmob.com/api/data/allLeagues",
      ];

      for (const url of urls) {
        const payload = await fetchJson<unknown>(url);
        if (!payload) continue;
        const candidates = leagueDirectoryCandidates(payload);

        const exact = candidates.find((candidate) =>
          aliases.some((alias) => same(candidate.name, alias))
        );
        if (exact) return exact.id;

        const normalizedAlias = aliases.map(normalize);
        const fuzzy = candidates.find((candidate) => {
          const name = normalize(candidate.name);
          return normalizedAlias.some((alias) => name.includes(alias) || alias.includes(name));
        });
        if (fuzzy) return fuzzy.id;
      }
      return undefined;
    })());
  }
  return fotmobLeagueIdPromises.get(competition)!;
}

async function fetchFotMobLeaguePayload(competition: string, season: string): Promise<unknown | undefined> {
  const leagueId = await resolveFotMobLeagueId(competition);
  if (!leagueId) return undefined;

  const seasonParam = fotmobSeasonParam(season);
  const key = `${leagueId}:${seasonParam}`;
  if (!fotmobLeaguePayloadPromises.has(key)) {
    fotmobLeaguePayloadPromises.set(key, (async () => {
      const encodedSeason = encodeURIComponent(seasonParam);
      const urls = [
        `https://www.fotmob.com/api/data/leagues?id=${leagueId}&season=${encodedSeason}`,
        `https://www.fotmob.com/api/leagues?id=${leagueId}&season=${encodedSeason}`,
      ];
      for (const url of urls) {
        const payload = await fetchJson<unknown>(url);
        if (payload) return payload;
      }
      return undefined;
    })());
  }
  return fotmobLeaguePayloadPromises.get(key)!;
}

async function resolveFotMobCompetitionMatches(input: {
  team: string;
  competition: string;
  season: string;
  sampleType: "home" | "away";
}): Promise<FotMobMatchLike[]> {
  const leagueId = await resolveFotMobLeagueId(input.competition);
  if (!leagueId) {
    coreDebug(input.team, "league-id:unresolved", { competition: input.competition });
    return [];
  }

  const payload = await fetchFotMobLeaguePayload(input.competition, input.season);
  if (!payload) {
    coreDebug(input.team, "league-payload:unavailable", { competition: input.competition, leagueId, season: fotmobSeasonParam(input.season) });
    return [];
  }

  const extracted = extractFotMobMatches(payload);
  const finished = extracted.filter(matchFinished);
  const correctVenue = finished.filter((match) => {
    const home = match.home?.name ?? match.homeTeam?.name ?? "";
    const away = match.away?.name ?? match.awayTeam?.name ?? "";
    return input.sampleType === "home" ? same(home, input.team) : same(away, input.team);
  });
  const inSeason = correctVenue.filter((match) => matchInSeason(match, input.season));

  coreDebug(input.team, "league-matches", {
    competition: input.competition,
    leagueId,
    season: fotmobSeasonParam(input.season),
    extracted: extracted.length,
    finished: finished.length,
    correctVenue: correctVenue.length,
    inSeason: inSeason.length,
    sample: inSeason.slice(0, 5).map((match) => ({
      id: asNumber(match.id ?? match.matchId),
      home: match.home?.name ?? match.homeTeam?.name,
      away: match.away?.name ?? match.awayTeam?.name,
      utc: match.status?.utcTime,
    })),
  });

  return inSeason;
}

async function resolveFotMobTeamId(team: string): Promise<number | undefined> {
  const url = `https://www.fotmob.com/api/data/search/suggest?hits=20&lang=en&term=${encodeURIComponent(team)}`;
  const payload = await fetchJson<unknown>(url);
  if (!payload) { coreDebug(team, "team-search:no-payload", { url }); return undefined; }

  const rawObjects = walkObjects(payload);
  const candidates = rawObjects
    .map((item) => item as FotMobSearchCandidate)
    .filter((item) => {
      const candidateName = asString(item.name) ?? asString(item.title) ?? asString(item.teamName);
      const candidateType = asString(item.type)?.toLowerCase() ?? "";
      return Boolean(candidateName && same(candidateName, team) && (!candidateType || candidateType.includes("team")));
    });

  coreDebug(team, "team-search", {
    objects: rawObjects.length,
    matches: candidates.length,
    candidates: candidates.slice(0, 5).map((candidate) => ({
      id: asNumber(candidate.id),
      name: asString(candidate.name) ?? asString(candidate.title) ?? asString(candidate.teamName),
      type: asString(candidate.type),
    })),
  });

  for (const candidate of candidates) {
    const id = asNumber(candidate.id);
    if (id) { coreDebug(team, "team-id", { id }); return id; }
  }
  coreDebug(team, "team-id:not-found");
}

function extractFotMobMatches(payload: unknown): FotMobMatchLike[] {
  const matches: FotMobMatchLike[] = [];
  const seen = new Set<string>();

  for (const object of walkObjects(payload)) {
    const candidate = object as FotMobMatchLike;
    const id = asNumber(candidate.id ?? candidate.matchId);
    const home = candidate.home?.name ?? candidate.homeTeam?.name;
    const away = candidate.away?.name ?? candidate.awayTeam?.name;
    if (!id || !home || !away) continue;

    const key = String(id);
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push(candidate);
  }

  return matches;
}

function scorePair(match: FotMobMatchLike): [number, number] | undefined {
  const homeScore = asNumber(match.home?.score ?? match.homeTeam?.score);
  const awayScore = asNumber(match.away?.score ?? match.awayTeam?.score);
  if (homeScore !== undefined && awayScore !== undefined) return [homeScore, awayScore];

  const scoreStr = match.status?.scoreStr;
  if (scoreStr) {
    const parts = scoreStr.split(/[-–—:]/).map((item) => Number(item.trim()));
    if (parts.length >= 2 && parts.every(Number.isFinite)) return [parts[0], parts[1]];
  }
}

function matchCompetitionName(match: FotMobMatchLike) {
  return match.league?.name ?? match.tournament?.name ?? match.leagueName ?? match.tournamentName;
}

function matchFinished(match: FotMobMatchLike) {
  if (match.status?.finished === true) return true;
  const reason = String(match.status?.reason ?? "").toUpperCase();
  return ["FT", "AET", "PEN", "FULL-TIME", "FULL TIME"].some((token) => reason.includes(token));
}

function matchUtcTime(match: FotMobMatchLike): number {
  const timestamp = Date.parse(match.status?.utcTime ?? "");
  if (Number.isFinite(timestamp)) return timestamp;
  return typeof match.timeTS === "number" ? match.timeTS : 0;
}

function seasonWindow(season: string): { start: number; end: number } | undefined {
  const split = season.match(/^(\d{4})\/(\d{2}|\d{4})$/);
  if (split) {
    const startYear = Number(split[1]);
    const rawEnd = Number(split[2]);
    const endYear = split[2].length === 2 ? Math.floor(startYear / 100) * 100 + rawEnd : rawEnd;
    if (!Number.isFinite(startYear) || !Number.isFinite(endYear) || endYear < startYear) return undefined;
    return {
      start: Date.parse(`${startYear}-07-01T00:00:00Z`),
      end: Date.parse(`${endYear}-06-30T23:59:59Z`),
    };
  }

  const calendar = season.match(/^(\d{4})$/);
  if (calendar) {
    const year = Number(calendar[1]);
    return {
      start: Date.parse(`${year}-01-01T00:00:00Z`),
      end: Date.parse(`${year}-12-31T23:59:59Z`),
    };
  }
}

function matchInSeason(match: FotMobMatchLike, season: string) {
  const window = seasonWindow(season);
  const timestamp = matchUtcTime(match);
  return Boolean(window && timestamp >= window.start && timestamp <= window.end);
}

type ParsedMatchStats = {
  xgHome: number;
  xgAway: number;
  shotsHome: number;
  shotsAway: number;
  sotHome: number;
  sotAway: number;
  possessionHome: number;
  possessionAway: number;
  cornersHome: number;
  cornersAway: number;
};

const STAT_TITLE_ALIASES = {
  xg: ["expected goals", "expected goals (xg)", "xg"],
  shots: ["total shots", "shots"],
  sot: ["shots on target", "shots on goal"],
  possession: ["ball possession", "possession"],
  corners: ["corners", "corner kicks"],
} as const;

function collectStatTitles(payload: unknown): string[] {
  const titles = new Set<string>();
  for (const object of walkObjects(payload)) {
    const title = asString(object.title ?? object.label ?? object.name);
    const stats = Array.isArray(object.stats) ? object.stats : Array.isArray(object.values) ? object.values : undefined;
    if (title && stats && stats.length >= 2) titles.add(title);
  }
  return [...titles].slice(0, 80);
}

function statPair(payload: unknown, aliases: readonly string[]): [number, number] | undefined {
  const wanted = aliases.map(normalize);
  for (const object of walkObjects(payload)) {
    const title = asString(object.title ?? object.label ?? object.name);
    const stats = Array.isArray(object.stats) ? object.stats : Array.isArray(object.values) ? object.values : undefined;
    if (!title || !stats || stats.length < 2) continue;
    if (!wanted.some((alias) => normalize(title) === alias)) continue;

    const home = asNumber(stats[0]);
    const away = asNumber(stats[1]);
    if (home !== undefined && away !== undefined) return [home, away];
  }
}

function parseMatchStats(payload: unknown): ParsedMatchStats | undefined {
  const xg = statPair(payload, STAT_TITLE_ALIASES.xg);
  const shots = statPair(payload, STAT_TITLE_ALIASES.shots);
  const sot = statPair(payload, STAT_TITLE_ALIASES.sot);
  const possession = statPair(payload, STAT_TITLE_ALIASES.possession);
  const corners = statPair(payload, STAT_TITLE_ALIASES.corners);
  if (!xg || !shots || !sot || !possession || !corners) return undefined;

  return {
    xgHome: xg[0], xgAway: xg[1],
    shotsHome: shots[0], shotsAway: shots[1],
    sotHome: sot[0], sotAway: sot[1],
    possessionHome: possession[0], possessionAway: possession[1],
    cornersHome: corners[0], cornersAway: corners[1],
  };
}

type GoalEvent = { minute: number; isHome: boolean };

function parseGoalEvents(payload: unknown): GoalEvent[] | undefined {
  const events: GoalEvent[] = [];
  let sawEventContainer = false;

  for (const object of walkObjects(payload)) {
    const type = String(object.type ?? object.eventType ?? object.incidentType ?? "").toLowerCase();
    if (!type) continue;
    sawEventContainer = true;
    if (!type.includes("goal") || type.includes("missed")) continue;

    const minuteRaw = object.time ?? object.minute ?? object.timeStr;
    const minuteText = String(minuteRaw ?? "");
    const minute = Number.parseInt(minuteText, 10);
    const isHome =
      typeof object.isHomeTeam === "boolean" ? object.isHomeTeam :
      typeof object.isHome === "boolean" ? object.isHome :
      undefined;

    if (Number.isFinite(minute) && isHome !== undefined) events.push({ minute, isHome });
  }

  if (!sawEventContainer) return undefined;
  return events.sort((a, b) => a.minute - b.minute);
}

type AggregatedSample = {
  matchId: number;
  detailUrl: string;
  gf: number;
  ga: number;
  result: "W" | "D" | "L";
  xg: number;
  xga: number;
  shots: number;
  shotsAllowed: number;
  sot: number;
  sotAllowed: number;
  possession: number;
  cornersFor: number;
  cornersAgainst: number;
  firstToScore: boolean;
  firstToConcede: boolean;
  scoredFirstHalf: boolean;
  concededFirstHalf: boolean;
  btts: boolean;
  cleanSheet: boolean;
  failedToScore: boolean;
};

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function percent(count: number, total: number) {
  return `${Math.round((count / total) * 100)}%`;
}

function average(samples: AggregatedSample[], selector: (sample: AggregatedSample) => number) {
  return round2(samples.reduce((sum, sample) => sum + selector(sample), 0) / samples.length);
}

function metricRecord(
  metric: (typeof CORE_METRICS)[number],
  value: string | number,
  input: { competition: string; season: string; sampleType: "home" | "away" },
  matches: number,
  fetchedAt: string,
  teamUrl: string,
  detailUrls: string[],
) {
  return {
    metric,
    value,
    season: input.season,
    competition: input.competition,
    sampleType: input.sampleType,
    matches,
    source: `FotMob matchDetails aggregate (${matches} ${input.sampleType.toUpperCase()} matches)`,
    sourceUrl: teamUrl,
    provenanceUrls: detailUrls,
    fetchedAt,
  };
}

export const fotmobStatisticalCoreProvider: StatisticalCoreProvider = {
  capability: {
    id: "fotmob-statistical-core",
    kind: "statistics",
    competitions: Object.keys(COMPETITION_ALIASES),
    metrics: CORE_METRICS,
    homeAway: true,
    attribution: "FotMob team/league fixtures + matchDetails, aggregated from exact venue-split completed matches",
    freshness: "live request; opt-in with EDITORIAL_DATA_NETWORK=1 or --network",
    reliability: "secondary",
  },
  async get(input) {
    if (!networkEnabled()) return undefined;

    coreDebug(input.team, "start", { competition: input.competition, season: input.season, sampleType: input.sampleType });
    const teamId = await resolveFotMobTeamId(input.team);
    if (!teamId) { coreDebug(input.team, "reject:no-team-id"); return undefined; }

    const teamUrl = `https://www.fotmob.com/api/data/teams?id=${teamId}`;
    const teamPayload = await fetchJson<unknown>(teamUrl);
    if (!teamPayload) { coreDebug(input.team, "reject:no-team-payload", { teamUrl }); return undefined; }

    const extracted = extractFotMobMatches(teamPayload);
    const finished = extracted.filter(matchFinished);
    const correctVenue = finished.filter((match) => {
      const home = match.home?.name ?? match.homeTeam?.name ?? "";
      const away = match.away?.name ?? match.awayTeam?.name ?? "";
      return input.sampleType === "home" ? same(home, input.team) : same(away, input.team);
    });
    const inSeason = correctVenue.filter((match) => matchInSeason(match, input.season));
    const inCompetition = inSeason.filter((match) => fotmobCompetitionMatches(input.competition, matchCompetitionName(match)));

    coreDebug(input.team, "team-matches", {
      extracted: extracted.length,
      finished: finished.length,
      correctVenue: correctVenue.length,
      inSeason: inSeason.length,
      inCompetition: inCompetition.length,
      competitionNames: [...new Set(inSeason.map(matchCompetitionName).filter(Boolean))].slice(0, 20),
      sample: inSeason.slice(0, 5).map((match) => ({
        id: asNumber(match.id ?? match.matchId),
        home: match.home?.name ?? match.homeTeam?.name,
        away: match.away?.name ?? match.awayTeam?.name,
        competition: matchCompetitionName(match),
        finished: matchFinished(match),
        utc: match.status?.utcTime,
      })),
    });

    let candidatePool = inCompetition;
    if (!candidatePool.length) {
      coreDebug(input.team, "team-endpoint:no-competition-candidates", {
        competition: input.competition,
        fallback: "league-endpoint",
      });
      candidatePool = await resolveFotMobCompetitionMatches(input);
    }

    const candidates = candidatePool
      .sort((a, b) => matchUtcTime(b) - matchUtcTime(a))
      .slice(0, 12);

    if (!candidates.length) { coreDebug(input.team, "reject:no-candidates"); return undefined; }

    const samples: AggregatedSample[] = [];
    const debugCounts = { candidates: candidates.length, noScore: 0, noDetail: 0, noStats: 0, noGoals: 0, teamMismatch: 0, accepted: 0 };
    let firstStatsFailureLogged = false;
    let firstGoalsFailureLogged = false;
    for (const match of candidates) {
      const matchId = asNumber(match.id ?? match.matchId);
      const score = scorePair(match);
      if (!matchId || !score) { debugCounts.noScore++; continue; }

      const detailUrl = `https://www.fotmob.com/api/data/matchDetails?matchId=${matchId}`;
      const detail = await fetchJson<unknown>(detailUrl);
      if (!detail) { debugCounts.noDetail++; continue; }

      const stats = parseMatchStats(detail);
      const goals = parseGoalEvents(detail);
      if (!stats) {
        debugCounts.noStats++;
        if (!firstStatsFailureLogged) {
          firstStatsFailureLogged = true;
          coreDebug(input.team, "match-details:stats-unmapped", { matchId, titles: collectStatTitles(detail) });
        }
      }
      if (!goals) {
        debugCounts.noGoals++;
        if (!firstGoalsFailureLogged) {
          firstGoalsFailureLogged = true;
          coreDebug(input.team, "match-details:goals-unmapped", { matchId });
        }
      }
      if (!stats || !goals) continue;

      const detailObjects = walkObjects(detail);
      const detailGeneral = detailObjects.find((object) =>
        typeof object.homeTeam === "object" && typeof object.awayTeam === "object"
      ) as { homeTeam?: { name?: string }; awayTeam?: { name?: string } } | undefined;
      const resolvedHome = detailGeneral?.homeTeam?.name ?? match.home?.name ?? match.homeTeam?.name ?? "";
      const resolvedAway = detailGeneral?.awayTeam?.name ?? match.away?.name ?? match.awayTeam?.name ?? "";
      if (!resolvedHome || !resolvedAway) continue;

      const teamIsHome = same(resolvedHome, input.team);
      const teamIsAway = same(resolvedAway, input.team);
      if ((input.sampleType === "home" && !teamIsHome) || (input.sampleType === "away" && !teamIsAway)) { debugCounts.teamMismatch++; continue; }

      const [homeGoals, awayGoals] = score;
      const gf = input.sampleType === "home" ? homeGoals : awayGoals;
      const ga = input.sampleType === "home" ? awayGoals : homeGoals;
      const firstGoal = goals[0];
      const scoredFirstHalf = goals.some((goal) => goal.minute <= 45 && goal.isHome === (input.sampleType === "home"));
      const concededFirstHalf = goals.some((goal) => goal.minute <= 45 && goal.isHome !== (input.sampleType === "home"));

      samples.push({
        matchId,
        detailUrl,
        gf,
        ga,
        result: gf > ga ? "W" : gf === ga ? "D" : "L",
        xg: input.sampleType === "home" ? stats.xgHome : stats.xgAway,
        xga: input.sampleType === "home" ? stats.xgAway : stats.xgHome,
        shots: input.sampleType === "home" ? stats.shotsHome : stats.shotsAway,
        shotsAllowed: input.sampleType === "home" ? stats.shotsAway : stats.shotsHome,
        sot: input.sampleType === "home" ? stats.sotHome : stats.sotAway,
        sotAllowed: input.sampleType === "home" ? stats.sotAway : stats.sotHome,
        possession: input.sampleType === "home" ? stats.possessionHome : stats.possessionAway,
        cornersFor: input.sampleType === "home" ? stats.cornersHome : stats.cornersAway,
        cornersAgainst: input.sampleType === "home" ? stats.cornersAway : stats.cornersHome,
        firstToScore: Boolean(firstGoal && firstGoal.isHome === (input.sampleType === "home")),
        firstToConcede: Boolean(firstGoal && firstGoal.isHome !== (input.sampleType === "home")),
        scoredFirstHalf,
        concededFirstHalf,
        btts: homeGoals > 0 && awayGoals > 0,
        cleanSheet: ga === 0,
        failedToScore: gf === 0,
      });
      debugCounts.accepted++;
    }

    coreDebug(input.team, "sample-summary", debugCounts);
    if (!samples.length) { coreDebug(input.team, "reject:no-valid-samples"); return undefined; }

    const fetchedAt = new Date().toISOString();
    const matches = samples.length;
    const detailUrls = samples.map((sample) => sample.detailUrl);
    const wins = samples.filter((sample) => sample.result === "W").length;
    const draws = samples.filter((sample) => sample.result === "D").length;
    const losses = samples.filter((sample) => sample.result === "L").length;
    const points = wins * 3 + draws;

    const values: Record<(typeof CORE_METRICS)[number], string | number> = {
      "Matches (N)": matches,
      "W-D-L": `${wins}-${draws}-${losses}`,
      "Points/game": round2(points / matches),
      "GF/game": average(samples, (sample) => sample.gf),
      "GA/game": average(samples, (sample) => sample.ga),
      "xG/game": average(samples, (sample) => sample.xg),
      "xGA/game": average(samples, (sample) => sample.xga),
      "Shots/game": average(samples, (sample) => sample.shots),
      "SOT/game": average(samples, (sample) => sample.sot),
      "Shots allowed/game": average(samples, (sample) => sample.shotsAllowed),
      "SOT allowed/game": average(samples, (sample) => sample.sotAllowed),
      "Possession": `${average(samples, (sample) => sample.possession)}%`,
      "Corners for/game": average(samples, (sample) => sample.cornersFor),
      "Corners against/game": average(samples, (sample) => sample.cornersAgainst),
      "Total corners/game": average(samples, (sample) => sample.cornersFor + sample.cornersAgainst),
      "First to score": percent(samples.filter((sample) => sample.firstToScore).length, matches),
      "First to concede": percent(samples.filter((sample) => sample.firstToConcede).length, matches),
      "Scored in 1st half": percent(samples.filter((sample) => sample.scoredFirstHalf).length, matches),
      "Conceded in 1st half": percent(samples.filter((sample) => sample.concededFirstHalf).length, matches),
      "BTTS": percent(samples.filter((sample) => sample.btts).length, matches),
      "Clean sheets": percent(samples.filter((sample) => sample.cleanSheet).length, matches),
      "Failed to score": percent(samples.filter((sample) => sample.failedToScore).length, matches),
    };

    coreDebug(input.team, "success", { matches, metrics: CORE_METRICS.length });
    return {
      team: input.team,
      season: input.season,
      competition: input.competition,
      sampleType: input.sampleType,
      matches,
      metrics: Object.fromEntries(
        CORE_METRICS.map((metric) => [
          metric,
          metricRecord(metric, values[metric], input, matches, fetchedAt, teamUrl, detailUrls),
        ]),
      ),
      provider: this.capability.id,
    };
  },
};

export const manualStatisticalCoreProvider: StatisticalCoreProvider = {
  capability: {
    id: "manual-verified-statistical-core",
    kind: "statistics",
    competitions: "configured",
    metrics: CORE_METRICS,
    homeAway: true,
    attribution: "per-metric HTTPS provenance",
    freshness: `${EDITORIAL_DATA_FRESHNESS.statisticsMaximumAgeDays} days`,
    reliability: "manual-verified",
  },
  async get(input) {
    return store.statisticalCores.find((core) =>
      same(core.team, input.team) &&
      core.competition === input.competition &&
      core.season === input.season &&
      core.sampleType === input.sampleType
    );
  },
};

export const manualLineupProvider: LineupProvider = {
  capability: {
    id: "manual-verified-projected-lineup",
    kind: "lineup",
    competitions: "configured",
    homeAway: true,
    attribution: "dated match-specific HTTPS source",
    freshness: `${EDITORIAL_DATA_FRESHNESS.projectedLineupMaximumAgeHours} hours`,
    reliability: "manual-verified",
  },
  async get(match, side) {
    const teamName = side === "home" ? match.home : match.away;
    return store.lineups.find((lineup) =>
      lineup.slug === match.slug && same(lineup.team, teamName) &&
      lineup.players.length === 11 && lineup.players.every(Boolean) &&
      lineup.status === "projected" && Boolean(lineup.formation) && Boolean(lineup.source) &&
      validUrl(lineup.sourceUrl) && Number.isFinite(Date.parse(lineup.fetchedAt)) &&
      isFresh(lineup.sourceDate, EDITORIAL_DATA_FRESHNESS.projectedLineupMaximumAgeHours * 3600000)
    );
  },
};

export const manualTeamNewsProvider: TeamNewsProvider = {
  capability: {
    id: "manual-verified-team-news",
    kind: "team-news",
    competitions: "configured",
    homeAway: true,
    attribution: "dated team-specific HTTPS source",
    freshness: `${EDITORIAL_DATA_FRESHNESS.teamNewsMaximumAgeHours} hours`,
    reliability: "manual-verified",
  },
  async get(match, side) {
    const teamName = side === "home" ? match.home : match.away;
    return store.teamNews.find((news) =>
      news.slug === match.slug && same(news.team, teamName) && Boolean(news.source) &&
      validUrl(news.sourceUrl) && Number.isFinite(Date.parse(news.fetchedAt)) &&
      isFresh(news.sourceDate, EDITORIAL_DATA_FRESHNESS.teamNewsMaximumAgeHours * 3600000)
    );
  },
};

export const providerCapabilities = [
  snapshotFixtureProvider.capability,
  fotmobFixtureProvider.capability,
  manualFixtureProvider.capability,
  fotmobStatisticalCoreProvider.capability,
  manualStatisticalCoreProvider.capability,
  manualLineupProvider.capability,
  manualTeamNewsProvider.capability,
];
