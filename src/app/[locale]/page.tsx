import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { matches } from "@/data/matches";
import { leaguesBySlug } from "@/data/leagues";
import { getLocalizedEditorial } from "@/data/localized-editorial";
import { localizedAlternates } from "@/lib/international-seo";
import { absoluteUrl } from "@/lib/site-config";
import { indexableLocalizedHubLocaleSlugs, isIndexableLocalizedHubLocale, isSeoLocale, localePath, seoLocaleSlugs, seoLocales } from "@/lib/seo-locales";

const pilotSlug = "aston-villa-vs-arsenal";

export const dynamicParams = false;
export function generateStaticParams() { return seoLocaleSlugs.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isSeoLocale(locale)) return { robots: { index: false, follow: false } };
  const copy = seoLocales[locale];
  const url = absoluteUrl(localePath(locale));
  const indexable = isIndexableLocalizedHubLocale(locale);
  return {
    title: { absolute: copy.homeTitle }, description: copy.homeDescription,
    alternates: indexable
      ? localizedAlternates(locale, "/", ["en", ...indexableLocalizedHubLocaleSlugs])
      : { canonical: url },
    robots: { index: indexable, follow: true },
    openGraph: { type: "website", title: copy.homeTitle, description: copy.homeDescription, url, siteName: "Predictions Sports Prime", locale: copy.htmlLang, images: [absoluteUrl("/og-default.png")] },
    twitter: { card: "summary_large_image", title: copy.homeTitle, description: copy.homeDescription, images: [absoluteUrl("/og-default.png")] },
  };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSeoLocale(locale)) notFound();
  const copy = seoLocales[locale];
  const match = matches.find((item) => item.slug === pilotSlug && item.status === "published");
  const editorial = match ? getLocalizedEditorial(match.slug, locale) : undefined;
  if (!match || !editorial) notFound();
  const league = leaguesBySlug[match.league];
  return <>
    <section className="page-hero home-seo-hero"><div className="container"><span className="eyebrow">Predictions Sports Prime</span><h1>{copy.homeH1}</h1><p>{copy.homeIntro}</p></div></section>
    <section className="section"><div className="container"><h2>{copy.upcoming}</h2>
      <article className="match-card"><p className="eyebrow">{league.name} · {match.date}</p><h3>{match.homeTeam} {copy.separator} {match.awayTeam}</h3><p>{editorial.analysis[0]}</p><Link href={localePath(locale, `/match/${match.slug}/`)}>{copy.viewAnalysis} →</Link></article>
    </div></section>
    <section className="section section--compact"><div className="container"><h2>{copy.leagues}</h2><p>{copy.leagueIntro(league.name)}</p><Link href={localePath(locale, `/league/${league.slug}/`)}>{copy.leagueTitle(league.name).split(" | ")[0]} →</Link></div></section>
  </>;
}
