import type { MatchPreview, PredictionResultStatus } from "@/types";
import { evaluatePredictionSettlement } from "@/lib/prediction-results";
import { isFixtureHistoryEligible } from "@/lib/fixture-state";
import { isCompletedFixture } from "@/lib/fixture-status";

export const resultStatusPresentation: Record<PredictionResultStatus, { label: string; icon: string }> = {
  pending: { label: "PENDING", icon: "○" },
  "awaiting-data": { label: "AWAITING DATA", icon: "○" },
  green: { label: "WON", icon: "✓" },
  red: { label: "LOST", icon: "✕" },
  push: { label: "PUSH", icon: "—" },
  "half-green": { label: "HALF WON", icon: "◐" },
  "half-red": { label: "HALF LOST", icon: "◑" },
  void: { label: "VOID", icon: "⊘" },
};

export function completePredictionHistory(matches: MatchPreview[]) {
  return [...matches].sort((left, right) =>
    `${right.date || right.publishedAt?.slice(0, 10) || ""}T${right.time || "00:00"}`.localeCompare(
      `${left.date || left.publishedAt?.slice(0, 10) || ""}T${left.time || "00:00"}`
    ) ||
    (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "") ||
    left.slug.localeCompare(right.slug)
  );
}

export function predictionResultCounts(matches: MatchPreview[]) {
  const counts: Record<PredictionResultStatus, number> = {
    pending: 0, "awaiting-data": 0, green: 0, red: 0, push: 0, "half-green": 0, "half-red": 0, void: 0,
  };
  matches.forEach((match) => { counts[match.betResult ?? "pending"] += 1; });
  return counts;
}

export function buildPredictionHistoryState(matches: MatchPreview[], now: Date | string = new Date()) {
  const entries = completePredictionHistory(
    matches
      .filter((match) => match.status === "published" && isFixtureHistoryEligible(match, now))
  );
  const counts = predictionResultCounts(entries);
  const completed = entries.filter((match) => isCompletedFixture(match.fixtureStatus)).length;
  const awaitingResult = entries.length - completed;
  const settled = counts.green + counts.red + counts.push + counts["half-green"] + counts["half-red"] + counts.void;
  const awaitingMarketData = entries.filter((match) =>
    evaluatePredictionSettlement(match).pendingReason === "MARKET_DATA_MISSING"
  ).length;
  const awaitingExecutionData = entries.filter((match) =>
    evaluatePredictionSettlement(match).pendingReason === "EXECUTION_DATA_MISSING"
  ).length;

  return {
    published: matches.filter((match) => match.status === "published").length,
    completed,
    awaitingResult,
    settled,
    won: counts.green,
    lost: counts.red,
    push: counts.push,
    halfWon: counts["half-green"],
    halfLost: counts["half-red"],
    void: counts.void,
    awaitingData: counts["awaiting-data"],
    awaitingMarketData,
    awaitingExecutionData,
    pending: counts.pending,
    entries,
  };
}

/**
 * Reproducible, presentation-only performance summary. One published record is
 * always one observation, including combined selections with multiple legs.
 */
export function buildHistoricalPerformance(matches: MatchPreview[], now: Date | string = new Date()) {
  const history = buildPredictionHistoryState(matches, now);
  const decided = history.won + history.lost;
  const unresolvedPending = history.entries.filter((match) =>
    (match.betResult ?? "pending") === "pending" &&
    evaluatePredictionSettlement(match).pendingReason !== "NOT_COMPLETED"
  ).length;
  const unresolved = history.awaitingData + unresolvedPending;

  return {
    ...history,
    historical: history.entries.length,
    decided,
    unresolved,
    pushOrVoid: history.push + history.void,
    winRate: decided > 0 ? history.won / decided : null,
    winRateDenominator: "wins + losses" as const,
  };
}

export function buildLeaguePerformanceBreakdown(matches: MatchPreview[], now: Date | string = new Date()) {
  const history = buildPredictionHistoryState(matches, now);
  const leagues = new Map<MatchPreview["league"], MatchPreview[]>();
  for (const match of history.entries) {
    leagues.set(match.league, [...(leagues.get(match.league) ?? []), match]);
  }
  return [...leagues.entries()]
    .map(([league, entries]) => ({ league, ...buildHistoricalPerformance(entries, now) }))
    .filter((entry) => entry.decided > 0)
    .sort((left, right) => right.decided - left.decided || left.league.localeCompare(right.league));
}
