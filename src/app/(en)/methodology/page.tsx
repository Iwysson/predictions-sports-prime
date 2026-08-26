import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";
import { JsonLd } from "@/components/JsonLd";
import { institutionalPageJsonLd } from "@/lib/seo";

const description = "How Predictions Sports Prime researches, assesses and publishes football match analysis and predictions.";

export const metadata = buildLegalMetadata(
  "Methodology",
  "/methodology/",
  description
);

export default function MethodologyPage() {
  return <><JsonLd data={institutionalPageJsonLd("WebPage", "Predictions Sports Prime methodology", "/methodology/", description)} /><LegalPage titleKey="about" heading="Our methodology" intro="How an individual pre-match assessment becomes a published analysis on Predictions Sports Prime." sections={[
    { title: "Individual editorial assessment", content: <p>Each analysis and final selection is prepared manually as an editorial judgement. Depending on the fixture and the evidence available, the review may consider recent and season-long form, home and away performance, goals scored and conceded, over/under and both-teams-to-score patterns, relevant head-to-head history, competition context, and verified information about squads, transfers, injuries or coaching changes.</p> },
    { title: "Statistics, context and weighting", content: <><p>Reliable xG and xGA data may be considered when available, alongside goals, shots, corners, home and away performance, market odds, implied probability and comparisons between markets. No statistic automatically determines a pick. Sample size, quality of opposition, tactical matchup, schedule and verified injuries or suspensions are weighed according to their relevance to the fixture.</p><p>Head-to-head records and historical probabilities describe past observations; they are not forecasts with certainty. Small samples and uneven opponents can make an apparently strong percentage misleading.</p></> },
    { title: "Editorial work and site automation", content: <p>The reasoning, written analysis and selection are manual editorial work. Rule-based site processes separately organize fixture data, scores, standings and the settlement of completed results. Those operational processes do not write an analysis or decide a selection.</p> },
    { title: "Odds and implied probability", content: <p>When odds appear, they are recorded during preparation or publication and may vary by bookmaker, region and time. Their later availability is not guaranteed. Decimal odds may be converted into implied probability for comparison, but the market margin and changing prices mean this is not a promise of the true chance of an outcome.</p> },
    { title: "Sources and archive coverage", content: <><p>Factual claims should be checked against relevant, identifiable sources, with direct HTTPS links preferred over generic homepages. Source relevance is reviewed editorially; the presence of a URL alone is not treated as proof.</p><p>The 52 legacy analyses have completed source migration: 16 have verified status and 36 retain an explicit partial status because the available source coverage does not independently establish every part of the recorded pick. We do not invent or backfill sources, bookmaker names or capture times. New publications require verified source coverage, and new quoted odds require provenance and capture time.</p></> },
    { title: "Limits and responsibility", content: <p>Football is uncertain, data can be incomplete, team news can change and every selection can lose. The publication provides analysis, not a guaranteed outcome or profit. Review the complete <Link className="legal-link" href="/results/">prediction results</Link>, our <Link className="legal-link" href="/editorial-policy/">editorial policy</Link> and <Link className="legal-link" href="/responsible-gambling/">responsible gambling guidance</Link>.</p> },
  ]} /></>;
}
