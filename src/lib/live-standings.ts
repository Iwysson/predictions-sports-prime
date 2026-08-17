import type { LeagueSlug } from "@/types";
import type { StandingRow } from "@/data/standings";
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
  const response = await fetch(
    `https://site.api.espn.com/apis/v2/sports/soccer/${league.liveDataId}/standings?season=2026`,
    { headers: { Accept: "application/json" } }
  );

  if (!response.ok) throw new Error(`${league.name}: standings returned ${response.status}`);

  const data = (await response.json()) as {
    children?: Array<{ standings?: { entries?: Entry[] } }>;
  };
  const entries = data.children?.[0]?.standings?.entries ?? [];

  if (entries.length !== league.expectedClubs) {
    throw new Error(`${league.name}: expected ${league.expectedClubs} standings rows, received ${entries.length}`);
  }

  return entries
    .map((entry) => ({
      position: stat(entry, "rank"),
      team: entry.team.displayName,
      played: stat(entry, "gamesPlayed"),
      points: stat(entry, "points"),
      goalDifference: stat(entry, "pointDifferential"),
    }))
    .sort((left, right) => left.position - right.position);
}
