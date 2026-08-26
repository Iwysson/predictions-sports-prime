import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";
import { matches } from "@/data/matches";
import {
  editorialAuthor,
  editorialAuthorProfileJsonLd,
} from "@/lib/editorial-identity";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  `${editorialAuthor.name} — Author`,
  editorialAuthor.path,
  `${editorialAuthor.name} is responsible for the published football match analyses on Predictions Sports Prime.`
);

const authoredMatches = [...matches].sort((left, right) =>
  (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "") ||
  left.title.localeCompare(right.title)
);

export default function AuthorPage() {
  return (
    <>
      <JsonLd data={editorialAuthorProfileJsonLd()} />
      <LegalPage
        titleKey="about"
        heading={editorialAuthor.name}
        intro={`${editorialAuthor.name} is responsible for the analyses published on Predictions Sports Prime.`}
        sections={[
          {
            title: "Published analysis",
            content: (
              <p>
                The content covers pre-match football analysis and predictions.
                Each prediction is an editorial assessment intended to give readers
                context about a fixture; sporting results are not guaranteed.
              </p>
            ),
          },
          {
            title: "Editorial process",
            content: (
              <p>
                Review <Link className="legal-link" href="/methodology/">our methodology</Link>, the <Link className="legal-link" href="/editorial-policy/">editorial policy</Link>, the complete <Link className="legal-link" href="/results/">prediction results</Link> and the <Link className="legal-link" href="/contact/">contact page</Link>.
              </p>
            ),
          },
          {
            title: "Authored analyses",
            content: (
              <ul className="author-analysis-list">
                {authoredMatches.map((match) => (
                  <li key={match.id}>
                    <Link href={`/match/${match.slug}/`}>{match.title}</Link>
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />
    </>
  );
}
