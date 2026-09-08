import { classifyFixture, isFutureFixture } from "@/lib/fixture-state";
import type { Match } from "@/types";

/** Pure, time-injectable lifecycle decision shared by routes and audits. */
export function getCanonicalMatchLifecycle(
  match: Pick<
    Match,
    "fixtureStatus" | "kickoffUtc" | "date" | "time" | "timeConfirmed"
  >,
  now: Date | string = new Date()
) {
  const fixture = {
    ...match,
    status: match.fixtureStatus ?? "scheduled",
  };
  return {
    state: classifyFixture(fixture, now),
    isPreMatch: isFutureFixture(fixture, now),
  };
}
