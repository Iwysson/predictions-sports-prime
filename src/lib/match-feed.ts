import type { MatchPreview } from "@/types";

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

    return timeToMinutes(a.time) - timeToMinutes(b.time);
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
        Boolean(match.date) &&
        match.date === today
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
        match.status === "published" &&
        (!match.date || match.date > today)
    )
  );
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

export function findOmittedCurrentPredictions(
  matches: MatchPreview[],
  today = localTodayISO()
) {
  const eligible = new Set([
    ...filterTodaysPublishedPredictions(matches, today),
    ...filterFuturePublishedPredictions(matches, today),
  ].map((match) => match.slug));

  return uniqueMatches(matches).filter(
    (match) =>
      match.status === "published" &&
      (!match.date || match.date >= today) &&
      !eligible.has(match.slug)
  );
}
