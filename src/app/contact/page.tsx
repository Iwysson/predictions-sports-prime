import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  "Contact",
  "/contact/",
  "Contact information for Predictions Sports Prime."
);

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

export default function ContactPage() {
  return (
    <LegalPage
      titleKey="contact"
      intro="Use the contact details below for editorial, privacy or general enquiries."
      sections={[
        {
          title: "Contact details",
          content: contactEmail ? (
            <p><a className="legal-link" href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
          ) : (
            <p>Contact details will be available soon.</p>
          ),
        },
        {
          title: "Response and scope",
          content: <p>Please do not send betting funds or requests to place bets. Predictions Sports Prime does not accept wagers or process gambling transactions.</p>,
        },
      ]}
    />
  );
}
