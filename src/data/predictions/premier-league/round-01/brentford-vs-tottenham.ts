import type { EditorialPrediction } from "@/types";

export const brentfordVsTottenham: EditorialPrediction = {
  league: "premier-league",
  homeTeam: "Brentford",
  awayTeam: "Tottenham Hotspur",

  analysis: [
  "Rather than backing either side in a potentially competitive opening fixture, the goals market offers the more attractive angle.",

  "Brentford-Tottenham Hotspur uses England 2025/26 final tables as a final-table reference; xG, personnel, detailed head-to-head and venue-percentage claims were removed because that source does not verify them.",

  "Brentford versus Tottenham Hotspur retains the published selection, Over 2.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick.",

  "Brentford-Tottenham Hotspur must produce three goals for Over 2.5 Goals; low-event scorelines such as 1-0 and 1-1 lose, and the retained table does not prove how often this matchup should cross the line."
],

picks: {
    main: "Over 2.5 Goals",
    odds: 1.67,
  },

  matchInfo: {
    date: "2026-08-22",
    time: "17:30",
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
