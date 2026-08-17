"use client";

import { useEffect, useMemo, useState } from "react";
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
    "validated" | "fallback" | "loading"
  >("loading");

  useEffect(() => {
    let cancelled = false;

    loadLiveStandings(league)
      .then((computed) => {
        if (!cancelled) {
          setRows(computed);
          setSource("validated");
        }
      })
      .catch((error) => {
        console.warn(`Using table fallback for ${config.label}:`, error);

        if (!cancelled) {
          setRows(fallbackRows);
          setSource("fallback");
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

  return (
    <div className="standings-card standings-card--open">
      <div className="standings-header">
        <div>
          <span className="eyebrow">{t("classification")}</span>
          <h3>{config.label}</h3>
        </div>

        <div className="standings-source">
          <span className={`source-dot source-dot--${source}`} />
          <strong>
            {source === "loading"
              ? t("validating")
              : source === "validated"
                ? t("validated")
                : t("saved")}
          </strong>
        </div>
      </div>

      <div className="standings-columns">
        <span>#</span>
        <span>{t("club")}</span>
        <span>{t("played")}</span>
        <span>GD</span>
        <span>{t("points")}</span>
      </div>

      <div className="standings-list">
        {decoratedRows.map((row) => (
          <div className="standing-row" key={`${row.position}-${row.team}`}>
            <span className={`standing-position standing-position--${row.zone ?? "normal"}`}>
              {row.position}
            </span>
            <strong>{row.team}</strong>
            <span>{row.played}</span>
            <span>{row.goalDifference ?? 0}</span>
            <b>{row.points}</b>
          </div>
        ))}
      </div>

      <div className="standings-status">
        <span>{config.expectedClubs} clubs</span>
        <span>{source === "validated" ? "source checked" : "local fallback"}</span>
      </div>
    </div>
  );
}
