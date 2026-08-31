import type { ReactNode } from "react";
import Link from "next/link";
import { MatchPreview } from "@/types";
import { HomeMatchCard } from "@/components/HomeMatchCard";
import { LeagueBadge } from "@/components/LeagueBadge";
import { leagues } from "@/data/leagues";
import {
  filterCompletedPredictions,
  filterTodaysPublishedPredictions,
  filterTomorrowPublishedPredictions,
  findOmittedCurrentPredictions,
  localTodayISO,
  localTomorrowISO,
  selectLatestPublishedPredictions,
  validateHomePredictionSelection,
} from "@/lib/match-feed";
import { getMatchDisplayTime } from "@/lib/match-time";
import { evaluatePredictionSettlement } from "@/lib/prediction-results";

export function HomePredictionFeed({
  matches,
  beforeHistory,
}: {
  matches: MatchPreview[];
  beforeHistory?: ReactNode;
}) {
  const now = new Date();
  const today = localTodayISO(now);
  const tomorrow = localTomorrowISO(today);
  const todayMatches = filterTodaysPublishedPredictions(matches, today, now);
  const tomorrowMatches = filterTomorrowPublishedPredictions(matches, today);
  const latestMatches = selectLatestPublishedPredictions(matches, today, 10);
  const omittedMatches = findOmittedCurrentPredictions(matches, today);
  const historyMatches = filterCompletedPredictions(matches, now).slice(0, 10);

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
        <div className="container home-today-layout">
          <aside className="home-leagues-sidebar" aria-label="Prediction leagues">
            <div className="home-leagues-sidebar__heading">
              <span className="eyebrow">Competitions</span>
              <h2>Top Prediction Leagues</h2>
            </div>

            <div className="home-leagues-sidebar__list">
              {leagues.map((league) => (
                <Link key={league.slug} href={`/league/${league.slug}/`} className="home-league-link">
                  <LeagueBadge slug={league.slug} short={league.short} size="sm" />
                  <span>{league.name}</span>
                </Link>
              ))}
            </div>
          </aside>

          <div className="home-today-main">
            <div className="section-heading section-heading--compact">
              <div className="heading-with-icon">
                <span className="section-icon" aria-hidden="true">✓</span>

                <div>
                  <span className="eyebrow">Today</span>

                  <div className="today-title-row">
                    <h2>Today&apos;s Football Predictions</h2>

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
                  <HomeMatchCard key={match.id} match={match} now={now} />
                ))}
              </div>
            ) : (
              <div className="empty-state empty-state--compact today-empty-state">
                <strong>Next predictions available</strong>
                <p>Explore tomorrow and upcoming match analyses.</p>
                <a className="today-empty-state__cta" href="#tomorrow">
                  View upcoming predictions
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section--compact" id="tomorrow">
          <div className="container">
            <div className="section-heading section-heading--compact">
              <div className="heading-with-icon">
                <span className="section-icon" aria-hidden="true">↘</span>

                <div>
                  <span className="eyebrow">Tomorrow</span>
                  <div className="today-title-row">
                    <h2>Tomorrow&apos;s Football Predictions</h2>
                    {tomorrowMatches.length > 0 ? <span className="today-count">{tomorrowMatches.length}</span> : null}
                  </div>
                </div>
              </div>

              <span className="date-chip">{tomorrow}</span>
            </div>

            {tomorrowMatches.length > 0 ? <div className="match-grid match-grid--compact">
              {tomorrowMatches.map((match) => (
                <HomeMatchCard key={match.id} match={match} now={now} />
              ))}
            </div> : (
              <div className="empty-state empty-state--compact">
                <strong>No published matches are currently available for tomorrow.</strong>
                <p>See the upcoming football predictions below.</p>
                <a href="#upcoming">View upcoming predictions</a>
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
                <span className="eyebrow">Upcoming</span>
                <h2>Upcoming Football Predictions</h2>
              </div>
            </div>
          </div>

          {latestMatches.length > 0 ? (
            <div className="latest-list">
              {latestMatches.map((match) => {
                const league = leagues.find(
                  (item) => item.slug === match.league
                );
                const kickoff = getMatchDisplayTime(match);

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
                      <span>{["postponed", "canceled"].includes(match.fixtureStatus ?? "") ? match.fixtureStatus!.toUpperCase() : "Prediction available"}</span>
                    </div>

                    <div className="latest-date">
                      <span>{match.date || "TBD"}</span>
                      <small>{kickoff.display}</small>
                    </div>

                    <span className="latest-arrow">›</span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="empty-state empty-state--compact">
              <strong>No upcoming predictions available.</strong>
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
              <div><span className="eyebrow">Results</span><h2>Latest Football Prediction Results</h2></div>
            </div>
          </div>
          {historyMatches.length > 0 ? (
            <div className="history-list">
              {historyMatches.map((match) => {
                const settlement = evaluatePredictionSettlement(match);
                const resultLabel = match.homeScore == null || match.awayScore == null
                  ? "WAITING SCORE"
                  : settlement.pendingReason === "EXECUTION_DATA_MISSING"
                    ? "ENTRY NOT RECORDED"
                    : settlement.pendingReason === "MARKET_DATA_MISSING"
                      ? "AWAITING STATS"
                      : (match.betResult ?? "pending").replace("-", " ").toUpperCase();
                return <a href={`/match/${match.slug}/`} className="history-row" key={match.id}>
                  <div>
                    <strong>{match.homeTeam} vs {match.awayTeam}</strong>
                    <span>{leagues.find((league) => league.slug === match.league)?.name ?? match.league} · {match.date} · {match.mainPrediction}</span>
                  </div>
                  <span className="history-score">
                    {match.homeScore != null && match.awayScore != null ? `${match.homeScore}–${match.awayScore}` : "WAITING SCORE"}
                  </span>
                  <span className="history-odds">Odds {match.odds ?? "—"}</span>
                  <b className={`bet-result bet-result--${match.homeScore == null || match.awayScore == null ? "awaiting-data" : match.betResult ?? "pending"}`}>
                    {resultLabel}
                  </b>
                </a>
              })}
            </div>
          ) : <div className="empty-state empty-state--compact"><strong>No completed predictions yet.</strong></div>}
          <p className="history-all-link"><Link href="/results/">View all results</Link></p>
        </div>
      </section>
    </>
  );
}
