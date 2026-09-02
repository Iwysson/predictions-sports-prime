"use client";

import { LeagueSlug } from "@/types";

function formatLeagueLocalDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    return {
      display: `${date} · ${time}`,
      ariaLabel: `${date} at ${time}`,
      sublabel: "League local time",
    };
  }

  const displayDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));

  const displayTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  return {
    display: `${displayDate} · ${displayTime}`,
    ariaLabel: `${displayDate} at ${displayTime}, league local time`,
    sublabel: "League local time",
  };
}

export function LiveMatchMeta({
  league: _league,
  homeTeam: _homeTeam,
  awayTeam: _awayTeam,
  fallbackRound,
  fallbackDate,
  fallbackTime,
  venue,
}: {
  league: LeagueSlug;
  homeTeam: string;
  awayTeam: string;
  fallbackRound: string;
  fallbackDate: string;
  fallbackTime: string;
  venue?: string;
}) {
  // The fixture pipeline already stores match.date/match.time in league-local time.
  // Rendering them directly prevents a second timezone conversion in the header.
  const fallback = formatLeagueLocalDateTime(fallbackDate, fallbackTime);

  return (
    <>
      <small>{fallbackRound}</small>
      <div className="compact-match-meta">
        <span aria-label={fallback.ariaLabel}>{fallback.display}</span>
        <small>{fallback.sublabel}</small>
        {venue ? <span>{venue}</span> : null}
      </div>
    </>
  );
}
