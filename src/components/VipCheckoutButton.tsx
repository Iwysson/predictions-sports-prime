"use client";

import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";

// PRIME VIP purchases moved entirely to Google Play Billing inside the Android app.
// The website no longer initiates any checkout (Whop or otherwise) - a signed-in,
// non-VIP visitor is told where to get PRIME VIP instead of being sent through a
// purchase flow here. profiles.plan/subscription_status is still the single source
// of truth the website reads, however a user became VIP.
export function VipCheckoutButton({ label }: { label?: string }) {
  const { t } = useI18n();
  const { isAuthenticated, isVip, loading } = useAuth();

  if (loading || isVip) return null;

  if (!isAuthenticated) {
    return (
      <Link className="button auth-primary-action" href="/login/">
        {label ?? t("matchGetPrimeVip")}
      </Link>
    );
  }

  return (
    <p className="auth-message" role="status">
      {t("matchVipViaAndroidApp")}
    </p>
  );
}
