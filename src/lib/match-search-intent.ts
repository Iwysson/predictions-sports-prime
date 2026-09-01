import { leaguesBySlug } from "@/data/leagues";
import { localTodayISO, resolveHomeTemporalBucket } from "@/lib/match-feed";
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
type TodaySeoIntent = "lineups" | "stats" | "odds" | "goals" | "corners" | "handicap" | "teamNews" | "injuries";

type TodaySeoProfile = {
  teams: [string, string];
  titleIntents: TodaySeoIntent[];
  descriptionIntents: TodaySeoIntent[];
  focus?: Partial<Record<TodaySeoLocale, string>>;
};

const todaySeoProfiles: Record<string, TodaySeoProfile> = {
  "lincoln-city-vs-blackburn-rovers": {
    teams: ["Lincoln City", "Blackburn"], titleIntents: ["lineups", "stats"], descriptionIntents: ["lineups", "stats", "odds", "goals", "corners"],
  },
  "portsmouth-vs-derby-county": {
    teams: ["Portsmouth", "Derby County"], titleIntents: ["lineups", "stats"], descriptionIntents: ["lineups", "stats", "odds", "goals"],
    focus: { en: "Portsmouth double chance and Under 3.5 Goals", "pt-BR": "Portsmouth ou empate e menos de 3,5 gols", es: "Portsmouth o empate y menos de 3,5 goles", it: "Portsmouth o pareggio e meno di 3,5 gol", fr: "Portsmouth ou nul et moins de 3,5 buts", de: "Portsmouth oder Unentschieden und unter 3,5 Tore" },
  },
  "preston-north-end-vs-bristol-city": {
    teams: ["Preston", "Bristol City"], titleIntents: ["corners", "lineups", "stats"], descriptionIntents: ["corners", "lineups", "stats", "odds"],
    focus: { en: "Under 3.5 Goals and Over 8.5 Corners", "pt-BR": "menos de 3,5 gols e mais de 8,5 escanteios", es: "menos de 3,5 goles y más de 8,5 córners", it: "meno di 3,5 gol e più di 8,5 calci d'angolo", fr: "moins de 3,5 buts et plus de 8,5 corners", de: "unter 3,5 Tore und über 8,5 Ecken" },
  },
  "sheffield-united-vs-bolton-wanderers": {
    teams: ["Sheffield United", "Bolton"], titleIntents: ["handicap", "corners"], descriptionIntents: ["handicap", "corners", "lineups", "stats", "odds"],
    focus: { en: "Bolton +2 Asian Handicap and Over 8.5 Corners", "pt-BR": "Bolton +2 no handicap asiático e mais de 8,5 escanteios", es: "Bolton +2 en hándicap asiático y más de 8,5 córners", it: "Bolton +2 con handicap asiatico e più di 8,5 calci d'angolo", fr: "Bolton +2 avec handicap asiatique et plus de 8,5 corners", de: "Bolton +2 Asian Handicap und über 8,5 Ecken" },
  },
  "swansea-city-vs-watford": {
    teams: ["Swansea City", "Watford"], titleIntents: ["lineups", "stats"], descriptionIntents: ["lineups", "stats", "odds"],
    focus: { en: "Over 2.5 Goals", "pt-BR": "mais de 2,5 gols", es: "más de 2,5 goles", it: "più di 2,5 gol", fr: "plus de 2,5 buts", de: "über 2,5 Tore" },
  },
  "west-ham-united-vs-wolverhampton-wanderers": {
    teams: ["West Ham", "Wolves"], titleIntents: ["lineups", "stats", "odds"], descriptionIntents: ["lineups", "stats", "odds", "goals"],
    focus: { en: "West Ham double chance and Over 1.5 Goals", "pt-BR": "West Ham ou empate e mais de 1,5 gols", es: "West Ham o empate y más de 1,5 goles", it: "West Ham o pareggio e più di 1,5 gol", fr: "West Ham ou nul et plus de 1,5 but", de: "West Ham oder Unentschieden und über 1,5 Tore" },
  },
  "birmingham-city-vs-southampton": {
    teams: ["Birmingham City", "Southampton"], titleIntents: ["lineups", "stats"], descriptionIntents: ["lineups", "stats", "odds", "goals"],
    focus: { en: "Birmingham double chance and Over 1.5 Goals", "pt-BR": "Birmingham ou empate e mais de 1,5 gols", es: "Birmingham o empate y más de 1,5 goles", it: "Birmingham o pareggio e più di 1,5 gol", fr: "Birmingham ou nul et plus de 1,5 but", de: "Birmingham oder Unentschieden und über 1,5 Tore" },
  },
  "stoke-city-vs-norwich-city": {
    teams: ["Stoke City", "Norwich"], titleIntents: ["lineups", "stats", "odds"], descriptionIntents: ["lineups", "stats", "odds", "goals"],
    focus: { en: "Norwich double chance (X2) and Over 1.5 Goals", "pt-BR": "Norwich ou empate (X2) e mais de 1,5 gols", es: "Norwich o empate (X2) y más de 1,5 goles", it: "Norwich o pareggio (X2) e più di 1,5 gol", fr: "Norwich ou nul (X2) et plus de 1,5 but", de: "Norwich oder Unentschieden (X2) und über 1,5 Tore" },
  },
  "atletico-mineiro-vs-cruzeiro": {
    teams: ["Atlético-MG", "Cruzeiro"], titleIntents: ["lineups", "injuries", "odds"], descriptionIntents: ["lineups", "teamNews", "injuries", "stats", "odds", "goals", "corners"],
    focus: { en: "Atlético Mineiro double chance and Under 3.5 Goals", "pt-BR": "Atlético-MG ou empate e menos de 3,5 gols", es: "Atlético Mineiro o empate y menos de 3,5 goles", it: "Atlético Mineiro o pareggio e meno di 3,5 gol", fr: "Atlético Mineiro ou nul et moins de 3,5 buts", de: "Atlético Mineiro oder Unentschieden und unter 3,5 Tore" },
  },
};

