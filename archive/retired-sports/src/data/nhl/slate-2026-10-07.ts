import type { NhlPublicMatch, NhlPublicMultiple } from "@/lib/nhl-slates";

// NHL October 7, 2026, public fields only. Source: the editorial package for this slate.
// Colorado and Edmonton picks, odds and analysis are NOT here: they are served only by
// /api/match-content/[slug] (see src/data/nhl/protected-2026-10-07.json).

export const NHL_PUBLIC_MATCHES_OCT_07: NhlPublicMatch[] = [
  {
    slug: "pittsburgh-penguins-vs-washington-capitals",
    title: "Pittsburgh Penguins × Washington Capitals",
    homeTeam: "Pittsburgh Penguins",
    awayTeam: "Washington Capitals",
    access: "free",
    badge: "FREE TO VIEW",
    teaser: "Goals trend. Two attacks that have produced high-scoring games early in the season meet a total of 5.5.",
    pick: "Over 5.5 Goals",
    odds: 1.62,
    analysis: [
      "Pittsburgh averaged 3.57 goals per game in 2025/26, third-best in the NHL, but also allowed 3.27. Washington averaged 3.21 scored and 2.98 conceded, giving this matchup enough offensive production from both sides to challenge a relatively low total.",
      "The early results reinforce that profile: Pittsburgh has already produced 7-0 and 6-5 scorelines this season, while Washington opened with a 5-2 win over Carolina. At 5.5 goals, the available line sits below the recent scoring profile of these teams.",
    ],
    sources: [],
  },
  {
    slug: "colorado-avalanche-vs-winnipeg-jets",
    title: "Colorado Avalanche × Winnipeg Jets",
    homeTeam: "Colorado Avalanche",
    awayTeam: "Winnipeg Jets",
    access: "best",
    badge: "BEST BET",
    teaser: "Colorado opened 2-0-0 and arrives with the stronger form. Unlock PRIME VIP for the prediction, the odds and the full analysis.",
  },
  {
    slug: "edmonton-oilers-vs-anaheim-ducks",
    title: "Edmonton Oilers × Anaheim Ducks",
    homeTeam: "Edmonton Oilers",
    awayTeam: "Anaheim Ducks",
    access: "vip",
    badge: "PRIME VIP",
    teaser: "Edmonton brings the stronger high-end offensive core into a game shaped by key absences. Unlock PRIME VIP for the prediction and the full analysis.",
  },
];

// The FREE accumulator is an independent editorial product. Its Colorado leg is shown here;
// the individual Colorado match keeps its BEST BET / PRIME VIP access and stays protected.
export const NHL_PUBLIC_MULTIPLE_OCT_07: NhlPublicMultiple = {
  title: "NHL + FOOTBALL BEST MULTIPLE TODAY",
  badge: "FREE TO VIEW",
  legs: [
    { fixture: "Colorado Avalanche vs Winnipeg Jets", teams: ["Colorado Avalanche", "Winnipeg Jets"], pick: "Colorado Avalanche to Win", odds: 1.65 },
    {
      fixture: "Cruzeiro vs São Paulo",
      teams: null,
      pick: "Cruzeiro X1 + Over 1.5 Goals",
      odds: 1.67,
      league: { slug: "brasileirao-serie-a", short: "BRA", name: "Brazilian Série A" },
    },
  ],
  combinedOdds: 2.76,
  comment:
    "Cruzeiro's home record provides the main statistical support: 7 wins, 4 draws and only 3 defeats, with an average of 1.71 goals scored per home game. São Paulo's away campaign has been much weaker at 2 wins, 3 draws and 9 defeats, averaging only 0.79 goals scored away.",
};
