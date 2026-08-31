import Link from "next/link";
import type { CompetitionRoundSurface } from "@/lib/competition-rounds";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";
import { localTodayISO } from "@/lib/match-feed";
import type { Match, MatchPreview } from "@/types";

function uniqueMatches(matches: MatchPreview[]) {
  return [...new Map(matches.map((match) => [match.slug, match])).values()];
}

function isCompleted(match: MatchPreview | Match) {
  return isHistoryEligibleFixture({
    status: match.fixtureStatus,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  });
}

function MatchLinks({
  matches,
  context,
}: {
  matches: MatchPreview[];
  context: "today" | "upcoming";
}) {
  if (!matches.length) return null;
  return (
    <div className="league-hub-list">
      {matches.map((match) => (
        <article className="league-hub-fixture" key={match.slug}>
          <div>
            <span>{match.date}{match.time && match.time !== "TBD" ? ` · ${match.time}` : ""}</span>
            <h3>{match.homeTeam} vs {match.awayTeam}</h3>
          </div>
          {match.status === "published" ? (
            <Link href={`/match/${match.slug}/`}>
              {context === "today"
                ? `${match.homeTeam} vs ${match.awayTeam} prediction`
                : `Preview ${match.homeTeam} vs ${match.awayTeam}`}
            </Link>
          ) : <span className="league-hub-unavailable">Analysis not published</span>}
        </article>
      ))}
    </div>
  );
}

export function LeagueEditorialHub({
  leagueName,
  publishedMatches,
  surface,
}: {
  leagueName: string;
  publishedMatches: Match[];
  surface: CompetitionRoundSurface;
}) {
  const today = localTodayISO();
  const roundMatches = uniqueMatches([
    ...(surface.current?.matches ?? []),
    ...(surface.next?.matches ?? []),
  ]);
  const todayMatches = roundMatches.filter((match) => match.date === today && !isCompleted(match));
  const upcomingMatches = roundMatches.filter((match) => match.date > today && !isCompleted(match)).slice(0, 8);
  const completed = [...publishedMatches]
    .filter(isCompleted)
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 6);
  const latest = [...publishedMatches]
    .sort((left, right) =>
      (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "") || right.date.localeCompare(left.date)
    )
    .slice(0, 6);
  const currentCount = surface.current?.matches.length ?? 0;
  const currentPublished = surface.current?.matches.filter((match) => match.status === "published").length ?? 0;
  const currentCompleted = surface.current?.matches.filter(isCompleted).length ?? 0;

  return (
    <div className="league-editorial-hub">
      <section className="league-hub-overview" aria-labelledby="league-overview-heading">
        <h2 id="league-overview-heading">{leagueName} Overview</h2>
        <p>
          {surface.current ? `${surface.current.round} contains ${currentCount} fixtures.` : "The current round is awaiting confirmed fixture data."}
          {` ${currentPublished} published ${currentPublished === 1 ? "analysis is" : "analyses are"} available`}
          {currentCompleted ? `, with ${currentCompleted} completed ${currentCompleted === 1 ? "match" : "matches"}.` : "."}
        </p>
      </section>

      {todayMatches.length ? (
        <section aria-labelledby="league-today-heading">
          <h2 id="league-today-heading">Today&apos;s {leagueName} Matches</h2>
          <MatchLinks matches={todayMatches} context="today" />
        </section>
      ) : null}

      {upcomingMatches.length ? (
        <section aria-labelledby="league-upcoming-heading">
          <h2 id="league-upcoming-heading">Upcoming {leagueName} Matches</h2>
          <MatchLinks matches={upcomingMatches} context="upcoming" />
        </section>
      ) : null}

      {latest.length ? (
        <section aria-labelledby="league-latest-analysis-heading">
          <h2 id="league-latest-analysis-heading">Latest {leagueName} Predictions</h2>
          <div className="league-hub-analysis-grid">
            {latest.map((match, index) => (
              <article key={match.slug}>
                <span>{match.date}</span>
                <h3><Link href={`/match/${match.slug}/`}>{match.homeTeam} vs {match.awayTeam}</Link></h3>
                <Link href={`/match/${match.slug}/`}>
                  {index % 2 === 0
                    ? `${match.homeTeam} vs ${match.awayTeam} prediction`
                    : `Read the ${match.homeTeam} vs ${match.awayTeam} analysis`}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {completed.length ? (
        <section aria-labelledby="league-results-heading">
          <h2 id="league-results-heading">Recent {leagueName} Results</h2>
          <div className="league-hub-results">
            {completed.map((match) => (
              <article key={match.slug}>
                <span>{match.date}</span>
                <strong>{match.homeTeam} {match.homeScore}–{match.awayScore} {match.awayTeam}</strong>
                <Link href={`/match/${match.slug}/`}>Review the published prediction</Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
