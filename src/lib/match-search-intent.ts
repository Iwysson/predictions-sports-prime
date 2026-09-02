import { leaguesBySlug } from "@/data/leagues";
import { localTodayISO, resolveHomeTemporalBucket } from "@/lib/match-feed";
import { isFutureFixture } from "@/lib/fixture-state";
import { detectPickMarkets, normalizeMainPick } from "@/lib/match-market";
import {
  getTeamSearchAliases,
  localeSearchResearch,
  searchIntentLocales,
  type SearchIntentCategory,
  type SearchLocale,
} from "@/lib/search-intent-research";
import { siteConfig } from "@/lib/site-config";
import { extractStatisticalCoreRows } from "@/lib/statistical-core";
import type { Match } from "@/types";

export { localeSearchResearch, searchIntentLocales } from "@/lib/search-intent-research";
export type { SearchIntentCategory, SearchLocale } from "@/lib/search-intent-research";

export type MatchTemporalState = "today" | "tomorrow" | "upcoming" | "historical";

export type MatchSearchIntent = {
  locale: SearchLocale;
  categories: SearchIntentCategory[];
  primaryQuery: string;
  alternateMatchQueries: string[];
  predictionQueries: string[];
  bettingQueries: string[];
  oddsQueries: string[];
  analysisQueries: string[];
  marketQueries: string[];
  statisticalQueries: string[];
  temporalQueries: string[];
  competitionQueries: string[];
  secondaryQueries: string[];
  temporalState: MatchTemporalState | null;
};

const peopleFirstLegacyMatchSlugs = new Set([
  "newcastle-united-vs-west-bromwich-albion",
  "palmeiras-vs-santos",
  "real-madrid-vs-real-sociedad",
  "tottenham-hotspur-vs-charlton-athletic",
  "vasco-da-gama-vs-vitoria",
]);

type MatchIntentFacts = {
  leagueName: string;
  mainPick: string;
  odds: string;
  hasAnalysis: boolean;
  hasStatistics: boolean;
  hasForm: boolean;
  hasH2h: boolean;
  hasStandingsContext: boolean;
  hasLineups: boolean;
  hasAvailability: boolean;
  hasTeamNews: boolean;
  hasWeather: boolean;
  hasInjuries: boolean;
  hasSuspensions: boolean;
  hasCorners: boolean;
  hasGoals: boolean;
  hasVenue: boolean;
  hasKickOff: boolean;
  hasBroadcastInfo: boolean;
};

type TodaySeoLocale = "en" | "pt-BR" | "es" | "it" | "fr" | "de";
type TodaySeoIntent = "stats" | "odds" | "goals" | "corners" | "handicap" | "xg" | "shots" | "btts" | "recentMeeting" | "secondLeg" | "aggregate" | "competition";

type TodaySeoProfile = {
  teams: [string, string];
  titleIntents: TodaySeoIntent[];
  descriptionIntents: TodaySeoIntent[];
  focus?: Partial<Record<TodaySeoLocale, string>>;
};

/**
 * Hand-tuned profiles only apply while the fixture is genuinely in the
 * current today/tomorrow pre-match window. This prevents stale temporal SEO
 * from surviving after kickoff.
 */
type RestrictedSearchIntentFixtureInput = Pick<Match, "date" | "status">
  & Partial<Pick<Match, "slug" | "fixtureStatus" | "kickoffUtc" | "time" | "timeConfirmed">>;

export function isRestrictedSearchIntentFixture(match: RestrictedSearchIntentFixtureInput) {
  if (match.status !== "published" || !match.slug || !todaySeoProfiles[match.slug]) return false;
  if (!isFutureFixture({
    fixtureStatus: match.fixtureStatus,
    kickoffUtc: match.kickoffUtc,
    date: match.date,
    time: match.time,
    timeConfirmed: match.timeConfirmed,
  })) return false;
  const temporal = resolveHomeTemporalBucket(match as Match, localTodayISO());
  return temporal === "today" || temporal === "tomorrow";
}

