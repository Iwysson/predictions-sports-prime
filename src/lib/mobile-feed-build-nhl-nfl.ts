import { resolveNhlSlate } from "@/data/nhl/slates";
import { getNhlTodayKey } from "@/lib/nhl-day";
import { resolveNflWeek } from "@/data/nfl/weeks";
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

// NFL shows exactly one active week at a time, resolved by src/data/nfl/weeks.ts the same way
// buildMobileNhlIndex reuses resolveNhlSlate - so the app never shows a week the website wouldn't
// show yet.
export function buildMobileNflIndex(now: Date = new Date()): MobileSingleSlateIndex {
  const week = resolveNflWeek(getNhlTodayKey(now));
  const items = (week?.games ?? []).map(toMobileSlateItem);
  const { free, vip } = splitByTier(items);
  return { generatedAt: now.toISOString(), free, vip };
}
