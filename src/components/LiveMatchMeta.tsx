"use client";

import { useEffect, useState } from "react";
import { LeagueSlug } from "@/types";
import {
  findFixtureByTeams,
  loadLeagueSeason,
} from "@/lib/openfootball";
import { selectFixtureKickoff } from "@/lib/fixture-status";

type State = {
  round: string;
  date: string;
  time: string;
  state: "loading" | "live" | "fallback";
};

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
  const [data, setData] = useState<State>({
    round: fallbackRound,
    date: fallbackDate,
    time: fallbackTime,
    state: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    loadLeagueSeason(league)
      .then((rounds) => {
        const fixture = findFixtureByTeams(
          rounds,
          homeTeam,
          awayTeam
        );

        if (!fixture) {
          throw new Error("Fixture not found.");
        }

        if (!cancelled) {
          const kickoff = selectFixtureKickoff({
            fallbackDate,
            fallbackTime,
            providerDate: fixture.date,
            providerTime: fixture.time,
            providerIsAuthoritative: !fallbackDate && (!fallbackTime || fallbackTime === "TBD"),
          });
          setData({
            round: `Matchday ${fixture.round}`,
            date: kickoff.date,
            time: kickoff.time,
            state: "live",
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData({
            round: fallbackRound,
            date: fallbackDate,
            time: fallbackTime,
            state: "fallback",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    awayTeam,
    fallbackDate,
    fallbackRound,
    fallbackTime,
    homeTeam,
    league,
  ]);

  return (
    <>
      <small>
        {data.state === "loading"
          ? "Loading match details..."
          : data.round}
      </small>

      <div className="compact-match-meta">
        {data.date ? <span>{data.date}</span> : null}
        <span>{data.time || "TBD"}</span>
        {venue ? <span>{venue}</span> : null}
      </div>
    </>
  );
}
