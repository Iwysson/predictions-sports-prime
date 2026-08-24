import type { MarketIntentKey } from "@/lib/search-intent-research";

export function normalizeMainPick(value: string | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

export function detectPickMarkets(mainPick: string): MarketIntentKey[] {
  const value = normalizeMainPick(mainPick).toLowerCase();
  if (!value) return [];

  const markets: MarketIntentKey[] = [];
  if (/asian handicap|handicap/.test(value)) markets.push("ASIAN_HANDICAP");
  if (/\bover\b|\bunder\b|over\/under/.test(value)) markets.push("OVER_UNDER");
  if (/both teams to score|\bbtts\b/.test(value)) markets.push("BTTS");
  if (/double chance|\b1x\b|\bx2\b|\b12\b| or draw/.test(value)) markets.push("DOUBLE_CHANCE");
  if (/corner/.test(value)) markets.push("CORNERS");
  if (/draw no bet/.test(value)) markets.push("DRAW_NO_BET");
  if (/to win|match winner/.test(value)) markets.push("WIN");
  if (markets.length > 1 || /\+/.test(value)) markets.push("COMBINED");

  return [...new Set(markets)];
}
