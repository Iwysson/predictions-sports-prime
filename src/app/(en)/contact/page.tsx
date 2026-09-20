import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";
import { publicContactEmail, siteResponsibleName } from "@/lib/editorial-identity";
import { JsonLd } from "@/components/JsonLd";
import { institutionalPageJsonLd } from "@/lib/seo";

const description = "Contact Predictions Sports Prime about factual corrections, editorial questions, feedback, privacy or general site information.";

export const metadata = buildLegalMetadata(
  "Contact",
  "/contact/",
  description
);

export default function ContactPage() {
  return (
    <>
    <JsonLd data={institutionalPageJsonLd("ContactPage", "Contact Predictions Sports Prime", "/contact/", description)} />
    <LegalPage
      titleKey="contact"
      intro="Use the contact details below for corrections, editorial questions, feedback, privacy or general site enquiries."
      sections={[
        {
          title: "Corrections and feedback",
          content: <p>Include the page URL and the fact or passage you believe needs review. Reports are evaluated against the available record and sources; corrections do not silently rewrite a pre-match selection after the result.</p>,
        },
        {
          title: "Contact details",
          content: <p>The person responsible for Predictions Sports Prime is {siteResponsibleName}. For general enquiries and privacy requests, email <a className="legal-link" href={`mailto:${publicContactEmail}`}>{publicContactEmail}</a>. See our <a className="legal-link" href="/privacy/">Privacy Policy</a> for details of data handling and your choices.</p>,
        },
        {
          title: "Response and scope",
          content: <p>Please do not send betting funds or requests to place bets. Predictions Sports Prime does not accept wagers or process gambling transactions.</p>,
        },
      ]}
    />
    </>
  );
}