const todaySeoProfiles: Record<string, TodaySeoProfile> = {
  "lincoln-city-vs-blackburn-rovers": {
    teams: ["Lincoln City", "Blackburn"], titleIntents: ["stats"], descriptionIntents: ["stats", "odds", "goals", "corners"],
  },
  "portsmouth-vs-derby-county": {
    teams: ["Portsmouth", "Derby County"], titleIntents: ["stats"], descriptionIntents: ["stats", "odds", "goals"],
    focus: { en: "Portsmouth double chance and Under 3.5 Goals", "pt-BR": "Portsmouth ou empate e menos de 3,5 gols", es: "Portsmouth o empate y menos de 3,5 goles", it: "Portsmouth o pareggio e meno di 3,5 gol", fr: "Portsmouth ou nul et moins de 3,5 buts", de: "Portsmouth oder Unentschieden und unter 3,5 Tore" },
  },
  "preston-north-end-vs-bristol-city": {
    teams: ["Preston", "Bristol City"], titleIntents: ["corners", "stats"], descriptionIntents: ["corners", "stats", "odds"],
    focus: { en: "Under 3.5 Goals and Over 8.5 Corners", "pt-BR": "menos de 3,5 gols e mais de 8,5 escanteios", es: "menos de 3,5 goles y más de 8,5 córners", it: "meno di 3,5 gol e più di 8,5 calci d'angolo", fr: "moins de 3,5 buts et plus de 8,5 corners", de: "unter 3,5 Tore und über 8,5 Ecken" },
  },
  "sheffield-united-vs-bolton-wanderers": {
    teams: ["Sheffield United", "Bolton"], titleIntents: ["handicap", "corners"], descriptionIntents: ["handicap", "corners", "stats", "odds"],
    focus: { en: "Bolton +2 Asian Handicap and Over 8.5 Corners", "pt-BR": "Bolton +2 no handicap asiático e mais de 8,5 escanteios", es: "Bolton +2 en hándicap asiático y más de 8,5 córners", it: "Bolton +2 con handicap asiatico e più di 8,5 calci d'angolo", fr: "Bolton +2 avec handicap asiatique et plus de 8,5 corners", de: "Bolton +2 Asian Handicap und über 8,5 Ecken" },
  },
  "swansea-city-vs-watford": {
    teams: ["Swansea City", "Watford"], titleIntents: ["stats"], descriptionIntents: ["stats", "odds"],
    focus: { en: "Over 2.5 Goals", "pt-BR": "mais de 2,5 gols", es: "más de 2,5 goles", it: "più di 2,5 gol", fr: "plus de 2,5 buts", de: "über 2,5 Tore" },
  },
  "west-ham-united-vs-wolverhampton-wanderers": {
    teams: ["West Ham", "Wolves"], titleIntents: ["stats", "odds"], descriptionIntents: ["stats", "odds", "goals"],
    focus: { en: "West Ham double chance and Over 1.5 Goals", "pt-BR": "West Ham ou empate e mais de 1,5 gols", es: "West Ham o empate y más de 1,5 goles", it: "West Ham o pareggio e più di 1,5 gol", fr: "West Ham ou nul et plus de 1,5 but", de: "West Ham oder Unentschieden und über 1,5 Tore" },
  },
  "birmingham-city-vs-southampton": {
    teams: ["Birmingham City", "Southampton"], titleIntents: ["stats"], descriptionIntents: ["stats", "odds", "goals"],
    focus: { en: "Birmingham double chance and Over 1.5 Goals", "pt-BR": "Birmingham ou empate e mais de 1,5 gols", es: "Birmingham o empate y más de 1,5 goles", it: "Birmingham o pareggio e più di 1,5 gol", fr: "Birmingham ou nul et plus de 1,5 but", de: "Birmingham oder Unentschieden und über 1,5 Tore" },
  },
  "stoke-city-vs-norwich-city": {
    teams: ["Stoke City", "Norwich"], titleIntents: ["stats", "odds"], descriptionIntents: ["stats", "odds", "goals"],
    focus: { en: "Norwich double chance (X2) and Over 1.5 Goals", "pt-BR": "Norwich ou empate (X2) e mais de 1,5 gols", es: "Norwich o empate (X2) y más de 1,5 goles", it: "Norwich o pareggio (X2) e più di 1,5 gol", fr: "Norwich ou nul (X2) et plus de 1,5 but", de: "Norwich oder Unentschieden (X2) und über 1,5 Tore" },
  },
  "atletico-mineiro-vs-cruzeiro": {
    teams: ["Atlético-MG", "Cruzeiro"], titleIntents: ["odds"], descriptionIntents: ["stats", "odds", "goals", "corners"],
    focus: { en: "Atlético Mineiro double chance and Under 3.5 Goals", "pt-BR": "Atlético-MG ou empate e menos de 3,5 gols", es: "Atlético Mineiro o empate y menos de 3,5 goles", it: "Atlético Mineiro o pareggio e meno di 3,5 gol", fr: "Atlético Mineiro ou nul et moins de 3,5 buts", de: "Atlético Mineiro oder Unentschieden und unter 3,5 Tore" },
  },
  "flamengo-vs-mirassol": {
    teams: ["Flamengo", "Mirassol"], titleIntents: ["handicap", "stats"], descriptionIntents: ["handicap", "odds", "stats", "goals", "corners", "recentMeeting"],
    focus: { en: "Flamengo -1.5 Asian Handicap", "pt-BR": "Flamengo -1,5 no handicap asiático", es: "Flamengo -1,5 en hándicap asiático", it: "Flamengo -1,5 con handicap asiatico", fr: "Flamengo -1,5 avec handicap asiatique", de: "Flamengo -1,5 Asian Handicap" },
  },
  "celtic-vs-aberdeen": {
    teams: ["Celtic", "Aberdeen"], titleIntents: [], descriptionIntents: ["odds", "stats", "handicap", "xg", "shots", "corners"],
    focus: { en: "Celtic -1.5 Asian Handicap", "pt-BR": "Celtic -1,5 no handicap asiático", es: "Celtic -1,5 en hándicap asiático", it: "Celtic -1,5 con handicap asiatico", fr: "Celtic -1,5 avec handicap asiatique", de: "Celtic -1,5 Asian Handicap" },
  },
  "dundee-vs-st-johnstone": {
    teams: ["Dundee", "St Johnstone"], titleIntents: [], descriptionIntents: ["odds", "stats", "goals", "corners"],
  },
  "kilmarnock-vs-st-mirren": {
    teams: ["Kilmarnock", "St Mirren"], titleIntents: ["stats"], descriptionIntents: ["odds", "stats", "goals", "corners"],
  },
  "millwall-vs-wrexham": {
    teams: ["Millwall", "Wrexham"], titleIntents: ["stats", "odds"], descriptionIntents: ["odds", "stats", "xg", "shots", "corners"],
    focus: { en: "Millwall to win", "pt-BR": "vitória do Millwall", es: "victoria del Millwall", it: "vittoria del Millwall", fr: "victoire de Millwall", de: "Sieg von Millwall" },
  },
  "motherwell-vs-dundee-united": {
    teams: ["Motherwell", "Dundee United"], titleIntents: ["stats", "odds"], descriptionIntents: ["odds", "stats", "btts", "goals", "xg", "shots", "corners"],
  },
  "queens-park-rangers-vs-cardiff-city": {
    teams: ["QPR", "Cardiff City"], titleIntents: ["stats", "odds"], descriptionIntents: ["odds", "stats", "goals", "xg", "shots", "corners"],
    focus: { en: "Over 2.5 Goals", "pt-BR": "mais de 2,5 gols", es: "más de 2,5 goles", it: "più di 2,5 gol", fr: "plus de 2,5 buts", de: "über 2,5 Tore" },
  },
  "west-bromwich-albion-vs-charlton-athletic": {
    teams: ["West Brom", "Charlton"], titleIntents: ["stats", "odds"], descriptionIntents: ["odds", "stats", "goals", "shots", "corners"],
    focus: { en: "Over 2.5 Goals", "pt-BR": "mais de 2,5 gols", es: "más de 2,5 goles", it: "più di 2,5 gol", fr: "plus de 2,5 buts", de: "über 2,5 Tore" },
  },
  "burnley-vs-middlesbrough": {
    teams: ["Burnley", "Middlesbrough"], titleIntents: ["stats", "odds"], descriptionIntents: ["odds", "stats", "goals", "xg", "shots", "corners"],
    focus: { en: "Middlesbrough X2 and Over 1.5 Goals", "pt-BR": "Middlesbrough X2 e mais de 1,5 gols", es: "Middlesbrough X2 y más de 1,5 goles", it: "Middlesbrough X2 e più di 1,5 gol", fr: "Middlesbrough X2 et plus de 1,5 but", de: "Middlesbrough X2 und über 1,5 Tore" },
  },
  "falkirk-vs-rangers": {
    teams: ["Falkirk", "Rangers"], titleIntents: ["stats", "odds"], descriptionIntents: ["odds", "stats", "goals", "corners"],
    focus: { en: "Rangers match prediction and Over 2.5 Goals", "pt-BR": "prognóstico do Rangers e mais de 2,5 gols", es: "pronóstico del Rangers y más de 2,5 goles", it: "pronostico Rangers e più di 2,5 gol", fr: "pronostic Rangers et plus de 2,5 buts", de: "Rangers-Prognose und über 2,5 Tore" },
  },
  "santos-vs-palmeiras": {
    teams: ["Santos", "Palmeiras"], titleIntents: ["odds"], descriptionIntents: ["odds", "stats", "competition", "secondLeg", "aggregate", "goals", "corners"],
  },
  "vitoria-vs-vasco-da-gama": {
    teams: ["Vitória", "Vasco"], titleIntents: ["odds"], descriptionIntents: ["odds", "stats", "competition", "secondLeg", "aggregate", "goals"],
  },
  "hibernian-vs-hearts": {
    teams: ["Hibernian", "Hearts"], titleIntents: ["stats", "odds"], descriptionIntents: ["stats", "odds", "goals", "corners"],
    focus: { en: "Over 2.5 Goals", "pt-BR": "mais de 2,5 gols", es: "más de 2,5 goles", it: "più di 2,5 gol", fr: "plus de 2,5 buts", de: "über 2,5 Tore" },
  },
  "gremio-vs-internacional": {
    teams: ["Grêmio", "Internacional"], titleIntents: ["stats", "odds", "goals"], descriptionIntents: ["stats", "odds", "goals", "corners", "secondLeg", "aggregate"],
    focus: { en: "Grêmio double chance and Under 3.5 Goals", "pt-BR": "Grêmio ou empate e menos de 3,5 gols", es: "Grêmio o empate y menos de 3,5 goles", it: "Grêmio o pareggio e meno di 3,5 gol", fr: "Grêmio ou nul et moins de 3,5 buts", de: "Grêmio oder Unentschieden und unter 3,5 Tore" },
  },
  "toulouse-vs-lille": {
    teams: ["Toulouse", "Lille"], titleIntents: ["stats", "odds", "goals"], descriptionIntents: ["stats", "odds", "goals", "corners", "xg", "shots"],
    focus: { en: "Lille double chance and Over 1.5 Goals", "pt-BR": "Lille ou empate e mais de 1,5 gols", es: "Lille o empate y más de 1,5 goles", it: "Lille o pareggio e più di 1,5 gol", fr: "Lille ou nul et plus de 1,5 buts", de: "Lille oder Unentschieden und über 1,5 Tore" },
  },
  "real-sociedad-vs-celta-vigo": {
    teams: ["Real Sociedad", "Celta Vigo"], titleIntents: ["stats", "odds", "goals"], descriptionIntents: ["stats", "odds", "goals", "corners", "xg", "shots"],
    focus: { en: "Real Sociedad double chance and Over 1.5 Goals", "pt-BR": "Real Sociedad ou empate e mais de 1,5 gols", es: "Real Sociedad o empate y más de 1,5 goles", it: "Real Sociedad o pareggio e più di 1,5 gol", fr: "Real Sociedad ou nul et plus de 1,5 buts", de: "Real Sociedad oder Unentschieden und über 1,5 Tore" },
  },
};

