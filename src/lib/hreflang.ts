import type { Match } from "@/types";
import { searchIntentLocales } from "@/lib/match-search-intent";

type HreflangEntry = {
  locale: string;
  href: string;
};

function hasDistinctLocalizedMatchRoutes() {
  return false;
}

export function buildMatchHreflangEntries(_match: Match): HreflangEntry[] {
  if (!hasDistinctLocalizedMatchRoutes()) return [];

  return searchIntentLocales.map((locale) => ({
    locale,
    href: "",
  }));
}

export function hasLocalizedMatchRoutes() {
  return hasDistinctLocalizedMatchRoutes();
}
