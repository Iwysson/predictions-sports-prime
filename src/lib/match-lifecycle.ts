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

export function getCurrentRound<T extends { round: number; games: Array<OpenFootballGame & { status?: OpenFootballGame["status"] }> }>(
  leagueFixtures: T[],
  now: Date | string = new Date()
) {
  const ordered = [...leagueFixtures].sort((a, b) => a.round - b.round);

  const liveRound = ordered.find((round) => round.games.some((game) => getMatchLifecycleStatus(game, now) === "live"));
  if (liveRound) return liveRound;

  const activeRound = ordered.find((round) => round.games.some((game) => {
    const lifecycle = getMatchLifecycleStatus(game, now);
    return lifecycle === "upcoming" || lifecycle === "unknown";
  }));
  if (activeRound) return activeRound;

  const nextFuture = ordered.find((round) =>
    round.games.some((game) => {
      const lifecycle = getMatchLifecycleStatus(game, now);
      return lifecycle === "upcoming" || lifecycle === "live";
    })
  );
  return nextFuture ?? null;
}
