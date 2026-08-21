"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MatchPreview } from "@/types";
import { MatchCard } from "@/components/MatchCard";
import { LeagueBadge } from "@/components/LeagueBadge";
import { leagues } from "@/data/leagues";
import {
  filterTodaysPublishedPredictions,
  filterCompletedPredictions,
  findOmittedCurrentPredictions,
  localTodayISO,
  selectLatestPublishedPredictions,
  validateHomePredictionSelection,
} from "@/lib/match-feed";
import { useI18n } from "@/i18n/I18nProvider";
import { hydratePredictions } from "@/lib/live-predictions";
import { loadDailyLeagueFixtures, loadLeagueSeason, teamNamesMatch, type OpenFootballGame } from "@/lib/openfootball";
import { isCompletedFixture, isLiveFixture, isNonPlayableFixture, isPlayableUpcoming } from "@/lib/fixture-status";
import Link from "next/link";

export function HomePredictionFeed({
  matches,
  beforeHistory,
}: {
  matches: MatchPreview[];
  beforeHistory?: ReactNode;
}) {
  const { t } = useI18n();
  const today = localTodayISO();
  const [liveMatches, setLiveMatches] = useState(matches);
  const [todayFixtures, setTodayFixtures] = useState<MatchPreview[]>([]);

  useEffect(() => {
    let cancelled = false;

    // Static exports cannot change after deployment. Refresh fixture results in
    // the browser so every published prediction moves to History automatically.
    const refreshResults = () => {
      hydratePredictions(matches, { forceRefresh: true }).then((hydrated) => {
        if (!cancelled) setLiveMatches(hydrated);
      });
    };

    refreshResults();
    const refreshTimer = window.setInterval(refreshResults, 60_000);

    Promise.allSettled(leagues.map(async (league) => {
      try {
        return {
          league: league.slug,
          games: await loadDailyLeagueFixtures(league.slug, today),
        };
      } catch {
        const rounds = await loadLeagueSeason(league.slug);
        return {
          league: league.slug,
          games: rounds.flatMap((round) => round.games),
        };
      }
    })).then((seasons) => {
      if (cancelled) return;
      const fixtures = seasons.flatMap((season) => {
        if (season.status !== "fulfilled") return [];
        const { league, games } = season.value;
        return games
          .filter(
            (game) =>
              game.date === today &&
              (isPlayableUpcoming(game.status) || isLiveFixture(game.status))
          )
          .map((game) => toTodayFixture(league, game, matches));
      });
      setTodayFixtures(sortTodayFixtures(
        fixtures.filter((fixture) => fixture.status === "published")
      ));
    });

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [matches, today]);

  const todayMatches = useMemo(
    () => filterTodaysPublishedPredictions(liveMatches, today),
    [liveMatches, today]
  );

  const displayedTodayMatches = useMemo(() => {
    if (todayFixtures.length === 0) return todayMatches;

    return todayFixtures
      .map((fixture) => liveMatches.find(
        (match) =>
          match.league === fixture.league &&
          teamNamesMatch(match.homeTeam, fixture.homeTeam) &&
          teamNamesMatch(match.awayTeam, fixture.awayTeam)
      ) ?? fixture)
      .filter(
        (match) =>
          match.status === "published" &&
          !isCompletedFixture(match.fixtureStatus) &&
          !isNonPlayableFixture(match.fixtureStatus)
      );
  }, [liveMatches, todayFixtures, todayMatches]);

  const latestMatches = useMemo(
    () => selectLatestPublishedPredictions(liveMatches, today, 10),
    [liveMatches, today]
  );

  const omittedMatches = useMemo(
    () => findOmittedCurrentPredictions(liveMatches, today),
    [liveMatches, today]
  );

  const historyMatches = useMemo(
    () => filterCompletedPredictions(liveMatches).slice(0, 10),
    [liveMatches]
  );

  if (omittedMatches.length > 0) {
    throw new Error(
      `Published Home predictions omitted: ${omittedMatches.map((match) => match.slug).join(", ")}`
    );
  }

  const selectionErrors = validateHomePredictionSelection(
    liveMatches,
    todayMatches,
    latestMatches,
    today,
    10
  );

  if (selectionErrors.length > 0) {
    throw new Error(
      `Invalid Home prediction selection: ${selectionErrors.join(" ")}`
    );
  }

  return (
    <>
      <section className="section section--compact" id="today">
        <div className="container">
          <div className="section-heading section-heading--compact">
            <div className="heading-with-icon">
              <span className="section-icon" aria-hidden="true">✓</span>

              <div>
                <span className="eyebrow">{t("today")}</span>

                <div className="today-title-row">
                  <h1>{t("todaysPredictions")}</h1>

                  {displayedTodayMatches.length > 0 ? (
                    <span className="today-count">
                      {displayedTodayMatches.length}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <span className="date-chip">{today}</span>
          </div>

          {displayedTodayMatches.length > 0 ? (
            <div className="match-grid match-grid--compact">
              {displayedTodayMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state--compact today-empty-state">
              <strong>{t("nextPredictionsAvailable")}</strong>
              <p>{t("upcomingPredictionsPrompt")}</p>
              <a className="today-empty-state__cta" href="#upcoming">
                {t("viewUpcomingPredictions")}
              </a>
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
                <h2>{t("upcoming")} {t("predictions")}</h2>
              </div>
            </div>
          </div>

          {latestMatches.length > 0 ? (
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
                      <span>{["postponed", "canceled"].includes(match.fixtureStatus ?? "") ? match.fixtureStatus!.toUpperCase() : t("predictionAvailable")}</span>
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

      {beforeHistory}

      <section className="section section--compact" id="history">
        <div className="container">
          <div className="section-heading section-heading--compact">
            <div className="heading-with-icon">
              <span className="section-icon" aria-hidden="true">✓</span>
              <div><span className="eyebrow">Results</span><h2>Prediction History</h2></div>
            </div>
          </div>
          {historyMatches.length > 0 ? (
            <div className="history-list">
              {historyMatches.map((match) => (
                <a href={`/match/${match.slug}/`} className="history-row" key={match.id}>
                  <div>
                    <strong>{match.homeTeam} vs {match.awayTeam}</strong>
                    <span>{leagues.find((league) => league.slug === match.league)?.name ?? match.league} · {match.date} · {match.mainPrediction}</span>
                  </div>
                  <span className="history-score">
                    {match.homeScore}–{match.awayScore}
                  </span>
                  <span className="history-odds">Odds {match.odds ?? "—"}</span>
                  <b className={`bet-result bet-result--${match.betResult ?? "pending"}`}>
                    {(match.betResult ?? "pending").replace("-", " ").toUpperCase()}
                  </b>
                </a>
              ))}
            </div>
          ) : <div className="empty-state empty-state--compact"><strong>No completed predictions yet.</strong></div>}
          <p className="history-all-link"><Link href="/results/">View all results</Link></p>
        </div>
      </section>

    </>
  );
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toTodayFixture(
  league: MatchPreview["league"],
  game: OpenFootballGame,
  published: MatchPreview[]
): MatchPreview {
  const analysis = published.find(
    (match) =>
      match.league === league &&
      teamNamesMatch(match.homeTeam, game.homeTeam) &&
      teamNamesMatch(match.awayTeam, game.awayTeam)
  );
  if (analysis) {
    return {
      ...analysis,
      date: game.date,
      time: game.time,
      round: `Matchday ${game.round}`,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      fixtureStatus: game.status,
    };
  }
  const slug = `${slugify(game.homeTeam)}-vs-${slugify(game.awayTeam)}`;
  return {
    id: `today-${league}-${game.round}-${slug}`,
    slug,
    league,
    round: `Matchday ${game.round}`,
    homeTeam: game.homeTeam,
    awayTeam: game.awayTeam,
    date: game.date,
    time: game.time,
    status: "coming-soon",
    title: `${game.homeTeam} vs ${game.awayTeam}`,
    fixtureStatus: game.status,
  };
}

function sortTodayFixtures(fixtures: MatchPreview[]) {
  return [...fixtures].sort((left, right) =>
    left.time.localeCompare(right.time) || left.league.localeCompare(right.league)
  );
}
