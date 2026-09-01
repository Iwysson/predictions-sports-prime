import type { MetadataRoute } from "next";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { absoluteUrl } from "@/lib/site-config";
import { matchCanonicalPath } from "@/lib/seo";
import { isLeagueIndexable } from "@/lib/league-seo";
import { materialMatchUpdatedAt } from "@/lib/match-freshness";
import { isIndexableLocalizedHubLocale, localePath, seoLocaleSlugs } from "@/lib/seo-locales";
import { fullyLocalizedMatchLocales } from "@/components/LocalizedMatchDetails";
import { localizedEditorialBySlug, hasCompleteLocalizedEditorial } from "@/data/localized-editorial";
import { isInternationalMatchExpansionEligible } from "@/lib/upcoming-match";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
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
    ].map((path) => ({
      url: absoluteUrl(path),
    })),
  ];

  const leaguePages: MetadataRoute.Sitemap = leagues
    .filter((league) => isLeagueIndexable(
      matches.filter(
        (match) => match.league === league.slug && match.status === "published"
      ).length
    ))
    .map((league) => ({
      url: absoluteUrl(`/league/${league.slug}/`),
    }));

  const matchPages: MetadataRoute.Sitemap = matches
    .filter((match) => match.status === "published")
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
      ...leagues.map((league) => ({ url: absoluteUrl(localePath(locale, `/league/${league.slug}/`)) })),
    ] : []),
    { url: absoluteUrl(localePath(locale, "/nfl/")) },
    ...Object.keys(localizedEditorialBySlug)
      .filter((slug) => hasCompleteLocalizedEditorial(slug, locale))
      .map((slug) => ({ url: absoluteUrl(localePath(locale, `/match/${slug}/`)) })),
    ...(fullyLocalizedMatchLocales.includes(locale as (typeof fullyLocalizedMatchLocales)[number])
      ? matches.filter((match) => isInternationalMatchExpansionEligible(match) && !hasCompleteLocalizedEditorial(match.slug, locale)).map((match) => ({ url: absoluteUrl(localePath(locale, `/match/${match.slug}/`)) }))
      : []),
  ]);

  return [
    ...staticPages,
    ...leaguePages,
    ...matchPages,
    ...localizedPages,
  ];
}
