"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  enqueueGtag,
  pageViewKey,
  readAnalyticsConsent,
  shouldTrackPageView,
  updateAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsentChoice,
} from "@/lib/analytics-consent";

/**
 * GA4 with Consent Mode v2. Defaults (all denied) are set in ConsentIntegration, before this
 * component or gtag.js ever runs. Per Google's own Consent Mode design, gtag.js must load
 * unconditionally and is told to behave via `consent` state, not via whether the script tag
 * exists at all: when `analytics_storage` is denied, the tag sends only cookieless, unidentified
 * pings (no cookies, no storage, no per-visitor id) that Google may model in aggregate; it does
 * NOT silently stop sending anything. Gating the script tag itself behind explicit consent (the
 * previous implementation) throws that modeled signal away entirely and undercounts real traffic
 * by an order of magnitude, which is why GA4 can show far fewer sessions than Cloudflare Web
 * Analytics (cookieless by design, unaffected by this consent gate) for the same traffic.
 * `consent update` still flips to "granted"/"denied" from the banner, which is what actually
 * controls whether a cookie/identifier is set — the privacy guarantee lives there, not in
 * whether gtag.js loads. page_view is sent manually (send_page_view: false) for the first load
 * and every client-side route change, once per pathname, regardless of the consent choice.
 */
export function SiteAnalytics() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [configured, setConfigured] = useState(false);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const stored = readAnalyticsConsent();
    setOpen(stored === null);
    setReady(true);
  }, []);

  const decide = useCallback((next: AnalyticsConsentChoice) => {
    writeAnalyticsConsent(next);
    updateAnalyticsConsent(next);
    setOpen(false);
  }, []);

  const configure = useCallback(() => {
    enqueueGtag("js", new Date());
    enqueueGtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
    setConfigured(true);
  }, []);

  // Wait for `config` to have been pushed before the first `event page_view`, so gtag.js
  // processes the dataLayer queue in the order GA4 expects (config, then events).
  useEffect(() => {
    const key = pageViewKey(pathname);
    if (!configured || !shouldTrackPageView(lastPath.current, key)) return;
    lastPath.current = key;
    enqueueGtag("event", "page_view", {
      page_location: window.location.href,
      page_path: key,
      page_title: document.title,
    });
  }, [configured, pathname]);

  return (
    <>
      <Script
        id="ga4-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={configure}
      />
      {ready && open ? (
        <div
          className="analytics-consent-dialog"
          role="dialog"
          aria-label="Analytics preferences"
          style={{ position: "fixed", left: 12, right: 12, bottom: "calc(var(--prime-vip-banner-offset, 0px) + 12px)", zIndex: 2147483000, maxWidth: 560, margin: "0 auto", padding: "14px 16px", background: "#0b1a27", color: "#e8eef4", border: "1px solid #24405a", borderRadius: 10, fontSize: 14, lineHeight: 1.45, boxShadow: "0 6px 24px rgba(0,0,0,.45)" }}
        >
          <p style={{ margin: "0 0 10px" }}>
            We use Google Analytics to measure anonymous site usage. It sets analytics cookies only if you accept.
            Advertising choices are managed separately. See our <a href="/cookies/" style={{ color: "#7cc4ff" }}>Cookie Policy</a>.
          </p>
          <div className="analytics-consent-dialog__actions" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => decide("denied")} style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid #3a5a78", background: "transparent", color: "inherit", cursor: "pointer" }}>Decline</button>
            <button type="button" onClick={() => decide("granted")} style={{ padding: "7px 14px", borderRadius: 6, border: 0, background: "#2f9e5b", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Accept analytics</button>
          </div>
        </div>
      ) : null}
      {ready && !open ? (
        <button
          className="analytics-preferences-button"
          type="button"
          onClick={() => setOpen(true)}
          style={{ position: "fixed", left: 8, bottom: "calc(var(--prime-vip-banner-offset, 0px) + 8px)", zIndex: 2147482999, padding: "4px 9px", borderRadius: 6, border: "1px solid #24405a", background: "#0b1a27", color: "#9db4c8", fontSize: 11, cursor: "pointer", opacity: 0.8 }}
        >
          Analytics preferences
        </button>
      ) : null}
    </>
  );
}
