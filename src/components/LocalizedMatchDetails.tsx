import { leaguesBySlug } from "@/data/leagues";
import type { SeoLocaleSlug } from "@/lib/seo-locales";
import type { Match } from "@/types";
import { extractStatisticalCoreRows } from "@/lib/statistical-core";

const labels = {
  "pt-br": { info: "Informações da partida", competition: "Competição", round: "Rodada", date: "Data", time: "Horário", venue: "Estádio", city: "Cidade", lineups: "Prováveis escalações de", confirmed: "Escalações confirmadas de", availability: "Notícias das equipes, desfalques, lesões e suspensões", stats: "Core Estatístico Predictions-Sports-Prime", metric: "Métrica", sources: "Fontes", home: "Mandante", away: "Visitante" },
  es: { info: "Información del partido", competition: "Competición", round: "Jornada", date: "Fecha", time: "Horario", venue: "Estadio", city: "Ciudad", lineups: "Alineaciones probables de", confirmed: "Alineaciones confirmadas de", availability: "Bajas, lesiones y sancionados", stats: "Núcleo Estadístico Predictions-Sports-Prime", metric: "Métrica", sources: "Fuentes", home: "Local", away: "Visitante" },
  it: { info: "Informazioni sulla partita", competition: "Competizione", round: "Giornata", date: "Data", time: "Orario", venue: "Stadio", city: "Città", lineups: "Probabili formazioni di", confirmed: "Formazioni confermate di", availability: "Indisponibili, infortuni e squalificati", stats: "Core Statistico Predictions-Sports-Prime", metric: "Metrica", sources: "Fonti", home: "Casa", away: "Trasferta" },
  fr: { info: "Informations sur le match", competition: "Compétition", round: "Journée", date: "Date", time: "Horaire", venue: "Stade", city: "Ville", lineups: "Compositions probables de", confirmed: "Compositions confirmées de", availability: "Absents, blessures et suspendus", stats: "Noyau Statistique Predictions-Sports-Prime", metric: "Indicateur", sources: "Sources", home: "Domicile", away: "Extérieur" },
  de: { info: "Spielinformationen", competition: "Wettbewerb", round: "Spieltag", date: "Datum", time: "Anstoßzeit", venue: "Stadion", city: "Stadt", lineups: "Voraussichtliche Aufstellungen für", confirmed: "Bestätigte Aufstellungen für", availability: "Ausfälle, Verletzungen und Sperren", stats: "Statistischer Kern Predictions-Sports-Prime", metric: "Kennzahl", sources: "Quellen", home: "Heim", away: "Auswärts" },
} as const;

export const fullyLocalizedMatchLocales = ["pt-br", "es", "it", "fr", "de"] as const;
export type FullyLocalizedMatchLocale = typeof fullyLocalizedMatchLocales[number];

export function isFullyLocalizedMatchLocale(locale: SeoLocaleSlug): locale is FullyLocalizedMatchLocale {
  return fullyLocalizedMatchLocales.includes(locale as FullyLocalizedMatchLocale);
}


const statusLabels: Record<FullyLocalizedMatchLocale, Record<string, string>> = {
  "pt-br": { injured: "lesionado", suspended: "suspenso", doubtful: "dúvida", returning: "retornando", unavailable: "indisponível" },
  es: { injured: "lesionado", suspended: "sancionado", doubtful: "duda", returning: "regresa", unavailable: "baja" },
  it: { injured: "infortunato", suspended: "squalificato", doubtful: "in dubbio", returning: "al rientro", unavailable: "indisponibile" },
  fr: { injured: "blessé", suspended: "suspendu", doubtful: "incertain", returning: "de retour", unavailable: "absent" },
  de: { injured: "verletzt", suspended: "gesperrt", doubtful: "fraglich", returning: "Rückkehr", unavailable: "nicht verfügbar" },
};

const metricLabels: Record<FullyLocalizedMatchLocale, Record<string, string>> = {
  "pt-br": { form: "Forma", goals: "Gols", xg: "Gols esperados (xG)", shots: "Finalizações", possession: "Posse de bola", corners: "Escanteios", other: "Outros dados" },
  es: { form: "Forma", goals: "Goles", xg: "Goles esperados (xG)", shots: "Remates", possession: "Posesión", corners: "Córners", other: "Otros datos" },
  it: { form: "Forma", goals: "Gol", xg: "Gol attesi (xG)", shots: "Tiri", possession: "Possesso", corners: "Calci d'angolo", other: "Altri dati" },
  fr: { form: "Forme", goals: "Buts", xg: "Buts attendus (xG)", shots: "Tirs", possession: "Possession", corners: "Corners", other: "Autres données" },
  de: { form: "Form", goals: "Tore", xg: "Erwartete Tore (xG)", shots: "Schüsse", possession: "Ballbesitz", corners: "Ecken", other: "Weitere Daten" },
};

