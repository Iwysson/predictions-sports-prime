import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { MatchSemanticDetails } from "@/components/MatchSemanticDetails";
import { PredictionLeagueCategories } from "@/components/PredictionLeagueCategories";
import {
  MatchAnalysisLabel,
  MainPredictionLabel,
  OddsLabel,
  ResponsibleText,
} from "@/components/MatchPageLabels";
import { JsonLd } from "@/components/JsonLd";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import {
  articleJsonLd,
  buildMatchMetadata,
  matchHeading,
  matchBreadcrumbJsonLd,
  matchIntroduction,
} from "@/lib/seo";
import { selectRelatedPredictions } from "@/lib/related-predictions";
import { hydratePrediction } from "@/lib/live-predictions";
import { toMatchPreview } from "@/lib/editorial";
import type { Match } from "@/types";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";
import { materialMatchUpdatedAt } from "@/lib/match-freshness";
import { isRestrictedSearchIntentFixture } from "@/lib/match-search-intent";

async function resolveMatchFixture(match: Match): Promise<Match> {
  const fixture = await hydratePrediction(toMatchPreview(match));
  const completed = isHistoryEligibleFixture({
    status: fixture.fixtureStatus,
    homeScore: fixture.homeScore,
    awayScore: fixture.awayScore,
  });
  return {
    ...match,
    title: match.title,
    fixtureId: fixture.fixtureId,
    kickoffUtc: fixture.kickoffUtc,
    timeConfirmed: fixture.timeConfirmed,
    round: fixture.round,
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    date: fixture.date,
    time: fixture.time,
    venue: fixture.venue ?? match.venue,
    fixtureStatus: fixture.fixtureStatus,
    homeScore: fixture.homeScore,
    awayScore: fixture.awayScore,
    betResult: completed ? fixture.betResult : match.betResult,
    betResultSource: completed ? fixture.betResultSource : match.betResultSource,
  };
}

function formatEditorialDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export const dynamicParams = false;

export function generateStaticParams() {
  return matches.map((match) => ({
    slug: match.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const match = matches.find(
    (item) =>
      item.slug === slug &&
      item.status === "published"
  );

  if (!match) {
    return {
      title: "Prediction not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildMatchMetadata(await resolveMatchFixture(match));
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const storedMatch = matches.find(
    (item) =>
      item.slug === slug &&
      item.status === "published"
  );

  if (!storedMatch) {
    notFound();
  }

  const match = await resolveMatchFixture(storedMatch);
  const league = leagues.find(
    (item) => item.slug === match.league
  );
  const mainPrediction = match.predictions.find(
    (item) => item.label === "Main Prediction"
  );
  const odds = match.predictions.find(
    (item) => item.label === "Published Odds" || item.label === "Odds"
  );
  const latestObservedOdds = match.predictions.find(
    (item) => item.label === "Latest Observed Odds"
  );
  const selectedRelatedMatches = selectRelatedPredictions(match, matches);
  const hasFinalScore = isHistoryEligibleFixture({
    status: match.fixtureStatus,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  });
  const modifiedAt = materialMatchUpdatedAt(match);

  return (
    <>
      <JsonLd data={articleJsonLd(match)} />
      <JsonLd data={matchBreadcrumbJsonLd(match)} />

      <section className="compact-match-top">
        <div className="container">
          <nav className="compact-match-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/league/${match.league}/`}>
              {league?.name ?? "League"} Predictions
            </Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">
              {match.homeTeam} vs {match.awayTeam}
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
              <span>{hasFinalScore ? `${match.homeScore}-${match.awayScore}` : "VS"}</span>
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
                <span className="eyebrow">
                  <MatchAnalysisLabel />
                </span>

                <h1>{matchHeading(match)}</h1>

                {match.publishedAt ? (
                  <p className="editorial-dates">
                    <span>Published: {formatEditorialDate(match.publishedAt)}</span>
                    {modifiedAt ? (
                      <span>Updated: {formatEditorialDate(modifiedAt)}</span>
                    ) : null}
                    <ArticleByline />
                    <MethodologyLink />
                  </p>
                ) : null}
              </div>
            </div>

            <p className="match-seo-intro">{matchIntroduction(match)}</p>

            <MatchSemanticDetails match={match} forceInformation={isRestrictedSearchIntentFixture(match)} />

            <div className="match-content-ad match-content-ad--early">
              <AdSlot placement="match-top" />
            </div>

            <div className="compact-analysis-copy">
              <EditorialAnalysis analysis={match.analysis} format={match.analysisFormat} />
            </div>

            {match.comment ? (
              <aside className="editorial-comment">
                <strong>Editorial comment</strong>
                <p>{match.comment}</p>
              </aside>
            ) : null}

            <ArticleSources sources={match.sources} />

            <MatchComments matchSlug={match.slug} />

            <div className="match-content-ad">
              <AdSlot placement="match-content" />
            </div>
          </article>

          <aside className="compact-predictions-card">
            <div className="compact-card-heading">
              <div>
                <span className="eyebrow">
                  <MainPredictionLabel />
                </span>
                {isRestrictedSearchIntentFixture(match) ? (
                  <h2>Prediction and Betting Tips</h2>
                ) : null}
              </div>
            </div>

            <div className="main-prediction-block">
              <strong>{mainPrediction?.value}</strong>

              {odds ? (
                <div className="prediction-odds">
                  <span><OddsLabel /></span>
                  <b>
                    {odds.value}
                  </b>
                </div>
              ) : null}
              {latestObservedOdds ? (
                <div className="prediction-odds">
                  <span>Latest observed odds</span>
                  <b>{latestObservedOdds.value}</b>
                </div>
              ) : null}
            </div>

            <p className="compact-responsible-note">
              <ResponsibleText />
            </p>
            {match.betResult ? (
              <p className={`match-result-status bet-result bet-result--${match.betResult}`}>
                Prediction result: {match.betResult.replace("green", "won").replace("red", "lost").replace("-", " ").toUpperCase()}
              </p>
            ) : null}
            <Link className="match-results-link" href="/results/">View prediction history</Link>
          </aside>
        </div>
      </section>

      <div className="container compact-match-bottom-area">
        <AdSlot placement="match-bottom" format="rectangle" />
      </div>

      <div className="container related-predictions-area">
        <RelatedPredictions matches={selectedRelatedMatches} />
      </div>

      <PredictionLeagueCategories />
    </>
  );
}
