"use client";

import { usePathname } from "next/navigation";
import { localePath, seoLocaleSlugs, seoLocales, type SeoLocale } from "@/lib/seo-locales";

const localizedPilotPaths = [
  "/",
  "/league/premier-league/",
  "/league/la-liga/",
  "/match/aston-villa-vs-arsenal/",
  "/nfl/",
] as const;

function englishPath(pathname: string) {
  for (const locale of seoLocaleSlugs) {
    const prefix = `/${locale}`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }
  return pathname;
}

function normalizedPath(pathname: string) {
  const path = englishPath(pathname);
  return path === "/" ? path : `${path.replace(/\/+$/, "")}/`;
}

export function RouteLanguageSelector({ currentLocale = "en" }: { currentLocale?: SeoLocale }) {
  const pathname = usePathname();
  const path = normalizedPath(pathname);
  const hasLocalizedEquivalent = localizedPilotPaths.includes(path as typeof localizedPilotPaths[number]);

  function navigate(locale: SeoLocale) {
    const targetPath = hasLocalizedEquivalent ? path : "/";
    window.localStorage.setItem("psp-locale", locale === "pt-br" ? "pt-BR" : locale);
    window.location.assign(localePath(locale, targetPath));
  }

  return (
    <label className="language-selector" aria-label="Language" title="Language">
      <span aria-hidden="true">◎</span>
      <select value={currentLocale} onChange={(event) => navigate(event.target.value as SeoLocale)}>
        <option value="en">English</option>
        {seoLocaleSlugs.map((locale) => (
          <option key={locale} value={locale}>{seoLocales[locale].displayName}</option>
        ))}
      </select>
    </label>
  );
}
