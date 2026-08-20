import type { EditorialPrediction } from "@/types";

export const toulouseVsLyon: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Toulouse",
  awayTeam: "Lyon",

  analysis: [
  "Neither split is extreme, but both teams operate close to the threshold required by the market.  The matchup itself is what moves the prediction in a more attractive direction.",

  "We are not required to predict which team controls the match, only that the two sides combine for at least three goals.",

  "For Toulouse-Lyon, France 2025/26 final tables supports only broad season-record context and is not stretched into evidence about transfers, availability or either team's match plan.",

  "Toulouse versus Lyon retains the published selection, Over 2.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick.",

  "Toulouse-Lyon must produce three goals for Over 2.5 Goals; low-event scorelines such as 1-0 and 1-1 lose, and the retained table does not prove how often this matchup should cross the line."
],

picks: {
    main: "Over 2.5 Goals",
    odds: 1.78
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
