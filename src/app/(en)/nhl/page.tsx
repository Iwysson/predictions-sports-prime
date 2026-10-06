import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { translate } from "@/i18n/dictionaries";
import { nhlMatches, NHL_PAGE } from "@/lib/nhl";
import { absoluteUrl } from "@/lib/site-config";

// One NHL page for the 06/10/2026 slate. Each game has its own anchor, not its own URL.
// FREE games render in full. VIP games render only the teaser and the gate; their analysis and
// prediction come from /api/match-content/[slug] after the VIP session is confirmed.
const labels = { prediction: translate("en", "mainPrediction"), odds: translate("en", "odds") };

export const metadata: Metadata = {
  title: NHL_PAGE.title,
  description: NHL_PAGE.description,
  alternates: { canonical: absoluteUrl(NHL_PAGE.path) },
  robots: { index: true, follow: true },
  openGraph: { title: NHL_PAGE.title, description: NHL_PAGE.description, url: absoluteUrl(NHL_PAGE.path), type: "website" },
  twitter: { card: "summary", title: NHL_PAGE.title, description: NHL_PAGE.description },
};

export default function NhlPage() {
  const matches = nhlMatches();
  const free = matches.filter((m) => m.access === "free").length;
  const vip = matches.length - free;

  // Public structured data only: names, date and anchor URLs. No pick, odds or analysis.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(NHL_PAGE.path)}#collection`,
      url: absoluteUrl(NHL_PAGE.path),
      name: NHL_PAGE.h1,
      description: NHL_PAGE.description,
      inLanguage: "en",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: matches.length,
        itemListElement: matches.map((m, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${m.homeTeam} vs ${m.awayTeam} Prediction`,
          url: absoluteUrl(`${NHL_PAGE.path}#${m.anchor}`),
        })),
      },
    },
  ];

  return (
    <article className="nhl-page section">
      <JsonLd data={jsonLd} />
      <div className="container">
        <header>
          <span className="eyebrow">NHL</span>
          <h1>{NHL_PAGE.h1}</h1>
          <p>
            Nine NHL games on October 6, 2026. {free} free analyses are published in full; {vip} analyses are
            exclusive to PRIME VIP members.
          </p>
        </header>

        {matches.map((m) => (
          <section className="nhl-game" id={m.anchor} key={m.slug}>
            <h2>{`${m.homeTeam} vs ${m.awayTeam} Prediction`}</h2>
            <p>
              NHL · {m.date} · {m.access === "free" ? translate("en", "matchFreeAnalysis") : translate("en", "matchVipAnalysis")}
            </p>
            {m.access === "free" ? (
              <>
                <p>
                  <strong>{labels.prediction}:</strong> {m.pick} · <strong>{labels.odds}:</strong> {m.odds.toFixed(2)}
                </p>
                <MatchFullContent analysis={m.analysis} sources={m.sources} comment={null} labels={labels} />
              </>
            ) : (
              <>
                <p>{m.teaser}</p>
                <MatchGate slug={m.slug} showAnalysis showPrediction />
              </>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
