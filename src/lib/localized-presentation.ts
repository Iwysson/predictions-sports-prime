import { leaguesBySlug } from "@/data/leagues";
import type { SeoLocaleSlug } from "@/lib/seo-locales";
import { isUpcomingMatch } from "@/lib/upcoming-match";
import type { Match } from "@/types";

export type LocalizedPresentation = {
  analysis: string[];
  mainPrediction: string;
  sourceDescription: string;
};

type LocaleWords = {
  connector: string;
  home: string;
  away: string;
  homeLower: string;
  awayLower: string;
  statisticalCore: string;
  matchAnalysis: string;
  mainPrediction: string;
  publishedOdds: string;
  teamNews: string;
  projectedLineups: string;
  probableLineups: string;
  expectedLineups: string;
  confirmedLineups: string;
  gameState: string;
  risk: string;
  sourceData: string;
  sources: string;
  goals: string;
  corners: string;
  shots: string;
  shotsOnTarget: string;
  cleanSheets: string;
  firstToScore: string;
  firstToConcede: string;
  btts: string;
  asianHandicap: string;
  drawNoBet: string;
  doubleChance: string;
  combinedBet: string;
  overUnder: string;
  over: string;
  under: string;
};

const words: Record<SeoLocaleSlug, LocaleWords> = {
  "pt-br": {
    connector: "e", home: "MANDANTE", away: "VISITANTE", homeLower: "mandante", awayLower: "visitante",
    statisticalCore: "Core Estatístico", matchAnalysis: "análise da partida", mainPrediction: "palpite principal", publishedOdds: "odd publicada",
    teamNews: "notícias das equipes", projectedLineups: "escalações projetadas", probableLineups: "escalações prováveis", expectedLineups: "escalações previstas", confirmedLineups: "escalações confirmadas",
    gameState: "estado do jogo", risk: "risco", sourceData: "dados de origem", sources: "fontes", goals: "gols", corners: "escanteios", shots: "finalizações", shotsOnTarget: "finalizações no alvo",
    cleanSheets: "jogos sem sofrer gol", firstToScore: "primeiro a marcar", firstToConcede: "primeiro a sofrer", btts: "ambas marcam", asianHandicap: "handicap asiático",
    drawNoBet: "empate anula aposta", doubleChance: "dupla chance", combinedBet: "mercado combinado", overUnder: "mais/menos gols", over: "mais de", under: "menos de",
  },
  es: {
    connector: "y", home: "LOCAL", away: "VISITANTE", homeLower: "local", awayLower: "visitante",
    statisticalCore: "Núcleo Estadístico", matchAnalysis: "análisis del partido", mainPrediction: "pronóstico principal", publishedOdds: "cuota publicada",
    teamNews: "noticias de los equipos", projectedLineups: "alineaciones proyectadas", probableLineups: "alineaciones probables", expectedLineups: "alineaciones previstas", confirmedLineups: "alineaciones confirmadas",
    gameState: "estado del partido", risk: "riesgo", sourceData: "datos de origen", sources: "fuentes", goals: "goles", corners: "córners", shots: "remates", shotsOnTarget: "remates a puerta",
    cleanSheets: "porterías a cero", firstToScore: "primero en marcar", firstToConcede: "primero en encajar", btts: "ambos marcan", asianHandicap: "hándicap asiático",
    drawNoBet: "empate no apuesta", doubleChance: "doble oportunidad", combinedBet: "mercado combinado", overUnder: "más/menos goles", over: "más de", under: "menos de",
  },
  it: {
    connector: "e", home: "CASA", away: "TRASFERTA", homeLower: "casa", awayLower: "trasferta",
    statisticalCore: "Core Statistico", matchAnalysis: "analisi della partita", mainPrediction: "pronostico principale", publishedOdds: "quota pubblicata",
    teamNews: "notizie sulle squadre", projectedLineups: "formazioni previste", probableLineups: "formazioni probabili", expectedLineups: "formazioni previste", confirmedLineups: "formazioni confermate",
    gameState: "stato della partita", risk: "rischio", sourceData: "dati di origine", sources: "fonti", goals: "gol", corners: "calci d'angolo", shots: "tiri", shotsOnTarget: "tiri in porta",
    cleanSheets: "porte inviolate", firstToScore: "primo a segnare", firstToConcede: "primo a subire", btts: "entrambe segnano", asianHandicap: "handicap asiatico",
    drawNoBet: "pareggio rimborso", doubleChance: "doppia chance", combinedBet: "scommessa combinata", overUnder: "più/meno gol", over: "più di", under: "meno di",
  },
  fr: {
    connector: "et", home: "DOMICILE", away: "EXTÉRIEUR", homeLower: "domicile", awayLower: "extérieur",
    statisticalCore: "Noyau Statistique", matchAnalysis: "analyse du match", mainPrediction: "pronostic principal", publishedOdds: "cote publiée",
    teamNews: "actualités des équipes", projectedLineups: "compositions projetées", probableLineups: "compositions probables", expectedLineups: "compositions prévues", confirmedLineups: "compositions confirmées",
    gameState: "état du match", risk: "risque", sourceData: "données sources", sources: "sources", goals: "buts", corners: "coups de pied de coin", shots: "tirs", shotsOnTarget: "tirs cadrés",
    cleanSheets: "matchs sans encaisser", firstToScore: "premier à marquer", firstToConcede: "premier à encaisser", btts: "les deux équipes marquent", asianHandicap: "handicap asiatique",
    drawNoBet: "remboursé si nul", doubleChance: "double chance", combinedBet: "pari combiné", overUnder: "plus/moins de buts", over: "plus de", under: "moins de",
  },
  de: {
    connector: "und", home: "HEIM", away: "AUSWÄRTS", homeLower: "Heim", awayLower: "Auswärts",
    statisticalCore: "Statistischer Kern", matchAnalysis: "Spielanalyse", mainPrediction: "Hauptprognose", publishedOdds: "veröffentlichte Quote",
    teamNews: "Teamnachrichten", projectedLineups: "voraussichtliche Aufstellungen", probableLineups: "wahrscheinliche Aufstellungen", expectedLineups: "voraussichtliche Aufstellungen", confirmedLineups: "bestätigte Aufstellungen",
    gameState: "Spielzustand", risk: "Risiko", sourceData: "Quelldaten", sources: "Quellen", goals: "Tore", corners: "Ecken", shots: "Schüsse", shotsOnTarget: "Torschüsse",
    cleanSheets: "Spiele ohne Gegentor", firstToScore: "erstes Tor", firstToConcede: "erstes Gegentor", btts: "beide Teams treffen", asianHandicap: "asiatisches Handicap",
    drawNoBet: "Unentschieden ohne Wette", doubleChance: "doppelte Chance", combinedBet: "Kombiwette", overUnder: "Über/Unter Tore", over: "über", under: "unter",
  },
  nl: {
    connector: "en", home: "THUIS", away: "UIT", homeLower: "thuis", awayLower: "uit",
    statisticalCore: "Statistische Kern", matchAnalysis: "wedstrijdanalyse", mainPrediction: "hoofdvoorspelling", publishedOdds: "gepubliceerde odds",
    teamNews: "teamnieuws", projectedLineups: "verwachte opstellingen", probableLineups: "waarschijnlijke opstellingen", expectedLineups: "verwachte opstellingen", confirmedLineups: "bevestigde opstellingen",
    gameState: "wedstrijdverloop", risk: "risico", sourceData: "brongegevens", sources: "bronnen", goals: "doelpunten", corners: "hoekschoppen", shots: "schoten", shotsOnTarget: "schoten op doel",
    cleanSheets: "wedstrijden zonder tegendoelpunt", firstToScore: "eerste doelpunt", firstToConcede: "eerste tegendoelpunt", btts: "beide teams scoren", asianHandicap: "Aziatische handicap",
    drawNoBet: "gelijkspel zonder inzet", doubleChance: "dubbele kans", combinedBet: "combinatieweddenschap", overUnder: "meer/minder doelpunten", over: "meer dan", under: "minder dan",
  },
  tr: {
    connector: "ve", home: "İÇ SAHA", away: "DEPLASMAN", homeLower: "iç saha", awayLower: "deplasman",
    statisticalCore: "İstatistiksel Çekirdek", matchAnalysis: "maç analizi", mainPrediction: "ana tahmin", publishedOdds: "yayımlanan oran",
    teamNews: "takım haberleri", projectedLineups: "öngörülen kadrolar", probableLineups: "muhtemel kadrolar", expectedLineups: "beklenen kadrolar", confirmedLineups: "onaylanan kadrolar",
    gameState: "maç durumu", risk: "risk", sourceData: "kaynak veriler", sources: "kaynaklar", goals: "goller", corners: "kornerler", shots: "şutlar", shotsOnTarget: "isabetli şutlar",
    cleanSheets: "gol yemeden biten maçlar", firstToScore: "ilk golü atan", firstToConcede: "ilk golü yiyen", btts: "karşılıklı gol", asianHandicap: "Asya handikabı",
    drawNoBet: "beraberlikte iade", doubleChance: "çifte şans", combinedBet: "kombine bahis", overUnder: "alt/üst gol", over: "üst", under: "alt",
  },
};

