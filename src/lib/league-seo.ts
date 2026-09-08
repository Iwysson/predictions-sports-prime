import type { LeagueConfig } from "@/data/leagues";
import type { Match } from "@/types";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { matchCanonicalPath } from "@/lib/seo";

const leagueSearchAliases: Partial<Record<LeagueConfig["slug"], readonly string[]>> = {
  "premier-league": ["English Premier League", "EPL"],
  "la-liga": ["LaLiga", "Primera División"],
  bundesliga: ["German Bundesliga"],
  "serie-a": ["Serie A Italy", "Italian Serie A"],
  "liga-portugal": ["Primeira Liga", "Liga Portugal Betclic"],
  "ligue-1": ["French Ligue 1"],
  eredivisie: ["Dutch Eredivisie", "VriendenLoterij Eredivisie"],
  "brasileirao-serie-a": ["Brasileirão", "Campeonato Brasileiro Série A"],
  "copa-do-brasil": ["Brazil Cup", "Copa Betano do Brasil"],
  "efl-cup": ["Carabao Cup", "League Cup"],
  championship: ["Championship", "English Championship", "Sky Bet Championship"],
  "super-lig": ["Turkish Super Lig", "Trendyol Süper Lig", "Türkiye Süper Lig"],
  "scottish-premiership": ["Scotland Premiership", "SPFL Premiership", "William Hill Premiership"],
  eliteserien: ["Norwegian Eliteserien", "Norway Eliteserien", "Eliteserien Norway"],
  mls: ["Major League Soccer", "MLS USA", "United States MLS"],
};

const leagueEditorialIntros: Partial<Record<LeagueConfig["slug"], string>> = {
  "champions-league": "Track Champions League predictions through the league phase and knockout rounds, with each pick tied to the matchup, price and available team evidence.",
  "premier-league": "Compare Premier League predictions through home and away performance, current availability and the tactical matchup behind each published pick.",
  mls: "Explore MLS predictions across the Eastern and Western Conferences, with travel, venue form and the league's open game states considered before each selection.",
  "copa-libertadores": "Follow Copa Libertadores predictions built for two-leg South American ties, where venue, altitude, travel and aggregate score can reshape the market.",
  "copa-sudamericana": "Review Copa Sudamericana predictions with knockout context, first-leg or second-leg incentives and the evidence available for each pairing.",
  "la-liga": "Read La Liga predictions that separate possession from chance quality and compare the host's home evidence with the visitor's away profile.",
  "serie-a": "Find Serie A predictions focused on matchup structure, defensive trade-offs and the price required for each published selection.",
  bundesliga: "Use Bundesliga predictions that account for transition pace, pressing risk and venue-specific attacking and defensive records.",
  "liga-portugal": "Browse Liga Portugal predictions with current venue splits, squad context and explicit limits where early-season samples remain small.",
  "efl-cup": "Assess EFL Cup predictions with rotation, knockout incentives and divisional context treated separately from ordinary league form.",
  championship: "Compare Championship predictions through demanding schedules, home-away splits and the small margins that shape each market.",
  "scottish-premiership": "Review Scottish Premiership predictions using current venue evidence, team availability and the tactical route behind the pick.",
};

export function leagueSeoKeywords(league: LeagueConfig) {
  const names = [league.name, ...(leagueSearchAliases[league.slug] ?? [])];
  return [...new Set(names.flatMap((name) => [
    `${name} predictions`, `${name} betting tips`, `${name} odds`,
    `${name} match analysis`, `${name} fixtures`, `${name} standings`,
  ]))];
}

export function isLeagueIndexable(publishedMatchCount: number) {
  return publishedMatchCount > 0;
}

export function leagueCanonicalPath(league: LeagueConfig) {
  return `/league/${league.slug}/`;
}

export type LeagueSeoCapabilities = {
  hasFixtures: boolean;
  hasResults: boolean;
  hasStandings: boolean;
  hasAnalysis: boolean;
  hasOdds: boolean;
  publishedCount: number;
  upcomingCount: number;
};

