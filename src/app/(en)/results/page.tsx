import Link from "@/components/DocumentLink";
import { SiteContactLine } from "@/components/SiteContactLine";
import { PredictionResultsArchive } from "@/components/PredictionResultsArchive";
import footballResults from "@/data/football-results.snapshot.json";
import pendingResults from "@/data/football-results-pending.snapshot.json";
import type { PendingResultsDataset } from "@/lib/pending-results";
import { resultsScope, resultsScopeLabel, sortedResults, type FootballResultsDataset } from "@/lib/football-results";
import { buildLegalMetadata } from "@/lib/legal-pages";
import { JsonLd } from "@/components/JsonLd";
import { institutionalPageJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";
import { RESULTS_HISTORY_VISIBLE_LIMIT } from "@/lib/results-history-audit";
import { VipTitleCta } from "@/components/VipTitleCta";

const description = "Auditable football prediction results and historical picks, with published odds, final scores, settlement states and transparent performance methodology.";

export const metadata = buildLegalMetadata(
  "Football Prediction Results & History",
  "/results/",
  description
);

export default async function ResultsPage() {
  const dataset = footballResults as FootballResultsDataset;
  const scope = resultsScope(sortedResults(dataset));
  const scopePeriod = resultsScopeLabel(scope);
  const listed = sortedResults(dataset).slice(0, RESULTS_HISTORY_VISIBLE_LIMIT);
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
      url: absoluteUrl(`/results/#${match.slug}`),
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
          <VipTitleCta>Football Prediction Results &amp; Historical Picks</VipTitleCta>
          <p>This archive separates the prediction and odds published before kickoff from the result derived afterward. Green, red, push, void and pending records all remain visible, and only settled records count towards the statistics.</p>
          <SiteContactLine />
        </header>
        <section className="results-settlement-note">
          <h2>What this archive covers</h2>
          <p>The archive currently registers {scope.count} settled football predictions{scopePeriod ? ` with match dates from ${scopePeriod}` : ""}. It is not a lifetime record. Once a match is officially final and settled, its original pick and published odds appear here with the final score, normally within hours of the final whistle. Before and during the match, premium picks stay protected. Premium analysis stays in <Link href="/historypredictions/">Prediction History</Link> for VIP members.</p>
        </section>
        <PredictionResultsArchive dataset={dataset} pending={(pendingResults as PendingResultsDataset).records} />
        <section className="results-settlement-note">
          <h2>How results are settled</h2>
          <p>A result is settled only from a stored result or a completed fixture with the factual data required by its market. Supported states are green, red, push, Asian-handicap half green or half red, and void when a match is officially cancelled. A record stays PENDING, with its reason shown, whenever a required fact is missing, such as corners, a 90-minute score or an unambiguous handicap type, and it remains outside the win-rate denominator.</p>
          <p>A combined selection is one published prediction and one performance observation. Its legs are evaluated together; they are never counted as separate picks. Published odds remain the historical price, and later observations never replace them.</p>
          <p>Historical results are derived from the site's published prediction records and available final-score data. The complete archive was introduced after the earliest analyses were published, so it should not be read as a claim that live history was always available.</p>
          <p>See <Link href="/methodology/">our methodology</Link> and <Link href="/editorial-policy/">editorial policy</Link>.</p>
        </section>
      </div>
    </section>
    </>
  );
}
