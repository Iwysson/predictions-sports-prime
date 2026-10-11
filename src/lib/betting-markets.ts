import { decimalToAmericanOdds, formatAmericanOdds } from "@/lib/odds";

/**
 * Market family of a PUBLISHED selection, read only from the pick text that is already public (free
 * predictions). Premium selections are never classified because their text is not part of the page.
 */
export type MarketFamily = "Goals" | "Both teams to score" | "Corners" | "Result and double chance" | "Handicap" | "Combined selections" | "Other markets";

export const MARKET_FAMILY_ORDER: readonly MarketFamily[] = [
  "Goals",
  "Both teams to score",
  "Corners",
  "Result and double chance",
  "Handicap",
  "Combined selections",
  "Other markets",
];

export function marketFamily(pick: string): MarketFamily {
  const text = pick.toLowerCase();
  if (/\s\+\s/.test(text)) return "Combined selections";
  if (/corner/.test(text)) return "Corners";
  if (/\bbtts\b|both teams to score/.test(text)) return "Both teams to score";
  if (/handicap|\s[+-]\d(?:\.\d)?\b/.test(text)) return "Handicap";
  if (/\b(?:over|under)\b|goals?/.test(text)) return "Goals";
  if (/\bwin\b|\bdraw\b|double chance|\b1x\b|\bx2\b|\b12\b|to win/.test(text)) return "Result and double chance";
  return "Other markets";
}

export type OddsExplainerRow = { decimal: string; american: string; implied: string };

/** Worked examples computed from the same formulas the site uses everywhere (nothing is typed by hand). */
export function oddsExplainerRows(decimalPrices: readonly number[] = [1.5, 1.91, 2, 2.5, 3]): OddsExplainerRow[] {
  return decimalPrices.map((price) => ({
    decimal: price.toFixed(2),
    american: formatAmericanOdds(decimalToAmericanOdds(price)),
    implied: `${((1 / price) * 100).toFixed(1)}%`,
  }));
}
