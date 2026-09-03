import type { SeoLocale } from "@/lib/seo-locales";

export type HomeFeedCopy = {
  competitions: string;
  topLeagues: string;
  todayEyebrow: string;
  todayTitle: string;
  tomorrowEyebrow: string;
  tomorrowTitle: string;
  upcomingEyebrow: string;
  upcomingTitle: string;
  resultsEyebrow: string;
  resultsTitle: string;
  predictionAvailable: string;
  comingSoon: string;
  nextAvailable: string;
  exploreUpcoming: string;
  viewUpcoming: string;
  noTomorrow: string;
  seeUpcoming: string;
  noUpcoming: string;
  noCompleted: string;
  viewAllResults: string;
  view: string;
  odds: string;
  waitingScore: string;
  entryNotRecorded: string;
  awaitingStats: string;
  predictionsSuffix: string;
};

const localized: Record<Exclude<SeoLocale, "en">, HomeFeedCopy> = {
  "pt-br": {
    competitions: "Competições", topLeagues: "Principais Ligas de Palpites",
    todayEyebrow: "Hoje", todayTitle: "Palpites de Futebol de Hoje",
    tomorrowEyebrow: "Amanhã", tomorrowTitle: "Palpites de Futebol de Amanhã",
    upcomingEyebrow: "Próximos", upcomingTitle: "Próximos Palpites de Futebol",
    resultsEyebrow: "Resultados", resultsTitle: "Últimos Resultados dos Palpites",
    predictionAvailable: "Palpite disponível", comingSoon: "Em breve",
    nextAvailable: "Próximos palpites disponíveis", exploreUpcoming: "Veja as análises de amanhã e dos próximos jogos.",
    viewUpcoming: "Ver próximos palpites", noTomorrow: "Não há jogos publicados para amanhã no momento.",
    seeUpcoming: "Veja os próximos palpites abaixo.", noUpcoming: "Nenhum palpite futuro disponível.",
    noCompleted: "Nenhum palpite concluído ainda.", viewAllResults: "Ver todos os resultados",
    view: "Ver", odds: "Odds", waitingScore: "AGUARDANDO PLACAR", entryNotRecorded: "ENTRADA NÃO REGISTRADA",
    awaitingStats: "AGUARDANDO ESTATÍSTICAS", predictionsSuffix: "palpites",
  },
  es: {
    competitions: "Competiciones", topLeagues: "Principales Ligas de Pronósticos",
    todayEyebrow: "Hoy", todayTitle: "Pronósticos de Fútbol de Hoy",
    tomorrowEyebrow: "Mañana", tomorrowTitle: "Pronósticos de Fútbol de Mañana",
    upcomingEyebrow: "Próximos", upcomingTitle: "Próximos Pronósticos de Fútbol",
    resultsEyebrow: "Resultados", resultsTitle: "Últimos Resultados de Pronósticos",
    predictionAvailable: "Pronóstico disponible", comingSoon: "Próximamente",
    nextAvailable: "Próximos pronósticos disponibles", exploreUpcoming: "Consulta los análisis de mañana y de los próximos partidos.",
    viewUpcoming: "Ver próximos pronósticos", noTomorrow: "No hay partidos publicados para mañana en este momento.",
    seeUpcoming: "Consulta los próximos pronósticos abajo.", noUpcoming: "No hay próximos pronósticos disponibles.",
    noCompleted: "Aún no hay pronósticos finalizados.", viewAllResults: "Ver todos los resultados",
    view: "Ver", odds: "Cuotas", waitingScore: "ESPERANDO RESULTADO", entryNotRecorded: "ENTRADA NO REGISTRADA",
    awaitingStats: "ESPERANDO ESTADÍSTICAS", predictionsSuffix: "pronósticos",
  },
  fr: {
    competitions: "Compétitions", topLeagues: "Principales Ligues de Pronostics",
    todayEyebrow: "Aujourd'hui", todayTitle: "Pronostics Football du Jour",
    tomorrowEyebrow: "Demain", tomorrowTitle: "Pronostics Football de Demain",
    upcomingEyebrow: "À venir", upcomingTitle: "Prochains Pronostics Football",
    resultsEyebrow: "Résultats", resultsTitle: "Derniers Résultats des Pronostics",
    predictionAvailable: "Pronostic disponible", comingSoon: "Bientôt",
    nextAvailable: "Prochains pronostics disponibles", exploreUpcoming: "Consultez les analyses de demain et des prochains matchs.",
    viewUpcoming: "Voir les prochains pronostics", noTomorrow: "Aucun match publié pour demain pour le moment.",
    seeUpcoming: "Consultez les prochains pronostics ci-dessous.", noUpcoming: "Aucun pronostic à venir disponible.",
    noCompleted: "Aucun pronostic terminé pour le moment.", viewAllResults: "Voir tous les résultats",
    view: "Voir", odds: "Cotes", waitingScore: "EN ATTENTE DU SCORE", entryNotRecorded: "MISE NON ENREGISTRÉE",
    awaitingStats: "EN ATTENTE DES STATISTIQUES", predictionsSuffix: "pronostics",
  },
  de: {
    competitions: "Wettbewerbe", topLeagues: "Top-Prognose-Ligen",
    todayEyebrow: "Heute", todayTitle: "Heutige Fußball-Prognosen",
    tomorrowEyebrow: "Morgen", tomorrowTitle: "Morgige Fußball-Prognosen",
    upcomingEyebrow: "Kommend", upcomingTitle: "Kommende Fußball-Prognosen",
    resultsEyebrow: "Ergebnisse", resultsTitle: "Neueste Prognose-Ergebnisse",
    predictionAvailable: "Prognose verfügbar", comingSoon: "Demnächst",
    nextAvailable: "Weitere Prognosen verfügbar", exploreUpcoming: "Sehen Sie Analysen für morgen und kommende Spiele.",
    viewUpcoming: "Kommende Prognosen ansehen", noTomorrow: "Derzeit sind keine Spiele für morgen veröffentlicht.",
    seeUpcoming: "Siehe kommende Prognosen unten.", noUpcoming: "Keine kommenden Prognosen verfügbar.",
    noCompleted: "Noch keine abgeschlossenen Prognosen.", viewAllResults: "Alle Ergebnisse ansehen",
    view: "Ansehen", odds: "Quoten", waitingScore: "ERGEBNIS AUSSTEHEND", entryNotRecorded: "EINTRAG NICHT ERFASST",
    awaitingStats: "STATISTIKEN AUSSTEHEND", predictionsSuffix: "Prognosen",
  },
  it: {
    competitions: "Competizioni", topLeagues: "Principali Campionati di Pronostici",
    todayEyebrow: "Oggi", todayTitle: "Pronostici di Calcio di Oggi",
    tomorrowEyebrow: "Domani", tomorrowTitle: "Pronostici di Calcio di Domani",
    upcomingEyebrow: "In arrivo", upcomingTitle: "Prossimi Pronostici di Calcio",
    resultsEyebrow: "Risultati", resultsTitle: "Ultimi Risultati dei Pronostici",
    predictionAvailable: "Pronostico disponibile", comingSoon: "In arrivo",
    nextAvailable: "Prossimi pronostici disponibili", exploreUpcoming: "Consulta le analisi di domani e delle prossime partite.",
    viewUpcoming: "Vedi prossimi pronostici", noTomorrow: "Al momento non ci sono partite pubblicate per domani.",
    seeUpcoming: "Consulta i prossimi pronostici qui sotto.", noUpcoming: "Nessun pronostico in arrivo disponibile.",
    noCompleted: "Nessun pronostico completato al momento.", viewAllResults: "Vedi tutti i risultati",
    view: "Vedi", odds: "Quote", waitingScore: "IN ATTESA DEL RISULTATO", entryNotRecorded: "INGRESSO NON REGISTRATO",
    awaitingStats: "IN ATTESA DELLE STATISTICHE", predictionsSuffix: "pronostici",
  },
  nl: {
    competitions: "Competities", topLeagues: "Belangrijkste Voorspellingscompetities",
    todayEyebrow: "Vandaag", todayTitle: "Voetbalvoorspellingen van Vandaag",
    tomorrowEyebrow: "Morgen", tomorrowTitle: "Voetbalvoorspellingen voor Morgen",
    upcomingEyebrow: "Komend", upcomingTitle: "Komende Voetbalvoorspellingen",
    resultsEyebrow: "Resultaten", resultsTitle: "Laatste Voorspellingsresultaten",
    predictionAvailable: "Voorspelling beschikbaar", comingSoon: "Binnenkort",
    nextAvailable: "Volgende voorspellingen beschikbaar", exploreUpcoming: "Bekijk analyses voor morgen en komende wedstrijden.",
    viewUpcoming: "Bekijk komende voorspellingen", noTomorrow: "Er zijn momenteel geen wedstrijden voor morgen gepubliceerd.",
    seeUpcoming: "Bekijk de komende voorspellingen hieronder.", noUpcoming: "Geen komende voorspellingen beschikbaar.",
    noCompleted: "Nog geen afgeronde voorspellingen.", viewAllResults: "Bekijk alle resultaten",
    view: "Bekijk", odds: "Odds", waitingScore: "WACHT OP SCORE", entryNotRecorded: "INZET NIET GEREGISTREERD",
    awaitingStats: "WACHT OP STATISTIEKEN", predictionsSuffix: "voorspellingen",
  },
  tr: {
    competitions: "Ligler", topLeagues: "Öne Çıkan Tahmin Ligleri",
    todayEyebrow: "Bugün", todayTitle: "Bugünün Futbol Tahminleri",
    tomorrowEyebrow: "Yarın", tomorrowTitle: "Yarının Futbol Tahminleri",
    upcomingEyebrow: "Yaklaşan", upcomingTitle: "Yaklaşan Futbol Tahminleri",
    resultsEyebrow: "Sonuçlar", resultsTitle: "Son Futbol Tahmin Sonuçları",
    predictionAvailable: "Tahmin mevcut", comingSoon: "Yakında",
    nextAvailable: "Yeni tahminler mevcut", exploreUpcoming: "Yarınki ve yaklaşan maç analizlerini inceleyin.",
    viewUpcoming: "Yaklaşan tahminleri görüntüle", noTomorrow: "Şu anda yarın için yayınlanmış maç yok.",
    seeUpcoming: "Aşağıdaki yaklaşan tahminlere bakın.", noUpcoming: "Yaklaşan tahmin bulunmuyor.",
    noCompleted: "Henüz tamamlanmış tahmin yok.", viewAllResults: "Tüm sonuçları görüntüle",
    view: "Görüntüle", odds: "Oran", waitingScore: "SKOR BEKLENİYOR", entryNotRecorded: "GİRİŞ KAYDEDİLMEDİ",
    awaitingStats: "İSTATİSTİKLER BEKLENİYOR", predictionsSuffix: "tahminleri",
  },
};

