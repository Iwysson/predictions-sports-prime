import type { SeoLocale } from "@/lib/seo-locales";

export type NFLCopy = {
  title: string; description: string; h1: string; subheading: string; season: string;
  week: string; weekHeading: string; prediction: string; analysis: string; odds: string;
  americanOdds: string; venueKickoff: string; venue: string; kickoff: string;
  available: string; awayAtHome: string; previous: string; next: string;
};

// The published NFL week. Bump this when a new week goes live (src/data/nfl/week<N>-*-public.ts):
// title, description, week and weekHeading below are all derived from it, so the search snippet
// stays current without touching every locale string by hand.
const CURRENT_WEEK = 5;

type WeekCopy = {
  title: (week: number) => string;
  description: (week: number) => string;
  h1: string; subheading: string; season: string;
  weekLabel: (week: number) => string; weekHeadingLabel: (week: number) => string;
  prediction: string; analysis: string; odds: string; americanOdds: string;
  venueKickoff: string; venue: string; kickoff: string;
  available: string; awayAtHome: string; previous: string; next: string;
};

const copies: Record<SeoLocale, WeekCopy> = {
  en: {
    title: (w) => `NFL Week ${w} Predictions, Odds & Picks | Predictions Sports Prime`,
    description: (w) => `NFL Week ${w} predictions and picks for every game: matchup analysis, injuries, projected starters, stadiums and betting odds for the 2026 NFL season.`,
    h1: "NFL Predictions & Analysis", subheading: "Weekly NFL predictions, matchup analysis, injuries, projected starters, stadium information, odds and betting insights.", season: "2026 NFL Season",
    weekLabel: (w) => `Week ${w}`, weekHeadingLabel: (w) => `NFL Week ${w} Predictions`,
    prediction: "Prediction", analysis: "Match Analysis", odds: "Odds", americanOdds: "American Odds", venueKickoff: "Venue & Kickoff", venue: "Venue", kickoff: "Kickoff", available: "Prediction available", awayAtHome: "at", previous: "Previous week", next: "Next week",
  },
  "pt-br": {
    title: (w) => `Palpites NFL Semana ${w}: Prognósticos e Odds | Predictions Sports Prime`,
    description: (w) => `Palpites da NFL para a Semana ${w}: prognóstico de cada jogo, análise do confronto, lesões, titulares projetados, estádio e odds da temporada 2026.`,
    h1: "Palpites e Análises da NFL", subheading: "Palpites semanais da NFL, análise dos confrontos, lesões, titulares projetados, estádios, odds e informações de apostas.", season: "Temporada 2026 da NFL",
    weekLabel: (w) => `Semana ${w}`, weekHeadingLabel: (w) => `Palpites NFL — Semana ${w}`,
    prediction: "Palpite", analysis: "Análise da Partida", odds: "Odds", americanOdds: "Odds Americanas", venueKickoff: "Estádio e Horário", venue: "Estádio", kickoff: "Horário", available: "Palpite disponível", awayAtHome: "em", previous: "Semana anterior", next: "Próxima semana",
  },
  es: {
    title: (w) => `Pronósticos NFL Semana ${w}: Picks y Cuotas | Predictions Sports Prime`,
    description: (w) => `Pronósticos NFL de la Semana ${w} para cada partido: análisis del enfrentamiento, lesiones, titulares previstos, estadio y cuotas de la temporada 2026.`,
    h1: "Pronósticos y Análisis NFL", subheading: "Pronósticos semanales NFL, análisis de enfrentamientos, lesiones, titulares previstos, estadios, cuotas y apuestas.", season: "Temporada NFL 2026",
    weekLabel: (w) => `Semana ${w}`, weekHeadingLabel: (w) => `Pronósticos NFL — Semana ${w}`,
    prediction: "Pronóstico", analysis: "Análisis del Partido", odds: "Cuotas", americanOdds: "Cuotas Americanas", venueKickoff: "Estadio y Horario", venue: "Estadio", kickoff: "Hora de inicio", available: "Pronóstico disponible", awayAtHome: "en", previous: "Semana anterior", next: "Próxima semana",
  },
  fr: {
    title: (w) => `Pronostics NFL Semaine ${w} : Sélections et Cotes | Predictions Sports Prime`,
    description: (w) => `Pronostics NFL de la semaine ${w} pour chaque match : analyse, blessures, titulaires projetés, stades et cotes de la saison 2026.`,
    h1: "Pronostics et Analyses NFL", subheading: "Pronostics NFL hebdomadaires, analyses, blessures, titulaires projetés, stades et cotes.", season: "Saison NFL 2026",
    weekLabel: (w) => `Semaine ${w}`, weekHeadingLabel: (w) => `Pronostics NFL — Semaine ${w}`,
    prediction: "Pronostic", analysis: "Analyse du Match", odds: "Cotes", americanOdds: "Cotes Américaines", venueKickoff: "Stade et Coup d’envoi", venue: "Stade", kickoff: "Coup d’envoi", available: "Pronostic disponible", awayAtHome: "chez", previous: "Semaine précédente", next: "Semaine suivante",
  },
  de: {
    title: (w) => `NFL Woche ${w} Prognosen, Tipps & Quoten | Predictions Sports Prime`,
    description: (w) => `NFL-Prognosen für Woche ${w}: Spielanalyse, Verletzungen, voraussichtliche Starter, Stadien und Quoten der Saison 2026.`,
    h1: "NFL Prognosen & Analysen", subheading: "Wöchentliche NFL Tipps, Matchup-Analysen, Verletzungen, Starter, Stadien und Quoten.", season: "NFL-Saison 2026",
    weekLabel: (w) => `Woche ${w}`, weekHeadingLabel: (w) => `NFL Woche ${w} Tipps`,
    prediction: "Prognose", analysis: "Spielanalyse", odds: "Quoten", americanOdds: "Amerikanische Quoten", venueKickoff: "Stadion & Kickoff", venue: "Stadion", kickoff: "Kickoff", available: "Prognose verfügbar", awayAtHome: "bei", previous: "Vorherige Woche", next: "Nächste Woche",
  },
  it: {
    title: (w) => `Pronostici NFL Settimana ${w}: Scelte e Quote | Predictions Sports Prime`,
    description: (w) => `Pronostici NFL della settimana ${w} per ogni partita: analisi, infortuni, titolari previsti, stadi e quote della stagione 2026.`,
    h1: "Pronostici e Analisi NFL", subheading: "Pronostici NFL settimanali, analisi, infortuni, titolari previsti, stadi e quote.", season: "Stagione NFL 2026",
    weekLabel: (w) => `Settimana ${w}`, weekHeadingLabel: (w) => `Pronostici NFL — Settimana ${w}`,
    prediction: "Pronostico", analysis: "Analisi della Partita", odds: "Quote", americanOdds: "Quote Americane", venueKickoff: "Stadio e Orario", venue: "Stadio", kickoff: "Calcio d’inizio", available: "Pronostico disponibile", awayAtHome: "a", previous: "Settimana precedente", next: "Settimana successiva",
  },
  nl: {
    title: (w) => `NFL Week ${w} Voorspellingen & Odds | Predictions Sports Prime`,
    description: (w) => `NFL-voorspellingen voor week ${w}: wedstrijdanalyse, blessures, verwachte starters, stadions en odds van het seizoen 2026.`,
    h1: "NFL Voorspellingen & Analyses", subheading: "Wekelijkse NFL voorspellingen, matchup-analyses, blessures, starters, stadions en odds.", season: "NFL-seizoen 2026",
    weekLabel: (w) => `Week ${w}`, weekHeadingLabel: (w) => `NFL Week ${w} Voorspellingen`,
    prediction: "Voorspelling", analysis: "Wedstrijdanalyse", odds: "Odds", americanOdds: "Amerikaanse Odds", venueKickoff: "Stadion & Aftrap", venue: "Stadion", kickoff: "Aftrap", available: "Voorspelling beschikbaar", awayAtHome: "bij", previous: "Vorige week", next: "Volgende week",
  },
  tr: {
    title: (w) => `NFL ${w}. Hafta Tahminleri ve Oranları | Predictions Sports Prime`,
    description: (w) => `NFL ${w}. hafta için her maçın tahmini: maç analizi, sakatlıklar, beklenen ilk oyuncular, stadyumlar ve 2026 sezonu oranları.`,
    h1: "NFL Tahminleri ve Analizleri", subheading: "Haftalık NFL tahminleri, eşleşme analizleri, sakatlıklar, beklenen oyuncular, stadyumlar ve oranlar.", season: "2026 NFL Sezonu",
    weekLabel: (w) => `${w}. Hafta`, weekHeadingLabel: (w) => `NFL ${w}. Hafta Tahminleri`,
    prediction: "Tahmin", analysis: "Maç Analizi", odds: "Oranlar", americanOdds: "Amerikan Oranları", venueKickoff: "Stadyum ve Başlama", venue: "Stadyum", kickoff: "Başlama", available: "Tahmin mevcut", awayAtHome: "deplasmanda", previous: "Önceki hafta", next: "Sonraki hafta",
  },
};

export function getNFLCopy(locale: SeoLocale): NFLCopy {
  const c = copies[locale];
  return {
    title: c.title(CURRENT_WEEK), description: c.description(CURRENT_WEEK),
    h1: c.h1, subheading: c.subheading, season: c.season,
    week: c.weekLabel(CURRENT_WEEK), weekHeading: c.weekHeadingLabel(CURRENT_WEEK),
    prediction: c.prediction, analysis: c.analysis, odds: c.odds, americanOdds: c.americanOdds,
    venueKickoff: c.venueKickoff, venue: c.venue, kickoff: c.kickoff,
    available: c.available, awayAtHome: c.awayAtHome, previous: c.previous, next: c.next,
  };
}
