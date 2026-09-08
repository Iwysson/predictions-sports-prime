import { leaguesBySlug } from "@/data/leagues";
import { extractStatisticalCoreRows } from "@/lib/statistical-core";
import {
  localizePresentationText,
  localizeRoundText,
} from "@/lib/localized-presentation";
import type { SeoLocaleSlug } from "@/lib/seo-locales";
import type { Match } from "@/types";

const labels = {
  "pt-br": { info: "Contexto da partida", competition: "Competição", round: "Rodada", date: "Data", time: "Horário", venue: "Estádio", city: "Cidade", lineups: "Contexto de seleção das equipes", confirmed: "Escalações confirmadas", availability: "Disponibilidade do elenco", stats: "Core Estatístico Predictions-Sports-Prime", metric: "Métrica", sources: "Fontes", home: "Mandante", away: "Visitante" },
  es: { info: "Contexto del partido", competition: "Competición", round: "Jornada", date: "Fecha", time: "Horario", venue: "Estadio", city: "Ciudad", lineups: "Contexto de selección de los equipos", confirmed: "Alineaciones confirmadas", availability: "Disponibilidad de la plantilla", stats: "Núcleo Estadístico Predictions-Sports-Prime", metric: "Métrica", sources: "Fuentes", home: "Local", away: "Visitante" },
  it: { info: "Contesto della partita", competition: "Competizione", round: "Giornata", date: "Data", time: "Orario", venue: "Stadio", city: "Città", lineups: "Contesto delle scelte di formazione", confirmed: "Formazioni confermate", availability: "Disponibilità della rosa", stats: "Core Statistico Predictions-Sports-Prime", metric: "Metrica", sources: "Fonti", home: "Casa", away: "Trasferta" },
  fr: { info: "Contexte du match", competition: "Compétition", round: "Journée", date: "Date", time: "Horaire", venue: "Stade", city: "Ville", lineups: "Contexte des choix d'équipe", confirmed: "Compositions confirmées", availability: "Disponibilité de l'effectif", stats: "Noyau Statistique Predictions-Sports-Prime", metric: "Indicateur", sources: "Sources", home: "Domicile", away: "Extérieur" },
  de: { info: "Spielkontext", competition: "Wettbewerb", round: "Spieltag", date: "Datum", time: "Anstoßzeit", venue: "Stadion", city: "Stadt", lineups: "Kontext der Team-Auswahl", confirmed: "Bestätigte Aufstellungen", availability: "Kaderverfügbarkeit", stats: "Statistischer Kern Predictions-Sports-Prime", metric: "Kennzahl", sources: "Quellen", home: "Heim", away: "Auswärts" },
  nl: { info: "Wedstrijdcontext", competition: "Competitie", round: "Speelronde", date: "Datum", time: "Tijd", venue: "Stadion", city: "Plaats", lineups: "Context van de opstellingen", confirmed: "Bevestigde opstellingen", availability: "Beschikbaarheid selectie", stats: "Statistische Kern Predictions-Sports-Prime", metric: "Maatstaf", sources: "Bronnen", home: "Thuis", away: "Uit" },
  tr: { info: "Maç bağlamı", competition: "Organizasyon", round: "Hafta", date: "Tarih", time: "Saat", venue: "Stadyum", city: "Şehir", lineups: "Kadro seçimi bağlamı", confirmed: "Onaylanan kadrolar", availability: "Kadro uygunluğu", stats: "İstatistiksel Çekirdek Predictions-Sports-Prime", metric: "Ölçüt", sources: "Kaynaklar", home: "İç saha", away: "Deplasman" },
} as const;

export const fullyLocalizedMatchLocales = ["pt-br", "es", "it", "fr", "de", "nl", "tr"] as const;
export type FullyLocalizedMatchLocale = (typeof fullyLocalizedMatchLocales)[number];

export function isFullyLocalizedMatchLocale(locale: SeoLocaleSlug): locale is FullyLocalizedMatchLocale {
  return fullyLocalizedMatchLocales.includes(locale as FullyLocalizedMatchLocale);
}

