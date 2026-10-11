import type { NhlPublicMatch } from "@/lib/nhl-slates";

// NHL October 12, 2026, public fields only. Home team for each fixture is taken from the
// published venue (not from the source package's narrative team order). Protected BEST BET /
// PRIME VIP selections live only in protected-2026-10-12.json and remain unavailable before
// 00:00 America/New_York.
export const NHL_PUBLIC_MATCHES_OCT_12: NhlPublicMatch[] = [
  {
    slug: "florida-panthers-vs-buffalo-sabres",
    title: "Florida Panthers × Buffalo Sabres",
    homeTeam: "Buffalo Sabres",
    awayTeam: "Florida Panthers",
    access: "free",
    badge: "FREE TO VIEW",
    teaser:
      "Buffalo's early defensive results have been poor, but last season's scoring ceiling and a head-to-head edge over Florida support the Sabres at home.",
    pick: "Buffalo Sabres to Win (Including OT/SO)",
    odds: 2.12,
    analysis: [
      "Buffalo's early defensive results have been poor, but last season's 288 goals and 50 wins show a much higher ceiling than that start suggests. The Sabres also won three of four meetings with Florida in 2025/26, giving Buffalo a measurable head-to-head edge at home.",
    ],
    sources: [
      { name: "NHL official schedule, results and team statistics", url: "https://www.nhl.com/" },
      { name: "NHL official standings", url: "https://www.nhl.com/standings" },
      { name: "NHL official injury and team news", url: "https://www.nhl.com/news" },
    ],
  },
  {
    slug: "new-jersey-devils-vs-ottawa-senators",
    title: "Ottawa Senators × New Jersey Devils",
    homeTeam: "New Jersey Devils",
    awayTeam: "Ottawa Senators",
    access: "vip",
    badge: "PRIME VIP",
    teaser:
      "Ottawa's early scoring rate meets a New Jersey defense that has already allowed 14 goals in four games. Unlock PRIME VIP for the prediction and full analysis.",
  },
  {
    slug: "vegas-golden-knights-vs-minnesota-wild",
    title: "Vegas Golden Knights × Minnesota Wild",
    homeTeam: "Minnesota Wild",
    awayTeam: "Vegas Golden Knights",
    access: "best",
    badge: "BEST BET",
    teaser:
      "Vegas arrive averaging 3.83 goals a night and Minnesota have enough scoring talent of their own. Unlock PRIME VIP for the prediction, odds and full analysis.",
  },
];
