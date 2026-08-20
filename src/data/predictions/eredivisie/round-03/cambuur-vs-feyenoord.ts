import type { EditorialPrediction } from "@/types";
export const cambuurVsFeyenoord: EditorialPrediction = {
  league: "eredivisie",
  homeTeam: "SC Cambuur",
  awayTeam: "Feyenoord",
  analysis: [
    "Feyenoord -1.5 Asian Handicap requires an away victory by at least two goals. Verified pre-match context establishes Cambuur as newly promoted and shows Feyenoord's prior Eredivisie profile, but the margin condition still requires more than a general difference in status.",
    "Feyenoord finished second in 2025/26 with a 19-8-7 record and 70 goals scored. Away from home they went 8-5-4, scoring 31 and conceding 21. That is a solid road record, but only 1.82 goals scored per away match as a derived average.",
    "Cambuur returned to the top flight for 2026/27. Before this analysis was published, their first two league results were a 0-4 home loss to Excelsior and a 3-1 loss at Fortuna, providing timely evidence of early defensive difficulty without using information from the Feyenoord match itself.",
    "The two-goal margin is the critical uncertainty. Feyenoord's quality and Cambuur's opening defeats create a plausible route, but Feyenoord's average away output does not independently establish that margin.",
    "At 1.82 the implied probability is 54.9%. The historical pick is preserved, but the evidence supports away favouritism more strongly than a multi-goal win, so manual editorial review is required. Odds provenance remains unknown."
  ],
  picks: {
    main: "Feyenoord -1.5 Asian Handicap",
    odds: 1.82
  },
  publishedAt: "2026-08-18T21:31:21.000Z",
  sourceStatus: "verified",
  sources: [
    { name: "World Soccer Data — Feyenoord 2025/26", url: "https://www.worldsoccerdata.com/stats/netherlands/eredivisie/teams/feyenoord/2025", description: "Supports Feyenoord's final league and away records and goal totals.", accessedAt: "2026-08-20T12:30:00.000-03:00" },
    { name: "Eredivisie — SC Cambuur promotion", url: "https://eredivisie.nl/nieuws/sc-cambuur-en-henk-de-jong-doen-het-opnieuw/", description: "Official league context confirming Cambuur's promotion for 2026/27.", accessedAt: "2026-08-20T12:30:00.000-03:00" },
    { name: "Eredivisie — Round 2 review", url: "https://eredivisie.nl/nieuws/vierklappers-en-comebacks-de-opvallendste-cijfers-van-speelronde-2/", description: "Pre-publication round review used for Cambuur's opening-season context.", accessedAt: "2026-08-20T12:30:00.000-03:00" }
  ],
  published: true
};
