"use client";

import Link from "@/components/DocumentLink";
import { useI18n } from "@/i18n/I18nProvider";

const labels: Record<string, string> = {
  en: "Our methodology",
  "pt-BR": "Nossa metodologia",
  es: "Nuestra metodología",
  fr: "Notre méthodologie",
  de: "Unsere Methodik",
  it: "La nostra metodologia",
  nl: "Onze methodologie",
  tr: "Metodolojimiz",
};

export function MethodologyLink() {
  const { locale } = useI18n();
  return <Link className="methodology-link" href="/methodology/" hrefLang="en">{labels[locale] ?? labels.en}</Link>;
}
