import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  "About",
  "/about/",
  "About Predictions Sports Prime and its independent, manually written football analysis."
);

export default function AboutPage() {
  return (
    <LegalPage
      titleKey="about"
      intro="Predictions Sports Prime is an independent football analysis and predictions platform."
      sections={[
        {
          title: "Independent editorial analysis",
          content: <p>Every published analysis and prediction is written and selected manually. The site does not use artificial intelligence to generate picks and is not a bookmaker.</p>,
        },
        {
          title: "Our approach",
          content: <p>Editorial work may consider match history, home and away performance, squad context, statistical data and the competitive situation surrounding each fixture.</p>,
        },
        {
          title: "Informational purpose",
          content: <p>Predictions are opinions provided for information and discussion. They do not guarantee any result, return or outcome.</p>,
        },
      ]}
    />
  );
}
