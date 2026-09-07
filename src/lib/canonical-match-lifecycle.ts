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
  return {
    state: classifyFixture(match, now),
    isPreMatch: isFutureFixture(match, now),
  };
}
