import type { EditorialPrediction } from "@/types";

export const gaziantepFkVsCaykurRizespor: EditorialPrediction = {
  league: "super-lig",
  homeTeam: "Gaziantep FK",
  awayTeam: "Çaykur Rizespor",
  analysis: [
    "The goals line is supported by both teams' recent profiles. Across 20-match samples, Gaziantep reached Over 1.5 in 18 games, a 90% rate, while Rizespor did so in 16, or 80%.",
    "Their attacking volume also helps. Gaziantep average around 12.1 shots per match and Rizespor about 14.5, giving a combined profile above 26 attempts.",
    "Corners are equally important. Gaziantep's league matches have averaged around 10.2 total corners, with Over 7.5 landing in roughly 74%. Rizespor matches average about 8.8 corners, with the same line landing around 65%.",
    "Recent direct meetings have also produced 10 and 12 total corners, both comfortably above the eight required.",
    "We do not need a goal-heavy match. A 1-1 scoreline already settles the goals side, while the corner averages of both teams remain above the selected threshold."
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
      name: "Turkish Football Federation — 2026/27 Süper Lig fixtures and table",
      url: "https://www.tff.org/default.aspx?pageID=198",
      description: "Official competition page confirming the Matchday 3 pairing, kickoff and standings used for publication context.",
      accessedAt: "2026-08-26T08:54:38-03:00"
    }
  ],
  publishedAt: "2026-08-26T11:54:38.899Z",
  published: true,
  matchInfo: {
    date: "2026-08-29",
    time: "21:30",
    round: "Matchday 3"
  }
};
