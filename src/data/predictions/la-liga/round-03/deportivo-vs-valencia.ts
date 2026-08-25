import type { EditorialPrediction } from "@/types";

export const deportivoVsValencia: EditorialPrediction = {
  league: "la-liga",
  homeTeam: "Deportivo",
  awayTeam: "Valencia",

  analysis: [
    "This is a match where we prefer to lower the requirement rather than force a winner. Two goals across 90 minutes is enough, and that allows the bet to survive a wide range of balanced scorelines.",
    "Deportivo return to Riazor with the incentive to play on the front foot. At home, they are far more likely to contest territory and commit players forward than they would in a difficult away fixture. That matters because the bet does not require Deportivo to dominate; it only needs them to contribute to an active match.",
    "Valencia have the technical level to create chances even when they are not controlling possession. Their recent 0-0 against Celta is also a reason to stay with Over 1.5 instead of moving to a more aggressive 2.5 line. We are deliberately keeping the threshold low.",
    "The matchup offers several natural paths to the bet: an early goal can force the trailing side to open up, while a 1-1 game is already enough. Neither team needs to produce a high-scoring performance on its own.",
    "At 1.45, the price reflects the conservative line. For this fixture, we prefer the lower variance of needing only two total goals rather than adding a result condition or chasing a larger goal total.",
  ],

  picks: {
    main: "Over 1.5 Goals",
    odds: 1.45,
    oddsProvenance: {
      source: "Betano — editor-supplied price",
      bookmaker: "Betano",
      provenance: "author_attested",
      market: "Over 1.5 Goals",
    },
  },

  matchInfo: {
    date: "2026-08-30",
    time: "19:30",
    round: "Matchday 3",
    venue: "Riazor",
  },

  publishedAt: "2026-08-25T06:17:27-03:00",
  sourceStatus: "verified",
  sources: [
    {
      name: "LaLiga — Matchday 3 fixtures and statistics",
      url: "https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-3",
      description: "Official fixture and match-stat context for LaLiga Matchday 3.",
      accessedAt: "2026-08-25T06:17:27-03:00",
    },
  ],
  published: true,
};
