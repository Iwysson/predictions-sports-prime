import Link from "next/link";
import type { Match } from "@/types";

export function LeaguePublishedAnalysis({
  leagueName,
  matches,
}: {
  leagueName: string;
  matches: Match[];
}) {
  if (matches.length === 0) return null;

  return (
    <section className="league-analysis-archive" aria-labelledby="league-analysis-archive-title">
      <div className="section-heading section-heading--compact">
        <div className="heading-with-icon">
          <span className="section-icon" aria-hidden="true">+</span>
          <div>
            <span className="eyebrow">Editorial archive</span>
            <h2 id="league-analysis-archive-title">Published {leagueName} Analysis</h2>
          </div>
        </div>
      </div>

      <p className="league-analysis-archive__intro">
        Read published match analysis preserved separately from the active fixture rounds.
      </p>

      <div className="related-predictions-grid">
        {matches.map((match) => (
          <article className="related-prediction-card" key={match.id}>
            <span>{match.date}</span>
            <h3>
              <Link href={`/match/${match.slug}/`}>
                {match.homeTeam} vs {match.awayTeam}
              </Link>
            </h3>
            <p>Published prediction and pre-match reasoning.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
