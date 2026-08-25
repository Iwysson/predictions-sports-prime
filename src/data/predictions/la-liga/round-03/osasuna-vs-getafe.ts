import type { EditorialPrediction } from "@/types";

export const osasunaVsGetafe: EditorialPrediction = {
  league: "la-liga",
  homeTeam: "Osasuna",
  awayTeam: "Getafe",

  analysis: [
    "The market is simple here for a reason. Osasuna and Getafe can both be involved in tight matches, so instead of forcing Over 2.5 we only ask for two goals.",
    "Getafe’s first two league matches have produced one goal scored and three conceded. Their 14 shots across those games show that there is still attacking activity even though the scoring return has been modest. Osasuna, meanwhile, have a demanding schedule around this fixture, with home and away league matches packed into a short period. That can create changes in game state and defensive concentration.",
    "El Sadar is also an important factor. Osasuna are generally more proactive at home, where they can press higher and attack with greater numbers. Against a Getafe side that is comfortable competing physically and playing direct when necessary, the match can generate enough transitions and set-piece situations for two goals without needing sustained end-to-end football.",
    "The 1.5 line protects us from the most obvious risk in this matchup: a game that remains controlled for long stretches. One goal before the final third of the match can completely change the behavior of the team that is behind.",
    "At 1.50, we accept the shorter price in exchange for a lower threshold. We do not need a shootout; 1-1, 2-0 or 0-2 is enough.",
  ],

  picks: {
    main: "Over 1.5 Goals",
    odds: 1.50,
    oddsProvenance: {
      source: "Betano — editor-supplied price",
      bookmaker: "Betano",
      provenance: "author_attested",
      market: "Over 1.5 Goals",
    },
  },

  matchInfo: {
    date: "2026-08-31",
    time: "19:30",
    round: "Matchday 3",
    venue: "El Sadar",
  },

  publishedAt: "2026-08-25T06:17:27-03:00",
  sourceStatus: "verified",
  sources: [
    {
      name: "LaLiga — Matchday 3 fixtures and statistics",
      url: "https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-3",
      description: "Official fixture and match-stat context for LaLiga Matchday 3.",
      accessedAt: "2026-08-25T06:17:27-03:00",
    },
  ],
  published: true,
};
