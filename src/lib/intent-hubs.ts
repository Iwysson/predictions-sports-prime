import type { Metadata } from "next";
import type { MatchPreview } from "@/types";
import {
  filterTodaysPublishedPredictions,
  filterTomorrowPublishedPredictions,
  filterFuturePublishedPredictions,
  localTodayISO,
} from "@/lib/match-feed";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { MARKET_FAMILY_ORDER, marketFamily } from "@/lib/betting-markets";

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
  // Each hub answers one distinct question. The purpose is also what keeps the page list, headings and
  // static HTML different from its siblings: competition directory, date board, pick board, market
  // guide and MLS / North American soccer board.
  "football-predictions": {
    slug: "football-predictions",
    intent: "football predictions",
    title: "Football Predictions by League and Match | Predictions Sports Prime",
    h1: "Football Predictions",
    description: "Football predictions organized by competition: every league and cup with upcoming fixtures, linked to the full match analysis, published odds and sources.",
    eyebrow: "Football prediction hub",
    intro: "Start here to find a fixture. The hub lists every league and cup that currently has published pre-match football predictions, grouped by competition, and links each fixture to its own match page, where the selection, the published price, the evidence and the risks can be read in context.",
    feedTitle: "Next football fixtures with predictions",
    feedIntro: "The next fixtures in schedule order across all competitions. The competition directory further down groups the same fixtures by league.",
    guideTitle: "How the football hub is organized",
    guide: [
      "This page is the entry point for every competition: it groups the published predictions by league and cup, and each match page holds the analysis for one fixture.",
      "For a date-based view, use today's predictions. For free selections and the PRIME VIP board, use football picks. For how prices work, use football betting tips.",
    ],
    strategy: "football",
  },
  "soccer-predictions": {
    slug: "soccer-predictions",
    intent: "soccer predictions",
    title: "Soccer Predictions: MLS Picks and Matches | Predictions Sports Prime",
    h1: "Soccer Predictions",
    description: "Soccer predictions led by MLS: upcoming Major League Soccer matches by date with links to the full analysis, followed by selected international and club fixtures.",
    eyebrow: "MLS and soccer",
    intro: "MLS fixtures lead this board, with the other competitions published on the site listed after them. It uses the soccer vocabulary common in the United States and Canada (match, kickoff, conference, regular season) and links every fixture to the same match page used across the site.",
    feedTitle: "MLS first, then other soccer fixtures",
    feedIntro: "Available MLS fixtures appear first in date order; other published competitions follow, so the board stays useful when the MLS schedule is quiet.",
    guideTitle: "What the soccer board covers",
    guide: [
      "MLS predictions are grouped by date, each one linking straight to its own match page with the selection, the published price and the full analysis.",
      "Nothing here depends on where a reader is located: the same pages are available worldwide, and this board only changes the order and the terminology.",
    ],
    strategy: "soccer",
  },
  "betting-tips": {
    slug: "betting-tips",
    intent: "football betting tips",
    title: "Football Betting Tips by Market and Odds | Predictions Sports Prime",
    h1: "Football Betting Tips",
    description: "Football betting tips by market: free selections grouped as goals, corners, both teams to score, results and combined bets, with published odds and a guide to reading prices.",
    eyebrow: "Markets and odds",
    intro: "This page groups the free football selections by betting market and explains how to read the published price. Premium selections are not shown here; they stay on their PRIME VIP match pages together with the supporting analysis and the risks.",
    feedTitle: "Football selections by betting market",
    feedIntro: "Free selections are grouped by market, with the published decimal odds. Fixtures whose selection is reserved for PRIME VIP are counted but not detailed.",
    guideTitle: "Reading odds and markets",
    guide: [
      "Decimal odds are the price recorded when the selection was published. Dividing 1 by the decimal odds gives the raw implied probability; it describes the market price, not the chance that the bet wins and not a profit promise.",
      "Different markets settle on different facts. Check what a selection needs before reading the analysis: total goals, corners and both teams to score each depend on different match statistics.",
    ],
    strategy: "markets",
  },
  picks: {
    slug: "picks",
    intent: "football picks",
    title: "Football Picks and Free Selections | Predictions Sports Prime",
    h1: "Football Picks",
    description: "Football picks board: the free selections with their published odds, plus the fixtures whose pick is reserved for PRIME VIP and BEST BET members.",
    eyebrow: "Pick board",
    intro: "The pick board shows where each upcoming selection stands. Free picks are listed with their market and published odds; PRIME VIP and BEST BET fixtures are listed by name and tier, with the selection kept on the protected match page.",
    feedTitle: "Free picks and PRIME VIP fixtures",
    feedIntro: "Free selections come first, then BEST BET and PRIME VIP fixtures, each in schedule order. No ranking by confidence or popularity is applied.",
    guideTitle: "Free picks and premium picks",
    guide: [
      "A free pick is published in full, including the market and the odds. A PRIME VIP or BEST BET fixture shows its tier publicly while the pick, the odds and the premium analysis are unlocked after sign-in with an active plan.",
    ],
    strategy: "picks",
  },
  "today-predictions": {
    slug: "today-predictions",
    intent: "today's football predictions",
    title: "Today's Football Predictions | Predictions Sports Prime",
    h1: "Today's Football Predictions",
    description: "Football predictions for today's fixtures with local kick-off times and links to each full analysis; fixtures leave the page as they start.",
    eyebrow: "Today's fixtures",
    intro: "Only fixtures scheduled for the current day appear here, with their kick-off times. A match disappears from this page once it has started, and an empty day links to the next published fixtures.",
    feedTitle: "Predictions for today",
    feedIntro: "Today's fixtures in kick-off order. The day boundary follows the site's fixture timezone, and kick-off times are shown in each competition's local time.",
    guideTitle: "How the daily page works",
    guide: [
      "Kick-off data and the fixture state decide what is listed. If nothing is published for the day, the page says so and points to the football hub for later fixtures.",
    ],
    strategy: "today",
  },
};

function currentInventory(matches: MatchPreview[], now: Date | string) {
  const today = localTodayISO(now);
  const combined = [
    ...filterTodaysPublishedPredictions(matches, today, now),
    ...filterTomorrowPublishedPredictions(matches, today, now),
    ...filterFuturePublishedPredictions(matches, today, now),
  ];
  return [...new Map(combined.map((match) => [match.slug, match])).values()];
}

// The full current inventory (today, tomorrow and later), uncapped. Used by the static directory of each hub.
export function intentHubInventory(matches: MatchPreview[], now: Date | string = new Date()) {
  return currentInventory(matches, now);
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
    // Free selections (whose market text is public) first and grouped by market; premium fixtures follow.
    const rank = (match: MatchPreview) =>
      match.predictionAccess === "free" && match.mainPrediction ? MARKET_FAMILY_ORDER.indexOf(marketFamily(match.mainPrediction)) : MARKET_FAMILY_ORDER.length;
    return [...inventory].sort((left, right) => rank(left) - rank(right)).slice(0, 18);
  }
  if (definition.strategy === "picks") {
    const rank = (match: MatchPreview) => (match.predictionAccess === "free" ? 0 : match.bestAnalysis ? 1 : 2);
    return [...inventory].sort((left, right) => rank(left) - rank(right)).slice(0, 24);
  }
  return inventory.slice(0, 18);
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

