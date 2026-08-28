import type { NFLGame } from "@/types/nfl";
import type { SeoLocale } from "@/lib/seo-locales";

const terms: Record<SeoLocale, { prediction: string; picks: string; analysis: string; injuries: string; starters: string; venue: string; odds: string; standings: string }> = {
  en: { prediction: "prediction", picks: "picks", analysis: "analysis", injuries: "injury report", starters: "projected starters", venue: "stadium", odds: "odds", standings: "NFL standings" },
  "pt-br": { prediction: "palpite", picks: "prognóstico", analysis: "análise", injuries: "lesões", starters: "titulares projetados", venue: "onde será o jogo", odds: "odds", standings: "classificação NFL" },
  es: { prediction: "pronóstico", picks: "predicción", analysis: "análisis", injuries: "lesionados", starters: "titulares previstos", venue: "estadio", odds: "cuotas", standings: "clasificación NFL" },
  fr: { prediction: "pronostic", picks: "sélections", analysis: "analyse", injuries: "blessures", starters: "titulaires projetés", venue: "stade", odds: "cotes", standings: "classement NFL" },
  de: { prediction: "Prognose", picks: "Tipps", analysis: "Analyse", injuries: "Verletzungen", starters: "voraussichtliche Starter", venue: "Stadion", odds: "Quoten", standings: "NFL Tabelle" },
  it: { prediction: "pronostico", picks: "scelte", analysis: "analisi", injuries: "infortuni", starters: "titolari previsti", venue: "stadio", odds: "quote", standings: "classifica NFL" },
  nl: { prediction: "voorspelling", picks: "wedtips", analysis: "analyse", injuries: "blessures", starters: "verwachte starters", venue: "stadion", odds: "odds", standings: "NFL stand" },
  tr: { prediction: "tahmini", picks: "bahis tahminleri", analysis: "analizi", injuries: "sakatlık raporu", starters: "beklenen ilk oyuncular", venue: "stadyum", odds: "oranları", standings: "NFL puan durumu" },
};

export function buildNFLSearchIntent(game: NFLGame, locale: SeoLocale = "en") {
  const separator = locale === "pt-br" ? "x" : "vs";
  const matchup = `${game.awayTeamShort} ${separator} ${game.homeTeamShort}`;
  const t = terms[locale];
  const query = (suffix: string) => `${matchup} ${suffix}`;
  return {
    primaryQuery: query(t.prediction),
    secondaryQueries: [t.picks, t.analysis, t.injuries, t.starters, t.venue, t.odds].map(query),
    predictionQueries: [query(t.prediction), query(t.picks)], injuryQueries: [query(t.injuries)],
    lineupQueries: [query(t.starters)], venueQueries: [query(t.venue)], oddsQueries: [query(t.odds)],
    standingsQueries: [t.standings, `${t.standings} 2026`, `AFC ${t.standings}`, `NFC ${t.standings}`],
    temporalQueries: [`${matchup} NFL ${locale === "pt-br" ? "semana" : "Week"} 1`],
  };
}
