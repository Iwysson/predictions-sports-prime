import type { MatchPreview, PredictionResultStatus } from "@/types";
import { evaluatePredictionSettlement } from "@/lib/prediction-results";
import { isCompletedFixture, isValidFinalScore } from "@/lib/fixture-status";

/**
 * Central football results dataset: the single source read by both the global
 * Results page and the homepage preview. It is derived from published
 * predictions + official final fixtures by the settlement engine
 * (`evaluatePredictionSettlement`) and never edited by hand.
 */
export type SettledResultStatus = Extract<PredictionResultStatus, "green" | "red" | "push" | "half-green" | "half-red" | "void">;

export type FootballResultRecord = {
  key: string;
  league: string;
  slug: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  fixtureId?: string;
  /** Access tier the prediction had before kickoff (informational; settled picks are public in Results). */
  predictionAccess: "free" | "vip";
  /** Original published market and price, frozen at settlement time. */
  prediction: string;
  odds: number | null;
  finalScore: { home: number; away: number };
  result: SettledResultStatus;
  settledAt: string;
};

export type FootballResultsDataset = {
  version: 1;
  records: Record<string, FootballResultRecord>;
};

export const SETTLED_STATUSES: ReadonlySet<PredictionResultStatus> = new Set([
  "green", "red", "push", "half-green", "half-red", "void",
]);

export const emptyResultsDataset = (): FootballResultsDataset => ({ version: 1, records: {} });

export const resultKey = (match: Pick<MatchPreview, "league" | "slug">) => `${match.league}:${match.slug}`;

/** Label used on the site for each settlement state. */
export const resultLabels: Record<SettledResultStatus, string> = {
  green: "WIN",
  red: "LOSS",
  push: "PUSH",
  "half-green": "HALF WIN",
  "half-red": "HALF LOSS",
  void: "VOID",
};

/**
 * Derive a record from a hydrated prediction. Returns null unless the fixture
 * is officially final with a valid score and the market is settleable from the
 * data on hand (live, scheduled, postponed, cancelled and needs-data markets
 * never produce a record).
 */
export function settleFromMatch(match: MatchPreview, settledAt: string): FootballResultRecord | null {
  if (match.status !== "published" || !match.mainPrediction) return null;
  if (!isCompletedFixture(match.fixtureStatus) || !isValidFinalScore(match.homeScore, match.awayScore)) return null;
  const evaluation = evaluatePredictionSettlement(match);
  if (!SETTLED_STATUSES.has(evaluation.status)) return null;
  return {
    key: resultKey(match),
    league: match.league,
    slug: match.slug,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    date: match.date,
    ...(match.fixtureId ? { fixtureId: match.fixtureId } : {}),
    predictionAccess: match.predictionAccess === "free" ? "free" : "vip",
    prediction: match.mainPrediction,
    odds: match.odds ?? null,
    finalScore: { home: match.homeScore as number, away: match.awayScore as number },
    result: evaluation.status as SettledResultStatus,
    settledAt,
  };
}

/**
 * Idempotent merge. A stored settlement is canonical: re-processing a final
 * fixture yields the same record, and a provider outage (no longer final) can
 * never delete or downgrade one. Output is sorted for stable diffs.
 */
export function buildResultsDataset(
  matches: MatchPreview[],
  previous: FootballResultsDataset = emptyResultsDataset(),
  now: string = new Date().toISOString()
): FootballResultsDataset {
  const records: Record<string, FootballResultRecord> = { ...previous.records };
  for (const match of matches) {
    const key = resultKey(match);
    if (records[key]) continue;
    const record = settleFromMatch(match, now);
    if (record) records[key] = record;
  }
  return {
    version: 1,
    records: Object.fromEntries(Object.entries(records).sort(([left], [right]) => left.localeCompare(right))),
  };
}

export function sortedResults(dataset: FootballResultsDataset) {
  return Object.values(dataset.records).sort((left, right) =>
    right.date.localeCompare(left.date) || right.settledAt.localeCompare(left.settledAt) || left.key.localeCompare(right.key)
  );
}

export function latestResults(dataset: FootballResultsDataset, limit: number) {
  return sortedResults(dataset).slice(0, limit);
}

/** Win rate = wins / (wins + losses); push, half, void and pending are excluded. */
export function summarizeResults(records: FootballResultRecord[]) {
  const count = (status: SettledResultStatus) => records.filter((record) => record.result === status).length;
  const wins = count("green");
  const losses = count("red");
  return {
    settled: records.length,
    wins,
    losses,
    pushes: count("push"),
    halfWins: count("half-green"),
    halfLosses: count("half-red"),
    voids: count("void"),
    winRate: wins + losses > 0 ? wins / (wins + losses) : null,
  };
}

/**
 * Re-applies a stored settlement's final score to a hydrated prediction when
 * the live feed has not (or no longer) reports it. This is how a confirmed
 * result survives provider failures and stale snapshots.
 */
export function overlayStoredResult(match: MatchPreview, dataset: FootballResultsDataset): MatchPreview {
  const record = dataset.records[resultKey(match)];
  if (!record) return match;
  if (isCompletedFixture(match.fixtureStatus) && isValidFinalScore(match.homeScore, match.awayScore)) return match;
  return { ...match, fixtureStatus: "completed", homeScore: record.finalScore.home, awayScore: record.finalScore.away };
}

/**
 * Record as rendered on public pages. Only officially FINAL, settled records
 * exist in the dataset, so the original pick and odds are public here (the
 * premium protection applies before and during the match). Premium analysis is
 * never part of a record.
 */
export type PublicFootballResult = FootballResultRecord;

export function toPublicResult(record: FootballResultRecord): PublicFootballResult {
  return record;
}
