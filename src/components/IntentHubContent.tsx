"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "@/components/DocumentLink";
import { useClientNow } from "@/lib/use-client-now";
import { SiteContactLine } from "@/components/SiteContactLine";
import { PublishedMatchDirectory } from "@/components/PublishedMatchDirectory";
import type { MatchPreview } from "@/types";
import { JsonLd } from "@/components/JsonLd";
import { LeagueBadge } from "@/components/LeagueBadge";
import { TeamBadge } from "@/components/TeamBadge";
import { getMatchDisplayTime } from "@/lib/match-time";
import { leaguesBySlug } from "@/data/leagues";
import { intentHubDefinitions, intentHubJsonLd, selectIntentHubMatches, type IntentHubSlug } from "@/lib/intent-hubs";
import { isFutureFixture } from "@/lib/fixture-state";
import { filterTodaysPublishedPredictions, localTodayISO } from "@/lib/match-feed";
import { matchPredictionAnchor } from "@/lib/seo-locales";
import { VipTitleCta } from "@/components/VipTitleCta";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { PredictionsCompleteNotice } from "@/components/PredictionsCompleteNotice";
import { resultLabels, type FootballResultRecord } from "@/lib/football-results";

function TodayMatchCard({ match }: { match: MatchPreview }) {
  const league = leaguesBySlug[match.league];
  const kickoff = getMatchDisplayTime(match);
  return <article className="intent-match-card" key={match.slug}>
    <div className="intent-match-card__meta"><span><LeagueBadge slug={match.league} short={league?.short ?? "•"} size="sm" />{league?.name ?? match.league}</span><time dateTime={match.kickoffUtc ?? match.date}>{match.date} · {kickoff.display}</time></div>
    <div className="intent-match-card__fixture"><TeamBadge team={match.homeTeam} /><h3>{match.homeTeam} <span>vs</span> {match.awayTeam}</h3><TeamBadge team={match.awayTeam} /></div>
    {match.predictionAccess === "free" && match.mainPrediction
      ? <dl><div><dt>Main prediction</dt><dd>{match.mainPrediction}</dd></div>{match.odds != null ? <div><dt>Published odds</dt><dd>{match.odds.toFixed(2)}</dd></div> : null}</dl>
      : <dl><div><dt>Prediction</dt><dd>{match.bestAnalysis ? "BEST BET · PRIME VIP" : "PRIME VIP"}</dd></div></dl>}
    <Link className="button button--small" href={`/match/${match.slug}/`}>
      {isFutureFixture(match) ? matchPredictionAnchor(match.homeTeam, match.awayTeam) : "Read full analysis"} <span aria-hidden="true">›</span>
    </Link>
  </article>;
}

