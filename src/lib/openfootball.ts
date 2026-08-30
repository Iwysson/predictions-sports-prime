import type { LeagueSlug } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import fixtureSnapshot from "@/data/fixtures.snapshot.json";
import { siteConfig } from "@/lib/site-config";
import {
  FixtureStatus,
  normalizeProviderStatus,
} from "@/lib/fixture-status";
import { getCurrentRound } from "@/lib/match-lifecycle";

export type OpenFootballGame = {
  id?: string;
  round: number;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status?: FixtureStatus;
  dataSource?: "openfootball" | "espn" | "thesportsdb" | "fotmob" | "snapshot";
  fotmobMatchId?: number;
  kickoffUtc?: string;
  timeConfirmed?: boolean;
  sourceAgreement?: boolean;
};

export type OpenFootballRound = {
  round: number;
  games: OpenFootballGame[];
};

export type ComputedStanding = {
  position: number;
  team: string;
  played: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

export type OpenLeagueConfig = {
  slug: LeagueSlug;
  source?: string;
  expectedClubs: number;
  expectedGamesPerRound: number;
  label: string;
  manualOnly?: boolean;
};

export const openLeagueConfigs = Object.fromEntries(
  Object.values(leaguesBySlug).map((league) => [league.slug, {
    slug: league.slug,
    source: league.sources.fixtures,
    expectedClubs: league.expectedClubs,
    expectedGamesPerRound: league.expectedGamesPerRound,
    label: league.name,
    manualOnly: league.manualOnly,
  }])
) as Record<LeagueSlug, OpenLeagueConfig>;

const MONTHS: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

const promises = new Map<string, Promise<OpenFootballRound[]>>();
const dailyPromises = new Map<string, Promise<OpenFootballGame[]>>();

type LiveCompetitor = {
  homeAway: "home" | "away";
  score?: string;
  team: { displayName: string };
};

type LiveEvent = {
  id: string;
  date: string;
  season?: { year?: number };
  status: {
    type: { name: string; state: string; completed: boolean };
  };
  competitions: Array<{
    date?: string;
    timeValid?: boolean;
    competitors: LiveCompetitor[];
  }>;
};

type FixtureSnapshot = {
  version: number;
  generatedAt: string;
  siteTimezone: string;
  leagues: Partial<Record<LeagueSlug, OpenFootballRound[]>>;
  predictionIds: Record<string, string>;
  leagueUpdatedAt?: Partial<Record<LeagueSlug, string>>;
  manualFixtures?: Record<string, OpenFootballGame>;
};

const snapshot = fixtureSnapshot as FixtureSnapshot;

export function getFixtureSnapshotMetadata() {
  return {
    version: snapshot.version,
    generatedAt: snapshot.generatedAt,
    siteTimezone: snapshot.siteTimezone,
    leagueUpdatedAt: snapshot.leagueUpdatedAt ?? {},
  };
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function cleanTeamName(name: string) {
  return name
    .trim()
    .replace(/\s*\[[^\]]+\]\s*$/i, "")
    .replace(/\s*\([^)]+\)\s*$/i, "")
    .replace(/\s+FC$/i, "")
    .replace(/\s+AFC$/i, "")
    .replace(/^AFC\s+/i, "")
    .replace(/\s+CF$/i, "")
    .replace(/^FC\s+/i, "")
    .trim();
}

