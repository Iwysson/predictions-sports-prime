// Single source of truth for NHL live state. Used by the runtime endpoint (functions/api/nhl/status.js)
// and by the client cards. Pure: no fetch, no time. Kickoff time never implies LIVE, and anything
// unrecognised fails closed (not LIVE).

export type MatchStatus = "scheduled" | "live" | "finished" | "unknown";

export type LiveGame = {
  gameId: number;
  home: string;
  away: string;
  state: MatchStatus;
  period: string | null;
  clock: string | null;
};

// NHL Web API gameState values (https://api-web.nhle.com/v1/score/{YYYY-MM-DD}).
const GAME_STATE: Record<string, MatchStatus> = {
  FUT: "scheduled",
  PRE: "scheduled",
  LIVE: "live",
  CRIT: "live",
  FINAL: "finished",
  OFF: "finished",
};

export function mapGameState(raw: unknown): MatchStatus {
  return typeof raw === "string" && Object.prototype.hasOwnProperty.call(GAME_STATE, raw) ? GAME_STATE[raw] : "unknown";
}

// Official NHL abbreviations for every team on the published slates. A team missing here can never
// be matched, so its game can never show LIVE.
export const NHL_ABBREV: Record<string, string> = {
  "Anaheim Ducks": "ANA",
  "Boston Bruins": "BOS",
  "Buffalo Sabres": "BUF",
  "Calgary Flames": "CGY",
  "Carolina Hurricanes": "CAR",
  "Chicago Blackhawks": "CHI",
  "Colorado Avalanche": "COL",
  "Columbus Blue Jackets": "CBJ",
  "Dallas Stars": "DAL",
  "Detroit Red Wings": "DET",
  "Edmonton Oilers": "EDM",
  "Florida Panthers": "FLA",
  "Los Angeles Kings": "LAK",
  "Minnesota Wild": "MIN",
  "Montreal Canadiens": "MTL",
  "Nashville Predators": "NSH",
  "New Jersey Devils": "NJD",
  "New York Islanders": "NYI",
  "New York Rangers": "NYR",
  "Ottawa Senators": "OTT",
  "Philadelphia Flyers": "PHI",
  "Pittsburgh Penguins": "PIT",
  "San Jose Sharks": "SJS",
  "Seattle Kraken": "SEA",
  "St. Louis Blues": "STL",
  "Tampa Bay Lightning": "TBL",
  "Toronto Maple Leafs": "TOR",
  "Utah Mammoth": "UTA",
  "Vancouver Canucks": "VAN",
  "Vegas Golden Knights": "VGK",
  "Washington Capitals": "WSH",
  "Winnipeg Jets": "WPG",
};

export function periodLabel(descriptor: unknown): string | null {
  const d = descriptor as { number?: unknown; periodType?: unknown } | null;
  if (!d || typeof d !== "object" || typeof d.number !== "number") return null;
  if (d.periodType === "OT") return "OT";
  if (d.periodType === "SO") return "SO";
  return ["1st", "2nd", "3rd"][d.number - 1] ?? null;
}

// Clock only when the provider sends a well-formed mm:ss. It is never computed here.
export function clockLabel(clock: unknown): string | null {
  const c = clock as { timeRemaining?: unknown; inIntermission?: unknown } | null;
  if (!c || typeof c !== "object" || c.inIntermission === true) return null;
  return typeof c.timeRemaining === "string" && /^\d{1,2}:[0-5]\d$/.test(c.timeRemaining) ? c.timeRemaining : null;
}

// Validates a provider payload and keeps only the fields the site needs. Returns null when the
// payload shape is wrong (the caller then treats the whole day as unavailable).
export function normalizeScore(payload: unknown): LiveGame[] | null {
  const games = (payload as { games?: unknown } | null)?.games;
  if (!Array.isArray(games)) return null;
  const out: LiveGame[] = [];
  for (const g of games) {
    const game = g as Record<string, any> | null;
    const home = game?.homeTeam?.abbrev;
    const away = game?.awayTeam?.abbrev;
    if (typeof game?.id !== "number" || typeof home !== "string" || typeof away !== "string") continue;
    const state = mapGameState(game.gameState);
    const live = state === "live";
    out.push({
      gameId: game.id,
      home,
      away,
      state,
      period: live ? periodLabel(game.periodDescriptor) : null,
      clock: live ? clockLabel(game.clock) : null,
    });
  }
  return out;
}

// Matches a slate game by official home and away abbreviations, in that order. No fuzzy name match:
// if either team is unknown or the order differs, nothing matches.
export function findLiveGame(games: LiveGame[], homeTeam: string, awayTeam: string): LiveGame | null {
  const home = NHL_ABBREV[homeTeam];
  const away = NHL_ABBREV[awayTeam];
  if (!home || !away) return null;
  return games.find((g) => g.home === home && g.away === away) ?? null;
}

// Text shown inside the LIVE badge, or null when the game is not live. Period and clock appear
// only when the provider sent them: "LIVE", "LIVE · 2nd", "LIVE · 2nd · 08:42".
export function liveBadgeText(game: LiveGame | null): string | null {
  if (!game || game.state !== "live") return null;
  return ["LIVE", game.period, game.clock].filter(Boolean).join(" · ");
}

// Final-score extraction, used only by history/settlement (never by the LIVE badge path above).
// Kept separate from normalizeScore so the existing LIVE payload shape/contract is never touched.
export type FinalScoreGame = {
  home: string; // official abbreviation
  away: string; // official abbreviation
  homeScore: number;
  awayScore: number;
  state: MatchStatus;
};

export function normalizeFinalScores(payload: unknown): FinalScoreGame[] | null {
  const games = (payload as { games?: unknown } | null)?.games;
  if (!Array.isArray(games)) return null;
  const out: FinalScoreGame[] = [];
  for (const g of games) {
    const game = g as Record<string, any> | null;
    const home = game?.homeTeam?.abbrev;
    const away = game?.awayTeam?.abbrev;
    const homeScore = game?.homeTeam?.score;
    const awayScore = game?.awayTeam?.score;
    if (typeof game?.id !== "number" || typeof home !== "string" || typeof away !== "string") continue;
    if (typeof homeScore !== "number" || typeof awayScore !== "number") continue;
    out.push({ home, away, homeScore, awayScore, state: mapGameState(game.gameState) });
  }
  return out;
}

// Matches a slate game to its final score by official abbreviations, same rule as findLiveGame.
export function findFinalScore(games: FinalScoreGame[], homeTeam: string, awayTeam: string): FinalScoreGame | null {
  const home = NHL_ABBREV[homeTeam];
  const away = NHL_ABBREV[awayTeam];
  if (!home || !away) return null;
  return games.find((g) => g.home === home && g.away === away) ?? null;
}
