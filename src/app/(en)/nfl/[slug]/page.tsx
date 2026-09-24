import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads";
import { AdsterraNativeBanner } from "@/components/ads/AdsterraNativeBanner";
import { ArticleByline } from "@/components/ArticleByline";
import { JsonLd } from "@/components/JsonLd";
import { nflWeek3BySlug, nflWeek3Games } from "@/data/predictions/nfl/week-03";
import { absoluteUrl } from "@/lib/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return nflWeek3Games.map((game) => ({ slug: game.slug! }));
}
function urlFor(slug: string) {
  return absoluteUrl(`/nfl/${slug}/`);
}

function isoKickoff(date: string, kickoff: string) {
  const time = kickoff.replace(/(\d+):(\d+) (AM|PM)/, (_, h, m, ap) =>
    `${String((Number(h) % 12) + (ap === "PM" ? 12 : 0)).padStart(2, "0")}:${m}:00`
  );
  return `${date}T${time}-04:00`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = nflWeek3BySlug[slug];
  if (!game?.matchSeo) return { robots: { index: false, follow: false } };
  const url = urlFor(slug);
  return {
    title: { absolute: game.matchSeo.title },
    description: game.matchSeo.description,
    alternates: { canonical: url, languages: { "en-US": url, "x-default": url } },
    robots: { index: game.matchSeo.indexable, follow: true },
    openGraph: {
      type: "article",
      title: game.matchSeo.title,
      description: game.matchSeo.description,
      url,
      siteName: "Predictions Sports Prime",
      publishedTime: game.publishedAt,
      modifiedTime: game.updatedAt,
      images: [absoluteUrl("/nfl/nfl-logo.png")],
    },
    twitter: { card: "summary", title: game.matchSeo.title, description: game.matchSeo.description, images: [absoluteUrl("/nfl/nfl-logo.png")] },
  };
}

function MarkdownText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part
  );
}

export default async function NFLPredictionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = nflWeek3BySlug[slug];
  if (!game?.slug || !game.matchSeo) notFound();
  const url = urlFor(game.slug);
  const pick = game.predictions[0];
  const country = game.city === "Rio de Janeiro" ? "BR" : "US";
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: `${game.homeTeam} vs ${game.awayTeam} Prediction, Odds and Betting Tips`,
    description: game.matchSeo.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: game.publishedAt,
    dateModified: game.updatedAt,
    author: { "@id": absoluteUrl("/author/iwysson-nascimento/#person") },
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-US",
    articleSection: "NFL",
  };
  const event = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${url}#event`,
    name: `${game.awayTeam} at ${game.homeTeam}`,
    sport: "American Football",
    startDate: isoKickoff(game.date, game.kickoff),
    eventStatus: "https://schema.org/EventScheduled",
    homeTeam: { "@type": "SportsTeam", name: game.homeTeam },
    awayTeam: { "@type": "SportsTeam", name: game.awayTeam },
    location: { "@type": "Place", name: game.stadium, address: { "@type": "PostalAddress", addressLocality: game.city, ...(game.state ? { addressRegion: game.state } : {}), addressCountry: country } },
    url,
    description: game.matchSeo.description,
  };

  return <>
    <JsonLd data={article} />
    <JsonLd data={event} />
    <section className="nfl-article-hero"><div className="container nfl-article-container">
      <nav className="compact-match-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><Link href="/nfl/">NFL</Link><span aria-hidden="true">›</span><span aria-current="page">{game.homeTeam} vs {game.awayTeam}</span></nav>
      <p className="eyebrow">NFL 2026 · Week 3</p>
      <h1>{game.homeTeam} vs {game.awayTeam} Prediction, Odds and Betting Tips</h1>
      <p className="editorial-dates"><span>Published September 24, 2026</span><span>Updated September 24, 2026</span><ArticleByline /></p>
    </div></section>

    <section className="section"><div className="container nfl-article-layout">
      <article className="nfl-article-card">
        <section className="nfl-article-pick" aria-label="Main prediction"><h2>Main prediction</h2><p><strong>{pick.selection}</strong></p><dl><div><dt>Published odds</dt><dd>{pick.odds.toFixed(2)}</dd></div><div><dt>Odds source</dt><dd>Author supplied · bookmaker not provided</dd></div></dl></section>

        <section><h2>Match information</h2><dl className="nfl-article-facts"><div><dt>Competition</dt><dd>NFL 2026 · Week 3</dd></div><div><dt>Date</dt><dd>{game.date}</dd></div><div><dt>Kickoff</dt><dd>{game.kickoff} {game.timezone}</dd></div><div><dt>Venue</dt><dd>{game.stadium}, {game.city}{game.state ? `, ${game.state}` : ""}</dd></div><div><dt>Records</dt><dd>{game.awayTeamShort} {game.records?.away}; {game.homeTeamShort} {game.records?.home}</dd></div></dl></section>

        <section><h2>Team news and projected personnel</h2><p className="nfl-data-note">Projected personnel, not confirmed lineups. Sunday and Monday final game designations were not available at the verified update time.</p><div className="nfl-personnel-grid">{(["away", "home"] as const).map((side) => { const unit = game.projectedLineups?.[side]; const name = side === "away" ? game.awayTeam : game.homeTeam; return <div key={side}><h3>{name}</h3>{unit?.offense?.length ? <><h4>Projected offense</h4><ul>{unit.offense.map((item) => <li key={`${item.position}-${item.player}`}><strong>{item.position}:</strong> {item.player}</li>)}</ul></> : null}{unit?.defense?.length ? <><h4>Projected defense</h4><ul>{unit.defense.map((item) => <li key={`${item.position}-${item.player}`}><strong>{item.position}:</strong> {item.player}</li>)}</ul></> : null}</div>; })}</div></section>

        <section><h2>Injuries and availability</h2><div className="nfl-injury-table" role="table" aria-label="Injury report"><div className="nfl-injury-row nfl-injury-row--head" role="row"><span>Team / player</span><span>Issue</span><span>Practice</span><span>Game status</span></div>{game.injuries?.map((item, index) => <div className="nfl-injury-row" role="row" key={`${item.team}-${item.player}-${index}`}><span><strong>{item.player}</strong><small>{item.team} · {item.position}</small></span><span>{item.injury}</span><span>{item.practiceStatus ?? "—"}</span><span>{item.status}{item.note ? <small>{item.note}</small> : null}</span></div>)}</div></section>

        <section><h2>Match analysis</h2>{game.analysis.map((paragraph, index) => <p key={index}><MarkdownText text={paragraph} /></p>)}</section>

        <section><h2>Sources</h2><ul className="nfl-source-list">{game.sources?.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.name}</a><span>{source.scope} · accessed September 24, 2026</span></li>)}</ul></section>

        <section className="nfl-article-conclusion"><h2>Final prediction</h2><p><strong>Prediction: {pick.selection}</strong></p><p><strong>Published odds: {pick.odds.toFixed(2)}</strong></p></section>
      </article>
      <aside className="nfl-article-sidebar"><AdSlot placement="match-content" showLabel /><p className="compact-responsible-note">Bet responsibly. Odds are the immutable author-supplied publication price and may no longer be available.</p></aside>
    </div></section>
    <div className="container adsterra-native-banner-area"><AdsterraNativeBanner /></div>
  </>;
}