export function normalizeTeamKey(name: string) {
  const key = cleanTeamName(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .split(/[^a-z0-9]+/)
    .filter((part) => part && part !== "club" && part !== "de")
    .join("");

  const aliases: Record<string, string> = {
    az: "azalkmaar",
    brighton: "brightonandhovealbion",
    westhamunited: "westham",
    casapiaac: "casapia",
    psveindhoven: "psv",
    sportingclubeportugal: "sportingcp",
    sportlisboaebenfica: "benfica",
    vitoriascguimaraes: "vitoriaguimaraes",
    olympiquemarseille: "marseille",
    psg: "parissaintgermain",
    om: "marseille",
    rcstrasbourg: "strasbourg",
    rcstrasbourgalsace: "strasbourg",
    racinglens: "lens",
    staderennaisfc1901: "rennes",
    staderennais: "rennes",
    stadebrestois29: "brest",
    racingclublens: "lens",
    ajauxerre: "auxerre",
    angerssco: "angers",
    lehavreac: "lehavre",
    estroyesac: "troyes",
    lilleosc: "lille",
    asmonaco: "monaco",
    scheerenveen: "heerenveen",
    twente65: "twente",
    sccambuurleeuwarden: "cambuur",
    sccambuur: "cambuur",
    feyenoordrotterdam: "feyenoord",
    sbvexcelsior: "excelsior",
    willemiitilburg: "willemii",
    excelsiorrotterdam: "excelsior",
    ogcnice: "nice",
    olympiquelyonnais: "lyon",
    asroma: "roma",
    como1907: "como",
    udinesecalcio: "udinese",
    bolognafc1909: "bologna",
    sslazio: "lazio",
    ussassuolocalcio: "sassuolo",
    internazionalemilano: "internazionale",
    intermilano: "internazionale",
    intermilan: "internazionale",
    genoacfc: "genoa",
    sscnapoli: "napoli",
    acmonza: "monza",
    atalantabc: "atalanta",
    cagliaricalcio: "cagliari",
    parmacalcio1913: "parma",
    frosinonecalcio: "frosinone",
    acffiorentina: "fiorentina",
    uslecce: "lecce",
    acmilan: "milan",
    cfestreladaamadora: "estreladaamadora",
    estrela: "estreladaamadora",
    estrelaamadora: "estreladaamadora",
    sportingclubedebraga: "braga",
    sportingclubebraga: "braga",
    scbraga: "braga",
    cdnacional: "nacional",
    gdestorilpraia: "estoril",
    estorilpraia: "estoril",
    cdsantaclara: "santaclara",
    csmaritimo: "maritimo",
    atleticomg: "atleticomineiro",
    athleticopr: "athleticoparanaense",
    rcdeportivolacoruna: "deportivolacoruna",
    deportivo: "deportivolacoruna",
    rcdespanyoldebarcelona: "espanyol",
    rcdespanyolbarcelona: "espanyol",
    espanyolbarcelona: "espanyol",
    rcceltadevigo: "celtavigo",
    rcceltavigo: "celtavigo",
    caosasuna: "osasuna",
    realracingclubdesantander: "racingsantander",
    deportivoalaves: "alaves",
    rayovallecanodemadrid: "rayovallecano",
    rayovallecanomadrid: "rayovallecano",
    realbetisbalompie: "realbetis",
    realsociedadfutbol: "realsociedad",
    realracingclubsantander: "racingsantander",
    realracingsantander: "racingsantander",
    racingsantander: "racingsantander",
    levanteud: "levante",
    clubatleticomadrid: "atleticomadrid",
    athleticbilbao: "athleticclub",
    bayernmunchen: "bayernmunich",
    vfb1893stuttgart: "stuttgart",
    vfbstuttgart: "stuttgart",
    "1fsvmainz05": "mainz",
    mainz05: "mainz",
    scpaderborn07: "paderborn",
    scpaderborn: "paderborn",
    sv07elversberg: "elversberg",
    svelversberg: "elversberg",
    bayer04leverkusen: "bayerleverkusen",
    borussiadortmund: "dortmund",
    hamburgersv: "hamburg",
    hamburgsv: "hamburg",
    "1fckoln": "cologne",
    koln: "cologne",
    tsg1899hoffenheim: "hoffenheim",
    tsghoffenheim: "hoffenheim",
    scfreiburg: "freiburg",
    svwerderbremen: "werderbremen",
    rbleipzig: "leipzig",
    schalke04: "schalke",
    "1fcunionberlin": "unionberlin",
    borussiamonchengladbach: "monchengladbach",
    borussiamgladbach: "monchengladbach",
    fcaugsburg: "augsburg",
    eintrachtfrankfurt: "frankfurt",
    telstar1963: "telstar",
    sctelstar: "telstar",
    necnijmegen: "nec",
    ajaxamsterdam: "ajax",
    fcgroningen: "groningen",
    fcutrecht: "utrecht",
    goaheadeagles: "goaheadeagles",
    adodenhaag: "adodenhaag",
    caykurrizespor: "rizespor",
    erzurumsporfk: "erzurumspor",
  };

  return aliases[key] ?? key;
}

export function teamNamesMatch(left: string, right: string) {
  const leftKey = normalizeTeamKey(left);
  const rightKey = normalizeTeamKey(right);

  return leftKey === rightKey;
}

export function parseFootballSeason(text: string): OpenFootballRound[] {
  const lines = text.split(/\r?\n/);
  const rounds: OpenFootballRound[] = [];

  let currentRound: OpenFootballRound | null = null;
  let currentDate = "";
  let currentYear = 2026;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, " ");

    const roundMatch = line.match(/^\s*▪\s*Matchday\s+(\d+)/i);
    if (roundMatch) {
      const roundNumber = Number(roundMatch[1]);
      currentRound = rounds.find((item) => item.round === roundNumber) ?? null;

      if (!currentRound) {
        currentRound = {
          round: roundNumber,
          games: [],
        };
        rounds.push(currentRound);
      }
      continue;
    }

    const dateMatch = line.match(
      /^\s{2}(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+([A-Z][a-z]{2})\s+(\d{1,2})(?:\s+(\d{4}))?\s*$/
    );

    if (dateMatch) {
      const month = MONTHS[dateMatch[1]];
      const day = Number(dateMatch[2]);

      if (dateMatch[3]) {
        currentYear = Number(dateMatch[3]);
      }

      currentDate = isoDate(currentYear, month, day);
      continue;
    }

    if (!currentRound || !currentDate) {
      continue;
    }

    let content = line.trim();

    if (!content || !content.includes(" v ")) {
      continue;
    }

    const scoreMatch = content.match(/\s+(\d+)-(\d+)(?:\s+\([^)]*\))?\s*$/);

    let homeScore: number | null = null;
    let awayScore: number | null = null;

    if (scoreMatch) {
      homeScore = Number(scoreMatch[1]);
      awayScore = Number(scoreMatch[2]);
      content = content.slice(0, scoreMatch.index).trimEnd();
    }

    const timeMatch = content.match(/^(\d{1,2}:\d{2})\s+/);
    const gameTime = timeMatch?.[1] ?? "TBD";

    if (timeMatch) {
      content = content.slice(timeMatch[0].length);
    }

    const teams = content.split(/\s+v\s+/);

    if (teams.length !== 2) {
      continue;
    }

    currentRound.games.push({
      round: currentRound.round,
      date: currentDate,
      time: gameTime,
      homeTeam: cleanTeamName(teams[0]),
      awayTeam: cleanTeamName(teams[1]),
      homeScore,
      awayScore,
      status: homeScore !== null && awayScore !== null ? "completed" : "scheduled",
      dataSource: "openfootball",
    });
  }

  return rounds.filter((round) => round.games.length > 0);
}

