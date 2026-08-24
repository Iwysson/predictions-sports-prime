import type { OpenFootballRound, OpenFootballGame } from "@/lib/openfootball";
import { fixtureStatusCategory, isCompletedFixture, isLiveFixture, isNonPlayableFixture, isPlayableUpcoming } from "@/lib/fixture-status";

export type MatchLifecycleStatus = "upcoming" | "live" | "completed" | "postponed" | "cancelled" | "unknown";

export function getCurrentUtcTime(now: Date | string = new Date()) {
  return now instanceof Date ? new Date(now.toISOString()) : new Date(now);
}

function isValidDate(value: unknown) {
  if (typeof value !== "string") return false;
  return !Number.isNaN(Date.parse(value));
}

function kickoffToMillis(game: { date?: string; time?: string; kickoffUtc?: string }) {
  const kickoffUtc = game.kickoffUtc;
  const date = game.date;
  if (typeof kickoffUtc === "string" && isValidDate(kickoffUtc)) return Date.parse(kickoffUtc);
  if (typeof date === "string" && isValidDate(date)) {
    const time = typeof game.time === "string" && /^\d{2}:\d{2}$/.test(game.time) ? game.time : "12:00";
    return Date.parse(`${date}T${time}:00Z`);
  }
  return Number.NaN;
}

export function getMatchLifecycleStatus(match: {
  status?: OpenFootballGame["status"];
  kickoffUtc?: string;
  date?: string;
  time?: string;
}, now: Date | string = new Date()): MatchLifecycleStatus {
  const category = fixtureStatusCategory(match.status);
  if (category === "live") return "live";
  if (category === "completed") return "completed";
  if (match.status === "postponed") return "postponed";
  if (match.status === "canceled" || match.status === "abandoned" || match.status === "suspended" || match.status === "awarded") return "cancelled";

  const kickoff = kickoffToMillis(match);
  const current = getCurrentUtcTime(now).valueOf();
  if (Number.isFinite(kickoff) && kickoff > current) return "upcoming";
  if (Number.isFinite(kickoff) && kickoff <= current && isCompletedFixture(match.status)) return "completed";
  if (Number.isFinite(kickoff) && kickoff <= current && isLiveFixture(match.status)) return "live";
  if (Number.isFinite(kickoff) && kickoff <= current && isNonPlayableFixture(match.status)) return "cancelled";
  return Number.isFinite(kickoff) ? "upcoming" : "unknown";
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
  const lifecycle = getMatchLifecycleStatus(game, now);
  return lifecycle === "upcoming" || lifecycle === "live" || lifecycle === "unknown";
}

/**
 * Resolves the active round sequence from explicit matchday metadata. A round
 * only advances when every fixture is completed or non-playable; calendar
 * changes alone never promote it. Postponed fixtures follow the existing
 * non-playable policy and remain available in their factual source record.
 */
export function resolveCompetitionRounds<
  T extends { round: number; games: Array<OpenFootballGame & { status?: OpenFootballGame["status"] }> }
>(leagueFixtures: T[], now: Date | string = new Date()): CompetitionRoundResolution<T> {
  const ordered = [...leagueFixtures].sort((left, right) => left.round - right.round);
  const liveIndex = ordered.findIndex((round) =>
    round.games.some((game) => getMatchLifecycleStatus(game, now) === "live")
  );
  const currentIndex = liveIndex >= 0
    ? liveIndex
    : ordered.findIndex((round) => !isRoundCompleted(round.games));
  const currentRound = currentIndex >= 0 ? ordered[currentIndex] : null;

  const laterActiveRounds = currentIndex >= 0
    ? ordered.slice(currentIndex + 1).filter((round) => !isRoundCompleted(round.games))
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
