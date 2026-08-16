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

export const adsConfig: {
  enabled: boolean;
  clientId: string;
  slots: Record<AdPlacement, string>;
} = {
  enabled,
  clientId,
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

export function canLoadAdSense() {
  return adsConfig.enabled && isValidAdSenseClientId(adsConfig.clientId);
}

export function canRenderPlacement(placement: AdPlacement) {
  return canLoadAdSense() && isValidAdSenseSlot(adsConfig.slots[placement]);
}