const todaySeoTerms: Record<TodaySeoLocale, Record<TodaySeoIntent, string>> = {
  en: { stats: "Stats", odds: "Odds", goals: "Goals", corners: "Corners", handicap: "Asian Handicap", xg: "xG and xGA", shots: "Shots on Target", btts: "BTTS", recentMeeting: "Recent Meeting", secondLeg: "Second Leg", aggregate: "Aggregate Score", competition: "Copa do Brasil" },
  "pt-BR": { stats: "Estatísticas", odds: "Odds", goals: "Gols", corners: "Escanteios", handicap: "Handicap Asiático", xg: "xG e xGA", shots: "Finalizações no Alvo", btts: "Ambas Marcam", recentMeeting: "Confronto Recente", secondLeg: "Segundo Jogo", aggregate: "Placar Agregado", competition: "Copa do Brasil" },
  es: { stats: "Estadísticas", odds: "Cuotas", goals: "Goles", corners: "Córners", handicap: "Hándicap Asiático", xg: "xG y xGA", shots: "Tiros a Puerta", btts: "Ambos Marcan", recentMeeting: "Duelo Reciente", secondLeg: "Partido de Vuelta", aggregate: "Marcador Global", competition: "Copa do Brasil" },
  it: { stats: "Statistiche", odds: "Quote", goals: "Gol", corners: "Corner", handicap: "Handicap Asiatico", xg: "xG e xGA", shots: "Tiri in Porta", btts: "Gol di Entrambe", recentMeeting: "Precedente Recente", secondLeg: "Gara di Ritorno", aggregate: "Risultato Aggregato", competition: "Copa do Brasil" },
  fr: { stats: "Statistiques", odds: "Cotes", goals: "Buts", corners: "Corners", handicap: "Handicap Asiatique", xg: "xG et xGA", shots: "Tirs Cadrés", btts: "Les Deux Équipes Marquent", recentMeeting: "Duel Récent", secondLeg: "Match Retour", aggregate: "Score Cumulé", competition: "Copa do Brasil" },
  de: { stats: "Statistik", odds: "Quoten", goals: "Tore", corners: "Ecken", handicap: "Asian Handicap", xg: "xG und xGA", shots: "Torschüsse", btts: "Beide Teams Treffen", recentMeeting: "Letztes Duell", secondLeg: "Rückspiel", aggregate: "Gesamtergebnis", competition: "Copa do Brasil" },
};

