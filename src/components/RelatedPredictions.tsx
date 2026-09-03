import Link from "next/link";
import type { Match } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import { localePath, type SeoLocale } from "@/lib/seo-locales";

const copy: Record<
  SeoLocale,
  { eyebrow: string; title: string; intro: string; available: string; read: string }
> = {
  en: {
    eyebrow: "Keep exploring",
    title: "Related Match Analyses",
    intro: "Explore more expert previews, key match insights and betting predictions.",
    available: "Match analysis and prediction available",
    read: "Read match analysis",
  },
  "pt-br": {
    eyebrow: "Continue explorando",
    title: "Análises relacionadas",
    intro: "Veja mais análises, informações do confronto e palpites publicados.",
    available: "Análise e palpite disponíveis",
    read: "Ver análise da partida",
  },
  es: {
    eyebrow: "Sigue explorando",
    title: "Análisis relacionados",
    intro: "Consulta más análisis, claves del partido y pronósticos publicados.",
    available: "Análisis y pronóstico disponibles",
    read: "Ver análisis del partido",
  },
  fr: {
    eyebrow: "Poursuivre",
    title: "Analyses associées",
    intro: "Découvrez d’autres analyses, éléments clés et pronostics publiés.",
    available: "Analyse et pronostic disponibles",
    read: "Voir l’analyse du match",
  },
  de: {
    eyebrow: "Weiter entdecken",
    title: "Verwandte Spielanalysen",
    intro: "Weitere Analysen, wichtige Spielinformationen und Prognosen ansehen.",
    available: "Analyse und Prognose verfügbar",
    read: "Spielanalyse ansehen",
  },
  it: {
    eyebrow: "Continua a esplorare",
    title: "Analisi correlate",
    intro: "Scopri altre analisi, informazioni chiave e pronostici pubblicati.",
    available: "Analisi e pronostico disponibili",
    read: "Vedi analisi partita",
  },
  nl: {
    eyebrow: "Verder ontdekken",
    title: "Gerelateerde wedstrijdanalyses",
    intro: "Bekijk meer analyses, wedstrijdinzichten en voorspellingen.",
    available: "Analyse en voorspelling beschikbaar",
    read: "Bekijk wedstrijdanalyse",
  },
  tr: {
    eyebrow: "Keşfetmeye devam edin",
    title: "İlgili maç analizleri",
    intro: "Daha fazla analiz, maç içgörüsü ve yayımlanmış tahminleri inceleyin.",
    available: "Analiz ve tahmin mevcut",
    read: "Maç analizini görüntüle",
  },
};

export function RelatedPredictions({
  matches,
  locale = "en",
  localizedSlugs = [],
  indexableMatchSlugs,
}: {
  matches: Match[];
  locale?: SeoLocale;
  localizedSlugs?: string[];
  indexableMatchSlugs?: string[];
}) {
  const indexableSet = indexableMatchSlugs
    ? new Set(indexableMatchSlugs)
    : null;
  const discoverableMatches = indexableSet
    ? matches.filter((match) => indexableSet.has(match.slug))
    : matches;

  if (discoverableMatches.length === 0) return null;

  const labels = copy[locale];
  const localizedSet = new Set(localizedSlugs);
  const hrefFor = (slug: string) =>
    locale !== "en" && localizedSet.has(slug)
      ? localePath(locale, `/match/${slug}/`)
      : `/match/${slug}/`;

  return (
    <section className="related-predictions" aria-labelledby="related-predictions-title">
      <div className="related-predictions-heading">
        <span className="eyebrow">{labels.eyebrow}</span>
        <h2 id="related-predictions-title">{labels.title}</h2>
        <p>{labels.intro}</p>
      </div>

      <div className="related-predictions-grid">
        {discoverableMatches.map((match) => (
          <article className="related-prediction-card" key={match.id}>
            <span>{leaguesBySlug[match.league].name}</span>
            <h3>{match.homeTeam} vs {match.awayTeam}</h3>
            <p>{labels.available}</p>
            <Link
              href={hrefFor(match.slug)}
              data-quality-gated-match-link="true"
              aria-label={`${labels.read}: ${match.homeTeam} vs ${match.awayTeam}`}
            >
              {labels.read} <span aria-hidden="true">›</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
