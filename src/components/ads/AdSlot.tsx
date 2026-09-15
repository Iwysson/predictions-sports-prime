"use client";

import { useAdConsent } from "@/lib/use-ad-consent";
import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import {
  adsConfig,
  canRenderPlacement,
  type AdFormat,
  type AdPlacement,
} from "@/lib/ads";

export function AdSlot({
  placement,
  format = "horizontal",
}: {
  placement: AdPlacement;
  format?: AdFormat;
}) {
  const consentGranted = useAdConsent();
  if (!canRenderPlacement(placement)) return null;
  if (!consentGranted) return null;

  return (
    <aside
      className={`ad-slot ad-slot--${format}`}
      aria-label="Advertisement"
      data-ad-placement={placement}
    >
      <AdSenseUnit
        clientId={adsConfig.clientId}
        slot={adsConfig.slots[placement]}
        format={format}
        placement={placement}
      />
    </aside>
  );
}
