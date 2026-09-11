import Link from "@/components/DocumentLink";
import type { Match } from "@/types";
import { localePath, type SeoLocale } from "@/lib/seo-locales";

export function LeaguePublishedAnalysis({
  leagueName,
  matches,
  locale = "en",
  localizedMatchSlugs = [],
  indexableMatchSlugs,
}: {
  leagueName: string;
  matches: Match[];
  locale?: SeoLocale;
  localizedMatchSlugs?: string[];
  indexableMatchSlugs?: string[];
}) {
  const text = {
    en: ["Editorial archive", "Published analysis", "Read published match analysis preserved separately from the active fixture rounds.", "Published prediction and pre-match reasoning."],
    "pt-br": ["Arquivo editorial", "Análises publicadas", "Leia análises publicadas preservadas separadamente das rodadas ativas.", "Palpite publicado e análise pré-jogo."],
    es: ["Archivo editorial", "Análisis publicados", "Consulta análisis publicados conservados por separado de las jornadas activas.", "Pronóstico publicado y razonamiento previo al partido."],
    it: ["Archivio editoriale", "Analisi pubblicate", "Consulta le analisi pubblicate conservate separatamente dalle giornate attive.", "Pronostico pubblicato e analisi pre-partita."],
    fr: ["Archives éditoriales", "Analyses publiées", "Consultez les analyses publiées, conservées séparément des journées en cours.", "Pronostic publié et analyse d'avant-match."],
    de: ["Redaktionelles Archiv", "Veröffentlichte Analysen", "Lesen Sie veröffentlichte Analysen, getrennt von den aktuellen Spieltagen aufbewahrt.", "Veröffentlichte Prognose und Vorbericht."],
    nl: ["Redactioneel archief", "Gepubliceerde analyses", "Lees gepubliceerde wedstrijdanalyses.", "Gepubliceerde voorspelling."],
    tr: ["Editoryal arşiv", "Yayımlanan analizler", "Yayımlanmış maç analizlerini okuyun.", "Yayımlanan tahmin."],
  }[locale];
  const localizedSet = new Set(localizedMatchSlugs);
  const indexableSet = indexableMatchSlugs
    ? new Set(indexableMatchSlugs)
    : null;
  const discoverableMatches = indexableSet
    ? matches.filter((match) => indexableSet.has(match.slug))
    : matches;
  const matchHref = (slug: string) =>
    locale !== "en" && localizedSet.has(slug)
      ? localePath(locale, `/match/${slug}/`)
      : `/match/${slug}/`;
  if (discoverableMatches.length === 0) return null;

  return (
    <section className="league-analysis-archive" aria-labelledby="league-analysis-archive-title">
      <div className="section-heading section-heading--compact">
        <div className="heading-with-icon">
          <span className="section-icon" aria-hidden="true">+</span>
          <div>
            <span className="eyebrow">{text[0]}</span>
            <h2 id="league-analysis-archive-title">{leagueName}: {text[1]}</h2>
          </div>
        </div>
      </div>

      <p className="league-analysis-archive__intro">
        {text[2]}
      </p>

      <div className="related-predictions-grid">
        {discoverableMatches.map((match) => (
          <article className="related-prediction-card" key={match.id}>
            <span>{match.date}</span>
            <h3>
              <Link href={matchHref(match.slug)} data-quality-gated-match-link="true">
                {match.homeTeam} vs {match.awayTeam}
              </Link>
            </h3>
            <p>{text[3]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
