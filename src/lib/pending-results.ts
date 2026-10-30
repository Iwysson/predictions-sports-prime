import type { MatchPreview } from "@/types";
import { evaluatePredictionSettlement } from "@/lib/prediction-results";
import { resultKey, type FootballResultsDataset } from "@/lib/football-results";
import type { ReconcilePendingReason } from "@/lib/result-reconciliation";

/**
 * Football predictions past kickoff with no settlement yet, each with the reason it is still open. Nothing here
 * counts towards any statistic. A protected pick stays hidden until it settles, exactly as it was before kickoff:
 * the match page of an unsettled VIP prediction is still protected, so this list must not reveal more than it does.
 */
export type PendingResultRecord = {
  key: string;
  league: string;
  slug: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  predictionAccess: "free" | "vip";
  prediction: string | null;
  odds: number | null;
  reason: ReconcilePendingReason;
  missing?: string[];
};

export type PendingResultsDataset = {
  version: 1;
  /** What the last reconcile run learned for each key; the settle step turns it into `records`. */
  reconcileReasons?: Record<string, ReconcilePendingReason>;
  records: Record<string, PendingResultRecord>;
};

export const emptyPendingDataset = (): PendingResultsDataset => ({ version: 1, records: {} });

export const pendingReasonLabels: Record<ReconcilePendingReason, string> = {
  NOT_COMPLETED: "Awaiting the official final result",
  FINAL_SCORE_MISSING: "Final score not yet available",
  PICK_MISSING: "Published pick unavailable",
  UNSUPPORTED_MARKET: "Market needs manual review",
  MARKET_DATA_MISSING: "Awaiting verified market statistics",
  EXECUTION_DATA_MISSING: "Awaiting live-entry execution data",
  TEAM_NOT_RESOLVED: "Selected team needs review",
  EVIDENCE_UNAVAILABLE: "No verifiable source for a required fact",
  HANDICAP_TYPE_AMBIGUOUS: "Handicap landed on the line; published type needs review",
  MANUAL_PENDING: "Under manual review",
  FIXTURE_NOT_FOUND: "Fixture not found at the result providers",
  FIXTURE_IDENTITY_CONFLICT: "Provider fixture does not match the published teams",
  SCORE_CONFLICT: "Result providers disagree on the final score",
  EXTRA_TIME_SCORE_UNVERIFIED: "90-minute score not verified (match went beyond 90 minutes)",
  FIXTURE_POSTPONED: "Match postponed",
  FIXTURE_SUSPENDED_OR_ABANDONED: "Match suspended or abandoned",
  RESULT_AWARDED: "Result awarded administratively; needs review",
};

/** Kickoff has passed, or the date is already behind when no reliable kickoff is known. */
export function hasKickedOff(match: Pick<MatchPreview, "kickoffUtc" | "date">, now: Date) {
  const kickoff = Date.parse(match.kickoffUtc ?? "");
  if (Number.isFinite(kickoff)) return kickoff <= now.getTime();
  return Boolean(match.date) && match.date < now.toISOString().slice(0, 10);
}

export function buildPendingLedger(
  matches: MatchPreview[],
  results: FootballResultsDataset,
  reasons: Record<string, ReconcilePendingReason>,
  now: Date
): Record<string, PendingResultRecord> {
  const records: Record<string, PendingResultRecord> = {};
  for (const match of matches) {
    const key = resultKey(match);
    if (results.records[key] || !hasKickedOff(match, now)) continue;
    const evaluation = evaluatePredictionSettlement(match);
    const final = match.fixtureStatus === "completed";
    const predictionAccess = match.predictionAccess === "free" ? "free" : "vip";
    const visible = predictionAccess === "free";
    records[key] = {
      key,
      league: match.league,
      slug: match.slug,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      date: match.date,
      predictionAccess,
      prediction: visible ? match.mainPrediction ?? null : null,
      odds: visible ? match.odds ?? null : null,
      reason: final ? evaluation.pendingReason ?? "NOT_COMPLETED" : reasons[key] ?? evaluation.pendingReason ?? "NOT_COMPLETED",
      ...(evaluation.missingFields.length ? { missing: evaluation.missingFields } : {}),
    };
  }
  return Object.fromEntries(Object.entries(records).sort(([left], [right]) => left.localeCompare(right)));
}
