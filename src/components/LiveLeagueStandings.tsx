"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LeagueSlug } from "@/types";
import type { StandingRow } from "@/data/standings";
import { openLeagueConfigs } from "@/lib/openfootball";
import { useI18n } from "@/i18n/I18nProvider";
import { loadLiveStandings } from "@/lib/live-standings";

type SupportedSlug = LeagueSlug;

type SourceState = "loading" | "validated" | "not-available";

function rowSignature(rows: StandingRow[]) {
  return rows
    .map((row) => [
      row.position,
      row.team,
      row.played ?? "",
      row.wins ?? "",
      row.draws ?? "",
      row.losses ?? "",
      row.goalsFor ?? "",
      row.goalsAgainst ?? "",
      row.goalDifference ?? "",
      row.points,
    ].join("|"))
    .join("||");
}

function valueOrDash(value: number | undefined) {
  return value === undefined ? "—" : value;
}

function goalDifference(value: number | undefined) {
  if (value === undefined) return "—";
  return value > 0 ? `+${value}` : String(value);
}

export function LiveLeagueStandings({
  league,
  fallbackRows: _fallbackRows,
}: {
  league: SupportedSlug;
  fallbackRows: StandingRow[];
}) {
  const config = openLeagueConfigs[league];
  const { t } = useI18n();
  const [rows, setRows] = useState<StandingRow[]>([]);
  const [source, setSource] = useState<SourceState>("loading");
  const rowsSignatureRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    setSource("loading");

    loadLiveStandings(league)
      .then((computed) => {
        if (cancelled) return;
        if (!computed.length) {
          setRows([]);
          rowsSignatureRef.current = "";
          setSource("not-available");
          return;
        }

        const nextSignature = rowSignature(computed);
        if (nextSignature !== rowsSignatureRef.current) {
          setRows(computed);
          rowsSignatureRef.current = nextSignature;
        }
        setSource("validated");
      })
      .catch((error) => {
        console.warn(`Standings unavailable for ${config.label}:`, error);
        if (!cancelled) {
          setRows([]);
          rowsSignatureRef.current = "";
          setSource("not-available");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [config.label, league]);

  const decoratedRows = useMemo(() => rows.map((row) => {
    let zone: StandingRow["zone"];
    if (row.position <= 4) zone = "champions";
    else if (row.position === 5) zone = "europa";
    else if (row.position >= config.expectedClubs - 2) zone = "relegation";
    return { ...row, zone };
  }), [config.expectedClubs, rows]);

  const hasValidatedData = source === "validated" && decoratedRows.length > 0;

  return (
    <div className="standings-card standings-card--open">
      <div className="standings-header">
        <div>
          <span className="eyebrow">{t("classification")}</span>
          <h3>{config.label}</h3>
        </div>
        <div className="standings-source">
          <span className={`source-dot source-dot--${hasValidatedData ? "validated" : "fallback"}`} />
          <strong>{hasValidatedData ? t("validated") : source === "loading" ? "UPDATING" : "NOT AVAILABLE"}</strong>
        </div>
      </div>

      {!hasValidatedData ? (
        <div className="standings-status" role="status" aria-live="polite">
          <span>
            {source === "loading"
              ? "Validating the current standings from the live source…"
              : "Current standings are temporarily unavailable while the table is being validated."}
          </span>
          <span>No placeholder values are published.</span>
        </div>
      ) : (
        <>
          <div className="standings-columns standings-columns--desktop">
            <span>#</span><span>{t("club")}</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GF</span><span>GA</span><span>GD</span><span>PTS</span>
          </div>
          <div className="standings-columns standings-columns--tablet">
            <span>#</span><span>{t("club")}</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>PTS</span>
          </div>
          <div className="standings-columns standings-columns--mobile">
            <span>#</span><span>{t("club")}</span><span>P</span><span>GD</span><span>PTS</span>
          </div>
          <div className="standings-list">
            {decoratedRows.map((row) => (
              <div className="standing-row" key={`${row.position}-${row.team}`}>
                <span className={`standing-position standing-position--${row.zone ?? "normal"}`}>{row.position}</span>
                <strong>{row.team}</strong>
                <span className="standing-cell standing-cell--played">{valueOrDash(row.played)}</span>
                <span className="standing-cell standing-cell--wins">{valueOrDash(row.wins)}</span>
                <span className="standing-cell standing-cell--draws">{valueOrDash(row.draws)}</span>
                <span className="standing-cell standing-cell--losses">{valueOrDash(row.losses)}</span>
                <span className="standing-cell standing-cell--gf">{valueOrDash(row.goalsFor)}</span>
                <span className="standing-cell standing-cell--ga">{valueOrDash(row.goalsAgainst)}</span>
                <span className="standing-cell standing-cell--gd">{goalDifference(row.goalDifference)}</span>
                <b className="standing-cell standing-cell--points">{row.points}</b>
              </div>
            ))}
          </div>
          <div className="standings-status">
            <span>{decoratedRows.length} clubs</span>
            <span>live source validated</span>
          </div>
        </>
      )}
    </div>
  );
}
