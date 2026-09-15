import Link from "@/components/DocumentLink";
import type { MatchPreview } from "@/types";
import { localePath, type SeoLocale } from "@/lib/seo-locales";

const titles: Record<SeoLocale, string> = {
  en: "Published match analyses", "pt-br": "Análises de jogos publicadas",
  es: "Análisis de partidos publicados", fr: "Analyses de matchs publiées",
  it: "Analisi delle partite pubblicate", de: "Veröffentlichte Spielanalysen",
  nl: "Gepubliceerde wedstrijdanalyses", tr: "Yayımlanan maç analizleri",
};

/** Complete dated links remain crawlable without a build-time Today claim. */
export function PublishedMatchDirectory({ matches, locale = "en", localizedMatchSlugs = [] }: {
  matches: MatchPreview[]; locale?: SeoLocale; localizedMatchSlugs?: string[];
}) {
  const localized = new Set(localizedMatchSlugs);
  const published = [...new Map(matches.filter((m) => m.status === "published").map((m) => [m.slug, m])).values()]
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return <section className="section section--compact" data-published-match-directory="true">
    <div className="container">
      <h2>{titles[locale]}</h2>
      <ul>{published.map((match) => <li key={match.slug}>
        {match.date ? <><time dateTime={match.date}>{match.date}</time>{" · "}</> : null}
        <Link href={locale !== "en" && localized.has(match.slug) ? localePath(locale, `/match/${match.slug}/`) : `/match/${match.slug}/`}>
          {match.homeTeam} vs {match.awayTeam}
        </Link>
      </li>)}</ul>
    </div>
  </section>;
}
