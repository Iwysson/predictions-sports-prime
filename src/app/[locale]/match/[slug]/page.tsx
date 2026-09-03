import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import {
  fullyLocalizedMatchLocales,
  isFullyLocalizedMatchLocale,
} from "@/components/LocalizedMatchDetails";
import { LocalizedMatchPageContent } from "@/components/LocalizedMatchPageContent";
import { leaguesBySlug } from "@/data/leagues";
import { matches } from "@/data/matches";
import { localizedAlternates } from "@/lib/international-seo";
import { buildMatchSearchIntentCopy } from "@/lib/match-search-intent";
import { materialMatchUpdatedAt } from "@/lib/match-freshness";
import { absoluteUrl } from "@/lib/site-config";
import {
  isSeoLocale,
  localePath,
  seoLocaleSlugs,
  seoLocales,
  type SeoLocale,
} from "@/lib/seo-locales";
import type { SearchLocale } from "@/lib/search-intent-research";
import {
  getLocalizedEditorial,
  hasCompleteLocalizedEditorial,
  localizedEditorialBySlug,
} from "@/data/localized-editorial";
import { isInternationalMatchExpansionEligible } from "@/lib/upcoming-match";
import { buildSportsEventJsonLd } from "@/lib/sports-event-schema";
import { getTodayLocalizedEditorial } from "@/data/today-localized-editorial";

const intentLocale: Record<
  (typeof fullyLocalizedMatchLocales)[number],
  SearchLocale
> = {
  "pt-br": "pt-BR",
  es: "es",
  it: "it",
  fr: "fr",
  de: "de",
};

const alternateLocales = ["en", ...fullyLocalizedMatchLocales] as const;