function structuredCoreLabels(match: Match) {
  return extractStatisticalCoreRows(match).map((row) => row.label).join(" ");
}

function isProfileIntentSupported(
  match: Match,
  intent: TodaySeoIntent,
  facts: MatchIntentFacts
) {
  const markets = new Set(detectPickMarkets(facts.mainPick));
  const coreLabels = structuredCoreLabels(match);
  const analysis = match.analysis.join(" ");

  switch (intent) {
    case "stats":
      return facts.hasStatistics;
    case "odds":
      return Boolean(facts.odds);
    case "goals":
      return facts.hasGoals || markets.has("OVER_UNDER");
    case "corners":
      return facts.hasCorners || markets.has("CORNERS");
    case "handicap":
      return markets.has("ASIAN_HANDICAP");
    case "xg":
      return /\bxG(?:A)?(?:\/game)?\b/i.test(coreLabels);
    case "shots":
      return /\b(?:Shots|SOT)(?:\/game| allowed\/game)?\b/i.test(coreLabels);
    case "btts":
      return markets.has("BTTS") || /\bBTTS\b/i.test(coreLabels);
    case "recentMeeting":
      return facts.hasH2h;
    case "secondLeg":
      return /second leg|jogo de volta|partido de vuelta|gara di ritorno|match retour|rückspiel/i.test(`${match.round} ${analysis}`);
    case "aggregate":
      return /aggregate|placar agregado|marcador global|risultato aggregato|score cumulé|gesamtergebnis/i.test(analysis);
    case "competition":
      return Boolean(leaguesBySlug[match.league]);
    default:
      return false;
  }
}

function isTodaySeoLocale(locale: SearchLocale): locale is TodaySeoLocale {
  return locale === "en" || locale === "pt-BR" || locale === "es" || locale === "it" || locale === "fr" || locale === "de";
}

function todaySeoTeams(profile: TodaySeoProfile, locale: TodaySeoLocale) {
  return `${profile.teams[0]} ${localeSearchResearch[locale].separator} ${profile.teams[1]}`;
}

function buildProfileIntentQueries(match: Match, locale: SearchLocale) {
  if (!isRestrictedSearchIntentFixture(match)) return [];
  if (!isTodaySeoLocale(locale)) return [];
  const profile = todaySeoProfiles[match.slug];
  if (!profile) return [];
  const facts = readMatchFacts(match);
  const teams = todaySeoTeams(profile, locale);
  const acquisitionIntents = new Set<TodaySeoIntent>(["odds", "goals", "corners", "handicap", "btts"]);
  return unique(
    profile.descriptionIntents
      .filter((intent) => acquisitionIntents.has(intent))
      .filter((intent) => isProfileIntentSupported(match, intent, facts))
      .map((intent) => `${teams} ${todaySeoTerms[locale][intent].toLocaleLowerCase()}`)
  );
}

