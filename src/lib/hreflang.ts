import type { Match } from "@/types";
import type { SearchLocale } from "@/lib/search-intent-research";
import { absoluteUrl } from "@/lib/site-config";

type HreflangEntry = {
  locale: string;
  href: string;
};

type LocalizedMatchPathBuilder = (match: Match) => string;

// Keep this empty until crawlable, indexable localized routes actually exist.
const localizedMatchPathBuilders: Partial<Record<SearchLocale, LocalizedMatchPathBuilder>> = {};

function configuredLocalizedPaths(match: Match) {
  return Object.entries(localizedMatchPathBuilders)
    .map(([locale, buildPath]) => ({
      locale,
      path: buildPath?.(match) ?? "",
    }))
    .filter((entry) => entry.path.startsWith("/"));
}

export function buildMatchHreflangEntries(match: Match): HreflangEntry[] {
  const localizedPaths = configuredLocalizedPaths(match);
  const uniquePaths = new Set(localizedPaths.map((entry) => entry.path));
  if (localizedPaths.length < 2 || uniquePaths.size !== localizedPaths.length) return [];

  const entries = localizedPaths.map((entry) => ({
    locale: entry.locale,
    href: absoluteUrl(entry.path),
  }));
  const defaultEntry = entries.find((entry) => entry.locale === "en") ?? entries[0];
  return [...entries, { locale: "x-default", href: defaultEntry.href }];
}

export function hasLocalizedMatchRoutes() {
  return Object.keys(localizedMatchPathBuilders).length >= 2;
}
