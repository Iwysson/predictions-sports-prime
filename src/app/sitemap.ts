import type { MetadataRoute } from "next";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { absoluteUrl } from "@/lib/site-config";
import { matchCanonicalPath } from "@/lib/seo";
import { isLeagueIndexable } from "@/lib/league-seo";
import { materialMatchUpdatedAt } from "@/lib/match-freshness";
import { isIndexableLocalizedHubLocale, localePath, seoLocaleSlugs } from "@/lib/seo-locales";
import { localizedEditorialBySlug, hasCompleteLocalizedEditorial } from "@/data/localized-editorial";
import { editorialPredictions } from "@/data/predictions";
import { isAdSenseContentIndexable, isAdSenseLeagueIndexable } from "@/lib/adsense-content-quality";
import { resolveCanonicalMatches } from "@/lib/canonical-match";
import { intentHubSlugs } from "@/lib/intent-hubs";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const canonicalMatches = await resolveCanonicalMatches(matches);
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
    },
    ...[
      "/about/",
      "/contact/",
      "/methodology/",
      "/nfl/",
      "/editorial-policy/",
      "/results/",
      "/privacy/",
      "/cookies/",
      "/terms/",
      "/responsible-gambling/",
      "/author/iwysson-nascimento/",
      ...intentHubSlugs.map((slug) => `/${slug}/`),
    ].map((path) => ({
      url: absoluteUrl(path),
    })),
  ];

  const leaguePages: MetadataRoute.Sitemap = leagues
    .filter(
      (league) =>
        isLeagueIndexable(
          canonicalMatches.filter(
            (match) => match.league === league.slug && match.status === "published"
          ).length
        ) &&
        isAdSenseLeagueIndexable(league.slug, canonicalMatches, editorialPredictions)
    )
    .map((league) => ({
      url: absoluteUrl(`/league/${league.slug}/`),
    }));

  const matchPages: MetadataRoute.Sitemap = canonicalMatches
    .filter(
      (match) =>
        match.status === "published" &&
        isAdSenseContentIndexable(match.slug, editorialPredictions)
    )
    .map((match) => {
      const modifiedAt = materialMatchUpdatedAt(match);
      return ({
      url: absoluteUrl(matchCanonicalPath(match)),
      ...(modifiedAt || match.publishedAt
        ? { lastModified: new Date(modifiedAt ?? match.publishedAt!) }
        : {}),
    }); });

  const localizedPages: MetadataRoute.Sitemap = seoLocaleSlugs.flatMap((locale) => [
    ...(isIndexableLocalizedHubLocale(locale) ? [
      { url: absoluteUrl(localePath(locale)) },
      ...leagues
        .filter((league) =>
          isAdSenseLeagueIndexable(league.slug, canonicalMatches, editorialPredictions)
        )
        .map((league) => ({
          url: absoluteUrl(localePath(locale, `/league/${league.slug}/`)),
        })),
    ] : []),
    ...Object.keys(localizedEditorialBySlug)
      .filter(
        (slug) =>
          hasCompleteLocalizedEditorial(slug, locale) &&
          isAdSenseContentIndexable(slug, editorialPredictions)
      )
      .map((slug) => ({ url: absoluteUrl(localePath(locale, `/match/${slug}/`)) })),
  ]);

  return [
    ...staticPages,
    ...leaguePages,
    ...matchPages,
    ...localizedPages,
  ];
}
