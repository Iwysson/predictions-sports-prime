import type { EditorialPrediction } from "@/types";

export const parisFcVsNice: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Paris FC",
  awayTeam: "Nice",
  analysis: [
    "Paris FC's home record is the foundation of this selection. They collected 25 points at Stade Jean-Bouin last season, recording seven wins and four draws from 17 league home matches and producing several strong performances against quality opposition.",
    "Rather than requiring another home victory, 1X protects us if Nice earn a draw. The goals requirement is also modest: only two total goals are needed. Paris should take more initiative at home, while Nice have enough quality to contribute offensively.",
    "The combination therefore uses Paris FC's home strength without forcing a winner and keeps the scoring threshold accessible.",
  ],
  picks: {
    main: "Paris FC or Draw (1X) + Over 1.5 Goals",
    odds: 1.82,
    oddsProvenance: {
      source: "Author-supplied editorial package",
      provenance: "author_attested",
      capturedAt: "2026-08-25T10:38:06-03:00",
      market: "Paris FC or Draw (1X) + Over 1.5 Goals",
    },
  },
  sourceStatus: "verified",
  sources: [
    { name: "Ligue 1 — Matchday 2 broadcast schedule", url: "https://ligue1.com/fr/articles/l1_article_5435-programmation-tv-des-2-premieres-journees-de-ligue-1-mcdonald-s-2627", description: "Official schedule supporting the fixture, date, kickoff time and matchday.", accessedAt: "2026-08-25T11:00:00-03:00" },
    { name: "Ligue 1 — Opening-round multiplex report", url: "https://ligue1.com/en/articles/l1_article_5718-", description: "Official report supporting the goalless opening matches played by Paris FC and Nice.", accessedAt: "2026-08-25T11:00:00-03:00" },
  ],
  publishedAt: "2026-08-25T10:44:27.523Z",

  published: true,
  matchInfo: { date: "2026-08-30", time: "10:00", round: "Matchday 2", venue: "Stade Jean-Bouin" },
};
