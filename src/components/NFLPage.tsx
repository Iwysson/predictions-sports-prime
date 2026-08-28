import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { NFLWeekAccordion } from "@/components/NFLWeekAccordion";
import { NFLStandings } from "@/components/NFLStandings";
import { nflWeek1Games } from "@/data/nfl/week-1";
import { getNFLCopy } from "@/lib/nfl-i18n";
import { buildNFLSearchIntent } from "@/lib/nfl-search-intent";
import { absoluteUrl } from "@/lib/site-config";
import { localePath, type SeoLocale } from "@/lib/seo-locales";
import { getNFLStandings, getNFLStandingsMetadata } from "@/lib/nfl-standings-provider";

function nflSportsEvents(locale: SeoLocale) {
  const copy = getNFLCopy(locale);
  return nflWeek1Games.filter((game) => game.kickoff !== "TBA" && game.stadium && game.city).map((game) => ({
    "@context": "https://schema.org", "@type": "SportsEvent", "@id": `${absoluteUrl(localePath(locale, "/nfl/"))}#${game.id}`,
    name: `${game.awayTeam} vs ${game.homeTeam}`, sport: "American Football",
    startDate: `${game.date}T${game.kickoff.replace(/(\d+):(\d+) (AM|PM)/, (_, h, m, ap) => `${String((Number(h) % 12) + (ap === "PM" ? 12 : 0)).padStart(2, "0")}:${m}:00`)}`,
    homeTeam: { "@type": "SportsTeam", name: game.homeTeam }, awayTeam: { "@type": "SportsTeam", name: game.awayTeam },
    location: { "@type": "Place", name: game.stadium, address: { "@type": "PostalAddress", addressLocality: game.city, ...(game.state ? { addressRegion: game.state } : {}), addressCountry: game.city === "Melbourne" ? "AU" : "US" } },
    eventStatus: "https://schema.org/EventScheduled",
    url: absoluteUrl(localePath(locale, "/nfl/")), inLanguage: locale === "en" ? "en" : locale,
    description: `${copy.weekHeading}: ${buildNFLSearchIntent(game, locale).primaryQuery}.`,
  }));
}

export function NFLPage({ locale }: { locale: SeoLocale }) {
  const copy = getNFLCopy(locale);
  const standingsMetadata = getNFLStandingsMetadata();
  return <>
    <JsonLd data={nflSportsEvents(locale)} />
    <section className="nfl-hero"><div className="container nfl-hero__inner"><Image src="/nfl/nfl-logo.png" alt="NFL league logo" width={92} height={92} priority /><div><p className="eyebrow">{copy.season}</p><h1>{copy.h1}</h1><p>{copy.subheading}</p></div></div></section>
    <section className="section section--compact"><div className="container nfl-content">
      <nav className="nfl-week-nav" aria-label="NFL week"><button disabled aria-label={copy.previous}>‹</button><span>{copy.week}</span><button disabled aria-label={copy.next}>›</button></nav>
      <h2>{copy.weekHeading}</h2>
      <NFLWeekAccordion games={nflWeek1Games} locale={locale} />
      <NFLStandings standings={getNFLStandings()} generatedAt={standingsMetadata.generatedAt} seasonPhase={standingsMetadata.seasonPhase} locale={locale} />
    </div></section>
  </>;
}
