import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { editorialPredictions } from "@/data/predictions";
import { JsonLd } from "@/components/JsonLd";
import { ArticleByline } from "@/components/ArticleByline";
import { leaguesBySlug } from "@/data/leagues";
import { isAdSenseContentIndexable } from "@/lib/adsense-content-quality";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { isPublishableFuture, matchSlug } from "@/lib/match-access";
import { buildMatchPageModel } from "@/lib/match-page-model";
import { absoluteUrl } from "@/lib/site-config";
import { localePath, seoLocaleSlugs, type SeoLocaleSlug } from "@/lib/seo-locales";
import type { EditorialPrediction } from "@/types";

// Template for /[locale]/match/[slug]/. Restored by scripts/sync-match-routes.mts when a future
// prediction with a recorded kickoff exists.
//
// The page renders only the public parts of the model (src/lib/match-page-model.ts):
// - public JSON-LD (teams, league, kickoff, venue when recorded, canonical);
// - the prediction, when its prediction access is "free";
// - the trend, when the prediction is VIP;
// - the analysis, when its analysis access is "free";
// - the gate for whatever is VIP. The gate receives only the slug and two booleans.
export const dynamicParams = false;

function publishable() {
  return (editorialPredictions as EditorialPrediction[]).filter((p) => isPublishableFuture(p));
}

function isLocale(value: string): value is SeoLocaleSlug {
  return (seoLocaleSlugs as readonly string[]).includes(value);
}

export function generateStaticParams() {
  const pages = publishable();
  return seoLocaleSlugs.flatMap((locale) => pages.map((p) => ({ locale, slug: matchSlug(p) })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const prediction = publishable().find((p) => matchSlug(p) === slug);
  if (!isLocale(locale)) return {};
  const model = prediction ? buildMatchPageModel(prediction, locale) : null;
  if (!model) return {};
  return {
    title: model.seoTitle,
    description: model.view.teaser,
    alternates: { canonical: absoluteUrl(localePath(locale, `/match/${slug}/`)) },
    // Same quality gate as the sitemap: pages that fail it stay out of the index.
    robots: { index: isAdSenseContentIndexable(slug, editorialPredictions as EditorialPrediction[]), follow: true },
  };
}

export default async function MatchPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const prediction = publishable().find((p) => matchSlug(p) === slug);
  const model = prediction ? buildMatchPageModel(prediction, locale) : null;
  if (!model || !prediction) notFound();
  const related = publishable().filter((q) => q.league === prediction.league && matchSlug(q) !== slug).slice(0, 4);

  return (
    <article className="match-page">
      <JsonLd data={model.jsonLd} />
      <header>
        <span className="eyebrow">{model.view.kicker}</span>
        <ArticleByline />
        <h1>{model.view.heading}</h1>
        <p>
          {model.view.league} · {model.view.date} · {model.view.time}
          {model.view.round ? ` · ${model.view.round}` : ""}
        </p>
        <p className="match-seo-intro">{model.view.teaser}</p>
        <p>
          <a href={`/league/${model.view.league}/`}>{leaguesBySlug[prediction.league]?.name ?? prediction.league} predictions</a>
        </p>
        <p className="match-dates">
          {model.view.publishedDate ? `Published: ${model.view.publishedDate}` : null}
          {model.view.publishedDate && model.view.updatedDate ? " · " : null}
          {model.view.updatedDate ? `Updated: ${model.view.updatedDate}` : null}
        </p>
      </header>
      {model.publicPrediction ? (
        <p className="match-prediction main-prediction-block">
          <strong>{model.labels.prediction}:</strong> {model.publicPrediction.main}
          {model.publicPrediction.odds !== null ? <> · <strong>{model.labels.odds}:</strong> {model.publicPrediction.odds.toFixed(2)}</> : null}
        </p>
      ) : null}
      {model.trend ? (
        <p className="match-trend">
          <strong>{model.labels.trend}:</strong> {model.trend}
        </p>
      ) : null}
      {model.staticAnalysis ? (
        <MatchFullContent
          analysis={model.staticAnalysis.analysis}
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
      {related.length ? (
        <section className="related-predictions">
          <h2>More {leaguesBySlug[prediction.league]?.name ?? prediction.league} predictions</h2>
          <ul>
            {related.map((q) => (
              <li key={matchSlug(q)}>
                <a href={`/match/${matchSlug(q)}/`} aria-label={`${q.homeTeam} vs ${q.awayTeam} Prediction`}>{`${q.homeTeam} vs ${q.awayTeam} Prediction`}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
