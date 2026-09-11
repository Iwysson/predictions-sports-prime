import Link from "@/components/DocumentLink";
import type { CompetitionRoundSurface } from "@/lib/competition-rounds";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";
import { localTodayISO } from "@/lib/match-feed";
import type { Match, MatchPreview } from "@/types";
import { localePath, matchPredictionAnchor, type SeoLocale } from "@/lib/seo-locales";
import { localizeRoundText } from "@/lib/localized-presentation";
import { isFutureFixture } from "@/lib/fixture-state";

function uniqueMatches(matches: MatchPreview[]) {
  return [...new Map(matches.map((match) => [match.slug, match])).values()];
}

function isCompleted(match: MatchPreview | Match) {
  return isHistoryEligibleFixture({
    status: match.fixtureStatus,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  });
}

const hubCopy: Record<SeoLocale, { overview: string; awaiting: string; fixtures: string; published: string; completed: string; today: string; upcoming: string; prediction: string; preview: string; latest: string; read: string; allListed: string; recent: string; review: string; archived: string; unpublished: string }> = {
  en: { overview: "Overview", awaiting: "The current round is awaiting confirmed fixture data.", fixtures: "fixtures", published: "published analyses available", completed: "completed matches", today: "Today's matches", upcoming: "Upcoming matches", prediction: "prediction", preview: "Preview", latest: "Latest predictions", read: "Read the match analysis", allListed: "All current predictions are listed above.", recent: "Recent results", review: "Review the published prediction", archived: "Analysis archived", unpublished: "Analysis not published" },
  "pt-br": { overview: "Visão geral", awaiting: "A rodada atual aguarda dados confirmados.", fixtures: "jogos", published: "análises publicadas disponíveis", completed: "jogos concluídos", today: "Jogos de hoje", upcoming: "Próximos jogos", prediction: "palpite", preview: "Prévia", latest: "Palpites mais recentes", read: "Leia a análise da partida", allListed: "Todos os palpites atuais estão listados acima.", recent: "Resultados recentes", review: "Rever o palpite publicado", archived: "Análise arquivada", unpublished: "Análise não publicada" },
  es: { overview: "Resumen", awaiting: "La jornada actual espera datos confirmados.", fixtures: "partidos", published: "análisis publicados disponibles", completed: "partidos finalizados", today: "Partidos de hoy", upcoming: "Próximos partidos", prediction: "pronóstico", preview: "Previa", latest: "Pronósticos recientes", read: "Leer el análisis del partido", allListed: "Todos los pronósticos actuales aparecen arriba.", recent: "Resultados recientes", review: "Revisar el pronóstico publicado", archived: "Análisis archivado", unpublished: "Análisis no publicado" },
  it: { overview: "Panoramica", awaiting: "La giornata attuale è in attesa di dati confermati.", fixtures: "partite", published: "analisi pubblicate disponibili", completed: "partite concluse", today: "Partite di oggi", upcoming: "Prossime partite", prediction: "pronostico", preview: "Anteprima", latest: "Pronostici recenti", read: "Leggi l'analisi della partita", allListed: "Tutti i pronostici attuali sono elencati sopra.", recent: "Risultati recenti", review: "Rivedi il pronostico pubblicato", archived: "Analisi archiviata", unpublished: "Analisi non pubblicata" },
  fr: { overview: "Aperçu", awaiting: "La journée actuelle attend des données confirmées.", fixtures: "matchs", published: "analyses publiées disponibles", completed: "matchs terminés", today: "Matchs du jour", upcoming: "Prochains matchs", prediction: "pronostic", preview: "Avant-match", latest: "Pronostics récents", read: "Lire l'analyse du match", allListed: "Tous les pronostics actuels figurent ci-dessus.", recent: "Résultats récents", review: "Revoir le pronostic publié", archived: "Analyse archivée", unpublished: "Analyse non publiée" },
  de: { overview: "Überblick", awaiting: "Der aktuelle Spieltag wartet auf bestätigte Daten.", fixtures: "Partien", published: "veröffentlichte Analysen verfügbar", completed: "beendete Partien", today: "Heutige Partien", upcoming: "Kommende Partien", prediction: "Prognose", preview: "Vorschau", latest: "Neueste Prognosen", read: "Spielanalyse lesen", allListed: "Alle aktuellen Prognosen sind oben aufgeführt.", recent: "Aktuelle Ergebnisse", review: "Veröffentlichte Prognose prüfen", archived: "Analyse archiviert", unpublished: "Analyse nicht veröffentlicht" },
  nl: { overview: "Overzicht", awaiting: "Wedstrijdgegevens volgen.", fixtures: "wedstrijden", published: "analyses beschikbaar", completed: "afgeronde wedstrijden", today: "Wedstrijden vandaag", upcoming: "Komende wedstrijden", prediction: "voorspelling", preview: "Voorbeschouwing", latest: "Laatste voorspellingen", read: "Lees de analyse", allListed: "Alle voorspellingen staan hierboven.", recent: "Recente uitslagen", review: "Bekijk voorspelling", archived: "Analyse gearchiveerd", unpublished: "Analyse niet gepubliceerd" },
  tr: { overview: "Genel bakış", awaiting: "Onaylı fikstür verileri bekleniyor.", fixtures: "maç", published: "analiz mevcut", completed: "tamamlanan maç", today: "Bugünün maçları", upcoming: "Yaklaşan maçlar", prediction: "tahmin", preview: "Ön izleme", latest: "Son tahminler", read: "Maç analizini oku", allListed: "Tahminler yukarıda listelenmiştir.", recent: "Son sonuçlar", review: "Tahmini incele", archived: "Analiz arşivlendi", unpublished: "Analiz yayımlanmadı" },
};

