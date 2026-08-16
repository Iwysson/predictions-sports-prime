"use client";

import type { AdFormat } from "@/lib/ads";
import { useI18n } from "@/i18n/I18nProvider";

export function AdPlaceholder({ format }: { format: AdFormat }) {
  const { t } = useI18n();

  return (
    <div className="ad-copy">
      <span>{t("advertisement")}</span>
      <small>
        {format === "rectangle"
          ? t("responsiveRectangle")
          : t("responsiveBanner")}
      </small>
    </div>
  );
}
