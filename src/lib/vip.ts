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
