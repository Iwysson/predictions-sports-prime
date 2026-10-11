"use client";

import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";
import { trackRecordPromoState } from "@/lib/football-track-record";
import { resultsScope, resultsScopeLabel, summarizeResults, type FootballResultRecord } from "@/lib/football-results";

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
        <strong>$19.99/month</strong>
        {state === "free" ? <VipCheckoutButton label="Get PRIME VIP" /> : <span className="track-record-promo__loading" aria-hidden="true">Checking access…</span>}
      </div>
    </aside>
  );
}

export function FootballTrackRecord({ records }: { records: FootballResultRecord[] }) {
  if (records.length === 0) return null;
  const overall = summarizeResults(records);
  const scope = resultsScope(records);
  const period = resultsScopeLabel(scope);

  return (
    <section className="track-record" aria-labelledby="football-track-record-title">
      <div className="track-record__heading">
        <span className="eyebrow">Registered track record</span>
        <h3 id="football-track-record-title">{overall.wins}-{overall.losses} across {scope.count} settled football predictions{period ? ` (${period})` : ""}</h3>
        <p>Scope: the {scope.count} settled football predictions currently registered in the results archive{period ? `, with match dates from ${period}` : ""}. This is a snapshot of the registered period, not a lifetime or all-time record, because the results archive was introduced after the earliest analyses were published. The totals and the win rate update automatically as more predictions are settled. Pushes, half results and voids stay visible but do not enter the win-rate denominator.</p>
      </div>
      <SummaryCards summary={overall} />
      <TrackRecordPromo />
    </section>
  );
}
