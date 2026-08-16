import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  "Cookie Policy",
  "/cookies/",
  "Cookie and local storage policy for Predictions Sports Prime."
);

export default function CookiesPage() {
  return (
    <LegalPage
      titleKey="cookies"
      intro="This page describes browser storage and cookies that may be associated with the site."
      sections={[
        { title: "Language preference", content: <p>The site uses localStorage, rather than an account, to remember the language you select.</p> },
        { title: "Necessary technologies", content: <p>Hosting and security services may use necessary cookies or similar technologies to provide, secure and optimize delivery of the site.</p> },
        { title: "Advertising cookies", content: <p>When Google AdSense is enabled, Google and its partners may use advertising cookies or related storage. These units remain disabled until production credentials and the required consent setup are configured.</p> },
        { title: "Managing preferences", content: <p>You can remove cookies and local storage through browser controls. Where required, advertising choices will be presented through the configured certified consent management platform.</p> },
      ]}
    />
  );
}
