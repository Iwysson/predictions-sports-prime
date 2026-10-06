import type { EditorialPrediction } from "@/types";
import { contentAccess, type ContentAccess } from "@/lib/vip";
import { predictionSlug } from "@/lib/editorial";
import { isFutureFixture } from "@/lib/fixture-state";

// Shared split between what a public page may contain and what is premium.
// Public view: safe to ship in static HTML for every visitor.
// Full view: analysis, picks, odds, sources. Only for access "free" in static HTML,
// and for VIP through the protected endpoint otherwise.

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
  teaser: string;
};

export type FullMatchView = {
  analysis: string[];
  picks: { main: string; odds: number | null };
  sources: Array<{ name: string; url: string }>;
  comment: string | null;
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

// The teaser is generic for VIP content: it never quotes the analysis or the pick.
export function buildPublicMatchView(prediction: EditorialPrediction): PublicMatchView {
  const access = contentAccess(prediction);
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
    access,
    teaser:
      access === "free"
        ? `Free analysis for ${home} vs ${away}.`
        : `VIP analysis for ${home} vs ${away}. Log in with an active VIP plan to read the full prediction.`,
  };
}

export function buildFullMatchView(prediction: EditorialPrediction): FullMatchView {
  return {
    analysis: prediction.analysis,
    picks: {
      main: prediction.picks.main,
      odds: prediction.picks.publishedOdds ?? prediction.picks.odds ?? null,
    },
    sources: (prediction.sources ?? []).map((s) => ({ name: s.name, url: s.url })),
    comment: prediction.comment ?? null,
  };
}

export type ProtectedContentEntry = {
  slug: string;
  access: ContentAccess;
  full: FullMatchView;
};

// Index consumed only by the protected endpoint (functions/). Never imported by pages or client code.
export function buildContentIndex(predictions: EditorialPrediction[], now: Date | string = new Date()): ProtectedContentEntry[] {
  return predictions
    .filter((p) => isPublishableFuture(p, now))
    .map((p) => ({ slug: matchSlug(p), access: contentAccess(p), full: buildFullMatchView(p) }));
}
