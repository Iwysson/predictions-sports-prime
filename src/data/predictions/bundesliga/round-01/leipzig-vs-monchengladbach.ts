import type { EditorialPrediction } from "@/types";

export const leipzigVsMonchengladbach: EditorialPrediction = {
  league: "bundesliga",
  homeTeam: "RB Leipzig",
  awayTeam: "Borussia Mönchengladbach",
  analysis: [
    "RB Leipzig host Borussia Mönchengladbach in Bundesliga. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Borussia Mönchengladbach +2 Handicap + Under 4.5 Goals.",
    "The handicap component sets the required scoring margin rather than relying only on the match winner, while the goals component makes the total scoring range part of the selection.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to RB Leipzig and Borussia Mönchengladbach exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "Borussia Mönchengladbach +2 Handicap + Under 4.5 Goals",
    odds: 1.93,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T12:07:00-03:00",
      market: "Borussia Mönchengladbach +2 Handicap + Under 4.5 Goals",
    },
  },
  sourceStatus: "verified",
  sources: [
    {
      name: "OpenFootball — Bundesliga 2026/27 fixtures",
      url: "https://raw.githubusercontent.com/openfootball/deutschland/refs/heads/master/2026-27/1-bundesliga.txt",
      description: "Direct season fixture data supporting the competition, round, date, home team and away team used in this analysis.",
      accessedAt: "2026-08-24T14:45:00-03:00",
    },
  ],
  publishedAt: "2026-08-24T17:38:36.651Z",
  published: true,
  matchInfo: {
    date: "2026-08-29",
    time: "10:30",
    round: "Matchday 1",
  },
};
