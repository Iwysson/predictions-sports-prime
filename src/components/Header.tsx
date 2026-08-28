"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/i18n/I18nProvider";

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <svg
            className="brand-symbol"
            viewBox="0 0 48 48"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M8 25.5 19.5 37 41 11.5" />
          </svg>

          <span className="brand-copy">
            <strong>{t("brandName")}</strong>
            <small>{t("brandTagline")}</small>
          </span>
        </Link>

        <div className="header-actions">
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/">{t("home")}</Link>
            <Link href="/#today">{t("today")}</Link>
            <Link href="/#leagues">{t("leagues")}</Link>
            <Link href="/nfl/">NFL</Link>
            <Link href="/results/">Results</Link>
            <Link href="/methodology/">Methodology</Link>
          </nav>

          <LanguageSelector />

          <button
            className="menu-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="container">
            <Link href="/" onClick={() => setOpen(false)}>
              {t("home")}
            </Link>
            <Link href="/#today" onClick={() => setOpen(false)}>
              {t("today")}
            </Link>
            <Link href="/#leagues" onClick={() => setOpen(false)}>
              {t("leagues")}
            </Link>
            <Link href="/nfl/" onClick={() => setOpen(false)}>NFL</Link>
            <Link href="/results/" onClick={() => setOpen(false)}>Results</Link>
            <Link href="/methodology/" onClick={() => setOpen(false)}>Methodology</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
