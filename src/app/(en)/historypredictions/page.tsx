import { HistoryPredictionsView } from "@/components/HistoryPredictionsView";
import { buildLegalMetadata } from "@/lib/legal-pages";

const description =
  "Archive of past football predictions with the published pick, market and odds. Full access is reserved for VIP members.";

// VIP archive: not indexed. The public teaser carries no past-prediction data.
export const metadata = {
  ...buildLegalMetadata("Prediction History", "/historypredictions/", description),
  robots: { index: false, follow: true },
};

export default function HistoryPredictionsPage() {
  return (
    <section className="section">
      <div className="container">
        <HistoryPredictionsView />
      </div>
    </section>
  );
}
