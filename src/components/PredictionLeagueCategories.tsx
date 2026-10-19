import Link from "@/components/DocumentLink";
import { LeagueCard } from "@/components/LeagueCard";
import { NhlLeagueMark } from "@/components/NhlBestMultiple";
import { SectionTitle } from "@/components/SectionTitle";
import { primaryPredictionLeagues } from "@/data/leagues";
import type { SeoLocale } from "@/lib/seo-locales";
import { homeFeedCopy } from "@/lib/home-feed-copy";

export function PredictionLeagueCategories({
  id,
  muted = false,
  locale = "en",
}: {
  id?: string;
  muted?: boolean;
  locale?: SeoLocale;
}) {
  const copy = homeFeedCopy(locale);
  // NHL and NFL hubs are English-only, so they are featured on the English home only.
  const showFeatured = locale === "en";
  // Club competitions in the requested Top Prediction Leagues order; the rest keep their order.
  const rank = new Map(["premier-league", "la-liga", "bundesliga", "serie-a", "liga-portugal", "ligue-1", "eredivisie", "brasileirao-serie-a"].map((slug, i) => [slug, i]));
  const orderedLeagues = [...primaryPredictionLeagues].sort(
    (a, b) => (rank.get(a.slug) ?? 100) - (rank.get(b.slug) ?? 100)
  );
  return (
    <section
      className={`section section--compact${muted ? " section--muted" : ""}`}
      id={id}
    >
      <div className="container">
        <SectionTitle
          icon="♜"
          eyebrowKey="predictionCategories"
          titleKey="competitions"
        />

        <div className="league-grid league-grid--compact">
          {showFeatured ? (
            <>
              <Link href="/nhl/" className="league-card league-card--featured">
                <div className="league-symbol-wrap league-symbol-wrap--real">
                  <NhlLeagueMark compact />
                </div>
                <div className="league-card-copy">
                  <span className="featured-league-badge">Today&apos;s picks</span>
                  <strong>NHL Predictions</strong>
                  <small>Ice hockey</small>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/nfl/" className="league-card league-card--featured">
                <div className="league-symbol-wrap league-symbol-wrap--real">
                  <img src="/nfl/nfl-logo.png" alt="" width={28} height={28} />
                </div>
                <div className="league-card-copy">
                  <span className="featured-league-badge">Weekly picks</span>
                  <strong>NFL Predictions</strong>
                  <small>American football</small>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link href="/nba/" className="league-card league-card--featured">
                <div className="league-symbol-wrap league-symbol-wrap--real">
                  <span className="team-badge team-badge--md" style={{ background: "linear-gradient(145deg, #1d428a, #1d428a 56%, #c8102e 57%, #c8102e)" }} aria-hidden="true">
                    <span>NBA</span>
                  </span>
                </div>
                <div className="league-card-copy">
                  <span className="featured-league-badge">Today&apos;s picks</span>
                  <strong>NBA Predictions</strong>
                  <small>Basketball</small>
                </div>
                <span className="arrow">→</span>
              </Link>
            </>
          ) : null}
          {/* Individual football league hubs were retired (/league/<slug>/ now redirects to
              /football-predictions/): these stay purely informational tiles, no href, so the
              logos/names/colors/grid/spacing are unchanged but nothing links to a removed page. */}
          {orderedLeagues.map((league) => (
            <LeagueCard key={league.slug} {...league} displayLabel={`${league.name} ${copy.predictionsSuffix}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