const statusLabels: Record<FullyLocalizedMatchLocale, Record<string, string>> = {
  "pt-br": { injured: "lesionado", suspended: "suspenso", doubtful: "dúvida", returning: "retornando", unavailable: "indisponível" },
  es: { injured: "lesionado", suspended: "sancionado", doubtful: "duda", returning: "regresa", unavailable: "baja" },
  it: { injured: "infortunato", suspended: "squalificato", doubtful: "in dubbio", returning: "al rientro", unavailable: "indisponibile" },
  fr: { injured: "blessé", suspended: "suspendu", doubtful: "incertain", returning: "de retour", unavailable: "absent" },
  de: { injured: "verletzt", suspended: "gesperrt", doubtful: "fraglich", returning: "Rückkehr", unavailable: "nicht verfügbar" },
  nl: { injured: "geblesseerd", suspended: "geschorst", doubtful: "twijfelachtig", returning: "keert terug", unavailable: "niet beschikbaar" },
  tr: { injured: "sakat", suspended: "cezalı", doubtful: "şüpheli", returning: "geri dönüyor", unavailable: "kullanılamıyor" },
};

const metricVocabulary: Record<FullyLocalizedMatchLocale, Record<string, string>> = {
  "pt-br": { matches: "Jogos (N)", points: "Pontos/jogo", gf: "Gols marcados/jogo", ga: "Gols sofridos/jogo", shots: "Finalizações/jogo", sot: "Finalizações no alvo/jogo", shotsAllowed: "Finalizações sofridas/jogo", sotAllowed: "Finalizações no alvo sofridas/jogo", possession: "Posse de bola", cornersFor: "Escanteios a favor/jogo", cornersAgainst: "Escanteios contra/jogo", totalCorners: "Total de escanteios/jogo", firstScore: "Primeiro a marcar", firstConcede: "Primeiro a sofrer", scoredFirstHalf: "Marcou no 1º tempo", concededFirstHalf: "Sofreu no 1º tempo", btts: "Ambas marcam", cleanSheets: "Jogos sem sofrer gol", failedScore: "Não marcou" },
  es: { matches: "Partidos (N)", points: "Puntos/partido", gf: "Goles a favor/partido", ga: "Goles en contra/partido", shots: "Remates/partido", sot: "Remates a puerta/partido", shotsAllowed: "Remates recibidos/partido", sotAllowed: "Remates a puerta recibidos/partido", possession: "Posesión", cornersFor: "Córners a favor/partido", cornersAgainst: "Córners en contra/partido", totalCorners: "Total de córners/partido", firstScore: "Primero en marcar", firstConcede: "Primero en encajar", scoredFirstHalf: "Marcó en la 1.ª parte", concededFirstHalf: "Encajó en la 1.ª parte", btts: "Ambos marcan", cleanSheets: "Porterías a cero", failedScore: "No marcó" },
  it: { matches: "Partite (N)", points: "Punti/partita", gf: "Gol fatti/partita", ga: "Gol subiti/partita", shots: "Tiri/partita", sot: "Tiri in porta/partita", shotsAllowed: "Tiri concessi/partita", sotAllowed: "Tiri in porta concessi/partita", possession: "Possesso", cornersFor: "Calci d'angolo a favore/partita", cornersAgainst: "Calci d'angolo contro/partita", totalCorners: "Totale calci d'angolo/partita", firstScore: "Primo a segnare", firstConcede: "Primo a subire", scoredFirstHalf: "Gol nel 1º tempo", concededFirstHalf: "Gol subito nel 1º tempo", btts: "Entrambe segnano", cleanSheets: "Porte inviolate", failedScore: "Senza gol" },
  fr: { matches: "Matchs (N)", points: "Points/match", gf: "Buts marqués/match", ga: "Buts encaissés/match", shots: "Tirs/match", sot: "Tirs cadrés/match", shotsAllowed: "Tirs concédés/match", sotAllowed: "Tirs cadrés concédés/match", possession: "Possession", cornersFor: "Coups de pied de coin pour/match", cornersAgainst: "Coups de pied de coin contre/match", totalCorners: "Total des coups de pied de coin/match", firstScore: "Premier à marquer", firstConcede: "Premier à encaisser", scoredFirstHalf: "But en 1re période", concededFirstHalf: "But encaissé en 1re période", btts: "Les deux équipes marquent", cleanSheets: "Matchs sans encaisser", failedScore: "Aucun but marqué" },
  de: { matches: "Spiele (N)", points: "Punkte/Spiel", gf: "Tore/Spiel", ga: "Gegentore/Spiel", shots: "Schüsse/Spiel", sot: "Torschüsse/Spiel", shotsAllowed: "Zugelassene Schüsse/Spiel", sotAllowed: "Zugelassene Torschüsse/Spiel", possession: "Ballbesitz", cornersFor: "Ecken für/Spiel", cornersAgainst: "Ecken gegen/Spiel", totalCorners: "Ecken gesamt/Spiel", firstScore: "Erstes Tor", firstConcede: "Erstes Gegentor", scoredFirstHalf: "Tor in der 1. Halbzeit", concededFirstHalf: "Gegentor in der 1. Halbzeit", btts: "Beide Teams treffen", cleanSheets: "Spiele ohne Gegentor", failedScore: "Ohne Tor" },
  nl: { matches: "Wedstrijden (N)", points: "Punten/wedstrijd", gf: "Doelpunten voor/wedstrijd", ga: "Doelpunten tegen/wedstrijd", shots: "Schoten/wedstrijd", sot: "Schoten op doel/wedstrijd", shotsAllowed: "Toegestane schoten/wedstrijd", sotAllowed: "Toegestane schoten op doel/wedstrijd", possession: "Balbezit", cornersFor: "Hoekschoppen voor/wedstrijd", cornersAgainst: "Hoekschoppen tegen/wedstrijd", totalCorners: "Totaal hoekschoppen/wedstrijd", firstScore: "Eerste doelpunt", firstConcede: "Eerste tegendoelpunt", scoredFirstHalf: "Gescoord in 1e helft", concededFirstHalf: "Tegendoelpunt in 1e helft", btts: "Beide teams scoren", cleanSheets: "Wedstrijden zonder tegendoelpunt", failedScore: "Niet gescoord" },
  tr: { matches: "Maçlar (N)", points: "Puan/maç", gf: "Atılan gol/maç", ga: "Yenilen gol/maç", shots: "Şut/maç", sot: "İsabetli şut/maç", shotsAllowed: "Verilen şut/maç", sotAllowed: "Verilen isabetli şut/maç", possession: "Topa sahip olma", cornersFor: "Kazanılan korner/maç", cornersAgainst: "Verilen korner/maç", totalCorners: "Toplam korner/maç", firstScore: "İlk golü atan", firstConcede: "İlk golü yiyen", scoredFirstHalf: "İlk yarıda gol attı", concededFirstHalf: "İlk yarıda gol yedi", btts: "Karşılıklı gol", cleanSheets: "Gol yemeden biten maç", failedScore: "Gol atamadı" },
};

