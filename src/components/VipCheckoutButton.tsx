"use client";

import { useState } from "react";
import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { supabase } from "@/lib/supabase";

// "Get VIP". Signed-out visitors go to login. Signed-in visitors get a Whop checkout
// bound to their own account by the server, never by a browser-supplied id.
export function VipCheckoutButton() {
  const { t } = useI18n();
  const { isAuthenticated, isVip, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading || isVip) return null;

  if (!isAuthenticated) {
    return (
      <Link className="button auth-primary-action" href="/login/">
        {t("matchGetPrimeVip")}
      </Link>
    );
  }

  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(t("matchSessionExpired"));
      const res = await fetch("/api/whop/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(t("matchCheckoutUnavailable"));
      const body = (await res.json()) as { purchase_url?: string };
      if (!body.purchase_url) throw new Error(t("matchCheckoutUnavailable"));
      window.location.assign(body.purchase_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("matchCheckoutUnavailable"));
      setBusy(false);
    }
  }

  return (
    <div>
      <button className="button auth-primary-action" disabled={busy} onClick={startCheckout} type="button">
        {busy ? t("matchOpeningCheckout") : t("matchGetPrimeVip")}
      </button>
      {error ? (
        <p className="auth-message auth-message--error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
