import { Metadata } from "next";
import { Match } from "@/types";
import { leagues } from "@/data/leagues";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { editorialAuthorPersonJsonLd } from "@/lib/editorial-identity";
import { buildMatchSearchIntentCopy, shouldApplySearchIntentSEO } from "@/lib/match-search-intent";

function schemaEventStatus(status: Match["fixtureStatus"]) {
  if (status === "postponed") return "https://schema.org/EventPostponed";
  if (status === "canceled" || status === "abandoned") return "https://schema.org/EventCancelled";
  if (status === "completed") return "https://schema.org/EventCompleted";
  if (status === "in-progress") return "https://schema.org/EventInProgress";
  return "https://schema.org/EventScheduled";
}

function sportsEventLocation(match: Match) {
  if (!match.venue?.trim()) return undefined;

  return {
    "@type": "Place",
    name: match.venue.trim(),
  };
}

export function matchSeoTitle(match: Match) {
  if (shouldApplySearchIntentSEO(match)) {
    return buildMatchSearchIntentCopy(match).title;
  }
  const teams = `${match.homeTeam} vs ${match.awayTeam}`;
  const baseTitle = match.title?.trim() || `${teams} Prediction & Betting Tips`;
  const title = `${baseTitle} | ${siteConfig.name}`;

  return title.length <= 70
    ? title
    : `${teams} Prediction | ${siteConfig.name}`;
}

export function matchSeoDescription(match: Match) {
  if (shouldApplySearchIntentSEO(match)) {
    return buildMatchSearchIntentCopy(match).description;
  }
  const league = leagues.find((item) => item.slug === match.league);
  const teams = `${match.homeTeam} vs ${match.awayTeam}`;
  const competition = league?.name ?? "the competition";
  const mainPick = match.predictions.find((item) => item.label === "Main Prediction")?.value ?? "our main pick";
  const odds = match.predictions.find((item) => item.label === "Odds")?.value;
  const oddsText = odds ? ` at odds of ${odds}` : "";
  const dateText = match.date ? ` for ${match.date}` : "";
  const description = `${teams} prediction and match analysis${dateText} in ${competition}. Our main pick is ${mainPick}${oddsText}, supported by the fixture context and available data.`;

  if (description.length <= 160) return description;

  return `${teams} prediction and match analysis in ${competition}. Main pick: ${mainPick}${oddsText}.`;
}

export function matchIntroduction(match: Match) {
  if (shouldApplySearchIntentSEO(match)) {
    return buildMatchSearchIntentCopy(match).intro;
  }
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
    ...(match.date && sportsEventLocation(match)
      ? {
          about: {
            "@type": "SportsEvent",
            name: `${match.homeTeam} vs ${match.awayTeam}`,
            startDate: match.time && match.time !== "TBD"
              ? match.kickoffUtc ?? `${match.date}T${match.time}:00`
              : match.date,
            eventStatus: schemaEventStatus(match.fixtureStatus),
            location: sportsEventLocation(match),
            performer: [
              {
                "@type": "SportsTeam",
                name: match.homeTeam,
              },
              {
                "@type": "SportsTeam",
                name: match.awayTeam,
              },
            ],
            description: matchSeoDescription(match),
          },
        }
      : {}),
    author: editorialAuthorPersonJsonLd(),
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    ...(league ? { articleSection: league.name } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon-512.png"),
      width: 512,
      height: 512,
    },
  };
}

export function homePageJsonLd() {
  const url = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: siteConfig.name,
    headline: siteConfig.defaultTitle,
    description: siteConfig.description,
    inLanguage: "en",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: {
      "@type": "Thing",
      name: "Football predictions and match analysis",
    },
    publisher: { "@id": absoluteUrl("/#organization") },
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
    mainEntityOfPage: url,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
  };
}
