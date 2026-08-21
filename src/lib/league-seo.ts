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
  return `Latest ${league.name} predictions and betting tips. Explore upcoming match analysis, published picks, available odds and current league standings.`;
}

export function leagueIntro(league: LeagueConfig, publishedCount: number) {
  const availability = publishedCount === 1
    ? "One published prediction is currently available."
    : publishedCount > 1
      ? `${publishedCount} published predictions are currently available.`
      : "New predictions will appear here when they are published.";

  return `Follow the latest ${league.name} match analysis, predictions and betting tips for the current round. ${availability} Review the available picks and odds alongside the current league standings.`;
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
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
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
