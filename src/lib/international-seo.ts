import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { localePath, seoLocaleSlugs, seoLocales, type SeoLocale } from "@/lib/seo-locales";

export const allSeoLocales: SeoLocale[] = ["en", ...seoLocaleSlugs];

export function languageAlternates(path: string, locales: readonly SeoLocale[] = allSeoLocales) {
  return Object.fromEntries([
    ...locales.map((locale) => [locale === "pt-br" ? "pt-BR" : locale, absoluteUrl(localePath(locale, path))]),
    ["x-default", absoluteUrl(localePath("en", path))],
  ]);
}

export function localizedAlternates(locale: SeoLocale, path: string, locales: readonly SeoLocale[] = allSeoLocales): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(localePath(locale, path)),
    languages: languageAlternates(path, locales),
  };
}

export function localizedWebsiteJsonLd(locale: Exclude<SeoLocale, "en">) {
  const copy = seoLocales[locale];
  const url = absoluteUrl(localePath(locale));
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    name: "Predictions Sports Prime",
    url,
    description: copy.homeDescription,
    inLanguage: copy.htmlLang,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}
