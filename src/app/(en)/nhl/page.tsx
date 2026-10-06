import type { Metadata } from "next";
import Link from "@/components/DocumentLink";
import { JsonLd } from "@/components/JsonLd";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { ResponsibleGamblingNotice } from "@/components/ResponsibleGamblingNotice";
import { TeamBadge } from "@/components/TeamBadge";
import { translate } from "@/i18n/dictionaries";
import { nhlMatches, NHL_PAGE, type NhlMatch } from "@/lib/nhl";
import { absoluteUrl } from "@/lib/site-config";

// One NHL page for the 06/10/2026 slate. Each game has its own anchor and H2, not its own URL.
// FREE games (analysis access "free") render their full analysis. VIP games render only the
// teaser and the gate; their content comes from /api/match-content/[slug] after VIP is confirmed.
const L = {
  prediction: translate("en", "mainPrediction"),
  odds: translate("en", "odds"),
  analysis: translate("en", "matchAnalysisHeading"),
  sources: translate("en", "matchSourcesHeading"),
};

export const metadata: Metadata = {
  title: { absolute: NHL_PAGE.title },
  description: NHL_PAGE.description,
  alternates: { canonical: absoluteUrl(NHL_PAGE.path) },
  robots: { index: true, follow: true },
  openGraph: { title: NHL_PAGE.title, description: NHL_PAGE.description, url: absoluteUrl(NHL_PAGE.path), type: "website" },
  twitter: { card: "summary", title: NHL_PAGE.title, description: NHL_PAGE.description },
};

const DATE_LABEL = "Tuesday, October 6, 2026";

function FreeGame({ m }: { m: NhlMatch }) {
  return (
    <>
      <div className="psp-pick">
        <div>
          <div className="psp-pick__label">{L.prediction}</div>
          <div className="psp-pick__value">{m.pick}</div>
        </div>
        <div className="psp-pick__odds">
          <span className="psp-pick__label">{L.odds}</span>
          <strong>{m.odds.toFixed(2)}</strong>
        </div>
      </div>
      <MatchFullContent analysis={m.analysis} sources={m.sources} comment={null} labels={L} />
    </>
  );
}

function GameCard({ m }: { m: NhlMatch }) {
  const isFree = m.access === "free";

  return (
    <section className={`psp-game ${isFree ? "psp-game--free" : "psp-game--vip"}`} id={m.anchor}>
      <div className="psp-game__head">
        <span className={`psp-badge ${isFree ? "psp-badge--free" : "psp-badge--vip"}`}>
          {isFree ? "FREE ANALYSIS" : "PRIME VIP"}
        </span>
        <p className="psp-game__meta">NHL · {DATE_LABEL} · Kick-off time not listed</p>
      </div>

      <div className="psp-game__teams">
        <TeamBadge team={m.homeTeam} />
        <h2>{`${m.homeTeam} vs ${m.awayTeam} Prediction`}</h2>
        <TeamBadge team={m.awayTeam} />
      </div>

      {isFree ? (
        <FreeGame m={m} />
      ) : (
        <>
          <p className="psp-game__teaser">{m.teaser}</p>
          <MatchGate slug={m.slug} showAnalysis showPrediction />
        </>
      )}
    </section>
  );
}

export default function NhlPage() {
  const matches = nhlMatches();
  const free = matches.filter((m) => m.access === "free");
  const vip = matches.filter((m) => m.access !== "free");
  const orderedMatches = [...free, ...vip];

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
      isPartOf: { "@type": "WebSite", name: "Predictions Sports Prime", url: absoluteUrl("/") },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: matches.length,
        itemListElement: orderedMatches.map((m, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${m.homeTeam} vs ${m.awayTeam} Prediction`,
          url: absoluteUrl(`${NHL_PAGE.path}#${m.anchor}`),
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "NHL", item: absoluteUrl(NHL_PAGE.path) },
      ],
    },
  ];

  return (
    <article className="section">
      <JsonLd data={jsonLd} />
      <div className="container">
        <nav className="psp-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>NHL</span>
        </nav>

        <header className="psp-hero">
          <span className="psp-hero__eyebrow">NHL · {DATE_LABEL}</span>
          <h1>{NHL_PAGE.h1}</h1>
          <p>
            Nine NHL games on {DATE_LABEL}. Three analyses are published in full for everyone. The remaining six are
            exclusive to PRIME VIP members.
          </p>
          <div className="psp-chips">
            <span className="psp-chip">9 games</span>
            <span className="psp-chip">
              <span className="psp-badge psp-badge--free">FREE</span> {free.length} analyses
            </span>
            <span className="psp-chip">
              <span className="psp-badge psp-badge--vip">PRIME VIP</span> {vip.length} analyses
            </span>
          </div>
        </header>

        <section className="psp-game-group" aria-labelledby="nhl-free-analyses">
          <div className="psp-game-group__heading">
            <span className="psp-badge psp-badge--free">FREE</span>
            <h2 id="nhl-free-analyses">Free analyses</h2>
          </div>
          <div className="psp-games">
            {free.map((m) => <GameCard key={m.slug} m={m} />)}
          </div>
        </section>

        <section className="psp-game-group" aria-labelledby="nhl-vip-analyses">
          <div className="psp-game-group__heading">
            <span className="psp-badge psp-badge--vip">PRIME VIP</span>
            <h2 id="nhl-vip-analyses">PRIME VIP analyses</h2>
          </div>
          <div className="psp-games">
            {vip.map((m) => <GameCard key={m.slug} m={m} />)}
          </div>
        </section>

        <section className="psp-matchup-directory" aria-labelledby="nhl-matchups-title">
          <div className="psp-game-group__heading">
            <h2 id="nhl-matchups-title">NHL Matchups – October 6, 2026</h2>
          </div>
          <nav className="psp-jump" aria-label="NHL games on this page">
            {orderedMatches.map((m) => (
              <a key={m.anchor} href={`#${m.anchor}`}>
                {m.homeTeam} vs {m.awayTeam}
              </a>
            ))}
          </nav>
        </section>

        <div className="psp-notice">
          <ResponsibleGamblingNotice />
        </div>
      </div>
    </article>
  );
}
