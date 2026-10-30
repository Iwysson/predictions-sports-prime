"use client";

import { TeamBadge } from "@/components/TeamBadge";
import { formatOddsPair } from "@/lib/odds";
import { resultsScopeLabel } from "@/lib/results-scope";
import type { NhlHistoryApiResponse } from "@/lib/use-nhl-history";

/**
 * Compact cumulative NHL track record for /nhl/: overall win rate + the 3 most recently settled
 * WINS, no date grouping. The full, date-grouped history (NhlHistory) is mounted by the parent
 * only once "See All Results" is clicked — both read the same fetch (useNhlHistoryData) so the
 * numbers never diverge.
 */
export function NhlResultsSummary({
  data,
  expanded,
  onToggleExpanded,
}: {
  data: NhlHistoryApiResponse | null;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  if (!data) return null;

  const settled = data.wins + data.losses;
  const settledDays = data.days.filter((day) => day.wins + day.losses > 0).map((day) => ({ date: day.dayKey }));
  const period = resultsScopeLabel({ count: settledDays.length, firstDate: settledDays.map((d) => d.date).sort()[0] ?? null, lastDate: settledDays.map((d) => d.date).sort().slice(-1)[0] ?? null });
  const winRate = settled > 0 ? ((data.wins / settled) * 100).toFixed(1) : null;
  const latestWins = data.latest.slice(0, 3);
  if (winRate === null && latestWins.length === 0) return null;

  return (
    <section className="nhl-track-record" aria-labelledby="nhl-track-record-title">
      <div className="track-record__heading">
        <span className="eyebrow">Track record</span>
        <h2 id="nhl-track-record-title">NHL Track Record</h2>
        <p>Scope: the {settled} decided NHL predictions currently registered{period ? `, from games played ${period}` : ""}. This is a snapshot of the registered period, not a lifetime or all-time record. Totals and win rate update automatically as games are settled.</p>
      </div>

      <div className="track-record__metrics track-record__metrics--three">
        {winRate !== null ? (
          <div className="track-record__metric track-record__metric--rate"><strong>{winRate}%</strong><span>Win rate</span></div>
        ) : null}
        <div className="track-record__metric track-record__metric--wins"><strong>{data.wins}</strong><span>Wins</span></div>
        <div className="track-record__metric track-record__metric--losses"><strong>{data.losses}</strong><span>Losses</span></div>
      </div>

      {latestWins.length > 0 ? (
        <div className="nhl-track-record__latest">
          <h3>Latest results</h3>
          <div className="nhl-history__rows">
            {latestWins.map((row) => (
              <div className="nhl-history__row" key={row.slug}>
                <span className="nhl-history__fixture">
                  <TeamBadge team={row.awayTeam} size="sm" />
                  <span>{row.awayTeam} vs {row.homeTeam}</span>
                  <TeamBadge team={row.homeTeam} size="sm" />
                </span>
                <span className="nhl-history__pick">
                  {row.pick} <b>{formatOddsPair(row.decimalOdds)}</b>
                </span>
                <span className="nhl-history__status nhl-history__status--win">WIN</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <button type="button" className="nhl-history__toggle" onClick={onToggleExpanded}>
        {expanded ? "Hide Results" : "See All Results"}
      </button>
    </section>
  );
}
