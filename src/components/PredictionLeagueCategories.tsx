import { LeagueCard } from "@/components/LeagueCard";
import { SectionTitle } from "@/components/SectionTitle";
import { primaryPredictionLeagues } from "@/data/leagues";

export function PredictionLeagueCategories({
  id,
  muted = false,
}: {
  id?: string;
  muted?: boolean;
}) {
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
            <LeagueCard key={league.slug} {...league} />
          ))}
        </div>
      </div>
    </section>
  );
}
