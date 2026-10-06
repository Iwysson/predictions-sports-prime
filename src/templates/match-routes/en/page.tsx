import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { editorialPredictions } from "@/data/predictions";
import { leaguesBySlug } from "@/data/leagues";
import { ArticleByline } from "@/components/ArticleByline";
import { JsonLd } from "@/components/JsonLd";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { SiteContactLine } from "@/components/SiteContactLine";
import { ResponsibleGamblingNotice } from "@/components/ResponsibleGamblingNotice";
import { TeamBadge } from "@/components/TeamBadge";
import { isAdSenseContentIndexable } from "@/lib/adsense-content-quality";
import { formatMatchDate, isPublishableFuture, matchSlug } from "@/lib/match-access";
import { buildMatchPageModel } from "@/lib/match-page-model";
import { absoluteUrl } from "@/lib/site-config";
import type { EditorialPrediction } from "@/types";

// Template for /match/[slug]/. Restored by scripts/sync-match-routes.mts when a future
// prediction with a recorded kickoff exists.
//
// The page renders only the public parts of the model (src/lib/match-page-model.ts):
// - breadcrumb, header, badges (analysis and prediction tiers), byline;
// - the prediction, when its prediction access is "free";
// - the trend, when the prediction is VIP;
// - the analysis, when its analysis access is "free";
// - the gate for whatever is VIP. The gate receives only the slug and two booleans.
export const dynamicParams = false;

const ROUTE_LOCALE = "en";

function publishable() {
  return (editorialPredictions as EditorialPrediction[]).filter((p) => isPublishableFuture(p));
}

export function generateStaticParams() {
  return publishable().map((p) => ({ slug: matchSlug(p) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const prediction = publishable().find((p) => matchSlug(p) === slug);
  const model = prediction ? buildMatchPageModel(prediction, ROUTE_LOCALE) : null;
  if (!model) return {};
  return {
    title: model.seoTitle,
    description: model.view.teaser,
    alternates: { canonical: absoluteUrl(`/match/${slug}/`) },
    // Same quality gate as the sitemap: pages that fail it stay out of the index.
    robots: { index: isAdSenseContentIndexable(slug, editorialPredictions as EditorialPrediction[]), follow: true },
  };
}

export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prediction = publishable().find((p) => matchSlug(p) === slug);
  const model = prediction ? buildMatchPageModel(prediction, ROUTE_LOCALE) : null;
  if (!model || !prediction) notFound();
  // Other publishable matches in the same league, for internal links (titles only).
  // When the league has no other published match, link to other published matches instead.
  const sameLeague = publishable().filter((p) => p.league === prediction.league && matchSlug(p) !== slug);
  const related = (sameLeague.length ? sameLeague : publishable().filter((p) => matchSlug(p) !== slug)).slice(0, 4);
  const leagueName = leaguesBySlug[prediction.league]?.name ?? prediction.league;
  const v = model.view;
  const analysisFree = v.analysisAccess === "free";
  const predictionFree = v.predictionAccess === "free";

  return (
    <article className="section match-page">
      <JsonLd data={model.jsonLd} />
      <div className="container">
        <nav className="psp-crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href={`/league/${prediction.league}/`}>{leagueName}</a> /{" "}
          <span>{`${v.homeTeam} vs ${v.awayTeam}`}</span>
        </nav>

        <header className="psp-hero">
          <div className="psp-meta-row">
            <span className="psp-badge psp-badge--free">{leagueName}</span>
            {prediction.matchInfo?.round ? <span>{prediction.matchInfo.round}</span> : null}
            <span>
              {formatMatchDate(v.date)} · {v.time}
            </span>
            {prediction.matchInfo?.venue ? <span>{prediction.matchInfo.venue}</span> : null}
          </div>
          <h1>{v.heading}</h1>
          <div className="psp-chips">
            <span className={`psp-badge ${analysisFree ? "psp-badge--free" : "psp-badge--vip"}`}>
              {analysisFree ? "FREE ANALYSIS" : "PRIME VIP ANALYSIS"}
            </span>
            <span className={`psp-badge ${predictionFree ? "psp-badge--free" : "psp-badge--vip"}`}>
              {predictionFree ? "FREE PREDICTION" : "PRIME VIP PREDICTION"}
            </span>
            {prediction.bestAnalysis ? <span className="psp-badge psp-badge--best">BEST ANALYSIS</span> : null}
          </div>
          <ArticleByline />
          <p className="match-dates">
            {v.publishedDate ? `Published: ${formatMatchDate(v.publishedDate)}` : null}
            {v.publishedDate && v.updatedDate ? " · " : null}
            {v.updatedDate ? `Updated: ${formatMatchDate(v.updatedDate)}` : null}
          </p>
          <p className="match-seo-intro">{v.teaser}</p>
          <SiteContactLine />
        </header>

        <div className="psp-match-body">
          <div className="psp-match-main">
            <div className="psp-teams">
              <span className="psp-team"><TeamBadge team={v.homeTeam} /> <strong>{v.homeTeam}</strong></span>
              <span className="psp-vs">vs</span>
              <span className="psp-team"><TeamBadge team={v.awayTeam} /> <strong>{v.awayTeam}</strong></span>
            </div>

            {model.publicPrediction ? (
              <div className="psp-pick main-prediction-block">
                <div>
                  <div className="psp-pick__label">{model.labels.prediction}</div>
                  <div className="psp-pick__value">{model.publicPrediction.main}</div>
                </div>
                {model.publicPrediction.odds !== null ? (
                  <div className="psp-pick__odds">
                    <span className="psp-pick__label">{model.labels.odds}</span>
                    <strong>{model.publicPrediction.odds.toFixed(2)}</strong>
                  </div>
                ) : null}
              </div>
            ) : null}

            {model.trend ? (
              <div className="psp-trend">
                <span className="psp-trend__label">{model.labels.trend}</span>
                <span className="psp-trend__value">{model.trend}</span>
              </div>
            ) : null}

            {model.staticAnalysis ? (
              <MatchFullContent
                analysis={model.staticAnalysis.analysis}
                analysisFormat={model.staticAnalysis.analysisFormat}
                sources={model.staticAnalysis.sources}
                comment={model.staticAnalysis.comment}
                labels={model.labels}
              />
            ) : null}

            {model.gate ? (
              <div data-prediction-reveal="locked" data-protected-content="analysis" className="match-gate-slot">
                <MatchGate slug={model.gate.slug} showAnalysis={model.gate.showAnalysis} showPrediction={model.gate.showPrediction} />
              </div>
            ) : null}

            <PrimeVipOfferCard />
          </div>

          <aside className="psp-match-side">
            {related.length ? (
              <div className="psp-related">
              <section className="related-predictions">
                <h2>{sameLeague.length ? `More ${leagueName} predictions` : "More football predictions"}</h2>
                <ul>
                  {related.map((p) => (
                    <li key={matchSlug(p)}>
                      <a href={`/match/${matchSlug(p)}/`} aria-label={`${p.homeTeam} vs ${p.awayTeam} Prediction`}>
                        {`${p.homeTeam} vs ${p.awayTeam} Prediction`}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
              </div>
            ) : null}
          </aside>
        </div>

        <div className="psp-notice">
          <ResponsibleGamblingNotice />
        </div>
      </div>
    </article>
  );
}
