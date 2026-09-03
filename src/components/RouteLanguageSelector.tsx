"use client";

import { usePathname } from "next/navigation";
import {
  localePath,
  seoLocaleSlugs,
  seoLocales,
  type SeoLocale,
} from "@/lib/seo-locales";

const fullyLocalizedMatchLocales = new Set<SeoLocale>([
  "pt-br",
  "es",
  "fr",
  "de",
  "it",
]);

function stripLocalePrefix(pathname: string) {
  for (const locale of seoLocaleSlugs) {
    const prefix = `/${locale}`;

    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return {
        path: pathname.slice(prefix.length) || "/",
        sourceLocale: locale as SeoLocale,
      };
    }
  }

  return { path: pathname, sourceLocale: "en" as SeoLocale };
}

function normalizePath(pathname: string) {
  if (pathname === "/") return "/";
  return `${pathname.replace(/\/+$/, "")}/`;
}

function isLeaguePath(path: string) {
  return /^\/league\/[^/]+\/$/.test(path);
}

function isMatchPath(path: string) {
  return /^\/match\/[^/]+\/$/.test(path);
}

function canPreservePath(
  path: string,
  sourceLocale: SeoLocale,
  targetLocale: SeoLocale
) {
  if (path === "/" || path === "/nfl/" || isLeaguePath(path)) {
    return true;
  }

  if (isMatchPath(path)) {
    if (targetLocale === "en") return true;

    return (
      sourceLocale !== "en" &&
      fullyLocalizedMatchLocales.has(sourceLocale) &&
      fullyLocalizedMatchLocales.has(targetLocale)
    );
  }

  return false;
}

export function RouteLanguageSelector({
  currentLocale = "en",
}: {
  currentLocale?: SeoLocale;
}) {
  const pathname = usePathname();
  const { path: unprefixedPath, sourceLocale } = stripLocalePrefix(pathname);
  const path = normalizePath(unprefixedPath);

  function navigate(locale: SeoLocale) {
    const targetPath = canPreservePath(path, sourceLocale, locale) ? path : "/";

    try {
      window.localStorage.setItem(
        "psp-locale",
        locale === "pt-br" ? "pt-BR" : locale
      );
    } catch {
      // Navigation must still work if storage is unavailable.
    }

    window.location.assign(localePath(locale, targetPath));
  }

  return (
    <label className="language-selector" aria-label="Language" title="Language">
      <span aria-hidden="true">◎</span>
      <select
        value={currentLocale}
        onChange={(event) => navigate(event.target.value as SeoLocale)}
      >
        <option value="en">English</option>
        {seoLocaleSlugs.map((locale) => (
          <option key={locale} value={locale}>
            {seoLocales[locale].displayName}
          </option>
        ))}
      </select>
    </label>
  );
}
