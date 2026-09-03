import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads";
import { HomePredictionFeed } from "@/components/HomePredictionFeed";
import { PredictionLeagueCategories } from "@/components/PredictionLeagueCategories";
import { fullyLocalizedMatchLocales } from "@/components/LocalizedMatchDetails";
import { matches } from "@/data/matches";
import { hydratePredictions } from "@/lib/live-predictions";
import { toMatchPreview } from "@/lib/editorial";
import { localizedAlternates } from "@/lib/international-seo";
import { absoluteUrl } from "@/lib/site-config";
import {
  indexableLocalizedHubLocaleSlugs,
  isIndexableLocalizedHubLocale,
  isSeoLocale,
  localePath,
  seoLocaleSlugs,
  seoLocales,
} from "@/lib/seo-locales";
import { isInternationalMatchExpansionEligible } from "@/lib/upcoming-match";

export const dynamicParams = false;
export function generateStaticParams() {
  return seoLocaleSlugs.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isSeoLocale(locale)) return { robots: { index: false, follow: false } };
  const copy = seoLocales[locale];
  const url = absoluteUrl(localePath(locale));
  const indexable = isIndexableLocalizedHubLocale(locale);
  const title = copy.homeTitle.length <= 70 ? copy.homeTitle : copy.homeTitle.split(" | ")[0];

  return {
    title: { absolute: title },
    description: copy.homeDescription,
    alternates: indexable
      ? localizedAlternates(locale, "/", ["en", ...indexableLocalizedHubLocaleSlugs])
      : { canonical: url },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: "website",
      title,
      description: copy.homeDescription,
      url,
      siteName: "Predictions Sports Prime",
      locale: copy.htmlLang,
      images: [absoluteUrl("/og-default.png")],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.homeDescription,
      images: [absoluteUrl("/og-default.png")],
    },
  };
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSeoLocale(locale)) notFound();

  const copy = seoLocales[locale];
  const resolvedMatches = await hydratePredictions(matches.map(toMatchPreview));
  const localeSupportsExpandedMatches = fullyLocalizedMatchLocales.includes(
    locale as (typeof fullyLocalizedMatchLocales)[number]
  );
  const localizedMatchSlugs = localeSupportsExpandedMatches
    ? matches
        .filter((match) => isInternationalMatchExpansionEligible(match))
        .map((match) => match.slug)
    : [];

  return (
    <>
      <section className="page-hero home-seo-hero" aria-labelledby="home-title">
        <div className="container">
          <span className="eyebrow">Predictions Sports Prime</span>
          <h1 id="home-title">{copy.homeH1}</h1>
          <p>{copy.homeIntro}</p>
        </div>
      </section>

      <HomePredictionFeed
        matches={resolvedMatches}
        locale={locale}
        localizedMatchSlugs={localizedMatchSlugs}
        beforeHistory={
          <>
            <div className="container inline-ad-space">
              <AdSlot placement="home-middle" />
            </div>

            <PredictionLeagueCategories id="leagues" muted locale={locale} />
          </>
        }
      />

      <div className="container bottom-ad-space">
        <AdSlot placement="home-bottom" />
      </div>

      <section className="section section--compact" aria-labelledby="localized-methodology-title">
        <div className="container">
          <h2 id="localized-methodology-title">{copy.methodology}</h2>
          <p>{copy.leagueMethodology}</p>
          <p>
            <Link href="/methodology/" hrefLang="en">
              {copy.methodology}
            </Link>{" · "}
            <Link href="/results/" hrefLang="en">
              {copy.results}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
