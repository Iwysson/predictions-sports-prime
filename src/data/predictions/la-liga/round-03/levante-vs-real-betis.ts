import type { EditorialPrediction } from "@/types";

export const levanteVsRealBetis: EditorialPrediction = {
  league: "la-liga",
  homeTeam: "Levante",
  awayTeam: "Real Betis",

  analysis: [
    "Levante return to the Ciutat de València needing a response after a difficult start, while Betis arrive with a much more productive attacking profile. The early-season sample is still small, but the match dynamics point toward territorial pressure, wide attacks and enough activity around both penalty areas to make this combination attractive.",
    "Betis produced 14 shots in their opening league match, while Levante have already faced sustained pressure across their first two fixtures. The most useful reference is not simply the scoreline of previous meetings, but the way these teams generate attacking volume. In their latest league meeting, Betis and Levante combined for 34 shots, 16 on target and 12 corners. That is the type of game flow we want: repeated entries into the final third, blocked attempts, crosses and second balls.",
    "The corner requirement is only eight. Last season, Levante’s league matches averaged 10.18 total corners, with 71% clearing 7.5, while their home average was 9.95. Betis away matches averaged 10.11 total corners and their overall Over 7.5 rate was 74%. Those numbers give the corner leg a solid statistical base without requiring an extreme match.",
    "For goals, the line is deliberately conservative. We need only two across 90 minutes. Betis have enough technical quality to create chances through possession, while Levante’s need to be more assertive at home should prevent the game from becoming entirely one-sided and passive.",
    "The selection does not depend on either team winning. We are backing the volume of the match: at least two goals and eight corners. At 1.67, that balance is more attractive than choosing a side.",
  ],

  picks: {
    main: "Over 1.5 Goals + Over 7.5 Corners",
    odds: 1.67,
    oddsProvenance: {
      source: "Betano — editor-supplied price",
      bookmaker: "Betano",
      provenance: "author_attested",
      market: "Over 1.5 Goals + Over 7.5 Corners",
    },
  },

  matchInfo: {
    date: "2026-08-29",
    time: "17:00",
    round: "Matchday 3",
    venue: "Estadi Ciutat de València",
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
