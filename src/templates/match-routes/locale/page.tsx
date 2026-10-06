import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { editorialPredictions } from "@/data/predictions";
import { JsonLd } from "@/components/JsonLd";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { isPublishableFuture, matchSlug } from "@/lib/match-access";
import { buildMatchPageModel } from "@/lib/match-page-model";
import { absoluteUrl } from "@/lib/site-config";
import { localePath, seoLocaleSlugs, type SeoLocaleSlug } from "@/lib/seo-locales";
import type { EditorialPrediction } from "@/types";

// Template for /[locale]/match/[slug]/. Same architecture as the English template.
// Text is translated through the project dictionaries (src/i18n/dictionaries.ts),
// with the per-key English fallback already used by the site.
export const dynamicParams = false;

function publishable() {
  return (editorialPredictions as EditorialPrediction[]).filter((p) => isPublishableFuture(p));
}

export function generateStaticParams() {
  const pages = publishable();
  return seoLocaleSlugs.flatMap((locale) => pages.map((p) => ({ locale, slug: matchSlug(p) })));
}

function isLocale(value: string): value is SeoLocaleSlug {
  return (seoLocaleSlugs as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const prediction = publishable().find((p) => matchSlug(p) === slug);
  const model = prediction && isLocale(locale) ? buildMatchPageModel(prediction, locale) : null;
  if (!model || !isLocale(locale)) return {};
  return {
    title: model.view.heading,
    description: model.view.teaser,
    alternates: { canonical: absoluteUrl(localePath(locale, `/match/${slug}/`)) },
    robots: { index: true, follow: true },
  };
}

export default async function LocalizedMatchPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const prediction = publishable().find((p) => matchSlug(p) === slug);
  const model = prediction ? buildMatchPageModel(prediction, locale) : null;
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
