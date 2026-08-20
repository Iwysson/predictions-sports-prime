import type { EditorialPrediction } from "@/types";

export const athleticClubVsSevilla: EditorialPrediction = {
league: "la-liga",
homeTeam: "Athletic Club",
awayTeam: "Sevilla",
analysis: [
  "Athletic Club or Draw (1X) + Over 1.5 Goals gives Athletic Club-Sevilla two independent tests: the protected result and at least two goals; no unsupported venue percentage is used to claim that both legs are likely.",

  "Athletic Club-Sevilla has one retained evidence boundary: Spain 2025/26 final tables records the completed competition but cannot substantiate the old granular statistical and team-news claims, which are omitted rather than reconstructed.",

  "Rather than requiring Athletic to win, this market gives us protection against a draw while asking for only two goals in the match.",

  "Athletic Club versus Sevilla retains the published selection, Athletic Club or Draw (1X) + Over 1.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick."
],

picks: {
  main: "Athletic Club or Draw (1X) + Over 1.5 Goals",
  odds: 1.65,
},

matchInfo: {
  date: "2026-08-22",
  time: "12:00",
},

publishedAt: "2026-08-17T14:51:30.000Z",

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
