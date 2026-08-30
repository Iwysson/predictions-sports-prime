import type { EditorialPrediction } from "@/types";

export const spartaRotterdamVsPecZwolle: EditorialPrediction = {
  league: "eredivisie",
  homeTeam: "Sparta Rotterdam",
  awayTeam: "PEC Zwolle",
  slug: "sparta-rotterdam-vs-pec-zwolle",
  analysis: ["# Sparta Rotterdam vs PEC Zwolle — Eredivisie 2026/27 Match Analysis\n\n🎯 **Prediction: Sparta Rotterdam or Draw (1X) + Over 2.5 Goals**  \n💰 **Odds: 1.93 (+93)**  \n**Eredivisie — Matchweek 5 | September 4, 2026 — 8:00 PM local time | Sparta-Stadion Het Kasteel, Rotterdam**\n\nThis file required a data-consistency correction. PEC Zwolle's current sequence in the supplied material contains **four league matches**, not three: **0–2 vs Ajax, 1–3 at Twente, 2–0 at Heerenveen and 1–3 vs NEC**. The correct current record is therefore **1–0–3, 4 GF and 8 GA**, or **1.00 GF/game and 2.00 GA/game**. Sparta's four matches are **0–1 vs Feyenoord, 3–1 at Telstar, 3–3 vs Utrecht and 1–2 at Excelsior**, giving **1–1–2, 7 GF and 7 GA**.\n\nThe fixture is scheduled for **20:00 at Sparta-Stadion Het Kasteel**. The forecast is around **19°C**, with wind and precipitation still requiring a matchday refresh. **Probable PEC XI:** Jasper Schendelaar; Olivier Aertssen, Simon Graves, Nick Viergever, Damian van der Haar; Ryan Thomas, Tobias Sommer; Dylan Mbayo, Thijs Oosting; Elias Sørensen, Koen Kostons. Sparta's final XI must remain based on the latest league team sheet. **Andrej Kostić** is suspended and **Max de Ligt** injured; PEC have **Younes Namli** carrying a knee issue and **Jan Bürger** among minor concerns.\n\nSparta's current match environment is open: **3.50 total goals per game**, with approximately **1.41 xG and 1.62 xGA**. Their home sample is only N=2 but sits around **1.26 xG and 1.83 xGA**, again producing 3.50 total goals. The small sample prevents strong probability claims, but it is relevant as a current tactical signal.\n\nPEC's supplied current underlying data are more concerning defensively, around **1.29 xG and 2.52 xGA** overall, with the away split around **1.48 xG and 2.51 xGA**. Their current four-game actual concession rate is now **2.00 per match**, which better aligns the observed results with the poor chance-prevention profile.\n\nPEC can still contribute to scoring. The 2–0 win at Heerenveen and the goal at Twente show that they do not need territorial dominance to create. That matters because **Over 2.5** can be reached through 2–1, 2–2 or 3–1; Sparta do not need to score three alone.\n\nThe **H2H** is the biggest contradiction. PEC are unbeaten in the last five meetings, with three wins and two draws, and **none of those five cleared Over 2.5**. Recent scores include 1–1, 1–0 PEC, 1–1, 1–0 PEC and 2–0 PEC. That directly challenges both the 1X and goal components.\n\nHowever, the latest 1–1 produced much more attacking volume than the score implies: approximately **35 combined shots, 13 SOT and 2.92 combined xG**, with Sparta at **1.67 xG and PEC 1.25**. A similar chance distribution with different finishing could produce three goals. This is why the matchup should be presented as a genuine current-data-versus-H2H conflict rather than forcing one narrative.\n\n### Statistical Core\n\n| Metric | Sparta Rotterdam — 2026/27 | PEC Zwolle — 2026/27 |\n|---|---:|---:|\n| Matches | 4 | 4 |\n| Current W-D-L | 1-1-2 | 1-0-3 |\n| GF/game | 1.75 | 1.00 |\n| GA/game | 1.75 | 2.00 |\n| Total goals/game | 3.50 | 3.00 |\n| xG/game | 1.41 | ≈1.29 |\n| xGA/game | 1.62 | ≈2.52 |\n| Home/Away xG | 1.26 home | ≈1.48 away |\n| Home/Away xGA | 1.83 home | ≈2.51 away |\n| Recent H2H unbeaten | — | 5 straight |\n| Last H2H xG | 1.67 | 1.25 |\n| Last H2H shots | 20 | 15 |\n| Last H2H SOT | 7 | 6 |\n\n**Conflict Detector.** This is one of the strongest conflicts in the batch: five straight H2Hs without a Sparta win and five straight Under 2.5 results. Current data point the other way, with Sparta matches at 3.50 goals and PEC conceding around 2.00 actual goals plus 2.52 xGA. The choice of 1X protects against another draw, but not against PEC repeating their historical matchup edge.\n\nAt **1.93**, the raw implied probability is approximately **51.8%**. No formal value claim is justified without a joint probability model.\n\n🎯 **Prediction: Sparta Rotterdam or Draw (1X) + Over 2.5 Goals**  \n💰 **Odds: 1.93 (+93)**\n"],
  analysisFormat: "markdown",
  picks: {
    main: "Sparta Rotterdam or Draw (1X) + Over 2.5 Goals",
    publishedOdds: 1.93,
    oddsProvenance: {
      source: "Supplied 10-analysis standardized verified final package",
      provenance: "author_attested",
      market: "Sparta Rotterdam or Draw (1X) + Over 2.5 Goals",
    },
  },
  published: true,
  publishedAt: "2026-08-30T10:00:00-03:00",
  sourceStatus: "verified",
  sources: [{
    name: "OpenFootball — Eredivisie 2026/27 fixtures",
    url: "https://raw.githubusercontent.com/openfootball/europe/refs/heads/master/netherlands/2026-27_nl1.txt",
    description: "Season fixture data supporting the competition, round, date, home team and away team used for publication.",
    accessedAt: "2026-08-30T10:00:00-03:00",
  }],
  matchInfo: {
    date: "2026-09-04",
    time: "20:00",
    round: "Matchweek 5",
    venue: "Sparta-Stadion Het Kasteel",
  },
};
