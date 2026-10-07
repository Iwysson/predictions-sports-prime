import type { NhlPublicMatch, NhlPublicMultiple } from "@/lib/nhl-slates";

// NHL October 8, 2026, public fields only. Source: the editorial package for this slate.
// BEST BET and PRIME VIP picks, odds and analysis are NOT here: they are served only by
// /api/match-content/[slug] (see src/data/nhl/protected-2026-10-08.json).

export const NHL_PUBLIC_MATCHES_OCT_08: NhlPublicMatch[] = [
  {
    slug: "boston-bruins-vs-utah-mammoth",
    title: "Boston Bruins × Utah Mammoth",
    homeTeam: "Boston Bruins",
    awayTeam: "Utah Mammoth",
    access: "free",
    badge: "FREE TO VIEW",
    teaser: "Utah's controlled offensive start meets a Boston team playing without Charlie McAvoy. The total sits under both the split model and the H2H average.",
    pick: "Under 6.5 Goals",
    odds: 1.66,
    analysis: [
      "Utah's opening profile supports a controlled total more than an aggressive Over. The Mammoth entered this matchup at 2-1-0 after outscoring their first three opponents 12-5, an average of 4.00 goals scored and only 1.67 allowed per game. Boston entered at 2-2-0, and Jeremy Swayman had started the season 2-1-0 with a 2.30 goals-against average, a .914 save percentage and one shutout.",
      "The longer-term matchup also favors protection above six goals. The 2025-26 home/away split model produced an expected total of 6.04 goals, while the two 2025-26 head-to-head meetings averaged 5.00. Boston will be without Charlie McAvoy because of suspension, which raises Utah's offensive ceiling, especially against a Mammoth power play that converted six of its first nine opportunities. Even with that adjustment, the 6.5 line leaves room for a six-goal game.",
    ],
    sources: [{ name: "nhl.com", url: "https://www.nhl.com" }],
  },
  {
    slug: "buffalo-sabres-vs-dallas-stars",
    title: "Buffalo Sabres × Dallas Stars",
    homeTeam: "Buffalo Sabres",
    awayTeam: "Dallas Stars",
    access: "free",
    badge: "FREE TO VIEW",
    teaser: "Both location splits and the 2025-26 head-to-head average point above 5.5 goals, with Buffalo's early goaltending numbers adding further scoring risk.",
    pick: "Over 5.5 Goals",
    odds: 1.75,
    analysis: [
      "The 2025-26 location splits produce a strong baseline for six or more goals. Dallas averaged 3.41 goals scored away from home, while Buffalo allowed 2.88 per home game. Buffalo averaged 3.54 goals at home and Dallas allowed 2.73 on the road. Combining each offense with the opposing defense gives approximately 3.15 expected goals for Dallas and 3.14 for Buffalo, or 6.29 total.",
      "The two 2025-26 meetings finished with five and seven total goals, averaging 6.00. Buffalo's early goaltending numbers add volatility: Ukko-Pekka Luukkonen entered with a 4.50 GAA and .763 save percentage, while Alex Lyon was at 4.03 and .784. Dallas has received much stronger early goaltending, but its top offensive group still includes Robertson, Hintz, Rantanen and Johnston. Matt Duchene remains unavailable, which is the principal negative for the Over.",
    ],
    sources: [{ name: "nhl.com", url: "https://www.nhl.com" }],
  },
  {
    slug: "tampa-bay-lightning-vs-minnesota-wild",
    title: "Tampa Bay Lightning × Minnesota Wild",
    homeTeam: "Tampa Bay Lightning",
    awayTeam: "Minnesota Wild",
    access: "free",
    badge: "FREE TO VIEW",
    teaser: "Minnesota's road scoring and Tampa Bay's home output combine with a strong head-to-head average to point well above the total.",
    pick: "Over 5.5 Goals",
    odds: 1.80,
    analysis: [
      "The 2025-26 location splits point above the 5.5 line. Minnesota averaged 3.46 goals scored away from home and Tampa Bay allowed 2.80 at home. Tampa averaged 3.29 at home and Minnesota allowed 2.98 on the road. The combined model gives roughly 3.13 expected goals to each side and a 6.27 total.",
      "The head-to-head results reinforce that projection. The two 2025-26 meetings produced six and nine goals, an average of 7.50, and both cleared 5.5. Minnesota's early defensive numbers have been strong, but the Wild are dealing with meaningful personnel losses, including Brock Faber on injured reserve and Filip Gustavsson listed among the unavailable players entering the matchup.",
    ],
    sources: [{ name: "nhl.com", url: "https://www.nhl.com" }],
  },
  {
    slug: "new-york-islanders-vs-chicago-blackhawks",
    title: "New York Islanders × Chicago Blackhawks",
    homeTeam: "New York Islanders",
    awayTeam: "Chicago Blackhawks",
    access: "best",
    badge: "BEST BET",
    teaser: "The Islanders carry the stronger early defensive profile into a home game against a Chicago team conceding at a high rate. Unlock PRIME VIP for the prediction, the odds and the full analysis.",
  },
  {
    slug: "carolina-hurricanes-vs-vancouver-canucks",
    title: "Carolina Hurricanes × Vancouver Canucks",
    homeTeam: "Carolina Hurricanes",
    awayTeam: "Vancouver Canucks",
    access: "best",
    badge: "BEST BET",
    teaser: "One of the strongest statistical Over profiles on the slate, backed by the location model, the recent head-to-head and both teams' early goaltending numbers. Unlock PRIME VIP for the prediction, the odds and the full analysis.",
  },
  {
    slug: "montreal-canadiens-vs-nashville-predators",
    title: "Montreal Canadiens × Nashville Predators",
    homeTeam: "Montreal Canadiens",
    awayTeam: "Nashville Predators",
    access: "vip",
    badge: "PRIME VIP",
    teaser: "Montreal's home scoring profile gives the Canadiens an edge over a Nashville side that keeps games competitive. Unlock PRIME VIP for the prediction and the full analysis.",
  },
  {
    slug: "ottawa-senators-vs-philadelphia-flyers",
    title: "Ottawa Senators × Philadelphia Flyers",
    homeTeam: "Ottawa Senators",
    awayTeam: "Philadelphia Flyers",
    access: "vip",
    badge: "PRIME VIP",
    teaser: "Ottawa swept the 2025-26 head-to-head against a Philadelphia offense that has struggled badly to start 2026-27. Unlock PRIME VIP for the prediction and the full analysis.",
  },
  {
    slug: "st-louis-blues-vs-san-jose-sharks",
    title: "St. Louis Blues × San Jose Sharks",
    homeTeam: "St. Louis Blues",
    awayTeam: "San Jose Sharks",
    access: "vip",
    badge: "PRIME VIP",
    teaser: "The location model lands just above the goals total, though a mixed head-to-head keeps this below the slate's strongest Overs. Unlock PRIME VIP for the prediction and the full analysis.",
  },
  {
    slug: "calgary-flames-vs-colorado-avalanche",
    title: "Calgary Flames × Colorado Avalanche",
    homeTeam: "Calgary Flames",
    awayTeam: "Colorado Avalanche",
    access: "vip",
    badge: "PRIME VIP",
    teaser: "Colorado's elite early scoring and Calgary's defensive vulnerability converge with a head-to-head average already above the total. Unlock PRIME VIP for the prediction and the full analysis.",
  },
  {
    slug: "vegas-golden-knights-vs-toronto-maple-leafs",
    title: "Vegas Golden Knights × Toronto Maple Leafs",
    homeTeam: "Vegas Golden Knights",
    awayTeam: "Toronto Maple Leafs",
    access: "vip",
    badge: "PRIME VIP",
    teaser: "The home/away split model and a highly aggressive recent head-to-head both support the Over. Unlock PRIME VIP for the prediction and the full analysis.",
  },
];

