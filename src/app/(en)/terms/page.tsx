import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  "Terms",
  "/terms/",
  "Terms of use for Predictions Sports Prime."
);

export default function TermsPage() {
  return (
    <LegalPage
      titleKey="terms"
      intro="By using this site, you acknowledge the informational nature and limitations of its content."
      sections={[
        { title: "Editorial opinions", content: <p>Predictions and match analyses are editorial opinions. Results are uncertain and no prediction, statistic or stated odds guarantees an outcome or profit.</p> },
        { title: "Odds and risk", content: <p>Odds can change and may differ between markets or providers. Gambling involves financial risk. You remain solely responsible for your decisions and for complying with local law.</p> },
        { title: "Not betting or financial advice", content: <p>Predictions Sports Prime is not a bookmaker, tipster service or licensed financial adviser. Content is provided for information and entertainment and does not take your circumstances into account. You must be of legal age to bet where you live, and the availability of betting differs by country.</p> },
        { title: "Third-party content and links", content: <p>Fixture data, statistics, squad news and sources come from third parties and may be incomplete or change after publication. Where a page links to an external source, we are not responsible for that site's content. The site may display advertising from third parties; its presence is not an endorsement of any advertiser or betting operator.</p> },
        { title: "Service availability", content: <p>The site may change, suspend or remove content and features without guaranteeing uninterrupted availability or error-free data from third-party sources.</p> },
        { title: "Intellectual property", content: <p>Original editorial text, branding and site presentation may not be republished as your own without permission. Third-party names and marks remain the property of their respective owners.</p> },
        { title: "Changes", content: <p>These terms may be updated as the site evolves. The current version published on this page applies to use of the site.</p> },
      ]}
    />
  );
}
