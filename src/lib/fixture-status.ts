export type FixtureStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "postponed"
  | "canceled"
  | "abandoned"
  | "suspended"
  | "awarded";

export type FixtureStatusCategory = "upcoming" | "live" | "completed" | "non-playable";

export function normalizeProviderStatus(input: {
  name?: string;
  state?: string;
  completed?: boolean;
}): FixtureStatus {
  const name = (input.name ?? "").trim().toUpperCase();
  const state = (input.state ?? "").trim().toLowerCase();

  if (/POSTPONED|PPD/.test(name)) return "postponed";
  if (/CANCELED|CANCELLED/.test(name)) return "canceled";
  if (/ABANDONED/.test(name)) return "abandoned";
  if (/SUSPENDED|INTERRUPTED/.test(name)) return "suspended";
  if (/AWARDED|WALKOVER|WO$/.test(name)) return "awarded";
  if (input.completed || /(?:FULL[ _-]?TIME|FINISHED|FINAL|AFTER[ _-]?(?:EXTRA[ _-]?TIME|PENALTIES)|AET|(?:^|[_ -])PEN(?:$|[_ -]))/.test(name)) return "completed";
  if (state === "in" || /FIRST[ _-]?HALF|HALF[ _-]?TIME|SECOND[ _-]?HALF|EXTRA[ _-]?TIME|PENALTIES|LIVE/.test(name)) return "in-progress";
  return "scheduled";
}

export function fixtureStatusCategory(status?: FixtureStatus): FixtureStatusCategory {
  if (status === "completed") return "completed";
  if (status === "in-progress") return "live";
  if (["postponed", "canceled", "abandoned", "suspended", "awarded"].includes(status ?? "")) return "non-playable";
  return "upcoming";
}

export const isPlayableUpcoming = (status?: FixtureStatus) => fixtureStatusCategory(status) === "upcoming";
export const isLiveFixture = (status?: FixtureStatus) => fixtureStatusCategory(status) === "live";
export const isCompletedFixture = (status?: FixtureStatus) => fixtureStatusCategory(status) === "completed";
export const isNonPlayableFixture = (status?: FixtureStatus) => fixtureStatusCategory(status) === "non-playable";

export function canRenderComingSoon(status: FixtureStatus | undefined, hasPublishedPrediction: boolean) {
  return !hasPublishedPrediction && isPlayableUpcoming(status);
}

export function filterPlayableBeforeLimit<T extends { status?: FixtureStatus }>(items: T[], limit: number) {
  return items.filter((item) => isPlayableUpcoming(item.status)).slice(0, limit);
}

export function findFirstActiveRound<T extends { games: Array<{ status?: FixtureStatus }> }>(rounds: T[]) {
  return rounds.find((round) =>
    round.games.some((game) => isPlayableUpcoming(game.status) || isLiveFixture(game.status))
  ) ?? null;
}

export function isValidFinalScore(homeScore: unknown, awayScore: unknown) {
  return (
    typeof homeScore === "number" &&
    typeof awayScore === "number" &&
    Number.isFinite(homeScore) &&
    Number.isFinite(awayScore) &&
    Number.isInteger(homeScore) &&
    Number.isInteger(awayScore) &&
    homeScore >= 0 &&
    awayScore >= 0
  );
}

export function isHistoryEligibleFixture(fixture: {
  status?: FixtureStatus;
  homeScore?: unknown;
  awayScore?: unknown;
}) {
  return (
    isCompletedFixture(fixture.status) &&
    isValidFinalScore(fixture.homeScore, fixture.awayScore)
  );
}
