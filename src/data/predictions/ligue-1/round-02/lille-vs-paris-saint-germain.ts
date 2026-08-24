import type { EditorialPrediction } from "@/types";

export const lilleVsParisSaintGermain: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Lille",
  awayTeam: "Paris Saint-Germain",
  analysis: [
    "Lille host Paris Saint-Germain in Ligue 1. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Paris Saint-Germain to Win.",
    "the win component requires the named team to finish ahead.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to Lille and Paris Saint-Germain exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "Paris Saint-Germain to Win",
    odds: 1.72,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T13:37:00-03:00",
      market: "Paris Saint-Germain to Win",
    },
  },
  sourceStatus: "verified",
  sources: [
    {
      name: "OpenFootball — Ligue 1 2026/27 fixtures",
      url: "https://raw.githubusercontent.com/openfootball/europe/refs/heads/master/france/2026-27_fr1.txt",
      description: "Direct season fixture data supporting the competition, round, date, home team and away team used in this analysis.",
      accessedAt: "2026-08-24T14:45:00-03:00",
    },
  ],
  publishedAt: "2026-08-24T17:38:36.651Z",
  published: true,
  matchInfo: {
    date: "2026-08-28",
    time: "15:45",
    round: "Matchday 2",
  },
};