function buildTodaySeoTitle(match: Match, locale: TodaySeoLocale) {
  if (!isRestrictedSearchIntentFixture(match)) return "";
  const profile = todaySeoProfiles[match.slug];
  if (!profile) return "";
  const teams = todaySeoTeams(profile, locale);
  const research = localeSearchResearch[locale];

  const candidates = locale === "en"
    ? [
        `${teams} Prediction, Betting Tips & Odds`,
        `${teams} Prediction & Odds`,
        `${teams} Prediction`,
      ]
    : [
        `${teams} ${sentenceCase(research.prediction)}, ${sentenceCase(research.betting)} & ${sentenceCase(research.odds)}`,
        `${teams} ${sentenceCase(research.prediction)} & ${sentenceCase(research.odds)}`,
        `${teams} ${sentenceCase(research.prediction)}`,
      ];

  return candidates.find((title) => title.length <= 70) ?? candidates.at(-1)!;
}

function buildTodaySeoDescription(match: Match, locale: TodaySeoLocale, facts: MatchIntentFacts) {
  if (!isRestrictedSearchIntentFixture(match)) return "";
  const profile = todaySeoProfiles[match.slug];
  if (!profile) return "";

  const temporal = resolveMatchTemporalState(match);
  if (temporal !== "today" && temporal !== "tomorrow") return "";

  const teams = todaySeoTeams(profile, locale);
  const research = localeSearchResearch[locale];
  const temporalPhrases = {
    en: { today: "for today", tomorrow: "for tomorrow" },
    "pt-BR": { today: "de hoje", tomorrow: "de amanhã" },
    es: { today: "de hoy", tomorrow: "de mañana" },
    it: { today: "di oggi", tomorrow: "di domani" },
    fr: { today: "du jour", tomorrow: "de demain" },
    de: { today: "heute", tomorrow: "für morgen" },
  } as const;
  const when = temporalPhrases[locale][temporal];
  const odds = facts.odds;
  const pick = facts.mainPick;

  const candidates = {
    en: [
      `${teams} prediction ${when}${pick ? `: ${pick}` : ""}${odds ? ` at odds ${odds}` : ""}. Betting tips and match analysis with the key data behind the pick.`,
      `${teams} prediction ${when}${odds ? `, odds ${odds}` : ""}. Betting tips, match analysis and the data behind our main pick.`,
    ],
    "pt-BR": [
      `${teams}: palpite ${when}${odds ? `, odds ${odds}` : ""}. Análise do jogo, dicas de apostas e dados que sustentam a seleção principal.`,
      `${teams}: palpite ${when}. Prognóstico, análise e odds para a seleção principal.`,
    ],
    es: [
      `${teams}: pronóstico ${when}${odds ? `, cuotas ${odds}` : ""}. Apuestas, análisis del partido y datos que respaldan la selección principal.`,
      `${teams}: pronóstico ${when}. Apuestas, análisis y cuotas de la selección principal.`,
    ],
    it: [
      `${teams}: pronostico ${when}${odds ? `, quote ${odds}` : ""}. Scommesse, analisi della partita e dati a supporto della scelta principale.`,
      `${teams}: pronostico ${when}. Scommesse, analisi e quote della scelta principale.`,
    ],
    fr: [
      `${teams} : pronostic ${when}${odds ? `, cotes ${odds}` : ""}. Conseils paris, analyse du match et données qui soutiennent le choix principal.`,
      `${teams} : pronostic ${when}. Conseils paris, analyse et cotes du choix principal.`,
    ],
    de: [
      `${teams}: Prognose ${when}${odds ? `, Quoten ${odds}` : ""}. Wett-Tipps, Spielanalyse und Daten zur Begründung des Haupttipps.`,
      `${teams}: Prognose ${when}. Wett-Tipps, Analyse und Quoten zum Haupttipp.`,
    ],
  }[locale];

  return fitDescription(candidates);
}

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean))];
}

function sentenceCase(value: string) {
  return value ? `${value[0].toLocaleUpperCase()}${value.slice(1)}` : value;
}

function stableVariant(slug: string) {
  return Array.from(slug).reduce((total, character) => total + character.charCodeAt(0), 0) % 4;
}

