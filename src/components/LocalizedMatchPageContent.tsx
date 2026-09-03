import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { LeagueBadge } from "@/components/LeagueBadge";
import { TeamBadge } from "@/components/TeamBadge";
import { LiveMatchMeta } from "@/components/LiveMatchMeta";
import { RelatedPredictions } from "@/components/RelatedPredictions";
import { MatchComments } from "@/components/MatchComments";
import { ArticleByline } from "@/components/ArticleByline";
import { MethodologyLink } from "@/components/MethodologyLink";
import { ArticleSources } from "@/components/ArticleSources";
import { EditorialAnalysis } from "@/components/EditorialAnalysis";
import {
  LocalizedMatchDetails,
  isFullyLocalizedMatchLocale,
} from "@/components/LocalizedMatchDetails";
import { PredictionLeagueCategories } from "@/components/PredictionLeagueCategories";
import { leaguesBySlug } from "@/data/leagues";
import { matches } from "@/data/matches";
import { editorialPredictions } from "@/data/predictions";
import { selectRelatedPredictions } from "@/lib/related-predictions";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";
import { materialMatchUpdatedAt } from "@/lib/match-freshness";
import { isInternationalMatchExpansionEligible } from "@/lib/upcoming-match";
import {
  localePath,
  seoLocales,
  type SeoLocaleSlug,
} from "@/lib/seo-locales";
import {
  hasCompleteLocalizedEditorial,
} from "@/data/localized-editorial";
import type { Match } from "@/types";
import { getAdSenseIndexableSlugs } from "@/lib/adsense-content-quality";

type LocalizedMatchPageContentProps = {
  match: Match;
  locale: SeoLocaleSlug;
  h1: string;
  intro?: string;
  analysis: string[];
  analysisFormat?: "markdown";
  mainPrediction?: string;
  sourceDescription?: string;
};

const extraCopy: Record<
  SeoLocaleSlug,
  {
    updated: string;
    latestOdds: string;
    predictionResult: string;
    won: string;
    lost: string;
    push: string;
    void: string;
    history: string;
    bettingTips: string;
  }
> = {
  "pt-br": {
    updated: "Atualizado",
    latestOdds: "Odds mais recentes observadas",
    predictionResult: "Resultado do palpite",
    won: "GANHOU",
    lost: "PERDEU",
    push: "DEVOLVIDO",
    void: "ANULADO",
    history: "Ver histórico de palpites",
    bettingTips: "Palpite e dicas de apostas",
  },
  es: {
    updated: "Actualizado",
    latestOdds: "Últimas cuotas observadas",
    predictionResult: "Resultado del pronóstico",
    won: "ACERTADO",
    lost: "FALLADO",
    push: "NULO",
    void: "ANULADO",
    history: "Ver historial de pronósticos",
    bettingTips: "Pronóstico y consejos de apuestas",
  },
  fr: {
    updated: "Mis à jour",
    latestOdds: "Dernières cotes observées",
    predictionResult: "Résultat du pronostic",
    won: "GAGNÉ",
    lost: "PERDU",
    push: "REMBOURSÉ",
    void: "ANNULÉ",
    history: "Voir l’historique des pronostics",
    bettingTips: "Pronostic et conseils de paris",
  },
  de: {
    updated: "Aktualisiert",
    latestOdds: "Zuletzt beobachtete Quoten",
    predictionResult: "Ergebnis der Prognose",
    won: "GEWONNEN",
    lost: "VERLOREN",
    push: "RÜCKERSTATTET",
    void: "ANNULLIERT",
    history: "Prognoseverlauf ansehen",
    bettingTips: "Prognose und Wett-Tipps",
  },
  it: {
    updated: "Aggiornato",
    latestOdds: "Ultime quote osservate",
    predictionResult: "Risultato del pronostico",
    won: "VINTA",
    lost: "PERSA",
    push: "RIMBORSATA",
    void: "ANNULLATA",
    history: "Vedi storico pronostici",
    bettingTips: "Pronostico e consigli scommesse",
  },
  nl: {
    updated: "Bijgewerkt",
    latestOdds: "Laatst waargenomen odds",
    predictionResult: "Resultaat voorspelling",
    won: "GEWONNEN",
    lost: "VERLOREN",
    push: "TERUGBETAALD",
    void: "GEANNULEERD",
    history: "Bekijk voorspellingengeschiedenis",
    bettingTips: "Voorspelling en wedtips",
  },
  tr: {
    updated: "Güncellendi",
    latestOdds: "Son gözlenen oranlar",
    predictionResult: "Tahmin sonucu",
    won: "KAZANDI",
    lost: "KAYBETTİ",
    push: "İADE",
    void: "İPTAL",
    history: "Tahmin geçmişini görüntüle",
    bettingTips: "Tahmin ve bahis ipuçları",
  },
};

