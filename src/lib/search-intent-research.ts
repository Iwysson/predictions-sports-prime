export const searchIntentLocales = [
  "en",
  "pt-BR",
  "es",
  "fr",
  "de",
  "it",
  "nl",
  "tr",
  "id",
  "vi",
  "ar",
  "ja",
  "ko",
  "th",
] as const;

export type SearchLocale = (typeof searchIntentLocales)[number];

export type SearchIntentCategory =
  | "MATCH"
  | "PREDICTION"
  | "BETTING"
  | "ODDS"
  | "ANALYSIS"
  | "PREVIEW"
  | "FORM"
  | "H2H"
  | "STATISTICS"
  | "STANDINGS"
  | "MARKET"
  | "TEMPORAL"
  | "LEAGUE"
  | "BRAND";

export type SearchTermConfidence =
  | "HIGH_CONFIDENCE"
  | "MEDIUM_CONFIDENCE"
  | "EXPERIMENTAL";

export type SearchResearchStatus =
  | "VALIDATED"
  | "RESEARCHED"
  | "FALLBACK"
  | "NEEDS_MORE_DATA";

export type SearchTermSource =
  | "GOOGLE_TRENDS"
  | "SEARCH_CONSOLE"
  | "SERP_USAGE"
  | "EXISTING_SITE_PERFORMANCE"
  | "LANGUAGE_CONVENTION";

export type MarketIntentKey =
  | "ASIAN_HANDICAP"
  | "OVER_UNDER"
  | "BTTS"
  | "DOUBLE_CHANCE"
  | "CORNERS"
  | "DRAW_NO_BET"
  | "WIN"
  | "COMBINED";

type LocaleSearchResearch = {
  status: SearchResearchStatus;
  confidence: SearchTermConfidence;
  sources: SearchTermSource[];
  separator: string;
  prediction: string;
  footballPrediction: string;
  betting: string;
  odds: string;
  analysis: string;
  preview: string;
  form: string;
  h2h: string;
  statistics: string;
  standings: string;
  temporal: {
    today: string;
    tomorrow: string;
    upcoming: string;
    historical: string;
  };
  markets: Record<MarketIntentKey, string>;
};

const serpAndConvention: SearchTermSource[] = [
  "SERP_USAGE",
  "LANGUAGE_CONVENTION",
];

