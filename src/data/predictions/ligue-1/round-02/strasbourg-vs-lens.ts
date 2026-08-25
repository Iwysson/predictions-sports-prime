import type { EditorialPrediction } from "@/types";

export const strasbourgVsLens: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Strasbourg",
  awayTeam: "Lens",
  analysis: [
    "Strasbourg return home under pressure after a 4–0 opening defeat, while Lens arrive after an emphatic 5–2 victory over Auxerre. Lens' five goals were shared across several players, showing an attack capable of creating danger through different routes rather than relying on one scorer.",
    "Strasbourg's defensive stability remains the main concern. At home they should take more initiative, but that can also create transition space for a Lens side already playing with confidence. The setup favors attacking sequences from both directions: Strasbourg need a response, while Lens have demonstrated enough firepower to contribute heavily to the total.",
    "With only three goals required and contrasting early defensive and attacking signals, Over 2.5 is our preferred market.",
  ],
  picks: {
    main: "Over 2.5 Goals",
    odds: 1.67,
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
    { name: "Ligue 1 — Lens 5–2 Auxerre match report", url: "https://ligue1.com/en/articles/l1_article_5716-lens-start-ligue-1-season-in-style-with-seven-goal-win-over-auxerre", description: "Official report supporting Lens' five-goal opening win and distribution of scorers.", accessedAt: "2026-08-25T11:00:00-03:00" },
  ],
  publishedAt: "2026-08-25T10:44:28.655Z",

  published: true,
  matchInfo: { date: "2026-08-29", time: "12:15", round: "Matchday 2" },
};
