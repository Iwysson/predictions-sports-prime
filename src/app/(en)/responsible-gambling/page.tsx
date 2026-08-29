import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  "Responsible Gambling",
  "/responsible-gambling/",
  "Responsible gambling information from Predictions Sports Prime."
);

export default function ResponsibleGamblingPage() {
  return (
    <LegalPage
      titleKey="responsibleGambling"
      heading="Responsible Gambling"
      intro="Betting should remain optional entertainment. Predictions Sports Prime provides independent editorial information and does not accept bets, hold gambling funds or guarantee outcomes."
      sections={[
        { title: "18+ only", content: <p>You must be 18 years old or over to use betting services. You must also follow the laws and age requirements that apply where you live.</p> },
        { title: "Keep betting affordable", content: <p>Decide an affordable limit before you start and never use money needed for housing, food, bills, healthcare, savings or other essential expenses. Do not borrow money to bet and do not chase losses.</p> },
        { title: "Keep perspective", content: <p>Betting outcomes are uncertain. Odds, analysis and statistics do not guarantee a result or profit. Take regular breaks and avoid betting when upset, under pressure or affected by alcohol or other substances.</p> },
        { title: "Recognise when to stop", content: <p>Stop and seek qualified professional support if betting stops being enjoyable, becomes difficult to control, affects relationships or work, or causes financial or emotional harm.</p> },
        { title: "Protect other people", content: <p>Do not encourage anyone under 18 to bet. Keep betting accounts and payment details secure, and do not allow another person to use an account in your name.</p> },
        { title: "About Predictions Sports Prime", content: <p>Predictions Sports Prime is an editorial information website. It is not a bookmaker and does not accept bets, hold gambling funds or process betting transactions.</p> },
        { title: "Finding support", content: <p>Use only official or professionally verified support organisations in your country. This page does not list unverified phone numbers or services. If you feel at immediate risk, contact the appropriate local emergency service.</p> },
      ]}
    />
  );
}
