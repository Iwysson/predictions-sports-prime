"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteContactLine } from "@/components/SiteContactLine";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";
import { VipTitleCta } from "@/components/VipTitleCta";

// Full archive rows are fetched only after the server confirms VIP access.
// Nothing here ships the data in the static bundle.
type HistoryRecord = {
  date: string | null;
  sport: string;
  league: string;
  home_team: string;
  away_team: string;
  prediction: string | null;
  market: string | null;
  odds: number | null;
  status: string | null;
};

type LoadState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; records: HistoryRecord[] }
  | { kind: "error" };

export function HistoryPredictionsView() {
  const { user, isVip, loading } = useAuth();
  const [state, setState] = useState<LoadState>({ kind: "idle" });

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
        const res = await fetch("/api/history-predictions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const body = (await res.json()) as { records: HistoryRecord[] };
        if (active) setState({ kind: "ready", records: body.records });
      } catch {
        if (active) setState({ kind: "error" });
      }
    })();
    return () => {
      active = false;
    };
  }, [loading, user, isVip]);

  return (
    <>
      <header>
        <span className="eyebrow">VIP archive</span>
        <VipTitleCta>Prediction History</VipTitleCta>
        <p>
          A record of past predictions with the pick, market and published odds.
          Results are shown only where they were already recorded.
        </p>
        <SiteContactLine />
      </header>

      {loading ? <p>Checking your access…</p> : null}

      {!loading && !user ? (
        <Teaser>
          The full history is available to VIP members. <Link href="/login/">Sign in</Link> to check your access.
        </Teaser>
      ) : null}

      {!loading && user && !isVip ? (
        <Teaser>
          The full history is available to VIP members. Your account does not currently have an active VIP plan.
        </Teaser>
      ) : null}

      {state.kind === "loading" ? <p>Loading history…</p> : null}
      {state.kind === "error" ? <p>The history could not be loaded. Please try again later.</p> : null}

      {state.kind === "ready" ? (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Match</th>
                <th scope="col">League</th>
                <th scope="col">Prediction</th>
                <th scope="col">Market</th>
                <th scope="col">Odds</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.records.map((row, index) => (
                <tr key={`${row.date}-${row.home_team}-${row.away_team}-${index}`}>
                  <td>{row.date ?? "—"}</td>
                  <td>{`${row.home_team} vs ${row.away_team}`}</td>
                  <td>{row.league}</td>
                  <td>{row.prediction ?? "—"}</td>
                  <td>{row.market ?? "—"}</td>
                  <td>{row.odds !== null ? row.odds.toFixed(2) : "—"}</td>
                  <td>{row.status ?? "Not recorded"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}

function Teaser({ children }: { children: React.ReactNode }) {
  return (
    <div className="history-teaser">
      <p>{children}</p>
      <VipCheckoutButton />
    </div>
  );
}
