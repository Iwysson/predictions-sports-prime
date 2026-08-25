import type { FixtureStatus } from "@/lib/fixture-status";

export const DEFAULT_STALE_SCHEDULE_GRACE_MS = 4 * 60 * 60 * 1000;
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
};

export function fixtureKickoffMillis(fixture: FixtureStateInput) {
  if (fixture.kickoffUtc && Number.isFinite(Date.parse(fixture.kickoffUtc))) {
    return Date.parse(fixture.kickoffUtc);
  }
  if (!fixture.date || !/^\d{4}-\d{2}-\d{2}$/.test(fixture.date)) return null;
  if (!fixture.time || !/^\d{1,2}:\d{2}$/.test(fixture.time)) return null;
  const parsed = Date.parse(`${fixture.date}T${fixture.time}:00Z`);
  return Number.isFinite(parsed) ? parsed : null;
}

export function classifyFixture(
  fixture: FixtureStateInput,
  now: Date | string = new Date(),
  staleGraceMs = DEFAULT_STALE_SCHEDULE_GRACE_MS
): CanonicalFixtureState {
  const status = fixture.fixtureStatus ?? fixture.status;
  if (status === "in-progress") return "live";
  if (status === "completed" || status === "awarded") return "completed";
  if (status === "postponed") return "postponed";
  if (status === "canceled" || status === "cancelled") return "cancelled";
  if (status === "suspended") return "suspended";
  if (status === "abandoned") return "abandoned";

  const kickoff = fixtureKickoffMillis(fixture);
  if (status === "scheduled" || status === "rescheduled" || !status) {
    if (kickoff === null) return status === "rescheduled" ? "rescheduled" : status ? "scheduled" : "unknown";
    const current = new Date(now).valueOf();
    if (kickoff < current - staleGraceMs) return "stale-schedule";
    return status === "rescheduled" ? "rescheduled" : "scheduled";
  }
  return "unknown";
}

export function isActiveFixtureState(state: CanonicalFixtureState) {
  return state === "scheduled" || state === "rescheduled" || state === "live";
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
  if (fixture.kickoffUtc && Number.isFinite(Date.parse(fixture.kickoffUtc))) {
    return dateInTimeZone(fixture.kickoffUtc, timeZone);
  }
  return fixture.date || null;
}
