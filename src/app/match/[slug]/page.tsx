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
  matchBreadcrumbJsonLd,
  matchIntroduction,
} from "@/lib/seo";
import { buildMatchSearchIntentCopy } from "@/lib/match-search-intent";
import { selectRelatedPredictions } from "@/lib/related-predictions";
import { hydratePrediction } from "@/lib/live-predictions";
import { toMatchPreview } from "@/lib/editorial";
import type { Match } from "@/types";

async function resolveMatchFixture(match: Match): Promise<Match> {
  const fixture = await hydratePrediction(toMatchPreview(match));
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
  const seoCopy = buildMatchSearchIntentCopy(match);

  const league = leagues.find(
    (item) => item.slug === match.league
  );
  const mainPrediction = match.predictions.find(
    (item) => item.label === "Main Prediction"
  );
  const odds = match.predictions.find(
    (item) => item.label === "Odds"
  );
  const relatedMatches = selectRelatedPredictions(match, matches);

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
              <span>VS</span>
            </div>

            <div className="compact-match-team compact-match-team--away">
              <TeamBadge team={match.awayTeam} />
              <strong>{match.awayTeam}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="container match-ad-top">
        <AdSlot placement="match-top" />
      </div>

      <section className="section compact-match-content-section">
        <div className="container compact-match-layout">
          <article className="compact-analysis-card">
            <div className="compact-card-heading">
              <div>
                <span className="eyebrow">
                  <MatchAnalysisLabel />
                </span>

                <h1>{seoCopy.h1}</h1>

                {match.publishedAt ? (
                  <p className="editorial-dates">
                    <span>Published: {formatEditorialDate(match.publishedAt)}</span>
                    {match.updatedAt ? (
                      <span>Updated: {formatEditorialDate(match.updatedAt)}</span>
                    ) : null}
                    <ArticleByline />
                    <MethodologyLink />
                  </p>
                ) : null}
              </div>
            </div>

            <p className="match-seo-intro">{matchIntroduction(match)}</p>

            <div className="compact-analysis-copy">
              {match.analysis.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
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
              </div>
            </div>

            <div className="main-prediction-block">
              <strong>{mainPrediction?.value}</strong>

              {odds ? (
                <div className="prediction-odds">
                  <span><OddsLabel /></span>
                  <b>{odds.value}</b>
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
        <RelatedPredictions matches={relatedMatches} />
      </div>
    </>
  );
}
