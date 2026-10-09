"use client";

// Single client-side fetch of the canonical NHL history endpoint, shared by the compact
// /nhl/ track-record summary and the full NHL Prediction History section so both read the
// exact same settlement numbers rather than issuing their own divergent requests.
import { useEffect, useState } from "react";
import type { NhlSettlementResult } from "@/lib/nhl-results";

export type NhlHistoryApiRow = {
  slug: string;
  homeTeam: string;
  awayTeam: string;
  access: "free" | "best" | "vip";
  pick: string;
  decimalOdds: number;
  americanOdds: number;
  result: NhlSettlementResult;
  finalScore: { home: number; away: number } | null;
};

export type NhlHistoryApiDay = { dayKey: string; rows: NhlHistoryApiRow[]; wins: number; losses: number };

export type NhlHistoryApiResponse = {
  state: "ok";
  days: NhlHistoryApiDay[];
  wins: number;
  losses: number;
  latest: (NhlHistoryApiRow & { dayKey: string })[];
};

const POLL_MS = 5 * 60_000;

export function useNhlHistoryData() {
  const [data, setData] = useState<NhlHistoryApiResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/nhl/history", { cache: "no-store" });
        const body = res.ok ? await res.json() : null;
        if (!cancelled && body?.state === "ok" && Array.isArray(body.days)) setData(body as NhlHistoryApiResponse);
      } catch {
        // Keep the previous (or empty) state; never show a fabricated record.
      }
    };
    load();
    const id = window.setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return data;
}
