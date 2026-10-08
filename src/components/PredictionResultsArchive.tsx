import Link from "@/components/DocumentLink";
import { leaguesBySlug } from "@/data/leagues";
import { resultLabels, sortedResults, summarizeResults, toPublicResult, type FootballResultRecord, type FootballResultsDataset } from "@/lib/football-results";

export const RESULTS_VISIBLE_LIMIT = 200;

const tone = (result: FootballResultRecord["result"]) =>
  result === "green" || result === "half-green" ? "green" : result === "red" || result === "half-red" ? "red" : "push";

const leagueName = (slug: string) => leaguesBySlug[slug as keyof typeof leaguesBySlug]?.name ?? slug;

/**
 * The single global Results view. Reads only the central results dataset, the
 * same source as the homepage preview. Grouping is presentational; there are
 * no per-match, per-league or per-day result routes.
 */
export function PredictionResultsArchive({
  dataset,
  inProgress,
  awaitingData,
}: {
  dataset: FootballResultsDataset;
  inProgress: number;
  awaitingData: number;
}) {
  const all = sortedResults(dataset);
  const summary = summarizeResults(all);
  const visible = all.slice(0, RESULTS_VISIBLE_LIMIT).map(toPublicResult);
  const winRate = summary.winRate === null ? "Not available" : `${(summary.winRate * 100).toFixed(1)}%`;

  const byLeague = new Map<string, FootballResultRecord[]>();
  for (const record of all) byLeague.set(record.league, [...(byLeague.get(record.league) ?? []), record]);
  const leagueBreakdown = [...byLeague.entries()]
    .map(([league, records]) => ({ league, ...summarizeResults(records) }))
    .filter((entry) => entry.wins + entry.losses > 0)
    .sort((left, right) => right.settled - left.settled || left.league.localeCompare(right.league));

  const days = new Map<string, ReturnType<typeof toPublicResult>[]>();
  for (const record of visible) days.set(record.date, [...(days.get(record.date) ?? []), record]);

  return (
    <div className="results-archive" data-results-total={all.length} data-results-visible={visible.length}>
      <div className="results-summary" aria-label="Prediction result counts">
        <span><b>{summary.settled}</b> Total settled</span>
        <span><b>{summary.wins}</b> Wins</span>
        <span><b>{summary.losses}</b> Losses</span>
        <span><b>{summary.pushes + summary.halfWins + summary.halfLosses + summary.voids}</b> Push / half / void</span>
        <span><b>{winRate}</b> Win rate</span>
        <span><b>{inProgress}</b> Live</span>
        <span><b>{awaitingData}</b> Awaiting market data</span>
      </div>

      <p className="results-metric-note"><strong>{summary.wins} wins from {summary.wins + summary.losses} decided predictions.</strong> The {winRate} win rate uses wins ÷ (wins + losses). Pushes, half results, voids, live matches and fixtures awaiting verified market data are excluded. No ROI or profit is calculated because stakes are not recorded.</p>

      {leagueBreakdown.length > 0 ? (
        <section className="results-breakdown" aria-labelledby="league-performance-heading">
          <h2 id="league-performance-heading">Results by competition</h2>
          <div className="results-breakdown__grid">
            {leagueBreakdown.map((entry) => (
              <Link href={`/league/${entry.league}/`} key={entry.league}>
                <strong>{leagueName(entry.league)}</strong>
                <span>{entry.wins}-{entry.losses} from {entry.wins + entry.losses} decided</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <h2 className="results-list-heading">Latest football prediction results</h2>
      <p className="results-list-intro">Showing the {visible.length} most recent of {all.length} settled predictions. Each match appears once, with the final score and settlement. The pick and odds are shown exactly as published before kickoff, and only after the match is officially final; premium analysis stays protected.</p>

      {all.length === 0 ? <div className="empty-state empty-state--compact"><strong>No completed predictions yet.</strong></div> : null}

      {[...days.entries()].map(([date, records]) => (
        <section className="results-day" key={date} aria-label={`Results for ${date}`}>
          <h3 className="results-day__heading">{date}</h3>
          <div className="results-list">
            {records.map((record) => (
              <article
                className="result-card"
                key={record.key}
                data-result-slug={record.slug}
                data-result-status={record.result}
                data-pick={record.prediction}
                data-odds={record.odds ?? ""}
                data-final-score={`${record.finalScore.home}-${record.finalScore.away}`}
              >
                <div className="result-card__heading">
                  <div>
                    <span>{leagueName(record.league)}</span>
                    <h2><Link href={`/match/${record.slug}/`}>{record.homeTeam} vs {record.awayTeam}</Link></h2>
                  </div>
                  <strong className={`bet-result bet-result--${tone(record.result)}`} aria-label={`Prediction result: ${resultLabels[record.result]}`}>
                    {resultLabels[record.result]}
                  </strong>
                </div>
                <dl className="result-card__details">
                  <div><dt>Match date</dt><dd>{record.date}</dd></div>
                  <div><dt>League</dt><dd>{leagueName(record.league)}</dd></div>
                  <div><dt>Published prediction</dt><dd>{record.prediction}</dd></div>
                  <div><dt>Published odds</dt><dd>{record.odds ?? "Not available"}</dd></div>
                  <div><dt>Final score</dt><dd>{record.finalScore.home}–{record.finalScore.away}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
