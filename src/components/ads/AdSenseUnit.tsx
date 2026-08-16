import Script from "next/script";
import type { AdFormat, AdPlacement } from "@/lib/ads";

export function AdSenseUnit({
  clientId,
  slot,
  format,
  placement,
}: {
  clientId: string;
  slot: string;
  format: AdFormat;
  placement: AdPlacement;
}) {
  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "inherit" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format === "horizontal" ? "horizontal" : "auto"}
        data-full-width-responsive="true"
      />
      <Script id={`adsense-unit-${placement}`} strategy="afterInteractive">
        {"window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.push({});"}
      </Script>
    </>
  );
}
