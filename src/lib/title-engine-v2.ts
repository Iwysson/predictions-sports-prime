import { leaguesBySlug } from "@/data/leagues";
import { getMatchSearchIntent, type MatchSearchIntentV2 } from "@/lib/search-intent-v2";
import { dateInTimeZone, fixtureDateInTimeZone } from "@/lib/fixture-state";
import { isCompletedFixture } from "@/lib/fixture-status";
import { resolveHomeTemporalBucket } from "@/lib/match-feed";
import { localeSearchResearch, type SearchLocale } from "@/lib/search-intent-research";
import type { Match } from "@/types";

export type MatchMetadataV2 = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  intent: MatchSearchIntentV2;
  reasons: string[];
};

function sentenceCase(value: string) {
  return value ? `${value[0].toLocaleUpperCase()}${value.slice(1)}` : value;
}

function fit(candidates: string[], max: number) {
  return candidates.find((candidate) => candidate.length <= max) ?? candidates.at(-1)!;
}

export function buildMatchMetadataV2(
  match: Match,
  locale: SearchLocale = "en",
  now: Date | string = new Date()
): MatchMetadataV2 {
  const research = localeSearchResearch[locale];
  const fixture = `${match.homeTeam} ${research.separator} ${match.awayTeam}`;
  const prediction = sentenceCase(research.prediction);
  const betting = sentenceCase(research.betting);
  const oddsLabel = sentenceCase(research.odds);
  const league = leaguesBySlug[match.league]?.name ?? match.league;
  const intent = getMatchSearchIntent(match, locale, now);
  const today = dateInTimeZone(now);
  const fixtureDate = fixtureDateInTimeZone(match);
  const temporalBucket = resolveHomeTemporalBucket(match, today, now);
  // Keep date-owned metadata stable for the full fixture date. A scheduled
  // fixture can enter the LIVE lifecycle before its provider status refreshes,
  // but it is still the match listed for today in search and home-page intent.
  const temporalQualifier = temporalBucket === "today"
    ? ` ${research.temporal.today}`
    : temporalBucket === "tomorrow"
      ? ` ${research.temporal.tomorrow}`
      : "";
  const odds = match.predictions.find((item) => item.label === "Published Odds" || item.label === "Odds")?.value;
  const historical = isCompletedFixture(match.fixtureStatus) ||
    temporalBucket === "historical" ||
    Boolean(fixtureDate && fixtureDate < today);
  const title = historical
    ? fit([
        `${fixture} - ${prediction} Result & Match Analysis`,
        `${fixture} - ${prediction} Result`,
      ], 70)
    : fit([
        ...(odds ? [`${fixture} ${prediction}, ${oddsLabel} & ${betting}`] : []),
        `${fixture} ${prediction} & ${betting}`,
        `${fixture} ${prediction} - ${league}`,
        `${fixture} ${prediction}`,
      ], 70);
  const h1 = historical
    ? `${fixture} - ${prediction} Result & Match Analysis`
    : odds
      ? `${fixture} ${prediction}, ${oddsLabel} and ${betting}`
      : `${fixture} ${prediction} and ${betting}`;
  const description = historical
    ? fit([
        `${fixture} ${prediction.toLocaleLowerCase()} result and match analysis for ${league}, preserving the pre-match record without exposing the pick in search snippets.`,
        `${fixture} result and original match analysis for ${league}.`,
      ], 160)
    : fit([
        `${fixture} ${prediction.toLocaleLowerCase()}${temporalQualifier} for ${league}. Read the matchup evidence and risks; the pick and published odds are shown on the match page.`,
        `${fixture} ${prediction.toLocaleLowerCase()}${temporalQualifier}: match analysis with the pick and published odds shown on the match page.`,
      ], 160);
  const intro = historical
    ? `${fixture} is preserved as a completed ${league} prediction record, including the original selection and the analysis published before kickoff.`
    : `${fixture} meet in ${league}. Review the match analysis and relevant team context; the prediction and published odds are shown directly on the page.`;

  return {
    title,
    description,
    h1,
    intro,
    intent,
    reasons: [
      "prediction_primary",
      historical ? "historical_metadata" : "pre_match_metadata",
      historical ? "stable_archive_copy" : "match_acquisition_v3",
      title.includes(league) ? "competition_context_included" : "competition_omitted_for_length",
      odds ? (title.includes(oddsLabel) ? "odds_in_title" : "odds_omitted_for_length") : "no_published_odds",
      match.matchSeo?.lineups ? "lineups_supporting_only" : "no_lineup_intent",
    ],
  };
}