export function leagueSeoCapabilities(league: LeagueConfig, publishedMatches: Match[]): LeagueSeoCapabilities {
  return {
    hasFixtures: publishedMatches.some((match) => match.fixtureStatus !== "completed"),
    hasResults: publishedMatches.some((match) => match.fixtureStatus === "completed" && match.homeScore != null && match.awayScore != null),
    hasStandings: league.display.showStandings,
    hasAnalysis: publishedMatches.length > 0,
    hasOdds: publishedMatches.some((match) => match.predictions.some((item) => item.label === "Published Odds" || item.label === "Odds")),
    publishedCount: publishedMatches.length,
    upcomingCount: publishedMatches.filter((match) => match.fixtureStatus !== "completed").length,
  };
}

export function leagueSeoTitle(league: LeagueConfig, capabilities?: LeagueSeoCapabilities) {
  if (capabilities) {
    const full = capabilities.hasFixtures
      ? `${league.name} Predictions & Betting Tips${capabilities.hasOdds ? " with Odds" : ""}`
      : `${league.name} Predictions & Match Analysis`;
    const branded = `${full} | ${siteConfig.name}`;
    return branded.length <= 70 ? branded : full.length <= 70 ? full : `${league.name} Predictions`;
  }
  const full = `${league.name} Predictions & Betting Tips | ${siteConfig.name}`;
  const compact = `${league.name} Predictions | ${siteConfig.name}`;
  return full.length <= 70 ? full : compact;
}

export function leagueSeoDescription(league: LeagueConfig, capabilities?: LeagueSeoCapabilities) {
  if (capabilities) {
    const inventory = capabilities.upcomingCount > 0
      ? `${capabilities.upcomingCount} current or upcoming match ${capabilities.upcomingCount === 1 ? "prediction" : "predictions"}`
      : `${capabilities.publishedCount} published ${capabilities.publishedCount === 1 ? "analysis" : "analyses"}`;
    const context = league.display.showStandings
      ? "current-round and table context"
      : "current-stage knockout context";
    const full = `${league.name} predictions for ${league.country}: ${inventory}, published picks, available odds and ${context}.`;
    return full.length <= 160
      ? full
      : `${league.name} predictions: ${inventory}, published picks, available odds and ${context}.`;
  }
  const index = league.slug.length % 4;
  const standings = league.display.showStandings
    ? " and validated standings when available"
    : " and the current knockout schedule";

  const description = index === 0
    ? `${league.name} predictions and betting tips for ${league.country}. Explore current fixtures, published picks, available odds${standings}.`
    : index === 1
      ? `Latest ${league.name} match analysis from ${league.country}, with betting tips, odds${standings}.`
      : index === 2
        ? `Follow ${league.name} predictions and match previews for ${league.country}, including published picks, competition context${standings}.`
        : `${league.name} betting tips for ${league.country}. Review published predictions, available odds, current fixtures${standings}.`;

  if (description.length <= 160) return description;
  return `${league.name} predictions for ${league.country}, with published picks, odds, current fixtures and competition analysis.`;
}

export function leagueIntro(league: LeagueConfig, publishedCount: number) {
  const availability = publishedCount === 1
    ? "One published prediction is currently available."
    : publishedCount > 1
      ? `${publishedCount} published predictions are currently available.`
      : "New predictions will appear here when they are published.";

  const context = league.display.showStandings
    ? "validated league standings when data is available"
    : "the current knockout schedule";

  const editorialLead = leagueEditorialIntros[league.slug]
    ?? `Follow ${league.name} predictions through the current round, with the match evidence and price considered together.`;
  return `${editorialLead} ${availability} Review the available picks and odds alongside ${context}.`;
}

export function leagueBreadcrumbJsonLd(league: LeagueConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: league.name,
        item: absoluteUrl(leagueCanonicalPath(league)),
      },
    ],
  };
}

export function leagueCollectionJsonLd(
  league: LeagueConfig,
  publishedMatches: Match[],
  capabilities?: LeagueSeoCapabilities
) {
  const url = absoluteUrl(leagueCanonicalPath(league));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: leagueSeoTitle(league, capabilities),
    description: leagueSeoDescription(league, capabilities),
    url,
    inLanguage: "en",
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    ...(publishedMatches.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: publishedMatches.length,
            itemListElement: publishedMatches.map((match, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${match.homeTeam} vs ${match.awayTeam}`,
              url: absoluteUrl(matchCanonicalPath(match)),
            })),
          },
          hasPart: publishedMatches.map((match) => ({
            "@type": "Article",
            name: `${match.homeTeam} vs ${match.awayTeam}`,
            url: absoluteUrl(matchCanonicalPath(match)),
          })),
        }
      : {}),
  };
}
