import { hasLocalizedLeaguePage } from "@/data/leagues";
import { localePath, seoLocaleSlugs, type SeoLocale } from "@/lib/seo-locales";

const localePrefixes: readonly SeoLocale[] = ["en", ...seoLocaleSlugs];

export function stripLocalePrefix(pathname: string) {
  for (const locale of localePrefixes) {
    const prefix = `/${locale}`;

    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }

  return pathname;
}

export function normalizeRoutePath(pathname: string) {
  if (pathname === "/") return "/";
  return `${pathname.replace(/\/+$/, "")}/`;
}

// Localized competition pages exist only for some competitions (see hasLocalizedLeaguePage).
function isLeaguePath(path: string) {
  const match = path.match(/^\/league\/([^/]+)\/$/);
  return Boolean(match && hasLocalizedLeaguePage(match[1]));
}

export function isMatchPath(path: string) {
  return /^\/match\/[^/]+\/$/.test(path);
}

export function languageSwitcherPath(pathname: string, targetLocale: SeoLocale) {
  const path = normalizeRoutePath(stripLocalePrefix(pathname));
  const preservePath = path === "/" || path === "/nfl/" || isLeaguePath(path) || isMatchPath(path);

  return localePath(targetLocale, preservePath ? path : "/");
}