async function fetchSeasonText(config: OpenLeagueConfig) {
  if (!config.source) {
    throw new Error(`${config.label}: no fixture source configured`);
  }

  const cacheKey = `psp-openfootball-${config.slug}-2026-27-v2`;
  const cacheDuration = 6 * 60 * 60 * 1000;

  if (typeof window !== "undefined") {
    const cachedRaw = window.localStorage.getItem(cacheKey);

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as {
          savedAt: number;
          text: string;
        };

        if (
          Date.now() - cached.savedAt < cacheDuration &&
          cached.text?.includes("Matchday")
        ) {
          return cached.text;
        }
      } catch {
        // Invalid cache: fetch again.
      }
    }
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 10_000);
  let response: Response;

  try {
    response = await fetch(config.source, {
      headers: { Accept: "text/plain" },
      signal: controller.signal,
    });
  } finally {
    globalThis.clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`${config.label}: OpenFootball returned ${response.status}`);
  }

  const text = await response.text();

  if (!text.includes("Matchday")) {
    throw new Error(`${config.label}: unexpected OpenFootball response`);
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      cacheKey,
      JSON.stringify({
        savedAt: Date.now(),
        text,
      })
    );
  }

  return text;
}

function eventStatus(event: LiveEvent): OpenFootballGame["status"] {
  const status = event.status.type;
  return normalizeProviderStatus(status);
}

