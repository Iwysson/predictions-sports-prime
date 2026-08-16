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
      intro="Football predictions never guarantee a result. Treat betting as a risk-bearing activity, not a source of income."
      sections={[
        { title: "Keep control", content: <p>Never gamble with money required for housing, food, bills, healthcare or other essential expenses. Set affordable limits and do not chase losses.</p> },
        { title: "Adults and local law", content: <p>Access gambling only if you meet the legal age and it is permitted where you live. You are responsible for understanding and respecting local restrictions.</p> },
        { title: "About this site", content: <p>Predictions Sports Prime is not a bookmaker. It does not accept bets, hold gambling funds or process betting transactions. Its content is informational and editorial.</p> },
        { title: "Uncertain outcomes", content: <p>Odds can change, statistics can be incomplete and sporting events are inherently unpredictable. Stop if gambling is causing financial, emotional or personal harm and seek qualified local support.</p> },
      ]}
    />
  );
}