export const localeSearchResearch: Record<SearchLocale, LocaleSearchResearch> = {
  en: {
    status: "VALIDATED", confidence: "HIGH_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "prediction", footballPrediction: "football predictions", betting: "betting tips", odds: "odds", analysis: "match analysis", preview: "match preview",
    form: "form", h2h: "H2H", statistics: "stats", standings: "standings",
    temporal: { today: "today", tomorrow: "tomorrow", upcoming: "upcoming", historical: "result" },
    markets: { ASIAN_HANDICAP: "Asian handicap", OVER_UNDER: "over/under", BTTS: "both teams to score", DOUBLE_CHANCE: "double chance", CORNERS: "corners", DRAW_NO_BET: "draw no bet", WIN: "match winner", COMBINED: "combined bet" },
  },
  "pt-BR": {
    status: "VALIDATED", confidence: "HIGH_CONFIDENCE", sources: serpAndConvention, separator: "x",
    prediction: "palpite", footballPrediction: "palpites de futebol", betting: "dicas de apostas", odds: "odds", analysis: "análise do jogo", preview: "prévia do jogo",
    form: "momento", h2h: "confronto direto", statistics: "estatísticas", standings: "classificação",
    temporal: { today: "hoje", tomorrow: "amanhã", upcoming: "próximo jogo", historical: "resultado" },
    markets: { ASIAN_HANDICAP: "handicap asiático", OVER_UNDER: "mais/menos gols", BTTS: "ambas marcam", DOUBLE_CHANCE: "dupla chance", CORNERS: "escanteios", DRAW_NO_BET: "empate anula aposta", WIN: "vencedor do jogo", COMBINED: "mercado combinado" },
  },
  es: {
    status: "VALIDATED", confidence: "HIGH_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "pronóstico", footballPrediction: "pronósticos de fútbol", betting: "apuestas", odds: "cuotas", analysis: "análisis del partido", preview: "previa del partido",
    form: "forma", h2h: "enfrentamientos", statistics: "estadísticas", standings: "clasificación",
    temporal: { today: "hoy", tomorrow: "mañana", upcoming: "próximo partido", historical: "resultado" },
    markets: { ASIAN_HANDICAP: "hándicap asiático", OVER_UNDER: "más/menos goles", BTTS: "ambos marcan", DOUBLE_CHANCE: "doble oportunidad", CORNERS: "córners", DRAW_NO_BET: "empate no apuesta", WIN: "ganador del partido", COMBINED: "mercado combinado" },
  },
  fr: {
    status: "RESEARCHED", confidence: "HIGH_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "pronostic", footballPrediction: "pronostics football", betting: "conseils paris", odds: "cotes", analysis: "analyse du match", preview: "avant-match",
    form: "forme", h2h: "confrontations", statistics: "statistiques", standings: "classement",
    temporal: { today: "aujourd'hui", tomorrow: "demain", upcoming: "prochain match", historical: "résultat" },
    markets: { ASIAN_HANDICAP: "handicap asiatique", OVER_UNDER: "plus/moins de buts", BTTS: "les deux équipes marquent", DOUBLE_CHANCE: "double chance", CORNERS: "corners", DRAW_NO_BET: "remboursé si nul", WIN: "vainqueur du match", COMBINED: "pari combiné" },
  },
  de: {
    status: "RESEARCHED", confidence: "HIGH_CONFIDENCE", sources: serpAndConvention, separator: "gegen",
    prediction: "Prognose", footballPrediction: "Fußball Prognosen", betting: "Wett-Tipps", odds: "Quoten", analysis: "Spielanalyse", preview: "Spielvorschau",
    form: "Form", h2h: "Direktvergleich", statistics: "Statistik", standings: "Tabelle",
    temporal: { today: "heute", tomorrow: "morgen", upcoming: "nächstes Spiel", historical: "Ergebnis" },
    markets: { ASIAN_HANDICAP: "Asian Handicap", OVER_UNDER: "Über/Unter", BTTS: "beide Teams treffen", DOUBLE_CHANCE: "Doppelte Chance", CORNERS: "Ecken", DRAW_NO_BET: "Unentschieden keine Wette", WIN: "Spielsieger", COMBINED: "Kombiwette" },
  },
  it: {
    status: "RESEARCHED", confidence: "HIGH_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "pronostico", footballPrediction: "pronostici calcio", betting: "scommesse", odds: "quote", analysis: "analisi della partita", preview: "anteprima",
    form: "forma", h2h: "precedenti", statistics: "statistiche", standings: "classifica",
    temporal: { today: "oggi", tomorrow: "domani", upcoming: "prossima partita", historical: "risultato" },
    markets: { ASIAN_HANDICAP: "handicap asiatico", OVER_UNDER: "under/over", BTTS: "gol/no gol", DOUBLE_CHANCE: "doppia chance", CORNERS: "calci d'angolo", DRAW_NO_BET: "draw no bet", WIN: "vincente partita", COMBINED: "scommessa combinata" },
  },
  nl: {
    status: "RESEARCHED", confidence: "HIGH_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "voorspelling", footballPrediction: "voetbal voorspellingen", betting: "wedtips", odds: "odds", analysis: "wedstrijdanalyse", preview: "wedstrijdvoorbeschouwing",
    form: "vorm", h2h: "onderlinge resultaten", statistics: "statistieken", standings: "stand",
    temporal: { today: "vandaag", tomorrow: "morgen", upcoming: "volgende wedstrijd", historical: "resultaat" },
    markets: { ASIAN_HANDICAP: "Asian handicap", OVER_UNDER: "over/under goals", BTTS: "beide teams scoren", DOUBLE_CHANCE: "dubbele kans", CORNERS: "corners", DRAW_NO_BET: "gelijkspel geen inzet", WIN: "wedstrijdwinnaar", COMBINED: "combi bet" },
  },
  tr: {
    status: "RESEARCHED", confidence: "MEDIUM_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "maç tahmini", footballPrediction: "futbol tahminleri", betting: "bahis ipuçları", odds: "oranlar", analysis: "maç analizi", preview: "maç önizlemesi",
    form: "form", h2h: "ikili rekabet", statistics: "istatistikler", standings: "puan durumu",
    temporal: { today: "bugün", tomorrow: "yarın", upcoming: "yaklaşan maç", historical: "sonuç" },
    markets: { ASIAN_HANDICAP: "Asya handikap", OVER_UNDER: "alt/üst", BTTS: "karşılıklı gol", DOUBLE_CHANCE: "çifte şans", CORNERS: "korner", DRAW_NO_BET: "beraberlikte iade", WIN: "maç sonucu", COMBINED: "kombine bahis" },
  },
  id: {
    status: "RESEARCHED", confidence: "MEDIUM_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "prediksi", footballPrediction: "prediksi bola", betting: "tips taruhan", odds: "odds", analysis: "analisis pertandingan", preview: "pratinjau pertandingan",
    form: "performa", h2h: "head to head", statistics: "statistik", standings: "klasemen",
    temporal: { today: "hari ini", tomorrow: "besok", upcoming: "pertandingan berikutnya", historical: "hasil" },
    markets: { ASIAN_HANDICAP: "handicap Asia", OVER_UNDER: "over/under", BTTS: "kedua tim mencetak gol", DOUBLE_CHANCE: "peluang ganda", CORNERS: "tendangan sudut", DRAW_NO_BET: "seri taruhan kembali", WIN: "pemenang pertandingan", COMBINED: "pasar gabungan" },
  },
  vi: {
    status: "RESEARCHED", confidence: "MEDIUM_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "dự đoán", footballPrediction: "dự đoán bóng đá", betting: "soi kèo", odds: "tỷ lệ cược", analysis: "phân tích trận đấu", preview: "nhận định trận đấu",
    form: "phong độ", h2h: "đối đầu", statistics: "thống kê", standings: "bảng xếp hạng",
    temporal: { today: "hôm nay", tomorrow: "ngày mai", upcoming: "trận sắp tới", historical: "kết quả" },
    markets: { ASIAN_HANDICAP: "kèo châu Á", OVER_UNDER: "tài/xỉu", BTTS: "cả hai đội ghi bàn", DOUBLE_CHANCE: "cơ hội kép", CORNERS: "phạt góc", DRAW_NO_BET: "hòa hoàn tiền", WIN: "đội thắng", COMBINED: "kèo kết hợp" },
  },
  ar: {
    status: "RESEARCHED", confidence: "MEDIUM_CONFIDENCE", sources: serpAndConvention, separator: "ضد",
    prediction: "توقعات المباراة", footballPrediction: "توقعات كرة القدم", betting: "نصائح المراهنات", odds: "احتمالات", analysis: "تحليل المباراة", preview: "تقديم المباراة",
    form: "مستوى الفريق", h2h: "مواجهات مباشرة", statistics: "إحصائيات", standings: "ترتيب",
    temporal: { today: "اليوم", tomorrow: "غدًا", upcoming: "المباراة القادمة", historical: "النتيجة" },
    markets: { ASIAN_HANDICAP: "الهانديكاب الآسيوي", OVER_UNDER: "أكثر/أقل", BTTS: "تسجيل الفريقين", DOUBLE_CHANCE: "الفرصة المزدوجة", CORNERS: "ركنيات", DRAW_NO_BET: "تعادل لا رهان", WIN: "الفائز بالمباراة", COMBINED: "رهان مركب" },
  },
  ja: {
    status: "RESEARCHED", confidence: "MEDIUM_CONFIDENCE", sources: serpAndConvention, separator: "vs",
    prediction: "試合予想", footballPrediction: "サッカー予想", betting: "ベッティング予想", odds: "オッズ", analysis: "試合分析", preview: "試合プレビュー",
    form: "チーム状態", h2h: "対戦成績", statistics: "統計", standings: "順位表",
    temporal: { today: "今日", tomorrow: "明日", upcoming: "次の試合", historical: "結果" },
    markets: { ASIAN_HANDICAP: "アジアンハンディキャップ", OVER_UNDER: "オーバー・アンダー", BTTS: "両チーム得点", DOUBLE_CHANCE: "ダブルチャンス", CORNERS: "コーナー", DRAW_NO_BET: "ドローノーベット", WIN: "勝敗予想", COMBINED: "複合ベット" },
  },
  ko: {
    status: "NEEDS_MORE_DATA", confidence: "EXPERIMENTAL", sources: ["LANGUAGE_CONVENTION"], separator: "vs",
    prediction: "경기 예측", footballPrediction: "축구 경기 예측", betting: "베팅 팁", odds: "배당률", analysis: "경기 분석", preview: "경기 프리뷰",
    form: "최근 폼", h2h: "상대 전적", statistics: "통계", standings: "순위",
    temporal: { today: "오늘", tomorrow: "내일", upcoming: "다음 경기", historical: "결과" },
    markets: { ASIAN_HANDICAP: "아시안 핸디캡", OVER_UNDER: "오버/언더", BTTS: "양 팀 득점", DOUBLE_CHANCE: "더블 찬스", CORNERS: "코너킥", DRAW_NO_BET: "무승부 적특", WIN: "경기 승자", COMBINED: "조합 베팅" },
  },
  th: {
    status: "RESEARCHED", confidence: "MEDIUM_CONFIDENCE", sources: serpAndConvention, separator: "พบ",
    prediction: "ทีเด็ดบอล", footballPrediction: "ทีเด็ดฟุตบอล", betting: "ทีเด็ดเดิมพัน", odds: "อัตราต่อรอง", analysis: "วิเคราะห์บอล", preview: "พรีวิวการแข่งขัน",
    form: "ฟอร์ม", h2h: "สถิติพบกัน", statistics: "สถิติ", standings: "ตารางคะแนน",
    temporal: { today: "วันนี้", tomorrow: "พรุ่งนี้", upcoming: "นัดถัดไป", historical: "ผลการแข่งขัน" },
    markets: { ASIAN_HANDICAP: "แฮนดิแคปเอเชีย", OVER_UNDER: "สูง/ต่ำ", BTTS: "ทั้งสองทีมทำประตู", DOUBLE_CHANCE: "โอกาสสองทาง", CORNERS: "ลูกเตะมุม", DRAW_NO_BET: "เสมอคืนทุน", WIN: "ทีมชนะ", COMBINED: "เดิมพันแบบผสม" },
  },
};

const teamAliases: Record<string, readonly string[]> = {
  "Manchester City": ["Man City"],
  "Manchester United": ["Man United", "Man Utd"],
  "Paris Saint-Germain": ["PSG"],
  "Internazionale Milano": ["Inter Milan", "Inter"],
  "Inter": ["Inter Milan"],
};

export function getTeamSearchAliases(team: string) {
  return teamAliases[team] ?? [];
}
