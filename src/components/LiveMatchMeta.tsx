"use client";

import { LeagueSlug } from "@/types";
import { getMatchDisplayTime } from "@/lib/match-time";

export function LiveMatchMeta({
  league,
  homeTeam,
  awayTeam,
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
  const fallback = getMatchDisplayTime({
    league,
    date: fallbackDate,
    time: fallbackTime,
  });

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
