import type { PredictionAccess } from "@/types";

// Public NBA slate shape, mirroring src/lib/nhl-slates.ts. Client code imports only this module's
// data, so a VIP pick, odds or analysis must never be placed here. Protected content lives in the
// functions index (functions/_data/match-content.json, built by scripts/build-match-content.mts).
export type NbaAccessTier = "free" | "best" | "vip";

export type NbaPublicMatch = {
  slug: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  venue?: string;
  time?: string;
  access: NbaAccessTier;
  badge: string;
  teaser: string;
  // Present only for FREE matches.
  pick?: string;
  odds?: number;
  analysis?: string[];
  analysisFormat?: "markdown";
  sources?: Array<{ name: string; url: string }>;
};

export type NbaPublicSlate = {
  dayKey: string;
  matches: NbaPublicMatch[];
  // IANA zone whose local midnight on `dayKey` is the earliest instant this slate may be public
  // (src/lib/nba-publication-policy.ts). Always America/Sao_Paulo per the PSP NBA publication rule.
  publicationTimezone?: string;
  // The public listing itself (teams, titles, tiers) is withheld from this client-visible registry
  // until release: `matches` is empty here and the real list lives in the server-only
  // src/data/nba/deferred-slates.ts, served by /api/nba/slate/[day] once released.
  deferred?: boolean;
};

// Sort order on a slate: FREE first, then BEST BET, then PRIME VIP. Access is never changed here.
const TIER_RANK: Record<NbaAccessTier, number> = { free: 0, best: 1, vip: 2 };
export const sortNbaMatches = (matches: NbaPublicMatch[]) =>
  [...matches].sort((a, b) => TIER_RANK[a.access] - TIER_RANK[b.access]);

export const toPredictionAccess = (tier: NbaAccessTier): PredictionAccess => (tier === "free" ? "free" : "vip");
