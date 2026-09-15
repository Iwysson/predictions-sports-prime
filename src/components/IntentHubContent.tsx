"use client";

import type { ReactNode } from "react";
import Link from "@/components/DocumentLink";
import { useClientNow } from "@/lib/use-client-now";
import { PublishedMatchDirectory } from "@/components/PublishedMatchDirectory";
import type { MatchPreview } from "@/types";
import { JsonLd } from "@/components/JsonLd";
import { LeagueBadge } from "@/components/LeagueBadge";
import { TeamBadge } from "@/components/TeamBadge";
import { getMatchDisplayTime } from "@/lib/match-time";
import { leaguesBySlug } from "@/data/leagues";
import { intentHubDefinitions, intentHubJsonLd, intentHubLeagueLinks, selectIntentHubMatches, type IntentHubSlug } from "@/lib/intent-hubs";
import { isFutureFixture } from "@/lib/fixture-state";
import { matchPredictionAnchor } from "@/lib/seo-locales";

export function IntentHubContent({ slug, matches, discovery }: { slug: IntentHubSlug; matches: MatchPreview[]; discovery?: ReactNode }) {
  const now = useClientNow();
  const hub = intentHubDefinitions[slug];
  const entries = now ? selectIntentHubMatches(slug, matches, now) : [];
  const leagueLinks = intentHubLeagueLinks(entries);
  const compact = slug === "picks";

  return <>
    <JsonLd data={intentHubJsonLd(slug, entries)} />
    <section className="page-hero intent-hub-hero" aria-labelledby="intent-hub-title">
      <div className="container">
        <nav className="league-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span>{hub.h1}</span></nav>
        <span className="eyebrow">{hub.eyebrow}</span>
        <h1 id="intent-hub-title">{hub.h1}</h1>
        <p>{hub.intro}</p>
      </div>
    </section>

    {!now ? discovery ?? <PublishedMatchDirectory matches={matches} /> : <section className="section section--compact" aria-labelledby="intent-feed-title">
      <div className="container">
        <div className="section-heading section-heading--compact"><div><span className="eyebrow">Published pre-match inventory</span><h2 id="intent-feed-title">{hub.feedTitle}</h2><p>{hub.feedIntro}</p></div><span className="today-count">{entries.length}</span></div>
        {entries.length ? <div className={compact ? "intent-picks-list" : "intent-hub-grid"}>
          {entries.map((match) => {
            const league = leaguesBySlug[match.league];
            const kickoff = getMatchDisplayTime(match);
            return <article className={`intent-match-card${compact ? " intent-match-card--compact" : ""}`} key={match.slug}>
              <div className="intent-match-card__meta"><span><LeagueBadge slug={match.league} short={league?.short ?? "•"} size="sm" />{league?.name ?? match.league}</span><time dateTime={match.kickoffUtc ?? match.date}>{match.date} · {kickoff.display}</time></div>
              <div className="intent-match-card__fixture"><TeamBadge team={match.homeTeam} /><h3>{match.homeTeam} <span>vs</span> {match.awayTeam}</h3><TeamBadge team={match.awayTeam} /></div>
              <dl><div><dt>Main prediction</dt><dd>Available after opening the match page</dd></div>{match.odds != null ? <div><dt>Published odds</dt><dd>Revealed with the prediction</dd></div> : null}</dl>
              <Link className="button button--small" href={`/match/${match.slug}/`}>
                {isFutureFixture(match) ? matchPredictionAnchor(match.homeTeam, match.awayTeam) : "Read full analysis"} <span aria-hidden="true">›</span>
              </Link>
            </article>;
          })}
        </div> : <div className="empty-state intent-hub-empty"><strong>No published predictions are available for this time window.</strong><p>The broader football hub remains available for later fixtures and complete pre-match analysis.</p><Link href="/football-predictions/">Browse current football predictions</Link></div>}
      </div>
    </section>}

    <section className="section section--compact section--muted" aria-labelledby="intent-guide-title"><div className="container intent-hub-editorial"><div><span className="eyebrow">Editorial context</span><h2 id="intent-guide-title">{hub.guideTitle}</h2>{hub.guide.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><aside aria-labelledby="intent-links-title"><h2 id="intent-links-title">Useful paths</h2><ul>{leagueLinks.map((league) => <li key={league.slug}><Link href={`/league/${league.slug}/`}>{league.name} predictions</Link></li>)}<li><Link href="/methodology/">Editorial methodology</Link></li><li><Link href="/responsible-gambling/">Responsible gambling</Link></li>{slug !== "football-predictions" ? <li><Link href="/football-predictions/">All football predictions</Link></li> : null}{slug !== "today-predictions" ? <li><Link href="/today-predictions/">Today's predictions</Link></li> : null}</ul></aside></div></section>
  </>;
}
