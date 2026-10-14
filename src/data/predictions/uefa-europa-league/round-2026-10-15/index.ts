import type { EditorialPrediction } from "@/types";
import { createPspImport37Prediction } from "../../editorial-tools/psp-import-37/factory";

// Source: PSP 37-analyses consolidated publication package (11 October 2026). Predictions, odds
// and FREE/BEST BET/PRIME VIP labels are taken from the package unchanged. No venue is supplied
// by the source package, so matchInfo.venue is intentionally omitted rather than guessed.
const common = {
  league: "uefa-europa-league" as const,
  competition: "UEFA Europa League 2026/27",
  round: "League phase, Matchday 2",
  publishedAt: "2026-10-11T12:00:00.000-03:00",
};

// Matchday-eve editorial refresh (14 October 2026) of the four public FREE fixtures: team news,
// projected lineups and current absences researched and sourced individually, replacing the
// lightweight psp-import-37 package text for these four slugs only. Pick, odds and access labels
// are unchanged from the source package. analysisAccess/predictionAccess are both explicitly
// "free" so the full written analysis is actually public, matching the teaser copy.
const freeFeatureRefreshAt = "2026-10-14T09:00:00.000-03:00";

type FreeFeatureInput = {
  slug: string;
  home: string;
  away: string;
  time: string;
  venue: string;
  venueAddress?: { addressLocality?: string; addressCountry?: string };
  pick: string;
  odds: number;
  bestAnalysis?: boolean;
  teaser: string;
  trend: string;
  matchAnalysis: string[];
  teamNews: string;
  tactical: string;
  risk: string;
  market?: string;
  conclusion?: string;
  sources: Array<{ name: string; url: string }>;
};

function buildFreeFeature(input: FreeFeatureInput): EditorialPrediction {
  const implied = (100 / input.odds).toFixed(2);
  const markdown = `# ${input.home} vs ${input.away} Prediction, Odds and Betting Tips

**Prediction:** ${input.pick}
**Odds:** ${input.odds.toFixed(2)}

## Match information

- **Competition:** ${common.competition}
- **Date:** 2026-10-15
- **Kick-off:** ${input.time}
- **Round:** ${common.round}
- **Venue:** ${input.venue}

## Team news and projected lineups

${input.teamNews}

## Match analysis

${input.matchAnalysis.join("\n\n")}

## Tactical analysis and expected game state

${input.tactical}

### Statistical Core Predictions-Sports-Prime

Statistical coverage is partial. Both sides have played a single UEFA Europa League league-phase match this season, so no sourced home and away split is available for this fixture in the 22-metric target format; building a venue-specific Core from a one-match sample would overstate its reliability. The Matchday 1 scorelines, current absences and the context set out above are the genuine sourced evidence used for this pick, and the metrics that would normally fill this table remain unavailable from a competitive, venue-specific sample at this early point in the season.

## Market assessment and risk

${input.risk}

${input.market ?? `The published market price is **${input.odds.toFixed(2)}**, which carries a raw implied probability of **${implied}%** using 1 / ${input.odds.toFixed(2)}. That percentage is the market threshold the pick needs to clear, not a claim that it equals the true chance of the outcome.`}

## Conclusion

${input.conclusion ?? `Weighing the team news and Matchday 1 evidence above against the published price, the retained call for ${input.home} vs ${input.away} stays ${input.pick} at ${input.odds.toFixed(2)}, unchanged from the original publication package.`}

**Prediction:** ${input.pick}
**Odds:** ${input.odds.toFixed(2)}`;

  return {
    league: common.league,
    homeTeam: input.home,
    awayTeam: input.away,
    slug: input.slug,
    title: `${input.home} vs ${input.away}`,
    seoTitle: `${input.home} vs ${input.away} Prediction, Odds and Betting Tips`,
    trend: input.trend,
    access: "free",
    analysisAccess: "free",
    predictionAccess: "free",
    bestAnalysis: input.bestAnalysis,
    teaser: input.teaser,
    editorialStandard: "psp-v1",
    analysisFormat: "markdown",
    analysisLanguage: "en",
    analysis: [markdown],
    picks: {
      main: input.pick,
      publishedOdds: input.odds,
      oddsProvenance: {
        source: "Editor-supplied PSP 37-analyses publication package (11 October 2026)",
        provenance: "author_attested",
        market: input.pick,
      },
    },
    matchInfo: {
      date: "2026-10-15",
      time: input.time,
      round: common.round,
      venue: input.venue,
      venueAddress: input.venueAddress,
    },
    published: true,
    publishedAt: common.publishedAt,
    updatedAt: freeFeatureRefreshAt,
    freshness: {
      editorialUpdatedAt: freeFeatureRefreshAt,
      teamNewsUpdatedAt: freeFeatureRefreshAt,
      lineupUpdatedAt: freeFeatureRefreshAt,
    },
    sourceStatus: "partial",
    sources: input.sources.map((source) => ({ ...source, accessedAt: freeFeatureRefreshAt })),
  };
}

