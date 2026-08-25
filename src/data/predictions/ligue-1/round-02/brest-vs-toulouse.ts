import type { EditorialPrediction } from "@/types";

export const brestVsToulouse: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Brest",
  awayTeam: "Toulouse",
  analysis: [
    "Brest and Toulouse offer an attractive setup for goals and attacking volume. Brest opened their campaign in a 2–2 match, while Toulouse need a response after losing 2–0 to Lyon, giving both sides reasons to attack.",
    "The corner profile strengthens the selection. In the relevant previous-season sample, Brest matches averaged roughly 9.7 total corners and Toulouse around 9.3, both above the eight corners required here. Wide attacks, crosses and pressure from a trailing side can all contribute without the match needing to become a shootout.",
    "We need only two goals and eight corners, giving the bet several routes to land while keeping both thresholds below the broader attacking profile of these teams.",
  ],
  picks: {
    main: "Over 1.5 Goals + Over 7.5 Corners",
    odds: 1.78,
    oddsProvenance: {
      source: "Author-supplied editorial package",
      provenance: "author_attested",
      capturedAt: "2026-08-25T10:38:06-03:00",
      market: "Over 1.5 Goals + Over 7.5 Corners",
    },
  },
  sourceStatus: "verified",
  sources: [
    { name: "Ligue 1 — Matchday 2 broadcast schedule", url: "https://ligue1.com/fr/articles/l1_article_5435-programmation-tv-des-2-premieres-journees-de-ligue-1-mcdonald-s-2627", description: "Official schedule supporting the fixture, date, kickoff time and matchday.", accessedAt: "2026-08-25T11:00:00-03:00" },
    { name: "Ligue 1 — Opening-round multiplex report", url: "https://ligue1.com/en/articles/l1_article_5718-", description: "Official report supporting Brest's 2–2 draw with Le Mans.", accessedAt: "2026-08-25T11:00:00-03:00" },
    { name: "Ligue 1 — Toulouse 0–2 Lyon match report", url: "https://ligue1.com/en/articles/l1_article_5717-lyon-make-winning-start-with-victory-in-toulouse", description: "Official report supporting Toulouse's opening defeat to Lyon.", accessedAt: "2026-08-25T11:00:00-03:00" },
  ],
  publishedAt: "2026-08-25T10:44:25.273Z",

  published: true,
  matchInfo: { date: "2026-08-29", time: "15:45", round: "Matchday 2" },
};
