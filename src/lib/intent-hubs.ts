import type { Metadata } from "next";
import type { MatchPreview } from "@/types";
import { leagues } from "@/data/leagues";
import {
  filterTodaysPublishedPredictions,
  filterTomorrowPublishedPredictions,
  filterFuturePublishedPredictions,
  localTodayISO,
} from "@/lib/match-feed";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const intentHubSlugs = [
  "football-predictions",
  "soccer-predictions",
  "betting-tips",
  "picks",
  "today-predictions",
] as const;

export type IntentHubSlug = (typeof intentHubSlugs)[number];
type FeedStrategy = "football" | "soccer" | "markets" | "picks" | "today";

export type IntentHubDefinition = {
  slug: IntentHubSlug;
  intent: string;
  title: string;
  h1: string;
  description: string;
  eyebrow: string;
  intro: string;
  feedTitle: string;
  feedIntro: string;
  guideTitle: string;
  guide: readonly string[];
  strategy: FeedStrategy;
};

export const intentHubDefinitions: Record<IntentHubSlug, IntentHubDefinition> = {
  "football-predictions": {
    slug: "football-predictions",
    intent: "football predictions",
    title: "Football Predictions and Match Analysis | Predictions Sports Prime",
    h1: "Football Predictions",
    description: "Published football predictions with recorded picks, available odds, fixture context and links to complete match analysis across major competitions.",
    eyebrow: "Football prediction hub",
    intro: "Browse the current pre-match football inventory across domestic leagues and international competitions. Each fixture links to its own analysis, where the selection, published price when available, evidence and risks can be read in context.",
    feedTitle: "Current football predictions",
    feedIntro: "Fixtures are ordered from the active pre-match schedule, with today's matches followed by the next available games.",
    guideTitle: "Using the football prediction hub",
    guide: [
      "Start with the fixture and main prediction, then open the full preview to assess the supporting evidence and the ways the selection could fail.",
      "Competition pages provide a narrower league view, while the methodology explains how editorial selections and recorded prices are handled.",
    ],
    strategy: "football",
  },
  "soccer-predictions": {
    slug: "soccer-predictions",
    intent: "soccer predictions",
    title: "Soccer Predictions: MLS and Global Picks | Predictions Sports Prime",
    h1: "Soccer Predictions",
    description: "Soccer predictions for MLS and selected global fixtures, organized for readers who use US soccer terminology and want direct match previews.",
    eyebrow: "US soccer terminology",
    intro: "This hub presents the site's current soccer previews with MLS shown first when published fixtures are available. It also includes selected international and club matches from the same canonical pre-match inventory, without inferring a visitor's location or preferences.",
    feedTitle: "MLS-first soccer preview feed",
    feedIntro: "Available MLS fixtures lead the list; other current competitions follow in chronological order so the page remains useful when the MLS schedule is quiet.",
    guideTitle: "What this soccer view emphasizes",
    guide: [
      "The terminology and organization are intended for English-language readers accustomed to soccer, with an explicit MLS entry point rather than a renamed copy of the general football hub.",
      "Every selection still opens the same canonical match analysis, and no popularity, confidence or geographic targeting is inferred.",
    ],
    strategy: "soccer",
  },
  "betting-tips": {
    slug: "betting-tips",
    intent: "football betting tips",
    title: "Football Betting Tips and Odds | Predictions Sports Prime",
    h1: "Football Betting Tips",
    description: "Football betting tips focused on the published market, selection, available odds, supporting rationale and material risks for upcoming fixtures.",
    eyebrow: "Market-focused analysis",
    intro: "Review current editorial selections through a market-focused lens. Cards show the recorded selection and published odds only when those values exist; the linked match page contains the fuller reasoning and risks.",
    feedTitle: "Published betting selections",
    feedIntro: "Selections with a recorded price are presented first, followed by valid current predictions whose market analysis is available without a displayed price.",
    guideTitle: "How to read these betting tips",
    guide: [
      "Decimal odds describe the recorded market price, not a promise of profit or a confidence score. Compare that price with the evidence and contrary scenarios in the complete analysis.",
      "Markets can require different facts to settle. Read the selection precisely and use the responsible-gambling guidance before making any decision.",
    ],
    strategy: "markets",
  },
  picks: {
    slug: "picks",
    intent: "football picks",
    title: "Football Picks and Published Selections | Predictions Sports Prime",
    h1: "Football Picks",
    description: "A concise view of current football picks, fixtures, published selections, available odds and direct links to each complete analysis.",
    eyebrow: "Concise selection board",
    intro: "Scan the current published picks without an artificial ranking. This board keeps the fixture, selection and available price together, while the full reasoning remains on the canonical match page.",
    feedTitle: "Current editorial picks",
    feedIntro: "The board follows the current fixture schedule. It does not label picks as best, safest or highest-confidence because no such ranking is assigned.",
    guideTitle: "From pick to analysis",
    guide: [
      "Use this page for comparison and navigation, then open a fixture before interpreting the selection. The complete preview carries the match context and material risks that a compact board cannot reproduce.",
    ],
    strategy: "picks",
  },
  "today-predictions": {
    slug: "today-predictions",
    intent: "today's football predictions",
    title: "Today's Football Predictions | Predictions Sports Prime",
    h1: "Today's Football Predictions",
    description: "Today's published football predictions, using the site's canonical fixture timezone and lifecycle rules with links to complete match analysis.",
    eyebrow: "Today's fixture state",
    intro: "This page contains only published predictions classified as today by the site's existing fixture-time and lifecycle engine. Tomorrow's fixtures, later upcoming games and matches that have moved into history are excluded automatically.",
    feedTitle: "Predictions available today",
    feedIntro: "The date boundary follows the site's canonical fixture timezone. A fixture leaves this view naturally as its lifecycle changes; its source record is not rewritten.",
    guideTitle: "How today's page stays current",
    guide: [
      "Kickoff metadata and fixture state determine eligibility. If no valid published prediction is available today, the page explains the empty state and links to the broader upcoming inventory.",
      "Open any listed fixture for the recorded pick, price when available, full analysis and risk discussion.",
    ],
    strategy: "today",
  },
};

