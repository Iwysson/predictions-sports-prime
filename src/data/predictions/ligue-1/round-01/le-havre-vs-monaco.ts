import type { EditorialPrediction } from "@/types";

export const leHavreVsMonaco: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Le Havre",
  awayTeam: "Monaco",
  analysis: [
    "Over 2.5 Goals in Le Havre against Monaco is a meeting of sharply different 2025/26 scoring profiles. The selection needs at least three total goals, so the case depends mainly on Monaco raising the tempo rather than on both teams having uniformly high-scoring records.",
    "Monaco's 34 Ligue 1 matches produced 60 goals for and 54 against, or 114 total and a derived average of 3.35. Their 17 away fixtures were even more open: 27 scored and 31 conceded, an average of 3.41 total goals.",
    "Le Havre's season moved in the opposite direction. Their 34 matches contained 32 goals for and 44 against, a 2.24 average, and their 17 home fixtures also averaged 2.24. Six home matches ended without a Le Havre goal, which is an important risk for an over dependent on contribution from both sides.",
    "The teams' previous 2025/26 meeting finished Monaco 3-1 Le Havre and cleared the line, but one head-to-head is supporting context rather than a forecast. Monaco's away total is the broader argument; Le Havre's lower-scoring home sample is the direct counterargument.",
    "Over 2.5 remains the historical pick at 1.60, an implied probability of 62.5% derived from the stored price. Because the price is short and Le Havre had a restrained home profile, the selection carries meaningful risk. No bookmaker provenance has been reconstructed."
  ],
  picks: {
    main: "Over 2.5 Goals",
    odds: 1.60
  },
  publishedAt: "2026-08-18T13:58:44.000Z",
  sourceStatus: "verified",
  sources: [
    { name: "World Soccer Data — Le Havre 2025/26", url: "https://www.worldsoccerdata.com/stats/france/ligue-1/teams/le-havre/2025", description: "Supports Le Havre's final league and home goal profile and the prior Monaco result.", accessedAt: "2026-08-20T12:10:00.000-03:00" },
    { name: "World Soccer Data — Monaco 2025/26", url: "https://www.worldsoccerdata.com/stats/france/ligue-1/teams/monaco/2025", description: "Supports Monaco's final overall and away match and goal totals.", accessedAt: "2026-08-20T12:10:00.000-03:00" }
  ],
  published: true
};