export function IntentHubContent({ slug, matches, discovery, results = [] }: { slug: IntentHubSlug; matches: MatchPreview[]; discovery?: ReactNode; results?: FootballResultRecord[] }) {
  const now = useClientNow();
  const [dailyMatches, setDailyMatches] = useState<MatchPreview[]>([]);
  const [dailyFeedChecked, setDailyFeedChecked] = useState(false);
  const todayKey = now ? localTodayISO(now) : null;
  useEffect(() => {
    if (slug !== "football-predictions" || !todayKey) return;
    let active = true;
    setDailyFeedChecked(false);
    fetch("/api/mobile/football/feed", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((feed) => {
        if (!active || !feed) return;
        const entries = [...(feed.free?.today ?? []), ...(feed.vip?.today ?? [])];
        setDailyMatches(entries.map((entry: any) => ({ ...entry, status: "published" as const, mainPrediction: entry.pick, odds: entry.odds })));
      })
      .catch(() => {})
      .finally(() => { if (active) setDailyFeedChecked(true); });
    return () => { active = false; };
  }, [slug, todayKey]);
  const hub = intentHubDefinitions[slug];
  const entries = now ? selectIntentHubMatches(slug, matches, now) : [];
  const compact = slug === "picks";
  // Only the Football hub gets a dedicated "today" board with the closing notice; a game that has
  // kicked off but not finished stays in this list (resolveHomeTemporalBucket only moves a fixture
  // out of "today" once it is confirmed completed with a final score - never just because its
  // kickoff time passed), so the notice only appears once there is genuinely nothing left to show.
  const todayMatches = slug === "football-predictions" && now ? filterTodaysPublishedPredictions([...matches, ...dailyMatches], localTodayISO(now), now) : null;

  return <>
    <JsonLd data={intentHubJsonLd(slug, entries, results)} />
    <section className="page-hero intent-hub-hero" aria-labelledby="intent-hub-title">
      <div className="container">
        <nav className="league-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span>{hub.h1}</span></nav>
        <span className="eyebrow">{hub.eyebrow}</span>
        <VipTitleCta id="intent-hub-title">{hub.h1}</VipTitleCta>
        <p>{hub.intro}</p>
        <SiteContactLine />
      </div>
    </section>

    {slug === "football-predictions" ? <PrimeVipOfferCard /> : null}

    {slug === "football-predictions" && now ? (
      <section className="section section--compact" aria-labelledby="football-today-title">
        <div className="container">
          <div className="section-heading section-heading--compact">
            <div><span className="eyebrow">Today</span><h2 id="football-today-title">Today&apos;s Football Predictions</h2></div>
            <span className="today-count">{todayMatches?.length ?? 0}</span>
          </div>
          {todayMatches && todayMatches.length ? (
            <div className="intent-hub-grid">
              {todayMatches.map((match) => <TodayMatchCard key={match.slug} match={match} />)}
            </div>
          ) : dailyFeedChecked ? <PredictionsCompleteNotice /> : <div className="empty-state empty-state--compact" role="status">Checking today&apos;s published predictions…</div>}
        </div>
      </section>
    ) : null}

    {slug === "football-predictions" ? <section className="section section--compact" aria-labelledby="intent-feed-title">
      <div className="container">
        <div className="section-heading section-heading--compact"><div><span className="eyebrow">Settled predictions</span><h2 id="intent-feed-title">{hub.feedTitle}</h2><p>{hub.feedIntro}</p></div><span className="today-count">{results.length}</span></div>
        {results.length ? <div className="history-list">
          {results.map((record) => {
            const tone = record.result === "green" || record.result === "half-green" ? "green" : record.result === "red" || record.result === "half-red" ? "red" : "push";
            return <Link href={`/results/#${record.slug}`} className="history-row" key={record.key}>
              <div><strong>{record.homeTeam} vs {record.awayTeam}</strong><span>{leaguesBySlug[record.league as keyof typeof leaguesBySlug]?.name ?? record.league} · {record.date} · {record.prediction}</span></div>
              <span className="history-score">{record.finalScore.home}–{record.finalScore.away}</span>
              <span className="history-odds">Odds {record.odds?.toFixed(2) ?? "—"}</span>
              <b className={`bet-result bet-result--${tone}`}>{resultLabels[record.result]}</b>
            </Link>;
          })}
        </div> : <div className="empty-state empty-state--compact"><strong>No settled football predictions yet.</strong></div>}
        <p className="history-all-link"><Link href="/results/">View all results</Link></p>
      </div>
    </section> : !now ? discovery ?? <PublishedMatchDirectory matches={matches} /> : <section className="section section--compact" aria-labelledby="intent-feed-title">
      <div className="container">
        <div className="section-heading section-heading--compact"><div><span className="eyebrow">Published pre-match inventory</span><h2 id="intent-feed-title">{hub.feedTitle}</h2><p>{hub.feedIntro}</p></div><span className="today-count">{entries.length}</span></div>
        {entries.length ? <div className={compact ? "intent-picks-list" : "intent-hub-grid"}>
          {entries.map((match) => {
            const league = leaguesBySlug[match.league];
            const kickoff = getMatchDisplayTime(match);
            return <article className={`intent-match-card${compact ? " intent-match-card--compact" : ""}`} key={match.slug}>
              <div className="intent-match-card__meta"><span><LeagueBadge slug={match.league} short={league?.short ?? "•"} size="sm" />{league?.name ?? match.league}</span><time dateTime={match.kickoffUtc ?? match.date}>{match.date} · {kickoff.display}</time></div>
              <div className="intent-match-card__fixture"><TeamBadge team={match.homeTeam} /><h3>{match.homeTeam} <span>vs</span> {match.awayTeam}</h3><TeamBadge team={match.awayTeam} /></div>
              {match.predictionAccess === "free" && match.mainPrediction
                ? <dl><div><dt>Main prediction</dt><dd>{match.mainPrediction}</dd></div>{match.odds != null ? <div><dt>Published odds</dt><dd>{match.odds.toFixed(2)}</dd></div> : null}</dl>
                : <dl><div><dt>Prediction</dt><dd>{match.bestAnalysis ? "BEST BET · PRIME VIP" : "PRIME VIP"}</dd></div></dl>}
              <Link className="button button--small" href={`/match/${match.slug}/`}>
                {isFutureFixture(match) ? matchPredictionAnchor(match.homeTeam, match.awayTeam) : "Read full analysis"} <span aria-hidden="true">›</span>
              </Link>
            </article>;
          })}
        </div> : <div className="empty-state intent-hub-empty"><strong>No published predictions are available for this time window.</strong><p>The broader football hub remains available for later fixtures and complete pre-match analysis.</p><Link href="/football-predictions/">Browse current football predictions</Link></div>}
      </div>
    </section>}

    <section className="section section--compact section--muted" aria-labelledby="intent-guide-title"><div className="container intent-hub-editorial"><div><span className="eyebrow">Editorial context</span><h2 id="intent-guide-title">{hub.guideTitle}</h2>{hub.guide.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><aside aria-labelledby="intent-links-title"><h2 id="intent-links-title">Useful paths</h2><ul><li><Link href="/methodology/">Editorial methodology</Link></li><li><Link href="/results/">Prediction results</Link></li><li><Link href="/responsible-gambling/">Responsible gambling</Link></li>{slug !== "football-predictions" ? <li><Link href="/football-predictions/">All football predictions</Link></li> : null}{slug !== "today-predictions" ? <li><Link href="/today-predictions/">Today's predictions</Link></li> : null}{slug !== "soccer-predictions" ? <li><Link href="/soccer-predictions/">MLS predictions</Link></li> : null}<li><Link href="/nhl/">NHL predictions</Link></li><li><Link href="/nfl/">NFL predictions</Link></li><li><Link href="/nba/">NBA predictions</Link></li></ul></aside></div></section>
  </>;
}
