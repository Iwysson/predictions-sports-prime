"use client";

import type { ReactNode } from "react";
import type { TranslationKey } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";

export type LegalSection = {
  title: string;
  content: ReactNode;
};

export function LegalPage({
  titleKey,
  heading,
  intro,
  sections,
}: {
  titleKey: TranslationKey;
  heading?: string;
  intro: string;
  sections: LegalSection[];
}) {
  const { t } = useI18n();

  return (
    <section className="section legal-page">
      <div className="container legal-container">
        <header className="legal-header">
          <span className="eyebrow">{t("brandName")}</span>
          <h1>{heading ?? t(titleKey)}</h1>
          <p>{intro}</p>
        </header>

        <div className="legal-content">
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <div>{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
