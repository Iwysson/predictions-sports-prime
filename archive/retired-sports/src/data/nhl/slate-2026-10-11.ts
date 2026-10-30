import type { NhlPublicMatch } from "@/lib/nhl-slates";

// NHL October 11, 2026, public fields only. Fixture identity, records and venues were checked
// against the official NHL score API on October 10. Protected BEST BET / PRIME VIP selections
// live only in protected-2026-10-11.json and remain unavailable before 00:00 America/New_York.
export const NHL_PUBLIC_MATCHES_OCT_11: NhlPublicMatch[] = [
  {
    slug: "seattle-kraken-vs-washington-capitals",
    title: "Seattle Kraken × Washington Capitals",
    homeTeam: "Washington Capitals",
    awayTeam: "Seattle Kraken",
    access: "best",
    badge: "BEST BET",
    teaser:
      "Washington's balanced start and home ice meet a Seattle side arriving from a six-goal performance. Unlock PRIME VIP for the prediction, odds and full analysis.",
  },
  {
    slug: "vancouver-canucks-vs-new-york-rangers",
    title: "Vancouver Canucks × New York Rangers",
    homeTeam: "New York Rangers",
    awayTeam: "Vancouver Canucks",
    access: "free",
    badge: "FREE TO VIEW",
    teaser:
      "New York's stronger opening record and home ice at Madison Square Garden are weighed against Vancouver's attacking threat.",
    pick: "New York Rangers to Win (Including OT & Shootout)",
    odds: 1.43,
    analysis: [
      "The Rangers bring a 4-2-0 record into this matchup, while Vancouver arrive at 2-3-0 after conceding seven goals in Carolina. New York's stronger opening return and home ice at Madison Square Garden provide the clearest reasons to favor the Rangers.",
      "Vancouver still carry enough attacking quality to make the short price uncomfortable, and New York's 3-1 loss in Washington shows that the Rangers are not immune to being contained. No starting goaltender or injury status is assumed before the official teams confirm it.",
      "The preference remains New York because of the better early record and home environment. The moneyline selection includes overtime and a shootout, so a tie after regulation does not end the wager.",
    ],
    sources: [
      { name: "NHL official October 11 scoreboard", url: "https://api-web.nhle.com/v1/score/2026-10-11" },
      { name: "NHL official October 9 scoreboard", url: "https://api-web.nhle.com/v1/score/2026-10-09" },
      { name: "NHL official October 8 scoreboard", url: "https://api-web.nhle.com/v1/score/2026-10-08" },
    ],
  },
  {
    slug: "carolina-hurricanes-vs-philadelphia-flyers",
    title: "Carolina Hurricanes × Philadelphia Flyers",
    homeTeam: "Philadelphia Flyers",
    awayTeam: "Carolina Hurricanes",
    access: "vip",
    badge: "PRIME VIP",
    teaser:
      "Carolina's recent seven-goal display meets a Philadelphia side still searching for its first win. Unlock PRIME VIP for the prediction and full analysis.",
  },
];
