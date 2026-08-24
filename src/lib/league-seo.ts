import type { LeagueConfig } from "@/data/leagues";
import type { Match } from "@/types";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { matchCanonicalPath } from "@/lib/seo";

export function leagueCanonicalPath(league: LeagueConfig) {
  return `/league/${league.slug}/`;
}

export function leagueSeoTitle(league: LeagueConfig) {
  return `${league.name} Predictions & Betting Tips | ${siteConfig.name}`;
}

export function leagueSeoDescription(league: LeagueConfig) {
  const index = league.slug.length % 4;

  if (index === 0) {
    return `${league.name} predictions and betting tips for ${league.country}. Explore upcoming fixtures, published picks and available odds for the current season.`;
  }

  if (index === 1) {
    return `Latest ${league.name} match analysis from ${league.country}, with betting tips, odds and current standings when available.`;
  }

  if (index === 2) {
    return `Follow ${league.name} predictions, match previews and betting analysis for ${league.country}, including the published picks and competition context.`;
  }

  return `${league.name} betting tips and predictions for ${league.country}. Review the current round, available odds and season context on Predictions Sports Prime.`;
}

export function leagueIntro(league: LeagueConfig, publishedCount: number) {
  const availability = publishedCount === 1
    ? "One published prediction is currently available."
    : publishedCount > 1
      ? `${publishedCount} published predictions are currently available.`
      : "New predictions will appear here when they are published.";

  return `Follow the latest ${league.name} match analysis, predictions and betting tips for the current round in ${league.country}. ${availability} Review the available picks and odds alongside the current league standings.`;
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
  publishedMatches: Match[]
) {
  const url = absoluteUrl(leagueCanonicalPath(league));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: leagueSeoTitle(league),
    description: leagueSeoDescription(league),
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