function marketNumber(value: string, locale: SeoLocaleSlug) {
  if (locale === "nl" || locale === "tr") return value.replace(",", ".");
  return value.replace(".", ",");
}

function replaceMarketLine(text: string, locale: SeoLocaleSlug) {
  const copy = words[locale];
  let value = text;

  value = value.replace(/\b(Over|Under)\s+(\d+(?:[.,]\d+)?)\s+Goals?\b/gi, (_all, direction: string, line: string) =>
    `${direction.toLowerCase() === "over" ? copy.over : copy.under} ${marketNumber(line, locale)} ${copy.goals}`
  );
  value = value.replace(/\b(Over|Under)\s+(\d+(?:[.,]\d+)?)\s+Corners?\b/gi, (_all, direction: string, line: string) =>
    `${direction.toLowerCase() === "over" ? copy.over : copy.under} ${marketNumber(line, locale)} ${copy.corners}`
  );
  value = value.replace(/\b(Over|Under)\s+(\d+(?:[.,]\d+)?)\b/gi, (_all, direction: string, line: string) =>
    `${direction.toLowerCase() === "over" ? copy.over : copy.under} ${marketNumber(line, locale)}`
  );

  return value;
}

/**
 * Presentation-only localization for market/structural fragments. It never
 * mutates the source prediction record, which keeps Historical Freeze intact.
 */
