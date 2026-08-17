import { Metadata } from "next";
import { Match } from "@/types";
import { leagues } from "@/data/leagues";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export function matchSeoTitle(match: Match) {
  const teams = `${match.homeTeam} vs ${match.awayTeam}`;
  const title = `${teams} Prediction & Betting Tips`;

  return title.length <= 70 ? title : `${teams} Prediction`;
}

export function matchSeoDescription(match: Match) {
  const league = leagues.find((item) => item.slug === match.league);
  const mainPick = match.predictions.find(
    (item) => item.label === "Main Prediction"
  )?.value;
  const odds = match.predictions.find(
    (item) => item.label === "Odds"
  )?.value;

  const context = [
    league ? `for ${league.name}` : null,
    match.date ? `on ${match.date}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const selection = mainPick
    ? ` Main pick: ${mainPick}${odds ? ` at odds of ${odds}` : ""}.`
    : " Read our match analysis and selected football tip.";

  const description =
    `${match.homeTeam} vs ${match.awayTeam} prediction and betting tips${context ? ` ${context}` : ""}.${selection}`;

  if (description.length <= 160) {
    return description;
  }

  return `${description.slice(0, 157).replace(/\s+\S*$/, "")}...`;
}

export function matchCanonicalPath(match: Match) {
  return `/match/${match.slug}/`;
}

export function buildMatchMetadata(match: Match): Metadata {
  const title = matchSeoTitle(match);
  const description = matchSeoDescription(match);
  const canonical = absoluteUrl(matchCanonicalPath(match));

  return {
    title: {
      absolute: title,
    },
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl("/og-default.png"),
          width: 1200,
          height: 630,
          alt: `${match.homeTeam} vs ${match.awayTeam} - ${siteConfig.name}`,
        },
      ],
    },

    twitter: {
      card: siteConfig.twitterCard,
      title,
      description,
      images: [absoluteUrl("/og-default.png")],
    },
  };
}

export function matchBreadcrumbJsonLd(match: Match) {
  const league = leagues.find((item) => item.slug === match.league);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: league?.name ?? "League",
        item: absoluteUrl(`/league/${match.league}/`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${match.homeTeam} vs ${match.awayTeam}`,
        item: absoluteUrl(matchCanonicalPath(match)),
      },
    ],
  };
}

export function articleJsonLd(match: Match) {
  const league = leagues.find((item) => item.slug === match.league);
  const url = absoluteUrl(matchCanonicalPath(match));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: matchSeoTitle(match),
    description: matchSeoDescription(match),
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(match.publishedAt ? { datePublished: match.publishedAt } : {}),
    ...(match.updatedAt ? { dateModified: match.updatedAt } : {}),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512.png"),
      },
    },
    about: [
      {
        "@type": "SportsEvent",
        name: `${match.homeTeam} vs ${match.awayTeam}`,
      },
      ...(league
        ? [
            {
              "@type": "SportsOrganization",
              name: league.name,
            },
          ]
        : []),
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon-512.png"),
  };
}
