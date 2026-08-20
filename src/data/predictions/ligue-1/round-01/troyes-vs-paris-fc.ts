import type { EditorialPrediction } from "@/types";

export const troyesVsParisFc: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Troyes",
  awayTeam: "Paris FC",

  analysis: [
  "Troyes-Paris FC must produce three goals for Over 2.5 Goals; low-event scorelines such as 1-0 and 1-1 lose, and the retained table does not prove how often this matchup should cross the line.",

  "Troyes-Paris FC has one retained evidence boundary: France 2025/26 final tables records the completed competition but cannot substantiate the old granular statistical and team-news claims, which are omitted rather than reconstructed.",

  "That is particularly relevant because this selection does not depend entirely on Paris FC generating the scoring.",

  "Troyes versus Paris FC retains the published selection, Over 2.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick."
],

picks: {
    main: "Over 2.5 Goals",
    odds: 1.72
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