const en: HomeFeedCopy = {
  competitions: "Competitions", topLeagues: "Top Prediction Leagues",
  todayEyebrow: "Today", todayTitle: "Today's Football Predictions",
  tomorrowEyebrow: "Tomorrow", tomorrowTitle: "Tomorrow's Football Predictions",
  upcomingEyebrow: "Upcoming", upcomingTitle: "Upcoming Football Predictions",
  resultsEyebrow: "Results", resultsTitle: "Latest Football Prediction Results",
  predictionAvailable: "Prediction available", comingSoon: "Coming soon",
  nextAvailable: "Next predictions available", exploreUpcoming: "Explore tomorrow and upcoming match analyses.",
  viewUpcoming: "View upcoming predictions", noTomorrow: "No published matches are currently available for tomorrow.",
  seeUpcoming: "See the upcoming football predictions below.", noUpcoming: "No upcoming predictions available.",
  noCompleted: "No completed predictions yet.", viewAllResults: "View all results",
  view: "View", odds: "Odds", waitingScore: "WAITING SCORE", entryNotRecorded: "ENTRY NOT RECORDED",
  awaitingStats: "AWAITING STATS", predictionsSuffix: "predictions",
};

export function homeFeedCopy(locale: SeoLocale): HomeFeedCopy {
  return locale === "en" ? en : localized[locale];
}
