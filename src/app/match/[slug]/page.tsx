import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads";
import { LeagueBadge } from "@/components/LeagueBadge";
import { TeamBadge } from "@/components/TeamBadge";
import { LiveMatchMeta } from "@/components/LiveMatchMeta";
import { MatchSearchIntent } from "@/components/MatchSearchIntent";
import { RelatedPredictions } from "@/components/RelatedPredictions";
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
import { selectRelatedPredictions } from "@/lib/related-predictions";

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

  return buildMatchMetadata(match);
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const match = matches.find(
    (item) =>
      item.slug === slug &&
      item.status === "published"
  );

  if (!match) {
    notFound();
  }

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

                <h1>{match.homeTeam} vs {match.awayTeam} Prediction</h1>
              </div>
            </div>

            <p className="match-seo-intro">
              {matchIntroduction(match)}
            </p>

            <div className="compact-analysis-copy">
              {match.analysis.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <MatchSearchIntent
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              slug={match.slug}
            />

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
