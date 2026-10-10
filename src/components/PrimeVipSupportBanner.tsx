"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/auth/AuthProvider";
import Link from "@/components/DocumentLink";
import { useI18n } from "@/i18n/I18nProvider";

const OFFSET_PROPERTY = "--prime-vip-banner-offset";

export function PrimeVipSupportBanner() {
  const { isVip, loading } = useAuth();
  const { t } = useI18n();
  const bannerRef = useRef<HTMLElement>(null);
  const visible = !loading && !isVip;

  useEffect(() => {
    const root = document.documentElement;
    const banner = bannerRef.current;

    if (!visible || !banner) {
      root.style.removeProperty(OFFSET_PROPERTY);
      return;
    }

    const updateOffset = () => {
      root.style.setProperty(OFFSET_PROPERTY, `${Math.ceil(banner.getBoundingClientRect().height)}px`);
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(banner);

    return () => {
      observer.disconnect();
      root.style.removeProperty(OFFSET_PROPERTY);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div className="prime-vip-support-spacer" aria-hidden="true" />
      <aside ref={bannerRef} className="prime-vip-support-banner" aria-label={t("primeVipSupportLabel")}>
        <div className="prime-vip-support-banner__inner">
          <p>
            <span aria-hidden="true" className="prime-vip-support-banner__star">★</span>
            {t("primeVipSupportMessage")}
          </p>
          <Link className="prime-vip-support-banner__cta" href="/login/">
            {t("primeVipSupportCta")}
          </Link>
        </div>
      </aside>
    </>
  );
}
