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
  timezone: string;
  manualOnly?: boolean;
  asset:
    | { kind: "image"; src: string; sourceUrl: string }
    | { kind: "text"; label: string; reason: string };
};

const graphicalLeagueAssets: Partial<
  Record<LeagueSlug, { src: string; sourceUrl: string }>
> = {
  "premier-league": { src: "/league-badges/premier-league.png", sourceUrl: "https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png" },
  "la-liga": { src: "/league-badges/la-liga.png", sourceUrl: "https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png" },
  bundesliga: { src: "/league-badges/bundesliga.png", sourceUrl: "https://r2.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png" },
  "serie-a": { src: "/league-badges/serie-a.png", sourceUrl: "https://r2.thesportsdb.com/images/media/league/badge/67q3q21679951383.png" },
  "ligue-1": { src: "/league-badges/ligue-1.png", sourceUrl: "https://r2.thesportsdb.com/images/media/league/badge/9f7z9d1742983155.png" },
  "brasileirao-serie-a": { src: "/league-badges/brasileirao-serie-a.png", sourceUrl: "https://r2.thesportsdb.com/images/media/league/badge/lywv7t1766787179.png" },
  "liga-portugal": { src: "/league-badges/liga-portugal.png", sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/S%C3%ADmbolo_da_Liga_Portuguesa_de_Futebol_Profissional.png" },
  eredivisie: { src: "/league-badges/eredivisie.png", sourceUrl: "https://eredivisie.b-cdn.net/production/VLED-SOCIAL-ICON.png" },
  "copa-do-brasil": { src: "/league-badges/copa-do-brasil.png", sourceUrl: "https://r2.thesportsdb.com/images/media/league/badge/h38dax1582151151.png" },
  "efl-cup": { src: "/league-badges/efl-cup.png", sourceUrl: "https://r2.thesportsdb.com/images/media/league/badge/x1va771565372556.png" },
};

const source = (path: string) => `https://raw.githubusercontent.com/openfootball/${path}`;

function defineLeague(
  config: Omit<LeagueConfig, "season" | "display" | "sources" | "asset"> & {
    sourcePath?: string;
    sourceUrl?: string;
    seasonLabel?: string;
    showOnHome?: boolean;
    showStandings?: boolean;
  }
): LeagueConfig {
  const {
    sourcePath,
    sourceUrl,
    seasonLabel,
    showOnHome,
    showStandings,
    manualOnly,
    ...metadata
  } = config;
  const feed = manualOnly ? "" : (sourceUrl ?? source(sourcePath!));
  const graphicalAsset = graphicalLeagueAssets[metadata.slug];
  return {
    ...metadata,
    manualOnly,
    season: seasonLabel ?? "2026/27",
    display: {
      showOnHome: showOnHome ?? config.featured,
      showStandings: showStandings ?? true,
    },
    sources: { fixtures: feed, standings: feed },
    asset: graphicalAsset
      ? { kind: "image", ...graphicalAsset }
      : {
          kind: "text",
          label: metadata.short,
          reason: metadata.slug === "liga-portugal" || metadata.slug === "eredivisie"
            ? "source badge is not visible on light surfaces"
            : "no factual graphical asset is configured",
        },
  };
}

export const leagues: LeagueConfig[] = [
  defineLeague({ slug: "premier-league", name: "Premier League", country: "England", short: "PL", featured: true, sourcePath: "england/refs/heads/master/2026-27/1-premierleague.txt", expectedClubs: 20, expectedGamesPerRound: 10, artworkId: 4328, liveDataId: "eng.1", timezone: "Europe/London" }),
  defineLeague({ slug: "la-liga", name: "La Liga", country: "Spain", short: "LL", featured: true, sourcePath: "espana/refs/heads/master/2026-27/1-liga.txt", expectedClubs: 20, expectedGamesPerRound: 10, artworkId: 4335, liveDataId: "esp.1", timezone: "Europe/Madrid" }),
  defineLeague({ slug: "bundesliga", name: "Bundesliga", country: "Germany", short: "BL", featured: true, sourcePath: "deutschland/refs/heads/master/2026-27/1-bundesliga.txt", expectedClubs: 18, expectedGamesPerRound: 9, artworkId: 4331, liveDataId: "ger.1", timezone: "Europe/Berlin" }),
  defineLeague({ slug: "serie-a", name: "Serie A", country: "Italy", short: "SA", featured: true, sourcePath: "italy/refs/heads/master/2026-27/1-seriea.txt", expectedClubs: 20, expectedGamesPerRound: 10, artworkId: 4332, liveDataId: "ita.1", timezone: "Europe/Rome" }),
  defineLeague({ slug: "liga-portugal", name: "Liga Portugal", country: "Portugal", short: "LP", featured: false, showOnHome: true, sourcePath: "europe/refs/heads/master/portugal/2026-27_pt1.txt", expectedClubs: 18, expectedGamesPerRound: 9, artworkId: 4344, liveDataId: "por.1", timezone: "Europe/Lisbon" }),
  defineLeague({ slug: "ligue-1", name: "Ligue 1", country: "France", short: "L1", featured: false, showOnHome: true, sourcePath: "europe/refs/heads/master/france/2026-27_fr1.txt", expectedClubs: 18, expectedGamesPerRound: 9, artworkId: 4334, liveDataId: "fra.1", timezone: "Europe/Paris" }),
  defineLeague({ slug: "eredivisie", name: "VriendenLoterij Eredivisie", country: "Netherlands", short: "ERE", featured: false, showOnHome: true, sourcePath: "europe/refs/heads/master/netherlands/2026-27_nl1.txt", expectedClubs: 18, expectedGamesPerRound: 9, artworkId: 4337, liveDataId: "ned.1", timezone: "Europe/Amsterdam" }),
  defineLeague({ slug: "brasileirao-serie-a", name: "Brasileirão Série A", country: "Brazil", short: "BRA", seasonLabel: "2026", featured: false, showOnHome: true, sourceUrl: "/data/brasileirao-2026.txt", expectedClubs: 20, expectedGamesPerRound: 10, artworkId: 4351, liveDataId: "bra.1", timezone: "America/Sao_Paulo" }),
  defineLeague({ slug: "copa-do-brasil", name: "Copa do Brasil", country: "Brazil", short: "CDB", seasonLabel: "2026", featured: false, showOnHome: true, manualOnly: true, showStandings: false, expectedClubs: 8, expectedGamesPerRound: 4, artworkId: 4725, timezone: "America/Sao_Paulo", liveDataId: "" }),
  defineLeague({ slug: "efl-cup", name: "EFL Cup", country: "England", short: "EFL", featured: false, showOnHome: true, manualOnly: true, showStandings: false, expectedClubs: 24, expectedGamesPerRound: 12, artworkId: 4570, timezone: "Europe/London", liveDataId: "" }),
];

export const leaguesBySlug = Object.fromEntries(
  leagues.map((item) => [item.slug, item])
) as Record<LeagueSlug, LeagueConfig>;

export const featuredLeagues = leagues.filter((item) => item.featured);

export const homeLeagues = leagues.filter(
  (item) => item.display.showOnHome
);

export const primaryPredictionLeagueSlugs = [
  "premier-league",
  "la-liga",
  "bundesliga",
  "serie-a",
  "ligue-1",
  "liga-portugal",
  "eredivisie",
  "brasileirao-serie-a",
] as const satisfies readonly LeagueSlug[];

export const primaryPredictionLeagues = primaryPredictionLeagueSlugs.map(
  (slug) => {
    const league = leaguesBySlug[slug];
    return slug === "eredivisie" ? { ...league, name: "Eredivisie" } : league;
  }
);
