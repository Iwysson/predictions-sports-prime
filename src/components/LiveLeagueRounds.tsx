"use client";

import { MatchCard } from "@/components/MatchCard";
import type { CompetitionRoundSection, CompetitionRoundSurface } from "@/lib/competition-rounds";
import { useI18n } from "@/i18n/I18nProvider";
import type { SeoLocale } from "@/lib/seo-locales";

function roundLabel(round: number | string) {
  return typeof round === "number" ? `Matchday ${round}` : round;
}

function RoundFixtures({
  section,
  surfaceName,
  emptyMessage,
  locale,
  localizedMatchSlugs,
}: {
  section: CompetitionRoundSection | null;
  surfaceName: "current" | "next";
  emptyMessage: string;
  locale: SeoLocale;
  localizedMatchSlugs: Set<string>;
}) {
  if (!section?.matches.length) {
    return (
      <div className="data-validation-message data-validation-message--warning">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="league-match-list" data-round-surface={surfaceName}>
      {section.matches.map((match) => (
        <div
          key={match.fixtureId ?? match.id}
          data-round-fixture={match.fixtureId ?? match.id}
          data-round-position={surfaceName}
          data-publication-state={match.status}
          data-home-team={match.homeTeam}
          data-away-team={match.awayTeam}
        >
          <MatchCard match={match} locale={locale} localized={localizedMatchSlugs.has(match.slug)} />
        </div>
      ))}
    </div>
  );
}

export function LiveLeagueRounds({
  surface,
  locale = "en",
  localizedMatchSlugs = [],
}: {
  surface: CompetitionRoundSurface;
  locale?: SeoLocale;
  localizedMatchSlugs?: string[];
}) {
  const localizedMatchSet = new Set(localizedMatchSlugs);
  const { t } = useI18n();
  const sourceLabel = surface.sourceState === "validated"
    ? t("validated")
    : surface.sourceState === "editorial-fallback"
      ? t("saved")
      : t("unavailable");
  const sourceClass = surface.sourceState === "validated"
    ? "validated"
    : surface.sourceState === "editorial-fallback"
      ? "fallback"
      : "invalid";

  return (
    <div className="live-round-block">
      <section className="league-round-section" aria-labelledby="current-round-data-heading">
        <div className="round-source-line">
          <span id="current-round-data-heading">
            {surface.current ? roundLabel(surface.current.round) : t("awaitingConfirmedData")}
          </span>
          <span className={`round-source-status round-source-status--${sourceClass}`}>
            <i /> {sourceLabel}
          </span>
        </div>
        <RoundFixtures
          section={surface.current}
          surfaceName="current"
          emptyMessage={t("awaitingConfirmedData")}
          locale={locale}
          localizedMatchSlugs={localizedMatchSet}
        />
      </section>

      <section className="league-round-section" aria-labelledby="next-round-heading">
        <div className="section-heading section-heading--compact league-next-round-heading">
          <div className="heading-with-icon">
            <span className="section-icon" aria-hidden="true">+</span>
            <div>
              <span className="eyebrow">{t("fixtures")}</span>
              <h2 id="next-round-heading">{t("nextRound")}</h2>
              <span className="section-subtitle">
                {surface.next ? roundLabel(surface.next.round) : "Factual fixtures not available yet"}
              </span>
            </div>
          </div>
          {surface.next ? (
            <span className="league-match-count" aria-label={`${surface.next.matches.length} fixtures`}>
              {surface.next.matches.length}
            </span>
          ) : null}
        </div>
        <RoundFixtures
          section={surface.next}
          surfaceName="next"
          emptyMessage="Next round fixtures are not available yet."
          locale={locale}
          localizedMatchSlugs={localizedMatchSet}
        />
      </section>
    </div>
  );
}