function formatEditorialDate(value: string, locale: SeoLocaleSlug) {
  return new Intl.DateTimeFormat(seoLocales[locale].htmlLang, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function relatedPathExists(match: Match, locale: SeoLocaleSlug) {
  if (hasCompleteLocalizedEditorial(match.slug, locale)) return true;
  return (
    isFullyLocalizedMatchLocale(locale) &&
    isInternationalMatchExpansionEligible(match)
  );
}

function resultLabel(
  result: NonNullable<Match["betResult"]>,
  locale: SeoLocaleSlug
) {
  const copy = extraCopy[locale];
  if (result === "green") return copy.won;
  if (result === "red") return copy.lost;
  if (result === "push") return copy.push;
  return copy.void;
}

export function LocalizedMatchPageContent({
  match,
  locale,
  h1,
  intro,
  analysis,
  analysisFormat,
  mainPrediction,
  sourceDescription,
}: LocalizedMatchPageContentProps) {
  const copy = seoLocales[locale];
  const extra = extraCopy[locale];
  const league = leaguesBySlug[match.league];
  const odds = match.predictions.find(
    (item) => item.label === "Published Odds" || item.label === "Odds"
  );
  const latestObservedOdds = match.predictions.find(
    (item) => item.label === "Latest Observed Odds"
  );
  const selectedRelatedMatches = selectRelatedPredictions(match, matches);
  const indexableMatchSlugs = getAdSenseIndexableSlugs(editorialPredictions);
  const localizedRelatedSlugs = selectedRelatedMatches
    .filter((item) => relatedPathExists(item, locale))
    .map((item) => item.slug);
  const hasFinalScore = isHistoryEligibleFixture({
    status: match.fixtureStatus,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  });
  const modifiedAt = materialMatchUpdatedAt(match);

  return (
    <>
      <section className="compact-match-top">
        <div className="container">
          <nav className="compact-match-breadcrumb" aria-label="Breadcrumb">
            <Link href={localePath(locale)}>{copy.today}</Link>
            <span aria-hidden="true">›</span>
            <Link href={localePath(locale, `/league/${match.league}/`)}>
              {league?.name ?? match.league}
            </Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">
              {match.homeTeam} {copy.separator} {match.awayTeam}
            </span>
          </nav>

          <div className="compact-match-header">
            <div className="compact-match-league">
              <LeagueBadge
                slug={match.league}
                short={league?.short ?? "•"}
                size="sm"
              />

              <div className="compact-match-league-copy">
                <span className="eyebrow">
                  {league?.name ?? match.league}
                </span>

                <LiveMatchMeta
                  league={match.league}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  fallbackRound={match.round}
                  fallbackDate={match.date}
                  fallbackTime={match.time}
                  venue={match.venue}
                />
              </div>
            </div>
          </div>

          <div className="compact-match-scoreboard">
            <div className="compact-match-team compact-match-team--home">
              <TeamBadge team={match.homeTeam} />
              <strong>{match.homeTeam}</strong>
            </div>

            <div className="compact-match-vs">
              <span>
                {hasFinalScore
                  ? `${match.homeScore}-${match.awayScore}`
                  : "VS"}
              </span>
            </div>

            <div className="compact-match-team compact-match-team--away">
              <TeamBadge team={match.awayTeam} />
              <strong>{match.awayTeam}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section compact-match-content-section">
        <div className="container compact-match-layout">
          <article className="compact-analysis-card">
            <div className="compact-card-heading">
              <div>
                <span className="eyebrow">{copy.matchAnalysis}</span>
                <h1>{h1}</h1>

                {match.publishedAt ? (
                  <p className="editorial-dates">
                    <span>
                      {copy.published}:{" "}
                      {formatEditorialDate(match.publishedAt, locale)}
                    </span>
                    {modifiedAt ? (
                      <span>
                        {extra.updated}:{" "}
                        {formatEditorialDate(modifiedAt, locale)}
                      </span>
                    ) : null}
                    <ArticleByline />
                    <MethodologyLink />
                  </p>
                ) : null}
              </div>
            </div>

            {intro ? <p className="match-seo-intro">{intro}</p> : null}

            {isFullyLocalizedMatchLocale(locale) ? (
              <LocalizedMatchDetails match={match} locale={locale} />
            ) : null}

            <div className="match-content-ad match-content-ad--early">
              <AdSlot placement="match-top" />
            </div>

            <div className="compact-analysis-copy">
              <EditorialAnalysis
                analysis={analysis}
                format={analysisFormat}
              />
            </div>

            {match.comment ? (
              <aside className="editorial-comment">
                <strong>{copy.matchAnalysis}</strong>
                <p>{match.comment}</p>
              </aside>
            ) : null}

            <ArticleSources
              sources={match.sources}
              locale={locale}
              fallbackDescription={sourceDescription}
            />

            <MatchComments matchSlug={match.slug} />

            <div className="match-content-ad">
              <AdSlot placement="match-content" />
            </div>
          </article>

          <aside className="compact-predictions-card">
            <div className="compact-card-heading">
              <div>
                <span className="eyebrow">{copy.mainPrediction}</span>
                <h2>{extra.bettingTips}</h2>
              </div>
            </div>

            <div className="main-prediction-block">
              <strong>{mainPrediction}</strong>

              {odds ? (
                <div className="prediction-odds">
                  <span>{copy.odds}</span>
                  <b>{odds.value}</b>
                </div>
              ) : null}

              {latestObservedOdds ? (
                <div className="prediction-odds">
                  <span>{extra.latestOdds}</span>
                  <b>{latestObservedOdds.value}</b>
                </div>
              ) : null}
            </div>

            <p className="compact-responsible-note">
              {copy.responsible}
            </p>

            {match.betResult ? (
              <p
                className={`match-result-status bet-result bet-result--${match.betResult}`}
              >
                {extra.predictionResult}:{" "}
                {resultLabel(match.betResult, locale)}
              </p>
            ) : null}

            <Link className="match-results-link" href="/results/">
              {extra.history}
            </Link>
          </aside>
        </div>
      </section>

      <div className="container compact-match-bottom-area">
        <AdSlot placement="match-bottom" format="rectangle" />
      </div>

      <div className="container related-predictions-area">
        <RelatedPredictions
          matches={selectedRelatedMatches}
          locale={locale}
          localizedSlugs={localizedRelatedSlugs}
          indexableMatchSlugs={indexableMatchSlugs}
        />
      </div>

      <PredictionLeagueCategories locale={locale} />
    </>
  );
}
