import { Metadata } from "next";
import { Match } from "@/types";
import { leagues } from "@/data/leagues";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { editorialAuthorPersonJsonLd } from "@/lib/editorial-identity";

export function matchSeoTitle(match: Match) {
  const teams = `${match.homeTeam} vs ${match.awayTeam}`;
  const title = `${teams} Prediction & Betting Tips | ${siteConfig.name}`;

  return title.length <= 70
    ? title
    : `${teams} Prediction | ${siteConfig.name}`;
}

export function matchSeoDescription(match: Match) {
  const league = leagues.find((item) => item.slug === match.league);
  const teams = `${match.homeTeam} vs ${match.awayTeam}`;
  const competition = league?.name ?? "the competition";
  const variants = [
    `Read our ${teams} prediction and betting analysis for this ${competition} fixture, including the main pick, available odds and key match considerations.`,
    `Explore ${teams} betting tips and match analysis for ${competition}, with our main prediction, available odds and a balanced fixture assessment.`,
    `Preview ${teams} with our ${competition} prediction, betting tips and analysis, including the selected market, available odds and important risks.`,
  ];
  const index = Array.from(match.slug).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  ) % variants.length;
  const description = variants[index];

  if (description.length <= 160) return description;

  return `Read our ${teams} prediction for ${competition}, with betting analysis, the selected market, available odds and key risks.`;
}

export function matchIntroduction(match: Match) {
  const league = leagues.find((item) => item.slug === match.league);
  const mainPick = match.predictions.find(
    (item) => item.label === "Main Prediction"
  )?.value;
  const odds = match.predictions.find(
    (item) => item.label === "Odds"
  )?.value;
  const date = match.date ? ` on ${match.date}` : "";
  const kickoff = match.time && match.time !== "TBD"
    ? ` at ${match.time}`
    : "";
  const competition = league?.name ?? "this competition";

  if (!mainPick) {
    return `${match.homeTeam} meet ${match.awayTeam} in ${competition}${date}${kickoff}. This preview outlines the match context, analysis and key considerations.`;
  }

  const price = odds ? ` at published odds of ${odds}` : "";
  return `${match.homeTeam} meet ${match.awayTeam} in ${competition}${date}${kickoff}. This preview explains the reasoning behind our ${mainPick} selection${price} and the key risks considered.`;
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
    author: editorialAuthorPersonJsonLd(),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512.png"),
      },
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(league
      ? {
          about: {
            "@type": "SportsOrganization",
            name: league.name,
          },
        }
      : {}),
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

export function institutionalPageJsonLd(
  type: "WebPage" | "AboutPage" | "ContactPage",
  name: string,
  path: string,
  description: string
) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