function localizedMetric(locale: FullyLocalizedMatchLocale, label: string) {
  const v = metricVocabulary[locale];
  const exact: Array<[RegExp, string]> = [
    [/^Matches \(N\)$/i, v.matches], [/^Points\/game$/i, v.points], [/^GF\/game$/i, v.gf], [/^GA\/game$/i, v.ga],
    [/^Shots\/game$/i, v.shots], [/^SOT\/game$/i, v.sot], [/^Shots allowed\/game$/i, v.shotsAllowed], [/^SOT allowed\/game$/i, v.sotAllowed],
    [/^Possession$/i, v.possession], [/^Corners for\/game$/i, v.cornersFor], [/^Corners against\/game$/i, v.cornersAgainst], [/^Total corners\/game$/i, v.totalCorners],
    [/^First to score$/i, v.firstScore], [/^First to concede$/i, v.firstConcede], [/^Scored in 1st half$/i, v.scoredFirstHalf], [/^Conceded in 1st half$/i, v.concededFirstHalf],
    [/^BTTS$/i, v.btts], [/^Clean sheets$/i, v.cleanSheets], [/^Failed to score$/i, v.failedScore],
  ];
  for (const [pattern, translation] of exact) if (pattern.test(label)) return translation;
  return localizePresentationText(label, locale);
}

