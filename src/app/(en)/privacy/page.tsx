import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  "Privacy Policy",
  "/privacy/",
  "Privacy policy for Predictions Sports Prime."
);

export default function PrivacyPage() {
  return (
    <LegalPage
      titleKey="privacy"
      intro="This policy explains how information may be handled when you use Predictions Sports Prime."
      sections={[
        { title: "Information and technical logs", content: <p>The site does not operate an account database. Hosting and security providers may process standard technical logs such as IP address, browser information, requested pages and timestamps to deliver and protect the service.</p> },
        { title: "Local storage", content: <p>The language selector stores your chosen locale in browser localStorage. This preference remains on your device and can be cleared through browser settings.</p> },
        { title: "Cookies and third parties", content: <p>Cloudflare or other infrastructure providers may use necessary technologies for security and delivery. When advertising is enabled, Google AdSense may use cookies or similar technologies subject to applicable consent requirements and Google policies.</p> },
        { title: "Advertising and consent", content: <p>Advertising is not loaded unless it is enabled and correctly configured. In regions where consent is required, an appropriate Google-certified consent management platform must be configured before relevant advertising storage or personalized advertising is used.</p> },
        { title: "Your choices and rights", content: <p>You can clear local storage and cookies in your browser, manage consent through the configured consent platform when available, and contact the site regarding applicable privacy rights. Rights vary by location.</p> },
        { title: "Contact", content: <p>Privacy contact details are provided on the Contact page when available.</p> },
      ]}
    />
  );
}
