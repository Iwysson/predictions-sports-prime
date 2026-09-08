import type { EditorialSource } from "@/types";
import { seoLocales, type SeoLocale } from "@/lib/seo-locales";
import { localizedSourceDescription, localizePresentationText } from "@/lib/localized-presentation";

const accessedLabels: Record<SeoLocale, string> = {
  en: "Accessed",
  "pt-br": "Acessado em",
  es: "Consultado",
  fr: "Consulté",
  de: "Abgerufen",
  it: "Consultato",
  nl: "Geraadpleegd",
  tr: "Erişim",
};

export function ArticleSources({
  sources,
  locale = "en",
  fallbackDescription,
}: {
  sources?: EditorialSource[];
  locale?: SeoLocale;
  fallbackDescription?: string;
}) {
  if (!sources?.length) return null;

  const heading =
    locale === "en" ? "Sources & Data" : seoLocales[locale].sources;

  return (
    <section className="article-sources" aria-labelledby="article-sources-heading">
      <h2 id="article-sources-heading">{heading}</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url}>{locale === "en" ? source.name : localizePresentationText(source.name, locale)}</a>
            {locale === "en" && source.description ? (
              <span>{source.description}</span>
            ) : locale !== "en" ? (
              <span>{fallbackDescription ?? localizedSourceDescription(locale)}</span>
            ) : fallbackDescription ? (
              <span>{fallbackDescription}</span>
            ) : null}
            {source.accessedAt ? (
              <small>
                {accessedLabels[locale]} {source.accessedAt.slice(0, 10)}
              </small>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