function eligible(slug: string) {
  return matches.find(
    (match) =>
      match.slug === slug &&
      isInternationalMatchExpansionEligible(match)
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return seoLocaleSlugs.flatMap((locale) => {
    const slugs = new Set([
      ...Object.keys(localizedEditorialBySlug).filter((slug) =>
        hasCompleteLocalizedEditorial(slug, locale)
      ),
      ...(isFullyLocalizedMatchLocale(locale)
        ? matches
            .filter((match) =>
              isInternationalMatchExpansionEligible(match)
            )
            .map((match) => match.slug)
        : []),
    ]);

    return [...slugs].map((slug) => ({ locale, slug }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isSeoLocale(locale)) {
    return { robots: { index: false, follow: false } };
  }

  const legacy = hasCompleteLocalizedEditorial(slug, locale);

  if (!legacy && !isFullyLocalizedMatchLocale(locale)) {
    return { robots: { index: false, follow: false } };
  }

  const match = legacy
    ? matches.find(
        (item) =>
          item.slug === slug &&
          item.status === "published"
      )
    : eligible(slug);

  if (!match) {
    return { robots: { index: false, follow: false } };
  }

  if (legacy) {
    const copy = seoLocales[locale];
    const league = leaguesBySlug[match.league];
    const fullTitle = copy.matchTitle(
      match.homeTeam,
      match.awayTeam
    );
    const title =
      fullTitle.length <= 70
        ? fullTitle
        : fullTitle.replace(" | Predictions Sports Prime", "");
    const description = copy.matchDescription(
      match.homeTeam,
      match.awayTeam,
      league.name
    );
    const legacyAlternateLocales: SeoLocale[] = [
      "en",
      ...seoLocaleSlugs.filter((candidate) =>
        hasCompleteLocalizedEditorial(slug, candidate)
      ),
    ];

    return {
      title: { absolute: title },
      description,
      alternates: localizedAlternates(
        locale,
        `/match/${slug}/`,
        legacyAlternateLocales
      ),
      robots: { index: true, follow: true },
      openGraph: {
        type: "article",
        title,
        description,
        url: absoluteUrl(
          localePath(locale, `/match/${slug}/`)
        ),
        siteName: "Predictions Sports Prime",
        locale: copy.htmlLang,
        images: [absoluteUrl("/og-default.png")],
      },
    };
  }

  if (!isFullyLocalizedMatchLocale(locale)) {
    return { robots: { index: false, follow: false } };
  }

  const copy = buildMatchSearchIntentCopy(
    match,
    intentLocale[locale]
  );
  const path = `/match/${slug}/`;

  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: localizedAlternates(
      locale,
      path,
      alternateLocales
    ),
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title: copy.title,
      description: copy.description,
      url: absoluteUrl(localePath(locale, path)),
      siteName: "Predictions Sports Prime",
      locale: seoLocales[locale].htmlLang,
      images: [absoluteUrl("/og-default.png")],
    },
  };
}

export default async function LocalizedMatch({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isSeoLocale(locale)) notFound();

  if (hasCompleteLocalizedEditorial(slug, locale)) {
    const match = matches.find(
      (item) =>
        item.slug === slug &&
        item.status === "published"
    );

    if (!match) notFound();

    const editorial = getLocalizedEditorial(slug, locale)!;
    const copy = seoLocales[locale];
    const league = leaguesBySlug[match.league];
    const url = absoluteUrl(
      localePath(locale, `/match/${slug}/`)
    );
    const storedPrediction = match.predictions.find(
      (item) => item.label === "Main Prediction"
    );
    const modifiedAt = materialMatchUpdatedAt(match);

    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: copy.matchH1(
        match.homeTeam,
        match.awayTeam
      ),
      description: copy.matchDescription(
        match.homeTeam,
        match.awayTeam,
        league.name
      ),
      url,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      ...(match.publishedAt
        ? { datePublished: match.publishedAt }
        : {}),
      ...(modifiedAt
        ? { dateModified: modifiedAt }
        : {}),
      author: {
        "@id": absoluteUrl(
          "/author/iwysson-nascimento/#person"
        ),
      },
      publisher: {
        "@id": absoluteUrl("/#organization"),
      },
      inLanguage: copy.htmlLang,
      articleSection: league.name,
    };

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: copy.today,
          item: absoluteUrl(localePath(locale)),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: league.name,
          item: absoluteUrl(
            localePath(
              locale,
              `/league/${league.slug}/`
            )
          ),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${match.homeTeam} ${copy.separator} ${match.awayTeam}`,
          item: url,
        },
      ],
    };

    const sportsEvent = buildSportsEventJsonLd(match, {
      url,
      description: copy.matchDescription(
        match.homeTeam,
        match.awayTeam,
        league.name
      ),
    });

    return (
      <>
        <JsonLd data={article} />
        {sportsEvent ? (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              ...sportsEvent,
            }}
          />
        ) : null}
        <JsonLd data={breadcrumb} />

        <LocalizedMatchPageContent
          match={match}
          locale={locale}
          h1={copy.matchH1(
            match.homeTeam,
            match.awayTeam
          )}
          intro={copy.matchDescription(
            match.homeTeam,
            match.awayTeam,
            league.name
          )}
          analysis={editorial.analysis}
          analysisFormat={match.analysisFormat}
          mainPrediction={
            editorial.mainPrediction ||
            storedPrediction?.value
          }
          sourceDescription={
            editorial.sourceDescription
          }
        />
      </>
    );
  }

  if (!isFullyLocalizedMatchLocale(locale)) {
    notFound();
  }

  const match = eligible(slug);

  if (!match) notFound();

  const siteCopy = seoLocales[locale];
  const intent = buildMatchSearchIntentCopy(
    match,
    intentLocale[locale]
  );
  const league = leaguesBySlug[match.league];
  const path = `/match/${slug}/`;
  const url = absoluteUrl(localePath(locale, path));
  const modifiedAt = materialMatchUpdatedAt(match);
  const storedPrediction = match.predictions.find(
    (item) => item.label === "Main Prediction"
  );
  const localizedEditorial =
    getTodayLocalizedEditorial(match, locale);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: intent.h1,
    description: intent.description,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(match.publishedAt
      ? { datePublished: match.publishedAt }
      : {}),
    ...(modifiedAt
      ? { dateModified: modifiedAt }
      : {}),
    author: {
      "@id": absoluteUrl(
        "/author/iwysson-nascimento/#person"
      ),
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    inLanguage: siteCopy.htmlLang,
    articleSection: league.name,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteCopy.today,
        item: absoluteUrl(localePath(locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: league.name,
        item: absoluteUrl(
          localePath(
            locale,
            `/league/${league.slug}/`
          )
        ),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${match.homeTeam} ${siteCopy.separator} ${match.awayTeam}`,
        item: url,
      },
    ],
  };

  const sportsEvent = buildSportsEventJsonLd(match, {
    url,
    description: intent.description,
  });

  return (
    <>
      <JsonLd data={article} />
      {sportsEvent ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            ...sportsEvent,
          }}
        />
      ) : null}
      <JsonLd data={breadcrumb} />

      <LocalizedMatchPageContent
        match={match}
        locale={locale}
        h1={intent.h1}
        intro={intent.intro}
        analysis={
          localizedEditorial?.analysis ??
          match.analysis
        }
        analysisFormat={match.analysisFormat}
        mainPrediction={
          localizedEditorial?.mainPrediction ??
          storedPrediction?.value
        }
      />
    </>
  );
}
