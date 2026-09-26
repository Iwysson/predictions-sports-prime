import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  "International Audience & Regulatory Notice",
  "/international-audience-regulatory-notice/",
  "Predictions Sports Prime is an independent sports analysis and predictions website for an international audience. It does not operate a betting platform."
);

export default function InternationalAudienceNoticePage() {
  return (
    <LegalPage
      titleKey="terms"
      heading="International Audience & Regulatory Notice"
      intro="Last updated: 26 September 2026. This page describes what Predictions Sports Prime is, who it is written for and what it does not do."
      sections={[
        {
          title: "What Predictions Sports Prime is",
          content: <p>Predictions Sports Prime is an independent sports analysis and predictions website. It publishes match previews, statistics, projected lineups, availability notes and editorial predictions with reference odds recorded at the time of publication.</p>,
        },
        {
          title: "Intended audience",
          content: <p>The website is intended for an international audience. Its editorial content is not specifically directed at the Brazilian market or at any single national market.</p>,
        },
        {
          title: "What the website does not do",
          content: (
            <ul>
              <li>It does not operate a betting platform.</li>
              <li>It does not accept wagers or receive deposits.</li>
              <li>It does not process betting transactions or maintain betting accounts.</li>
              <li>It does not place bets on behalf of any reader.</li>
            </ul>
          ),
        },
        {
          title: "Third-party services and local law",
          content: <p>The availability and legality of third-party betting or wagering services differ from one jurisdiction to another. Readers are responsible for informing themselves about, and complying with, the laws and regulations that apply where they live. Nothing on this website is an invitation to use any service that is not lawful in the reader’s jurisdiction.</p>,
        },
        {
          title: "Editorial content",
          content: <p>Predictions and odds are editorial opinions and market observations, not guarantees. See our <a className="legal-link" href="/methodology/">methodology</a>, <a className="legal-link" href="/editorial-policy/">editorial policy</a> and <a className="legal-link" href="/responsible-gambling/">responsible gambling</a> pages for more detail.</p>,
        },
      ]}
    />
  );
}
