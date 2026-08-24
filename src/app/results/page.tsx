import Link from "next/link";
import { PredictionResultsArchive } from "@/components/PredictionResultsArchive";
import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import { buildLegalMetadata } from "@/lib/legal-pages";
import { JsonLd } from "@/components/JsonLd";
import { institutionalPageJsonLd } from "@/lib/seo";

const description = "The complete history of published Predictions Sports Prime football predictions, including wins, losses, pushes and completed entries awaiting factual market data.";

export const metadata = buildLegalMetadata(
  "Prediction results",
  "/results/",
  description
);

export default async function ResultsPage() {
  const resolved = await hydratePredictions(matches.map(toMatchPreview));
  return (
    <>
    <JsonLd data={institutionalPageJsonLd("WebPage", "Prediction results", "/results/", description)} />
    <main className="section results-page">
      <div className="container results-container">
        <header className="results-header">
          <span className="eyebrow">Transparency</span>
          <h1>Prediction results</h1>
          <p>This archive retains every published prediction. The default view is the complete history, and wins, losses and unresolved entries are treated equally.</p>
        </header>
        <PredictionResultsArchive matches={resolved} />
        <section className="results-settlement-note">
          <h2>How results are settled</h2>
          <p>A result is settled only from a stored result or a completed fixture with the factual data required by its market. Supported markets are evaluated by the site's shared settlement rules: won, lost, push, Asian-handicap half won or half lost, and void when explicitly recorded. Completed fixtures missing corners or other required facts are marked Awaiting Data rather than being guessed or presented as unplayed.</p>
          <p>Historical results are derived from the site's published prediction records and available final-score data. The complete archive was introduced after the earliest analyses were published, so it should not be read as a claim that live history was always available.</p>
          <p>See <Link href="/methodology/">our methodology</Link> and <Link href="/editorial-policy/">editorial policy</Link>.</p>
        </section>
      </div>
    </main>
    </>
  );
}
