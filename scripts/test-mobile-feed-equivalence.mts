// Equivalence tests: the Android app's mobile feed must never use a second, divergent
// definition of Today/Tomorrow/Upcoming (football) or "current slate" (NHL). This asserts
// that src/lib/mobile-feed-build.ts and mobile-feed-build-nhl-nfl.ts produce exactly the
// slug sets that calling the website's own functions (src/lib/match-feed.ts,
// src/data/nhl/slates.ts) directly would produce - for scheduled, live, postponed and
// completed fixtures, not just the easy "scheduled, future date" case.
import assert from "node:assert/strict";
import type { MatchPreview } from "../src/types/index.ts";
import {
  filterTodaysPublishedPredictions,
  filterTomorrowPublishedPredictions,
  filterFuturePublishedPredictions,
} from "../src/lib/match-feed.ts";
import { buildMobileFootballIndex } from "../src/lib/mobile-feed-build.ts";
import { resolveNhlSlate } from "../src/data/nhl/slates.ts";
import { SLATES } from "../src/data/nhl/slates.ts";
import { buildMobileNhlIndex } from "../src/lib/mobile-feed-build-nhl-nfl.ts";
import { getNhlTodayKey } from "../src/lib/nhl-day.ts";

const NOW = new Date("2026-10-10T12:00:00.000Z"); // -03:00 local date: 2026-10-10

const base = (overrides: Partial<MatchPreview>): MatchPreview => ({
  id: overrides.slug ?? "x",
  slug: "fixture",
  league: "premier-league",
  round: "Matchday 1",
  homeTeam: "Home",
  awayTeam: "Away",
  date: "2026-10-10",
  time: "15:00",
  status: "published",
  title: "Home vs Away",
  access: "free",
  analysisAccess: "free",
  predictionAccess: "free",
  ...overrides,
} as unknown as MatchPreview);

const matches: MatchPreview[] = [
  base({ slug: "today-scheduled", date: "2026-10-10", time: "18:00" }),
  base({ slug: "tomorrow-scheduled", date: "2026-10-11", time: "18:00" }),
  base({ slug: "upcoming-scheduled", date: "2026-10-15", time: "18:00" }),
  base({ slug: "today-live", date: "2026-10-10", time: "11:00", kickoffUtc: "2026-10-10T11:30:00Z", fixtureStatus: "in-progress", homeScore: 1, awayScore: 0 }),
  base({ slug: "today-postponed", date: "2026-10-10", time: "12:00", fixtureStatus: "postponed" }),
  base({ slug: "yesterday-completed", date: "2026-10-09", time: "15:00", fixtureStatus: "completed", homeScore: 2, awayScore: 1 }),
  base({ slug: "draft-not-published", date: "2026-10-10", time: "20:00", status: "coming-soon" }),
  base({ slug: "today-vip", date: "2026-10-10", time: "19:00", access: "vip", analysisAccess: "vip", predictionAccess: "vip" }),
];

function slugSet(list: { slug: string }[]) {
  return new Set(list.map((m) => m.slug));
}

{
  const directToday = slugSet(filterTodaysPublishedPredictions(matches, "2026-10-10", NOW));
  const directTomorrow = slugSet(filterTomorrowPublishedPredictions(matches, "2026-10-10", NOW));
  const directUpcoming = slugSet(filterFuturePublishedPredictions(matches, "2026-10-10", NOW));

  const index = buildMobileFootballIndex(matches, NOW);
  const appToday = slugSet([...index.free.today, ...index.vip.today]);
  const appTomorrow = slugSet([...index.free.tomorrow, ...index.vip.tomorrow]);
  const appUpcoming = slugSet([...index.free.upcoming, ...index.vip.upcoming]);

  assert.deepEqual(appToday, directToday, "mobile feed 'today' must equal the website's filterTodaysPublishedPredictions");
  assert.deepEqual(appTomorrow, directTomorrow, "mobile feed 'tomorrow' must equal the website's filterTomorrowPublishedPredictions");
  assert.deepEqual(appUpcoming, directUpcoming, "mobile feed 'upcoming' must equal the website's filterFuturePublishedPredictions");

  // Sanity: a live or postponed match on a current date still counts as "today" (not
  // silently dropped), a draft is excluded everywhere, and a VIP match is in the feed
  // (gated by its own badge) rather than missing entirely.
  assert.ok(directToday.has("today-live"), "a live match on today's date is still 'today'");
  assert.ok(!directToday.has("draft-not-published"), "an unpublished draft never appears");
  assert.ok(appToday.has("today-vip"), "a VIP match still appears in the feed, just tagged vip");
}

{
  // NHL: the app's single active slate must equal the website's own resolveNhlSlate
  // result for the exact same "today" - never a wider or narrower set of days.
  const todayKey = getNhlTodayKey(NOW);
  const direct = resolveNhlSlate(todayKey);
  const index = buildMobileNhlIndex(NOW);
  const appSlugs = slugSet([...index.free, ...index.vip]);
  const directSlugs = slugSet(direct?.matches ?? []);
  assert.deepEqual(appSlugs, directSlugs, "mobile NHL feed must equal resolveNhlSlate(todayKey) exactly");

  // A future slate (later dayKey than today) must not leak into the app before its day.
  const futureSlate = SLATES.find((s) => s.dayKey > todayKey);
  if (futureSlate) {
    for (const m of futureSlate.matches) {
      assert.ok(!appSlugs.has(m.slug), `a future NHL slate (${futureSlate.dayKey}) must not appear before its day starts`);
    }
  }
}

console.log("mobile feed equivalence tests passed");
