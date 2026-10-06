import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { editorialPredictions } from "@/data/predictions";
import { JsonLd } from "@/components/JsonLd";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { isPublishableFuture, matchSlug } from "@/lib/match-access";
import { buildMatchPageModel } from "@/lib/match-page-model";
import { absoluteUrl } from "@/lib/site-config";
import type { EditorialPrediction } from "@/types";

// Template for /match/[slug]/. Restored by scripts/sync-match-routes.mts when a future
// prediction with a recorded kickoff exists.
//
// The page renders only the public model (see src/lib/match-page-model.ts):
// - public JSON-LD (teams, league, kickoff, venue when recorded, canonical);
// - FREE predictions in full;
// - VIP predictions as teaser + gate. The gate receives only the slug and loads
//   the protected content from /api/match-content/[slug] after authorisation.
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
    title: model.view.heading,
    description: model.view.teaser,
    alternates: { canonical: absoluteUrl(`/match/${slug}/`) },
    robots: { index: true, follow: true },
  };
}

export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prediction = publishable().find((p) => matchSlug(p) === slug);
  const model = prediction ? buildMatchPageModel(prediction, ROUTE_LOCALE) : null;
  if (!model) notFound();

  return (
    <article className="match-page">
      <JsonLd data={model.jsonLd} />
      <header>
        <span className="eyebrow">{model.view.kicker}</span>
        <h1>{model.view.heading}</h1>
        <p>
          {model.view.league} · {model.view.date} · {model.view.time}
          {model.view.round ? ` · ${model.view.round}` : ""}
        </p>
        <p>{model.view.teaser}</p>
      </header>
      {model.full ? <MatchFullContent full={model.full} labels={model.labels} /> : <MatchGate slug={model.gate!.slug} />}
    </article>
  );
}
