"use client";

import { useState } from "react";
import { StandingRow } from "@/data/standings";

export function CompactStandings({
  leagueName,
  rows,
}: {
  leagueName: string;
  rows: StandingRow[];
}) {
  const [open, setOpen] = useState(false);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="standings-shell">
      <button
        className="standings-mobile-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>Table</span>
        <strong>{open ? "−" : "+"}</strong>
      </button>

      <div className={`standings-card ${open ? "standings-card--open" : ""}`}>
        <div className="standings-header">
          <div>
            <span className="eyebrow">CLASSIFICATION</span>
            <h3>{leagueName}</h3>
          </div>
          <span className="standings-live">TABLE</span>
        </div>

        <div className="standings-columns">
          <span>#</span>
          <span>Club</span>
          <span>PJ</span>
          <span>PTS</span>
        </div>

        <div className="standings-list">
          {rows.map((row) => (
            <div className="standing-row" key={`${row.position}-${row.team}`}>
              <span className={`standing-position standing-position--${row.zone ?? "normal"}`}>
                {row.position}
              </span>
              <strong>{row.team}</strong>
              <span>{row.played}</span>
              <b>{row.points}</b>
            </div>
          ))}
        </div>

        <div className="standings-legend">
          <span><i className="legend-dot legend-dot--champions" /> Champions</span>
          <span><i className="legend-dot legend-dot--europa" /> Europa</span>
          <span><i className="legend-dot legend-dot--relegation" /> Relegation</span>
        </div>
      </div>
    </div>
  );
}
