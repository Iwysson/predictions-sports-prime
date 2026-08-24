import type { MatchPreview } from "@/types";
import { isCompletedFixture, isHistoryEligibleFixture, isNonPlayableFixture } from "@/lib/fixture-status";

export type HomeTemporalBucket = "today" | "tomorrow" | "upcoming" | "historical" | "none";

export function localTodayISO() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${value.year}-${value.month}-${value.day}`;
}

export function localTomorrowISO(today = localTodayISO()) {
  const date = new Date(`${today}T00:00:00-03:00`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function resolveHomeTemporalBucket(match: MatchPreview, today = localTodayISO()): HomeTemporalBucket {
  if (match.status !== "published") return "none";
  if (isCompletedFixture(match.fixtureStatus) || isHistoryEligibleFixture({
    status: match.fixtureStatus,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  })) {
    return "historical";
  }
  if (isNonPlayableFixture(match.fixtureStatus)) return "none";
  if (!match.date) return "upcoming";
  if (match.date === today) return "today";
  if (match.date === localTomorrowISO(today)) return "tomorrow";
  if (match.date > localTomorrowISO(today)) return "upcoming";
  return "none";
}

function timeToMinutes(time: string) {
  if (!/^\d{1,2}:\d{2}$/.test(time)) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function sortMatchesByKickoff(matches: MatchPreview[]) {
  return [...matches].sort((a, b) => {
    const dateCompare = (a.date || "9999-99-99").localeCompare(
      b.date || "9999-99-99"
    );

    if (dateCompare !== 0) {
      return dateCompare;
    }

    const timeCompare = timeToMinutes(a.time) - timeToMinutes(b.time);

    if (timeCompare !== 0) {
      return timeCompare;
    }

    return a.slug.localeCompare(b.slug);
  });
}

function uniqueMatches(matches: MatchPreview[]) {
  const seen = new Set<string>();

  return matches.filter((match) => {
    const key = `${match.league}:${match.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function filterTodaysPublishedPredictions(
  matches: MatchPreview[],
  today = localTodayISO()
) {
  return sortMatchesByKickoff(
    uniqueMatches(matches).filter(
      (match) =>
        match.status === "published" &&
        resolveHomeTemporalBucket(match, today) === "today"
    )
  );
}

export function filterFuturePublishedPredictions(
  matches: MatchPreview[],
  today = localTodayISO()
) {
  return sortMatchesByKickoff(
    uniqueMatches(matches).filter(
      (match) =>
        resolveHomeTemporalBucket(match, today) === "upcoming"
    )
  );
}

export function filterTomorrowPublishedPredictions(
  matches: MatchPreview[],
  today = localTodayISO()
) {
  return sortMatchesByKickoff(
    uniqueMatches(matches).filter(
      (match) =>
        resolveHomeTemporalBucket(match, today) === "tomorrow"
    )
  );
}

export function selectLatestPublishedPredictions(
  matches: MatchPreview[],
  today = localTodayISO(),
  limit = 10
) {
  return filterFuturePublishedPredictions(matches, today).slice(0, limit);
}

export function validateHomePredictionSelection(
  matches: MatchPreview[],
  todayMatches: MatchPreview[],
  latestMatches: MatchPreview[],
  today = localTodayISO(),
  limit = 10
) {
  const errors: string[] = [];
  const todaySlugs = new Set(todayMatches.map((match) => match.slug));
  const expectedLatest = selectLatestPublishedPredictions(
    matches,
    today,
    limit
  );

  if (
    todayMatches.some(
      (match) => match.status !== "published" || match.date !== today
    )
  ) {
    errors.push("Today contains a non-current or unpublished prediction.");
  }

  if (latestMatches.some((match) => todaySlugs.has(match.slug))) {
    errors.push("Latest duplicates a prediction from Today.");
  }

  if (latestMatches.length > limit) {
    errors.push(`Latest contains more than ${limit} predictions.`);
  }

  const actualSlugs = latestMatches.map((match) => match.slug);
  const expectedSlugs = expectedLatest.map((match) => match.slug);

  if (actualSlugs.join("|") !== expectedSlugs.join("|")) {
    errors.push(
      "Latest is not the canonical chronological published selection."
    );
  }

  const firstUnknownDate = latestMatches.findIndex((match) => !match.date);
  if (
    firstUnknownDate >= 0 &&
    latestMatches.slice(firstUnknownDate).some((match) => Boolean(match.date))
  ) {
    errors.push("An unknown-date prediction precedes a dated prediction.");
  }

  return errors;
}

export function filterPastPublishedPredictions(
  matches: MatchPreview[],
  today = localTodayISO()
) {
  return sortMatchesByKickoff(
    uniqueMatches(matches).filter(
      (match) =>
        match.status === "published" &&
        Boolean(match.date) &&
        match.date < today
    )
  );
}

export function filterCompletedPredictions(matches: MatchPreview[]) {
  return sortMatchesByKickoff(
    uniqueMatches(matches).filter(
      (match) =>
        match.status === "published" &&
        isHistoryEligibleFixture({
          status: match.fixtureStatus,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
        })
    )
  ).reverse();
}

export function findOmittedCurrentPredictions(
  matches: MatchPreview[],
  today = localTodayISO()
) {
  const eligible = new Set([
    ...filterTodaysPublishedPredictions(matches, today),
    ...filterTomorrowPublishedPredictions(matches, today),
    ...filterFuturePublishedPredictions(matches, today),
  ].map((match) => match.slug));

  return uniqueMatches(matches).filter(
    (match) =>
      match.status === "published" &&
      resolveHomeTemporalBucket(match, today) === "upcoming" &&
      !eligible.has(match.slug)
  );
}
