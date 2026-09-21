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
  showLabel = false,
  compact = false,
  wrapperClassName,
}: {
  placement: AdPlacement;
  format?: AdFormat;
  showLabel?: boolean;
  compact?: boolean;
  wrapperClassName?: string;
}) {
  const consentGranted = useAdConsent();
  if (!canRenderPlacement(placement)) return null;
  if (!consentGranted) return null;

  const slot = (
    <aside
      className={`ad-slot ad-slot--${format}${compact ? " ad-slot--compact" : ""}`}
      aria-label="Advertisement"
      data-ad-placement={placement}
    >
      {showLabel ? <span className="ad-slot__label">Advertisement</span> : null}
      <AdSenseUnit
        clientId={adsConfig.clientId}
        slot={adsConfig.slots[placement]}
        format={format}
        placement={placement}
      />
    </aside>
  );

  return wrapperClassName ? <div className={wrapperClassName}>{slot}</div> : slot;
}
