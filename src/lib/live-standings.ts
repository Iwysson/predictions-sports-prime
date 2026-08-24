import type { LeagueSlug } from "@/types";
import { normalizeStandingRow, validateStandingRows, type StandingRow } from "@/data/standings";
import { leaguesBySlug } from "@/data/leagues";

type Stat = { name: string; value: number };
type Entry = {
  team: { displayName: string };
  stats: Stat[];
};

function stat(entry: Entry, name: string) {
  return entry.stats.find((item) => item.name === name)?.value ?? 0;
}

export async function loadLiveStandings(slug: LeagueSlug): Promise<StandingRow[]> {
  const league = leaguesBySlug[slug];
  if (!league.liveDataId) {
    return [];
  }
  const response = await fetch(
    `https://site.api.espn.com/apis/v2/sports/soccer/${league.liveDataId}/standings?season=2026`,
    { headers: { Accept: "application/json" } }
  );

  if (!response.ok) throw new Error(`${league.name}: standings returned ${response.status}`);

  const data = (await response.json()) as {
    children?: Array<{ standings?: { entries?: Entry[] } }>;
  };
  const entries = data.children?.[0]?.standings?.entries ?? [];

  const rows = entries
    .map((entry) => ({
      position: stat(entry, "rank"),
      team: entry.team.displayName,
      played: stat(entry, "gamesPlayed"),
      wins: stat(entry, "wins"),
      draws: stat(entry, "ties"),
      losses: stat(entry, "losses"),
      goalsFor: stat(entry, "pointsFor"),
      goalsAgainst: stat(entry, "pointsAgainst"),
      points: stat(entry, "points"),
      goalDifference: stat(entry, "pointDifferential"),
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
