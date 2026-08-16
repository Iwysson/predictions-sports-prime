"use client";

import Link from "next/link";
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

        <nav className="footer-links" aria-label="Legal and information">
          <Link href="/about/">{t("about")}</Link>
          <Link href="/contact/">{t("contact")}</Link>
          <Link href="/privacy/">{t("privacy")}</Link>
          <Link href="/cookies/">{t("cookies")}</Link>
          <Link href="/terms/">{t("terms")}</Link>
          <Link href="/responsible-gambling/">
            {t("responsibleGambling")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
