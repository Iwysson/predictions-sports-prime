"use client";

import { useEffect, useState } from "react";
import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";
import { MatchFullContent } from "@/components/MatchFullContent";
import { supabase } from "@/lib/supabase";

// VIP gate. The page passes only the slug and two booleans. The protected text is requested
// from the endpoint after the session and VIP status are confirmed. The server is the
// authority: a 401 or 403 never shows protected text.
type Protected = {
  full: { analysis: string[]; sources: Array<{ name: string; url: string }>; comment: string | null };
  prediction: { main: string; odds: number | null };
};

type State = { kind: "idle" } | { kind: "loading" } | { kind: "ready"; data: Protected } | { kind: "denied" };

export function MatchGate({ slug, showAnalysis, showPrediction }: { slug: string; showAnalysis: boolean; showPrediction: boolean }) {
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
        const body = (await res.json()) as Protected;
        if (active) setState({ kind: "ready", data: body });
      } catch {
        if (active) setState({ kind: "denied" });
      }
    })();
    return () => {
      active = false;
    };
  }, [loading, user, isVip, slug]);

  if (state.kind === "ready") {
    const { full, prediction } = state.data;
    return (
      <MatchFullContent
        analysis={showAnalysis ? full.analysis : []}
        sources={showAnalysis ? full.sources : []}
        comment={showAnalysis ? full.comment : null}
        prediction={showPrediction ? prediction : null}
        labels={{ prediction: t("mainPrediction"), odds: t("odds") }}
      />
    );
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
