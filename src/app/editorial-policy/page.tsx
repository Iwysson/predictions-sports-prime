import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";
import { JsonLd } from "@/components/JsonLd";
import { institutionalPageJsonLd } from "@/lib/seo";

const description = "Editorial standards, source verification, corrections, odds and update practices at Predictions Sports Prime.";

export const metadata = buildLegalMetadata("Editorial policy", "/editorial-policy/", description);

export default function EditorialPolicyPage() {
  return <><JsonLd data={institutionalPageJsonLd("WebPage", "Predictions Sports Prime editorial policy", "/editorial-policy/", description)} /><LegalPage titleKey="about" heading="Editorial policy" intro="The standards used to publish, correct and preserve football analysis on Predictions Sports Prime." sections={[
    { title: "Principles and factual accuracy", content: <p>Analyses should be original, clear about uncertainty and distinguish fact, statistical observation and editorial judgement. Names, competition context, fixtures, team news and statistics are checked against relevant sources before they support a published claim.</p> },
    { title: "Source verification", content: <><p>We prefer the most direct reliable source available, including official competition or club material for primary facts and established statistical providers for performance data. A source must be identifiable, relevant to the specific claim and linked through HTTPS; placeholder domains and decorative links are rejected.</p><p>The legacy source migration records 16 verified and 36 partial analyses. Partial means the available source supports only part of the historical rationale; it is not silently promoted to verified. New published analyses require verified coverage under <Link className="legal-link" href="/methodology/">our methodology</Link>.</p></> },
    { title: "Corrections and significant updates", content: <p>Factual errors should be corrected promptly. A material change to the reasoning or selection is a significant editorial update and must receive an explicit updatedAt timestamp. Minor presentation fixes do not justify changing editorial dates. publishedAt records the original publication action; dates are never moved backwards or manipulated to make old content appear new.</p> },
    { title: "Preserving the record", content: <p>Published pre-match analysis is kept separate from the later result. Settlement data and final scores may be added through the results process, but they must not rewrite the original prediction, odds or reasoning. Corrections should preserve an honest historical record rather than conceal the earlier publication.</p> },
    { title: "Odds and responsible language", content: <p>Odds are time-sensitive market observations, not guarantees. We do not promise outcomes, profit or risk-free betting, and we avoid language that presents historical performance as certainty. Readers should consider their own circumstances and use the <Link className="legal-link" href="/responsible-gambling/">responsible gambling resources</Link>.</p> },
    { title: "Contact", content: <p>Questions about accuracy or correction requests can be sent through the <Link className="legal-link" href="/contact/">contact page</Link>.</p> },
    { title: "Independence and conflicts", content: <p>Selections are editorial judgements. Advertising infrastructure does not authorize rewriting a pick, hiding a loss or presenting an odds snapshot as currently available. Any material commercial relationship that could affect a page should be disclosed where relevant.</p> },
  ]} /></>;
}