export function localizePresentationText(text: string, locale: SeoLocaleSlug) {
  const copy = words[locale];
  const structural = {
    "pt-br": { analysis: "análise", lineups: "escalações", fixtures: "jogos", statistics: "estatísticas", kickoff: "início", standings: "classificação", unavailable: "indisponível", matchday: "Rodada", round: "Rodada", week: "Semana", quarterFinal: "quartas de final" },
    es: { analysis: "análisis", lineups: "alineaciones", fixtures: "partidos", statistics: "estadísticas", kickoff: "inicio", standings: "clasificación", unavailable: "no disponible", matchday: "Jornada", round: "Jornada", week: "Semana", quarterFinal: "cuartos de final" },
    it: { analysis: "analisi", lineups: "formazioni", fixtures: "partite", statistics: "statistiche", kickoff: "calcio d'inizio", standings: "classifica", unavailable: "non disponibile", matchday: "Giornata", round: "Turno", week: "Settimana", quarterFinal: "quarti di finale" },
    fr: { analysis: "analyse", lineups: "compositions", fixtures: "matchs", statistics: "statistiques", kickoff: "coup d'envoi", standings: "classement", unavailable: "indisponible", matchday: "Journée", round: "Tour", week: "Semaine", quarterFinal: "quarts de finale" },
    de: { analysis: "Analyse", lineups: "Aufstellungen", fixtures: "Spiele", statistics: "Statistiken", kickoff: "Anstoß", standings: "Tabelle", unavailable: "nicht verfügbar", matchday: "Spieltag", round: "Runde", week: "Woche", quarterFinal: "Viertelfinale" },
    nl: { analysis: "analyse", lineups: "opstellingen", fixtures: "wedstrijden", statistics: "statistieken", kickoff: "aftrap", standings: "stand", unavailable: "niet beschikbaar", matchday: "Speelronde", round: "Ronde", week: "Week", quarterFinal: "kwartfinales" },
    tr: { analysis: "analiz", lineups: "kadrolar", fixtures: "maçlar", statistics: "istatistikler", kickoff: "başlama", standings: "puan durumu", unavailable: "kullanılamıyor", matchday: "Hafta", round: "Tur", week: "Hafta", quarterFinal: "çeyrek final" },
  }[locale];
  let value = replaceMarketLine(text, locale);

  const replacements: Array<[RegExp, string]> = [
    [/\bPublished Odds\b/gi, copy.publishedOdds],
    [/\bMain Prediction\b/gi, copy.mainPrediction],
    [/\bStatistical Core(?: Predictions-Sports-Prime)?\b/gi, copy.statisticalCore],
    [/\bMatch Analysis\b/gi, copy.matchAnalysis],
    [/\bTeam News\b/gi, copy.teamNews],
    [/\bProjected Lineups?\b/gi, copy.projectedLineups],
    [/\bProbable Lineups?\b/gi, copy.probableLineups],
    [/\bExpected Lineups?\b/gi, copy.expectedLineups],
    [/\bConfirmed Lineups?\b/gi, copy.confirmedLineups],
    [/\bRegarding Game State\b/gi, copy.gameState],
    [/\bGame State\b/gi, copy.gameState],
    [/\bAsian Handicap\b/gi, copy.asianHandicap],
    [/\bDraw No Bet\b/gi, copy.drawNoBet],
    [/\bDouble Chance\b/gi, copy.doubleChance],
    [/\b(?:Combined Bet|Combi Bet|Combo Bet)\b/gi, copy.combinedBet],
    [/\bOver\s*\/\s*Under(?: Goals?)?\b/gi, copy.overUnder],
    [/\bBoth Teams to Score\b/gi, copy.btts],
    [/\bBTTS\b/g, copy.btts],
    [/\bClean Sheets?\b/gi, copy.cleanSheets],
    [/\bFirst to Score\b/gi, copy.firstToScore],
    [/\bFirst to Concede\b/gi, copy.firstToConcede],
    [/\bShots on Target\b/gi, copy.shotsOnTarget],
    [/\bShots\b/gi, copy.shots],
    [/\bCorners\b/gi, copy.corners],
    [/\bGoals\b/gi, copy.goals],
    [/\bSource Data\b/gi, copy.sourceData],
    [/\bSources\b/gi, copy.sources],
    [/\bQuarter[ -]finals?\b/gi, structural.quarterFinal],
    [/\bMatchday\s+(\d+)\b/gi, `${structural.matchday} $1`],
    [/\bRound\s+(\d+)\b/gi, `${structural.round} $1`],
    [/\bWeek\s+(\d+)\b/gi, `${structural.week} $1`],
    [/\bLineups?\b/gi, structural.lineups],
    [/\bFixtures?\b/gi, structural.fixtures],
    [/\bStatistics\b/gi, structural.statistics],
    [/\bKickoff\b/gi, structural.kickoff],
    [/\bStandings\b/gi, structural.standings],
    [/\bUnavailable\b/gi, structural.unavailable],
    [/\bAnalysis\b/gi, structural.analysis],
    [/\bHOME\b/g, copy.home],
    [/\bAWAY\b/g, copy.away],
    [/\bhome\b/gi, copy.homeLower],
    [/\baway\b/gi, copy.awayLower],
  ];

  for (const [pattern, translated] of replacements) value = value.replace(pattern, translated);
  return value;
}

export function localizePredictionText(text: string | undefined, locale: SeoLocaleSlug) {
  if (!text) return "";
  let value = localizePresentationText(text, locale);
  const copy = words[locale];

  // Common English market constructions that may survive in immutable source picks.
  value = value.replace(/^(.+?)\s+to win$/i, (_all, team: string) => {
    if (locale === "pt-br") return `${team} vence`;
    if (locale === "es") return `${team} gana`;
    if (locale === "it") return `${team} vincente`;
    if (locale === "fr") return `victoire de ${team}`;
    if (locale === "de") return `Sieg von ${team}`;
    if (locale === "nl") return `${team} wint`;
    return `${team} kazanır`;
  });
  value = value.replace(/\s+and\s+/gi, ` ${copy.connector} `);
  value = value.replace(/\s*&\s*/g, ` ${copy.connector} `);
  return value;
}