const todaySeoTerms: Record<TodaySeoLocale, Record<TodaySeoIntent, string>> = {
  en: { lineups: "Lineups", stats: "Stats", odds: "Odds", goals: "Goals", corners: "Corners", handicap: "Asian Handicap", teamNews: "Team News", injuries: "Injuries" },
  "pt-BR": { lineups: "Escalações", stats: "Estatísticas", odds: "Odds", goals: "Gols", corners: "Escanteios", handicap: "Handicap Asiático", teamNews: "Notícias", injuries: "Desfalques" },
  es: { lineups: "Alineaciones", stats: "Estadísticas", odds: "Cuotas", goals: "Goles", corners: "Córners", handicap: "Hándicap Asiático", teamNews: "Noticias", injuries: "Bajas" },
  it: { lineups: "Formazioni", stats: "Statistiche", odds: "Quote", goals: "Gol", corners: "Corner", handicap: "Handicap Asiatico", teamNews: "Notizie", injuries: "Assenze" },
  fr: { lineups: "Compositions", stats: "Statistiques", odds: "Cotes", goals: "Buts", corners: "Corners", handicap: "Handicap Asiatique", teamNews: "Actualités", injuries: "Absents" },
  de: { lineups: "Aufstellungen", stats: "Statistik", odds: "Quoten", goals: "Tore", corners: "Ecken", handicap: "Asian Handicap", teamNews: "Team-News", injuries: "Ausfälle" },
};

