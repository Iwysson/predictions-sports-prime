"use client";

import { useEffect, useState } from "react";
import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";
import { MatchFullContent } from "@/components/MatchFullContent";
import { supabase } from "@/lib/supabase";
import type { FullMatchView } from "@/lib/match-access";

// VIP analysis gate. The page ships only the teaser and receives only the slug as a prop.
// The full content is requested from the protected endpoint once the session and VIP
// status are confirmed. The server is the authority: a 401 or 403 never shows protected text.
type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; full: FullMatchView }
  | { kind: "denied" };

export function MatchGate({ slug }: { slug: string }) {
  const { t } = useI18n();
  const { user, isVip, loading } = useAuth();
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    if (loading || !user || !isVip) {
      setState({ kind: "idle" });
      return;
    }
    let active = true;
    setState({ kind: "loading" });
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error("no session");
        const res = await fetch(`/api/match-content/${encodeURIComponent(slug)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const body = (await res.json()) as { full: FullMatchView };
        if (active) setState({ kind: "ready", full: body.full });
      } catch {
        if (active) setState({ kind: "denied" });
      }
    })();
    return () => {
      active = false;
    };
  }, [loading, user, isVip, slug]);

  if (state.kind === "ready") {
    return <MatchFullContent full={state.full} labels={{ prediction: t("mainPrediction"), odds: t("odds") }} />;
  }
  if (state.kind === "loading" || loading) return <p className="match-gate">{t("matchCheckingAccess")}</p>;

  return (
    <div className="match-gate">
      <p>{t("matchVipGate")}</p>
      {!user ? (
        <Link className="button auth-primary-action" href="/login/">
          {t("matchLoginToContinue")}
        </Link>
      ) : (
        <VipCheckoutButton />
      )}
      {state.kind === "denied" ? <p className="match-note">{t("matchAccessNotConfirmed")}</p> : null}
    </div>
  );
}
