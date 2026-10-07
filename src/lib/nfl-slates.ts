import type { PredictionAccess } from "@/types";

// Public NFL week shape. Client code imports only this module's data, so a BEST BET or PRIME VIP
// pick, odds or analysis must never be placed here. Protected content lives in the functions index.
export type NflAccessTier = "free" | "best" | "vip";

export type NflPublicGame = {
  slug: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  access: NflAccessTier;
  badge: string;
  teaser: string;
  date: string;
  kickoff: string;
  timezone: string;
  stadium: string;
  city: string;
  state: string;
  // Present only for FREE games.
  pick?: string;
  odds?: number;
  analysis?: string[];
  sources?: Array<{ name: string; url: string }>;
};

// Sort order on the week page: FREE first, then BEST BET, then PRIME VIP. Access is never changed here.
const TIER_RANK: Record<NflAccessTier, number> = { free: 0, best: 1, vip: 2 };
export const sortNflGames = (games: NflPublicGame[]) =>
  [...games].sort((a, b) => TIER_RANK[a.access] - TIER_RANK[b.access]);

export const toPredictionAccess = (tier: NflAccessTier): PredictionAccess => (tier === "free" ? "free" : "vip");
