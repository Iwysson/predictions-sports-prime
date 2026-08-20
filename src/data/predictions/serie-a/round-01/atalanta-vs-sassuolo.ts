import type { EditorialPrediction } from "@/types";

export const atalantaVsSassuolo: EditorialPrediction = {
  league: "serie-a",
  homeTeam: "Atalanta",
  awayTeam: "Sassuolo",

  analysis: [
  "Atalanta-Sassuolo must produce three goals for Over 2.5 Goals; low-event scorelines such as 1-0 and 1-1 lose, and the retained table does not prove how often this matchup should cross the line.",

  "Italy 2025/26 final tables is retained only for Atalanta and Sassuolo's prior-season competition context; it documents no pre-match lineup, injury list, tactical plan or bookmaker price for this fixture.",

  "That prevents us from treating this as an automatic goals selection based purely on Atalanta's home results.",

  "Atalanta versus Sassuolo retains the published selection, Over 2.5 Goals, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick."
],

picks: {
    main: "Over 2.5 Goals",
    odds: 1.70
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