function MatchLinks({
  matches,
  locale,
  localizedMatchSlugs,
  indexableMatchSlugs,
  labels,
}: {
  matches: MatchPreview[];
  locale: SeoLocale;
  localizedMatchSlugs: Set<string>;
  indexableMatchSlugs: Set<string> | null;
  labels: { prediction: string; preview: string; archived: string; unpublished: string };
}) {
  if (!matches.length) return null;
  const matchHref = (slug: string) =>
    locale !== "en" && localizedMatchSlugs.has(slug)
      ? localePath(locale, `/match/${slug}/`)
      : `/match/${slug}/`;
  return (
    <div className="league-hub-list">
      {matches.map((match) => (
        <article className="league-hub-fixture" key={match.slug}>
          <div>
            <span>{match.date}{match.time && match.time !== "TBD" ? ` · ${match.time}` : ""}</span>
            <h3>{match.homeTeam} vs {match.awayTeam}</h3>
          </div>
          {match.status === "published" &&
          (indexableMatchSlugs === null || indexableMatchSlugs.has(match.slug)) ? (
            <Link href={matchHref(match.slug)} data-quality-gated-match-link="true">
              {isFutureFixture(match)
                ? matchPredictionAnchor(match.homeTeam, match.awayTeam, locale)
                : `${match.homeTeam} vs ${match.awayTeam}`}
            </Link>
          ) : (
            <span className="league-hub-unavailable">
              {match.status === "published" ? labels.archived : labels.unpublished}
            </span>
          )}
        </article>
      ))}
    </div>
  );
}

