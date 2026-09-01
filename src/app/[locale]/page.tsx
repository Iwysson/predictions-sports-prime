import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fullyLocalizedMatchLocales } from "@/components/LocalizedMatchDetails";
import { matches } from "@/data/matches";
import { leaguesBySlug } from "@/data/leagues";
import { localizedAlternates } from "@/lib/international-seo";
import { absoluteUrl } from "@/lib/site-config";
import { indexableLocalizedHubLocaleSlugs, isIndexableLocalizedHubLocale, isSeoLocale, localePath, seoLocaleSlugs, seoLocales } from "@/lib/seo-locales";
import { isInternationalMatchExpansionEligible, isUpcomingMatch } from "@/lib/upcoming-match";

export const dynamicParams = false;
export function generateStaticParams() { return seoLocaleSlugs.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; if (!isSeoLocale(locale)) return { robots: { index: false, follow: false } };
  const copy = seoLocales[locale]; const url = absoluteUrl(localePath(locale)); const indexable = isIndexableLocalizedHubLocale(locale);
  const title = copy.homeTitle.length <= 70 ? copy.homeTitle : copy.homeTitle.split(" | ")[0];
  return { title: { absolute: title }, description: copy.homeDescription, alternates: indexable ? localizedAlternates(locale, "/", ["en", ...indexableLocalizedHubLocaleSlugs]) : { canonical: url }, robots: { index: indexable, follow: true }, openGraph: { type: "website", title, description: copy.homeDescription, url, siteName: "Predictions Sports Prime", locale: copy.htmlLang, images: [absoluteUrl("/og-default.png")] }, twitter: { card: "summary_large_image", title, description: copy.homeDescription, images: [absoluteUrl("/og-default.png")] } };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isSeoLocale(locale)) notFound();
  const copy = seoLocales[locale];
  const match = matches.filter((item) => item.status === "published" && isUpcomingMatch(item)).sort((left, right) => left.date.localeCompare(right.date) || left.time.localeCompare(right.time))[0];
  if (!match) notFound(); const league = leaguesBySlug[match.league];
  const hasLocalizedMatch = fullyLocalizedMatchLocales.includes(locale as (typeof fullyLocalizedMatchLocales)[number]) && isInternationalMatchExpansionEligible(match);
  return <><section className="page-hero home-seo-hero"><div className="container"><span className="eyebrow">Predictions Sports Prime</span><h1>{copy.homeH1}</h1><p>{copy.homeIntro}</p></div></section>
    <section className="section"><div className="container"><h2>{copy.upcoming}</h2><article className="match-card"><p className="eyebrow">{league.name} · {match.date}</p><h3>{match.homeTeam} {copy.separator} {match.awayTeam}</h3><Link href={hasLocalizedMatch ? localePath(locale, `/match/${match.slug}/`) : `/match/${match.slug}/`} hrefLang={hasLocalizedMatch ? copy.htmlLang : "en"}>{copy.viewAnalysis} →</Link></article></div></section>
    <section className="section section--compact"><div className="container"><h2>{copy.leagues}</h2><p>{copy.leagueIntro(league.name)}</p><Link href={localePath(locale, `/league/${league.slug}/`)}>{copy.leagueTitle(league.name).split(" | ")[0]} →</Link></div></section></>;
}
