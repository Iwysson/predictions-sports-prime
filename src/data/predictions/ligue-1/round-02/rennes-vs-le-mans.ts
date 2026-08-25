import type { EditorialPrediction } from "@/types";

export const rennesVsLeMans: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Rennes",
  awayTeam: "Le Mans",
  analysis: [
    "Rennes' strength at Roazhon Park drives this selection. They won 10 of 17 home league matches last season, losing only three, and scored 30 goals — around 1.76 per home game.",
    "Their attack has started positively again, while newly promoted Le Mans opened with a 2–2 draw against Brest. That result showed ambition going forward but also defensive spaces that a stronger Rennes side can exploit.",
    "We do not need a handicap or three goals. Rennes simply need to win in a match containing at least two goals, and their home scoring numbers mean they are capable of satisfying both requirements themselves.",
  ],
  picks: {
    main: "Rennes to Win + Over 1.5 Goals",
    odds: 1.62,
    oddsProvenance: {
      source: "Author-supplied editorial package",
      provenance: "author_attested",
      capturedAt: "2026-08-25T10:38:06-03:00",
      market: "Rennes to Win + Over 1.5 Goals",
    },
  },
  sourceStatus: "verified",
  sources: [
    { name: "Ligue 1 — Matchday 2 broadcast schedule", url: "https://ligue1.com/fr/articles/l1_article_5435-programmation-tv-des-2-premieres-journees-de-ligue-1-mcdonald-s-2627", description: "Official schedule supporting the fixture, date, kickoff time and matchday.", accessedAt: "2026-08-25T11:00:00-03:00" },
    { name: "Ligue 1 — Rennes 2–2 PSG match report", url: "https://ligue1.com/en/articles/l1_article_5721-torres-the-hero-as-psg-battle-back-against-rennes", description: "Official report supporting Rennes' attacking opening-round performance and the upcoming Le Mans fixture.", accessedAt: "2026-08-25T11:00:00-03:00" },
    { name: "Ligue 1 — Opening-round multiplex report", url: "https://ligue1.com/en/articles/l1_article_5718-", description: "Official report supporting Le Mans' 2–2 draw with Brest.", accessedAt: "2026-08-25T11:00:00-03:00" },
  ],
  publishedAt: "2026-08-25T10:44:28.107Z",

  published: true,
  matchInfo: { date: "2026-08-30", time: "12:15", round: "Matchday 2", venue: "Roazhon Park" },
};
