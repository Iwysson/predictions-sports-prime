"use client";

import Link from "next/link";
import { MatchPreview } from "@/types";
import { TeamBadge } from "@/components/TeamBadge";
import { LeagueBadge } from "@/components/LeagueBadge";
import { leagues } from "@/data/leagues";
import { useI18n } from "@/i18n/I18nProvider";
import { canRenderComingSoon } from "@/lib/fixture-status";
import { getMatchDisplayTime } from "@/lib/match-time";
import { isFixtureLiveNow } from "@/lib/fixture-state";
import { localePath, type SeoLocale } from "@/lib/seo-locales";

export function MatchCard({
  match,
  now = new Date(),
  locale = "en",
  localized = false,
  discoverable = true,
}: {
  match: MatchPreview;
  now?: Date | string;
  locale?: SeoLocale;
  localized?: boolean;
  discoverable?: boolean;
}) {
  const href = locale !== "en" && localized
    ? localePath(locale, `/match/${match.slug}/`)
    : `/match/${match.slug}/`;
  const league = leagues.find((item) => item.slug === match.league);
  const { t } = useI18n();
  const showComingSoon = canRenderComingSoon(match.fixtureStatus, match.status === "published");
  const kickoff = getMatchDisplayTime(match);
  const live = isFixtureLiveNow(match, now);

  return (
    <article className="match-card">
      <div className="match-league-row">
        <div className="match-league">
          <LeagueBadge
            slug={match.league}
            short={league?.short ?? "•"}
            size="sm"
          />
          <strong>{league?.name ?? match.league}</strong>
        </div>

        <span className="match-time" aria-label={kickoff.ariaLabel}>
          <span aria-hidden="true">🕒</span>
          <strong>{kickoff.display}</strong>
          <small>{kickoff.sublabel}</small>
        </span>
      </div>

      <div className="compact-teams">
        <div className="compact-team">
          <TeamBadge team={match.homeTeam} />
          <strong>{match.homeTeam}</strong>
        </div>

        <span className="compact-vs">VS</span>

        <div className="compact-team">
          <TeamBadge team={match.awayTeam} />
          <strong>{match.awayTeam}</strong>
        </div>
      </div>

      <div className="compact-match-footer">
        <span className={`prediction-pill prediction-pill--${live ? "live" : match.status}`}>
          <span aria-hidden="true">✓</span>
          {live ? "LIVE" : match.status === "published"
            ? t("predictionAvailable")
            : showComingSoon ? t("comingSoon") : match.fixtureStatus?.toUpperCase()}
        </span>

        {match.status === "published" && discoverable ? (
          <Link
            href={href}
            className="button button--small"
            aria-label={`${match.homeTeam} vs ${match.awayTeam} Prediction`}
          >
            {t("view")} <span aria-hidden="true">›</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
