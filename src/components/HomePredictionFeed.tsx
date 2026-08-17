"use client";

import { useMemo } from "react";
import { MatchPreview } from "@/types";
import { MatchCard } from "@/components/MatchCard";
import { LeagueBadge } from "@/components/LeagueBadge";
import { leagues } from "@/data/leagues";
import {
  filterTodaysPublishedPredictions,
  findOmittedCurrentPredictions,
  localTodayISO,
  selectLatestPublishedPredictions,
  validateHomePredictionSelection,
} from "@/lib/match-feed";
import { useI18n } from "@/i18n/I18nProvider";

export function HomePredictionFeed({
  matches,
}: {
  matches: MatchPreview[];
}) {
  const { t } = useI18n();
  const today = localTodayISO();

  const todayMatches = useMemo(
    () => filterTodaysPublishedPredictions(matches, today),
    [matches, today]
  );

  const latestMatches = useMemo(
    () => selectLatestPublishedPredictions(matches, today, 10),
    [matches, today]
  );

  const omittedMatches = useMemo(
    () => findOmittedCurrentPredictions(matches, today),
    [matches, today]
  );

  if (omittedMatches.length > 0) {
    throw new Error(
      `Published Home predictions omitted: ${omittedMatches.map((match) => match.slug).join(", ")}`
    );
  }

  const selectionErrors = validateHomePredictionSelection(
    matches,
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
              <span className="section-icon">▣</span>

              <div>
                <span className="eyebrow">{t("today")}</span>

                <div className="today-title-row">
                  <h1>{t("todaysPredictions")}</h1>

                  {todayMatches.length > 0 ? (
                    <span className="today-count">
                      {todayMatches.length}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <span className="date-chip">{today}</span>
          </div>

          {todayMatches.length > 0 ? (
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

    </>
  );
}
