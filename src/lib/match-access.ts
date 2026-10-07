import type { EditorialPrediction, PredictionAccess } from "@/types";
import { contentAccess, resolveAccess, type ContentAccess } from "@/lib/vip";
import { predictionSlug } from "@/lib/editorial";
import { isFutureFixture } from "@/lib/fixture-state";
import { translate } from "@/i18n/dictionaries";

// Shared split between what a public page may contain and what is premium.
// Public: teams, league, kickoff, teaser, tier labels, and a prediction only when its
// prediction access is "free". Analysis is public only when its analysis access is "free".
// Protected content (the rest) is served only by /api/match-content/[slug] to VIP.

export type ResolvedAccess = { analysis: PredictionAccess; prediction: PredictionAccess };
export { resolveAccess };

// Explicit analysisAccess / predictionAccess win. Otherwise access applies to both.
// Otherwise both are "vip": a missing field never makes content free.

export type FullMatchView = {
  analysis: string[];
  analysisFormat?: "markdown";
  picks: { main: string; odds: number | null };
  sources: Array<{ name: string; url: string }>;
  comment: string | null;
};

export type PublicMatchView = {
  slug: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  round: string | null;
  title: string;
  access: ContentAccess;
  analysisAccess: PredictionAccess;
  predictionAccess: PredictionAccess;
  teaser: string | null;
};

export type ProtectedContentEntry = {
  slug: string;
  analysisAccess: PredictionAccess;
  predictionAccess: PredictionAccess;
  full: FullMatchView;
  prediction: { main: string; odds: number | null };
  // NHL day key (YYYY-MM-DD, America/New_York) before which the endpoint returns not-found.
  activeFromKey?: string;
};

// A prediction is publishable only with a recorded kickoff in the future.
export function isPublishableFuture(prediction: EditorialPrediction, now: Date | string = new Date()) {
  if (prediction.published !== true) return false;
  const info = prediction.matchInfo;
  if (!info?.date || !info?.time) return false;
  return isFutureFixture({ status: "published", date: info.date, time: info.time, league: prediction.league } as any, now);
}

export function matchSlug(prediction: EditorialPrediction) {
  return prediction.slug ?? predictionSlug(prediction.homeTeam, prediction.awayTeam);
}

export function buildPublicMatchView(prediction: EditorialPrediction): PublicMatchView {
  const access = resolveAccess(prediction);
  const home = prediction.homeTeam;
  const away = prediction.awayTeam;
  return {
    slug: matchSlug(prediction),
    league: prediction.league,
    homeTeam: home,
    awayTeam: away,
    date: prediction.matchInfo?.date ?? "",
    time: prediction.matchInfo?.time ?? "",
    round: prediction.matchInfo?.round ?? null,
    title: prediction.title ?? `${home} vs ${away} Prediction`,
    access: access.analysis === "free" ? "free" : "vip",
    analysisAccess: access.analysis,
    predictionAccess: access.prediction,
    teaser: prediction.teaser ?? null,
  };
}

export function buildFullMatchView(prediction: EditorialPrediction): FullMatchView {
  return {
    analysis: prediction.analysis,
    analysisFormat: prediction.analysisFormat,
    picks: {
      main: prediction.picks.main,
      odds: prediction.picks.publishedOdds ?? prediction.picks.odds ?? null,
    },
    sources: (prediction.sources ?? []).map((s) => ({ name: s.name, url: s.url })),
    comment: prediction.comment ?? null,
  };
}

// Index consumed only by the protected endpoint (functions/). Never imported by pages or client code.
// `extra` carries entries from other editorial sources (for example the NHL page).
export function buildContentIndex(
  predictions: EditorialPrediction[],
  now: Date | string = new Date(),
  extra: ProtectedContentEntry[] = [],
): ProtectedContentEntry[] {
  const fromPredictions = predictions
    .filter((p) => isPublishableFuture(p, now))
    .map((p) => {
      const access = resolveAccess(p);
      const full = buildFullMatchView(p);
      return {
        slug: matchSlug(p),
        analysisAccess: access.analysis,
        predictionAccess: access.prediction,
        full,
        prediction: full.picks,
      };
    });
  return [...fromPredictions, ...extra];
}

// Listing label for a match card: the tier a visitor will see, not a generic "available" message.
export function listingLabel(item: { analysisAccess?: PredictionAccess; predictionAccess?: PredictionAccess; bestAnalysis?: boolean }, locale: string, fallback: string): string {
  if (item.predictionAccess === "free") return translate(locale, "matchFreePrediction");
  // BEST BET is a public badge on protected content: it names the tier without revealing the pick or odds.
  if (item.bestAnalysis) return "BEST BET";
  if (item.analysisAccess === "vip" || item.predictionAccess === "vip") return translate(locale, "matchListVip");
  return fallback;
}

// Single source of truth for the public status badge on every listing: FREE, BEST BET (protected) or PRIME VIP.
export type AccessBadgeKind = "free" | "best" | "vip";

export function accessBadgeKind(item: { analysisAccess?: PredictionAccess; predictionAccess?: PredictionAccess; bestAnalysis?: boolean }): AccessBadgeKind | null {
  if (item.predictionAccess === "free") return "free";
  if (item.bestAnalysis) return "best";
  if (item.analysisAccess === "vip" || item.predictionAccess === "vip") return "vip";
  return null;
}

export const accessBadgeLabel: Record<AccessBadgeKind, string> = {
  free: "FREE TO VIEW",
  best: "BEST BET",
  vip: "PRIME VIP",
};

export function sortFreePredictionsFirst<T extends { predictionAccess?: PredictionAccess; bestAnalysis?: boolean; date?: string; time?: string }>(items: readonly T[]): T[] {
  return [...items].sort((left, right) => {
    const rank = (item: T) => item.predictionAccess === "free" ? 0 : item.bestAnalysis ? 1 : item.predictionAccess === "vip" ? 2 : 3;
    return rank(left) - rank(right) ||
      (left.date ?? "").localeCompare(right.date ?? "") ||
      (left.time ?? "").localeCompare(right.time ?? "");
  });
}

// Human date for match pages, for example "7 October 2026". ISO input, UTC-safe.
export function formatMatchDate(iso: string): string {
  const time = Date.parse(`${iso}T12:00:00Z`);
  if (Number.isNaN(time)) return iso;
  return new Date(time).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