const todayEnglishDescriptions: Record<string, string> = {
  "lincoln-city-vs-blackburn-rovers": "Lincoln City vs Blackburn prediction for today, with probable lineups, stats, odds 1.78, goals, corners, 19:45 kick-off and LNER Stadium context.",
  "portsmouth-vs-derby-county": "Portsmouth vs Derby County prediction: Portsmouth double chance and Under 3.5 Goals at odds 1.78, plus probable lineups, stats and match details.",
  "preston-north-end-vs-bristol-city": "Preston vs Bristol City prediction: Under 3.5 Goals and Over 8.5 Corners at odds 1.78, with probable lineups, stats and match analysis.",
  "sheffield-united-vs-bolton-wanderers": "Sheffield United vs Bolton prediction: Bolton +2 Asian Handicap and Over 8.5 Corners at odds 1.91, with probable lineups and stats.",
  "swansea-city-vs-watford": "Swansea City vs Watford prediction for today, Over 2.5 Goals at odds of 1.88. Review probable lineups, statistics, odds comparison before the match.",
  "west-ham-united-vs-wolverhampton-wanderers": "West Ham vs Wolves prediction: West Ham double chance and Over 1.5 Goals at odds 1.60, with probable lineups, stats, kick-off time and venue.",
  "birmingham-city-vs-southampton": "Birmingham City vs Southampton prediction: Birmingham double chance and Over 1.5 Goals at odds 1.87, with probable lineups, stats and match analysis.",
  "stoke-city-vs-norwich-city": "Stoke City vs Norwich prediction: Norwich double chance (X2) and Over 1.5 Goals at odds 1.78, with probable lineups, stats and match analysis.",
  "atletico-mineiro-vs-cruzeiro": "Atlético-MG vs Cruzeiro prediction for Copa do Brasil, with probable lineups, team news, injuries, stats, odds 1.72, goals and corners.",
};

function isTodaySeoLocale(locale: SearchLocale): locale is TodaySeoLocale {
  return locale === "en" || locale === "pt-BR" || locale === "es" || locale === "it" || locale === "fr" || locale === "de";
}

function formatLocalizedList(values: string[], locale: TodaySeoLocale) {
  if (values.length < 2) return values[0] ?? "";
  const connector = { en: "and", "pt-BR": "e", es: "y", it: "e", fr: "et", de: "und" }[locale];
  return `${values.slice(0, -1).join(", ")} ${connector} ${values.at(-1)}`;
}

function todaySeoTeams(profile: TodaySeoProfile, locale: TodaySeoLocale) {
  return `${profile.teams[0]} ${localeSearchResearch[locale].separator} ${profile.teams[1]}`;
}

function buildTodaySeoTitle(match: Match, locale: TodaySeoLocale) {
  const profile = todaySeoProfiles[match.slug];
  if (!profile) return "";
  const teams = todaySeoTeams(profile, locale);
  const prediction = sentenceCase(localeSearchResearch[locale].prediction);
  const intents = profile.titleIntents.map((intent) => todaySeoTerms[locale][intent]);
  while (intents.length) {
    const title = `${teams} ${prediction}, ${formatLocalizedList(intents, locale)}`;
    if (title.length <= 70) return title;
    intents.pop();
  }
  return `${teams} ${prediction}`;
}

