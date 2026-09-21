"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const ADSTERRA_CONTAINER_ID =
  "container-1d35e81cffc4c0b9459d025e89a61af4";
const ADSTERRA_SCRIPT_URL =
  "https://pl31450816.profitableratecpmnetwork.com/1d35e81cffc4c0b9459d025e89a61af4/invoke.js";
const EMPTY_SLOT_TIMEOUT_MS = 10000;

export function AdsterraNativeBanner() {
  const asideRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const container = document.getElementById(ADSTERRA_CONTAINER_ID);
    const wrapper = asideRef.current?.parentElement ?? null;
    if (!container) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(() => {
      if (container.childNodes.length > 0) {
        observer.disconnect();
        if (timer) clearTimeout(timer);
      }
    });

    if (container.childNodes.length > 0) return;

    observer.observe(container, { childList: true, subtree: true });
    timer = setTimeout(() => {
      observer.disconnect();
      if (container.childNodes.length === 0) {
        // No ad was rendered: collapse the slot and its spacing wrapper.
        setHidden(true);
        if (wrapper) wrapper.style.display = "none";
      }
    }, EMPTY_SLOT_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <aside
      ref={asideRef}
      className="adsterra-native-banner"
      aria-label="Advertisement"
      data-ad-network="adsterra"
      hidden={hidden}
      style={hidden ? { display: "none" } : undefined}
    >
      <span className="adsterra-native-banner__label">Advertisement</span>
      <div
        id={ADSTERRA_CONTAINER_ID}
        className="adsterra-native-banner__container"
      />
      <Script
        id="adsterra-native-banner-script"
        src={ADSTERRA_SCRIPT_URL}
        strategy="lazyOnload"
        async
        data-cfasync="false"
      />
    </aside>
  );
}
