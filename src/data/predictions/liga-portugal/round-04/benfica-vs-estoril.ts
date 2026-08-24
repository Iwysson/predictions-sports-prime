import type { EditorialPrediction } from "@/types";

export const benficaVsEstoril: EditorialPrediction = {
  league: "liga-portugal",
  homeTeam: "Benfica",
  awayTeam: "Estoril",
  analysis: [
    "Benfica host Estoril in Liga Portugal. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Benfica -2 Asian Handicap.",
    "The handicap component sets the required scoring margin rather than relying only on the match winner.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to Benfica and Estoril exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "Benfica -2 Asian Handicap",
    odds: 1.7,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T13:33:00-03:00",
      market: "Benfica -2 Asian Handicap",
    },
  },
  sourceStatus: "verified",
  sources: [
    {
      name: "OpenFootball — Liga Portugal 2026/27 fixtures",
      url: "https://raw.githubusercontent.com/openfootball/europe/refs/heads/master/portugal/2026-27_pt1.txt",
      description: "Direct season fixture data supporting the competition, round, date, home team and away team used in this analysis.",
      accessedAt: "2026-08-24T14:45:00-03:00",
    },
  ],
  publishedAt: "2026-08-24T17:38:36.651Z",
  published: true,
  matchInfo: {
    date: "2026-08-31",
    round: "Matchday 4",
  },
};
