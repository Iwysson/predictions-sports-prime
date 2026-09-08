"use client";

import Link from "next/link";
import { editorialAuthor } from "@/lib/editorial-identity";
import { useI18n } from "@/i18n/I18nProvider";

const labels: Record<string, string> = {
  en: "Analysis by",
  "pt-BR": "Análise por",
  es: "Análisis por",
  fr: "Analyse par",
  de: "Analyse von",
  it: "Analisi di",
  nl: "Analyse door",
  tr: "Analiz",
};

export function ArticleByline() {
  const { locale } = useI18n();
  return (
    <span className="article-byline">
      {labels[locale] ?? labels.en}{" "}
      <Link href={editorialAuthor.path} rel="author">
        {editorialAuthor.name}
      </Link>
    </span>
  );
}