export function eventKickoffInSiteTimezone(value: string, timeZone = siteConfig.fixtureTimezone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    date: `${fields.year}-${fields.month}-${fields.day}`,
    time: `${fields.hour}:${fields.minute}`,
  };
}

function localKickoffToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const targetWallTime = Date.UTC(year, month - 1, day, hour, minute);
  let candidate = targetWallTime;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(candidate));
    const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const renderedWallTime = Date.UTC(
      Number(fields.year),
      Number(fields.month) - 1,
      Number(fields.day),
      Number(fields.hour),
      Number(fields.minute)
    );
    candidate += targetWallTime - renderedWallTime;
  }

  return new Date(candidate).toISOString();
}

export async function hydrateLiveResults(slug: LeagueSlug, rounds: OpenFootballRound[]) {
  const league = leaguesBySlug[slug];
  const dates = league.season.includes("/")
    ? `${league.season.slice(0, 4)}0801-${Number(league.season.slice(0, 4)) + 1}0731`
    : `${league.season}0101-${league.season}1231`;
  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.liveDataId}/scoreboard?dates=${dates}&limit=1000`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );

  if (!response.ok) throw new Error(`${league.name}: live results returned ${response.status}`);

  const data = (await response.json()) as { events?: LiveEvent[] };
  const seasonStartYear = Number(league.season.slice(0, 4));
  const baseGames = rounds.flatMap((round) => round.games);
  const events = (data.events ?? [])
    .filter((event) => event.season?.year === seasonStartYear)
    .sort((left, right) => {
      const distance = (event: LiveEvent) => {
        const date = eventKickoffInSiteTimezone(event.date, league.timezone).date;
        return Math.min(...baseGames.map((game) =>
          Math.abs(Date.parse(`${game.date}T12:00:00Z`) - Date.parse(`${date}T12:00:00Z`))
        ));
      };
      return distance(left) - distance(right);
    });

  for (const event of events) {
    const competitors = event.competitions[0]?.competitors ?? [];
    const home = competitors.find((item) => item.homeAway === "home");
    const away = competitors.find((item) => item.homeAway === "away");
    if (!home || !away) continue;

    const eventDate = eventKickoffInSiteTimezone(event.date, league.timezone).date;
    const fixture = rounds
      .flatMap((round) => round.games)
      .filter((game) => !game.id)
      .filter((game) =>
        (teamNamesMatch(game.homeTeam, home.team.displayName) && teamNamesMatch(game.awayTeam, away.team.displayName)) ||
        (teamNamesMatch(game.homeTeam, away.team.displayName) && teamNamesMatch(game.awayTeam, home.team.displayName))
      )
      .sort((left, right) =>
        Math.abs(Date.parse(`${left.date}T12:00:00Z`) - Date.parse(`${eventDate}T12:00:00Z`)) -
        Math.abs(Date.parse(`${right.date}T12:00:00Z`) - Date.parse(`${eventDate}T12:00:00Z`))
      )[0];
    if (!fixture) continue;

    const competition = event.competitions[0];
    const baseDate = fixture.date;
    const baseTime = fixture.time;
    const kickoffUtc = competition?.date ?? event.date;
    const kickoff = eventKickoffInSiteTimezone(kickoffUtc, league.timezone);
    const providerTimeValid = competition?.timeValid !== false;
    const providerMatchesRegistry = providerTimeValid && baseDate === kickoff.date && baseTime !== "TBD" && baseTime === kickoff.time;
    const retainConfirmedRegistryTime = baseTime !== "TBD" && (!providerTimeValid || (baseDate === kickoff.date && baseTime !== kickoff.time));
    fixture.id = event.id;
    fixture.homeTeam = cleanTeamName(home.team.displayName);
    fixture.awayTeam = cleanTeamName(away.team.displayName);
    fixture.sourceAgreement = providerMatchesRegistry;
    fixture.date = providerTimeValid ? kickoff.date : baseDate;
    fixture.timeConfirmed = providerMatchesRegistry || retainConfirmedRegistryTime;
    fixture.time = providerMatchesRegistry
      ? kickoff.time
      : retainConfirmedRegistryTime
        ? baseTime
        : "TBD";
    fixture.kickoffUtc = retainConfirmedRegistryTime
      ? localKickoffToUtc(baseDate, baseTime, league.timezone)
      : kickoffUtc;
    fixture.status = eventStatus(event);
    fixture.dataSource = "espn";

    if (fixture.status === "completed") {
      const homeScore = Number(home.score);
      const awayScore = Number(away.score);
      fixture.homeScore = Number.isFinite(homeScore) ? homeScore : null;
      fixture.awayScore = Number.isFinite(awayScore) ? awayScore : null;
    }
  }

  return rounds;
}

type SportsDbEvent = {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intRound?: string;
  strTimestamp?: string;
  strTime?: string;
  strStatus?: string;
  strPostponed?: string;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
};

function sportsDbStatus(event: SportsDbEvent): FixtureStatus {
  if (event.strPostponed === "yes") return "postponed";
  const status = (event.strStatus ?? "").toUpperCase();
  if (/CANC/.test(status)) return "canceled";
  if (/POSTP/.test(status)) return "postponed";
  if (/SUSP/.test(status)) return "suspended";
  if (/FT|MATCH FINISHED|FINISHED/.test(status)) return "completed";
  if (/LIVE|1H|2H|HT/.test(status)) return "in-progress";
  return "scheduled";
}

export async function hydrateTheSportsDb(slug: LeagueSlug, rounds: OpenFootballRound[]) {
  const league = leaguesBySlug[slug];
  if (!league.artworkId) return rounds;
  const seasonStart = Number(league.season.slice(0, 4));
  const season = league.season.includes("/")
    ? `${seasonStart}-${seasonStart + 1}`
    : league.season;
  const sportsDbKey = process.env.THESPORTSDB_API_KEY || "123";
  const response = await fetch(
    `https://www.thesportsdb.com/api/v1/json/${sportsDbKey}/eventsseason.php?id=${league.artworkId}&s=${season}`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );
  if (!response.ok) throw new Error(`${league.name}: TheSportsDB returned ${response.status}`);
  const data = (await response.json()) as { events?: SportsDbEvent[] };

  for (const event of data.events ?? []) {
    if (!event.strTimestamp) continue;
    const kickoffUtc = `${event.strTimestamp.replace(/Z$/, "")}Z`;
    if (!Number.isFinite(Date.parse(kickoffUtc))) continue;
    const kickoff = eventKickoffInSiteTimezone(kickoffUtc);
    const fixture = rounds.flatMap((round) => round.games)
      .filter((game) =>
        (teamNamesMatch(game.homeTeam, event.strHomeTeam) && teamNamesMatch(game.awayTeam, event.strAwayTeam)) ||
        (teamNamesMatch(game.homeTeam, event.strAwayTeam) && teamNamesMatch(game.awayTeam, event.strHomeTeam))
      )
      .sort((left, right) =>
        Math.abs(Date.parse(`${left.date}T12:00:00Z`) - Date.parse(`${kickoff.date}T12:00:00Z`)) -
        Math.abs(Date.parse(`${right.date}T12:00:00Z`) - Date.parse(`${kickoff.date}T12:00:00Z`))
      )[0];
    if (!fixture) continue;

    // Keep ESPN's event id when both providers matched the same fixture. It is
    // needed by the summary endpoint that supplies settlement statistics such
    // as corners. TheSportsDB remains a fallback identity when ESPN has none.
    fixture.id ??= `tsdb:${event.idEvent}`;
    fixture.homeTeam = cleanTeamName(event.strHomeTeam);
    fixture.awayTeam = cleanTeamName(event.strAwayTeam);
    fixture.round = Number(event.intRound) || fixture.round;
    fixture.date = kickoff.date;
    fixture.time = event.strTime ? kickoff.time : "TBD";
    fixture.kickoffUtc = kickoffUtc;
    fixture.timeConfirmed = Boolean(event.strTime);
    fixture.sourceAgreement = true;
    const incomingStatus = sportsDbStatus(event);
    const statusRank: Partial<Record<FixtureStatus, number>> = {
      scheduled: 0,
      rescheduled: 1,
      "in-progress": 2,
      suspended: 2,
      completed: 3,
      awarded: 3,
      postponed: 3,
      canceled: 3,
      abandoned: 3,
    };
    const providerIsFresher = (statusRank[incomingStatus] ?? 0) >= (statusRank[fixture.status ?? "scheduled"] ?? 0);
    if (providerIsFresher) {
      fixture.status = incomingStatus;
      fixture.dataSource = "thesportsdb";
    }
    const homeScore = Number(event.intHomeScore);
    const awayScore = Number(event.intAwayScore);
    if (incomingStatus === "completed" && event.intHomeScore !== null && event.intAwayScore !== null &&
        Number.isFinite(homeScore) && Number.isFinite(awayScore)) {
      fixture.homeScore = homeScore;
      fixture.awayScore = awayScore;
    }
  }
  return rounds;
}