function buildTodaySeoDescription(match: Match, locale: TodaySeoLocale, facts: MatchIntentFacts) {
  const profile = todaySeoProfiles[match.slug];
  if (!profile) return "";
  if (locale === "en") return todayEnglishDescriptions[match.slug] ?? "";
  const teams = todaySeoTeams(profile, locale);
  const focus = profile.focus?.[locale];
  const descriptionIntents = facts.odds
    ? profile.descriptionIntents.filter((intent) => intent !== "odds")
    : profile.descriptionIntents;
  const modules = formatLocalizedList(descriptionIntents.map((intent) => {
    const term = todaySeoTerms[locale][intent];
    return locale === "de" ? term : term.toLocaleLowerCase();
  }), locale);
  const odds = facts.odds;
  const candidates = {
    en: `${teams} prediction for today${focus ? `: ${focus}` : ""}. Check ${modules}${odds ? ` at odds of ${odds}` : ""}, kick-off time and venue.`,
    "pt-BR": `${teams}: palpite de hoje${focus ? ` para ${focus}` : ""}. Confira ${modules}${odds ? `, odds ${odds}` : ""}, horário e estádio.`,
    es: `${teams}: pronóstico de hoy${focus ? ` para ${focus}` : ""}. Consulta ${modules}${odds ? `, cuotas ${odds}` : ""}, horario y estadio.`,
    it: `${teams}: pronostico di oggi${focus ? ` per ${focus}` : ""}. Consulta ${modules}${odds ? `, quote ${odds}` : ""}, orario e stadio.`,
    fr: `${teams} : pronostic du jour${focus ? ` pour ${focus}` : ""}. Consultez ${modules}${odds ? `, cotes ${odds}` : ""}, horaire et stade.`,
    de: `${teams}: heutige Prognose${focus ? ` für ${focus}` : ""}. Mit ${modules}${odds ? `, Quote ${odds}` : ""}, Anstoßzeit und Stadion.`,
  }[locale];
  if (candidates.length <= 160) return candidates;
  const compact = candidates.replace(/, (?:kick-off time and venue|horário e estádio|horario y estadio|orario e stadio|horaire et stade|Anstoßzeit und Stadion)\.$/, ".");
  if (compact.length <= 160) return compact;
  const focusedCompact = `${teams}: ${sentenceCase(localeSearchResearch[locale].prediction)}${focus ? ` — ${focus}` : ""}. ${sentenceCase(modules)}${odds ? `, ${localeSearchResearch[locale].odds} ${odds}` : ""}.`;
  return focusedCompact.length <= 160
    ? focusedCompact
    : `${teams}: ${sentenceCase(localeSearchResearch[locale].prediction)}. ${sentenceCase(modules)}${odds ? `, ${localeSearchResearch[locale].odds} ${odds}` : ""}.`;
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
    const modules = [];
    if (facts.hasLineups) modules.push(match.matchSeo?.lineups?.status === "confirmed" ? "confirmed lineups" : "probable lineups");
    if (facts.hasInjuries) modules.push("injury news");
    if (facts.hasStatistics) modules.push("statistics");
    if (facts.hasH2h) modules.push("head-to-head");
    if (facts.odds) modules.push("odds comparison");

    return fitDescription([
      `${teams} prediction${when}: ${pick}${odds}. Check ${modules.slice(0, 4).join(", ")} for this ${facts.leagueName} match.`,
      `${teams} prediction${when}, ${pick}${odds}. Review ${modules.slice(0, 3).join(", ")} before the match.`,
      `${teams} prediction${when}: ${pick}${odds}. Full analysis with ${modules.slice(0, 2).join(" and ")} for ${facts.leagueName}.`,
      `${teams} prediction${when} and match analysis for ${facts.leagueName}.`,
    ]);
  }
  const detailed = [
    `${teams} prediction${when} in ${facts.leagueName}. Our main pick is ${pick}${odds}, with match analysis and relevant betting context.`,
    `Read the ${teams} match analysis${when}, including ${pick}${odds} and the key context for this ${facts.leagueName} fixture.`,
    `${facts.leagueName}: ${teams}. View our prediction${when}, ${pick}${odds}, and the reasoning behind the selection.`,
    `Our ${teams} betting analysis${when} covers ${pick}${odds} and the relevant ${facts.leagueName} match context.`,
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
    const facts = readMatchFacts(match);
    const secondary = [
      facts.hasLineups ? (match.matchSeo.lineups?.status === "confirmed" ? "Lineups" : "Probable Lineups") : "",
      facts.hasStatistics ? "Stats" : "",
      facts.hasInjuries || facts.hasAvailability ? "Injuries" : "",
      facts.odds ? "Odds" : "",
    ].filter(Boolean).slice(0, 3);
    const capability = `Prediction${secondary.length ? `, ${secondary.join(" & ")}` : " & Analysis"}`;
    const structuredTitle = `${teams} ${capability}`;
    const leagueName = leaguesBySlug[match.league]?.name ?? match.league;
    const competitionTitle = `${structuredTitle} | ${leagueName}`;
    if (competitionTitle.length <= 60) return competitionTitle;
    const compactSecondary = secondary.slice(0, 2).join(" & ");
    const compactCapability = compactSecondary ? `Prediction, ${compactSecondary}` : "Prediction & Odds";
    const compactStructured = `${teams} ${compactCapability}`;
    const compactCompetitionTitle = `${compactStructured} | ${leagueName}`;
    if (compactCompetitionTitle.length <= 68) return compactCompetitionTitle;
    const minimalCompetition = `${teams} Prediction | ${leagueName}`;
    if (minimalCompetition.length <= 70) return minimalCompetition;
    return compactStructured.length <= 65 ? compactStructured : `${teams} Prediction`;
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
