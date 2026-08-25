import type { EditorialPrediction } from "@/types";

export const realSociedadVsEspanyol: EditorialPrediction = {
  league: "la-liga",
  homeTeam: "Real Sociedad",
  awayTeam: "Espanyol",

  analysis: [
    "This selection is built around two different layers of protection: a wide handicap for Espanyol and a corner line that sits below the expected attacking volume of the fixture.",
    "Espanyol have started the league with four goals from their first two matches and 19 shots recorded in La Liga’s early-season data. Real Sociedad, meanwhile, are coming from a match against Betis in which the teams combined for nine corners, with Sociedad taking five. That gives us an immediate indication that Sociedad can generate set-piece pressure even when the result does not go their way.",
    "The corner projection is also favorable. A pre-match model based on recent production, corners conceded, shooting and head-to-head data estimates 9.07 total corners: 5.26 for Real Sociedad and 3.81 for Espanyol. Our line requires eight, leaving a useful margin below that projection.",
    "The +2 handicap is the protection mechanism. Espanyol do not need to win or draw for this part of the bet to survive; the objective is simply to avoid a heavy defeat. Their early attacking output matters here because a side capable of progressing the ball and creating its own chances is less likely to spend the entire match defending inside its penalty area.",
    "The likely structure is favorable to both legs: Sociedad should have periods of territorial control at Anoeta, which supports corners, while Espanyol have shown enough attacking presence to compete and keep the score within range.",
    "At 1.67, the combination gives us a generous result cushion while asking for a reachable eight total corners.",
  ],

  picks: {
    main: "Espanyol +2 Handicap + Over 7.5 Corners",
    odds: 1.67,
    oddsProvenance: {
      source: "Betano — editor-supplied price",
      bookmaker: "Betano",
      provenance: "author_attested",
      market: "Espanyol +2 Handicap + Over 7.5 Corners",
    },
  },

  matchInfo: {
    date: "2026-08-29",
    time: "19:00",
    round: "Matchday 3",
    venue: "Reale Arena",
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
