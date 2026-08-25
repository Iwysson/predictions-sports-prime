import type { EditorialPrediction } from "@/types";

export const lyonVsLeHavre: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Lyon",
  awayTeam: "Le Havre",
  analysis: [
    "Lyon return to the Groupama Stadium after starting Ligue 1 with a controlled 2–0 away win over Toulouse. At home against Le Havre, they should play higher, dominate territory for longer periods and generate greater attacking volume.",
    "Lyon's scoring potential is the foundation of the pick. Le Havre began with a 1–0 defeat to Monaco and now face another demanding opponent away from home. If Lyon score first, the visitors will eventually have to leave their defensive shape, creating additional space.",
    "The selection does not require Le Havre to score heavily: Lyon have the quality to contribute most of the required total themselves, while one away goal would make the three-goal line much easier to reach.",
  ],
  picks: {
    main: "Over 2.5 Goals",
    odds: 1.75,
    oddsProvenance: {
      source: "Author-supplied editorial package",
      provenance: "author_attested",
      capturedAt: "2026-08-25T10:38:06-03:00",
      market: "Over 2.5 Goals",
    },
  },
  sourceStatus: "verified",
  sources: [
    { name: "Ligue 1 — Matchday 2 broadcast schedule", url: "https://ligue1.com/fr/articles/l1_article_5435-programmation-tv-des-2-premieres-journees-de-ligue-1-mcdonald-s-2627", description: "Official schedule supporting the fixture, date, kickoff time and matchday.", accessedAt: "2026-08-25T11:00:00-03:00" },
    { name: "Ligue 1 — Toulouse 0–2 Lyon match report", url: "https://ligue1.com/en/articles/l1_article_5717-lyon-make-winning-start-with-victory-in-toulouse", description: "Official report supporting Lyon's opening away win.", accessedAt: "2026-08-25T11:00:00-03:00" },
    { name: "Ligue 1 — Le Havre 0–1 Monaco match report", url: "https://ligue1.com/en/articles/l1_article_5720-dier-header-saves-monaco-blushes-against-le-havre", description: "Official report supporting Le Havre's opening defeat.", accessedAt: "2026-08-25T11:00:00-03:00" },
  ],
  publishedAt: "2026-08-25T10:44:26.373Z",

  published: true,
  matchInfo: { date: "2026-08-29", time: "15:45", round: "Matchday 2", venue: "Groupama Stadium" },
};