export function localizeRoundText(round: string, locale: SeoLocaleSlug): string {
  const matchday = round.match(/^(?:Matchday|Week|Round)\s+(\d+)$/i);
  if (matchday) {
    const prefix = {
      "pt-br": "Rodada", es: "Jornada", it: "Giornata", fr: "Journée", de: "Spieltag", nl: "Speelronde", tr: "Hafta",
    }[locale];
    return `${prefix} ${matchday[1]}`;
  }

  const exact: Array<[RegExp, Record<SeoLocaleSlug, string>]> = [
    [/^Quarter-finals?$/i, { "pt-br": "Quartas de final", es: "Cuartos de final", it: "Quarti di finale", fr: "Quarts de finale", de: "Viertelfinale", nl: "Kwartfinales", tr: "Çeyrek final" }],
    [/^Semi-finals?$/i, { "pt-br": "Semifinais", es: "Semifinales", it: "Semifinali", fr: "Demi-finales", de: "Halbfinale", nl: "Halve finales", tr: "Yarı final" }],
    [/^Final$/i, { "pt-br": "Final", es: "Final", it: "Finale", fr: "Finale", de: "Finale", nl: "Finale", tr: "Final" }],
    [/^Round of 16$/i, { "pt-br": "Oitavas de final", es: "Octavos de final", it: "Ottavi di finale", fr: "Huitièmes de finale", de: "Achtelfinale", nl: "Achtste finales", tr: "Son 16" }],
  ];
  for (const [pattern, translated] of exact) if (pattern.test(round)) return translated[locale];

  const leg = round.match(/^(.*?)(?:\s+[—-]\s+|\s+)(First|Second) Leg$/i);
  if (leg) {
    const stage: string = localizeRoundText(leg[1].trim(), locale);
    const legLabel = leg[2].toLowerCase() === "first"
      ? { "pt-br": "jogo de ida", es: "partido de ida", it: "andata", fr: "match aller", de: "Hinspiel", nl: "heenwedstrijd", tr: "ilk maç" }[locale]
      : { "pt-br": "jogo de volta", es: "partido de vuelta", it: "ritorno", fr: "match retour", de: "Rückspiel", nl: "terugwedstrijd", tr: "rövanş" }[locale];
    return `${stage} — ${legLabel}`;
  }

  return localizePresentationText(round, locale);
}

function sourceDescription(locale: SeoLocaleSlug) {
  return {
    "pt-br": "As fontes registradas nesta página sustentam os dados factuais utilizados na análise e permanecem vinculadas ao registro editorial original.",
    es: "Las fuentes registradas en esta página respaldan los datos factuales utilizados en el análisis y permanecen vinculadas al registro editorial original.",
    it: "Le fonti registrate in questa pagina sostengono i dati fattuali utilizzati nell'analisi e restano collegate al registro editoriale originale.",
    fr: "Les sources enregistrées sur cette page étayent les données factuelles utilisées dans l'analyse et restent liées au dossier éditorial d'origine.",
    de: "Die auf dieser Seite hinterlegten Quellen stützen die in der Analyse verwendeten Fakten und bleiben mit dem ursprünglichen redaktionellen Datensatz verknüpft.",
    nl: "De op deze pagina geregistreerde bronnen onderbouwen de feitelijke gegevens in de analyse en blijven gekoppeld aan het oorspronkelijke redactionele dossier.",
    tr: "Bu sayfada kayıtlı kaynaklar analizde kullanılan olgusal verileri destekler ve özgün editoryal kayıtla bağlantılı kalır.",
  }[locale];
}

