import type { EditorialPrediction } from "@/types";

export const veneziaVsLecce: EditorialPrediction = {
  league: "serie-a",
  homeTeam: "Venezia",
  awayTeam: "Lecce",

  analysis: [
  "Venezia or Draw (1X) + Over 1.5 Goals gives Venezia-Lecce two independent tests: the protected result and at least two goals; no unsupported venue percentage is used to claim that both legs are likely.",

  "Venezia-Lecce uses Italy 2025/26 final tables as a final-table reference; xG, personnel, detailed head-to-head and venue-percentage claims were removed because that source does not verify them.",

  "Although Serie A represents a significant increase in opposition quality, this level of home attacking consistency remains highly relevant when we require only two total goals.",

  "Venezia versus Lecce retains the published selection, Venezia or Draw (1X) + Over 1.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick."
],

picks: {
    main: "Venezia or Draw (1X) + Over 1.5 Goals",
    odds: 1.88
  },

  publishedAt: "2026-08-18T13:58:44.000Z",

sourceStatus: "partial",
sources: [
  {
    name: "Italy 2025/26 final tables",
    url: "https://www.rsssf.org/tablesi/ital2026.html",
    description: "Final 2025/26 competition table used only for season record, points and goal context.",
    accessedAt: "2026-08-20T12:45:00.000-03:00",
  },
],

published: true
};
