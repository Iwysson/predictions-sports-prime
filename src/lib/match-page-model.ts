import type { EditorialPrediction } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import { translate } from "@/i18n/dictionaries";
import {
  buildFullMatchView,
  buildPublicMatchView,
  isPublishableFuture,
  matchSlug,
  type FullMatchView,
  type PublicMatchView,
} from "@/lib/match-access";
import { localDateTimeToUtc } from "@/lib/match-time";
import { localePath } from "@/lib/seo-locales";
import { absoluteUrl } from "@/lib/site-config";

// Single model behind the /match/[slug] templates and their tests.
// Everything here is public except `full`, which is set only for access "free".
// For VIP predictions the model carries no prediction, odds, analysis or pick:
// the client gate receives only the slug and fetches the content itself.

export type MatchPageModel = {
  view: PublicMatchView & { heading: string; kicker: string; teaser: string };
  jsonLd: Record<string, unknown>;
  full: FullMatchView | null;
  gate: { slug: string } | null;
  labels: { prediction: string; odds: string };
};

type RouteLocale = string; // "en" or a seo locale slug such as "pt-br"

function startDateIso(prediction: EditorialPrediction): string | undefined {
  const info = prediction.matchInfo;
  const timezone = leaguesBySlug[prediction.league]?.timezone;
  if (!info?.date || !info?.time || !timezone) return undefined;
  // localDateTimeToUtc returns an ISO-8601 UTC string, or null when the wall-clock time is invalid.
  const iso = localDateTimeToUtc(info.date, info.time, timezone);
  return iso && !Number.isNaN(Date.parse(iso)) ? iso : undefined;
}

// Public SportsEvent only: teams, league, kickoff, venue (when recorded), canonical URL.
// No pick, odds, prediction or analysis text.
export function buildPublicJsonLd(prediction: EditorialPrediction, routeLocale: RouteLocale, slug: string) {
  const url = absoluteUrl(routeLocale === "en" ? `/match/${slug}/` : localePath(routeLocale as any, `/match/${slug}/`));
  const venue = prediction.matchInfo?.venue;
  const leagueName = leaguesBySlug[prediction.league]?.name ?? prediction.league;
  const startDate = startDateIso(prediction);
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${url}#sports-event`,
    name: `${prediction.homeTeam} vs ${prediction.awayTeam}`,
    url,
    inLanguage: routeLocale === "pt-br" ? "pt-BR" : routeLocale,
    eventStatus: "https://schema.org/EventScheduled",
    ...(startDate ? { startDate } : {}),
    ...(venue ? { location: { "@type": "Place", name: venue } } : {}),
    homeTeam: { "@type": "SportsTeam", name: prediction.homeTeam },
    awayTeam: { "@type": "SportsTeam", name: prediction.awayTeam },
    superEvent: { "@type": "SportsEvent", name: leagueName },
  };
}

export function buildMatchPageModel(
  prediction: EditorialPrediction,
  routeLocale: RouteLocale,
  now: Date | string = new Date(),
): MatchPageModel | null {
  if (!isPublishableFuture(prediction, now)) return null;
  const slug = matchSlug(prediction);
  const base = buildPublicMatchView(prediction);
  const vars = { home: prediction.homeTeam, away: prediction.awayTeam };
  const access = base.access;
  const isFree = access === "free";

  const view = {
    ...base,
    heading: translate(routeLocale, "matchTitle", vars),
    kicker: translate(routeLocale, isFree ? "matchFreeAnalysis" : "matchVipAnalysis"),
    teaser: translate(routeLocale, isFree ? "matchFreeTeaser" : "matchVipTeaser", vars),
  };

  return {
    view,
    jsonLd: buildPublicJsonLd(prediction, routeLocale, slug),
    full: isFree ? buildFullMatchView(prediction) : null,
    gate: isFree ? null : { slug },
    labels: { prediction: translate(routeLocale, "mainPrediction"), odds: translate(routeLocale, "odds") },
  };
}
