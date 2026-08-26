import type { EditorialPrediction } from "@/types";

export const konyasporVsKocaelispor: EditorialPrediction = {
  league: "super-lig",
  homeTeam: "Konyaspor",
  awayTeam: "Kocaelispor",
  analysis: [
    "This combination fits the statistical profile of both teams well. The goals side is built around a high Under 3.5 frequency, while the corner line sits below the usual match average.",
    "Konyaspor stayed Under 3.5 in five of their last six matches, while Kocaelispor did so in all six. Across a larger 20-match sample, Under 3.5 landed in about 85% of Konyaspor games and 95% of Kocaelispor games.",
    "The corner side is also favorable. Konyaspor average around 3.9 corners per match and Kocaelispor about 3.7, giving a combined attacking baseline of roughly 7.6. The Süper Lig itself has been averaging around 9.2 total corners per game.",
    "The match can therefore remain controlled on the scoreboard while still generating enough pressure, crosses and blocked shots to reach seven corners.",
    "Scorelines such as 1-0, 1-1, 2-0 or 2-1 all keep the goals side alive. With only seven corners required, the combination offers a sensible statistical balance."
  ],
  comment: "Odds supplied in the editorial package and recorded before kickoff; bookmaker not identified in the source file.",
  picks: {
    main: "Under 3.5 Goals + Over 6.5 Corners",
    odds: 1.6,
    oddsProvenance: {
      source: "Author-supplied editorial package",
      provenance: "author_attested",
      market: "Under 3.5 Goals + Over 6.5 Corners"
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
    time: "19:00",
    round: "Matchday 3"
  }
};
