import type { EditorialPrediction } from "@/types";

export const parmaVsCagliari: EditorialPrediction = {
league: "serie-a",
homeTeam: "Parma Calcio 1913",
awayTeam: "Cagliari Calcio",
analysis: [
  "This is deliberately a conservative goals line: we do not need an open game or three-goal contest, only two total goals for the selection to succeed.",

  "Importantly, this prediction is not Both Teams to Score.  We do not need each team to find the net.",

  "Parma Calcio 1913-Cagliari Calcio uses Italy 2025/26 final tables as a final-table reference; xG, personnel, detailed head-to-head and venue-percentage claims were removed because that source does not verify them.",

  "Parma Calcio 1913 versus Cagliari Calcio retains the published selection, Over 1.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick.",

  "Parma Calcio 1913-Cagliari Calcio needs two total goals for Over 1.5 Goals; 0-0 and 1-0 lose, and the cited table is insufficient for a fixture-level goals probability."
],

picks: {
  main: "Over 1.5 Goals",
  odds: 1.47,
},

matchInfo: {
  date: "2026-08-23",
},

publishedAt: "2026-08-17T14:51:30.000Z",

sourceStatus: "partial",
sources: [
  {
    name: "Italy 2025/26 final tables",
    url: "https://www.rsssf.org/tablesi/ital2026.html",
    description: "Final 2025/26 competition table used only for season record, points and goal context.",
    accessedAt: "2026-08-20T12:45:00.000-03:00",
  },
],

published: true,
};