export function loadLeagueSeason(
  slug: LeagueSlug,
  options: { forceRefresh?: boolean; ignoreSnapshot?: boolean } = {}
) {
  const config = openLeagueConfigs[slug];
  const savedRounds = snapshot.leagues[slug];

  if (config.manualOnly || !config.source) {
    return Promise.resolve(savedRounds?.length ? structuredClone(savedRounds) : []);
  }

  if (options.forceRefresh) {
    promises.delete(slug);
  }

  if (!promises.has(slug)) {
    if (!options.forceRefresh && !options.ignoreSnapshot && savedRounds?.length) {
      promises.set(slug, Promise.resolve(structuredClone(savedRounds)));
      return promises.get(slug)!;
    }
    promises.set(
      slug,
      fetchSeasonText(config)
        .then(parseFootballSeason)
        .then((rounds) => hydrateLiveResults(slug, rounds).catch(() =>
          savedRounds?.length ? structuredClone(savedRounds) : rounds
        ))
        .then((rounds) => hydrateTheSportsDb(slug, rounds).catch(() => rounds))
    );
  }

  return promises.get(slug)!;
}

export function loadDailyLeagueFixtures(slug: LeagueSlug, date: string) {
  const cacheKey = `${slug}:${date}`;

  if (openLeagueConfigs[slug].manualOnly) {
    return Promise.resolve([]);
  }

  if (!dailyPromises.has(cacheKey)) {
    dailyPromises.set(
      cacheKey,
      loadLeagueSeason(slug).then((rounds) =>
        rounds.flatMap((round) => round.games).filter((game) => game.date === date)
      )
    );
  }

  return dailyPromises.get(cacheKey)!;
}