function localizedMetric(locale: FullyLocalizedMatchLocale, label: string, category: keyof typeof metricLabels[FullyLocalizedMatchLocale] = "other", index = 0) {
  const vocabulary = {
    "pt-br": ["Jogos (N)", "Pontos/jogo", "Gols marcados/jogo", "Gols sofridos/jogo", "Finalizações/jogo", "Finalizações no alvo/jogo", "Posse de bola", "Escanteios a favor/jogo", "Escanteios contra/jogo", "Total de escanteios/jogo", "Primeiro a marcar", "Primeiro a sofrer", "Marcou no 1º tempo", "Sofreu no 1º tempo", "Ambas marcam", "Jogos sem sofrer gol", "Não marcou"],
    es: ["Partidos (N)", "Puntos/partido", "Goles a favor/partido", "Goles en contra/partido", "Remates/partido", "Remates a puerta/partido", "Posesión", "Córners a favor/partido", "Córners en contra/partido", "Total de córners/partido", "Primero en marcar", "Primero en encajar", "Marcó en la 1.ª parte", "Encajó en la 1.ª parte", "Ambos marcan", "Porterías a cero", "No marcó"],
    it: ["Partite (N)", "Punti/partita", "Gol fatti/partita", "Gol subiti/partita", "Tiri/partita", "Tiri in porta/partita", "Possesso", "Calci d'angolo a favore/partita", "Calci d'angolo contro/partita", "Totale calci d'angolo/partita", "Primo a segnare", "Primo a subire", "Gol nel 1º tempo", "Gol subito nel 1º tempo", "Entrambe segnano", "Porte inviolate", "Senza gol"],
    fr: ["Matchs (N)", "Points/match", "Buts marqués/match", "Buts encaissés/match", "Tirs/match", "Tirs cadrés/match", "Possession", "Corners pour/match", "Corners contre/match", "Total corners/match", "Premier à marquer", "Premier à encaisser", "But en 1re période", "But encaissé en 1re période", "Les deux équipes marquent", "Clean sheets", "Aucun but marqué"],
    de: ["Spiele (N)", "Punkte/Spiel", "Tore/Spiel", "Gegentore/Spiel", "Schüsse/Spiel", "Torschüsse/Spiel", "Ballbesitz", "Ecken für/Spiel", "Ecken gegen/Spiel", "Ecken gesamt/Spiel", "Erstes Tor", "Erstes Gegentor", "Tor in der 1. Halbzeit", "Gegentor in der 1. Halbzeit", "Beide Teams treffen", "Spiele ohne Gegentor", "Ohne Tor"],
  }[locale];
  const exact: Array<[RegExp, string]> = [
    [/^Matches \(N\)$/i, vocabulary[0]], [/^Points\/game$/i, vocabulary[1]], [/^GF\/game$/i, vocabulary[2]], [/^GA\/game$/i, vocabulary[3]],
    [/^Shots\/game$/i, vocabulary[4]], [/^SOT\/game$/i, vocabulary[5]], [/^Shots allowed\/game$/i, `${vocabulary[4]} (${labels[locale].away})`], [/^SOT allowed\/game$/i, `${vocabulary[5]} (${labels[locale].away})`], [/^Possession$/i, vocabulary[6]], [/^Corners for\/game$/i, vocabulary[7]],
    [/^Corners against\/game$/i, vocabulary[8]], [/^Total corners\/game$/i, vocabulary[9]], [/^First to score$/i, vocabulary[10]], [/^First to concede$/i, vocabulary[11]],
    [/^Scored in 1st half$/i, vocabulary[12]], [/^Conceded in 1st half$/i, vocabulary[13]], [/^BTTS$/i, vocabulary[14]], [/^Clean sheets$/i, vocabulary[15]], [/^Failed to score$/i, vocabulary[16]],
  ];
  for (const [pattern, translation] of exact) if (pattern.test(label)) return translation;
  const unit = locale === "it" ? "gol" : locale === "de" ? "Tore" : locale === "fr" ? "buts" : locale === "es" ? "goles" : "gols";
  const corner = locale === "it" ? "calci d'angolo" : locale === "de" ? "Ecken" : locale === "es" ? "córners" : locale === "pt-br" ? "escanteios" : "corners";
  if (/^Over [\d.]+ goals$/i.test(label)) return label.replace(/goals/i, unit);
  if (/^Over [\d.]+ corners$/i.test(label)) return label.replace(/corners/i, corner);
  if (/^(?:xG|xGA)\/game$/i.test(label) || /^W-D-L$/i.test(label)) return label;
  return `${metricLabels[locale][category]} ${index + 1}`;
}

