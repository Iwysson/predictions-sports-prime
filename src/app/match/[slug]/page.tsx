import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { LeagueBadge } from "@/components/LeagueBadge";
import { TeamBadge } from "@/components/TeamBadge";
import { LiveMatchMeta } from "@/components/LiveMatchMeta";
import {
  MatchAnalysisLabel,
  MainPredictionLabel,
  OddsLabel,
  ResponsibleText,
} from "@/components/MatchPageLabels";
import { JsonLd } from "@/components/JsonLd";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { editorialPredictions } from "@/data/predictions";
import { predictionSlug } from "@/lib/editorial";
import {
  articleJsonLd,
  buildMatchMetadata,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  // Next.js static export requires at least one generated value for a dynamic
  // route. Draft slugs are emitted as static 404 pages and remain unpublished.
  return Array.from(
    new Set(
      editorialPredictions.map((prediction) =>
        predictionSlug(prediction.homeTeam, prediction.awayTeam)
      )
    )
  ).map((slug) => ({ slug }));
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

  return (
    <>
      <JsonLd data={articleJsonLd(match)} />

      <section className="compact-match-top">
        <div className="container">
          <div className="compact-match-breadcrumb">
            <Link href={`/league/${match.league}`}>
              ← {league?.name ?? "League"}
            </Link>
          </div>

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
        <AdSlot />
      </div>

      <section className="section compact-match-content-section">
        <div className="container compact-match-layout">
          <article className="compact-analysis-card">
            <div className="compact-card-heading">
              <div>
                <span className="eyebrow">
                  <MatchAnalysisLabel />
                </span>

                <h1>{match.title}</h1>
              </div>
            </div>

            <div className="compact-analysis-copy">
              {match.analysis.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
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
        <AdSlot size="rectangle" />
      </div>
    </>
  );
}
