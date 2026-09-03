"use client";

import Link from "next/link";
import { useState } from "react";
import { RouteLanguageSelector } from "@/components/RouteLanguageSelector";
import { useI18n } from "@/i18n/I18nProvider";
import type { SeoLocale } from "@/lib/seo-locales";

type HeaderNavItem = {
  href: string;
  label: string;
  hrefLang?: string;
};

type SiteHeaderProps = {
  brandName: string;
  brandTagline: string;
  homeHref: string;
  navItems: HeaderNavItem[];
  currentLocale?: SeoLocale;
  navigationLabel?: string;
  mobileNavigationLabel?: string;
  menuLabel?: string;
  localized?: boolean;
};

export function SiteHeader({
  brandName,
  brandTagline,
  homeHref,
  navItems,
  currentLocale = "en",
  navigationLabel = "Main navigation",
  mobileNavigationLabel = "Mobile navigation",
  menuLabel = "Open menu",
  localized = false,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header${localized ? " localized-site-header" : ""}`}>
      <div className="container header-inner">
        <Link href={homeHref} className="brand" onClick={() => setOpen(false)}>
          <svg
            className="brand-symbol"
            viewBox="0 0 48 48"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M8 25.5 19.5 37 41 11.5" />
          </svg>

          <span className="brand-copy">
            <strong>{brandName}</strong>
            <small>{brandTagline}</small>
          </span>
        </Link>

        <div className="header-actions">
          <nav className="desktop-nav" aria-label={navigationLabel}>
            {navItems.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                {...(item.hrefLang ? { hrefLang: item.hrefLang } : {})}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <RouteLanguageSelector currentLocale={currentLocale} />

          <button
            className="menu-button"
            type="button"
            aria-label={menuLabel}
            aria-expanded={open}
            aria-controls="site-mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="site-mobile-navigation"
          className="mobile-nav"
          aria-label={mobileNavigationLabel}
        >
          <div className="container">
            {navItems.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                {...(item.hrefLang ? { hrefLang: item.hrefLang } : {})}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function Header() {
  const { t } = useI18n();

  return (
    <SiteHeader
      brandName={t("brandName")}
      brandTagline={t("brandTagline")}
      homeHref="/"
      currentLocale="en"
      navItems={[
        { href: "/", label: t("home") },
        { href: "/#today", label: t("today") },
        { href: "/#leagues", label: t("leagues") },
        { href: "/nfl/", label: "NFL" },
        { href: "/results/", label: "Results" },
        { href: "/methodology/", label: "Methodology" },
      ]}
    />
  );
}
