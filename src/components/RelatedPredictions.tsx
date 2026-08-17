import Link from "next/link";
import type { Match } from "@/types";
import { leaguesBySlug } from "@/data/leagues";

export function RelatedPredictions({ matches }: { matches: Match[] }) {
  if (matches.length === 0) return null;

  return (
    <section className="related-predictions" aria-labelledby="related-predictions-title">
      <div className="related-predictions-heading">
        <span className="eyebrow">Keep exploring</span>
        <h2 id="related-predictions-title">Related Predictions</h2>
      </div>

      <div className="related-predictions-grid">
        {matches.map((match) => (
          <article className="related-prediction-card" key={match.id}>
            <span>{leaguesBySlug[match.league].name}</span>
            <h3>{match.homeTeam} vs {match.awayTeam}</h3>
            <p>Prediction available</p>
            <Link href={`/match/${match.slug}/`}>
              View prediction <span aria-hidden="true">›</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
