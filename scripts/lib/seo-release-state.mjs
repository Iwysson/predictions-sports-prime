// Release-gate awareness for scripts/audit-seo.mjs.
//
// A match page is in exactly one of three public states, mirroring what functions/_middleware.js serves:
//   closed   - FINAL and settled: the page no longer exists (410 Gone); it must never be advertised.
//   hidden   - the page is built but its release gate (functions/_data/match-release.json) is still closed:
//              every request answers 307 -> Home. It must NOT be in any public sitemap yet, and it MUST be queued
//              in functions/_data/sitemap-gated.json so the edge function lists it the moment the gate opens.
//   released - served and eligible for indexing: the usual rules apply (indexable pages must be in the sitemap).
//
// The "effective" sitemap handed to these checks is the static XML plus the entries the edge function would append
// at the audited instant, so the audit validates what a crawler actually receives, before and after release.
import { isNhlSlateReleased } from "../../src/lib/nhl-publication-policy.ts";

export function releaseStateOf({ hasPage, release, now }) {
  if (!hasPage) return "closed";
  if (release && !isNhlSlateReleased(release, now)) return "hidden";
  return "released";
}

const sameInstant = (left, right) => Date.parse(left) === Date.parse(right);

// All sitemap findings for one match route. Returns an array of error strings (empty when the route is sound).
export function auditMatchSitemapState({
  route,
  state,
  shouldBeIndexable,
  crossedKickoffAfterBuild = false,
  effectiveLastmod, // lastmod of the route in the effective sitemap, if listed
  inEffectiveSitemap,
  gatedLastmod, // lastmod queued in the gated manifest, undefined when not queued
  isGated,
  expectedLastmod, // Article dateModified ?? datePublished
}) {
  const errors = [];

  if (state === "closed") {
    if (inEffectiveSitemap) errors.push(`${route}: closed (settled) match is still advertised in the sitemap`);
    if (isGated) errors.push(`${route}: closed (settled) match is still queued in the gated sitemap manifest`);
    return errors;
  }

  if (state === "hidden") {
    if (inEffectiveSitemap) errors.push(`${route}: hidden prediction leaked into the public sitemap before its release`);
    if (shouldBeIndexable) {
      if (!isGated) {
        errors.push(`${route}: hidden indexable prediction is missing from the gated sitemap manifest, so it would never be listed after release`);
      } else if (expectedLastmod && (!gatedLastmod || !sameInstant(gatedLastmod, expectedLastmod))) {
        errors.push(`${route}: gated sitemap lastmod must equal Article dateModified ?? datePublished`);
      }
    } else if (isGated) {
      errors.push(`${route}: noindex prediction is queued for sitemap release`);
    }
    return errors;
  }

  // released
  if (!crossedKickoffAfterBuild && shouldBeIndexable && !inEffectiveSitemap) errors.push(`${route}: KEEP prediction missing from sitemap`);
  if (!crossedKickoffAfterBuild && !shouldBeIndexable && inEffectiveSitemap) errors.push(`${route}: noindex prediction leaked into sitemap`);
  if (shouldBeIndexable && expectedLastmod) {
    if (!effectiveLastmod || !sameInstant(effectiveLastmod, expectedLastmod)) {
      errors.push(`${route}: sitemap lastmod must equal Article dateModified ?? datePublished`);
    }
  } else if (shouldBeIndexable && effectiveLastmod) {
    errors.push(`${route}: sitemap contains a timestamp with no Article editorial date`);
  }
  return errors;
}

// Consistency of the gated manifest itself: every queued entry must be able to open and must refer to a real page.
export function auditGatedManifest({ gatedEntries, pageSlugs, releaseSlugs }) {
  const errors = [];
  for (const entry of gatedEntries) {
    if (!pageSlugs.has(entry.slug)) errors.push(`${entry.url}: gated sitemap entry has no generated page`);
    if (!releaseSlugs.has(entry.slug)) errors.push(`${entry.url}: gated sitemap entry has no release rule, so it could never open`);
    if (!/^\/sitemaps\/[a-z0-9-]+\/sitemap\.xml$/.test(entry.sitemap)) errors.push(`${entry.url}: gated sitemap entry targets an unknown sitemap ${entry.sitemap}`);
  }
  return errors;
}
