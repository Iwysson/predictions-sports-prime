"use client";

import { useI18n } from "@/i18n/I18nProvider";

type Props = {
  size?: "banner" | "rectangle";
};

export function AdSlot({ size = "banner" }: Props) {
  const { t } = useI18n();

  return (
    <div
      className={`ad-slot ad-slot--${size}`}
      aria-label={t("advertisement")}
    >
      <div className="ad-copy">
        <span>{t("advertisement")}</span>
        <small>
          {size === "banner"
            ? t("responsiveBanner")
            : t("responsiveRectangle")}
        </small>
      </div>
    </div>
  );
}
