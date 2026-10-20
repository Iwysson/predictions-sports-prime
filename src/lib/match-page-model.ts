import type { EditorialPrediction } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import { translate } from "@/i18n/dictionaries";
import {
  buildFullMatchView,
  buildPublicMatchView,
  hasMatchPage,
  matchSlug,
  resolveAccess,
  type FullMatchView,
  type PublicMatchView,
} from "@/lib/match-access";
import { localDateTimeToUtc } from "@/lib/match-time";
import { localePath } from "@/lib/seo-locales";
import { absoluteUrl } from "@/lib/site-config";
import { editorialAuthorPersonJsonLd } from "@/lib/editorial-identity";
import { buildPublicMatchContext, type PublicMatchContext } from "@/lib/match-public-context";

// Single model behind the /match/[slug] templates and their tests.
// Everything here is public. Protected parts are only flags for the client gate:
// the gate receives the slug and two booleans, never the protected text.

export type MatchPageModel = {
  view: PublicMatchView & { heading: string; kicker: string; teaser: string; publishedDate: string | null; updatedDate: string | null };
  seoTitle: string;
  jsonLd: Array<Record<string, unknown>>;
  // Prediction shown publicly (prediction access "free"). The page renders it as its own block right after the
  // teams for every FREE page, PSP or not; a PSP analysis repeats it in its closing block.
  publicPrediction: { main: string; odds: number | null } | null;
  // Public trend for a VIP prediction. Never the pick or the odds.
  trend: string | null;
  // Analysis shown publicly (analysis access "free"). Prediction is not repeated here.
  staticAnalysis: { analysis: string[]; analysisFormat?: "markdown"; sources: FullMatchView["sources"]; comment: string | null } | null;
  // Pick-neutral facts (team news status, Statistical Core table, sources) for a page whose analysis is PRIME VIP.
  // Built only from allowlisted sections; never the pick, the odds or the premium analysis.
  publicContext: PublicMatchContext | null;
  // Client gate for whatever is VIP. Carries only the slug and which parts are protected.
  gate: { slug: string; showAnalysis: boolean; showPrediction: boolean } | null;
  labels: { prediction: string; odds: string; trend: string };
};

type RouteLocale = string; // "en" or a seo locale slug such as "pt-br"

function dateOnly(value?: string): string | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : new Date(time).toISOString().slice(0, 10);
}

function startDateIso(prediction: EditorialPrediction): string | undefined {
  const info = prediction.matchInfo;
  const timezone = leaguesBySlug[prediction.league]?.timezone;
  if (!info?.date || !info?.time || !timezone) return undefined;
  // localDateTimeToUtc returns an ISO-8601 UTC string, or null when the wall-clock time is invalid.
  const iso = localDateTimeToUtc(info.date, info.time, timezone);
  return iso && !Number.isNaN(Date.parse(iso)) ? iso : undefined;
}

// A match that has not kicked off yet. The trend teaser summarises the match story (and can spoil the pick),
// so it is only shown once the match is history. Without a usable date the match is treated as past.
function isUpcoming(prediction: EditorialPrediction, now: Date | string): boolean {
  const nowMs = typeof now === "string" ? Date.parse(now) : now.getTime();
  if (Number.isNaN(nowMs)) return false;
  const kickoff = startDateIso(prediction);
  if (kickoff) return Date.parse(kickoff) > nowMs;
  const date = prediction.matchInfo?.date;
  if (!date) return false;
  return date >= new Date(nowMs).toISOString().slice(0, 10);
}

