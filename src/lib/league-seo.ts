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
  "super-lig": ["Turkish Super Lig", "Trendyol Süper Lig", "Türkiye Süper Lig"],
  "scottish-premiership": ["Scotland Premiership", "SPFL Premiership", "William Hill Premiership"],
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
};

export function leagueSeoTitle(league: LeagueConfig, capabilities?: LeagueSeoCapabilities) {
  if (capabilities) {
    const suffix = capabilities.hasFixtures && capabilities.hasResults
      ? "Predictions, Fixtures & Results"
      : capabilities.hasAnalysis
        ? "Predictions & Match Analysis"
        : "Predictions";
    return `${league.name} ${suffix}`;
  }
  const full = `${league.name} Predictions & Betting Tips | ${siteConfig.name}`;
  const compact = `${league.name} Predictions | ${siteConfig.name}`;
  return full.length <= 70 ? full : compact;
}

export function leagueSeoDescription(league: LeagueConfig, capabilities?: LeagueSeoCapabilities) {
  if (capabilities) {
    const features = [
      "predictions",
      capabilities.hasFixtures ? "upcoming fixtures" : "",
      capabilities.hasResults ? "recent results" : "",
      capabilities.hasStandings ? "standings" : "",
      capabilities.hasAnalysis ? "match analysis" : "",
    ].filter(Boolean);
    return `${league.name} ${features.join(", ")} from ${siteConfig.name}.`;
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

  return `Follow the latest ${league.name} match analysis, predictions and betting tips for the current round in ${league.country}. ${availability} Review the available picks and odds alongside ${context}.`;
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
          hasPart: publishedMatches.map((match) => ({
            "@type": "Article",
            name: `${match.homeTeam} vs ${match.awayTeam}`,
            url: absoluteUrl(matchCanonicalPath(match)),
          })),
        }
      : {}),
  };
}
