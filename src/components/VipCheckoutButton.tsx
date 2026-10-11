"use client";

import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { PRIME_VIP_WHOP_URL } from "@/lib/prime-vip";

// Supabase remains the source of truth for access. The website only sends non-VIP
// visitors to Whop; active and trialing members never see a purchase CTA.
export function VipCheckoutButton({ label }: { label?: string }) {
  const { t } = useI18n();
  const { isVip, loading } = useAuth();

  if (loading || isVip) return null;

  return (
    <Link className="button auth-primary-action" href={PRIME_VIP_WHOP_URL}>
      {label ?? t("matchGetPrimeVip")}
    </Link>
  );
}
