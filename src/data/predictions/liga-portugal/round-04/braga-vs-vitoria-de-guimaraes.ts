import type { EditorialPrediction } from "@/types";

export const bragaVsVitoriaDeGuimaraes: EditorialPrediction = {
  league: "liga-portugal",
  homeTeam: "Braga",
  awayTeam: "Vitória de Guimaraes",
  analysis: [
    "Braga host Vitória de Guimaraes in Liga Portugal. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Vitória Guimarães +2 Handicap + Over 1.5 Goals.",
    "The handicap component sets the required scoring margin rather than relying only on the match winner, while the goals component makes the total scoring range part of the selection.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to Braga and Vitória de Guimaraes exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "Vitória Guimarães +2 Handicap + Over 1.5 Goals",
    odds: 2.1,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture recovered from repository history",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T14:27:13-03:00",
      market: "Vitória Guimarães +2 Handicap + Over 1.5 Goals",
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
  publishedAt: "2026-08-25T09:50:39-03:00",
  published: true,
  matchInfo: {
    date: "2026-08-31",
    round: "Matchday 4",
  },
};
