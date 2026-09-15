import type { LeagueSlug } from "@/types";
import { normalizeStandingRow, validateStandingRows, type StandingRow } from "@/data/standings";
import { leaguesBySlug } from "@/data/leagues";

type Stat = { name: string; value: number };
type Entry = {
  team: { displayName: string };
  stats: Stat[];
};

function stat(entry: Entry, ...names: string[]) {
  for (const name of names) {
    const value = entry.stats.find((item) => item.name === name)?.value;
    if (Number.isFinite(value)) return value;
  }
  return undefined;
}

function requiredStat(entry: Entry, label: string, ...names: string[]) {
  const value = stat(entry, ...names);
  if (value === undefined) throw new Error(`${entry.team.displayName}: missing ${label}`);
  return value;
}

export async function loadLiveStandings(slug: LeagueSlug): Promise<StandingRow[]> {
  const league = leaguesBySlug[slug];
  if (!league.liveDataId || !league.display.showStandings) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  let response: Response;
  try {
    response = await fetch(
      `https://site.api.espn.com/apis/v2/sports/soccer/${league.liveDataId}/standings?season=2026`,
      { headers: { Accept: "application/json" }, signal: controller.signal, cache: "no-store" },
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) throw new Error(`${league.name}: standings returned ${response.status}`);

  const data = (await response.json()) as {
    children?: Array<{ standings?: { entries?: Entry[] } }>;
  };
  const entries = data.children?.[0]?.standings?.entries ?? [];
  if (!entries.length) throw new Error(`${league.name}: standings source returned no rows`);

  const rows = entries
    .map((entry) => ({
      position: requiredStat(entry, "rank", "rank"),
      team: entry.team.displayName,
      played: requiredStat(entry, "games played", "gamesPlayed"),
      wins: requiredStat(entry, "wins", "wins"),
      draws: requiredStat(entry, "draws", "ties", "draws"),
      losses: requiredStat(entry, "losses", "losses"),
      goalsFor: requiredStat(entry, "goals for", "pointsFor", "goalsFor"),
      goalsAgainst: requiredStat(entry, "goals against", "pointsAgainst", "goalsAgainst"),
      points: requiredStat(entry, "points", "points"),
      goalDifference: stat(entry, "pointDifferential", "goalDifference"),
    }))
    .map(normalizeStandingRow)
    .sort((left, right) => left.position - right.position);

  const errors = validateStandingRows(rows, {
    expectedClubs: league.expectedClubs,
    requireCompleteStats: true,
  });
  if (errors.length > 0) throw new Error(`${league.name}: ${errors.join("; ")}`);
  return rows;
}
