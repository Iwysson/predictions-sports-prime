import type { EditorialPrediction } from "@/types";

export const parisSaintGermainVsRennes: EditorialPrediction = {
  league: "ligue-1",
  homeTeam: "Paris Saint-Germain",
  awayTeam: "Rennes",
  analysis: [
    "PSG -1.5 Asian Handicap requires Paris Saint-Germain to win by at least two goals. The verified 2025/26 league record gives that position a clear statistical basis, but the margin condition is materially stricter than simply backing the hosts to win.",
    "PSG completed 34 Ligue 1 matches with a 24-4-6 record and 74 goals scored against 29 conceded. At the Parc des Princes they went 13-2-2 and scored 41 goals while conceding 12, derived averages of 2.41 scored and 0.71 allowed per home match.",
    "The same season source records a 5-0 home victory over Rennes in December 2025, while PSG lost the return meeting 3-1 in Rennes in February. Those contrasting results show both the route to a two-goal home margin and the danger of treating one head-to-head result as deterministic.",
    "The handicap is preferred because PSG's home goal difference and scoring output created repeated opportunities for multi-goal wins. The counterargument is that Rennes finished with 59 points and a positive attacking record, so PSG must still convert territorial superiority into a clear margin.",
    "At the preserved historical price of 2.02, the implied probability is 49.5% (1 ÷ 2.02). PSG -1.5 remains the recorded selection; the bookmaker source was not recovered and is not inferred from the statistical pages."
  ],
  picks: {
    main: "PSG -1.5 Asian Handicap",
    odds: 2.02
  },
  publishedAt: "2026-08-18T13:58:44.000Z",
  sourceStatus: "verified",
  sources: [
    { name: "World Soccer Data — PSG 2025/26", url: "https://www.worldsoccerdata.com/stats/france/ligue-1/teams/paris-saint-germain/2025", description: "Supports PSG's final league, home and goal records and the two 2025/26 Rennes results.", accessedAt: "2026-08-20T12:10:00.000-03:00" },
    { name: "World Soccer Data — Rennes 2025/26", url: "https://www.worldsoccerdata.com/stats/france/ligue-1/teams/rennes/2025", description: "Supports Rennes' final 2025/26 league profile used as the counterpoint.", accessedAt: "2026-08-20T12:10:00.000-03:00" }
  ],
  published: true
};
