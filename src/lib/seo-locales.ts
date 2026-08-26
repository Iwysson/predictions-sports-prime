import type { LeagueConfig } from "@/data/leagues";

export const seoLocaleSlugs = ["pt-br", "es", "fr", "de"] as const;
export type SeoLocaleSlug = (typeof seoLocaleSlugs)[number];
export type SeoLocale = "en" | SeoLocaleSlug;

type LocaleCopy = {
  htmlLang: string;
  displayName: string;
  homeTitle: string;
  homeDescription: string;
  homeH1: string;
  homeIntro: string;
  today: string;
  tomorrow: string;
  upcoming: string;
  leagues: string;
  methodology: string;
  results: string;
  viewAnalysis: string;
  matchAnalysis: string;
  mainPrediction: string;
  odds: string;
  published: string;
  sources: string;
  responsible: string;
  leagueTitle: (league: string) => string;
  leagueDescription: (league: string) => string;
  leagueIntro: (league: string) => string;
  leagueMethodology: string;
  matchTitle: (home: string, away: string) => string;
  matchH1: (home: string, away: string) => string;
  matchDescription: (home: string, away: string, league: string) => string;
  separator: "vs" | "x";
};

export const seoLocales: Record<SeoLocaleSlug, LocaleCopy> = {
  "pt-br": {
    htmlLang: "pt-BR",
    displayName: "Português (Brasil)",
    homeTitle: "Palpites de Futebol Hoje e Prognósticos | Predictions Sports Prime",
    homeDescription: "Palpites de futebol, prognósticos e análises de partidas para hoje, amanhã e os próximos jogos.",
    homeH1: "Palpites de Futebol Hoje e Prognósticos",
    homeIntro: "Acompanhe palpites independentes, prognósticos e análises de partidas publicados antes dos jogos, com odds registradas e resultados preservados.",
    today: "Palpites de hoje", tomorrow: "Palpites de amanhã", upcoming: "Próximos palpites",
    leagues: "Ligas", methodology: "Metodologia", results: "Resultados", viewAnalysis: "Ver análise",
    matchAnalysis: "Análise da partida", mainPrediction: "Palpite principal", odds: "Odds", published: "Publicado",
    sources: "Fontes e dados", responsible: "Conteúdo apenas informativo. Aposte com responsabilidade e somente onde for permitido por lei.",
    leagueTitle: (league) => `Palpites e Prognósticos da ${league} | Predictions Sports Prime`,
    leagueDescription: (league) => `Confira palpites, prognósticos e análises publicadas para partidas da ${league}.`,
    leagueIntro: (league) => `Este hub reúne análises editoriais publicadas para a ${league}. Cada página preserva o palpite, as odds registradas e os riscos descritos antes da partida.`,
    leagueMethodology: "As análises são preparadas individualmente antes do início de cada jogo. Forma recente, contexto da competição, desempenho como mandante e visitante e preço de mercado podem ser considerados quando existem fontes adequadas. Nenhum desses elementos garante um resultado, e palpites vencedores e perdedores permanecem no histórico público.",
    matchTitle: (home, away) => `${home} x ${away}: Palpite e Odds | Predictions Sports Prime`,
    matchH1: (home, away) => `${home} x ${away}: Palpite e Análise`,
    matchDescription: (home, away, league) => `Confira o palpite para ${home} x ${away}, a análise da partida e as odds publicadas para este confronto da ${league}.`,
    separator: "x",
  },
  es: {
    htmlLang: "es", displayName: "Español",
    homeTitle: "Pronósticos de Fútbol Hoy y Predicciones | Predictions Sports Prime",
    homeDescription: "Pronósticos de fútbol, consejos de apuestas y análisis para los partidos de hoy, mañana y próximos encuentros.",
    homeH1: "Pronósticos de Fútbol Hoy y Predicciones",
    homeIntro: "Consulta pronósticos independientes y análisis publicados antes de los partidos, con cuotas registradas y resultados conservados.",
    today: "Pronósticos de hoy", tomorrow: "Pronósticos de mañana", upcoming: "Próximos pronósticos",
    leagues: "Ligas", methodology: "Metodología", results: "Resultados", viewAnalysis: "Ver análisis",
    matchAnalysis: "Análisis del partido", mainPrediction: "Pronóstico principal", odds: "Cuotas", published: "Publicado",
    sources: "Fuentes y datos", responsible: "Contenido exclusivamente informativo. Apuesta con responsabilidad y solo donde sea legal.",
    leagueTitle: (league) => `Pronósticos de la ${league} | Predictions Sports Prime`,
    leagueDescription: (league) => `Consulta pronósticos y análisis publicados para partidos de la ${league}.`,
    leagueIntro: (league) => `Este centro reúne análisis editoriales publicados para la ${league}. Cada página conserva el pronóstico, las cuotas registradas y los riesgos descritos antes del partido.`,
    leagueMethodology: "Los análisis se preparan individualmente antes del inicio de cada partido. La forma reciente, el contexto de la competición, el rendimiento como local y visitante y el precio de mercado pueden considerarse cuando existen fuentes adecuadas. Ninguno de estos elementos garantiza un resultado, y los pronósticos acertados y fallidos permanecen en el historial público.",
    matchTitle: (home, away) => `${home} vs ${away}: Pronóstico y Cuotas | Predictions Sports Prime`,
    matchH1: (home, away) => `${home} vs ${away}: Pronóstico y Análisis`,
    matchDescription: (home, away, league) => `Consulta el pronóstico de ${home} vs ${away}, el análisis y las cuotas publicadas para este partido de la ${league}.`,
    separator: "vs",
  },
  fr: {
    htmlLang: "fr", displayName: "Français",
    homeTitle: "Pronostics Football Aujourd'hui | Predictions Sports Prime",
    homeDescription: "Pronostics football, conseils de paris et analyses pour les matchs d’aujourd’hui, de demain et à venir.",
    homeH1: "Pronostics Football Aujourd'hui",
    homeIntro: "Consultez des pronostics indépendants et des analyses publiées avant les matchs, avec les cotes enregistrées et les résultats conservés.",
    today: "Pronostics du jour", tomorrow: "Pronostics de demain", upcoming: "Prochains pronostics",
    leagues: "Compétitions", methodology: "Méthodologie", results: "Résultats", viewAnalysis: "Voir l’analyse",
    matchAnalysis: "Analyse du match", mainPrediction: "Pronostic principal", odds: "Cotes", published: "Publié",
    sources: "Sources et données", responsible: "Contenu fourni uniquement à titre informatif. Pariez de manière responsable et uniquement là où la loi l’autorise.",
    leagueTitle: (league) => `Pronostics ${league} | Predictions Sports Prime`,
    leagueDescription: (league) => `Consultez les pronostics et analyses publiés pour les matchs de ${league}.`,
    leagueIntro: (league) => `Ce hub réunit les analyses éditoriales publiées pour la ${league}. Chaque page conserve le pronostic, les cotes enregistrées et les risques décrits avant le match.`,
    leagueMethodology: "Les analyses sont préparées individuellement avant le début de chaque match. La forme récente, le contexte de la compétition, les performances à domicile et à l’extérieur ainsi que le prix du marché peuvent être pris en compte lorsque des sources appropriées existent. Aucun de ces éléments ne garantit un résultat, et les pronostics gagnants comme perdants restent dans l’historique public.",
    matchTitle: (home, away) => `${home} vs ${away} : Pronostic et Cotes | Predictions Sports Prime`,
    matchH1: (home, away) => `${home} vs ${away} : Pronostic et Analyse`,
    matchDescription: (home, away, league) => `Découvrez le pronostic de ${home} vs ${away}, l’analyse et les cotes publiées pour ce match de ${league}.`,
    separator: "vs",
  },
  de: {
    htmlLang: "de", displayName: "Deutsch",
    homeTitle: "Fußball Prognosen Heute & Wett-Tipps | Predictions Sports Prime",
    homeDescription: "Fußball-Prognosen, Wett-Tipps und Spielanalysen für heutige, morgige und kommende Partien.",
    homeH1: "Fußball Prognosen Heute & Wett-Tipps",
    homeIntro: "Lesen Sie unabhängige Prognosen und Analysen, die vor den Spielen veröffentlicht werden, mit erfassten Quoten und dauerhaft dokumentierten Ergebnissen.",
    today: "Heutige Prognosen", tomorrow: "Prognosen für morgen", upcoming: "Kommende Prognosen",
    leagues: "Ligen", methodology: "Methodik", results: "Ergebnisse", viewAnalysis: "Analyse ansehen",
    matchAnalysis: "Spielanalyse", mainPrediction: "Hauptprognose", odds: "Quoten", published: "Veröffentlicht",
    sources: "Quellen und Daten", responsible: "Nur zu Informationszwecken. Spielen Sie verantwortungsvoll und nur dort, wo es gesetzlich erlaubt ist.",
    leagueTitle: (league) => `${league} Prognosen | Predictions Sports Prime`,
    leagueDescription: (league) => `Lesen Sie veröffentlichte Prognosen und Analysen zu Spielen der ${league}.`,
    leagueIntro: (league) => `Dieser Hub bündelt veröffentlichte redaktionelle Analysen zur ${league}. Jede Seite bewahrt die Prognose, die erfassten Quoten und die vor dem Spiel beschriebenen Risiken.`,
    leagueMethodology: "Die Analysen werden vor Beginn jeder Partie einzeln erstellt. Aktuelle Form, Wettbewerbskontext, Heim- und Auswärtsleistung sowie Marktpreise können berücksichtigt werden, wenn geeignete Quellen vorliegen. Keiner dieser Faktoren garantiert ein Ergebnis; erfolgreiche und verlorene Tipps bleiben gleichermaßen im öffentlichen Verlauf dokumentiert. Die veröffentlichte Auswahl wird nach dem Spiel nicht rückwirkend geändert und kann zusammen mit dem erfassten Ergebnis überprüft werden.",
    matchTitle: (home, away) => `${home} vs ${away}: Prognose & Quoten | Predictions Sports Prime`,
    matchH1: (home, away) => `${home} vs ${away}: Prognose und Analyse`,
    matchDescription: (home, away, league) => `Lesen Sie die Prognose zu ${home} vs ${away}, die Spielanalyse und die veröffentlichten Quoten für diese ${league}-Partie.`,
    separator: "vs",
  },
};

export function isSeoLocale(value: string): value is SeoLocaleSlug {
  return seoLocaleSlugs.includes(value as SeoLocaleSlug);
}

export function localePath(locale: SeoLocale, path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? normalized : `/${locale}${normalized}`;
}

export function localizedLeagueName(league: LeagueConfig) {
  return league.slug === "brasileirao-serie-a" ? "Brasileirão Série A" : league.name;
}
