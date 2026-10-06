import Image from "next/image";
import { NFLStandings } from "@/components/NFLStandings";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { SiteContactLine } from "@/components/SiteContactLine";
import { getNFLCopy } from "@/lib/nfl-i18n";
import type { SeoLocale } from "@/lib/seo-locales";
import { getNFLStandings, getNFLStandingsMetadata } from "@/lib/nfl-standings-provider";

// Week 3 and Week 4 games are past and were removed from the site; their
// predictions are preserved in the history archive. No upcoming NFL games are
// published, so the hub presents the season standings only.
export function NFLPage({ locale }: { locale: SeoLocale }) {
  const copy = getNFLCopy(locale);
  const standingsMetadata = getNFLStandingsMetadata();
  return <>
    <section className="nfl-hero"><div className="container nfl-hero__inner"><Image src="/nfl/nfl-logo.png" alt="NFL" width={92} height={92} priority /><div><p className="eyebrow">{copy.season}</p><h1>{copy.h1}</h1><p>{copy.subheading}</p><SiteContactLine /></div></div></section>
    <section className="section section--compact"><div className="container nfl-content">
      <NFLStandings standings={getNFLStandings()} generatedAt={standingsMetadata.generatedAt} seasonPhase={standingsMetadata.seasonPhase} locale={locale} />
    </div></section>
    {locale === "en" ? <PrimeVipOfferCard /> : null}
  </>;
}
