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

type SitemapIndexEntry = string | { path: string; lastmod?: Date };

export function serializeSitemapIndex(entries: readonly SitemapIndexEntry[]) {
  const sitemaps = entries
    .map((entry) => {
      const path = typeof entry === "string" ? entry : entry.path;
      const lastmodLine =
        typeof entry !== "string" && entry.lastmod
          ? `\n    <lastmod>${escapeXml(entry.lastmod.toISOString())}</lastmod>`
          : "";
      return `  <sitemap>\n    <loc>${escapeXml(absoluteUrl(path))}</loc>${lastmodLine}\n  </sitemap>`;
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemaps,
    "</sitemapindex>",
    "",
  ].join("\n");
}

function leagueSitemapLastmod(leagueSlug: LeagueSlug): Date | undefined {
  let latest: Date | undefined;
  for (const match of matches) {
    if (match.league !== leagueSlug || match.status !== "published") continue;
    if (!isAdSenseContentIndexable(match.slug, editorialPredictions)) continue;
    const raw = materialMatchUpdatedAt(match) ?? match.publishedAt;
    if (!raw) continue;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) continue;
    if (!latest || d > latest) latest = d;
  }
  return latest;
}

export function leagueSitemapEntries(): SitemapIndexEntry[] {
  return leagues.map((league) => ({
    path: `/sitemaps/${league.slug}/sitemap.xml`,
    lastmod: leagueSitemapLastmod(league.slug),
  }));
}

export function buildUpcomingMatchesSitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const cutLo = new Date(now);
  cutLo.setDate(cutLo.getDate() - 1);
  const cutHi = new Date(now);
  cutHi.setDate(cutHi.getDate() + 7);
  const recentCut = new Date(now);
  recentCut.setDate(recentCut.getDate() - 7);

  return matches
    .filter((match) => {
      if (match.status !== "published") return false;
      if (!isAdSenseContentIndexable(match.slug, editorialPredictions)) return false;
      const matchDate = match.date ? new Date(match.date) : null;
      const inWindow = matchDate && matchDate >= cutLo && matchDate <= cutHi;
      if (inWindow) return true;
      const modifiedAt = materialMatchUpdatedAt(match);
      return Boolean(modifiedAt && new Date(modifiedAt) >= recentCut);
    })
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
    .map((match) => matchSitemapEntry(match, matchCanonicalPath(match)));
}
