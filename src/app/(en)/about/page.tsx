import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";
import Link from "@/components/DocumentLink";
import { editorialAuthor } from "@/lib/editorial-identity";
import { JsonLd } from "@/components/JsonLd";
import { institutionalPageJsonLd } from "@/lib/seo";

const description = "Who produces Predictions Sports Prime, what the publication covers, how its football analysis is prepared and why it exists.";

export const metadata = buildLegalMetadata(
  "About Our Football Analysis",
  "/about/",
  description
);

export default function AboutPage() {
  return (
    <>
    <JsonLd data={institutionalPageJsonLd("AboutPage", "About Predictions Sports Prime", "/about/", description)} />
    <LegalPage
      titleKey="about"
      intro="Predictions Sports Prime is an independent publication for pre-match football analysis and predictions."
      sections={[
        {
          title: "What we publish",
          content: <p>The site publishes pre-match football analysis and predictions to give readers useful context about fixtures, markets and the considerations behind each selection. Analyses are produced from research, statistics and identified sources, structured into a consistent page format, and checked against editorial standards before publication. They are updated when something material changes, such as confirmed team news. See <Link className="legal-link" href="/methodology/">how each analysis is produced</Link>.</p>,
        },
        {
          title: "Who produces the analyses",
          content: <p><Link className="legal-link" href={editorialAuthor.path}>{editorialAuthor.name}</Link> is responsible for the analyses published on Predictions Sports Prime. Each prediction represents an editorial assessment rather than a guaranteed outcome.</p>,
        },
        {
          title: "Coverage",
          content: <p>Coverage focuses on club and national-team football: the Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Liga Portugal, Eredivisie, Brasileirão Série A, the EFL Championship, Süper Lig, Scottish Premiership, Eliteserien and Major League Soccer, plus cup and continental competitions, the UEFA Nations League and international friendlies. Each fixture page is meant to be read as a stand-alone match preview, and each competition page groups the fixtures published for that league.</p>,
        },
        {
          title: "What a match page contains",
          content: <p>A page opens with the prediction and the published odds, then sets out the fixture details, team news and call-ups, projected lineups (always labelled as projected unless officially confirmed), injuries and suspensions, head-to-head history when it is relevant, a tactical and statistical assessment and a note on the risks that could undermine the selection. Where a data point could not be found in a reliable source, the page says so instead of filling the gap.</p>,
        },
        {
          title: "Predictions, results and corrections",
          content: <p>Finished matches stay in the <Link className="legal-link" href="/results/">results archive</Link> with the original selection and odds unchanged, including losses. Factual errors can be reported through the <Link className="legal-link" href="/contact/">contact page</Link>. The site may display advertising; advertising does not influence what is predicted. See the <Link className="legal-link" href="/privacy/">privacy policy</Link> for details.</p>,
        },
        {
          title: "Editorial purpose and limitations",
          content: <><p>Each article is an individual editorial assessment. See <Link className="legal-link" href="/methodology/">our methodology</Link>, <Link className="legal-link" href="/editorial-policy/">editorial policy</Link> and complete <Link className="legal-link" href="/results/">prediction results</Link>.</p><p>The purpose is to provide context before a match. The site is not a bookmaker, results are not guaranteed, and published odds may change. Use the <Link className="legal-link" href="/contact/">contact page</Link> for editorial enquiries.</p></>,
        },
      ]}
    />
    </>
  );
}
