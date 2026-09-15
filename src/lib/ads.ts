export const adPlacements = [
  "home-middle",
  "home-bottom",
  "league-top",
  "league-sidebar",
  "league-middle",
  "match-top",
  "match-content",
  "match-bottom",
] as const;

export type AdPlacement = (typeof adPlacements)[number];
export type AdFormat = "horizontal" | "rectangle" | "auto";

const enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() ?? "";
const certifiedCmpReady = process.env.NEXT_PUBLIC_ADSENSE_CMP_READY === "true";

export const adsConfig: {
  enabled: boolean;
  clientId: string;
  certifiedCmpReady: boolean;
  slots: Record<AdPlacement, string>;
} = {
  enabled,
  clientId,
  certifiedCmpReady,
  slots: {
    "home-middle": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MIDDLE?.trim() ?? "",
    "home-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM?.trim() ?? "",
    "league-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEAGUE_TOP?.trim() ?? "",
    "league-sidebar": process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEAGUE_SIDEBAR?.trim() ?? "",
    "league-middle": process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEAGUE_MIDDLE?.trim() ?? "",
    "match-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MATCH_TOP?.trim() ?? "",
    "match-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MATCH_CONTENT?.trim() ?? "",
    "match-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MATCH_BOTTOM?.trim() ?? "",
  },
};

export function isValidAdSenseClientId(value: string) {
  return /^ca-pub-\d+$/.test(value);
}

export function isValidAdSenseSlot(value: string) {
  return /^\d+$/.test(value);
}

/**
 * Fail closed: ad delivery is enabled only after the publisher deliberately
 * enables ads, supplies a valid client id and confirms that a Google-certified
 * CMP is configured in production. The static AdSense account meta tag remains
 * available for site verification while ad delivery is disabled.
 */
export function canLoadAdSense() {
  return (
    adsConfig.enabled &&
    adsConfig.certifiedCmpReady &&
    isValidAdSenseClientId(adsConfig.clientId)
  );
}

export function canRenderPlacement(placement: AdPlacement) {
  return canLoadAdSense() && isValidAdSenseSlot(adsConfig.slots[placement]);
}