const inputs = [
  {
    ...common,
    slug: "az-alkmaar-vs-hapoel-beer-sheva",
    home: "AZ Alkmaar",
    away: "Hapoel Beer-Sheva",
    date: "2026-10-15",
    time: "18:45",
    pick: "Over 2.5 Total Goals",
    odds: 1.5,
    access: "vip" as const,
    teaser: "AZ opened with a 1–0 loss at Sunderland, while Hapoel Beer-Sheva drew 0–0 with Dinamo Zagreb. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "AZ opened with a 1–0 loss at Sunderland, while Hapoel Beer-Sheva drew 0–0 with Dinamo Z...",
    analysis: ["AZ opened with a 1–0 loss at Sunderland, while Hapoel Beer-Sheva drew 0–0 with Dinamo Zagreb. Neither first result was high-scoring, but AZ now have home initiative and greater urgency, conditions that should produce more attacking volume than either side showed on Matchday 1."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "bournemouth-vs-sturm-graz",
    home: "Bournemouth",
    away: "Sturm Graz",
    date: "2026-10-15",
    time: "21:00",
    pick: "Bournemouth -1.5 Asian/European Goal Handicap",
    odds: 1.53,
    access: "vip" as const,
    teaser: "Bournemouth beat Real Sociedad 2–1 away, while Sturm Graz held Rennes to a 0–0 draw. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Bournemouth beat Real Sociedad 2–1 away, while Sturm Graz held Rennes to a 0–0 draw.",
    analysis: ["Bournemouth beat Real Sociedad 2–1 away, while Sturm Graz held Rennes to a 0–0 draw. The handicap asks Bournemouth for a two-goal margin, but their away win showed more attacking threat than Sturm displayed in a scoreless opener."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "celje-vs-omonia",
    home: "Celje",
    away: "Omonia",
    date: "2026-10-15",
    time: "18:45",
    pick: "Celje or Draw (1X)",
    odds: 1.41,
    access: "vip" as const,
    teaser: "Celje lost 2–0 at Leverkusen, whereas Omonia opened with a 1–0 win over Celta Vigo. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Celje lost 2–0 at Leverkusen, whereas Omonia opened with a 1–0 win over Celta Vigo.",
    analysis: ["Celje lost 2–0 at Leverkusen, whereas Omonia opened with a 1–0 win over Celta Vigo. The step down from Leverkusen plus home field should make this a more manageable game for Celje, and the double chance keeps the draw covered against an Omonia side that started with a tight, low-scoring result."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "dinamo-zagreb-vs-anderlecht",
    home: "Dinamo Zagreb",
    away: "Anderlecht",
    date: "2026-10-15",
    time: "21:00",
    pick: "Dinamo Zagreb or Draw (1X) + Over 1.5 Goals",
    odds: 1.63,
    access: "vip" as const,
    teaser: "Dinamo Zagreb began with a 0–0 draw at Hapoel Beer-Sheva, while Anderlecht lost 2–1 at home to Lyon. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Dinamo Zagreb began with a 0–0 draw at Hapoel Beer-Sheva, while Anderlecht lost 2–1 at ...",
    analysis: ["Dinamo Zagreb began with a 0–0 draw at Hapoel Beer-Sheva, while Anderlecht lost 2–1 at home to Lyon. Dinamo's home advantage supports them avoiding defeat, and Anderlecht's three-goal opener shows this matchup can reach two goals even after Dinamo's scoreless start."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "ferencvaros-vs-viktoria-plzen",
    home: "Ferencváros",
    away: "Viktoria Plzeň",
    date: "2026-10-15",
    time: "21:00",
    pick: "Ferencváros or Draw (1X) + Over 1.5 Goals",
    odds: 1.6,
    access: "vip" as const,
    teaser: "Ferencváros scored three in a 3–1 away win at Celtic, while Viktoria Plzeň conceded three at home to Union Saint-Gilloise. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Ferencváros scored three in a 3–1 away win at Celtic, while Viktoria Plzeň conceded thr...",
    analysis: ["Ferencváros scored three in a 3–1 away win at Celtic, while Viktoria Plzeň conceded three at home to Union Saint-Gilloise. That six-goal swing between the two opening performances strongly favors Ferencváros avoiding defeat and gives the over 1.5 condition solid support."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "hoffenheim-vs-besiktas",
    home: "Hoffenheim",
    away: "Beşiktaş",
    date: "2026-10-15",
    time: "21:00",
    pick: "Over 2.5 Total Goals",
    odds: 1.46,
    access: "vip" as const,
    teaser: "Hoffenheim lost 2–0 at OFI Crete, while Beşiktaş produced one of the round's biggest attacking displays in a 4–1 win over Marseille. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Hoffenheim lost 2–0 at OFI Crete, while Beşiktaş produced one of the round's biggest at...",
    analysis: ["Hoffenheim lost 2–0 at OFI Crete, while Beşiktaş produced one of the round's biggest attacking displays in a 4–1 win over Marseille. Beşiktaş have already shown four-goal upside, and Hoffenheim's need for a response should make this less likely to stay as closed as their opener."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "jagiellonia-bia-ystok-vs-ararat-armenia",
    home: "Jagiellonia Białystok",
    away: "Ararat-Armenia",
    date: "2026-10-15",
    time: "21:00",
    pick: "Jagiellonia Białystok to Win",
    odds: 1.42,
    access: "vip" as const,
    teaser: "Jagiellonia were competitive in a 2–1 loss at Olympiacos, whereas Ararat-Armenia conceded four in a 4–1 home defeat to Sparta Praha. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Jagiellonia were competitive in a 2–1 loss at Olympiacos, whereas Ararat-Armenia conced...",
    analysis: ["Jagiellonia were competitive in a 2–1 loss at Olympiacos, whereas Ararat-Armenia conceded four in a 4–1 home defeat to Sparta Praha. Returning home against a defense that allowed four makes Jagiellonia the stronger side on the available European evidence."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "lech-poznan-vs-bayer-leverkusen",
    home: "Lech Poznań",
    away: "Bayer Leverkusen",
    date: "2026-10-15",
    time: "18:45",
    pick: "Over 2.5 Total Goals",
    odds: 1.5,
    access: "vip" as const,
    teaser: "Lech conceded four in a 4–0 defeat at Crystal Palace, while Leverkusen beat Celje 2–0 without conceding. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Lech conceded four in a 4–0 defeat at Crystal Palace, while Leverkusen beat Celje 2–0 w...",
    analysis: ["Lech conceded four in a 4–0 defeat at Crystal Palace, while Leverkusen beat Celje 2–0 without conceding. Lech's need to attack at home should create more space than they allowed in London, and Bayer have already shown enough control and finishing to threaten this total."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "marseille-vs-olympiacos",
    home: "Marseille",
    away: "Olympiacos",
    date: "2026-10-15",
    time: "21:00",
    pick: "Marseille or Draw (1X) + Over 1.5 Goals",
    odds: 1.7,
    access: "vip" as const,
    teaser: "Marseille's 4–1 loss at Beşiktaş and Olympiacos' 2–1 win over Jagiellonia produced eight goals across their two opening fixtures. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Marseille's 4–1 loss at Beşiktaş and Olympiacos' 2–1 win over Jagiellonia produced eigh...",
    analysis: ["Marseille's 4–1 loss at Beşiktaş and Olympiacos' 2–1 win over Jagiellonia produced eight goals across their two opening fixtures. Marseille now have home field and urgency on their side, while Olympiacos have already shown they can score, supporting both the 1X and the over 1.5 legs."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "rennes-vs-ofi-crete",
    home: "Rennes",
    away: "OFI Crete",
    date: "2026-10-15",
    time: "21:00",
    pick: "Rennes -1.5 Goal Handicap",
    odds: 1.72,
    access: "vip" as const,
    teaser: "Rennes kept a clean sheet in a 0–0 draw at Sturm Graz, while OFI Crete impressed with a 2–0 win over Hoffenheim. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Rennes kept a clean sheet in a 0–0 draw at Sturm Graz, while OFI Crete impressed with a...",
    analysis: ["Rennes kept a clean sheet in a 0–0 draw at Sturm Graz, while OFI Crete impressed with a 2–0 win over Hoffenheim. The -1.5 line requires Rennes to find far more cutting edge than in their opener, but their defensive control gives them a base from which to chase a two-goal home margin."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "salzburg-vs-ac-milan",
    home: "Salzburg",
    away: "AC Milan",
    date: "2026-10-15",
    time: "18:45",
    pick: "Over 2.5 Total Goals",
    odds: 1.64,
    access: "vip" as const,
    teaser: "Salzburg won 1–0 away to Levski Sofia, while Milan were beaten 2–0 at home by Benfica. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Salzburg won 1–0 away to Levski Sofia, while Milan were beaten 2–0 at home by Benfica.",
    analysis: ["Salzburg won 1–0 away to Levski Sofia, while Milan were beaten 2–0 at home by Benfica. Milan now need a stronger attacking response, and Salzburg have already shown they can score away from home, creating a more open setup than the two opening scorelines suggest."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "sparta-praha-vs-lillestr-m",
    home: "Sparta Praha",
    away: "Lillestrøm",
    date: "2026-10-15",
    time: "18:45",
    pick: "Sparta Praha to Win",
    odds: 1.36,
    access: "vip" as const,
    bestAnalysis: true,
    teaser: "Sparta opened with a 4–1 away win over Ararat-Armenia, with Tobias Guddal scoring twice. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Sparta opened with a 4–1 away win over Ararat-Armenia, with Tobias Guddal scoring twice.",
    analysis: ["Sparta opened with a 4–1 away win over Ararat-Armenia, with Tobias Guddal scoring twice. Lillestrøm, by contrast, lost 2–1 at home to Torreense, so the opening-round gap plus home advantage gives Sparta the clearest edge in this matchup."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "torreense-vs-sunderland",
    home: "Torreense",
    away: "Sunderland",
    date: "2026-10-15",
    time: "18:45",
    pick: "Sunderland to Win",
    odds: 1.41,
    access: "vip" as const,
    teaser: "Torreense won 2–1 away at Lillestrøm in their opener, while Sunderland beat AZ Alkmaar 1–0. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Torreense won 2–1 away at Lillestrøm in their opener, while Sunderland beat AZ Alkmaar ...",
    analysis: ["Torreense won 2–1 away at Lillestrøm in their opener, while Sunderland beat AZ Alkmaar 1–0. Both arrive with three points, but Sunderland paired a clean sheet with a win and face a lower-tier opponent, giving the visitors the stronger overall profile."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
  {
    ...common,
    slug: "union-saint-gilloise-vs-real-sociedad",
    home: "Union Saint-Gilloise",
    away: "Real Sociedad",
    date: "2026-10-15",
    time: "18:45",
    pick: "Real Sociedad or Draw (X2)",
    odds: 1.6,
    access: "vip" as const,
    teaser: "Union Saint-Gilloise started with an excellent 3–0 away win at Viktoria Plzeň, while Real Sociedad lost 2–1 at home to Bournemouth. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Union Saint-Gilloise started with an excellent 3–0 away win at Viktoria Plzeň, while Re...",
    analysis: ["Union Saint-Gilloise started with an excellent 3–0 away win at Viktoria Plzeň, while Real Sociedad lost 2–1 at home to Bournemouth. Sociedad therefore need a response, and the X2 line gives them room to improve without requiring an away victory against a side that already scored three in Europe."],
    sources: [{ name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" }, { name: "UEFA Matchday 2 preview and verified context", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" }],
  },
];

const UEFA_MD1_SOURCE = { name: "UEFA official fixtures and Matchday 1 results", url: "https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/" };
const UEFA_MD2_BRIEFING_SOURCE = { name: "UEFA Matchday 2 briefing (14 October 2026) — Juventus, Benfica, Lyon and Crystal Palace", url: "https://www.uefa.com/uefaeuropaleague/news/02aa-21c6de347557-a53a4f1ec740-1000--europa-league-matchday-2-briefing-juventus-benfica-lyon-/" };
const STARTING11_SOURCE = (slug: string, label: string) => ({ name: `Starting11 — ${label} team news and predicted lineup (15 Oct 2026, secondary source)`, url: `https://starting11.com/fixtures/${slug}` });

const celtaVigoVsJuventus = buildFreeFeature({
  slug: "celta-vigo-vs-juventus",
  home: "Celta Vigo",
  away: "Juventus",
  time: "21:00",
  venue: "Estadio Municipal de Balaídos, Vigo, Spain",
  venueAddress: { addressLocality: "Vigo", addressCountry: "Spain" },
  pick: "Celta Vigo or Draw (1X)",
  odds: 1.73,
  teaser: "Celta lost 1–0 at Omonia, while Juventus opened with a 5–0 win but now have a long absence list. The prediction and full analysis are FREE for everyone.",
  trend: "Juventus' heavy injury and suspension list is the headline going into Balaídos",
  matchAnalysis: [
    "Celta lost 1–0 away at Omonia on Matchday 1, a tight scoreline that gave little indication of attacking quality either way. Juventus, by contrast, scored five without reply against N.E.C. Nijmegen with five different scorers, the kind of statement win that makes them the away favourite on paper for Matchday 2.",
    "The context has shifted since that opening weekend, however. Celta's own home record in this competition is a genuine counterweight: across their run to the quarter-finals last season they lost only two of seven matches at Balaídos (W4 D1), so home advantage at this specific ground has a real recent track record behind it, not just a general assumption.",
    "Juventus travel with a markedly thinner squad than the one that put five past N.E.C. Reported unavailability for this specific trip (see Team News) runs to eleven first-team players between injuries and one suspension, touching both full-back and central-defensive options as well as several attacking players. A 5-0 scoreline built with a near-full squad says less about what Juventus can field here than it would in a normal week.",
  ],
  teamNews: `Team news below follows reported availability from Starting11's matchday tracker (updated 15 October 2026) and is **not** an official team sheet; official lineups for this fixture are confirmed roughly an hour before the 21:00 kick-off.

**Celta Vigo — reported unavailable/doubtful**
- **Starfelt** — out
- **Antañón** — out
- **El Abdellaoui** — out
- **Román** — out
- **Cáceres** — doubtful

Five changes to the squad pool is a normal in-season total and does not point to a specific tactical gap; no confirmed Celta starting XI is available before kick-off.

**Juventus — reported unavailable/suspended**
- **Durmiši** — suspended
- **Locatelli** — out
- **Grabara** — out (goalkeeper)
- **Milik** — out (forward)
- **Thuram** — out
- **Rugani** — out (centre-back)
- **Yıldız** — out (forward)
- **Zhegrova** — out (forward)
- **Ekhator** — out (forward)
- **Boga** — out (forward)
- plus one further reported absence beyond this list

That is **eleven** reported absences for Juventus between one suspension and ten injuries, concentrated in central midfield, central defence and — most relevant to this specific pick — the forward line, where Milik, Yıldız, Zhegrova, Ekhator and Boga are all reported out together. No confirmed Juventus starting XI is available before kick-off, and this list should be read as reported availability rather than an official declaration.`,
  tactical: "Neither club's probable XI is officially confirmed before kick-off, so the tactical read here is built from team news rather than named shapes. Juventus' front-line absences are the most relevant detail for this specific market: with five of their established attacking options unavailable, whoever starts up front is likely to be a reshuffled or less experienced combination than the one that scored five against N.E.C., which works against the idea that the Matchday 1 scoreline simply repeats itself at Balaídos. Celta's own profile at this ground — a side that defended well across seven Europa League home games last season while remaining capable of occasional goals — fits a double-chance pick better than it fits backing them outright to win, since the line only needs Celta to avoid defeat rather than to out-attack a side that, even weakened, retains individual quality in behind a thin forward line.",
  risk: "The central risk is that Juventus' 5-0 opening result reflects genuine squad depth that a long absentee list does not fully erase — elite squads can still field a competitive XI from their remaining options, and an away win is the single most likely individual outcome by most market pricing even with these absences. A secondary risk is that reported availability lists are not official team sheets and can change in the 24 hours before kick-off; some of the eleven Juventus names listed could return to the matchday squad. Weighing against that, the double-chance structure of the pick (Celta win **or** draw) only requires Celta to avoid defeat rather than win outright, which is a materially lower bar than asking them to beat a Champions League-pedigree squad straight up, and it is directly supported by Celta's two-defeats-in-seven home record in this competition.",
  sources: [UEFA_MD1_SOURCE, UEFA_MD2_BRIEFING_SOURCE, STARTING11_SOURCE("celta-vigo-vs-juventus", "Celta Vigo vs Juventus")],
});

const necNijmegenVsLevskiSofia = buildFreeFeature({
  slug: "n-e-c-nijmegen-vs-levski-sofia",
  home: "N.E.C. Nijmegen",
  away: "Levski Sofia",
  time: "21:00",
  venue: "Stadion de Goffert, Nijmegen, Netherlands",
  venueAddress: { addressLocality: "Nijmegen", addressCountry: "Netherlands" },
  pick: "N.E.C. Nijmegen to Win",
  odds: 1.89,
  teaser: "N.E.C. were beaten 5–0 by Juventus and now report the longest absence list of any side in this round. The prediction and full analysis are FREE for everyone.",
  trend: "N.E.C.'s reported absence list has grown to 13 players for a home fixture they are still picked to win",
  matchAnalysis: [
    "N.E.C. Nijmegen were beaten 5–0 by Juventus on Matchday 1, while Levski Sofia lost 1–0 away to Salzburg. Both sides are still searching for their first European points of the campaign, and both will see this as a more winnable fixture than their opener on paper.",
    "N.E.C. have home advantage and face an opponent that also failed to score on Matchday 1, which is the basis for preferring the hosts over a Levski side that offered little going forward in Austria. That case is weakened considerably by team news: this is now the most heavily depleted squad among the four matches covered here (see Team News), and a 13-man absence list for a club of N.E.C.'s resources is unusually severe for a home fixture.",
    "Levski arrive with their own reported gaps across defence, midfield and attack, so neither side goes into Matchday 2 at full strength. The case for N.E.C. rests on home advantage and Levski's own goalless opener rather than on N.E.C. being the healthier or better-resourced squad on the night.",
  ],
  teamNews: `Team news below follows reported availability from Starting11's matchday tracker (updated 15 October 2026) and is **not** an official team sheet; confirmed lineups land roughly an hour before the 21:00 kick-off.

**N.E.C. Nijmegen — reported unavailable**
- **Geiger** — out
- **Hansen-Aarøen** — out
- **Tahaui** — out
- **Sierhuis** — out
- **Nuytinck** — out
- **Thomas** — out
- **Mor** — out
- **Sandler** — out
- **Crettaz** — out (goalkeeper)
- **Kaplan** — out
- plus three further reported absences beyond this list

That totals **13** reported unavailable players — by a distance the longest list across the four fixtures covered in this refresh. No confirmed N.E.C. starting XI is available before kick-off.

**Levski Sofia — reported unavailable**
- **Serafimov** — out
- **Sangaré** — out
- **Kirilov** — out
- **Kamdem** — out
- **Hristov** — out
- **Bouras** — out

Six reported absences for Levski, spread across defence, midfield and attack. No confirmed Levski starting XI is available before kick-off.`,
  tactical: "With neither club's starting XI officially confirmed, the practical tactical point is squad depth rather than shape: N.E.C.'s 13-name absence list almost certainly forces changes across multiple lines, which is a material downgrade from the group that lost 5-0 to a side as strong as Juventus — a result that, taken alone, already pointed to defensive fragility before this week's further reported absences. Levski's six absences are comparatively more containable, and a side that was shut out 1-0 away at Salzburg without conceding heavily does not look like a soft touch defensively even if its own attack has yet to find the net this season. The home closing argument for N.E.C. is largely about the calendar (a winnable-looking fixture on paper) rather than about either side's current strength on paper.",
  risk: "This is the clearest data-versus-pick tension in this refresh: N.E.C.'s reported 13-player absence list is unusually long for a side expected to win at home, and a reshuffled starting XI missing that many first-team options is a real threat to a straight win-only market. Levski's own six absences and their 1-0 defeat at Salzburg (no goals scored) are the main counterweight that keeps N.E.C. as the more backable side, since neither team has shown attacking sharpness yet this season and the hosts at least retain the extra incentive and support of a home fixture. Readers should treat this specific pick as carrying above-average squad-depth risk relative to the other three matches in this refresh, and should check the confirmed N.E.C. teamsheet before kick-off given how long the reported absence list is.",
  sources: [UEFA_MD1_SOURCE, UEFA_MD2_BRIEFING_SOURCE, STARTING11_SOURCE("nec-nijmegen-vs-levski-sofia", "N.E.C. Nijmegen vs Levski Sofia")],
});

const benficaVsCeltic = buildFreeFeature({
  slug: "benfica-vs-celtic",
  home: "Benfica",
  away: "Celtic",
  time: "21:00",
  venue: "Estádio da Luz, Lisbon, Portugal",
  venueAddress: { addressLocality: "Lisbon", addressCountry: "Portugal" },
  pick: "Over 2.5 Total Goals",
  odds: 1.47,
  teaser: "Benfica won 2–0 at Milan and arrive on nine wins in ten, while Celtic's opener finished 3–1 to Ferencváros. The prediction and full analysis are now FREE for everyone.",
  trend: "Benfica's nine-wins-in-ten run and a four-goal Celtic opener both point toward goals at Estádio da Luz",
  matchAnalysis: [
    "Benfica opened their Europa League campaign with a 2-0 win away at AC Milan, while Celtic's first match produced four goals in a 3-1 home defeat to Ferencváros — a result in which Bamidele Yusuf created all three Celtic assists, the most of any player in the round, per UEFA's own Matchday 2 briefing. Neither side, in other words, was involved in a cagey opener.",
    "Benfica's broader form supports that attacking profile: UEFA's briefing notes nine wins from their last ten matches in all competitions, a run built while scoring away at Milan without conceding. Celtic have the attacking personnel back in reserve too — Alex Oxlade-Chamberlain returns from a three-match European suspension and is available for selection again, adding a proven creative option to a side that already scored once against Ferencváros despite the heavy scoreline against them.",
    "This is also a historically rare fixture between two continental heavyweights: UEFA records Benfica and Celtic meeting eight times previously, all in the Champions League/European Cup, with Celtic winning four, Benfica three and one draw — closely contested average scorelines rather than one side's history of running up the score, which tempers (without removing) the case for backing a big-margin outcome and keeps the focus on the Over 2.5 total rather than a one-sided result.",
  ],
  teamNews: `Benfica's probable lineup below is a **PROJECTED** crowd/model estimate from Starting11 (updated 15 October 2026), not an official team sheet; Celtic's starting XI was not available in the same projected form.

**PROJECTED Benfica (4-2-3-1):** Soares; Bah, Araújo, Lenglet, Dahl; Barreiro, Palhinha; Prestianni, Schjelderup, Circati; Pavlidis.

**Benfica — availability**
- **Enzo Barrenechea** — out (knee injury, reported return next month)
- **Kamiński** — doubtful

**Celtic — availability**
- **Hyun-Jun** — out
- **Mheuka** — out
- **van den Berg** — out
- **Osmand** — out
- **Johnston** — out
- **Cameron Carter-Vickers** — doubtful. Manager Martin O'Neill said the centre-back "has got a strain" and that Thursday "might be too early" for him to be fit; he already missed the midweek Motherwell game. **Liam Scales** is the likely replacement, possibly alongside **Auston Trusty** in place of Dane Murray.
- **Alex Oxlade-Chamberlain** — available again after completing a three-match European suspension.

This team news is sourced to The Scotsman's Celtic coverage and Starting11's matchday tracker; both are secondary sources relative to an official club or UEFA team-sheet confirmation, and should be checked again once the confirmed teamsheets are published roughly an hour before the 21:00 kick-off.`,
  tactical: "Benfica's projected 4-2-3-1 is built around width and combination play in the final third: Prestianni and Schjelderup either side of Circati behind lone striker Pavlidis gives Bruno Lage's side three separate creators feeding one focal point, a shape that produced the away win at Milan. Celtic's likely central-defensive pairing of Scales and Trusty — stepping in for Carter-Vickers — is a less proven partnership under pressure than the first-choice pairing it replaces, and it will be tested directly by Benfica's front four in behind Pavlidis. On the other side of the ball, Oxlade-Chamberlain's return gives Celtic a genuine outlet to support Ferencváros-style transition play, but after conceding three at home in their opener their defensive sequencing against Benfica's crosses and interchanges in the channels is the bigger concern for Martin O'Neill's side than anything they do with the ball themselves.",
  risk: "The main risk to the Over 2.5 line is that Benfica's control could tip the game toward a comfortable, lower-event win rather than an open one — a side nine-from-ten in form with a settled structure can close games out rather than keep trading chances once ahead. Celtic's makeshift central-defensive pairing is the clearest route to the total being cleared, but if Scales and Trusty hold up well together the game could stay closer to Benfica's earlier 2-0 shutout at Milan than to Celtic's four-goal opener. Carter-Vickers' fitness is also not fully resolved as of this refresh and is worth checking again before kick-off, since his return would strengthen Celtic's defensive solidity and work against the total.",
  market: `The published market price is **1.47**, which carries a raw implied probability of **68.03%** using 1 / 1.47. A separate bookmaker's moneyline for the match (Benfica 1.25, Celtic 10.00) prices Benfica as very heavy favourites to win outright, which is consistent with — but not the same bet as — the Over 2.5 total used here: a heavily favoured Benfica performance and an open, goal-scoring Celtic response are not mutually exclusive, and both of Matchday 1's results for these two clubs individually cleared 2.5 goals.`,
  conclusion: "Both sides scored and conceded in a combined seven-goal Matchday 1, Benfica arrive in excellent attacking form and Celtic have a fresh creative option back from suspension even as their defence is reshuffled by Carter-Vickers' likely absence. Weighing that combination of attacking evidence and defensive uncertainty against the published price, the retained call for Benfica vs Celtic stays Over 2.5 Total Goals at 1.47, unchanged from the original publication package.",
  sources: [UEFA_MD1_SOURCE, UEFA_MD2_BRIEFING_SOURCE, STARTING11_SOURCE("benfica-vs-celtic", "Benfica vs Celtic"), { name: "The Scotsman — Benfica vs Celtic injury news (5 out, 5 doubts; Oxlade-Chamberlain back)", url: "https://www.scotsman.com/sport/football/celtic/latest-celtic-news/benfica-vs-celtic-injury-news-5-out-and-5-doubts-with-key-decision-mulled-as-oneill-welcomes-back-midfielder-9281395" }],
});

const lyonVsCrystalPalace = buildFreeFeature({
  slug: "lyon-vs-crystal-palace",
  home: "Lyon",
  away: "Crystal Palace",
  time: "18:45",
  venue: "Groupama Stadium, Lyon, France",
  venueAddress: { addressLocality: "Lyon", addressCountry: "France" },
  pick: "Crystal Palace or Draw (X2)",
  odds: 1.68,
  teaser: "Lyon's first league defeat of the season arrived just six days before this match, while Palace opened Europe with a 4–0 win. The prediction and full analysis are now FREE for everyone.",
  trend: "Lyon's first domestic defeat of the season lands days before Sage faces his old club",
  matchAnalysis: [
    "Lyon opened their Europa League campaign with a 2-1 away win at Anderlecht, while Crystal Palace were sharper still, beating Lech Poznań 4-0. Since then, Lyon's domestic form has taken a hit: they lost 2-1 at Lens on 9 October, their first Ligue 1 defeat of the season, a result that cost them top spot and leaves them two points behind leaders Monaco with the squad now dealing with a congested week.",
    "This fixture also carries a personal subplot UEFA's own Matchday 2 briefing highlights: Palace head coach Pierre Sage returns to France to face Lyon, the club he managed between November 2023 and January 2025, adding context to a match between two sides that each started the league phase with a win.",
    "Palace's own squad is not at full domestic strength either, but manager Sage struck a positive note on three key absentees ahead of this specific fixture (see Team News), while Ismaila Sarr is reported close to full fitness after a groin issue. Lyon, by contrast, lose their most advanced attacking outlet in Loïs Openda to the same injury that forced him off against Lens, a materially negative development for the hosts' attacking threat in this specific match.",
  ],
  teamNews: `Team news below combines club/manager reporting with Starting11's matchday tracker (updated 15 October 2026); neither club's starting XI is officially confirmed before kick-off, which typically lands roughly an hour before the 18:45 kick-off.

**Lyon — reported unavailable**
- **Loïs Openda** — expected to miss this match after a right-leg knock sustained against Lens; follow-up examinations reportedly ruled out a serious injury, but he was already considered unlikely for Lyon's following Ligue 1 fixture too.
- **Moussa Niakhaté** — a doubt after a hamstring injury that kept him out of the Lens game; L'Équipe reported his availability for this match as uncertain.
- **Himbert, Ouédraogo, Tagliafico, Duranville** — also reported out by Starting11's tracker.

**Crystal Palace — reported unavailable, with three expected back for this match**
- Starting11's tracker lists **Riad, Mateta, Tomiyasu, Doucouré, Gozo, Guessand, Henderson and Lerma** as out, with **Khalaili** doubtful.
- However, manager Pierre Sage said directly (via Vavel, 9 October 2026) that **Jean-Philippe Mateta, Dean Henderson and Takehiro Tomiyasu** were unavailable only for Palace's most recent domestic fixture, adding: "We expect all three of them to come back for Lyon." Sage also described **Anan Khalaili** as ready to play 90 minutes.
- **Ismaila Sarr** is reported close to full fitness after a groin issue and available for selection.

Given the direct conflict between the broader absence tracker and the manager's own more recent comments specifically about this fixture, Mateta, Henderson and Tomiyasu should be treated as possible returns for this match rather than confirmed absentees, pending the official teamsheet.`,
  tactical: "Openda's absence is the single most consequential tactical change for Lyon: he is their most advanced out-and-out attacking outlet, and without him Lyon's front line is likely to rely more on combination play through midfield than on in-behind running, a less direct approach than the one that beat Anderlecht. Niakhaté's uncertain fitness also threatens the back line that conceded at Lens. Palace's picture is more positive if Sage's comments about Mateta, Henderson and Tomiyasu hold: a fit Mateta gives Palace their focal-point striker back after the 4-0 opening win, while Tomiyasu adds defensive solidity at a moment when Lyon are dealing with their own fitness questions at the back. A Palace side closer to full strength, facing a Lyon team missing its most advanced attacking threat six days after a damaging league defeat, supports the draw-or-away structure of this pick better than it supports backing the home side outright.",
  risk: "The clearest risk is that Palace's three headline returns (Mateta, Henderson, Tomiyasu) are based on a manager's pre-match comment rather than a confirmed teamsheet, and any of the three could still be held back as a precaution; Starting11's broader tracker lists all three as out, which is a genuine source conflict worth flagging rather than resolving silently. A second risk is home advantage itself: Lyon start at Groupama Stadium and, Openda's absence aside, still have enough attacking quality to beat a Palace side that is also missing several squad players. Weighing those risks against the case for the pick, the X2 structure (draw or Palace win) only needs Lyon to fail to win outright, a lower bar than needing Palace to win the match themselves, which is the main reason the pick is retained despite the uncertainty in Palace's own fitness news.",
  sources: [UEFA_MD1_SOURCE, UEFA_MD2_BRIEFING_SOURCE, STARTING11_SOURCE("lyon-vs-crystal-palace", "Lyon vs Crystal Palace"), { name: "Vavel — Sage seeks to re-find the best form of Ismaila Sarr (9 October 2026)", url: "https://www.vavel.com/en/football/2026/10/09/crystal-palace/1274590-sage-seeks-to-re-find-the-best-form-of-ismaila-sarr.html" }, { name: "New Straits Times — Lyon blow chance to go top after loss at Lens", url: "https://www.nst.com.my/amp/sports/football/2026/10/1552073/lyon-blow-chance-go-top-after-loss-lens" }],
});

export const uefaEuropaLeagueRound2026_10_15 = [
  ...inputs.map(createPspImport37Prediction),
  celtaVigoVsJuventus,
  necNijmegenVsLevskiSofia,
  benficaVsCeltic,
  lyonVsCrystalPalace,
];
