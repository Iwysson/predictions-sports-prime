import type { EditorialPrediction } from "@/types";

export const aberdeenVsRangers: EditorialPrediction = {
  league: "scottish-premiership",
  homeTeam: "Aberdeen",
  awayTeam: "Rangers",
  analysis: [
    "Aberdeen vs Rangers has a solid statistical base for Over 2.5. Across a 36-match head-to-head sample, 22 finished with at least three goals, a 61.1% rate.",
    "Recent meetings include Rangers wins of 4-1 and 4-0, a 2-2 draw and a 2-1 Aberdeen victory. The matchup has repeatedly opened up when either side scores early.",
    "Aberdeen conceded 55 goals in 38 league matches last season, around 1.45 per game, while Rangers averaged approximately 1.75 xG in away matches. Aberdeen themselves produced around 1.41 home xG, which gives the hosts a realistic chance of contributing.",
    "Current form also helps. Aberdeen have already won 2-1 against Hearts and 3-0 against Dundee, while Rangers recently produced a 5-1 cup victory over St Mirren.",
    "We only need three total goals, and both the historical trend and the attacking profiles of the teams provide several routes to get there."
  ],
  comment: "Odds supplied in the editorial package and recorded before kickoff; bookmaker not identified in the source file.",
  picks: {
    main: "Over 2.5 Goals",
    odds: 1.65,
    oddsProvenance: {
      source: "Author-supplied editorial package",
      provenance: "author_attested",
      market: "Over 2.5 Goals"
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
    date: "2026-08-30",
    time: "12:00",
    round: "Matchday 4"
  }
};
