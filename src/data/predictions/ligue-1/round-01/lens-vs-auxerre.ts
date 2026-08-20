
import type { EditorialPrediction } from "@/types";

export const lensVsAuxerre: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Lens",
  awayTeam: "Auxerre",

  analysis: [
  "For Lens-Auxerre, France 2025/26 final tables supports only broad season-record context and is not stretched into evidence about transfers, availability or either team's match plan.",

  "Importantly, we are not using a handicap.  This removes the additional requirement of Lens winning by multiple goals and keeps the selection focused entirely on the stronger home side taking three points.",

  "We do not need Auxerre to score for BTTS, we do not need the match to reach a particular total-goals threshold, and we do not need Lens to cover a handicap.",

  "Lens to Win requires Lens to win; a draw is a full loss. Season-level evidence can frame the matchup, but it cannot establish the outcome of one fixture.",

  "Lens versus Auxerre retains the published selection, Lens to Win, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick."
],

picks: {
    main: "Lens to Win",
    odds: 1.60
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
