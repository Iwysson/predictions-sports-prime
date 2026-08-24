"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LeagueSlug } from "@/types";
import { StandingRow } from "@/data/standings";
import {
  openLeagueConfigs,
} from "@/lib/openfootball";
import { useI18n } from "@/i18n/I18nProvider";
import { loadLiveStandings } from "@/lib/live-standings";

type SupportedSlug = LeagueSlug;

export function LiveLeagueStandings({
  league,
  fallbackRows,
}: {
  league: SupportedSlug;
  fallbackRows: StandingRow[];
}) {
  const config = openLeagueConfigs[league];
  const { t } = useI18n();
  const [rows, setRows] = useState<StandingRow[]>(fallbackRows);
  const [source, setSource] = useState<
    "validated" | "fallback" | "not-available"
  >(fallbackRows.length > 0 ? "fallback" : "not-available");
  const rowsSignatureRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    loadLiveStandings(league)
      .then((computed) => {
        if (!cancelled) {
          const nextSignature = computed
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
              row.points ?? "",
            ].join("|"))
            .join("||");

          if (nextSignature !== rowsSignatureRef.current) {
            setRows(computed);
            rowsSignatureRef.current = nextSignature;
          }
          setSource("validated");
        }
      })
      .catch((error) => {
        console.warn(`Using table fallback for ${config.label}:`, error);

        if (!cancelled) {
          const fallbackSignature = fallbackRows
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
              row.points ?? "",
            ].join("|"))
            .join("||");

          if (fallbackSignature !== rowsSignatureRef.current) {
            setRows(fallbackRows);
            rowsSignatureRef.current = fallbackSignature;
          }
          setSource(fallbackRows.length > 0 ? "fallback" : "not-available");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [config, fallbackRows, league]);

  const decoratedRows = useMemo(() => {
    return rows.map((row) => {
      let zone: StandingRow["zone"];

      if (row.position <= 4) zone = "champions";
      else if (row.position === 5) zone = "europa";
      else if (row.position >= config.expectedClubs - 2) zone = "relegation";

      return {
        ...row,
        zone,
      };
    });
  }, [config.expectedClubs, rows]);

  const hasValidatedData = source === "validated" && rows.length > 0;

  return (
    <div className="standings-card standings-card--open">
      <div className="standings-header">
        <div>
          <span className="eyebrow">{t("classification")}</span>
          <h3>{config.label}</h3>
        </div>

        <div className="standings-source">
          <span className={`source-dot source-dot--${source === "not-available" ? "fallback" : source}`} />
          <strong>
            {hasValidatedData
              ? t("validated")
              : source === "fallback"
                ? "FALLBACK"
                : "NOT AVAILABLE"}
          </strong>
        </div>
      </div>

      <div className="standings-columns standings-columns--desktop">
        <span>#</span>
        <span>{t("club")}</span>
        <span>P</span>
        <span>W</span>
        <span>D</span>
        <span>L</span>
        <span>GF</span>
        <span>GA</span>
        <span>GD</span>
        <span>PTS</span>
      </div>

      <div className="standings-columns standings-columns--tablet">
        <span>#</span>
        <span>{t("club")}</span>
        <span>P</span>
        <span>W</span>
        <span>D</span>
        <span>L</span>
        <span>GD</span>
        <span>PTS</span>
      </div>

      <div className="standings-columns standings-columns--mobile">
        <span>#</span>
        <span>{t("club")}</span>
        <span>P</span>
        <span>GD</span>
        <span>PTS</span>
      </div>

      <div className="standings-list">
        {decoratedRows.map((row) => (
          <div className="standing-row" key={`${row.position}-${row.team}`}>
            <span className={`standing-position standing-position--${row.zone ?? "normal"}`}>
              {row.position}
            </span>
            <strong>{row.team}</strong>
            <span className="standing-cell standing-cell--played">{row.played ?? 0}</span>
            <span className="standing-cell standing-cell--wins">{row.wins ?? 0}</span>
            <span className="standing-cell standing-cell--draws">{row.draws ?? 0}</span>
            <span className="standing-cell standing-cell--losses">{row.losses ?? 0}</span>
            <span className="standing-cell standing-cell--gf">{row.goalsFor ?? 0}</span>
            <span className="standing-cell standing-cell--ga">{row.goalsAgainst ?? 0}</span>
            <span className="standing-cell standing-cell--gd">{(row.goalDifference ?? 0) > 0 ? `+${row.goalDifference}` : `${row.goalDifference ?? 0}`}</span>
            <b className="standing-cell standing-cell--points">{row.points}</b>
          </div>
        ))}
      </div>

      <div className="standings-status">
        <span>{config.expectedClubs} clubs</span>
        <span>{hasValidatedData ? "source checked" : source === "fallback" ? "saved fallback" : "data updating"}</span>
      </div>
    </div>
  );
}