function localizedStatisticValue(locale: FullyLocalizedMatchLocale, value: string) {
  const qualifiers = {
    "pt-br": { home: "mandante", away: "visitante" },
    es: { home: "local", away: "visitante" },
    it: { home: "casa", away: "trasferta" },
    fr: { home: "domicile", away: "extérieur" },
    de: { home: "Heim", away: "Auswärts" },
  }[locale];
  return value
    .replace(/\bmandante\b/gi, qualifiers.home)
    .replace(/\bvisitante\b/gi, qualifiers.away);
}

function localizedRound(locale: FullyLocalizedMatchLocale, round: string) {
  const matchday = round.match(/^Matchday\s+(\d+)$/i);
  if (matchday) {
    const prefix = { "pt-br": "Rodada", es: "Jornada", it: "Giornata", fr: "Journée", de: "Spieltag" }[locale];
    return `${prefix} ${matchday[1]}`;
  }
  if (/^Quarter-finals$/i.test(round)) {
    return { "pt-br": "Quartas de final", es: "Cuartos de final", it: "Quarti di finale", fr: "Quarts de finale", de: "Viertelfinale" }[locale];
  }
  if (/^Quarter-final\s+—\s+Second Leg$/i.test(round)) {
    return { "pt-br": "Quartas de final — jogo de volta", es: "Cuartos de final — partido de vuelta", it: "Quarti di finale — ritorno", fr: "Quart de finale — match retour", de: "Viertelfinale — Rückspiel" }[locale];
  }
  return round;
}

function SourceLinks({ match, locale }: { match: Match; locale: FullyLocalizedMatchLocale }) {
  const sources = match.sources ?? [];
  if (!sources.length) return null;
  return <p className="match-module-sources">{labels[locale].sources}: {sources.map((source, index) => <span key={source.url}>{index ? "; " : ""}<a href={source.url} rel="noopener noreferrer">{source.name}</a></span>)}</p>;
}

export function LocalizedMatchDetails({ match, locale, forceInformation = false }: { match: Match; locale: FullyLocalizedMatchLocale; forceInformation?: boolean }) {
  const data = match.matchSeo;
  if (!data && !forceInformation) return null;
  const copy = labels[locale];
  const separator = { "pt-br": "x", es: "vs", it: "vs", fr: "vs", de: "gegen" }[locale];
  const teams = `${match.homeTeam} ${separator} ${match.awayTeam}`;
  const coreRows = extractStatisticalCoreRows(match);
  const statisticalRows = coreRows.length
    ? coreRows.map((row) => ({ ...row, category: "other" as const }))
    : (data?.statistics?.rows ?? []);
  return <div className="match-semantic-details">
    <section className="match-module"><h2>{copy.info}</h2><dl className="match-information-grid">
      <div><dt>{copy.competition}</dt><dd>{leaguesBySlug[match.league]?.name ?? match.league}</dd></div>
      <div><dt>{copy.round}</dt><dd>{localizedRound(locale, match.round)}</dd></div><div><dt>{copy.date}</dt><dd>{match.date}</dd></div><div><dt>{copy.time}</dt><dd>{match.time}</dd></div>
      {match.venue ? <div><dt>{copy.venue}</dt><dd>{match.venue}</dd></div> : null}{data?.information?.city ? <div><dt>{copy.city}</dt><dd>{data.information.city}</dd></div> : null}
    </dl></section>
    {data?.lineups ? <section className="match-module"><h2>{data.lineups.status === "confirmed" ? copy.confirmed : copy.lineups} {teams}</h2><div className="match-lineups-grid">{(["home", "away"] as const).map((side) => <div key={side}><h3>{side === "home" ? match.homeTeam : match.awayTeam}</h3><ol>{data.lineups![side].players.map((player) => <li key={player}>{player}</li>)}</ol></div>)}</div></section> : null}
    {data?.availability ? <section className="match-module"><h2>{copy.availability}</h2><ul className="match-availability-list">{data.availability.entries.map((entry) => <li key={`${entry.team}-${entry.player}`}><strong>{entry.player}</strong> ({entry.team === "home" ? match.homeTeam : match.awayTeam}) — {statusLabels[locale][entry.status]}</li>)}</ul></section> : null}
    {data?.statistics || coreRows.length ? <section className="match-module"><h2>{copy.stats}</h2><div className="match-stats" role="table" aria-label={`${copy.stats}: ${teams}`}><div className="match-stats-row match-stats-header" role="row"><span role="columnheader">{copy.metric}</span><span role="columnheader">{copy.home}</span><span role="columnheader">{copy.away}</span></div>{statisticalRows.map((row, index) => <div className="match-stats-row" role="row" key={row.label}><span role="rowheader">{localizedMetric(locale, row.label, row.category, index)}</span><span role="cell">{localizedStatisticValue(locale, row.home)}</span><span role="cell">{localizedStatisticValue(locale, row.away)}</span></div>)}</div></section> : null}
    <SourceLinks match={match} locale={locale} />
  </div>;
}