function SourceLinks({ match, locale }: { match: Match; locale: FullyLocalizedMatchLocale }) {
  const sources = match.sources ?? [];
  if (!sources.length) return null;
  return <p className="match-module-sources">{labels[locale].sources}: {sources.map((source, index) => <span key={source.url}>{index ? "; " : ""}<a href={source.url} rel="noopener noreferrer">{localizePresentationText(source.name, locale)}</a></span>)}</p>;
}

export function LocalizedMatchDetails({ match, locale, forceInformation = false }: { match: Match; locale: FullyLocalizedMatchLocale; forceInformation?: boolean }) {
  const data = match.matchSeo;
  if (!data && !forceInformation) return null;
  const copy = labels[locale];
  const separator = { "pt-br": "x", es: "vs", it: "vs", fr: "vs", de: "gegen", nl: "vs", tr: "vs" }[locale];
  const teams = `${match.homeTeam} ${separator} ${match.awayTeam}`;
  const coreRows = extractStatisticalCoreRows(match);
  const statisticalRows = coreRows.length
    ? coreRows.map((row) => ({ ...row, category: "other" as const }))
    : (data?.statistics?.rows ?? []);

  return <div className="match-semantic-details">
    <section className="match-module"><h2>{copy.info}</h2><dl className="match-information-grid">
      <div><dt>{copy.competition}</dt><dd>{leaguesBySlug[match.league]?.name ?? match.league}</dd></div>
      <div><dt>{copy.round}</dt><dd>{localizeRoundText(match.round, locale)}</dd></div>
      <div><dt>{copy.date}</dt><dd>{match.date}</dd></div><div><dt>{copy.time}</dt><dd>{match.time}</dd></div>
      {match.venue ? <div><dt>{copy.venue}</dt><dd>{match.venue}</dd></div> : null}
      {data?.information?.city ? <div><dt>{copy.city}</dt><dd>{data.information.city}</dd></div> : null}
    </dl></section>
    {data?.lineups ? <section className="match-module"><h2>{data.lineups.status === "confirmed" ? copy.confirmed : copy.lineups}</h2><div className="match-lineups-grid">{(["home", "away"] as const).map((side) => <div key={side}><h3>{side === "home" ? match.homeTeam : match.awayTeam}</h3><ol>{data.lineups![side].players.map((player) => <li key={player}>{player}</li>)}</ol></div>)}</div></section> : null}
    {data?.availability ? <section className="match-module"><h2>{copy.availability}</h2><ul className="match-availability-list">{data.availability.entries.map((entry) => <li key={`${entry.team}-${entry.player}`}><strong>{entry.player}</strong> ({entry.team === "home" ? match.homeTeam : match.awayTeam}) — {statusLabels[locale][entry.status] ?? localizePresentationText(entry.status, locale)}</li>)}</ul></section> : null}
    {data?.statistics || coreRows.length ? <section className="match-module"><h2>{copy.stats}</h2><div className="match-stats" role="table" aria-label={`${copy.stats}: ${teams}`}><div className="match-stats-row match-stats-header" role="row"><span role="columnheader">{copy.metric}</span><span role="columnheader">{copy.home}</span><span role="columnheader">{copy.away}</span></div>{statisticalRows.map((row) => <div className="match-stats-row" role="row" key={row.label}><span role="rowheader">{localizedMetric(locale, row.label)}</span><span role="cell">{localizePresentationText(row.home, locale)}</span><span role="cell">{localizePresentationText(row.away, locale)}</span></div>)}</div></section> : null}
    <SourceLinks match={match} locale={locale} />
  </div>;
}
