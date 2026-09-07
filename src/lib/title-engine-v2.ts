import { leaguesBySlug } from "@/data/leagues";
import { getMatchSearchIntent, type MatchSearchIntentV2 } from "@/lib/search-intent-v2";
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
  const odds = match.predictions.find((item) => item.label === "Published Odds" || item.label === "Odds")?.value;
  const pick = match.predictions.find((item) => item.label === "Main Prediction")?.value;
  const historical = intent.temporalIntent === "FINAL" || intent.temporalIntent === "HISTORICAL";
  const title = historical
    ? fit([
        `${fixture} - ${prediction} Result & Match Analysis`,
        `${fixture} - ${prediction} Result`,
      ], 70)
    : fit([
        `${fixture} ${prediction} & ${betting} - ${league}`,
        `${fixture} ${prediction}, ${oddsLabel} & Tips - ${league}`,
        `${fixture} ${prediction} - ${league}`,
        `${fixture} ${prediction}`,
      ], 70);
  const h1 = historical
    ? `${fixture} - ${prediction} Result & Match Analysis`
    : `${fixture} ${prediction} & ${betting}`;
  const description = historical
    ? fit([
        `${fixture} ${prediction.toLocaleLowerCase()} result and match analysis for ${league}, preserving the original pick${odds ? ` and published odds of ${odds}` : ""}.`,
        `${fixture} result, original ${prediction.toLocaleLowerCase()} and match analysis for ${league}.`,
      ], 160)
    : fit([
        `${fixture} ${prediction.toLocaleLowerCase()} for ${league}: ${pick ?? "our main pick"}${odds ? ` at odds of ${odds}` : ""}. ${betting}, analysis and supporting match context.`,
        `${fixture} ${prediction.toLocaleLowerCase()} for ${league}${odds ? `, with published odds of ${odds}` : ""}. ${betting} and match analysis.`,
      ], 160);
  const intro = historical
    ? `${fixture} is preserved as a completed ${league} prediction record, including the original selection and the analysis published before kickoff.`
    : `${fixture} meet in ${league}. The primary selection is ${pick ?? "shown below"}${odds ? ` at published odds of ${odds}` : ""}, supported by the match analysis and relevant team context.`;

  return {
    title,
    description,
    h1,
    intro,
    intent,
    reasons: [
      "prediction_primary",
      historical ? "historical_metadata" : "pre_match_metadata",
      title.includes(league) ? "competition_context_included" : "competition_omitted_for_length",
      match.matchSeo?.lineups ? "lineups_supporting_only" : "no_lineup_intent",
    ],
  };
}