// The NHL Multiple is an independent editorial product. Both legs' individual matches keep
// their own access level (BEST BET / PRIME VIP) and stay protected on their own cards.
export const NHL_MULTIPLE_OCT_08: NhlPublicMultiple = {
  title: "NHL BEST MULTIPLE TODAY",
  badge: "FREE TO VIEW",
  legs: [
    { fixture: "Montreal Canadiens vs Nashville Predators", teams: ["Montreal Canadiens", "Nashville Predators"], pick: "Montreal Canadiens to Win (Including OT/SO)", odds: 1.67 },
    { fixture: "New York Islanders vs Chicago Blackhawks", teams: ["New York Islanders", "Chicago Blackhawks"], pick: "New York Islanders to Win (Including OT/SO)", odds: 1.61 },
  ],
  combinedOdds: 2.69,
  comment:
    "Montreal has the stronger recent matchup profile against Nashville, winning both 2025-26 meetings. New York faces a Chicago team still missing key pieces defensively, and both selections include overtime and the shootout to protect against another close game.",
};

export const NHL_FOOTBALL_MULTIPLE_OCT_08: NhlPublicMultiple = {
  title: "NHL + FOOTBALL BEST MULTIPLE TODAY",
  badge: "FREE TO VIEW",
  legs: [
    { fixture: "Buffalo Sabres vs Dallas Stars", teams: ["Buffalo Sabres", "Dallas Stars"], pick: "Over 5.5 Goals", odds: 1.75 },
    {
      fixture: "Fluminense vs Coritiba",
      teams: null,
      pick: "Fluminense to Win + Over 1.5 Goals",
      odds: 1.87,
      league: { slug: "brasileirao-serie-a", short: "BRA", name: "Brazilian Série A" },
    },
  ],
  combinedOdds: 3.27,
  comment:
    "Fluminense collected 77% of the available points at home in the first half of the 2026 Brasileirão and 83% in the second half, and has not lost to Coritiba at home in Série A since 2009. Combined with the strong Buffalo-Dallas scoring profile, the two legs support the combined price.",
};

export const NFL_FOOTBALL_MULTIPLE_OCT_08: NhlPublicMultiple = {
  title: "NFL + FOOTBALL BEST MULTIPLE TODAY",
  badge: "FREE TO VIEW",
  legs: [
    {
      fixture: "Tampa Bay Buccaneers vs Dallas Cowboys",
      teams: null,
      pick: "Dallas Cowboys -3.5",
      odds: 1.43,
      league: { slug: "nfl", short: "NFL", name: "NFL" },
    },
    {
      fixture: "Fluminense vs Coritiba",
      teams: null,
      pick: "Fluminense to Win + Over 1.5 Goals",
      odds: 1.87,
      league: { slug: "brasileirao-serie-a", short: "BRA", name: "Brazilian Série A" },
    },
  ],
  combinedOdds: 2.67,
  comment:
    "Dallas enters with a clear offensive upswing and does not need a blowout to cover -3.5 at home. Fluminense's home record and Coritiba's long winless run in Rio support the second leg, giving the combination two independently supported selections.",
};
