"use client";

import Link from "next/link";
import { Match } from "@/types";
import { TeamBadge } from "@/components/TeamBadge";
import { LeagueBadge } from "@/components/LeagueBadge";
import { leagues } from "@/data/leagues";
import { useI18n } from "@/i18n/I18nProvider";

export function MatchCard({ match }: { match: Match }) {
  const href = `/match/${match.slug}`;
  const league = leagues.find((item) => item.slug === match.league);
  const { t } = useI18n();
  const mainPrediction = match.predictions.find(
    (item) => item.label === "Main Prediction"
  )?.value;

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

        <span className="match-time">◷ {match.time || "TBD"}</span>
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
        <span className={`prediction-pill prediction-pill--${match.status}`}>
          <span>★</span>
          {match.status === "published"
            ? t("predictionAvailable")
            : t("comingSoon")}
        </span>

        {match.status === "published" && mainPrediction ? (
          <span className="card-prediction-summary" title={mainPrediction}>
            {mainPrediction}
          </span>
        ) : null}

        {match.status === "published" ? (
          <Link href={href} className="button button--small">
            {t("view")} <span aria-hidden="true">›</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
