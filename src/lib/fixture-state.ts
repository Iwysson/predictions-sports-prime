import type { FixtureStatus } from "@/lib/fixture-status";
import type { LeagueSlug } from "@/types";
import { leaguesBySlug } from "@/data/leagues";

// If every provider misses a state transition, move the fixture out of the
// active feed 110 minutes after kickoff and wait for authoritative result data.
export const DEFAULT_STALE_SCHEDULE_GRACE_MS = 110 * 60 * 1000;
export const SITE_FIXTURE_TIME_ZONE = "America/Fortaleza";

export type CanonicalFixtureState =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "cancelled"
  | "suspended"
  | "abandoned"
  | "rescheduled"
  | "stale-schedule"
  | "unknown";

export type FixtureStateInput = {
  status?: FixtureStatus | string;
  fixtureStatus?: FixtureStatus | string;
  kickoffUtc?: string;
  date?: string;
  time?: string;
  timeConfirmed?: boolean;
  league?: LeagueSlug;
};

function localWallClockToUtcMillis(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return null;

  let utcMs = Date.UTC(year, month - 1, day, hour, minute);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(utcMs));
    const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const representedMs = Date.UTC(
      Number(fields.year), Number(fields.month) - 1, Number(fields.day),
      Number(fields.hour), Number(fields.minute),
    );
    utcMs += Date.UTC(year, month - 1, day, hour, minute) - representedMs;
  }
  return utcMs;
}

export function fixtureKickoffMillis(fixture: FixtureStateInput) {
  if (fixture.kickoffUtc && Number.isFinite(Date.parse(fixture.kickoffUtc))) {
    return Date.parse(fixture.kickoffUtc);
  }
  if (!fixture.date || !/^\d{4}-\d{2}-\d{2}$/.test(fixture.date)) return null;
  if (!fixture.time || !/^\d{1,2}:\d{2}$/.test(fixture.time)) return null;

  const competitionTimezone = fixture.league ? leaguesBySlug[fixture.league]?.timezone : undefined;
  if (competitionTimezone) return localWallClockToUtcMillis(fixture.date, fixture.time, competitionTimezone);

  const parsed = Date.parse(`${fixture.date}T${fixture.time}:00Z`);
  return Number.isFinite(parsed) ? parsed : null;
}

export function classifyFixture(
  fixture: FixtureStateInput,
  now: Date | string = new Date(),
  staleGraceMs = DEFAULT_STALE_SCHEDULE_GRACE_MS
): CanonicalFixtureState {
  const status = fixture.fixtureStatus ?? fixture.status;
  if (status === "completed" || status === "awarded") return "completed";
  if (status === "postponed") return "postponed";
  if (status === "canceled" || status === "cancelled") return "cancelled";
  if (status === "suspended") return "suspended";
  if (status === "abandoned") return "abandoned";

  const kickoff = fixtureKickoffMillis(fixture);
  if (status === "in-progress") {
    if (kickoff !== null && kickoff <= new Date(now).valueOf() - staleGraceMs) return "stale-schedule";
    return "live";
  }
  if (status === "scheduled" || status === "rescheduled" || !status) {
    if (kickoff === null) return status === "rescheduled" ? "rescheduled" : status ? "scheduled" : "unknown";
    const current = new Date(now).valueOf();
    if (kickoff <= current - staleGraceMs) return "stale-schedule";
    return status === "rescheduled" ? "rescheduled" : "scheduled";
  }
  return "unknown";
}

export function isActiveFixtureState(state: CanonicalFixtureState) {
  return state === "scheduled" || state === "rescheduled" || state === "live";
}

export function isFixtureLiveNow(fixture: FixtureStateInput, now: Date | string = new Date()) {
  const state = classifyFixture(fixture, now);
  if (state === "completed" || state === "stale-schedule") return false;
  const kickoff = fixtureKickoffMillis(fixture);
  if (kickoff === null) return state === "live";
  const elapsed = new Date(now).valueOf() - kickoff;
  return elapsed >= 0 && elapsed < DEFAULT_STALE_SCHEDULE_GRACE_MS;
}

export function isWaitingForFixtureData(fixture: FixtureStateInput, now: Date | string = new Date()) {
  if (classifyFixture(fixture, now) === "completed") return false;
  const kickoff = fixtureKickoffMillis(fixture);
  return kickoff !== null && new Date(now).valueOf() - kickoff >= DEFAULT_STALE_SCHEDULE_GRACE_MS;
}

export function isFixtureHistoryEligible(fixture: FixtureStateInput, now: Date | string = new Date()) {
  const state = classifyFixture(fixture, now);
  return state === "completed" || state === "stale-schedule";
}

export function isFutureFixture(
  fixture: FixtureStateInput,
  now: Date | string = new Date(),
  staleGraceMs = DEFAULT_STALE_SCHEDULE_GRACE_MS
) {
  const state = classifyFixture(fixture, now, staleGraceMs);
  if (state !== "scheduled" && state !== "rescheduled") return false;
  const kickoff = fixtureKickoffMillis(fixture);
  return kickoff === null || kickoff > new Date(now).valueOf();
}

export function dateInTimeZone(value: Date | string, timeZone = SITE_FIXTURE_TIME_ZONE) {
  const date = value instanceof Date ? value : new Date(value);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${fields.year}-${fields.month}-${fields.day}`;
}

export function fixtureDateInTimeZone(fixture: FixtureStateInput, timeZone = SITE_FIXTURE_TIME_ZONE) {
  const kickoff = fixtureKickoffMillis(fixture);
  if (kickoff !== null) return dateInTimeZone(new Date(kickoff), timeZone);
  return fixture.date || null;
}
