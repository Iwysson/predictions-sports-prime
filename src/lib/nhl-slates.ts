import type { PredictionAccess } from "@/types";

// Public NHL slate shape. Client code imports only this module's data, so a VIP pick, odds or
// analysis must never be placed here. Protected content lives in the functions index.
export type NhlAccessTier = "free" | "best" | "vip";

export type NhlPublicMatch = {
  slug: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  access: NhlAccessTier;
  badge: string;
  teaser: string;
  // Present only for FREE matches.
  pick?: string;
  odds?: number;
  analysis?: string[];
  sources?: Array<{ name: string; url: string }>;
};

export type NhlPublicMultiple = {
  title: string;
  badge: string;
  legs: Array<{
    fixture: string;
    teams: [string, string] | null;
    pick: string;
    odds: number | null;
    // Present only for a non-NHL leg, so its competition can be identified and badged (for
    // example Brasileirão Série A). An NHL leg is identified by its teams instead.
    league?: { slug: string; short: string; name: string };
  }>;
  combinedOdds: number | null;
  comment: string;
};

export type NhlPublicSlate = {
  dayKey: string;
  matches: NhlPublicMatch[];
  multiples: NhlPublicMultiple[];
};

export type MultipleSurface = "general" | "nhl" | "nfl";

export function multipleMatchesSurface(multiple: NhlPublicMultiple, surface: MultipleSurface): boolean {
  if (surface === "general") return true;
  return multiple.legs.some((leg) =>
    surface === "nhl" ? leg.teams !== null && leg.league === undefined : leg.league?.slug === "nfl",
  );
}

// Sort order on a slate: FREE first, then BEST BET, then PRIME VIP. Access is never changed here.
const TIER_RANK: Record<NhlAccessTier, number> = { free: 0, best: 1, vip: 2 };
export const sortNhlMatches = (matches: NhlPublicMatch[]) =>
  [...matches].sort((a, b) => TIER_RANK[a.access] - TIER_RANK[b.access]);

export const toPredictionAccess = (tier: NhlAccessTier): PredictionAccess => (tier === "free" ? "free" : "vip");
