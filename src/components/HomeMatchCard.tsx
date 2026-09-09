import Link from "next/link";
import type { MatchPreview } from "@/types";
import { LeagueBadge } from "@/components/LeagueBadge";
import { HomeTeamBadge } from "@/components/HomeTeamBadge";
import { leagues } from "@/data/leagues";
import { canRenderComingSoon } from "@/lib/fixture-status";
import { getMatchDisplayTime } from "@/lib/match-time";
import { isFixtureLiveNow, isFutureFixture } from "@/lib/fixture-state";
import { matchPredictionAnchor, seoLocales, type SeoLocale } from "@/lib/seo-locales";
import { localizedFixtureStatus, localizedLive } from "@/lib/localized-ui";

export function HomeMatchCard({
  match,
  now,
  href = `/match/${match.slug}/`,
  viewLabel = "View",
  predictionAvailableLabel = "Prediction available",
  comingSoonLabel = "Coming soon",
  locale = "en",
}: {
  match: MatchPreview;
  now: Date | string;
  href?: string;
  viewLabel?: string;
  predictionAvailableLabel?: string;
  comingSoonLabel?: string;
  locale?: SeoLocale;
}) {
  const league = leagues.find((item) => item.slug === match.league);
  const showComingSoon = canRenderComingSoon(match.fixtureStatus, match.status === "published");
  const kickoff = getMatchDisplayTime(match, locale);
  const live = isFixtureLiveNow(match, now);
  const future = isFutureFixture(match, now);
  const displayDate = match.date
    ? match.date.split("-").reverse().join("/")
    : "TBD";

  return (
    <article className="match-card">
      <div className="match-league-row">
        <div className="match-league">
          <LeagueBadge slug={match.league} short={league?.short ?? "•"} size="sm" />
          <strong>{league?.name ?? match.league}</strong>
        </div>
        <span className="match-time" aria-label={kickoff.ariaLabel}>
          <small className="match-date">{displayDate}</small>
          <span aria-hidden="true">◷</span>
          <strong>{kickoff.display}</strong>
          <small>{kickoff.sublabel}</small>
        </span>
      </div>

      <div className="compact-teams">
        <div className="compact-team"><HomeTeamBadge team={match.homeTeam} /><strong>{match.homeTeam}</strong></div>
        <span className="compact-vs">{locale === "en" ? "VS" : seoLocales[locale].separator}</span>
        <div className="compact-team"><HomeTeamBadge team={match.awayTeam} /><strong>{match.awayTeam}</strong></div>
      </div>

      <div className="compact-match-footer">
        <span className={`prediction-pill prediction-pill--${live ? "live" : match.status}`}>
          <span aria-hidden="true">✓</span>
          {live ? localizedLive(locale) : match.status === "published" ? predictionAvailableLabel : showComingSoon ? comingSoonLabel : localizedFixtureStatus(match.fixtureStatus, locale)}
        </span>
        {match.status === "published" ? (
          <Link href={href} className="button button--small" aria-label={`${match.homeTeam} ${locale === "en" ? "vs" : seoLocales[locale].separator} ${match.awayTeam} — ${predictionAvailableLabel}`}>
            {future ? matchPredictionAnchor(match.homeTeam, match.awayTeam, locale) : viewLabel} <span aria-hidden="true">›</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
