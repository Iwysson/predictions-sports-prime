import type { MatchPreview, PredictionResultStatus } from "@/types";
import { isCompletedFixture } from "@/lib/fixture-status";
import { evaluatePredictionSettlement } from "@/lib/prediction-results";

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
  void now;
  const entries = completePredictionHistory(
    matches
      .filter((match) => isCompletedFixture(match.fixtureStatus))
  );
  const counts = predictionResultCounts(entries);
  const settled = counts.green + counts.red + counts.push + counts["half-green"] + counts["half-red"] + counts.void;
  const awaitingMarketData = entries.filter((match) =>
    evaluatePredictionSettlement(match).pendingReason === "MARKET_DATA_MISSING"
  ).length;
  const awaitingExecutionData = entries.filter((match) =>
    evaluatePredictionSettlement(match).pendingReason === "EXECUTION_DATA_MISSING"
  ).length;

  return {
    published: matches.filter((match) => match.status === "published").length,
    completed: entries.length,
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
