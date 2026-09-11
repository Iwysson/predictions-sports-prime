import Link from "@/components/DocumentLink";
import type { MatchPreview } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import { buildHistoricalPerformance, buildLeaguePerformanceBreakdown, resultStatusPresentation } from "@/lib/results";
import { evaluatePredictionSettlement } from "@/lib/prediction-results";

export const RESULTS_VISIBLE_LIMIT = 60;

function formatDate(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function PredictionResultsArchive({ matches }: { matches: MatchPreview[] }) {
  const performance = buildHistoricalPerformance(matches);
  const visible = performance.entries.slice(0, RESULTS_VISIBLE_LIMIT);
  const leagueBreakdown = buildLeaguePerformanceBreakdown(matches);
  const winRate = performance.winRate === null ? "Not available" : `${(performance.winRate * 100).toFixed(1)}%`;

  return (
    <div className="results-archive" data-results-total={performance.historical} data-results-visible={visible.length}>
      <div className="results-summary" aria-label="Prediction result counts">
        <span><b>{performance.published}</b> Published</span>
        <span><b>{performance.historical}</b> Historical</span>
        <span><b>{performance.settled}</b> Settled</span>
        <span><b>{performance.won}</b> Won</span>
        <span><b>{performance.lost}</b> Lost</span>
        <span><b>{performance.pushOrVoid}</b> Push / void</span>
        <span><b>{performance.awaitingResult}</b> Waiting result</span>
        <span><b>{performance.unresolved}</b> Unresolved</span>
        <span><b>{winRate}</b> Win rate</span>
      </div>

      <p className="results-metric-note"><strong>{performance.won} wins from {performance.decided} decided predictions.</strong> The {winRate} win rate uses wins + losses only. Pushes, voids, half-results, pending fixtures and unresolved records are excluded from that denominator. No ROI or profit is calculated because the archive does not record stakes.</p>

      <section className="results-breakdown" aria-labelledby="league-performance-heading">
        <h2 id="league-performance-heading">Results by competition</h2>
        <p>Every row includes losses and uses the same wins-plus-losses denominator. Small samples should not be treated as forecasts.</p>
        <div className="results-breakdown__grid">
          {leagueBreakdown.map((entry) => (
            <Link href={`/league/${entry.league}/`} key={entry.league}>
              <strong>{leaguesBySlug[entry.league].name}</strong>
              <span>{entry.won}-{entry.lost} from {entry.decided} decided</span>
            </Link>
          ))}
        </div>
      </section>

      <h2 className="results-list-heading">Latest historical predictions</h2>
      <p className="results-list-intro">Showing the {visible.length} most recent of {performance.historical} historical records. The summary above is calculated from the full archive.</p>

      <div className="results-list">
        {visible.map((match) => {
          const status = match.betResult ?? "pending";
          const presentation = resultStatusPresentation[status];
          const settlement = evaluatePredictionSettlement(match);
          const waitingForResult = settlement.pendingReason === "NOT_COMPLETED";
          const awaitingLabel = waitingForResult ? "WAITING RESULT" : settlement.pendingReason === "EXECUTION_DATA_MISSING" ? "AWAITING EXECUTION DATA" : status === "pending" ? "UNRESOLVED" : "AWAITING MARKET DATA";
          const displayedAsAwaiting = waitingForResult || status === "awaiting-data" || status === "pending";
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
              data-settlement-reason={settlement.pendingReason ?? ""}
            >
              <div className="result-card__heading">
                <div>
                  <span>{leaguesBySlug[match.league].name}</span>
                  <h2><Link href={`/match/${match.slug}/`}>{match.homeTeam} vs {match.awayTeam}</Link></h2>
                </div>
                <strong className={`bet-result bet-result--${displayedAsAwaiting ? "awaiting-data" : status}`} aria-label={`Prediction result: ${displayedAsAwaiting ? awaitingLabel : presentation.label}`}>
                  <span aria-hidden="true">{presentation.icon}</span> {displayedAsAwaiting ? awaitingLabel : presentation.label}
                  {!waitingForResult && status === "awaiting-data" && settlement.missingFields.length ? (
                    <small>{settlement.missingFields.join(", ")} unavailable</small>
                  ) : null}
                </strong>
              </div>
              <dl className="result-card__details">
                <div><dt>Match date</dt><dd>{match.date || "Not available"}</dd></div>
                <div><dt>Published</dt><dd>{formatDate(match.publishedAt)}</dd></div>
                <div><dt>Published prediction</dt><dd>{match.mainPrediction ?? "Not available"}</dd></div>
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
