import type { MetadataRoute } from "next";
import { localizedEditorialBySlug, hasCompleteLocalizedEditorial } from "@/data/localized-editorial";
import { leagues, leaguesBySlug } from "@/data/leagues";
import { matches } from "@/data/matches";
import { editorialPredictions } from "@/data/predictions";
import { isAdSenseContentIndexable } from "@/lib/adsense-content-quality";
import { isFutureFixture } from "@/lib/fixture-state";
import { isDateReleased } from "@/lib/match-release";
import footballResults from "@/data/football-results.snapshot.json";
import { resolveNhlSlate } from "@/data/nhl/slates";
import { intentHubInventory, selectIntentHubMatches } from "@/lib/intent-hubs";
import { getNhlDayStart, getNhlTodayKey } from "@/lib/nhl-day";
import type { FootballResultsDataset } from "@/lib/football-results";
import { materialMatchUpdatedAt } from "@/lib/match-freshness";
import { localePath, seoLocaleSlugs } from "@/lib/seo-locales";
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

function indexableLeagueMatches(leagueSlug: LeagueSlug): Match[] {
  return matches.filter(
    (match) =>
      match.league === leagueSlug &&
      match.status === "published" &&
      isAdSenseContentIndexable(match.slug, editorialPredictions)
  );
}

// Public-release gate (src/lib/match-release.ts), evaluated against the match's own release zone.
function isMatchReleased(match: Match, now: Date) {
  return isDateReleased(match.date, now, match.releaseTimeZone);
}

// Every sitemap path a match owns: its canonical page plus each complete localized page.
function matchSitemapPaths(match: Match): string[] {
  const localized = Object.prototype.hasOwnProperty.call(localizedEditorialBySlug, match.slug)
    ? seoLocaleSlugs
        .filter((locale) => hasCompleteLocalizedEditorial(match.slug, locale))
        .map((locale) => localePath(locale, `/match/${match.slug}/`))
    : [];
  return [matchCanonicalPath(match), ...localized];
}

export function buildLeagueSitemap(
  leagueSlug: LeagueSlug,
  now: Date = new Date()
): MetadataRoute.Sitemap {
  const league = leaguesBySlug[leagueSlug];
  if (!league) return [];

  // A future match not yet released publicly (src/lib/match-release.ts) must stay out of the sitemap's
  // list of match URLs. gatedSitemapEntries() records it at build time and the edge function
  // (functions/_lib/sitemap-release.js) appends it once its gate opens, so discovery resumes with no redeploy.
  // The league hub pages themselves (/league/<slug>/) were retired - only each league's match pages
  // are listed here, grouped per competition as a sitemap shard (src/app/sitemaps/<slug>/sitemap.ts).
  const leagueMatches = indexableLeagueMatches(leagueSlug).filter((match) => isMatchReleased(match, now));
  return dedupeSitemap(
    leagueMatches.flatMap((match) => matchSitemapPaths(match).map((path) => matchSitemapEntry(match, path)))
  );
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

function upcomingMatchCandidates(now: Date): Match[] {
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
      // Kickoff has already passed (timezone-aware, per-league): never list in the
      // upcoming sitemap regardless of the calendar-date window or a recent edit.
      if (!isFutureFixture(match)) return false;
      const matchDate = match.date ? new Date(match.date) : null;
      const inWindow = matchDate && matchDate >= cutLo && matchDate <= cutHi;
      if (inWindow) return true;
      const modifiedAt = materialMatchUpdatedAt(match);
      return Boolean(modifiedAt && new Date(modifiedAt) >= recentCut);
    })
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
}

export function buildUpcomingMatchesSitemap(now: Date = new Date()): MetadataRoute.Sitemap {
  // Same release gate as the league sitemaps: a hidden match must not be advertised before it opens.
  return upcomingMatchCandidates(now)
    .filter((match) => isMatchReleased(match, now))
    .map((match) => matchSitemapEntry(match, matchCanonicalPath(match)));
}

// A match whose public release has not happened at build time. The static sitemap omits it; the edge function
// (functions/_lib/sitemap-release.js) appends it once the release gate of its slug opens.
export type GatedSitemapEntry = { sitemap: string; slug: string; url: string; lastmod?: string };

function toGatedEntries(sitemap: string, selected: Match[], paths: (match: Match) => string[]): GatedSitemapEntry[] {
  return selected.flatMap((match) =>
    paths(match).map((path) => {
      const lastModified = sitemapLastModified(match);
      return {
        sitemap,
        slug: match.slug,
        url: absoluteUrl(path),
        ...(lastModified ? { lastmod: lastModified.toISOString() } : {}),
      };
    })
  );
}

export function gatedSitemapEntries(now: Date = new Date()): GatedSitemapEntry[] {
  const perLeague = leagues.flatMap((league) =>
    toGatedEntries(
      `/sitemaps/${league.slug}/sitemap.xml`,
      indexableLeagueMatches(league.slug).filter((match) => !isMatchReleased(match, now)),
      matchSitemapPaths
    )
  );
  const upcoming = toGatedEntries(
    "/sitemaps/upcoming-matches/sitemap.xml",
    upcomingMatchCandidates(now).filter((match) => !isMatchReleased(match, now)),
    (match) => [matchCanonicalPath(match)]
  );
  return [...perLeague, ...upcoming];
}

// --- Hub lastmod -----------------------------------------------------------------------------------------
// Only editorial dates are used: the latest material update of the predictions a hub lists, the NHL day of the
// active slate, or the latest settlement written to the results dataset. Never the build time. A hub with no
// such date simply has no lastmod (for example /nfl/, whose public week file carries no publication timestamp).

function latestDate(values: Array<string | Date | undefined | null>): Date | undefined {
  let latest: Date | undefined;
  for (const value of values) {
    if (!value) continue;
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) continue;
    if (!latest || parsed > latest) latest = parsed;
  }
  return latest;
}

function inventoryLastmod(entries: Match[]) {
  return latestDate(entries.map((match) => materialMatchUpdatedAt(match) ?? match.publishedAt));
}

export function hubLastModified(now: Date = new Date()): Record<string, Date | string | undefined> {
  const published = matches.filter(
    (match) => match.status === "published" && isAdSenseContentIndexable(match.slug, editorialPredictions)
  );
  const inventory = intentHubInventory(published, now) as Match[];
  const football = inventoryLastmod(inventory);
  const todays = inventoryLastmod(selectIntentHubMatches("today-predictions", published, now) as Match[]);
  const nhlDay = resolveNhlSlate(getNhlTodayKey(now))?.dayKey;
  const results = latestDate(Object.values((footballResults as FootballResultsDataset).records).map((record) => record.settledAt));
  const nhlActiveSince = nhlDay ? getNhlDayStart(nhlDay) ?? undefined : undefined;
  const homeCandidates = [football, nhlActiveSince];
  return {
    "/": latestDate(homeCandidates),
    "/nhl/": nhlActiveSince,
    "/results/": results,
    "/football-predictions/": football,
    "/soccer-predictions/": football,
    "/betting-tips/": football,
    "/picks/": football,
    "/today-predictions/": todays,
  };
}
