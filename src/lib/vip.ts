import type { EditorialPrediction, PredictionAccess } from "@/types";

// Single source of truth for VIP access. Used by the client (AuthProvider, ads)
// and mirrored by the server-side history endpoint.
export const VIP_PLAN = "vip" as const;
export const VIP_ACTIVE_STATUSES = ["trialing", "active"] as const;

export type SubscriptionStatus =
  | "inactive"
  | "trialing"
  | "active"
  | "canceled"
  | "expired"
  | "past_due";

export type VipProfile = {
  plan: "free" | "vip";
  subscription_status: string | null;
};

export function isVip(profile: VipProfile | null | undefined): boolean {
  return (
    profile?.plan === VIP_PLAN &&
    (VIP_ACTIVE_STATUSES as readonly string[]).includes(profile.subscription_status ?? "")
  );
}

export type ResolvedAccess = { analysis: "free" | "vip"; prediction: "free" | "vip" };

// Editorial rule: a free analysis always comes with a free prediction. The reverse is allowed
// (a free prediction can accompany a VIP analysis), so prediction access may be free alone.
export function resolveAccess(item: Partial<Pick<EditorialPrediction, "access" | "analysisAccess" | "predictionAccess">>): ResolvedAccess {
  const base = contentAccess(item);
  const analysis: PredictionAccess = item.analysisAccess === "free" || item.analysisAccess === "vip" ? item.analysisAccess : base;
  const explicitPrediction: PredictionAccess = item.predictionAccess === "free" || item.predictionAccess === "vip" ? item.predictionAccess : base;
  return { analysis, prediction: analysis === "free" ? "free" : explicitPrediction };
}

// Access tier for predictions and analyses. Default is "vip". Only an explicit
// access: "free" opens the full content to non-VIP visitors. The absence of the
// field never makes a prediction free.
export type ContentAccess = "free" | "vip";

export function contentAccess(item: { access?: string | null } | null | undefined): ContentAccess {
  return item?.access === "free" ? "free" : "vip";
}

export function canViewFullContent(
  item: { access?: string | null } | null | undefined,
  viewerIsVip: boolean,
): boolean {
  return viewerIsVip || contentAccess(item) === "free";
}
