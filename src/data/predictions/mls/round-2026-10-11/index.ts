import { createPspImport37Prediction } from "../../editorial-tools/psp-import-37/factory";

// Source: PSP 37-analyses consolidated publication package (11 October 2026). Predictions, odds
// and FREE/BEST BET/PRIME VIP labels are taken from the package unchanged. No venue is supplied
// by the source package, so matchInfo.venue is intentionally omitted rather than guessed.
const common = {
  league: "mls" as const,
  competition: "Major League Soccer — 2026 Regular Season",
  round: "Regular season",
  publishedAt: "2026-10-11T12:00:00.000-03:00",
};

const inputs = [
  {
    ...common,
    slug: "st-louis-city-sc-vs-la-galaxy",
    home: "St. Louis City SC",
    away: "LA Galaxy",
    date: "2026-10-11",
    time: "19:30",
    pick: "Over 2.5 Total Goals",
    odds: 1.42,
    access: "vip" as const,
    teaser: "St. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "St.",
    analysis: ["St. Louis scored 48 goals through 27 league matches and have been more reliable at home than away. The Galaxy's road defense has been inconsistent, so St. Louis' scoring rate plus LA's ability to contribute make three total goals a realistic target."],
    sources: [{ name: "MLS official schedule", url: "https://www.mlssoccer.com/schedule/" }, { name: "MLS official standings", url: "https://www.mlssoccer.com/standings/2026/" }, { name: "SoccerSTATS MLS home/away", url: "https://www.soccerstats.com/homeaway.asp?league=usa" }, { name: "MLS fixtures October 2026", url: "https://plaintextsports.com/mls/2026/schedule" }, { name: "MLS international call-ups", url: "https://www.mlssoccer.com/news/every-mls-call-up-september-october-2026-international-window" }],
  },
];

export const mlsRound2026_10_11 = inputs.map(createPspImport37Prediction);
