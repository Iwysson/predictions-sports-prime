export type TrackRecordPromoState = "loading" | "vip" | "free";

export function trackRecordPromoState(loading: boolean, isVip: boolean): TrackRecordPromoState {
  if (loading) return "loading";
  return isVip ? "vip" : "free";
}
