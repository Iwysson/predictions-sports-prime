import { LeagueCard } from "@/components/LeagueCard";
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
