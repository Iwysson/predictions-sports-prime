import type { Match, MatchModuleSource, MatchTeamSide } from "@/types";

function Sources({ sources }: { sources: MatchModuleSource[] }) {
  return (
    <p className="match-module-sources">
      Sources: {sources.map((source, index) => (
        <span key={source.url}>
          {index ? "; " : ""}
          <a href={source.url} rel="noopener noreferrer">{source.name}</a>
        </span>
      ))}
    </p>
  );
}

function teamName(match: Match, side: MatchTeamSide) {
  return side === "home" ? match.homeTeam : match.awayTeam;
}

export function MatchSemanticDetails({ match }: { match: Match }) {
  const data = match.matchSeo;
  if (!data) return null;

  return (
    <div className="match-semantic-details">
      <section className="match-module" aria-labelledby="match-information-heading">
        <h2 id="match-information-heading">Match Information</h2>
        <dl className="match-information-grid">
          <div><dt>Competition</dt><dd>{match.round}</dd></div>
          <div><dt>Date</dt><dd>{match.date}</dd></div>
          <div><dt>Local time</dt><dd>{match.time}</dd></div>
          {match.venue ? <div><dt>Venue</dt><dd>{match.venue}</dd></div> : null}
          {data.information?.city ? <div><dt>City</dt><dd>{data.information.city}</dd></div> : null}
          {data.information?.country ? <div><dt>Country</dt><dd>{data.information.country}</dd></div> : null}
          {data.information?.timezone ? <div><dt>Timezone</dt><dd>{data.information.timezone}</dd></div> : null}
          {data.information?.referee ? <div><dt>Referee</dt><dd>{data.information.referee}</dd></div> : null}
        </dl>
        {data.information ? <Sources sources={data.information.sources} /> : null}
      </section>

      {data.lineups ? (
        <section className="match-module" aria-labelledby="match-lineups-heading">
          <h2 id="match-lineups-heading">{data.lineups.status === "confirmed" ? "Confirmed Lineups" : "Expected Lineups"}</h2>
          <p className="match-module-note">Pre-match projection; check the official team sheets close to kickoff.</p>
          <div className="match-lineups-grid">
            {(["home", "away"] as const).map((side) => {
              const lineup = data.lineups![side];
              return (
                <div key={side}>
                  <h3>{teamName(match, side)}{lineup.formation ? ` (${lineup.formation})` : ""}</h3>
                  <ol>{lineup.players.map((player) => <li key={player}>{player}</li>)}</ol>
                </div>
              );
            })}
          </div>
          <Sources sources={data.lineups.sources} />
        </section>
      ) : null}

      {data.availability ? (
        <section className="match-module" aria-labelledby="match-availability-heading">
          <h2 id="match-availability-heading">Player Availability</h2>
          <ul className="match-availability-list">
            {data.availability.entries.map((entry) => (
              <li key={`${entry.team}-${entry.player}`}>
                <strong>{entry.player}</strong> ({teamName(match, entry.team)}) — {entry.status}{entry.detail ? `: ${entry.detail}` : ""}
              </li>
            ))}
          </ul>
          <Sources sources={data.availability.sources} />
        </section>
      ) : null}

      {data.teamNews ? (
        <section className="match-module" aria-labelledby="match-team-news-heading">
          <h2 id="match-team-news-heading">Team News</h2>
          {data.teamNews.entries.map((entry) => (
            <p key={`${entry.team}-${entry.text}`}><strong>{teamName(match, entry.team)}:</strong> {entry.text}</p>
          ))}
          <Sources sources={data.teamNews.sources} />
        </section>
      ) : null}

      {data.statistics ? (
        <section className="match-module" aria-labelledby="match-statistics-heading">
          <h2 id="match-statistics-heading">Match Statistics</h2>
          <p className="match-module-note">Sample: {data.statistics.sample}</p>
          <div className="match-stats" role="table" aria-label={`${match.homeTeam} and ${match.awayTeam} statistics`}>
            <div className="match-stats-row match-stats-header" role="row">
              <span role="columnheader">Metric</span><span role="columnheader">{match.homeTeam}</span><span role="columnheader">{match.awayTeam}</span>
            </div>
            {data.statistics.rows.map((row) => (
              <div className="match-stats-row" role="row" key={row.label}>
                <span role="rowheader">{row.label}</span><span role="cell">{row.home}</span><span role="cell">{row.away}</span>
              </div>
            ))}
          </div>
          <Sources sources={data.statistics.sources} />
        </section>
      ) : null}

      {data.h2h ? (
        <section className="match-module" aria-labelledby="match-h2h-heading">
          <h2 id="match-h2h-heading">Head-to-Head</h2>
          <p>{data.h2h.summary}</p>
          <Sources sources={data.h2h.sources} />
        </section>
      ) : null}

      {data.weather ? (
        <section className="match-module" aria-labelledby="match-weather-heading">
          <h2 id="match-weather-heading">Match Weather</h2>
          <p>{data.weather.summary}</p>
          <Sources sources={data.weather.sources} />
        </section>
      ) : null}
    </div>
  );
}
