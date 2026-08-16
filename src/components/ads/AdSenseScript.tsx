import Script from "next/script";
import {
  adsConfig,
  canLoadAdSense,
  isValidAdSenseClientId,
} from "@/lib/ads";

export function AdSenseScript() {
  if (!canLoadAdSense()) {
    if (
      process.env.NODE_ENV === "development" &&
      adsConfig.enabled &&
      !isValidAdSenseClientId(adsConfig.clientId)
    ) {
      console.warn(
        "AdSense is enabled but NEXT_PUBLIC_ADSENSE_CLIENT_ID is missing or invalid."
      );
    }

    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsConfig.clientId)}`}
    />
  );
}
