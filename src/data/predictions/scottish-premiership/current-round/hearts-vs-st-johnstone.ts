import type { EditorialPrediction } from "@/types";

export const heartsVsStJohnstone: EditorialPrediction = {
  league: "scottish-premiership",
  homeTeam: "Hearts",
  awayTeam: "St Johnstone",
  analysis: [
    "Hearts vs St. Johnstone offers a strong statistical profile for a low goals line combined with a moderate corner target. We need only two goals and eight total corners.",
    "Hearts have recently been involved in matches finishing 2-2, 6-2, 1-1 and 4-0, meaning Over 1.5 landed in all four. Their recent matches also sit around the 10-corner range, with Hearts themselves producing roughly 5.5 to 5.8 corners per game.",
    "St. Johnstone support the corner side of the bet. In a 36-match sample, Over 7.5 corners landed in 81%, while even Over 8.5 reached 75%. Their matches have averaged close to 10 total corners, so an eight-corner requirement is below the usual level.",
    "The head-to-head also helps the goals side: 23 of 35 recorded meetings finished with at least two goals, and four recent Premiership meetings ended 2-1.",
    "The combination does not require an extreme game. Two goals and eight corners are enough, and both teams' recent profiles sit comfortably around those thresholds."
  ],
  comment: "Odds supplied in the editorial package and recorded before kickoff; bookmaker not identified in the source file.",
  picks: {
    main: "Over 1.5 Goals + Over 7.5 Corners",
    odds: 1.65,
    oddsProvenance: {
      source: "Author-supplied editorial package",
      provenance: "author_attested",
      market: "Over 1.5 Goals + Over 7.5 Corners"
    }
  },
  sourceStatus: "verified",
  sources: [
    {
      name: "SPFL — 2026/27 Premiership fixtures and table",
      url: "https://spfl.co.uk/match-day",
      description: "Official competition page confirming the scheduled pairing, kickoff and current standings used for publication context.",
      accessedAt: "2026-08-26T08:54:38-03:00"
    }
  ],
  publishedAt: "2026-08-26T11:54:38.899Z",
  published: true,
  matchInfo: {
    date: "2026-08-29",
    time: "15:00",
    round: "Matchday 4"
  }
};
