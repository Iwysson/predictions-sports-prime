"use client";

import {
  localeLabels,
  supportedLocales,
} from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();

  return (
    <label
      className="language-selector"
      aria-label={t("language")}
      title={t("language")}
    >
      <span aria-hidden="true">◎</span>

      <select
        value={locale}
        onChange={(event) =>
          setLocale(event.target.value as typeof locale)
        }
      >
        {supportedLocales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
