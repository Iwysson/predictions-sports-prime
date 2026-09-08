import Link from "next/link";
import { PredictionResultsArchive } from "@/components/PredictionResultsArchive";
import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import { buildLegalMetadata } from "@/lib/legal-pages";
import { JsonLd } from "@/components/JsonLd";
import { institutionalPageJsonLd } from "@/lib/seo";
import { buildHistoricalPerformance } from "@/lib/results";
import { absoluteUrl } from "@/lib/site-config";
import { RESULTS_VISIBLE_LIMIT } from "@/components/PredictionResultsArchive";

const description = "Auditable football prediction results and historical picks, with published odds, final scores, settlement states and transparent performance methodology.";

export const metadata = buildLegalMetadata(
  "Football Prediction Results & History",
  "/results/",
  description
);

export default async function ResultsPage() {
  const resolved = await hydratePredictions(matches.map(toMatchPreview));
  const performance = buildHistoricalPerformance(resolved);
  const listed = performance.entries.slice(0, RESULTS_VISIBLE_LIMIT);
  const collection = institutionalPageJsonLd("CollectionPage", "Football Prediction Results & Historical Picks", "/results/", description);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest historical football predictions",
    numberOfItems: listed.length,
    itemListElement: listed.map((match, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${match.homeTeam} vs ${match.awayTeam}`,
      url: absoluteUrl(`/match/${match.slug}/`),
    })),
  };
  return (
    <>
    <JsonLd data={collection} />
    <JsonLd data={itemList} />
    <section className="section results-page">
      <div className="container results-container">
        <header className="results-header">
          <span className="eyebrow">Transparency</span>
          <h1>Football Prediction Results &amp; Historical Picks</h1>
          <p>This archive separates the prediction and odds published before kickoff from the result derived afterward. Wins, losses, pushes, voids, pending fixtures and unresolved records remain visible in the full summary.</p>
        </header>
        <PredictionResultsArchive matches={resolved} />
        <section className="results-settlement-note">
          <h2>How results are settled</h2>
          <p>A result is settled only from a stored result or a completed fixture with the factual data required by its market. Supported states are won, lost, push, Asian-handicap half won or half lost, and void when explicitly recorded. Completed fixtures missing corners or other required facts are unresolved and remain outside the win-rate denominator.</p>
          <p>A combined selection is one published prediction and one performance observation. Its legs are evaluated together; they are never counted as separate picks. Published odds remain the historical price, and later observations never replace them.</p>
          <p>Historical results are derived from the site's published prediction records and available final-score data. The complete archive was introduced after the earliest analyses were published, so it should not be read as a claim that live history was always available.</p>
          <p>See <Link href="/methodology/">our methodology</Link> and <Link href="/editorial-policy/">editorial policy</Link>.</p>
        </section>
      </div>
    </section>
    </>
  );
}