function automaticParagraphs(match: Match, locale: SeoLocaleSlug, prediction: string) {
  const league = leaguesBySlug[match.league]?.name ?? match.league;
  const venue = match.venue && match.venue !== "TBD" ? match.venue : undefined;
  const odds = match.predictions.find((item) => item.label === "Published Odds" || item.label === "Odds")?.value;
  const preMatch = isUpcomingMatch(match);
  const stats = Boolean(match.matchSeo?.statistics) || /Statistical Core/i.test(match.analysis.join("\n"));
  const lineups = Boolean(match.matchSeo?.lineups);
  const availability = Boolean(match.matchSeo?.availability || match.matchSeo?.teamNews);
  const round = localizeRoundText(match.round, locale);

  if (locale === "pt-br") return preMatch ? [
    `${match.homeTeam} x ${match.awayTeam} é um confronto da ${league}, ${round}${venue ? `, com partida prevista em ${venue}` : ""}. Esta versão localizada preserva os dados do registro original e organiza a leitura sem alterar o conteúdo-fonte da previsão.`,
    `O palpite principal é ${prediction || "apresentado no registro da partida"}${odds ? `, com odd publicada de ${odds}` : ""}. A cotação histórica, quando existente, permanece imutável e não é substituída por preços posteriores.`,
    `A análise considera o contexto competitivo, o desempenho como mandante e visitante e os fatores diretamente ligados ao mercado escolhido.${stats ? " Os indicadores estatísticos disponíveis são apresentados no módulo localizado desta página." : " Quando uma métrica não está disponível de forma verificável, ela não é criada nem estimada."}`,
    `${lineups ? "As escalações disponíveis são exibidas como confirmadas ou projetadas conforme o status registrado." : "Não há uma escalação verificável disponível para ser apresentada como fato nesta versão."} ${availability ? "Informações de disponibilidade do elenco são mostradas apenas quando há suporte nas fontes registradas." : "Ausências e notícias de elenco não são inferidas sem fonte."}`,
    `O principal risco é a incerteza natural de uma análise pré-jogo: amostras curtas, mudanças de contexto e informações próximas ao início podem alterar a leitura. Esses fatores são tratados como limitações, não como garantias de acerto.`,
    `Conclusão: ${prediction || "consulte o palpite principal registrado"}${odds ? `, odd publicada ${odds}` : ""}. Esta é uma opinião editorial anterior ao jogo e deve ser interpretada junto das fontes e limitações exibidas na página.`,
  ] : [
    `${match.homeTeam} x ${match.awayTeam} integra o arquivo da ${league}, ${round}. O registro editorial original permanece congelado; esta apresentação localizada não reescreve a análise histórica nem usa informações posteriores para reconstruir a justificativa pré-jogo.`,
    `O palpite arquivado é ${prediction || "o que consta no registro original"}${odds ? `, com odd publicada de ${odds}` : ""}. Palpite, preço e resultado histórico são tratados como dados imutáveis, salvo correção técnica explicitamente autorizada.`,
    `Os módulos factuais exibem apenas informações já registradas ou derivadas do ciclo objetivo do resultado. Nenhuma estatística, escalação, ausência ou fonte é acrescentada retroativamente para fazer o conteúdo histórico parecer mais completo.`,
    `A separação entre apresentação localizada e fonte histórica preserva a integridade do arquivo: o texto original não é traduzido nem alterado no arquivo de previsão, enquanto a interface evita expor trechos em inglês nesta rota.`,
    `O resultado final, quando disponível, serve apenas para o histórico e para a liquidação do palpite. Ele não altera a previsão nem a lógica que existiam antes do início da partida.`,
    `Registro preservado: ${prediction || "palpite original"}${odds ? `, odd publicada ${odds}` : ""}. Consulte as fontes vinculadas para os dados factuais mantidos no arquivo.`,
  ];

  if (locale === "es") return preMatch ? [
    `${match.homeTeam} vs ${match.awayTeam} es un partido de ${league}, ${round}${venue ? `, previsto en ${venue}` : ""}. Esta versión localizada conserva los datos del registro original y organiza la lectura sin modificar la fuente de la predicción.`,
    `El pronóstico principal es ${prediction || "el registrado para el partido"}${odds ? `, con cuota publicada de ${odds}` : ""}. La cuota histórica, cuando existe, se mantiene inmutable y no se sustituye por precios posteriores.`,
    `El análisis considera el contexto competitivo, el rendimiento como local y visitante y los factores ligados al mercado elegido.${stats ? " Los indicadores estadísticos disponibles aparecen en el módulo localizado de esta página." : " Si una métrica no está disponible de forma verificable, no se inventa ni se estima."}`,
    `${lineups ? "Las alineaciones disponibles se muestran como confirmadas o proyectadas según el estado registrado." : "No hay una alineación verificable para presentarla como un hecho en esta versión."} ${availability ? "La información de disponibilidad se muestra solo cuando está respaldada por las fuentes registradas." : "No se infieren bajas ni noticias de plantilla sin fuente."}`,
    `El principal riesgo es la incertidumbre propia del análisis previo al partido: muestras pequeñas, cambios de contexto e información cercana al inicio pueden modificar la lectura. Se presentan como limitaciones, no como garantías.`,
    `Conclusión: ${prediction || "consulta el pronóstico principal registrado"}${odds ? `, cuota publicada ${odds}` : ""}. Es una opinión editorial previa al partido y debe leerse junto con las fuentes y limitaciones de la página.`,
  ] : [
    `${match.homeTeam} vs ${match.awayTeam} forma parte del archivo de ${league}, ${round}. El registro editorial original permanece congelado; esta presentación localizada no reescribe el análisis histórico ni usa información posterior para reconstruir la justificación previa.`,
    `El pronóstico archivado es ${prediction || "el del registro original"}${odds ? `, con cuota publicada de ${odds}` : ""}. Pronóstico, precio y resultado histórico se tratan como datos inmutables salvo una corrección técnica expresamente autorizada.`,
    `Los módulos factuales muestran únicamente información ya registrada o derivada del ciclo objetivo del resultado. No se añaden retrospectivamente estadísticas, alineaciones, bajas ni fuentes para completar artificialmente el histórico.`,
    `La separación entre presentación localizada y fuente histórica preserva la integridad del archivo: el texto original no se traduce ni se altera dentro del archivo de predicción, mientras la interfaz evita exponer fragmentos en inglés en esta ruta.`,
    `El resultado final, cuando está disponible, solo sirve para el historial y la liquidación del pronóstico. No modifica la predicción ni el razonamiento que existían antes del inicio.`,
    `Registro preservado: ${prediction || "pronóstico original"}${odds ? `, cuota publicada ${odds}` : ""}. Consulta las fuentes vinculadas para los datos factuales conservados.`,
  ];

  if (locale === "it") return preMatch ? [
    `${match.homeTeam} vs ${match.awayTeam} è una partita di ${league}, ${round}${venue ? `, prevista a ${venue}` : ""}. Questa versione localizzata conserva i dati del registro originale e organizza la lettura senza modificare la fonte del pronostico.`,
    `Il pronostico principale è ${prediction || "quello registrato per la partita"}${odds ? `, con quota pubblicata di ${odds}` : ""}. La quota storica, quando presente, resta immutabile e non viene sostituita da prezzi successivi.`,
    `L'analisi considera il contesto competitivo, il rendimento in casa e in trasferta e i fattori direttamente collegati al mercato scelto.${stats ? " Gli indicatori statistici disponibili sono mostrati nel modulo localizzato della pagina." : " Se una metrica non è verificabile, non viene inventata né stimata."}`,
    `${lineups ? "Le formazioni disponibili sono indicate come confermate o previste in base allo stato registrato." : "Non è disponibile una formazione verificabile da presentare come fatto in questa versione."} ${availability ? "Le informazioni sulla disponibilità vengono mostrate solo quando sostenute dalle fonti registrate." : "Assenze e notizie sulla rosa non vengono dedotte senza fonte."}`,
    `Il rischio principale è l'incertezza naturale di un'analisi pre-partita: campioni ridotti, cambi di contesto e informazioni vicine al calcio d'inizio possono modificare la lettura. Sono limiti, non garanzie.`,
    `Conclusione: ${prediction || "consulta il pronostico principale registrato"}${odds ? `, quota pubblicata ${odds}` : ""}. È un giudizio editoriale precedente alla partita e va letto insieme alle fonti e ai limiti indicati.`,
  ] : [
    `${match.homeTeam} vs ${match.awayTeam} appartiene all'archivio di ${league}, ${round}. Il registro editoriale originale resta congelato; questa presentazione localizzata non riscrive l'analisi storica e non usa dati successivi per ricostruire la motivazione pre-partita.`,
    `Il pronostico archiviato è ${prediction || "quello del registro originale"}${odds ? `, con quota pubblicata di ${odds}` : ""}. Pronostico, prezzo e risultato storico sono trattati come dati immutabili salvo una correzione tecnica esplicitamente autorizzata.`,
    `I moduli fattuali mostrano solo informazioni già registrate o derivate dal ciclo oggettivo del risultato. Statistiche, formazioni, assenze o fonti non vengono aggiunte retroattivamente per rendere l'archivio artificialmente più completo.`,
    `La separazione tra presentazione localizzata e fonte storica preserva l'integrità dell'archivio: il testo originale non viene tradotto né modificato nel file della previsione, mentre l'interfaccia evita frammenti in inglese in questa rotta.`,
    `Il risultato finale, quando disponibile, serve esclusivamente allo storico e alla liquidazione del pronostico. Non modifica la previsione né il ragionamento esistente prima del calcio d'inizio.`,
    `Registro preservato: ${prediction || "pronostico originale"}${odds ? `, quota pubblicata ${odds}` : ""}. Consulta le fonti collegate per i dati fattuali conservati.`,
  ];

  if (locale === "fr") return preMatch ? [
    `${match.homeTeam} vs ${match.awayTeam} est une rencontre de ${league}, ${round}${venue ? `, prévue à ${venue}` : ""}. Cette version localisée conserve les données du dossier d'origine et organise la lecture sans modifier la source du pronostic.`,
    `Le pronostic principal est ${prediction || "celui enregistré pour le match"}${odds ? `, avec une cote publiée de ${odds}` : ""}. La cote historique, lorsqu'elle existe, reste immuable et n'est pas remplacée par un prix ultérieur.`,
    `L'analyse tient compte du contexte de la compétition, des performances à domicile et à l'extérieur et des facteurs liés au marché choisi.${stats ? " Les indicateurs statistiques disponibles figurent dans le module localisé de cette page." : " Une donnée indisponible ou non vérifiable n'est ni inventée ni estimée."}`,
    `${lineups ? "Les compositions disponibles sont indiquées comme confirmées ou projetées selon leur statut enregistré." : "Aucune composition vérifiable n'est disponible pour être présentée comme un fait dans cette version."} ${availability ? "Les informations de disponibilité ne sont affichées que lorsqu'elles sont étayées par les sources enregistrées." : "Aucune absence ni information d'effectif n'est déduite sans source."}`,
    `Le risque principal tient à l'incertitude propre à l'avant-match : petits échantillons, changement de contexte et informations proches du coup d'envoi peuvent modifier la lecture. Ce sont des limites, pas des garanties.`,
    `Conclusion : ${prediction || "consultez le pronostic principal enregistré"}${odds ? `, cote publiée ${odds}` : ""}. Il s'agit d'un avis éditorial d'avant-match à lire avec les sources et limites affichées.`,
  ] : [
    `${match.homeTeam} vs ${match.awayTeam} appartient aux archives de ${league}, ${round}. Le dossier éditorial d'origine reste gelé ; cette présentation localisée ne réécrit pas l'analyse historique et n'utilise pas d'informations postérieures pour reconstruire la justification d'avant-match.`,
    `Le pronostic archivé est ${prediction || "celui du dossier d'origine"}${odds ? `, avec une cote publiée de ${odds}` : ""}. Pronostic, prix et résultat historique sont traités comme des données immuables, sauf correction technique explicitement autorisée.`,
    `Les modules factuels n'affichent que les informations déjà enregistrées ou issues du cycle objectif du résultat. Aucune statistique, composition, absence ou source n'est ajoutée rétroactivement pour compléter artificiellement l'historique.`,
    `La séparation entre présentation localisée et source historique préserve l'intégrité de l'archive : le texte original n'est ni traduit ni modifié dans le fichier de prédiction, tandis que l'interface évite d'exposer des fragments en anglais sur cette route.`,
    `Le résultat final, lorsqu'il est disponible, sert uniquement à l'historique et au règlement du pronostic. Il ne modifie ni la prévision ni le raisonnement qui existaient avant le coup d'envoi.`,
    `Dossier préservé : ${prediction || "pronostic original"}${odds ? `, cote publiée ${odds}` : ""}. Consultez les sources liées pour les données factuelles conservées.`,
  ];

  if (locale === "de") return preMatch ? [
    `${match.homeTeam} gegen ${match.awayTeam} ist eine Partie der ${league}, ${round}${venue ? `, angesetzt im ${venue}` : ""}. Diese lokalisierte Darstellung bewahrt die Daten des ursprünglichen Datensatzes und ordnet die Lektüre, ohne die Quelle der Prognose zu verändern.`,
    `Die Hauptprognose lautet ${prediction || "wie im Spieldatensatz vermerkt"}${odds ? `, bei einer veröffentlichten Quote von ${odds}` : ""}. Eine historische Quote bleibt unverändert und wird nicht durch spätere Marktpreise ersetzt.`,
    `Die Analyse berücksichtigt Wettbewerbskontext, Heim- und Auswärtsleistung sowie die Faktoren, die direkt mit dem gewählten Markt verbunden sind.${stats ? " Verfügbare statistische Kennzahlen erscheinen im lokalisierten Modul dieser Seite." : " Nicht verifizierbare Kennzahlen werden weder erfunden noch geschätzt."}`,
    `${lineups ? "Verfügbare Aufstellungen werden entsprechend ihrem gespeicherten Status als bestätigt oder voraussichtlich gekennzeichnet." : "Es liegt keine verifizierbare Aufstellung vor, die in dieser Version als Fakt dargestellt werden könnte."} ${availability ? "Kaderinformationen werden nur angezeigt, wenn sie durch registrierte Quellen gestützt sind." : "Ausfälle und Teamnachrichten werden ohne Quelle nicht abgeleitet."}`,
    `Das Hauptrisiko ist die natürliche Unsicherheit einer Vorabanalyse: kleine Stichproben, Kontextänderungen und Informationen kurz vor dem Anstoß können die Bewertung verändern. Sie gelten als Einschränkungen, nicht als Garantien.`,
    `Fazit: ${prediction || "siehe gespeicherte Hauptprognose"}${odds ? `, veröffentlichte Quote ${odds}` : ""}. Es handelt sich um eine redaktionelle Einschätzung vor dem Spiel, die zusammen mit Quellen und Einschränkungen gelesen werden sollte.`,
  ] : [
    `${match.homeTeam} gegen ${match.awayTeam} gehört zum Archiv der ${league}, ${round}. Der ursprüngliche redaktionelle Datensatz bleibt eingefroren; diese lokalisierte Darstellung schreibt die historische Analyse nicht um und nutzt keine späteren Informationen zur Rekonstruktion der Vorabbegründung.`,
    `Die archivierte Prognose lautet ${prediction || "wie im ursprünglichen Datensatz"}${odds ? `, bei einer veröffentlichten Quote von ${odds}` : ""}. Prognose, Preis und historisches Ergebnis gelten als unveränderliche Daten, sofern keine ausdrücklich autorisierte technische Korrektur vorliegt.`,
    `Faktische Module zeigen nur bereits gespeicherte Informationen oder Daten aus dem objektiven Ergebniszyklus. Statistiken, Aufstellungen, Ausfälle oder Quellen werden nicht rückwirkend ergänzt, um das Archiv künstlich zu vervollständigen.`,
    `Die Trennung zwischen lokalisierter Darstellung und historischer Quelle schützt die Archivintegrität: Der Originaltext wird in der Prognosedatei weder übersetzt noch verändert, während die Oberfläche auf dieser Route englische Fragmente vermeidet.`,
    `Das Endergebnis dient, sofern vorhanden, ausschließlich dem Verlauf und der Abrechnung der Prognose. Es verändert weder die Auswahl noch die Begründung, die vor dem Anstoß bestanden.`,
    `Datensatz bewahrt: ${prediction || "ursprüngliche Prognose"}${odds ? `, veröffentlichte Quote ${odds}` : ""}. Die verknüpften Quellen enthalten die erhaltenen Faktendaten.`,
  ];

  if (locale === "nl") return preMatch ? [
    `${match.homeTeam} vs ${match.awayTeam} is een wedstrijd in de ${league}, ${round}${venue ? `, gepland in ${venue}` : ""}. Deze gelokaliseerde versie bewaart de gegevens van het oorspronkelijke dossier en ordent de analyse zonder de bronvoorspelling te wijzigen.`,
    `De hoofdvoorspelling is ${prediction || "zoals in het wedstrijddossier vastgelegd"}${odds ? `, met gepubliceerde odds van ${odds}` : ""}. Historische odds blijven ongewijzigd en worden niet vervangen door latere marktprijzen.`,
    `De analyse houdt rekening met competitiecontext, thuis- en uitprestaties en factoren die rechtstreeks bij de gekozen markt horen.${stats ? " Beschikbare statistische indicatoren staan in de gelokaliseerde module op deze pagina." : " Niet-verifieerbare statistieken worden niet verzonnen of geschat."}`,
    `${lineups ? "Beschikbare opstellingen worden als bevestigd of verwacht weergegeven volgens de geregistreerde status." : "Er is geen verifieerbare opstelling beschikbaar om in deze versie als feit te tonen."} ${availability ? "Informatie over beschikbaarheid wordt alleen getoond wanneer geregistreerde bronnen die ondersteunen." : "Afwezigen en teamnieuws worden niet zonder bron afgeleid."}`,
    `Het belangrijkste risico is de normale onzekerheid van een analyse vóór de wedstrijd: kleine steekproeven, contextwijzigingen en informatie vlak voor de aftrap kunnen de beoordeling veranderen. Dit zijn beperkingen, geen garanties.`,
    `Conclusie: ${prediction || "bekijk de geregistreerde hoofdvoorspelling"}${odds ? `, gepubliceerde odds ${odds}` : ""}. Dit is een redactionele beoordeling van vóór de wedstrijd en moet samen met de bronnen en beperkingen worden gelezen.`,
  ] : [
    `${match.homeTeam} vs ${match.awayTeam} behoort tot het archief van de ${league}, ${round}. Het oorspronkelijke redactionele dossier blijft bevroren; deze gelokaliseerde presentatie herschrijft de historische analyse niet en gebruikt geen latere informatie om de voorbeschouwing te reconstrueren.`,
    `De gearchiveerde voorspelling is ${prediction || "zoals in het oorspronkelijke dossier"}${odds ? `, met gepubliceerde odds van ${odds}` : ""}. Voorspelling, prijs en historisch resultaat gelden als onveranderlijke gegevens, behalve bij een uitdrukkelijk toegestane technische correctie.`,
    `Feitelijke modules tonen alleen al geregistreerde informatie of gegevens uit de objectieve resultaatcyclus. Statistieken, opstellingen, afwezigen of bronnen worden niet achteraf toegevoegd om het archief kunstmatig vollediger te maken.`,
    `De scheiding tussen gelokaliseerde presentatie en historische bron beschermt de archiefintegriteit: de oorspronkelijke tekst wordt in het voorspellingsbestand niet vertaald of gewijzigd, terwijl de interface op deze route geen Engelse tekstfragmenten toont.`,
    `Het eindresultaat dient, indien beschikbaar, alleen voor de geschiedenis en de afwikkeling van de voorspelling. Het verandert de keuze of de redenering van vóór de aftrap niet.`,
    `Dossier bewaard: ${prediction || "oorspronkelijke voorspelling"}${odds ? `, gepubliceerde odds ${odds}` : ""}. Raadpleeg de gekoppelde bronnen voor de bewaarde feitelijke gegevens.`,
  ];

  return preMatch ? [
    `${match.homeTeam} vs ${match.awayTeam}, ${league} kapsamında ${round}${venue ? ` ve ${venue} sahasında planlanan` : " kapsamında oynanacak"} bir karşılaşmadır. Bu yerelleştirilmiş sürüm özgün kayıttaki verileri korur ve tahmin kaynağını değiştirmeden sunumu düzenler.`,
    `Ana tahmin ${prediction || "maç kaydında belirtilen seçimdir"}${odds ? `; yayımlanan oran ${odds}` : ""}. Tarihsel oran varsa değişmez ve daha sonraki piyasa fiyatlarıyla değiştirilmez.`,
    `Analiz; rekabet bağlamını, iç saha ve deplasman performansını ve seçilen pazarla doğrudan ilişkili unsurları dikkate alır.${stats ? " Mevcut istatistiksel göstergeler bu sayfanın yerelleştirilmiş modülünde gösterilir." : " Doğrulanamayan bir metrik uydurulmaz veya tahmin edilmez."}`,
    `${lineups ? "Mevcut kadrolar kayıtlı durumlarına göre onaylanmış veya öngörülen olarak gösterilir." : "Bu sürümde olgu olarak sunulabilecek doğrulanmış bir kadro bulunmuyor."} ${availability ? "Kadro uygunluğu yalnızca kayıtlı kaynaklarla desteklendiğinde gösterilir." : "Eksikler ve takım haberleri kaynaksız çıkarılmaz."}`,
    `Başlıca risk maç öncesi analizin doğal belirsizliğidir: küçük örneklemler, bağlam değişiklikleri ve başlama saatine yakın bilgiler değerlendirmeyi değiştirebilir. Bunlar sınırlamadır, garanti değildir.`,
    `Sonuç: ${prediction || "kayıtlı ana tahmine bakın"}${odds ? `, yayımlanan oran ${odds}` : ""}. Bu, maç öncesi editoryal bir değerlendirmedir ve sayfadaki kaynaklar ile sınırlamalarla birlikte okunmalıdır.`,
  ] : [
    `${match.homeTeam} vs ${match.awayTeam}, ${league} arşivinde ${round} kaydıdır. Özgün editoryal kayıt dondurulmuş olarak kalır; bu yerelleştirilmiş sunum tarihsel analizi yeniden yazmaz ve maç sonrası bilgileri maç öncesi gerekçeyi yeniden kurmak için kullanmaz.`,
    `Arşivlenen tahmin ${prediction || "özgün kayıttaki seçimdir"}${odds ? `; yayımlanan oran ${odds}` : ""}. Tahmin, fiyat ve tarihsel sonuç açıkça izin verilen teknik bir düzeltme dışında değişmez veri olarak ele alınır.`,
    `Olgusal modüller yalnızca daha önce kayıtlı bilgileri veya nesnel sonuç döngüsünden gelen verileri gösterir. Arşivi yapay olarak tamamlamak için istatistik, kadro, eksik veya kaynak sonradan eklenmez.`,
    `Yerelleştirilmiş sunum ile tarihsel kaynağın ayrılması arşiv bütünlüğünü korur: özgün metin tahmin dosyasında çevrilmez veya değiştirilmez; arayüz ise bu rotada İngilizce metin parçaları göstermemeyi amaçlar.`,
    `Nihai skor mevcutsa yalnızca tarihçe ve tahmin sonucunun hesaplanması için kullanılır. Maç öncesinde var olan seçimi veya gerekçeyi değiştirmez.`,
    `Kayıt korundu: ${prediction || "özgün tahmin"}${odds ? `, yayımlanan oran ${odds}` : ""}. Korunan olgusal veriler için bağlantılı kaynaklara bakın.`,
  ];
}

