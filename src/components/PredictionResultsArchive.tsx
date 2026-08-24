"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MatchPreview, PredictionResultStatus } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import { buildPredictionHistoryState, resultStatusPresentation } from "@/lib/results";
import { evaluatePredictionSettlement } from "@/lib/prediction-results";

type ResultFilter = "all" | PredictionResultStatus;
const filters: ResultFilter[] = ["all", "awaiting-data", "green", "red", "push", "half-green", "half-red", "void"];

function formatDate(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function PredictionResultsArchive({ matches }: { matches: MatchPreview[] }) {
  const [filter, setFilter] = useState<ResultFilter>("all");
  const historyState = useMemo(() => buildPredictionHistoryState(matches), [matches]);
  const history = historyState.entries;
  const counts = historyState;
  const visible = filter === "all" ? history : history.filter((match) => (match.betResult ?? "pending") === filter);

  return (
    <div className="results-archive" data-default-filter="all">
      <div className="results-summary" aria-label="Prediction result counts">
        <span><b>{counts.published}</b> Published</span>
        <span><b>{counts.completed}</b> Completed</span>
        <span><b>{counts.settled}</b> Settled</span>
        <span><b>{counts.won}</b> Won</span>
        <span><b>{counts.lost}</b> Lost</span>
        <span><b>{counts.push}</b> Push</span>
        <span><b>{counts.awaitingData}</b> Awaiting Data</span>
      </div>

      <div className="results-filters" role="group" aria-label="Filter prediction history">
        {filters.map((status) => (
          <button key={status} type="button" aria-pressed={filter === status} onClick={() => setFilter(status)}>
            {status === "all" ? "ALL" : resultStatusPresentation[status].label}
          </button>
        ))}
      </div>

      <div className="results-list" aria-live="polite">
        {visible.map((match) => {
          const status = match.betResult ?? "pending";
          const presentation = resultStatusPresentation[status];
          const settlement = evaluatePredictionSettlement(match);
          const finalScore = match.homeScore !== undefined && match.homeScore !== null && match.awayScore !== undefined && match.awayScore !== null
            ? `${match.homeScore}–${match.awayScore}` : "Not available";
          return (
            <article
              className="result-card"
              key={match.id}
              data-result-slug={match.slug}
              data-result-status={status}
              data-pick={match.mainPrediction ?? ""}
              data-odds={match.odds ?? ""}
              data-published-at={match.publishedAt ?? ""}
              data-final-score={finalScore === "Not available" ? "" : finalScore.replace("–", "-")}
              data-settlement-missing={settlement.missingFields.join(",")}
            >
              <div className="result-card__heading">
                <div>
                  <span>{leaguesBySlug[match.league].name}</span>
                  <h2><Link href={`/match/${match.slug}/`}>{match.homeTeam} vs {match.awayTeam}</Link></h2>
                </div>
                <strong className={`bet-result bet-result--${status}`} aria-label={`Prediction result: ${presentation.label}`}>
                  <span aria-hidden="true">{presentation.icon}</span> {presentation.label}
                  {status === "awaiting-data" && settlement.missingFields.length ? (
                    <small>{settlement.missingFields.join(", ")} unavailable</small>
                  ) : null}
                </strong>
              </div>
              <dl className="result-card__details">
                <div><dt>Match date</dt><dd>{match.date || "Not available"}</dd></div>
                <div><dt>Published</dt><dd>{formatDate(match.publishedAt)}</dd></div>
                <div><dt>Main prediction</dt><dd>{match.mainPrediction ?? "Not available"}</dd></div>
                <div><dt>Published odds</dt><dd>{match.odds ?? "Not available"}</dd></div>
                <div><dt>Final score</dt><dd>{finalScore}</dd></div>
              </dl>
              <Link className="result-card__link" href={`/match/${match.slug}/`}>View original analysis</Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
