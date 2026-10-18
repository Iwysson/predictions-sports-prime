// Central public-release gate shared by every surface that can expose a future prediction:
// the homepage directory, the per-league sitemaps and the Cloudflare Pages edge middleware
// (functions/_middleware.js, via the build-time manifest in scripts/build-match-content.mts).
//
// A match becomes publicly releasable the moment its calendar date arrives in the site's
// canonical fixture time zone (SITE_FIXTURE_TIME_ZONE, src/lib/fixture-state.ts) - the same
// zone every other "is this today" decision on the site already uses (src/lib/match-feed.ts).
// This reuses the NHL release-gate primitive (src/lib/nhl-publication-policy.ts) rather than
// inventing a second date-comparison routine: `isNhlSlateReleased` is a generic
// "now >= 00:00 of `date` in `timezone`" check, not NHL-specific despite its name.
//
// Fails closed: a missing or malformed date is never treated as released.
import { isNhlSlateReleased } from "@/lib/nhl-publication-policy";
import { SITE_FIXTURE_TIME_ZONE } from "@/lib/fixture-state";

export const PUBLIC_RELEASE_TIME_ZONE = SITE_FIXTURE_TIME_ZONE;

export function isDateReleased(
  dateKey: string | null | undefined,
  now: Date | string = new Date()
): boolean {
  if (!dateKey) return false;
  return isNhlSlateReleased({ date: dateKey, timezone: PUBLIC_RELEASE_TIME_ZONE }, now instanceof Date ? now : new Date(now));
}

export function isPredictionReleased(
  prediction: { matchInfo?: { date?: string | null } | null },
  now: Date | string = new Date()
): boolean {
  return isDateReleased(prediction.matchInfo?.date ?? null, now);
}