// Public structured data: a WebPage and its Article (author, dates). No pick, odds or analysis.
// `gated` marks a page that has a PRIME VIP part. The protected text is not in the HTML at all (it is fetched
// after a verified session), so the paywall markup only tells Google which element is the locked part.
export function buildPublicJsonLd(prediction: EditorialPrediction, routeLocale: RouteLocale, slug: string, headline: string, gated = false) {
  const url = absoluteUrl(routeLocale === "en" ? `/match/${slug}/` : localePath(routeLocale as any, `/match/${slug}/`));
  const language = routeLocale === "pt-br" ? "pt-BR" : routeLocale;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description: prediction.teaser ?? headline,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: language,
    ...(prediction.publishedAt ? { datePublished: prediction.publishedAt } : {}),
    ...(prediction.updatedAt ? { dateModified: prediction.updatedAt } : {}),
    author: editorialAuthorPersonJsonLd(),
    publisher: { "@id": absoluteUrl("/#organization") },
    image: [absoluteUrl("/og-default.png")],
    isAccessibleForFree: !gated,
    ...(gated ? { hasPart: [{ "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".match-gate-slot" }] } : {}),
  };
  const leagueName = leaguesBySlug[prediction.league]?.name ?? prediction.league;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: leagueName, item: absoluteUrl("/football-predictions/") },
      { "@type": "ListItem", position: 3, name: `${prediction.homeTeam} vs ${prediction.awayTeam} Prediction`, item: url },
    ],
  };
  return [buildWebPageJsonLd(prediction, routeLocale, slug), article, breadcrumb];
}

// (WebPage builder) Public SportsEvent only: teams, league, kickoff, venue (when recorded), canonical URL.
// No pick, odds, prediction or analysis text.
function buildWebPageJsonLd(prediction: EditorialPrediction, routeLocale: RouteLocale, slug: string) {
  // A SportsEvent needs a verified venue address (city and country). The package does not provide
  // one, so the page publishes a WebPage with teams, date and canonical URL instead.
  const url = absoluteUrl(routeLocale === "en" ? `/match/${slug}/` : localePath(routeLocale as any, `/match/${slug}/`));
  const leagueName = leaguesBySlug[prediction.league]?.name ?? prediction.league;
  const startDate = startDateIso(prediction);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: `${prediction.homeTeam} vs ${prediction.awayTeam} Prediction`,
    url,
    inLanguage: routeLocale === "pt-br" ? "pt-BR" : routeLocale,
    about: {
      "@type": "SportsOrganization",
      name: leagueName,
    },
    ...(startDate ? { temporalCoverage: startDate } : {}),
    ...(prediction.publishedAt ? { datePublished: prediction.publishedAt } : {}),
    ...(prediction.updatedAt ? { dateModified: prediction.updatedAt } : {}),
  };
}

export function buildMatchPageModel(
  prediction: EditorialPrediction,
  routeLocale: RouteLocale,
  now: Date | string = new Date(),
): MatchPageModel | null {
  if (!hasMatchPage(prediction)) return null;
  const slug = matchSlug(prediction);
  const base = buildPublicMatchView(prediction);
  const vars = { home: prediction.homeTeam, away: prediction.awayTeam };
  const access = resolveAccess(prediction);
  const analysisFree = access.analysis === "free";
  const predictionFree = access.prediction === "free";
  const full = buildFullMatchView(prediction);

  const heading = translate(routeLocale, "matchTitle", vars);
  const view = {
    ...base,
    heading,
    kicker: translate(routeLocale, analysisFree ? "matchFreeAnalysis" : "matchVipAnalysis"),
    teaser: base.teaser ?? translate(routeLocale, analysisFree ? "matchFreeTeaser" : "matchVipTeaser", vars),
    publishedDate: dateOnly(prediction.publishedAt),
    updatedDate: dateOnly(prediction.updatedAt),
  };

  const protectedAnything = !analysisFree || !predictionFree;

  return {
    view,
    seoTitle: prediction.seoTitle ?? heading,
    jsonLd: buildPublicJsonLd(prediction, routeLocale, slug, heading, protectedAnything),
    publicPrediction: predictionFree ? full.picks : null,
    trend: !predictionFree && !isUpcoming(prediction, now) ? (prediction.trend ?? null) : null,
    // Analysis text only. The pick and odds never travel with it, even when the prediction is VIP.
    staticAnalysis: analysisFree ? { analysis: full.analysis, analysisFormat: full.analysisFormat, sources: full.sources, comment: full.comment } : null,
    publicContext: analysisFree ? null : buildPublicMatchContext(prediction),
    gate: protectedAnything ? { slug, showAnalysis: !analysisFree, showPrediction: !predictionFree } : null,
    labels: {
      prediction: translate(routeLocale, "mainPrediction"),
      odds: translate(routeLocale, "odds"),
      trend: translate(routeLocale, "matchTrend"),
    },
  };
}
