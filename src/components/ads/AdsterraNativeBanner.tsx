"use client";

import Script from "next/script";

const ADSTERRA_CONTAINER_ID =
  "container-1d35e81cffc4c0b9459d025e89a61af4";
const ADSTERRA_SCRIPT_URL =
  "https://pl31450816.profitableratecpmnetwork.com/1d35e81cffc4c0b9459d025e89a61af4/invoke.js";

export function AdsterraNativeBanner() {
  return (
    <aside
      className="adsterra-native-banner"
      aria-label="Advertisement"
      data-ad-network="adsterra"
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