export async function fetchDailyLeagueFixtures(slug: LeagueSlug, date: string) {
  const league = leaguesBySlug[slug];
  const compactDate = date.replace(/-/g, "");
  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.liveDataId}/scoreboard?dates=${compactDate}`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`${league.name}: daily fixtures returned ${response.status}`);
  }

  const data = (await response.json()) as { events?: LiveEvent[] };

  return (data.events ?? []).flatMap((event, index) => {
    const competitors = event.competitions[0]?.competitors ?? [];
    const home = competitors.find((item) => item.homeAway === "home");
    const away = competitors.find((item) => item.homeAway === "away");
    if (!home || !away) return [];

    const competition = event.competitions[0];
    const kickoffUtc = competition?.date ?? event.date;
    const kickoff = eventKickoffInSiteTimezone(kickoffUtc, league.timezone);
    if (kickoff.date !== date) return [];

    const status = eventStatus(event);
    const homeScore = Number(home.score);
    const awayScore = Number(away.score);

    return [{
      round: index + 1,
      id: event.id,
      date: kickoff.date,
      time: competition?.timeValid === false ? "TBD" : kickoff.time,
      kickoffUtc,
      timeConfirmed: competition?.timeValid !== false,
      homeTeam: cleanTeamName(home.team.displayName),
      awayTeam: cleanTeamName(away.team.displayName),
      homeScore: Number.isFinite(homeScore) ? homeScore : null,
      awayScore: Number.isFinite(awayScore) ? awayScore : null,
      status,
      dataSource: "espn" as const,
    }];
  });
}

export function getCentralCurrentRound(rounds: OpenFootballRound[], now = new Date()) {
  return getCurrentRound(rounds, now);
}

export function computeStandings(
  rounds: OpenFootballRound[]
): ComputedStanding[] {
  const map = new Map<
    string,
    Omit<ComputedStanding, "position" | "goalDifference">
  >();

  function ensure(team: string) {
    if (!map.has(team)) {
      map.set(team, {
        team,
        played: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      });
    }

    return map.get(team)!;
  }

  for (const round of rounds) {
    for (const game of round.games) {
      const home = ensure(game.homeTeam);
      const away = ensure(game.awayTeam);

      if (game.homeScore === null || game.awayScore === null) {
        continue;
      }

      home.played += 1;
      away.played += 1;

      home.goalsFor += game.homeScore;
      home.goalsAgainst += game.awayScore;

      away.goalsFor += game.awayScore;
      away.goalsAgainst += game.homeScore;

      if (game.homeScore > game.awayScore) {
        home.points += 3;
      } else if (game.homeScore < game.awayScore) {
        away.points += 3;
      } else {
        home.points += 1;
        away.points += 1;
      }
    }
  }

  return [...map.values()]
    .map((row) => ({
      ...row,
      goalDifference: row.goalsFor - row.goalsAgainst,
    }))
    .sort((a, b) => {
      return (
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.team.localeCompare(b.team)
      );
    })
    .map((row, index) => ({
      ...row,
      position: index + 1,
    }));
}


export function findFixtureByTeams(
  rounds: OpenFootballRound[],
  homeTeam: string,
  awayTeam: string
): OpenFootballGame | null {
  for (const round of rounds) {
    const game = round.games.find(
      (fixture) =>
        teamNamesMatch(fixture.homeTeam, homeTeam) &&
        teamNamesMatch(fixture.awayTeam, awayTeam)
    );

    if (game) {
      return game;
    }
  }

  return null;
}

export function findFixtureForPrediction(
  rounds: OpenFootballRound[],
  prediction: { league: LeagueSlug; slug: string; homeTeam: string; awayTeam: string }
) {
  const providerId = snapshot.predictionIds[`${prediction.league}:${prediction.slug}`];
  if (providerId) {
    const byId = rounds.flatMap((round) => round.games).find((game) => game.id === providerId);
    if (byId) return byId;
    const manualFixture = snapshot.manualFixtures?.[providerId];
    if (manualFixture) return manualFixture;
  }

  return findFixtureByTeams(rounds, prediction.homeTeam, prediction.awayTeam);
}
