"use client";

import { TranslationKey } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";

export function SectionTitle({
  icon,
  eyebrowKey,
  titleKey,
}: {
  icon: string;
  eyebrowKey: TranslationKey;
  titleKey: TranslationKey;
}) {
  const { t } = useI18n();

  return (
    <div className="section-heading section-heading--compact">
      <div className="heading-with-icon">
        <span className="section-icon">{icon}</span>

        <div>
          <span className="eyebrow">{t(eyebrowKey)}</span>
          <h2>{t(titleKey)}</h2>
        </div>
      </div>
    </div>
  );
}
