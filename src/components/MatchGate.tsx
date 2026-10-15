"use client";

import { useEffect, useState } from "react";
import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";
import { MatchFullContent } from "@/components/MatchFullContent";
import { supabase } from "@/lib/supabase";

// Public FREE content that has not been embedded in this slug's own static/client data yet (for
// example a future-dated NHL FREE game: its full text is intentionally kept out of the public
// bundle until its publication gate opens - see src/data/nhl/slate-2026-10-16.ts). The endpoint
// requires no session for a FREE entry (src/lib/match-access.ts, functions/api/match-content), so
// this fetches unconditionally; it never shows a login/VIP wall, only a loading state or nothing.
export function FreeMatchContent({ slug, labels }: { slug: string; labels: { prediction: string; odds: string } }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    let active = true;
    setState({ kind: "loading" });
    (async () => {
      try {
        const res = await fetch(`/api/match-content/${encodeURIComponent(slug)}`);
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
  }, [slug]);

  if (state.kind === "ready") {
    const { full, prediction } = state.data;
    return (
      <MatchFullContent
        analysis={full.analysis}
        analysisFormat={full.analysisFormat}
        sources={full.sources}
        comment={full.comment}
        prediction={prediction}
        labels={labels}
      />
    );
  }
  return null;
}

// VIP gate. The page passes only the slug and two booleans. The protected text is requested
// from the endpoint after the session and VIP status are confirmed. The server is the
// authority: a 401 or 403 never shows protected text.
type Protected = {
  full: { analysis: string[]; analysisFormat?: "markdown"; sources: Array<{ name: string; url: string }>; comment: string | null };
  prediction: { main: string; odds: number | null };
};

type State = { kind: "idle" } | { kind: "loading" } | { kind: "ready"; data: Protected } | { kind: "denied" };

export function MatchGate({ slug, showAnalysis, showPrediction, variant = "match" }: { slug: string; showAnalysis: boolean; showPrediction: boolean; variant?: "match" | "game" }) {
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
      <div className="psp-unlocked">
        <MatchFullContent
          analysis={showAnalysis ? full.analysis : []}
          analysisFormat={showAnalysis ? full.analysisFormat : undefined}
          sources={showAnalysis ? full.sources : []}
          comment={showAnalysis ? full.comment : null}
          prediction={showPrediction ? prediction : null}
          labels={{ prediction: t("mainPrediction"), odds: t("odds") }}
        />
      </div>
    );
  }
  if (state.kind === "loading" || loading) return <p className="match-gate">{t("matchCheckingAccess")}</p>;

  return (
    <div className="psp-vip-card match-gate">
      <span className="psp-badge psp-badge--vip">PRIME VIP</span>
      <h3>{t("matchVipCardTitle")}</h3>
      <p>{variant === "game" ? "Unlock the complete game analysis, prediction, odds, statistics and editorial reasoning." : t("matchVipCardBody")}</p>
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