function currentInventory(matches: MatchPreview[], now: Date | string) {
  const today = localTodayISO(now);
  const combined = [
    ...filterTodaysPublishedPredictions(matches, today, now),
    ...filterTomorrowPublishedPredictions(matches, today),
    ...filterFuturePublishedPredictions(matches, today),
  ];
  return [...new Map(combined.map((match) => [match.slug, match])).values()];
}

export function selectIntentHubMatches(slug: IntentHubSlug, matches: MatchPreview[], now: Date | string = new Date()) {
  const definition = intentHubDefinitions[slug];
  const inventory = definition.strategy === "today"
    ? filterTodaysPublishedPredictions(matches, localTodayISO(now), now)
    : currentInventory(matches, now);
  if (definition.strategy === "soccer") {
    return [...inventory].sort((left, right) => Number(right.league === "mls") - Number(left.league === "mls")).slice(0, 18);
  }
  if (definition.strategy === "markets") {
    return [...inventory].sort((left, right) => Number(right.odds != null) - Number(left.odds != null)).slice(0, 18);
  }
  return inventory.slice(0, definition.strategy === "picks" ? 24 : 18);
}

export function intentHubMetadata(slug: IntentHubSlug): Metadata {
  const hub = intentHubDefinitions[slug];
  const path = `/${slug}/`;
  const canonical = absoluteUrl(path);
  return {
    title: { absolute: hub.title },
    description: hub.description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { type: "website", title: hub.title, description: hub.description, url: canonical, siteName: siteConfig.name, images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: `${hub.h1} — ${siteConfig.name}` }] },
    twitter: { card: siteConfig.twitterCard, title: hub.title, description: hub.description, images: [absoluteUrl("/og-default.png")] },
  };
}

export function intentHubJsonLd(slug: IntentHubSlug, entries: MatchPreview[]) {
  const hub = intentHubDefinitions[slug];
  const url = absoluteUrl(`/${slug}/`);
  return [
    { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${url}#webpage`, name: hub.h1, description: hub.description, url, inLanguage: "en", isPartOf: { "@id": absoluteUrl("/#website") }, publisher: { "@id": absoluteUrl("/#organization") } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: hub.h1, item: url },
    ] },
    ...(entries.length ? [{ "@context": "https://schema.org", "@type": "ItemList", name: hub.feedTitle, numberOfItems: entries.length, itemListElement: entries.map((match, index) => ({ "@type": "ListItem", position: index + 1, name: `${match.homeTeam} vs ${match.awayTeam}`, url: absoluteUrl(`/match/${match.slug}/`) })) }] : []),
  ];
}

export function intentHubLeagueLinks(entries: MatchPreview[]) {
  const available = new Set(entries.map((entry) => entry.league));
  return leagues.filter((league) => available.has(league.slug)).slice(0, 8);
}
