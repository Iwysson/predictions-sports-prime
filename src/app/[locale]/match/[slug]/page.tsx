import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { localizedEditorialBySlug, getLocalizedEditorial, hasCompleteLocalizedEditorial } from "@/data/localized-editorial";
import { leaguesBySlug } from "@/data/leagues";
import { matches } from "@/data/matches";
import { localizedAlternates } from "@/lib/international-seo";
import { absoluteUrl } from "@/lib/site-config";
import { isSeoLocale, localePath, seoLocaleSlugs, seoLocales } from "@/lib/seo-locales";

export const dynamicParams = false;
export function generateStaticParams() { return seoLocaleSlugs.flatMap((locale) => Object.keys(localizedEditorialBySlug).filter((slug) => hasCompleteLocalizedEditorial(slug, locale)).map((slug) => ({ locale, slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const match = matches.find((item) => item.slug === slug && item.status === "published");
  if (!isSeoLocale(locale) || !match || !hasCompleteLocalizedEditorial(slug, locale)) return { robots: { index: false, follow: false } };
  const copy = seoLocales[locale]; const league = leaguesBySlug[match.league];
  const title = copy.matchTitle(match.homeTeam, match.awayTeam); const description = copy.matchDescription(match.homeTeam, match.awayTeam, league.name);
  return { title: { absolute: title }, description, alternates: localizedAlternates(locale, `/match/${slug}/`), robots: { index: true, follow: true }, openGraph: { type: "article", title, description, url: absoluteUrl(localePath(locale, `/match/${slug}/`)), siteName: "Predictions Sports Prime", locale: copy.htmlLang, images: [absoluteUrl("/og-default.png")] } };
}

export default async function LocalizedMatch({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const match = matches.find((item) => item.slug === slug && item.status === "published");
  if (!isSeoLocale(locale) || !match || !hasCompleteLocalizedEditorial(slug, locale)) notFound();
  const editorial = getLocalizedEditorial(slug, locale)!; const copy = seoLocales[locale]; const league = leaguesBySlug[match.league];
  const url = absoluteUrl(localePath(locale, `/match/${slug}/`));
  const mainPrediction = match.predictions.find((item) => item.label === "Main Prediction");
  const odds = match.predictions.find((item) => item.label === "Odds");
  const article = { "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`, headline: copy.matchH1(match.homeTeam, match.awayTeam), description: copy.matchDescription(match.homeTeam, match.awayTeam, league.name), url, mainEntityOfPage: { "@type": "WebPage", "@id": url }, ...(match.publishedAt ? { datePublished: match.publishedAt } : {}), ...(match.updatedAt ? { dateModified: match.updatedAt } : {}), author: { "@id": absoluteUrl("/author/iwysson-nascimento/#person") }, publisher: { "@id": absoluteUrl("/#organization") }, inLanguage: copy.htmlLang, articleSection: league.name };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: copy.today, item: absoluteUrl(localePath(locale)) },
    { "@type": "ListItem", position: 2, name: league.name, item: absoluteUrl(localePath(locale, `/league/${league.slug}/`)) },
    { "@type": "ListItem", position: 3, name: `${match.homeTeam} ${copy.separator} ${match.awayTeam}`, item: url },
  ] };
  return <>
    <JsonLd data={article} /><JsonLd data={breadcrumb} />
    <section className="compact-match-top"><div className="container"><nav className="compact-match-breadcrumb" aria-label="Breadcrumb"><Link href={localePath(locale)}>{copy.today}</Link><span>›</span><Link href={localePath(locale, `/league/${league.slug}/`)}>{league.name}</Link><span>›</span><span>{match.homeTeam} {copy.separator} {match.awayTeam}</span></nav><div className="compact-match-scoreboard"><div className="compact-match-team"><strong>{match.homeTeam}</strong></div><div className="compact-match-vs"><span>VS</span></div><div className="compact-match-team"><strong>{match.awayTeam}</strong></div></div></div></section>
    <section className="section compact-match-content-section"><div className="container compact-match-layout"><article className="compact-analysis-card"><div className="compact-card-heading"><div><span className="eyebrow">{copy.matchAnalysis}</span><h1>{copy.matchH1(match.homeTeam, match.awayTeam)}</h1>{match.publishedAt ? <p className="editorial-dates">{copy.published}: {new Intl.DateTimeFormat(copy.htmlLang, { dateStyle: "long", timeZone: "UTC" }).format(new Date(match.publishedAt))}</p> : null}</div></div><div className="compact-analysis-copy">{editorial.analysis.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><h2>{copy.sources}</h2>{match.sources?.map((source) => <p key={source.url}><a href={source.url} rel="noopener noreferrer">{source.name}</a> — {editorial.sourceDescription}</p>)}</article><aside className="compact-predictions-card"><span className="eyebrow">{copy.mainPrediction}</span><div className="main-prediction-block"><strong>{editorial.mainPrediction || mainPrediction?.value}</strong>{odds ? <div className="prediction-odds"><span>{copy.odds}</span><b>{odds.value}</b></div> : null}</div><p className="compact-responsible-note">{copy.responsible}</p></aside></div></section>
  </>;
}
