"use client";

import { Fragment, type ReactNode } from "react";
import { useClientNow } from "@/lib/use-client-now";
import { PublishedMatchDirectory } from "@/components/PublishedMatchDirectory";
import Link from "@/components/DocumentLink";
import { MatchPreview } from "@/types";
import { HomeMatchCard } from "@/components/HomeMatchCard";
import { LeagueBadge } from "@/components/LeagueBadge";
import { homeClubLeagues, leaguesBySlug } from "@/data/leagues";
import { filterTodaysPublishedPredictions, localTodayISO } from "@/lib/match-feed";
import { localePath, seoLocales, type SeoLocale } from "@/lib/seo-locales";
import { localizePredictionText } from "@/lib/localized-presentation";
import { localizedResult } from "@/lib/localized-ui";
import { homeFeedCopy } from "@/lib/home-feed-copy";
import type { PublicFootballResult } from "@/lib/football-results";
import { FootballTrackRecord } from "@/components/FootballTrackRecord";


function HomeLeagueTaxonomy({
  copy,
  locale,
}: {
  copy: ReturnType<typeof homeFeedCopy>;
  locale: SeoLocale;
}) {
  return (
    <aside className="home-leagues-sidebar" aria-label={copy.competitions}>
      <div className="home-leagues-sidebar__heading">
        <span className="eyebrow">{copy.competitions}</span>
        <h2>{copy.topLeagues}</h2>
      </div>

      <div className="home-leagues-sidebar__list">
        {homeClubLeagues.map((league) => (
          <Link
            key={league.slug}
            href={localePath(locale, `/league/${league.slug}/`)}
            className="home-league-link"
          >
            <LeagueBadge slug={league.slug} short={league.short} size="sm" />
            <span>{league.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function HomePredictionFeed({
  matches,
  beforeHistory,
  beforeToday,
  locale = "en",
  localizedMatchSlugs = [],
  discovery,
  results = [],
  trackRecordResults = results,
}: {
  matches: MatchPreview[];
  beforeHistory?: ReactNode;
  beforeToday?: ReactNode;
  locale?: SeoLocale;
  localizedMatchSlugs?: string[];
  discovery?: ReactNode;
  /** Latest settled results from the central results dataset (already limited by the page). */
  results?: PublicFootballResult[];
  /** Complete settled dataset used only for dynamic track-record totals. */
  trackRecordResults?: PublicFootballResult[];
}) {
  const copy = homeFeedCopy(locale);
  const localizedMatchSet = new Set(localizedMatchSlugs);
  const matchHref = (slug: string) =>
    locale !== "en" && localizedMatchSet.has(slug)
      ? localePath(locale, `/match/${slug}/`)
      : `/match/${slug}/`;
  const separator = locale === "en" ? "vs" : seoLocales[locale].separator;
  const now = useClientNow();
  if (!now) {
    return (
      <>
        <section className="section section--compact" id="today" data-static-home-discovery="true">
          <div className="container home-today-layout">
            <HomeLeagueTaxonomy copy={copy} locale={locale} />
          </div>
        </section>
        {discovery ?? <PublishedMatchDirectory matches={matches} locale={locale} localizedMatchSlugs={localizedMatchSlugs} />}
        {beforeHistory}
      </>
    );
  }
  const today = localTodayISO(now);
  const todayMatches = filterTodaysPublishedPredictions(matches, today, now);

  return (
    <>
      <Fragment key="home-before-today">{beforeToday}</Fragment>

      <section className="section section--compact" id="today">
        <div className="container home-today-layout">
          <div className="home-today-main">
            <div className="section-heading section-heading--compact">
              <div className="heading-with-icon">
                <span className="section-icon" aria-hidden="true">✓</span>

                <div>
                  <span className="eyebrow">{copy.todayEyebrow}</span>

                  <div className="today-title-row">
                    <h2>{copy.todayTitle}</h2>

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
                  <HomeMatchCard key={match.id} match={match} now={now} href={matchHref(match.slug)} viewLabel={copy.view} predictionAvailableLabel={copy.predictionAvailable} comingSoonLabel={copy.comingSoon} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="empty-state empty-state--compact today-empty-state">
                <strong>{copy.nextAvailable}</strong>
              </div>
            )}
          </div>

          <HomeLeagueTaxonomy copy={copy} locale={locale} />
        </div>
      </section>

      {beforeHistory}

      <section className="section section--compact" id="history">
        <div className="container">
          <div className="section-heading section-heading--compact">
            <div className="heading-with-icon">
              <span className="section-icon" aria-hidden="true">✓</span>
              <div><span className="eyebrow">{copy.resultsEyebrow}</span><h2>{copy.resultsTitle}</h2></div>
            </div>
          </div>
          {locale === "en" && trackRecordResults.length > 0 ? <FootballTrackRecord records={trackRecordResults} /> : null}
          {results.length > 0 ? (
            <div className="history-list">
              {results.map((record) => {
                const label = record.result === "green" ? "WIN" : record.result === "red" ? "LOSS" : record.result === "push" ? "PUSH" : record.result === "half-green" ? "HALF WIN" : record.result === "half-red" ? "HALF LOSS" : "VOID";
                const tone = record.result === "green" || record.result === "half-green" ? "green" : record.result === "red" || record.result === "half-red" ? "red" : "push";
                return <a href="/results/" className="history-row" key={record.key}>
                  <div>
                    <strong>{record.homeTeam} {separator} {record.awayTeam}</strong>
                    <span>{leaguesBySlug[record.league as keyof typeof leaguesBySlug]?.name ?? record.league} · {record.date} · {locale === "en" ? record.prediction : localizePredictionText(record.prediction, locale)}</span>
                  </div>
                  <span className="history-score">{record.finalScore.home}–{record.finalScore.away}</span>
                  <span className="history-odds">{copy.odds} {record.odds ?? "—"}</span>
                  <b className={`bet-result bet-result--${tone}`}>{locale === "en" ? label : localizedResult(record.result, locale)}</b>
                </a>
              })}
            </div>
          ) : <div className="empty-state empty-state--compact"><strong>{copy.noCompleted}</strong></div>}
          <p className="history-all-link"><Link href="/results/">{copy.viewAllResults}</Link></p>
        </div>
      </section>
    </>
  );
}
