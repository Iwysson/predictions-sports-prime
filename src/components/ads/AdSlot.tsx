import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
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
  const configured = canRenderPlacement(placement);

  return (
    <aside
      className={`ad-slot ad-slot--${format}`}
      aria-label="Advertisement"
      data-ad-placement={placement}
    >
      {configured ? (
        <AdSenseUnit
          clientId={adsConfig.clientId}
          slot={adsConfig.slots[placement]}
          format={format}
          placement={placement}
        />
      ) : (
        <AdPlaceholder format={format} />
      )}
    </aside>
  );
}
