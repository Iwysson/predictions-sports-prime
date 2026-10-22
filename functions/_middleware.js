import results from "../src/data/football-results.snapshot.json";
import releaseManifest from "./_data/match-release.json";
import gatedSitemapManifest from "./_data/sitemap-gated.json";
import { isNhlSlateReleased } from "../src/lib/nhl-publication-policy.ts";
import {
  SITEMAP_PATH,
  appendSitemapEntries,
  groupGatedBySitemap,
  normalizeRelease,
  releasedEntries,
} from "./_lib/sitemap-release.js";

const LEGACY_HOSTNAME = "predictions-sports-prime.pages.dev";
const CANONICAL_ORIGIN = "https://predictions-sports-prime.com";

// Football match pages stop being generated once the match is FINAL and settled. The permanent
// results dataset is the single source: a missing /match/<slug>/ whose slug is settled there was
// removed on purpose, so it answers 410 Gone instead of 404. Nothing is listed by hand.
const SETTLED_SLUGS = new Set(Object.values(results.records).map((record) => record.slug));
// Also matches /nba/<slug>/ (but never /nba/ itself, with no slug segment), so NBA match pages can
// share this same release-date gate (functions/_data/match-release.json) without a separate
// middleware pattern. /nba/ listing hub stays ungated here - its own gate is the deferred-slate
// pattern (src/data/nba/slates.ts), mirroring NHL.
const MATCH_PATH = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?(?:match|nba|nhl)\/([^/]+)(?:\/.*)?$/;

// Public-release gate (src/lib/match-release.ts): a future prediction's page may already exist in the
// static export, but it must not be served until its match date arrives in the site's canonical fixture
// time zone. The manifest (scripts/build-match-content.mts) maps every football match-page slug to that
// release date; this is re-evaluated on every request, never cached, so a page already built ahead of
// kickoff opens automatically with no redeploy. Same zone PSP always uses for "today" (America/Fortaleza).
const PUBLIC_RELEASE_TIME_ZONE = "America/Fortaleza";
const RELEASE_DATE_BY_SLUG = new Map(releaseManifest.map((entry) => [entry.slug, entry.timezone ? { date: entry.date, timezone: entry.timezone } : entry.date]));
// Matches the static sitemaps omit because their gate was still closed at build time (src/lib/sitemap-data.ts).
// They are appended per request, from the same release rule as the page itself, once the gate opens.
const GATED_SITEMAP_ENTRIES = groupGatedBySitemap(gatedSitemapManifest);

// The pt-br hubs (home, leagues, NFL) are retired and permanently redirect to their English
// equivalents. Only the frozen historical /pt-br/match/<slug>/ pages are still served.
function ptBrHubRedirect(pathname) {
  if (pathname === "/pt-br" || pathname === "/pt-br/") return "/";
  if (/^\/pt-br\/league\/[^/]+\/?$/.test(pathname)) return "/football-predictions/";
  if (/^\/pt-br\/nfl\/?$/.test(pathname)) return "/nfl/";
  return null;
}

// The individual football league hub pages (/league/<slug>/, and their localized
// /<locale>/league/<slug>/ equivalents) are retired: only the Football hub (/football-predictions/,
// every league's predictions organized by competition) and the individual match analysis pages
// (/match/<slug>/) remain. Permanent redirect, same pattern as ptBrHubRedirect above.
function leagueHubRedirect(pathname) {
  return /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?league\/[^/]+\/?$/.test(pathname) ? "/football-predictions/" : null;
}

export function createMiddlewareHandler({
  settledSlugs = SETTLED_SLUGS,
  releaseDateBySlug = RELEASE_DATE_BY_SLUG,
  gatedSitemapEntries = GATED_SITEMAP_ENTRIES,
  now = () => new Date(),
} = {}) {
  return async function onRequest(context) {
    const requestUrl = new URL(context.request.url);

    if (requestUrl.hostname === LEGACY_HOSTNAME) {
      return Response.redirect(
        `${CANONICAL_ORIGIN}${requestUrl.pathname}${requestUrl.search}`,
        308,
      );
    }

    const ptBrRedirect = ptBrHubRedirect(requestUrl.pathname);
    if (ptBrRedirect) {
      return Response.redirect(`${requestUrl.origin}${ptBrRedirect}${requestUrl.search}`, 301);
    }

    const leagueRedirect = leagueHubRedirect(requestUrl.pathname);
    if (leagueRedirect) {
      return Response.redirect(`${requestUrl.origin}${leagueRedirect}${requestUrl.search}`, 301);
    }

    const matchPath = requestUrl.pathname.match(MATCH_PATH);
    const slug = matchPath ? decodeURIComponent(matchPath[1]).replace(/\.(?:html|txt)$/i, "") : null;

    // Not yet released: answer the same way for a direct hit, a refresh or an anonymous tab, and never
    // let the static asset (which may already contain the full free-tier prediction) reach the client.
    // Temporary (307), never cached, and never a loop: the target is always Home, which is never gated.
    const releaseDate = slug ? releaseDateBySlug.get(slug) : undefined;
    const release = typeof releaseDate === "string" ? { date: releaseDate, timezone: PUBLIC_RELEASE_TIME_ZONE } : releaseDate;
    if (release && !isNhlSlateReleased(release, now())) {
      return new Response(null, {
        status: 307,
        headers: { Location: `${requestUrl.origin}/`, "Cache-Control": "no-store" },
      });
    }

    const gatedForSitemap = SITEMAP_PATH.test(requestUrl.pathname) ? gatedSitemapEntries.get(requestUrl.pathname) : undefined;
    if (gatedForSitemap?.length) {
      const staticResponse = await context.next();
      if (!staticResponse.ok) return staticResponse;
      const due = releasedEntries(
        gatedForSitemap,
        (entrySlug) => normalizeRelease(releaseDateBySlug.get(entrySlug), PUBLIC_RELEASE_TIME_ZONE),
        now(),
      );
      const headers = new Headers(staticResponse.headers);
      // The body differs from the static asset: validators and encodings of the original no longer apply.
      for (const name of ["etag", "content-length", "content-encoding", "last-modified"]) headers.delete(name);
      headers.set("Cache-Control", "no-cache");
      return new Response(appendSitemapEntries(await staticResponse.text(), due), {
        status: staticResponse.status,
        statusText: staticResponse.statusText,
        headers,
      });
    }

    let response = await context.next();
    if (matchPath && response.status === 404 && settledSlugs.has(slug)) {
      response = new Response(response.body, { status: 410, statusText: "Gone", headers: response.headers });
    }
    const headers = new Headers(response.headers);

    if (requestUrl.pathname.startsWith("/_next/static/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (/\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$/i.test(requestUrl.pathname)) {
      headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}

export const onRequest = createMiddlewareHandler();
