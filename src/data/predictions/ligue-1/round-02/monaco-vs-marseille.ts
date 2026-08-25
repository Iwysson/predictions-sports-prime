import type { EditorialPrediction } from "@/types";

export const monacoVsMarseille: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Monaco",
  awayTeam: "Olympique de Marseille",
  analysis: [
    "Monaco's home advantage and the generous four-goal ceiling make this combination attractive. They opened Ligue 1 with a 1–0 away victory over Le Havre, providing an encouraging defensive base before this much tougher matchup.",
    "Marseille arrive after scoring four against Strasbourg, which is precisely why Under 4.5 is preferable to a tighter total. The line still allows a competitive, open game while protecting us from requiring an unusually low score.",
    "The 1X also avoids asking Monaco to beat a strong Marseille side outright. Monaco only need to avoid defeat at Stade Louis-II while the game remains below five goals, giving the selection considerable room.",
  ],
  picks: {
    main: "Monaco or Draw (1X) + Under 4.5 Goals",
    odds: 1.83,
    oddsProvenance: {
      source: "Author-supplied editorial package",
      provenance: "author_attested",
      capturedAt: "2026-08-25T10:38:06-03:00",
      market: "Monaco or Draw (1X) + Under 4.5 Goals",
    },
  },
  sourceStatus: "verified",
  sources: [
    { name: "Ligue 1 — Matchday 2 broadcast schedule", url: "https://ligue1.com/fr/articles/l1_article_5435-programmation-tv-des-2-premieres-journees-de-ligue-1-mcdonald-s-2627", description: "Official schedule supporting the fixture, date, kickoff time and matchday.", accessedAt: "2026-08-25T11:00:00-03:00" },
    { name: "Ligue 1 — Le Havre 0–1 Monaco match report", url: "https://ligue1.com/en/articles/l1_article_5720-dier-header-saves-monaco-blushes-against-le-havre", description: "Official report supporting Monaco's opening away win.", accessedAt: "2026-08-25T11:00:00-03:00" },
  ],
  publishedAt: "2026-08-25T10:44:26.956Z",

  published: true,
  matchInfo: { date: "2026-08-30", time: "15:45", round: "Matchday 2", venue: "Stade Louis-II" },
};
