import { resolveNhlSlate } from "@/data/nhl/slates";
import { getNhlTodayKey } from "@/lib/nhl-day";
import { NFL_WEEK5_2026 } from "@/data/nfl/week5-2026-public";
import type { NhlPublicMatch } from "@/lib/nhl-slates";
import type { NflPublicGame } from "@/lib/nfl-slates";

export type MobileSlateItem = {
  slug: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  badge: "free" | "best" | "vip";
  teaser: string;
  pick?: string;
  odds?: number;
};

function toMobileSlateItem(m: NhlPublicMatch | NflPublicGame): MobileSlateItem {
  return { slug: m.slug, title: m.title, homeTeam: m.homeTeam, awayTeam: m.awayTeam, badge: m.access, teaser: m.teaser, pick: m.pick, odds: m.odds };
}

export type MobileSingleSlateIndex = {
  generatedAt: string;
  free: MobileSlateItem[];
  vip: MobileSlateItem[];
};

function splitByTier(items: MobileSlateItem[]): { free: MobileSlateItem[]; vip: MobileSlateItem[] } {
  return {
    free: items.filter((i) => i.badge === "free"),
    vip: items.filter((i) => i.badge === "best" || i.badge === "vip"),
  };
}

// NHL shows exactly one active slate at a time on the website too (src/data/nhl/slates.ts:
// resolveNhlSlate - "the latest slate whose day has started"), never a multi-day
// Today/Tomorrow/Upcoming split. Reusing that resolver directly (not a reimplementation)
// is what keeps the app from ever showing a day the website wouldn't show yet.
export function buildMobileNhlIndex(now: Date = new Date()): MobileSingleSlateIndex {
  const slate = resolveNhlSlate(getNhlTodayKey(now));
  const items = (slate?.matches ?? []).map(toMobileSlateItem);
  const { free, vip } = splitByTier(items);
  return { generatedAt: new Date().toISOString(), free, vip };
}

// NFL currently publishes exactly one week at a time (src/data/nfl/week5-2026-public.ts) -
// there is no "current week" resolver on the website yet because nothing needs resolving
// between weeks. When a second week file is added there, port its resolver here the same
// way buildMobileNhlIndex reuses resolveNhlSlate - do not invent date-based week selection
// ahead of that.
export function buildMobileNflIndex(now: Date = new Date()): MobileSingleSlateIndex {
  const items = NFL_WEEK5_2026.map(toMobileSlateItem);
  const { free, vip } = splitByTier(items);
  return { generatedAt: now.toISOString(), free, vip };
}
