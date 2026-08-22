import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";
import Link from "next/link";
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
          content: <p>The site publishes pre-match football analysis and predictions to give readers useful context about fixtures, markets and the considerations behind each editorial selection.</p>,
        },
        {
          title: "Who produces the analyses",
          content: <p><Link className="legal-link" href={editorialAuthor.path}>{editorialAuthor.name}</Link> is responsible for the analyses published on Predictions Sports Prime. Each prediction represents an editorial assessment rather than a guaranteed outcome.</p>,
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
