"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

const labels: Record<string, string> = {
  pt: "Nossa metodologia",
  es: "Nuestra metodología",
  fr: "Notre méthodologie",
  de: "Unsere Methodik",
  it: "La nostra metodologia",
};

export function MethodologyLink() {
  const { locale } = useI18n();
  return <Link className="methodology-link" href="/methodology/">{labels[locale] ?? "Our methodology"}</Link>;
}
