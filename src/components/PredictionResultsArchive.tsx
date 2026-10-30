"use client";

import { useEffect, useMemo, useState } from "react";
import { leaguesBySlug } from "@/data/leagues";
import { resultLabels, sortedResults, summarizeResults, type FootballResultRecord, type FootballResultsDataset } from "@/lib/football-results";
import { pendingReasonLabels, type PendingResultRecord } from "@/lib/pending-results";
import { RESULTS_HISTORY_VISIBLE_LIMIT } from "@/lib/results-history-audit";
import { FootballTrackRecord } from "@/components/FootballTrackRecord";

const tone = (result: FootballResultRecord["result"]) =>
  result === "green" || result === "half-green" ? "green" : result === "red" || result === "half-red" ? "red" : "push";

const leagueName = (slug: string) => leaguesBySlug[slug as keyof typeof leaguesBySlug]?.name ?? slug;

type Row = { kind: "settled"; record: FootballResultRecord } | { kind: "pending"; record: PendingResultRecord };

/**
 * The single global Results view, and the only place the public history is read from. It starts from the
 * dataset of the deployed build, then swaps in /api/results/, which carries whatever the sync workflow has
 * committed since. All statistics count settled records only; a PENDING record is listed but never counted.
 */
export function PredictionResultsArchive({
  dataset,
  pending,
}: {
  dataset: FootballResultsDataset;
  pending: Record<string, PendingResultRecord>;
}) {
  const [records, setRecords] = useState(dataset.records);
  const [pendingRecords, setPendingRecords] = useState(pending);
  const [league, setLeague] = useState("all");
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/results/", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!body?.records) return;
        setRecords(body.records);
        setPendingRecords(body.pending ?? {});
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const all = useMemo(() => sortedResults({ version: 1, records }), [records]);
  const summary = summarizeResults(all);
  const winRate = summary.winRate === null ? "Not available" : `${(summary.winRate * 100).toFixed(1)}%`;
  const pendingList = useMemo(() => Object.values(pendingRecords), [pendingRecords]);

  const leagueBreakdown = useMemo(() => {
    const byLeague = new Map<string, FootballResultRecord[]>();
    for (const record of all) byLeague.set(record.league, [...(byLeague.get(record.league) ?? []), record]);
    return [...byLeague.entries()]
      .map(([slug, group]) => ({ league: slug, ...summarizeResults(group) }))
      .filter((entry) => entry.wins + entry.losses > 0)
      .sort((left, right) => right.settled - left.settled || left.league.localeCompare(right.league));
  }, [all]);

  const competitions = useMemo(
    () => [...new Set([...all, ...pendingList].map((record) => record.league))].sort((left, right) => leagueName(left).localeCompare(leagueName(right))),
    [all, pendingList]
  );

  const rows = useMemo(() => {
    const merged: Row[] = [
      ...all.map((record) => ({ kind: "settled" as const, record })),
      ...pendingList.map((record) => ({ kind: "pending" as const, record })),
    ];
    return merged
      .filter(({ record }) => league === "all" || record.league === league)
      .filter(({ record }) => tier === "all" || record.predictionAccess === tier)
      .filter((row) => status === "all" || (row.kind === "pending" ? status === "pending" : row.record.result === status))
      .sort((left, right) => right.record.date.localeCompare(left.record.date) || left.record.key.localeCompare(right.record.key));
  }, [all, pendingList, league, status, tier]);

  const pages = Math.max(1, Math.ceil(rows.length / RESULTS_HISTORY_VISIBLE_LIMIT));
  const currentPage = Math.min(page, pages);
  const visible = rows.slice((currentPage - 1) * RESULTS_HISTORY_VISIBLE_LIMIT, currentPage * RESULTS_HISTORY_VISIBLE_LIMIT);

  // A link to /results/#<slug> must land on its record even when that record is on a later page.
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (!slug) return;
    const index = rows.findIndex((row) => row.record.slug === slug);
    if (index < 0) return;
    setPage(Math.floor(index / RESULTS_HISTORY_VISIBLE_LIMIT) + 1);
    requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView());
    // Only the first render is an arrival from a link; later filter changes must not jump back to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filter = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    setter(event.target.value);
    setPage(1);
  };

  const days = new Map<string, Row[]>();
  for (const row of visible) days.set(row.record.date, [...(days.get(row.record.date) ?? []), row]);

  return (
    <div className="results-archive" data-results-total={all.length} data-results-pending={pendingList.length} data-results-visible={visible.length}>
      <FootballTrackRecord records={all} />
      <div className="results-summary" aria-label="Prediction result counts">
        <span><b>{summary.settled}</b> Total settled</span>
        <span><b>{summary.wins}</b> Green</span>
        <span><b>{summary.losses}</b> Red</span>
        <span><b>{summary.pushes + summary.halfWins + summary.halfLosses + summary.voids}</b> Push / half / void</span>
        <span><b>{winRate}</b> Win rate</span>
        <span><b>{pendingList.length}</b> Pending</span>
      </div>

      <p className="results-metric-note"><strong>{summary.wins} green from {summary.wins + summary.losses} decided predictions.</strong> The {winRate} win rate uses green ÷ (green + red). Pushes, half results, voids and pending records are excluded. No ROI or profit is calculated because stakes are not recorded.</p>

      {leagueBreakdown.length > 0 ? (
        <section className="results-breakdown" aria-labelledby="league-performance-heading">
          <h2 id="league-performance-heading">Results by competition</h2>
          <div className="results-breakdown__grid">
            {leagueBreakdown.map((entry) => (
              <div className="results-breakdown__item" key={entry.league}>
                <strong>{leagueName(entry.league)}</strong>
                <span>{entry.wins}-{entry.losses} from {entry.wins + entry.losses} decided</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <h2 className="results-list-heading">Football prediction results</h2>
      <p className="results-list-intro">{rows.length} of {all.length + pendingList.length} records, most recent first. Each match appears once, with the final score and settlement. The pick and odds are shown exactly as published before kickoff; a protected pick stays hidden until it settles, and premium analysis stays protected.</p>

      <div className="results-filters" role="group" aria-label="Filter results">
        <label>
          <span>Competition</span>
          <select value={league} onChange={filter(setLeague)}>
            <option value="all">All competitions</option>
            {competitions.map((slug) => <option key={slug} value={slug}>{leagueName(slug)}</option>)}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={filter(setStatus)}>
            <option value="all">All statuses</option>
            <option value="green">{resultLabels.green}</option>
            <option value="red">{resultLabels.red}</option>
            <option value="void">{resultLabels.void}</option>
            <option value="push">{resultLabels.push}</option>
            <option value="half-green">{resultLabels["half-green"]}</option>
            <option value="half-red">{resultLabels["half-red"]}</option>
            <option value="pending">PENDING</option>
          </select>
        </label>
        <label>
          <span>Access</span>
          <select value={tier} onChange={filter(setTier)}>
            <option value="all">FREE and PRIME VIP</option>
            <option value="free">FREE</option>
            <option value="vip">PRIME VIP</option>
          </select>
        </label>
      </div>

      {rows.length === 0 ? <div className="empty-state empty-state--compact"><strong>No records match these filters.</strong></div> : null}

      {[...days.entries()].map(([date, group]) => (
        <section className="results-day" key={date} aria-label={`Results for ${date}`}>
          <h3 className="results-day__heading">{date}</h3>
          <div className="results-list">
            {group.map((row) => row.kind === "settled" ? (
              <article
                className="result-card"
                key={row.record.key}
                id={row.record.slug}
                data-result-slug={row.record.slug}
                data-result-status={row.record.result}
                data-pick={row.record.prediction}
                data-odds={row.record.odds ?? ""}
                data-final-score={row.record.finalScore ? `${row.record.finalScore.home}-${row.record.finalScore.away}` : ""}
              >
                <div className="result-card__heading">
                  <div>
                    <span>{leagueName(row.record.league)}</span>
                    <h2>{row.record.homeTeam} vs {row.record.awayTeam}</h2>
                  </div>
                  <strong className={`bet-result bet-result--${tone(row.record.result)}`} aria-label={`Prediction result: ${resultLabels[row.record.result]}`}>
                    {resultLabels[row.record.result]}
                  </strong>
                </div>
                <dl className="result-card__details">
                  <div><dt>Match date</dt><dd>{row.record.date}</dd></div>
                  <div><dt>League</dt><dd>{leagueName(row.record.league)}</dd></div>
                  <div><dt>Published prediction</dt><dd>{row.record.prediction}</dd></div>
                  <div><dt>Published odds</dt><dd>{row.record.odds ?? "Not available"}</dd></div>
                  <div><dt>Final score</dt><dd>{row.record.finalScore ? `${row.record.finalScore.home}–${row.record.finalScore.away}` : "Cancelled"}</dd></div>
                </dl>
              </article>
            ) : (
              <article
                className="result-card result-card--pending"
                key={row.record.key}
                id={row.record.slug}
                data-pending-slug={row.record.slug}
                data-result-status="pending"
              >
                <div className="result-card__heading">
                  <div>
                    <span>{leagueName(row.record.league)}</span>
                    <h2>{row.record.homeTeam} vs {row.record.awayTeam}</h2>
                  </div>
                  <strong className="bet-result bet-result--push" aria-label="Prediction result: PENDING">PENDING</strong>
                </div>
                <dl className="result-card__details">
                  <div><dt>Match date</dt><dd>{row.record.date}</dd></div>
                  <div><dt>League</dt><dd>{leagueName(row.record.league)}</dd></div>
                  <div><dt>Published prediction</dt><dd>{row.record.prediction ?? "PRIME VIP: shown once settled"}</dd></div>
                  <div><dt>Published odds</dt><dd>{row.record.odds ?? "Not available"}</dd></div>
                  <div><dt>Status</dt><dd>{pendingReasonLabels[row.record.reason] ?? "Awaiting verification"}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      ))}

      {pages > 1 ? (
        <nav className="results-pagination" aria-label="Results pages">
          <button type="button" disabled={currentPage === 1} onClick={() => { setPage(currentPage - 1); window.scrollTo({ top: 0 }); }}>Previous</button>
          <span>Page {currentPage} of {pages}</span>
          <button type="button" disabled={currentPage === pages} onClick={() => { setPage(currentPage + 1); window.scrollTo({ top: 0 }); }}>Next</button>
        </nav>
      ) : null}
    </div>
  );
}