function slugifyMatchPart(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchTeams(match: Match, locale: SearchLocale) {
  const separator = localeSearchResearch[locale].separator;
  return `${match.homeTeam} ${separator} ${match.awayTeam}`;
}

function readMatchFacts(match: Match): MatchIntentFacts {
  const analysis = match.analysis.join(" ").toLowerCase();
  const mainPick = normalizeMainPick(
    match.predictions.find((item) => item.label === "Main Prediction")?.value
  );
  const odds = normalizeMainPick(
    match.predictions.find((item) => item.label === "Published Odds" || item.label === "Odds")?.value
  );

  return {
    leagueName: leaguesBySlug[match.league]?.name ?? "the competition",
    mainPick,
    odds,
    hasAnalysis: match.analysis.some((paragraph) => paragraph.trim().length > 0),
    hasStatistics: extractStatisticalCoreRows(match).length > 0 || Boolean(match.matchSeo?.statistics) || /\b(?:statistic|average|record|goals?|points?|matches?|wins?|draws?|losses?|scored|conceded|percentage|probability)\b|\d+(?:[.,]\d+)?%/i.test(analysis),
    hasForm: /\b(?:form|recent|last\s+\d+|sequence|run of|unbeaten|winning run)\b/i.test(analysis),
    hasH2h: Boolean(match.matchSeo?.h2h),
    hasStandingsContext: /\b(?:standings|league table|table position|points table|finished\s+\d+)\b/i.test(analysis),
    hasLineups: Boolean(match.matchSeo?.lineups),
    hasAvailability: Boolean(match.matchSeo?.availability),
    hasTeamNews: Boolean(match.matchSeo?.teamNews),
    hasWeather: Boolean(match.matchSeo?.weather),
    hasInjuries: Boolean(match.matchSeo?.availability?.entries.some((entry) => entry.status === "injured" || entry.status === "doubtful" || entry.status === "unavailable")),
    hasSuspensions: Boolean(match.matchSeo?.availability?.entries.some((entry) => entry.status === "suspended")),
    hasCorners: Boolean(match.matchSeo?.statistics?.rows.some((row) => row.category === "corners")) || /\|\s*(?:corners?|total corners?|over \d+(?:\.\d+)? corners?)/i.test(match.analysis.join("\n")),
    hasGoals: Boolean(match.matchSeo?.statistics?.rows.some((row) => row.category === "goals")) || /\|\s*(?:gf\/game|ga\/game|over \d+(?:\.\d+)? goals?|btts|clean sheets?)/i.test(match.analysis.join("\n")),
    hasVenue: Boolean(match.venue && match.venue !== "TBD"),
    hasKickOff: Boolean(match.time && match.time !== "TBD"),
    hasBroadcastInfo: false,
  };
}

export function resolveMatchTemporalState(
  match: Match,
  today = localTodayISO()
): MatchTemporalState | null {
  const bucket = resolveHomeTemporalBucket(match, today);
  return bucket === "today" || bucket === "tomorrow" || bucket === "upcoming" || bucket === "historical"
    ? bucket
    : null;
}

export function shouldApplySearchIntentSEO(match: Match) {
  return match.status === "published" &&
    readMatchFacts(match).hasAnalysis &&
    !peopleFirstLegacyMatchSlugs.has(match.slug);
}

export function getMatchIntentCapabilities(match: Match) {
  const facts = readMatchFacts(match);
  return {
    hasAnalysis: facts.hasAnalysis,
    hasPick: Boolean(facts.mainPick),
    hasOdds: Boolean(facts.odds),
    hasStatistics: facts.hasStatistics,
    hasForm: facts.hasForm,
    hasH2h: facts.hasH2h,
    hasStandingsContext: facts.hasStandingsContext,
    hasLineups: facts.hasLineups,
    hasAvailability: facts.hasAvailability,
    hasTeamNews: facts.hasTeamNews,
    hasWeather: facts.hasWeather,
    hasInjuries: facts.hasInjuries,
    hasSuspensions: facts.hasSuspensions,
    hasCorners: facts.hasCorners,
    hasGoals: facts.hasGoals,
    hasVenue: facts.hasVenue,
    hasKickOff: facts.hasKickOff,
    hasBroadcastInfo: facts.hasBroadcastInfo,
    hasStatisticalCore: extractStatisticalCoreRows(match).length > 0,
    markets: detectPickMarkets(facts.mainPick),
  };
}

export type MatchIntentRegistry = ReturnType<typeof getMatchIntentRegistry>;

export function getMatchIntentRegistry(match: Match) {
  const capabilities = getMatchIntentCapabilities(match);
  const analysis = match.analysis.join(" ");
  const markets = new Set(capabilities.markets);
  const rows = extractStatisticalCoreRows(match).map((row) => row.label).join(" ");
  return {
    hasPrediction: capabilities.hasPick,
    hasOdds: capabilities.hasOdds,
    hasAnalysis: capabilities.hasAnalysis,
    hasLineups: capabilities.hasLineups,
    hasStatistics: capabilities.hasStatistics,
    hasForm: capabilities.hasForm,
    // Sensitive intents must be backed by structured modules, never prose-only matches.
    hasTeamNews: capabilities.hasTeamNews,
    hasInjuries: capabilities.hasInjuries,
    hasSuspensions: capabilities.hasSuspensions,
    has1X2: markets.has("WIN"),
    hasDoubleChance: markets.has("DOUBLE_CHANCE"),
    hasDrawNoBet: markets.has("DRAW_NO_BET"),
    hasAsianHandicap: markets.has("ASIAN_HANDICAP"),
    hasGoals: capabilities.hasGoals || markets.has("OVER_UNDER"),
    hasBtts: markets.has("BTTS") || /\bBTTS\b|both teams to score/i.test(analysis),
    hasCorners: capabilities.hasCorners || markets.has("CORNERS"),
    hasCorrectScore: /correct score prediction|placar exato/i.test(analysis),
    hasXg: /\bxG(?:A)?\b/i.test(`${rows} ${analysis}`),
    hasShots: /shots?(?: on target)?|SOT/i.test(`${rows} ${analysis}`),
    hasPossession: /possession/i.test(`${rows} ${analysis}`),
    hasImpliedProbability: /implied probability|price-derived threshold/i.test(analysis),
    hasValueBet: /\bvalue bet\b|betting value/i.test(analysis),
    hasKickOff: capabilities.hasKickOff,
    hasVenue: capabilities.hasVenue,
    hasCompetition: Boolean(leaguesBySlug[match.league]),
    hasRound: Boolean(match.round),
  };
}

function buildTemporalQueries(
  teams: string,
  locale: SearchLocale,
  temporal: MatchTemporalState | null
) {
  if (!temporal) return [];
  const research = localeSearchResearch[locale];
  const temporalTerm = research.temporal[temporal];

  if (temporal === "historical") {
    return unique([
      `${teams} ${temporalTerm}`,
      `${teams} ${research.statistics}`,
    ]);
  }

  const queries = [
    `${teams} ${research.prediction} ${temporalTerm}`,
    `${research.footballPrediction} ${temporalTerm}`,
  ];

  if (temporal === "today" || temporal === "tomorrow") {
    queries.push(`${research.betting} ${temporalTerm}`);
  }

  if (locale === "en" && temporal === "tomorrow") {
    queries.push("tomorrow football predictions");
  }

  return unique(queries);
}

function buildAlternateMatchQueries(match: Match, locale: SearchLocale) {
  const research = localeSearchResearch[locale];
  return unique([
    ...getTeamSearchAliases(match.homeTeam).map(
      (home) => `${home} ${research.separator} ${match.awayTeam}`
    ),
    ...getTeamSearchAliases(match.awayTeam).map(
      (away) => `${match.homeTeam} ${research.separator} ${away}`
    ),
  ]);
}

function descriptionDateQualifier(match: Match, temporal: MatchTemporalState | null) {
  if (temporal === "today") return " for today";
  if (temporal === "tomorrow") return " for tomorrow";
  if (temporal === "historical") return " for the completed match";
  return match.date ? ` for ${match.date}` : "";
}

function fitDescription(candidates: string[]) {
  return candidates.find((candidate) => candidate.length <= 160) ?? candidates.at(-1) ?? "";
}

function buildEnglishDescription(
  match: Match,
  facts: MatchIntentFacts,
  temporal: MatchTemporalState | null
) {
  const todayDescription = buildTodaySeoDescription(match, "en", facts);
  if (todayDescription) return todayDescription;
  const teams = matchTeams(match, "en");
  const when = descriptionDateQualifier(match, temporal);
  const odds = facts.odds ? ` at odds of ${facts.odds}` : "";
  const pick = facts.mainPick || "the main prediction";
  if (match.matchSeo) {
    return fitDescription([
      `${teams} prediction${when}: ${pick}${odds}. Betting tips and match analysis with the key statistical evidence behind the selection.`,
      `${teams} prediction${when}, ${pick}${odds}. Read our betting analysis and the data behind the main pick.`,
      `${teams} prediction${when}: ${pick}${odds}. Full betting analysis for ${facts.leagueName}.`,
      `${teams} prediction${when} and betting analysis for ${facts.leagueName}.`,
    ]);
  }
  const detailed = [
    `${teams} prediction${when} in ${facts.leagueName}. Our main pick is ${pick}${odds}, with match analysis and relevant betting context.`,
    `Read the ${teams} match analysis${when}, including ${pick}${odds} and the key context for this ${facts.leagueName} fixture.`,
    `${facts.leagueName}: ${teams}. View our prediction${when}, ${pick}${odds}, plus match analysis and the reasoning behind the selection.`,
    `Our ${teams} match analysis${when} covers ${pick}${odds}, betting context and the relevant ${facts.leagueName} data.`,
  ][stableVariant(match.slug)];

  return fitDescription([
    detailed,
    `${teams} prediction${when}: ${pick}${odds}. Read the match analysis for ${facts.leagueName}.`,
    `${teams} prediction${when}. Read our ${facts.leagueName} match analysis and main pick.`,
  ]);
}

function buildLocalizedDescription(
  match: Match,
  locale: SearchLocale,
  facts: MatchIntentFacts,
  temporal: MatchTemporalState | null
) {
  if (locale === "en") return buildEnglishDescription(match, facts, temporal);
  if (isTodaySeoLocale(locale)) {
    const todayDescription = buildTodaySeoDescription(match, locale, facts);
    if (todayDescription) return todayDescription;
  }

  const research = localeSearchResearch[locale];
  const teams = matchTeams(match, locale);
  const when = temporal ? ` ${research.temporal[temporal]}` : match.date ? ` ${match.date}` : "";
  const odds = facts.odds ? `, ${research.odds} ${facts.odds}` : "";

  const modules = [];
  if (facts.hasStatistics) modules.push(research.statistics);

  const moduleStr = modules.slice(0, 2).join(", ") || research.analysis;

  return fitDescription([
    `${teams}: ${research.prediction}${when}. ${sentenceCase(moduleStr)}, ${research.analysis}${odds} - ${facts.leagueName}.`,
    `${teams}: ${research.prediction}${when}, ${research.analysis}${odds}.`,
    `${teams}: ${research.prediction} - ${facts.leagueName}.`,
  ]);
}

function buildTitle(match: Match, locale: SearchLocale) {
  if (isTodaySeoLocale(locale)) {
    const todayTitle = buildTodaySeoTitle(match, locale);
    if (todayTitle) return todayTitle;
  }
  const research = localeSearchResearch[locale];
  const teams = matchTeams(match, locale);
  const intent = sentenceCase(research.prediction);
  if (locale === "en" && match.matchSeo) {
    const leagueName = leaguesBySlug[match.league]?.name ?? match.league;
    const candidates = [
      `${teams} Prediction, Betting Tips & Odds`,
      `${teams} Prediction & Odds | ${leagueName}`,
      `${teams} Prediction | ${leagueName}`,
      `${teams} Prediction`,
    ];
    return candidates.find((title) => title.length <= 70) ?? `${teams} Prediction`;
  }
  const full = locale === "en"
    ? `${teams} Prediction, Betting Tips & Odds | ${siteConfig.name}`
    : `${teams} ${intent}, ${sentenceCase(research.betting)} & ${sentenceCase(research.odds)} | ${siteConfig.name}`;
  const canonicalTeamSlug = `${slugifyMatchPart(match.homeTeam)}-vs-${slugifyMatchPart(match.awayTeam)}`;
  const competitionQualified = match.slug !== canonicalTeamSlug
    ? `${teams} ${intent} | ${leaguesBySlug[match.league]?.name ?? match.league}`
    : "";
  const brandedCompact = `${teams} ${intent} | ${siteConfig.name}`;
  const matchFocused = `${teams} ${intent}`;
  return [full, competitionQualified, brandedCompact, matchFocused]
    .find((title) => title && title.length <= 70) ?? matchFocused;
}

function buildH1(match: Match, locale: SearchLocale) {
  const research = localeSearchResearch[locale];
  if (locale === "en") {
    return `${matchTeams(match, locale)} Prediction & Match Analysis`;
  }
  const connector = { "pt-BR": "e", es: "y", it: "e", fr: "et", de: "und" }[locale as "pt-BR" | "es" | "it" | "fr" | "de"] ?? "&";
  return `${matchTeams(match, locale)} ${sentenceCase(research.prediction)} ${connector} ${sentenceCase(research.analysis)}`;
}

function buildIntro(match: Match, locale: SearchLocale, facts: MatchIntentFacts) {
  const teams = matchTeams(match, locale);
  if (locale !== "en") {
    const research = localeSearchResearch[locale];
    return `${teams}: ${research.analysis}, ${research.prediction} - ${facts.leagueName}.`;
  }

  const odds = facts.odds ? ` at published odds of ${facts.odds}` : "";
  if (!facts.mainPick) {
    return `${teams} meet in ${facts.leagueName}. This preview outlines the match context, analysis and key considerations.`;
  }
  return `${teams} meet in ${facts.leagueName}. This preview explains the reasoning behind ${facts.mainPick}${odds} and the main risks considered.`;
}

export function buildMatchSearchIntent(
  match: Match,
  locale: SearchLocale = "en",
  today = localTodayISO()
): MatchSearchIntent {
  const research = localeSearchResearch[locale];
  const teams = matchTeams(match, locale);
  const facts = readMatchFacts(match);
  const temporalState = resolveMatchTemporalState(match, today);
  const markets = detectPickMarkets(facts.mainPick);
  const alternateMatchQueries = buildAlternateMatchQueries(match, locale);
  const predictionQueries = unique([
    `${teams} ${research.prediction}`,
    ...alternateMatchQueries.map((query) => `${query} ${research.prediction}`),
  ]);
  const bettingQueries = facts.mainPick ? [`${teams} ${research.betting}`] : [];
  const oddsQueries = facts.odds ? [`${teams} ${research.odds}`] : [];
  const analysisQueries = facts.hasAnalysis
    ? [`${teams} ${research.analysis}`, `${teams} ${research.preview}`]
    : [];
  const marketQueries = facts.mainPick
    ? unique([
        `${teams} ${facts.mainPick}`,
        ...markets.map((market) => `${teams} ${research.markets[market]}`),
      ])
    : [];
  const statisticalQueries = unique([
    ...(facts.hasStatistics ? [`${teams} ${research.statistics}`] : []),
    ...(facts.hasForm ? [`${teams} ${research.form}`] : []),
    ...(facts.hasH2h ? [`${teams} ${research.h2h}`] : []),
    ...(facts.hasStandingsContext ? [`${teams} ${research.standings}`] : []),
  ]);
  const temporalQueries = buildTemporalQueries(teams, locale, temporalState);
  const competitionQueries = unique([
    `${facts.leagueName} ${research.prediction}`,
    ...(facts.mainPick ? [`${facts.leagueName} ${research.betting}`] : []),
  ]);
  const categories = unique([
    "MATCH",
    "PREDICTION",
    ...(facts.mainPick ? ["BETTING", "MARKET"] : []),
    ...(facts.odds ? ["ODDS"] : []),
    ...(facts.hasAnalysis ? ["ANALYSIS", "PREVIEW"] : []),
    ...(facts.hasForm ? ["FORM"] : []),
    ...(facts.hasH2h ? ["H2H"] : []),
    ...(facts.hasStatistics ? ["STATISTICS"] : []),
    ...(facts.hasStandingsContext ? ["STANDINGS"] : []),
    ...(temporalState ? ["TEMPORAL"] : []),
    "LEAGUE",
    "BRAND",
  ]) as SearchIntentCategory[];
  const primaryQuery = predictionQueries[0];
  const secondaryQueries = unique([
    ...predictionQueries.slice(1),
    ...bettingQueries,
    ...oddsQueries,
    ...analysisQueries,
    ...buildProfileIntentQueries(match, locale),
  ]);

  return {
    locale,
    categories,
    primaryQuery,
    alternateMatchQueries,
    predictionQueries,
    bettingQueries,
    oddsQueries,
    analysisQueries,
    marketQueries,
    statisticalQueries,
    temporalQueries,
    competitionQueries,
    secondaryQueries,
    temporalState,
  };
}

export function buildMatchSearchIntentCopy(
  match: Match,
  locale: SearchLocale = "en",
  today = localTodayISO()
) {
  const intent = buildMatchSearchIntent(match, locale, today);
  const facts = readMatchFacts(match);

  return {
    ...intent,
    title: buildTitle(match, locale),
    h1: buildH1(match, locale),
    description: buildLocalizedDescription(match, locale, facts, intent.temporalState),
    intro: buildIntro(match, locale, facts),
  };
}

export function getMatchLocaleMetadata(match: Match, locale: SearchLocale = "en") {
  const copy = buildMatchSearchIntentCopy(match, locale);
  return {
    locale,
    title: copy.title,
    description: copy.description,
    h1: copy.h1,
    intro: copy.intro,
  };
}
