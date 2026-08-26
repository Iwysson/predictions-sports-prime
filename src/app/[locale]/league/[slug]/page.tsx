import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { hasCompleteLocalizedEditorial } from "@/data/localized-editorial";
import { localizedAlternates } from "@/lib/international-seo";
import { absoluteUrl } from "@/lib/site-config";
import { indexableLocalizedHubLocaleSlugs, isIndexableLocalizedHubLocale, isSeoLocale, localePath, seoLocaleSlugs, seoLocales } from "@/lib/seo-locales";

const localizedLeagueSlugs = ["premier-league"] as const;
export const dynamicParams = false;
export function generateStaticParams() { return seoLocaleSlugs.flatMap((locale) => localizedLeagueSlugs.map((slug) => ({ locale, slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const league = leagues.find((item) => item.slug === slug);
  if (!isSeoLocale(locale) || !league || !localizedLeagueSlugs.includes(slug as typeof localizedLeagueSlugs[number])) return { robots: { index: false, follow: false } };
  const copy = seoLocales[locale];
  const title = copy.leagueTitle(league.name); const description = copy.leagueDescription(league.name);
  const url = absoluteUrl(localePath(locale, `/league/${slug}/`));
  const indexable = isIndexableLocalizedHubLocale(locale);
  return {
    title: { absolute: title },
    description,
    alternates: indexable
      ? localizedAlternates(locale, `/league/${slug}/`, ["en", ...indexableLocalizedHubLocaleSlugs])
      : { canonical: url },
    robots: { index: indexable, follow: true },
    openGraph: { type: "website", title, description, url, siteName: "Predictions Sports Prime", locale: copy.htmlLang },
  };
}

export default async function LocalizedLeague({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isSeoLocale(locale) || !localizedLeagueSlugs.includes(slug as typeof localizedLeagueSlugs[number])) notFound();
  const league = leagues.find((item) => item.slug === slug); if (!league) notFound();
  const copy = seoLocales[locale];
  const localizedMatches = matches.filter((match) => match.league === league.slug && match.status === "published" && hasCompleteLocalizedEditorial(match.slug, locale));
  return <>
    <section className="league-title-bar"><div className="container league-title-inner"><div className="league-title-copy"><div><nav className="league-breadcrumb" aria-label="Breadcrumb"><Link href={localePath(locale)}>{copy.today}</Link><span aria-hidden="true">›</span><span>{league.name}</span></nav><h1>{copy.leagueTitle(league.name).split(" | ")[0]}</h1></div></div></div></section>
    <section className="section"><div className="container"><p className="league-seo-intro">{copy.leagueIntro(league.name)}</p><p>{copy.leagueMethodology}</p><h2>{copy.matchAnalysis}</h2>{localizedMatches.map((match) => <article className="match-card" key={match.slug}><h3>{match.homeTeam} {copy.separator} {match.awayTeam}</h3><p>{match.date} · {match.time}</p><Link href={localePath(locale, `/match/${match.slug}/`)}>{copy.viewAnalysis} →</Link></article>)}</div></section>
  </>;
}
