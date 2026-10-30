import type { NhlPublicMatch } from "@/lib/nhl-slates";

// NHL October 9, 2026, public fields only. Source: the PSP NHL + Brasileirão publication package.
// BEST BET and PRIME VIP picks, odds and analysis are NOT here: they are served only by
// /api/match-content/[slug] (see src/data/nhl/protected-2026-10-09.json), which answers 404 until
// the NHL day (America/New_York) reaches 2026-10-09.
// Matches are listed home team first, so the LIVE badge and settlement use the provider's order.

export const NHL_PUBLIC_MATCHES_OCT_09: NhlPublicMatch[] = [
  {
    slug: "detroit-red-wings-vs-seattle-kraken",
    title: "Detroit Red Wings × Seattle Kraken",
    homeTeam: "Detroit Red Wings",
    awayTeam: "Seattle Kraken",
    access: "free",
    badge: "FREE TO VIEW",
    teaser: "Detroit's home opener pairs a productive home attack with a leaky defense against a Seattle side that scored sparingly on the road last season.",
    pick: "Detroit Red Wings to Win (Including OT & Shootout)",
    odds: 1.88,
    analysis: [
      "Puck drop is scheduled for 7:00 p.m. ET on Friday, October 9, at Little Caesars Arena in Detroit, Michigan, in the Red Wings' home opener against Seattle.",
      "Detroit come in with an uncomfortable defensive backdrop. Last season the Red Wings conceded approximately 3.29 goals per game at Little Caesars Arena while scoring around 3.10, a thin margin for a team that wants to win consistently. Seattle averaged only about 2.54 goals scored away from home, so the visitors were a less threatening road attack than Detroit is at home.",
      "The Kraken's early results still warn against writing off their scoring: they have produced a six-goal outing against Calgary as well as a heavy defeat to Vegas. Detroit will need cleaner defensive-zone exits and better coverage around the crease to stop Seattle exploiting those familiar weaknesses. The Red Wings' route to a win runs less through shutting the game down and more through making their home offense count against a visiting team that conceded approximately 3.27 goals per away game last season.",
      "The historical split gives Detroit an attacking opening but not a decisive advantage, and the confirmed starting goaltenders could change the matchup materially. The moneyline selection includes overtime and a shootout, so a tie after regulation does not end the wager.",
    ],
    sources: [
      { name: "NHL official schedule", url: "https://www.nhl.com/schedule" },
      { name: "NHL matchup schedule and records", url: "https://deepmetricanalytics.com/nhl/schedule?date=2026-10-09" },
    ],
  },
  {
    slug: "columbus-blue-jackets-vs-pittsburgh-penguins",
    title: "Columbus Blue Jackets × Pittsburgh Penguins",
    homeTeam: "Columbus Blue Jackets",
    awayTeam: "Pittsburgh Penguins",
    access: "best",
    badge: "BEST BET",
    teaser: "Two clubs with volatile early-season scoreboards meet at Nationwide Arena, with injuries on both sides shaping how each lineup can defend. Unlock PRIME VIP for the prediction, the odds and the full analysis.",
  },
  {
    slug: "washington-capitals-vs-new-york-rangers",
    title: "Washington Capitals × New York Rangers",
    homeTeam: "Washington Capitals",
    awayTeam: "New York Rangers",
    access: "vip",
    badge: "PRIME VIP",
    teaser: "Washington's strong home defensive record meets a Rangers road profile built on scoring and conceding in volume. Unlock PRIME VIP for the prediction and the full analysis.",
  },
  {
    slug: "winnipeg-jets-vs-anaheim-ducks",
    title: "Winnipeg Jets × Anaheim Ducks",
    homeTeam: "Winnipeg Jets",
    awayTeam: "Anaheim Ducks",
    access: "vip",
    badge: "PRIME VIP",
    teaser: "Anaheim's road defending last season was the weakest figure among the clubs on this slate, and Winnipeg arrive at home. Unlock PRIME VIP for the prediction and the full analysis.",
  },
];
