import { LeagueCard } from "@/components/LeagueCard";
import { SectionTitle } from "@/components/SectionTitle";
import { primaryPredictionLeagues } from "@/data/leagues";
import { localePath, type SeoLocale } from "@/lib/seo-locales";
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
          {primaryPredictionLeagues.map((league) => (
            <LeagueCard key={league.slug} {...league} href={localePath(locale, `/league/${league.slug}/`)} displayLabel={`${league.name} ${copy.predictionsSuffix}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
