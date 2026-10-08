import type { EditorialPrediction } from "@/types";
import { predictionSlug } from "@/lib/editorial";
import results from "@/data/football-results.snapshot.json";

// Lifecycle of a football /match/[slug] page.
//
// A page exists while the match is upcoming, live, or final but not yet settled. It stops being
// generated only once the match is officially final AND its settlement is stored in the
// permanent results dataset (football-results.snapshot.json). That dataset only ever contains
// records for fixtures with an official final score and a settled market, so "has a record"
// is exactly "FINAL + settled". Nothing is listed by hand: the rule follows the dataset.
//
// The settled record keeps the original pick, odds, access tier, score and outcome, and feeds
// /results/, the homepage results and the track record on its own. It never needs the page.

export type SettledKeys = ReadonlySet<string>;

export const settledResultKeys: SettledKeys = new Set(Object.keys((results as { records: Record<string, unknown> }).records));
export const settledResultSlugs: ReadonlySet<string> = new Set(
  Object.values((results as { records: Record<string, { slug: string }> }).records).map((record) => record.slug),
);

export const predictionResultKey = (prediction: Pick<EditorialPrediction, "league" | "homeTeam" | "awayTeam" | "slug">) =>
  `${prediction.league}:${prediction.slug ?? predictionSlug(prediction.homeTeam, prediction.awayTeam)}`;

export function isSettledPrediction(
  prediction: Pick<EditorialPrediction, "league" | "homeTeam" | "awayTeam" | "slug">,
  settled: SettledKeys = settledResultKeys,
) {
  return settled.has(predictionResultKey(prediction));
}

// True while the match page must be generated: published, kickoff recorded, not FINAL + settled.
// A provider failure or a pending settlement leaves the record absent, so the page stays.
export function hasMatchPage(prediction: EditorialPrediction, settled: SettledKeys = settledResultKeys) {
  if (prediction.published !== true) return false;
  const info = prediction.matchInfo;
  if (!info?.date || !info?.time) return false;
  return !isSettledPrediction(prediction, settled);
}
