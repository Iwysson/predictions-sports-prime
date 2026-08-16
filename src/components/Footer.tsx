"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>{t("brandName")}</strong>
          <p>{t("footerDescription")}</p>
        </div>

        <p className="footer-disclaimer">
          {t("responsible")}
        </p>
      </div>
    </footer>
  );
}
