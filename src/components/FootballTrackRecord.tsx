"use client";

import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";
import {
  latestFootballTrackRecord,
  shouldShowOverallTrackRecord,
  trackRecordPromoState,
} from "@/lib/football-track-record";
import { summarizeResults, type FootballResultRecord } from "@/lib/football-results";

function formatWinRate(winRate: number | null) {
  return winRate === null ? null : `${(winRate * 100).toFixed(1)}%`;
}

function SummaryCards({ summary }: { summary: ReturnType<typeof summarizeResults> }) {
  const winRate = formatWinRate(summary.winRate);
  return (
    <div className="track-record__metrics" aria-label="Football prediction track record">
      <div className="track-record__metric track-record__metric--settled"><strong>{summary.settled}</strong><span>Settled</span></div>
      <div className="track-record__metric track-record__metric--wins"><strong>{summary.wins}</strong><span>Wins</span></div>
      <div className="track-record__metric track-record__metric--losses"><strong>{summary.losses}</strong><span>Losses</span></div>
      {winRate ? <div className="track-record__metric track-record__metric--rate"><strong>{winRate}</strong><span>Win rate</span></div> : null}
    </div>
  );
}

function TrackRecordPromo() {
  const { loading, isVip } = useAuth();
  const state = trackRecordPromoState(loading, isVip);

  if (state === "vip") {
    return (
      <aside className="track-record-promo track-record-promo--active" aria-label="PRIME VIP active">
        <div>
          <span className="psp-badge psp-badge--vip">PRIME VIP ACTIVE</span>
          <h3>Continue with today&apos;s premium predictions</h3>
          <p>Your PRIME VIP access includes premium predictions, BEST BET selections and complete match analysis.</p>
        </div>
        <Link className="button auth-primary-action" href="/today-predictions/">View today&apos;s predictions</Link>
      </aside>
    );
  }

  return (
    <aside className="track-record-promo" aria-labelledby="track-record-promo-title">
      <div>
        <span className="psp-badge psp-badge--vip">PRIME VIP</span>
        <h3 id="track-record-promo-title">Follow the track record</h3>
        <p>Our published football predictions are settled transparently after every final result. Unlock PRIME VIP for premium predictions, BEST BET selections and full match analysis before kickoff.</p>
      </div>
      <div className="track-record-promo__offer">
        <strong>3-day free trial</strong>
        <span>$29.99/month after trial</span>
        {state === "free" ? <VipCheckoutButton label="Start your 3-day free trial" /> : <span className="track-record-promo__loading" aria-hidden="true">Checking access…</span>}
      </div>
    </aside>
  );
}

export function FootballTrackRecord({ records, detailed = false }: { records: FootballResultRecord[]; detailed?: boolean }) {
  const latest = latestFootballTrackRecord(records);
  if (!latest) return null;
  const overall = detailed && shouldShowOverallTrackRecord(records) ? summarizeResults(records) : null;

  return (
    <section className="track-record" aria-labelledby="football-track-record-title">
      <div className="track-record__heading">
        <span className="eyebrow">{detailed ? "Football track record" : "Today's track record"}</span>
        <h3 id="football-track-record-title">{latest.summary.wins}-{latest.summary.losses} from the latest settled matchday</h3>
        <p>Results from {latest.date}. Pushes, half results and voids stay visible but do not enter the win-rate denominator.</p>
      </div>
      <SummaryCards summary={latest.summary} />
      {overall ? (
        <div className="track-record__overall">
          <span>Overall</span>
          <strong>{overall.wins}-{overall.losses}</strong>
          <small>{formatWinRate(overall.winRate) ?? "Win rate not available"}</small>
        </div>
      ) : null}
      <TrackRecordPromo />
    </section>
  );
}
