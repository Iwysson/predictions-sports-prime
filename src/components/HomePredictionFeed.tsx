"use client";

import { useEffect, useMemo, useState } from "react";
import { MatchPreview } from "@/types";
import { MatchCard } from "@/components/MatchCard";
import { LeagueBadge } from "@/components/LeagueBadge";
import { leagues } from "@/data/leagues";
import { leaguesBySlug } from "@/data/leagues";
import {
  findFixtureByTeams,
  loadLeagueSeason,
} from "@/lib/openfootball";
import {
  filterFuturePublishedPredictions,
  filterTodaysPublishedPredictions,
  localTodayISO,
} from "@/lib/match-feed";
import { useI18n } from "@/i18n/I18nProvider";

async function hydrateMatch(match: MatchPreview): Promise<MatchPreview> {
  try {
    const rounds = await loadLeagueSeason(
      match.league
    );

    const fixture = findFixtureByTeams(
      rounds,
      match.homeTeam,
      match.awayTeam
    );

    if (!fixture) {
      return match;
    }

    return {
      ...match,
      round: `Matchday ${fixture.round}`,
      date: match.date || fixture.date,
      time: fixture.time,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
    };
  } catch {
    return match;
  }
}

export function HomePredictionFeed({
  matches,
}: {
  matches: MatchPreview[];
}) {
  const [hydrated, setHydrated] = useState(matches);
  const [ready, setReady] = useState(false);
  const { t } = useI18n();
  const today = localTodayISO();

  useEffect(() => {
    let cancelled = false;

    Promise.all(matches.map(hydrateMatch))
      .then((items) => {
        if (!cancelled) {
          setHydrated(items);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHydrated(matches);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [matches]);

  const todayMatches = useMemo(
    () =>
      ready
        ? filterTodaysPublishedPredictions(hydrated, today)
        : [],
    [hydrated, ready, today]
  );

  const latestMatches = useMemo(
    () =>
      ready
        ? filterFuturePublishedPredictions(hydrated, today).slice(0, 5)
        : [],
    [hydrated, ready, today]
  );

  const otherLeagueMatches = useMemo(
    () => ready
      ? hydrated.filter((match) =>
          match.status === "published" &&
          !leaguesBySlug[match.league].featured
        )
      : [],
    [hydrated, ready]
  );

  return (
    <>
      <section className="section section--compact" id="today">
        <div className="container">
          <div className="section-heading section-heading--compact">
            <div className="heading-with-icon">
              <span className="section-icon">▣</span>

              <div>
                <span className="eyebrow">{t("today")}</span>

                <div className="today-title-row">
                  <h1>{t("todaysPredictions")}</h1>

                  {ready && todayMatches.length > 0 ? (
                    <span className="today-count">
                      {todayMatches.length}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <span className="date-chip">{today}</span>
          </div>

          {!ready ? (
            <div className="home-feed-loading">
              {t("checkingToday")}
            </div>
          ) : todayMatches.length > 0 ? (
            <div className="match-grid match-grid--compact">
              {todayMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state--compact">
              <strong>{t("noPredictionsToday")}</strong>
            </div>
          )}
        </div>
      </section>

      <section className="section section--compact" id="upcoming">
        <div className="container">
          <div className="section-heading section-heading--compact">
            <div className="heading-with-icon">
              <span className="section-icon">↗</span>

              <div>
                <span className="eyebrow">{t("upcoming")}</span>
                <h2>{t("latestPredictions")}</h2>
              </div>
            </div>
          </div>

          {!ready ? (
            <div className="home-feed-loading">
              {t("loadingPredictions")}
            </div>
          ) : latestMatches.length > 0 ? (
            <div className="latest-list">
              {latestMatches.map((match) => {
                const league = leagues.find(
                  (item) => item.slug === match.league
                );

                return (
                  <a
                    href={`/match/${match.slug}/`}
                    className="latest-row"
                    key={match.id}
                  >
                    <div className="latest-league">
                      <LeagueBadge
                        slug={match.league}
                        short={league?.short ?? "•"}
                        size="sm"
                      />

                      <strong>
                        {league?.name ?? match.league}
                      </strong>
                    </div>

                    <div className="latest-match">
                      <strong>
                        {match.homeTeam} vs {match.awayTeam}
                      </strong>
                      <span>{t("predictionAvailable")}</span>
                    </div>

                    <div className="latest-date">
                      <span>{match.date || "TBD"}</span>
                      <small>{match.time || "TBD"}</small>
                    </div>

                    <span className="latest-arrow">›</span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="empty-state empty-state--compact">
              <strong>{t("noUpcomingPredictions")}</strong>
            </div>
          )}
        </div>
      </section>

      <section className="section section--compact section--muted" id="other-leagues">
        <div className="container">
          <div className="section-heading section-heading--compact">
            <div className="heading-with-icon">
              <span className="section-icon">+</span>
              <div>
                <span className="eyebrow">Selected competitions</span>
                <h2>Other Leagues</h2>
              </div>
            </div>
          </div>

          {otherLeagueMatches.length > 0 ? (
            <div className="match-grid match-grid--compact">
              {otherLeagueMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state--compact">
              <strong>No published predictions yet.</strong>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
