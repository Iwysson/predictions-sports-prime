import type { LeagueSlug } from "@/types";

export type LeagueConfig = {
  slug: LeagueSlug;
  name: string;
  country: string;
  short: string;
  season: string;
  featured: boolean;
  display: { showOnHome: boolean; showStandings: boolean };
  sources: { fixtures: string; standings: string };
  expectedClubs: number;
  expectedGamesPerRound: number;
  artworkId?: number;
  liveDataId: string;
};

const source = (path: string) => `https://raw.githubusercontent.com/openfootball/${path}`;

function defineLeague(
  config: Omit<LeagueConfig, "season" | "display" | "sources"> & {
    sourcePath: string;
    showOnHome?: boolean;
  }
): LeagueConfig {
  const { sourcePath, showOnHome, ...metadata } = config;
  const feed = source(sourcePath);
  return {
    ...metadata,
    season: "2026/27",
    display: {
      showOnHome: showOnHome ?? config.featured,
      showStandings: true,
    },
    sources: { fixtures: feed, standings: feed },
  };
}

export const leagues: LeagueConfig[] = [
  defineLeague({ slug: "premier-league", name: "Premier League", country: "England", short: "PL", featured: true, sourcePath: "england/refs/heads/master/2026-27/1-premierleague.txt", expectedClubs: 20, expectedGamesPerRound: 10, artworkId: 4328, liveDataId: "eng.1" }),
  defineLeague({ slug: "la-liga", name: "La Liga", country: "Spain", short: "LL", featured: true, sourcePath: "espana/refs/heads/master/2026-27/1-liga.txt", expectedClubs: 20, expectedGamesPerRound: 10, artworkId: 4335, liveDataId: "esp.1" }),
  defineLeague({ slug: "bundesliga", name: "Bundesliga", country: "Germany", short: "BL", featured: true, sourcePath: "deutschland/refs/heads/master/2026-27/1-bundesliga.txt", expectedClubs: 18, expectedGamesPerRound: 9, artworkId: 4331, liveDataId: "ger.1" }),
  defineLeague({ slug: "serie-a", name: "Serie A", country: "Italy", short: "SA", featured: true, sourcePath: "italy/refs/heads/master/2026-27/1-seriea.txt", expectedClubs: 20, expectedGamesPerRound: 10, artworkId: 4332, liveDataId: "ita.1" }),
  defineLeague({ slug: "liga-portugal", name: "Liga Portugal", country: "Portugal", short: "LP", featured: false, sourcePath: "europe/refs/heads/master/portugal/2026-27_pt1.txt", expectedClubs: 18, expectedGamesPerRound: 9, liveDataId: "por.1" }),
  defineLeague({ slug: "ligue-1", name: "Ligue 1", country: "France", short: "L1", featured: false, showOnHome: true, sourcePath: "europe/refs/heads/master/france/2026-27_fr1.txt", expectedClubs: 18, expectedGamesPerRound: 9, artworkId: 4334, liveDataId: "fra.1" }),
];

export const leaguesBySlug = Object.fromEntries(
  leagues.map((item) => [item.slug, item])
) as Record<LeagueSlug, LeagueConfig>;

export const featuredLeagues = leagues.filter((item) => item.featured);

export const homeLeagues = leagues.filter(
  (item) => item.display.showOnHome
);

export const otherLeaguesCard = {
  slug: "other-leagues",
  name: "Other Leagues",
  country: "Selected matches",
  short: "+",
  href: "/#other-leagues",
};
