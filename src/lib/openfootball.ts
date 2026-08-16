import { LeagueSlug } from "@/types";

export type OpenFootballGame = {
  round: number;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
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
  slug: Exclude<LeagueSlug, "other-leagues">;
  source: string;
  expectedClubs: number;
  expectedGamesPerRound: number;
  label: string;
};

export const openLeagueConfigs: Record<
  Exclude<LeagueSlug, "other-leagues">,
  OpenLeagueConfig
> = {
  "premier-league": {
    slug: "premier-league",
    source:
      "https://raw.githubusercontent.com/openfootball/england/refs/heads/master/2026-27/1-premierleague.txt",
    expectedClubs: 20,
    expectedGamesPerRound: 10,
    label: "Premier League",
  },
  "la-liga": {
    slug: "la-liga",
    source:
      "https://raw.githubusercontent.com/openfootball/espana/refs/heads/master/2026-27/1-liga.txt",
    expectedClubs: 20,
    expectedGamesPerRound: 10,
    label: "La Liga",
  },
  bundesliga: {
    slug: "bundesliga",
    source:
      "https://raw.githubusercontent.com/openfootball/deutschland/refs/heads/master/2026-27/1-bundesliga.txt",
    expectedClubs: 18,
    expectedGamesPerRound: 9,
    label: "Bundesliga",
  },
  "serie-a": {
    slug: "serie-a",
    source:
      "https://raw.githubusercontent.com/openfootball/italy/refs/heads/master/2026-27/1-seriea.txt",
    expectedClubs: 20,
    expectedGamesPerRound: 10,
    label: "Serie A",
  },
};

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

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function cleanTeamName(name: string) {
  return name
    .trim()
    .replace(/\s+FC$/i, "")
    .replace(/\s+AFC$/i, "")
    .replace(/^AFC\s+/i, "")
    .replace(/\s+CF$/i, "")
    .replace(/^FC\s+/i, "")
    .trim();
}

export function normalizeTeamKey(name: string) {
  return cleanTeamName(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
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
      currentRound = {
        round: Number(roundMatch[1]),
        games: [],
      };
      rounds.push(currentRound);
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
    });
  }

  return rounds.filter((round) => round.games.length > 0);
}

async function fetchSeasonText(config: OpenLeagueConfig) {
  const cacheKey = `psp-openfootball-${config.slug}-2026-27`;
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

export function loadLeagueSeason(
  slug: Exclude<LeagueSlug, "other-leagues">
) {
  const config = openLeagueConfigs[slug];

  if (!promises.has(slug)) {
    promises.set(
      slug,
      fetchSeasonText(config).then(parseFootballSeason)
    );
  }

  return promises.get(slug)!;
}

function localTodayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function findCurrentOrNextRound(
  rounds: OpenFootballRound[],
  today = localTodayIso()
) {
  const candidate = rounds.find((round) => {
    const dates = round.games.map((game) => game.date).sort();
    return dates[dates.length - 1] >= today;
  });

  return candidate ?? rounds[rounds.length - 1] ?? null;
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
  const homeKey = normalizeTeamKey(homeTeam);
  const awayKey = normalizeTeamKey(awayTeam);

  for (const round of rounds) {
    const game = round.games.find(
      (fixture) =>
        normalizeTeamKey(fixture.homeTeam) === homeKey &&
        normalizeTeamKey(fixture.awayTeam) === awayKey
    );

    if (game) {
      return game;
    }
  }

  return null;
}