export function LeagueEditorialHub({
  leagueName,
  publishedMatches,
  surface,
  locale = "en",
  localizedMatchSlugs = [],
  indexableMatchSlugs,
}: {
  leagueName: string;
  publishedMatches: Match[];
  surface: CompetitionRoundSurface;
  locale?: SeoLocale;
  localizedMatchSlugs?: string[];
  indexableMatchSlugs?: string[];
}) {
  const c = hubCopy[locale];
  const localizedMatchSet = new Set(localizedMatchSlugs);
  const indexableMatchSet = indexableMatchSlugs
    ? new Set(indexableMatchSlugs)
    : null;
  const matchHref = (slug: string) =>
    locale !== "en" && localizedMatchSet.has(slug)
      ? localePath(locale, `/match/${slug}/`)
      : `/match/${slug}/`;
  const today = localTodayISO();
  const discoverablePublishedMatches = indexableMatchSet
    ? publishedMatches.filter((match) => indexableMatchSet.has(match.slug))
    : publishedMatches;
  const roundMatches = uniqueMatches([
    ...(surface.current?.matches ?? []),
    ...(surface.next?.matches ?? []),
    ...discoverablePublishedMatches,
  ]);
  const todayMatches = roundMatches.filter((match) => match.date === today && !isCompleted(match));
  const upcomingMatches = roundMatches.filter((match) => match.date > today && !isCompleted(match));
  const activeSlugs = new Set([...todayMatches, ...upcomingMatches].map((match) => match.slug));
  const completed = [...discoverablePublishedMatches]
    .filter(isCompleted)
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 6);
  const latest = [...discoverablePublishedMatches]
    .filter((match) => !activeSlugs.has(match.slug) && !isCompleted(match))
    .sort((left, right) =>
      (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "") || right.date.localeCompare(left.date)
    )
    .slice(0, 6);
  const currentCount = surface.current?.matches.length ?? 0;
  const currentPublished = surface.current?.matches.filter((match) => match.status === "published").length ?? 0;
  const currentCompleted = surface.current?.matches.filter(isCompleted).length ?? 0;

  return (
    <div className="league-editorial-hub">
      <section className="league-hub-overview" aria-labelledby="league-overview-heading">
        <h2 id="league-overview-heading">{leagueName}: {c.overview}</h2>
        <p>
          {surface.current ? `${locale === "en" ? surface.current.round : localizeRoundText(String(surface.current.round), locale)}: ${currentCount} ${c.fixtures}.` : c.awaiting}
          {` ${currentPublished} ${c.published}`}{currentCompleted ? `; ${currentCompleted} ${c.completed}.` : "."}
        </p>
      </section>

      {todayMatches.length ? (
        <section aria-labelledby="league-today-heading">
        <h2 id="league-today-heading">{leagueName}: {c.today}</h2>
          <MatchLinks
            matches={todayMatches}
            locale={locale}
            localizedMatchSlugs={localizedMatchSet}
            indexableMatchSlugs={indexableMatchSet}
            labels={c}
          />
        </section>
      ) : null}

      {upcomingMatches.length ? (
        <section aria-labelledby="league-upcoming-heading">
        <h2 id="league-upcoming-heading">{leagueName}: {c.upcoming}</h2>
          <MatchLinks
            matches={upcomingMatches}
            locale={locale}
            localizedMatchSlugs={localizedMatchSet}
            indexableMatchSlugs={indexableMatchSet}
            labels={c}
          />
        </section>
      ) : null}

      <section aria-labelledby="league-latest-analysis-heading">
        <h2 id="league-latest-analysis-heading">{leagueName}: {c.latest}</h2>
        {latest.length ? (
          <div className="league-hub-analysis-grid">
            {latest.map((match, index) => (
              <article key={match.slug}>
                <span>{match.date}</span>
                <h3><Link href={matchHref(match.slug)} data-quality-gated-match-link="true">{match.homeTeam} vs {match.awayTeam}</Link></h3>
                <Link href={matchHref(match.slug)} data-quality-gated-match-link="true">
                  {isFutureFixture(match)
                    ? matchPredictionAnchor(match.homeTeam, match.awayTeam, locale)
                    : index % 2 === 0
                      ? `${match.homeTeam} vs ${match.awayTeam}: ${c.prediction}`
                      : `${c.read}: ${match.homeTeam} vs ${match.awayTeam}`}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p>{c.allListed}</p>
        )}
      </section>

      {completed.length ? (
        <section aria-labelledby="league-results-heading">
          <h2 id="league-results-heading">{leagueName}: {c.recent}</h2>
          <div className="league-hub-results">
            {completed.map((match) => (
              <article key={match.slug}>
                <span>{match.date}</span>
                <strong>{match.homeTeam} {match.homeScore}–{match.awayScore} {match.awayTeam}</strong>
                <Link href={matchHref(match.slug)} data-quality-gated-match-link="true">{c.review}</Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
