// Request-time release of sitemap entries. The static export is built once, so a match whose public release
// gate (functions/_data/match-release.json, enforced by functions/_middleware.js) opens AFTER the build cannot
// be in the built sitemap XML. scripts/build-match-content.mts records those matches in
// functions/_data/sitemap-gated.json; this module appends each one to its sitemap the moment the same gate
// opens, so discovery follows page availability with no redeploy.
//
// Fails closed: an entry with no release information, or an unknown time zone, is never released.
import { isNhlSlateReleased } from "../../src/lib/nhl-publication-policy.ts";

export const SITEMAP_PATH = /^\/sitemaps\/[a-z0-9-]+\/sitemap\.xml$/;

export function normalizeRelease(value, defaultTimeZone) {
  if (!value) return undefined;
  if (typeof value === "string") return { date: value, timezone: defaultTimeZone };
  return value;
}

export function groupGatedBySitemap(entries) {
  const bySitemap = new Map();
  for (const entry of entries ?? []) {
    bySitemap.set(entry.sitemap, [...(bySitemap.get(entry.sitemap) ?? []), entry]);
  }
  return bySitemap;
}

// Entries whose release gate is open at `now`. `releaseOf(slug)` returns the same { date, timezone } the edge
// middleware uses for the page itself, so a URL is advertised only while its page is actually served.
export function releasedEntries(entries, releaseOf, now) {
  return entries.filter((entry) => {
    const release = releaseOf(entry.slug);
    return Boolean(release) && isNhlSlateReleased(release, now);
  });
}

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// Appends the entries to a <urlset>, skipping any URL the document already lists (a build that ran after the
// release instant already contains it).
export function appendSitemapEntries(xml, entries) {
  const additions = entries
    .filter((entry) => !xml.includes(`<loc>${escapeXml(entry.url)}</loc>`))
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${
          entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""
        }\n  </url>\n`,
    );
  if (!additions.length || !xml.includes("</urlset>")) return xml;
  return xml.replace("</urlset>", `${additions.join("")}</urlset>`);
}