export function getAutomaticLocalizedPresentation(match: Match, locale: SeoLocaleSlug): LocalizedPresentation {
  const storedPrediction = match.predictions.find((item) => item.label === "Main Prediction")?.value;
  const mainPrediction = localizePredictionText(storedPrediction, locale);
  return {
    analysis: automaticParagraphs(match, locale, mainPrediction),
    mainPrediction,
    sourceDescription: sourceDescription(locale),
  };
}

const englishResiduePatterns = [
  /\b(?:Main Prediction|Published Odds|Match Analysis|Statistical Core|Team News|Projected Lineups?|Probable Lineups?|Expected Lineups?|Confirmed Lineups?|Game State|Asian Handicap|Draw No Bet|Combined Bet|Combi Bet|Combo Bet|Over\/Under(?: Goals?)?|Both Teams to Score|Clean Sheets?|First to Score|First to Concede|Shots on Target|Second Leg|First Leg|Quarter-finals?|Semi-finals?|Round of 16)\b/i,
  /\b(?:Over|Under)\s+\d+(?:[.,]\d+)?\s+(?:Goals?|Corners?)\b/i,
];

export function containsStructuralEnglishResidue(text: string) {
  return englishResiduePatterns.some((pattern) => pattern.test(text));
}

export function sanitizeLocalizedAnalysis(
  analysis: readonly string[],
  match: Match,
  locale: SeoLocaleSlug
) {
  const fallback = getAutomaticLocalizedPresentation(match, locale).analysis;
  return analysis.map((paragraph, index) => {
    const localized = localizePresentationText(paragraph, locale);
    return containsStructuralEnglishResidue(localized)
      ? (fallback[index % fallback.length] ?? localized)
      : localized;
  });
}

export function localizedSourceDescription(locale: SeoLocaleSlug) {
  return sourceDescription(locale);
}
