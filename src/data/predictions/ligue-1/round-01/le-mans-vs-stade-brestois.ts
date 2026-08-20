import type { EditorialPrediction } from "@/types";

export const leMansVsStadeBrestois: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Le Mans",
  awayTeam: "Brest",

  analysis: [
  "Brest or Draw (X2) + Over 1.5 Goals gives Le Mans-Brest two independent tests: the protected result and at least two goals; no unsupported venue percentage is used to claim that both legs are likely.",

  "Le Mans-Brest uses France 2025/26 final tables as a final-table reference; xG, personnel, detailed head-to-head and venue-percentage claims were removed because that source does not verify them.",

  "We are not asking Brest to win away from home; instead, we use the draw protection while requiring only two total goals.",

  "Le Mans versus Brest retains the published selection, Brest or Draw (X2) + Over 1.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick."
],

picks: {
    main: "Brest or Draw (X2) + Over 1.5 Goals",
    odds: 2.02
  },

  publishedAt: "2026-08-18T13:58:44.000Z",

sourceStatus: "partial",
sources: [
  {
    name: "France 2025/26 final tables",
    url: "https://www.rsssf.org/tablesf/fran2026.html",
    description: "Final 2025/26 competition table used only for season record, points and goal context.",
    accessedAt: "2026-08-20T12:45:00.000-03:00",
  },
],

published: true
};
