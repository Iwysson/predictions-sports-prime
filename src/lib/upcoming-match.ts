import { isFutureFixture } from "@/lib/fixture-state";
import type { Match } from "@/types";
import { isRestrictedSearchIntentFixture } from "@/lib/match-search-intent";

export type UpcomingMatchInput = Pick<
  Match,
  "fixtureStatus" | "kickoffUtc" | "date" | "time" | "timeConfirmed"
>;

/** Single source of truth for optimizations that may only target pre-match pages. */
export function isUpcomingMatch(
  match: UpcomingMatchInput,
  now: Date | string = new Date()
) {
  return isFutureFixture({
    fixtureStatus: match.fixtureStatus,
    kickoffUtc: match.kickoffUtc,
    date: match.date,
    time: match.time,
    timeConfirmed: match.timeConfirmed,
  }, now);
}

/**
 * Single source of truth for the new international match-page expansion.
 * Legacy localized editorial routes deliberately bypass this rule.
 */
export function isInternationalMatchExpansionEligible(
  match: Match,
  now: Date | string = new Date()
) {
  const data = match.matchSeo;
  return isRestrictedSearchIntentFixture(match) || match.status === "published"
    && isUpcomingMatch(match, now)
    && Boolean(data && (data.lineups || data.availability || data.statistics));
}
