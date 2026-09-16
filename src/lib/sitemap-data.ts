import type { MetadataRoute } from "next";
import { localizedEditorialBySlug, hasCompleteLocalizedEditorial } from "@/data/localized-editorial";
import { leagues, leaguesBySlug } from "@/data/leagues";
import { matches } from "@/data/matches";
import { editorialPredictions } from "@/data/predictions";
import { isAdSenseContentIndexable, isAdSenseLeagueIndexable } from "@/lib/adsense-content-quality";
import { isLeagueIndexable } from "@/lib/league-seo";
import { materialMatchUpdatedAt } from "@/lib/match-freshness";
import { isIndexableLocalizedHubLocale, localePath, seoLocaleSlugs } from "@/lib/seo-locales";
import { matchCanonicalPath } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";
import type { LeagueSlug, Match } from "@/types";

function sitemapLastModified(match: Match) {
  const modifiedAt = materialMatchUpdatedAt(match) ?? match.publishedAt;
  if (!modifiedAt) return undefined;

  const parsed = new Date(modifiedAt);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function matchSitemapEntry(match: Match, path: string): MetadataRoute.Sitemap[number] {
  const lastModified = sitemapLastModified(match);
  return {
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
  };
}

function dedupeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) byUrl.set(entry.url, entry);
  return [...byUrl.values()];
}

export function buildLeagueSitemap(
  leagueSlug: LeagueSlug
): MetadataRoute.Sitemap {
  const league = leaguesBySlug[leagueSlug];
  if (!league) return [];

  const leagueMatches = matches.filter(
    (match) =>
      match.league === leagueSlug &&
      match.status === "published" &&
      isAdSenseContentIndexable(match.slug, editorialPredictions)
  );

  const leagueIndexable =
    isLeagueIndexable(leagueMatches.length) &&
    isAdSenseLeagueIndexable(leagueSlug, matches, editorialPredictions);

  const leaguePages: MetadataRoute.Sitemap = leagueIndexable
    ? [
        { url: absoluteUrl(`/league/${league.slug}/`) },
        ...seoLocaleSlugs
          .filter(isIndexableLocalizedHubLocale)
          .map((locale) => ({
            url: absoluteUrl(localePath(locale, `/league/${league.slug}/`)),
          })),
      ]
    : [];

  const matchPages: MetadataRoute.Sitemap = leagueMatches.map((match) =>
    matchSitemapEntry(match, matchCanonicalPath(match))
  );

  const localizedMatchPages: MetadataRoute.Sitemap = seoLocaleSlugs.flatMap((locale) =>
    leagueMatches
      .filter(
        (match) =>
          Object.prototype.hasOwnProperty.call(localizedEditorialBySlug, match.slug) &&
          hasCompleteLocalizedEditorial(match.slug, locale)
      )
      .map((match) =>
        matchSitemapEntry(match, localePath(locale, `/match/${match.slug}/`))
      )
  );

  return dedupeSitemap([
    ...leaguePages,
    ...matchPages,
    ...localizedMatchPages,
  ]);
}

export function leagueSitemapPaths() {
  return leagues.map((league) => `/sitemaps/${league.slug}/sitemap.xml`);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function serializeUrlSet(entries: MetadataRoute.Sitemap) {
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? `\n    <lastmod>${escapeXml(
            entry.lastModified instanceof Date
              ? entry.lastModified.toISOString()
              : String(entry.lastModified)
          )}</lastmod>`
        : "";
      return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${lastModified}\n  </url>`;
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function serializeSitemapIndex(paths: readonly string[]) {
  const sitemaps = paths
    .map(
      (path) =>
        `  <sitemap>\n    <loc>${escapeXml(absoluteUrl(path))}</loc>\n  </sitemap>`
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemaps,
    "</sitemapindex>",
    "",
  ].join("\n");
}
