import type { MatchPreview, PredictionAccess } from "@/types";
import { localTodayISO, filterTodaysPublishedPredictions, filterTomorrowPublishedPredictions, filterFuturePublishedPredictions } from "@/lib/match-feed";
import { accessBadgeKind, type AccessBadgeKind } from "@/lib/match-access";

// Server/build-only. The single place that decides which football matches are
// "Today"/"Tomorrow"/"Upcoming" for the Android app's mobile feed - it calls the exact
// same functions (src/lib/match-feed.ts) the website's own home page calls, on the same
// hydrated (live fixture status included) match list, so the app's buckets cannot drift
// from the website's. Never duplicate resolveHomeTemporalBucket's rules elsewhere.

export type MobilePublicMatch = {
  slug: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  round: string | null;
  title: string;
  analysisAccess: PredictionAccess;
  predictionAccess: PredictionAccess;
  badge: AccessBadgeKind | null;
  teaser: string | null;
  // Present only when predictionAccess is "free" - matches the website, which never
  // shows a BEST BET/PRIME VIP pick or odds on a listing page either, only on the
  // match's own page after the viewer is authorized. Opening the match (or, in the
  // app, GET /api/match-content/:slug) is how a VIP pick is revealed, on both platforms.
  pick?: string;
  odds?: number | null;
};

function toMobilePublicMatch(match: MatchPreview): MobilePublicMatch {
  // Absence of the field never makes a prediction free (src/lib/vip.ts's contentAccess
  // rule) - default to "vip" exactly like the website does, never to "free".
  const analysisAccess = match.analysisAccess ?? "vip";
  const predictionAccess = match.predictionAccess ?? "vip";
  const badge = accessBadgeKind({ analysisAccess, predictionAccess, bestAnalysis: match.bestAnalysis });
  return {
    slug: match.slug,
    league: match.league,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    date: match.date,
    time: match.time,
    round: match.round ?? null,
    title: match.title ?? `${match.homeTeam} vs ${match.awayTeam}`,
    analysisAccess,
    predictionAccess,
    badge,
    teaser: match.teaser ?? null,
    pick: predictionAccess === "free" ? match.mainPrediction : undefined,
    odds: predictionAccess === "free" ? match.odds ?? null : undefined,
  };
}

export type FeedBucket<T> = { today: T[]; tomorrow: T[]; upcoming: T[] };

export type MobileFootballIndex = {
  generatedAt: string;
  leagues: string[];
  free: FeedBucket<MobilePublicMatch>;
  vip: FeedBucket<MobilePublicMatch>;
};

function splitByTier(list: MobilePublicMatch[]) {
  return {
    free: list.filter((m) => m.badge === "free"),
    vip: list.filter((m) => m.badge === "best" || m.badge === "vip"),
  };
}

// Bucketing and the free/vip split both happen here, at build time - the Cloudflare
// Function that serves this just returns it (optionally filtered by league), with no
// date math or tier logic of its own to drift out of sync.
export function buildMobileFootballIndex(resolvedMatches: MatchPreview[], now: Date = new Date()): MobileFootballIndex {
  const today = localTodayISO(now);
  const leagues = [...new Set(resolvedMatches.filter((m) => m.status === "published").map((m) => m.league))].sort();

  const todayMatches = splitByTier(filterTodaysPublishedPredictions(resolvedMatches, today, now).map(toMobilePublicMatch));
  const tomorrowMatches = splitByTier(filterTomorrowPublishedPredictions(resolvedMatches, today, now).map(toMobilePublicMatch));
  const upcomingMatches = splitByTier(filterFuturePublishedPredictions(resolvedMatches, today, now).map(toMobilePublicMatch));

  return {
    generatedAt: new Date().toISOString(),
    leagues,
    free: { today: todayMatches.free, tomorrow: tomorrowMatches.free, upcoming: upcomingMatches.free },
    vip: { today: todayMatches.vip, tomorrow: tomorrowMatches.vip, upcoming: upcomingMatches.vip },
  };
}
