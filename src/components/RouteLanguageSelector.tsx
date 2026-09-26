"use client";

import { usePathname } from "next/navigation";
import {
  selectableLocaleSlugs,
  seoLocales,
  type SeoLocale,
} from "@/lib/seo-locales";
import { languageSwitcherPath } from "@/lib/locale-route";

export function RouteLanguageSelector({
  currentLocale = "en",
}: {
  currentLocale?: SeoLocale;
}) {
  const pathname = usePathname();

  function navigate(locale: SeoLocale) {
    try {
      window.localStorage.setItem(
        "psp-locale",
        locale === "pt-br" ? "pt-BR" : locale
      );
    } catch {
      // Navigation must still work if storage is unavailable.
    }

    window.location.assign(languageSwitcherPath(pathname, locale));
  }

  return (
    <label className="language-selector" aria-label="Language" title="Language">
      <span aria-hidden="true">◎</span>
      <select
        value={currentLocale === "pt-br" ? "" : currentLocale}
        onChange={(event) => navigate(event.target.value as SeoLocale)}
      >
        {currentLocale === "pt-br" ? <option value="" hidden disabled>Language</option> : null}
        <option value="en">English</option>
        {selectableLocaleSlugs.map((locale) => (
          <option key={locale} value={locale}>
            {seoLocales[locale].displayName}
          </option>
        ))}
      </select>
    </label>
  );
}
