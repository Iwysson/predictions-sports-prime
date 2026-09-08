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

function isLeaguePath(path: string) {
  return /^\/league\/[^/]+\/$/.test(path);
}

export function isMatchPath(path: string) {
  return /^\/match\/[^/]+\/$/.test(path);
}

export function languageSwitcherPath(pathname: string, targetLocale: SeoLocale) {
  const path = normalizeRoutePath(stripLocalePrefix(pathname));
  const preservePath = path === "/" || path === "/nfl/" || isLeaguePath(path) || isMatchPath(path);

  return localePath(targetLocale, preservePath ? path : "/");
}
