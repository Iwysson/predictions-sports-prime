"use client";

import { useState } from "react";
import Link from "@/components/DocumentLink";
import { NhlMoneylineNote } from "@/components/NhlMoneylineNote";
import { TeamBadge } from "@/components/TeamBadge";
import { formatNhlDayLabel } from "@/lib/nhl-day";
import { formatOddsPair } from "@/lib/odds";
import type { NhlHistoryApiResponse } from "@/lib/use-nhl-history";

const STATUS_LABEL: Record<"win" | "loss" | "push" | "pending" | "unsupported", string> = {
  win: "WIN",
  loss: "LOSS",
  push: "PUSH",
  pending: "PENDING",
  unsupported: "UNSETTLED",
};

const DEFAULT_VISIBLE_DAYS = 7;

export function NhlHistory({ data }: { data: NhlHistoryApiResponse | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!data || data.days.length === 0) return null;

  const daysWithRows = data.days.filter((d) => d.rows.length > 0);
  if (daysWithRows.length === 0) return null;

  const mostRecentSettled = daysWithRows.find((d) => d.wins + d.losses > 0);
  const totalSettled = data.wins + data.losses;
  const winRate = totalSettled > 0 ? ((data.wins / totalSettled) * 100).toFixed(1) : null;
  const visibleDays = expanded ? daysWithRows : daysWithRows.slice(0, DEFAULT_VISIBLE_DAYS);

  return (
    <section className="nhl-history" aria-labelledby="nhl-history-title">
      <header className="nhl-history__head">
        <span className="psp-hero__eyebrow psp-hero__eyebrow--nhl">Transparency</span>
        <h2 id="nhl-history-title">NHL Prediction History</h2>
        <p>
          Every published NHL prediction is tracked after the final horn, FREE and PRIME VIP alike. A pick is counted
          only once its game is officially final.
        </p>
      </header>

      {mostRecentSettled || winRate !== null ? (
        <div className="nhl-history__summary">
          {mostRecentSettled ? (
            <div className="nhl-history__stat">
              <span>{formatNhlDayLabel(mostRecentSettled.dayKey)}</span>
              <strong>
                {mostRecentSettled.wins}-{mostRecentSettled.losses}
              </strong>
            </div>
          ) : null}
          {winRate !== null ? (
            <div className="nhl-history__stat">
              <span>Win Rate ({totalSettled} settled)</span>
              <strong>{winRate}%</strong>
            </div>
          ) : null}
        </div>
      ) : null}

      <NhlMoneylineNote />

      <div className="nhl-history__days">
        {visibleDays.map((day) => (
          <article className="nhl-history__day" key={day.dayKey}>
            <div className="nhl-history__day-head">
              <h3>{formatNhlDayLabel(day.dayKey)}</h3>
              <span>
                {day.wins} Wins · {day.losses} Losses · {day.rows.length} prediction{day.rows.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="nhl-history__rows">
              {day.rows.map((row) => (
                <div className="nhl-history__row" key={row.slug}>
                  <span className="nhl-history__fixture">
                    <TeamBadge team={row.homeTeam} size="sm" />
                    <span>
                      {row.homeTeam} vs {row.awayTeam}
                    </span>
                    <TeamBadge team={row.awayTeam} size="sm" />
                  </span>
                  <span className="nhl-history__pick">
                    {row.pick} <b>{formatOddsPair(row.decimalOdds)}</b>
                  </span>
                  <span className={`nhl-history__status nhl-history__status--${row.result}`}>{STATUS_LABEL[row.result]}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {daysWithRows.length > DEFAULT_VISIBLE_DAYS ? (
        <button type="button" className="nhl-history__toggle" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Show last 7 days" : "View Full NHL History"}
        </button>
      ) : null}

      <p className="nhl-history__cta">
        <strong>FOLLOW THE TRACK RECORD.</strong> See every NHL prediction, including PRIME VIP selections and BEST
        BETS, with results tracked transparently after the games finish.{" "}
        <Link href="#prime-vip-offer-title">Unlock PRIME VIP</Link>.
      </p>
    </section>
  );
}
