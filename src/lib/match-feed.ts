import { Match } from "@/types";

export function localTodayISO() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function timeToMinutes(time: string) {
  if (!/^\d{1,2}:\d{2}$/.test(time)) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function sortMatchesByKickoff(matches: Match[]) {
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

function uniqueMatches(matches: Match[]) {
  const seen = new Set<string>();

  return matches.filter((match) => {
    const key = `${match.league}:${match.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function filterTodaysPublishedPredictions(
  matches: Match[],
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
  matches: Match[],
  today = localTodayISO()
) {
  return sortMatchesByKickoff(
    uniqueMatches(matches).filter(
      (match) =>
        match.status === "published" &&
        Boolean(match.date) &&
        match.date >= today
    )
  );
}
