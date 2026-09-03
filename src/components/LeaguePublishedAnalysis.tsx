import Link from "next/link";
import type { Match } from "@/types";
import { localePath, type SeoLocale } from "@/lib/seo-locales";

export function LeaguePublishedAnalysis({
  leagueName,
  matches,
  locale = "en",
  localizedMatchSlugs = [],
  indexableMatchSlugs,
}: {
  leagueName: string;
  matches: Match[];
  locale?: SeoLocale;
  localizedMatchSlugs?: string[];
  indexableMatchSlugs?: string[];
}) {
  const localizedSet = new Set(localizedMatchSlugs);
  const indexableSet = indexableMatchSlugs
    ? new Set(indexableMatchSlugs)
    : null;
  const discoverableMatches = indexableSet
    ? matches.filter((match) => indexableSet.has(match.slug))
    : matches;
  const matchHref = (slug: string) =>
    locale !== "en" && localizedSet.has(slug)
      ? localePath(locale, `/match/${slug}/`)
      : `/match/${slug}/`;
  if (discoverableMatches.length === 0) return null;

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
        {discoverableMatches.map((match) => (
          <article className="related-prediction-card" key={match.id}>
            <span>{match.date}</span>
            <h3>
              <Link href={matchHref(match.slug)} data-quality-gated-match-link="true">
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
