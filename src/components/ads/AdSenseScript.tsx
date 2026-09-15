"use client";

import Script from "next/script";
import { useAdConsent } from "@/lib/use-ad-consent";
import { adsConfig, canLoadAdSense } from "@/lib/ads";

export function AdSenseScript() {
  const consentGranted = useAdConsent();
  if (!canLoadAdSense()) return null;
  if (!consentGranted) return null;

  return (
    <Script
      id="adsense-delivery"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsConfig.clientId)}`}
    />
  );
}
