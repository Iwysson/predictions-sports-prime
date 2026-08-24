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

function slugSeed(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function pickMarketCategory(mainPick: string) {
  const value = mainPick.toLowerCase();
  if (value.includes("asian handicap")) return "Asian Handicap";
  if (value.includes("double chance")) return "Double Chance";
  if (value.includes("both teams to score")) return "BTTS";
  if (value.includes("corners")) return "Corners";
  if (value.includes("over") || value.includes("under")) return "Over/Under";
  if (value.includes("draw no bet")) return "Draw No Bet";
  if (value.includes("win +")) return "Combined Market";
  if (value.includes(" or draw") || value.includes("x2") || value.includes("1x")) return "Double Chance";
  if (value.includes("to win")) return "Win";
  return "Match Result";
}

function matchDescriptionPattern(match: Match) {
  return slugSeed(match.slug) % 4;
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
    const copy = buildMatchSearchIntentCopy(match);
    const league = leagues.find((item) => item.slug === match.league);
    const competition = league?.name ?? "this competition";
    const mainPick = match.predictions.find((item) => item.label === "Main Prediction")?.value;
    const odds = match.predictions.find((item) => item.label === "Odds")?.value;
    const market = mainPick ? pickMarketCategory(mainPick) : null;
    const date = match.date || "";
    const kickoff = match.time && match.time !== "TBD" ? match.time : "";
    const pattern = matchDescriptionPattern(match);
    const marketClause = market && mainPick ? `${mainPick}` : null;
    const oddsClause = odds ? ` at odds of ${odds}` : null;
    const timeClause = date ? `${date}${kickoff ? `, ${kickoff}` : ""}` : null;

    if (pattern === 0) {
      return `${match.homeTeam} vs ${match.awayTeam} prediction for ${timeClause ?? "this fixture"}. Our main pick is ${mainPick ?? "available"}${oddsClause ?? ""}, with match analysis and key betting context in ${competition}.`;
    }

    if (pattern === 1) {
      return `Read the ${match.homeTeam} vs ${match.awayTeam} match analysis for ${competition}, including our ${marketClause ?? "main"} prediction${oddsClause ?? ""} and the pre-kickoff betting context.`;
    }

    if (pattern === 2) {
      return `${competition}: ${match.homeTeam} vs ${match.awayTeam}. View our prediction${mainPick ? `, ${mainPick}` : ""}${oddsClause ?? ""} and statistical reasoning before kickoff${date ? ` on ${date}` : ""}.`;
    }

    return `Our ${match.homeTeam} vs ${match.awayTeam} betting analysis covers the main prediction${mainPick ? `, ${mainPick}` : ""}${oddsClause ?? ""} and the relevant fixture context for ${competition}.`;
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
