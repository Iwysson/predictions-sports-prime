import type { OpenFootballRound, OpenFootballGame } from "@/lib/openfootball";
import { isCompletedFixture, isNonPlayableFixture } from "@/lib/fixture-status";
import { classifyFixture, fixtureKickoffMillis, isActiveFixtureState } from "@/lib/fixture-state";

export type MatchLifecycleStatus = "upcoming" | "live" | "completed" | "postponed" | "cancelled" | "stale-schedule" | "unknown";

export function getCurrentUtcTime(now: Date | string = new Date()) {
  return now instanceof Date ? new Date(now.toISOString()) : new Date(now);
}

export function getMatchLifecycleStatus(match: {
  status?: OpenFootballGame["status"];
  kickoffUtc?: string;
  date?: string;
  time?: string;
}, now: Date | string = new Date()): MatchLifecycleStatus {
  const state = classifyFixture(match, now);
  if (state === "scheduled" || state === "rescheduled") return "upcoming";
  if (state === "live" || state === "completed" || state === "postponed" || state === "stale-schedule" || state === "unknown") return state;
  return "cancelled";
}

export function isRoundCompleted(roundFixtures: Array<{ status?: OpenFootballGame["status"] }>) {
  return roundFixtures.every((fixture) => isCompletedFixture(fixture.status) || isNonPlayableFixture(fixture.status));
}

export type CompetitionRoundResolution<T> = {
  currentRound: T | null;
  nextRound: T | null;
  followingRound: T | null;
  currentFixtures: T extends { games: infer G } ? G : never;
  nextFixtures: T extends { games: infer G } ? G : never;
};

function isActiveFixture(game: OpenFootballGame, now: Date | string) {
  return isActiveFixtureState(classifyFixture(game, now));
}

/**
 * Resolves the active round sequence from explicit matchday metadata. A round
 * is selected from real chronological activity. Old postponed/rescheduled
 * matchdays remain in the source record without blocking a newer matchday.
 */
export function resolveCompetitionRounds<
  T extends { round: number; games: Array<OpenFootballGame & { status?: OpenFootballGame["status"] }> }
>(leagueFixtures: T[], now: Date | string = new Date()): CompetitionRoundResolution<T> {
  const ordered = [...leagueFixtures].sort((left, right) => left.round - right.round);
  const liveIndex = ordered.findIndex((round) =>
    round.games.some((game) => getMatchLifecycleStatus(game, now) === "live")
  );
  const activeRounds = ordered
    .map((round, index) => ({
      index,
      firstKickoff: Math.min(...round.games
        .filter((game) => isActiveFixture(game, now))
        .map((game) => fixtureKickoffMillis(game) ?? Number.MAX_SAFE_INTEGER)),
      hasActive: round.games.some((game) => isActiveFixture(game, now)),
    }))
    .filter((entry) => entry.hasActive)
    .sort((left, right) => left.firstKickoff - right.firstKickoff || ordered[left.index].round - ordered[right.index].round);
  const currentIndex = liveIndex >= 0 ? liveIndex : (activeRounds[0]?.index ?? -1);
  const currentRound = currentIndex >= 0 ? ordered[currentIndex] : null;

  const laterActiveRounds = currentIndex >= 0
    ? ordered.slice(currentIndex + 1).filter((round) => round.games.some((game) => isActiveFixture(game, now)))
    : [];
  const nextRound = laterActiveRounds[0] ?? null;
  const followingRound = laterActiveRounds[1] ?? null;

  return {
    currentRound,
    nextRound,
    followingRound,
    currentFixtures: (currentRound?.games.filter((game) => isActiveFixture(game, now)) ?? []) as CompetitionRoundResolution<T>["currentFixtures"],
    nextFixtures: (nextRound?.games.filter((game) => isActiveFixture(game, now)) ?? []) as CompetitionRoundResolution<T>["nextFixtures"],
  };
}

export function getCurrentRound<T extends { round: number; games: Array<OpenFootballGame & { status?: OpenFootballGame["status"] }> }>(
  leagueFixtures: T[],
  now: Date | string = new Date()
) {
  return resolveCompetitionRounds(leagueFixtures, now).currentRound;
}
