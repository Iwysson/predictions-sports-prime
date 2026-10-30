import { normalizeTeamKey, teamNamesMatch } from "@/lib/openfootball";
import { isValidFinalScore, type FixtureStatus } from "@/lib/fixture-status";
import type { SettlementPendingReason } from "@/lib/prediction-results";

/**
 * Pure rules of the results reconciler (scripts/reconcile-football-results.mts): which provider event is
 * the published fixture, and what its observations prove. No network and no clock, so every rule is tested
 * directly. The reconciler never presumes: anything ambiguous stays PENDING with its reason recorded.
 */
export type ProviderObservation = {
  provider: "espn" | "fotmob";
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  status: FixtureStatus;
  /** False when the provider's score includes extra time or penalties, so it is not the 90-minute result. */
  regulationScore: boolean;
  homeScore: number | null;
  awayScore: number | null;
  sourceUrl: string;
};

export type ResultEvidence = {
  status: FixtureStatus;
  homeScore?: number;
  awayScore?: number;
  provider: ProviderObservation["provider"];
  providerEventId: string;
  sourceUrl: string;
  kickoffUtc: string;
  capturedAt: string;
};

export type ResultEvidenceDataset = { version: 1; records: Record<string, ResultEvidence> };

export type ReconcilePendingReason =
  | SettlementPendingReason
  | "FIXTURE_NOT_FOUND"
  | "FIXTURE_IDENTITY_CONFLICT"
  | "SCORE_CONFLICT"
  | "EXTRA_TIME_SCORE_UNVERIFIED"
  | "FIXTURE_POSTPONED"
  | "FIXTURE_SUSPENDED_OR_ABANDONED"
  | "RESULT_AWARDED";

const RESERVE_SIDE = /\b(?:u-?\d{2}|ii|b|women|w|reserves?|youth)\b/i;

/** Exact identity first; containment only for full club names the alias table does not know yet. */
export function sameClub(left: string, right: string) {
  if (teamNamesMatch(left, right)) return true;
  if (RESERVE_SIDE.test(left) !== RESERVE_SIDE.test(right)) return false;
  const [a, b] = [normalizeTeamKey(left), normalizeTeamKey(right)];
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  return short.length >= 5 && long.includes(short);
}

export type FixtureMatch =
  | { kind: "matched"; observations: ProviderObservation[] }
  | { kind: "reversed" }
  | { kind: "ambiguous" }
  | { kind: "none" };

/**
 * The provider events for one published prediction. Home and away must both agree: a reverse fixture is
 * reported as a conflict and never graded, because the same two teams meet twice in a season. Each provider
 * may contribute one event only; two candidates from one provider are ambiguous.
 */
export function matchFixture(
  prediction: { homeTeam: string; awayTeam: string },
  observations: ProviderObservation[]
): FixtureMatch {
  const direct = observations.filter((item) => sameClub(item.homeTeam, prediction.homeTeam) && sameClub(item.awayTeam, prediction.awayTeam));
  const providers = new Set(direct.map((item) => item.provider));
  if (direct.length > providers.size) return { kind: "ambiguous" };
  if (direct.length) return { kind: "matched", observations: direct };
  const reversed = observations.some((item) => sameClub(item.homeTeam, prediction.awayTeam) && sameClub(item.awayTeam, prediction.homeTeam));
  return reversed ? { kind: "reversed" } : { kind: "none" };
}

export type EvidenceDecision =
  | { kind: "final"; evidence: ResultEvidence }
  | { kind: "void"; evidence: ResultEvidence }
  | { kind: "pending"; reason: ReconcilePendingReason };

const isFinalObservation = (item: ProviderObservation) =>
  item.status === "completed" && isValidFinalScore(item.homeScore ?? undefined, item.awayScore ?? undefined);

const toEvidence = (item: ProviderObservation, capturedAt: string): ResultEvidence => ({
  status: item.status,
  ...(item.homeScore !== null ? { homeScore: item.homeScore } : {}),
  ...(item.awayScore !== null ? { awayScore: item.awayScore } : {}),
  provider: item.provider,
  providerEventId: item.eventId,
  sourceUrl: item.sourceUrl,
  kickoffUtc: item.kickoffUtc,
  capturedAt,
});

/**
 * What the matched observations prove. Two providers that disagree on a final score prove nothing; a score
 * after extra time or penalties is not the 90-minute score these markets settle on; only an explicit
 * cancellation is a VOID (a postponed or suspended match can still be played).
 */
export function decideEvidence(observations: ProviderObservation[], capturedAt: string): EvidenceDecision {
  const finals = observations.filter(isFinalObservation);
  if (finals.length > 1 && finals.some((item) => item.homeScore !== finals[0].homeScore || item.awayScore !== finals[0].awayScore)) {
    const regulation = finals.filter((item) => item.regulationScore);
    if (regulation.length === finals.length || regulation.length === 0) return { kind: "pending", reason: "SCORE_CONFLICT" };
  }
  const regulation = finals.find((item) => item.regulationScore);
  if (regulation) return { kind: "final", evidence: toEvidence(regulation, capturedAt) };
  if (finals.length) return { kind: "pending", reason: "EXTRA_TIME_SCORE_UNVERIFIED" };
  const canceled = observations.find((item) => item.status === "canceled");
  if (canceled) return { kind: "void", evidence: toEvidence(canceled, capturedAt) };
  const statuses = new Set(observations.map((item) => item.status));
  if (statuses.has("postponed") || statuses.has("rescheduled")) return { kind: "pending", reason: "FIXTURE_POSTPONED" };
  if (statuses.has("abandoned") || statuses.has("suspended")) return { kind: "pending", reason: "FIXTURE_SUSPENDED_OR_ABANDONED" };
  if (statuses.has("awarded")) return { kind: "pending", reason: "RESULT_AWARDED" };
  return { kind: "pending", reason: "NOT_COMPLETED" };
}

/** ESPN marks extra time and penalties in the status name; FotMob in the status reason. */
export const espnRegulationScore = (statusName: string) => !/AET|EXTRA|PEN/i.test(statusName);
export const fotmobRegulationScore = (reasonShort: string | undefined) => !reasonShort || /^(?:FT|Full-?Time)$/i.test(reasonShort);

/** A stored final observation is immutable: a later provider response can never change or remove it. */
export function mergeEvidence(previous: ResultEvidence | undefined, next: ResultEvidence) {
  return previous && (previous.status === "completed" || previous.status === "canceled") ? previous : next;
}
