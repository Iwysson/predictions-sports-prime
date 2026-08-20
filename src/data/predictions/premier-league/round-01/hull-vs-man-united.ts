import type { EditorialPrediction } from "@/types";

export const hullVsManUnited: EditorialPrediction = {
  league: "premier-league",
  homeTeam: "Hull City",
  awayTeam: "Manchester United",

  analysis: [
  "Hull City-Manchester United loses Both Teams to Score — Yes if either side keeps a clean sheet; that two-sided dependency is the central risk, and the available table cannot turn it into a verified probability.",

  "Hull City-Manchester United uses England 2025/26 final tables as a final-table reference; xG, personnel, detailed head-to-head and venue-percentage claims were removed because that source does not verify them.",

  "The most relevant trend for this selection is Manchester United's defensive record in those fixtures.",

  "Both Teams to Score — Yes needs a goal from both Hull City and Manchester United; one clean sheet defeats the position even if the match otherwise follows the expected balance.",

  "Hull City versus Manchester United retains the published selection, Both Teams to Score — Yes, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick."
],

picks: {
    main: "Both Teams to Score — Yes",
    odds: 1.93
  },

  matchInfo: {
    date: "2026-08-22",
    time: "12:30",
  },

  publishedAt: "2026-08-16T19:07:21.000Z",

sourceStatus: "partial",
sources: [
  {
    name: "England 2025/26 final tables",
    url: "https://www.rsssf.org/tablese/eng2026.html",
    description: "Final 2025/26 competition table used only for season record, points and goal context.",
    accessedAt: "2026-08-20T12:45:00.000-03:00",
  },
],

published: true,
};
