import { leaguesBySlug } from "@/data/leagues";
import { getCanonicalMatchLifecycle } from "@/lib/canonical-match-lifecycle";
import { dateInTimeZone, fixtureKickoffMillis } from "@/lib/fixture-state";
import { localeSearchResearch, type SearchLocale } from "@/lib/search-intent-research";
import type { Match } from "@/types";

export type TemporalIntent =
  | "UPCOMING_LONG"
  | "UPCOMING_72H"
  | "TOMORROW"
  | "TODAY"
  | "LIVE"
  | "FINAL"
  | "HISTORICAL";

export type MetadataVariant = "legacy" | "prediction-first-v2";

export type MatchSearchIntentV2 = {
  ownerUrl: string;
  primaryIntent: string;
  supportingIntents: string[];
  targetMarket: "international-en" | "us-en" | "pt-br" | "es";
  language: SearchLocale;
  competitionIntent: string;
  temporalIntent: TemporalIntent;
  metadataVariant: MetadataVariant;
};

function teams(match: Match, locale: SearchLocale) {
  return `${match.homeTeam} ${localeSearchResearch[locale].separator} ${match.awayTeam}`;
}

export function getMatchTemporalIntent(
  match: Match,
  now: Date | string = new Date()
): TemporalIntent {
  const lifecycle = getCanonicalMatchLifecycle(match, now);
  if (lifecycle.state === "completed") return "FINAL";
  if (lifecycle.state === "live") return "LIVE";
  if (!lifecycle.isPreMatch) return "HISTORICAL";

  const kickoff = fixtureKickoffMillis(match);
  if (kickoff === null) return "UPCOMING_LONG";
  const nowMs = new Date(now).valueOf();
  const today = dateInTimeZone(now);
  const tomorrow = dateInTimeZone(new Date(nowMs + 24 * 60 * 60 * 1000));
  const matchDate = dateInTimeZone(new Date(kickoff));
  if (matchDate === today) return "TODAY";
  if (matchDate === tomorrow) return "TOMORROW";
  return kickoff - nowMs <= 72 * 60 * 60 * 1000
    ? "UPCOMING_72H"
    : "UPCOMING_LONG";
}

function targetMarket(locale: SearchLocale): MatchSearchIntentV2["targetMarket"] {
  if (locale === "pt-BR") return "pt-br";
  if (locale === "es") return "es";
  return "international-en";
}

export function getMatchSearchIntent(
  match: Match,
  locale: SearchLocale = "en",
  now: Date | string = new Date(),
  metadataVariant: MetadataVariant = "prediction-first-v2"
): MatchSearchIntentV2 {
  const research = localeSearchResearch[locale];
  const fixture = teams(match, locale);
  const supportingIntents = [
    `${fixture} ${research.betting}`,
    ...(match.predictions.some((item) => item.label === "Published Odds" || item.label === "Odds")
      ? [`${fixture} ${research.odds}`]
      : []),
    ...(match.matchSeo?.lineups ? [`${fixture} probable lineups`] : []),
    ...(match.matchSeo?.teamNews || match.matchSeo?.availability
      ? [`${fixture} team news`]
      : []),
  ];

  return {
    ownerUrl: `/match/${match.slug}/`,
    primaryIntent: `${fixture} ${research.prediction}`.toLocaleLowerCase(),
    supportingIntents: [...new Set(supportingIntents.map((item) => item.toLocaleLowerCase()))].slice(0, 4),
    targetMarket: targetMarket(locale),
    language: locale,
    competitionIntent: `${leaguesBySlug[match.league]?.name ?? match.league} ${research.prediction}`.toLocaleLowerCase(),
    temporalIntent: getMatchTemporalIntent(match, now),
    metadataVariant,
  };
}

export function isMatchSearchIntentV2Eligible(
  match: Match,
  now: Date | string = new Date()
) {
  return ["UPCOMING_LONG", "UPCOMING_72H", "TOMORROW", "TODAY"].includes(
    getMatchTemporalIntent(match, now)
  );
}

export const intentOwnership = {
  match: "{home} vs {away} prediction",
  league: "{league} predictions",
  home: "football predictions",
  todayFutureHub: "football predictions today",
  usFutureHub: "soccer predictions today",
  results: "football prediction results",
} as const;
