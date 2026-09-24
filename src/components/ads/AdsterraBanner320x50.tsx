"use client";

import { useEffect, useRef, useState } from "react";

const ADSTERRA_BANNER_KEY = "2040592beb5f43d4cd7a11e0e25d1789";
const ADSTERRA_BANNER_SCRIPT_URL =
  `https://www.highrevenueformat.com/${ADSTERRA_BANNER_KEY}/invoke.js`;
const EMPTY_SLOT_TIMEOUT_MS = 10000;

type AdsterraBannerOptions = {
  key: typeof ADSTERRA_BANNER_KEY;
  format: "iframe";
  height: 50;
  width: 320;
  params: Record<string, never>;
};

declare global {
  interface Window {
    atOptions?: AdsterraBannerOptions;
  }
}

export function AdsterraBanner320x50() {
  const slotRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    if (slot.dataset.adsterraInitialized !== "true") {
      window.atOptions = {
        key: ADSTERRA_BANNER_KEY,
        format: "iframe",
        height: 50,
        width: 320,
        params: {},
      };

      const script = document.createElement("script");
      script.src = ADSTERRA_BANNER_SCRIPT_URL;
      script.async = true;
      script.dataset.cfasync = "false";
      script.dataset.adsterraPlacement = ADSTERRA_BANNER_KEY;
      slot.dataset.adsterraInitialized = "true";
      slot.appendChild(script);
    }

    const hasRenderedBanner = () => slot.querySelector("iframe") !== null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(() => {
      if (hasRenderedBanner()) {
        observer.disconnect();
        if (timer) clearTimeout(timer);
      }
    });

    if (!hasRenderedBanner()) {
      observer.observe(slot, { childList: true, subtree: true });
      timer = setTimeout(() => {
        observer.disconnect();
        if (!hasRenderedBanner()) setHidden(true);
      }, EMPTY_SLOT_TIMEOUT_MS);
    }

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <aside
      className="adsterra-banner-320x50"
      aria-label="Advertisement"
      data-ad-network="adsterra"
      data-ad-placement={ADSTERRA_BANNER_KEY}
      hidden={hidden}
    >
      <span className="adsterra-banner-320x50__label">Advertisement</span>
      <div ref={slotRef} className="adsterra-banner-320x50__slot" />
    </aside>
  );
}
