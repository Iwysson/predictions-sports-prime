import type { EditorialPrediction } from "@/types";

export const deportivoLaCoruñaVsElche: EditorialPrediction = {
  league: "la-liga",
  homeTeam: "RC Deportivo La Coruña",
  awayTeam: "Elche",

  analysis: [
  "RC Deportivo La Coruña-Elche needs two total goals for Over 1.5 Goals; 0-0 and 1-0 lose, and the cited table is insufficient for a fixture-level goals probability.",

  "RC Deportivo La Coruña-Elche uses Spain 2025/26 final tables as a final-table reference; xG, personnel, detailed head-to-head and venue-percentage claims were removed because that source does not verify them.",

  "We only want to enter if the match itself confirms the attacking pattern we expect.",

  "RC Deportivo La Coruña versus Elche retains the published selection, Over 1.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick."
],

picks: {
    main: "Over 1.5 Goals",
    odds: 1.44
  },

  matchInfo: {
    date: "2026-08-17",
    time: "19:00",
  },

  publishedAt: "2026-08-16T20:27:43.000Z",

sourceStatus: "partial",
sources: [
  {
    name: "Spain 2025/26 final tables",
    url: "https://www.rsssf.org/tabless/span2026.html",
    description: "Final 2025/26 competition table used only for season record, points and goal context.",
    accessedAt: "2026-08-20T12:45:00.000-03:00",
  },
],

published: true,
};
