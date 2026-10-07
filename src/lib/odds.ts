// Decimal-to-American odds conversion. Decimal odds remain the source of truth everywhere on the
// site; American odds are a display-only conversion computed at render time, never stored.
export function decimalToAmericanOdds(decimalOdds: number): number {
  if (decimalOdds >= 2) return Math.round((decimalOdds - 1) * 100);
  return Math.round(-100 / (decimalOdds - 1));
}

export function formatAmericanOdds(americanOdds: number): string {
  return americanOdds > 0 ? `+${americanOdds}` : `${americanOdds}`;
}

// Compact "1.65 (-154)" pairing used wherever decimal odds are shown.
export function formatOddsPair(decimalOdds: number): string {
  return `${decimalOdds.toFixed(2)} (${formatAmericanOdds(decimalToAmericanOdds(decimalOdds))})`;
}
