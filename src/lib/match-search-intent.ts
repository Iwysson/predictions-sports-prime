import { leagues } from "@/data/leagues";
import { siteConfig } from "@/lib/site-config";
import type { Match } from "@/types";

type SearchLocale = "en" | "pt-BR" | "es" | "fr" | "de" | "it" | "nl" | "tr" | "id" | "vi" | "ar" | "ja" | "ko" | "th";

type MatchSearchIntent = {
  locale: SearchLocale;
  primaryQuery: string;
  secondaryQueries: string[];
  marketQueries: string[];
  statisticalQueries: string[];
  temporalQueries: string[];
  competitionQueries: string[];
};

type SearchIntentCopy = {
  title: (match: Match, locale: SearchLocale) => string;
  h1: (match: Match, locale: SearchLocale) => string;
  description: (match: Match, locale: SearchLocale) => string;
  intro: (match: Match) => string;
  separator: string;
};

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
] as const satisfies readonly SearchLocale[];

const localeCopy: Record<SearchLocale, SearchIntentCopy> = {
  en: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam} Prediction, Betting Tips & Odds | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam} Prediction & Match Analysis`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam} prediction, betting tips and match analysis for ${match.date || "this fixture"}. View our main pick, odds and statistical reasoning.`,
    intro: (match) => `${match.homeTeam} meet ${match.awayTeam} in this preview. Our editorial analysis focuses on the main pick, the market price and the match factors that matter most.`,
  },
  "pt-BR": {
    separator: "x",
    title: (match) => `${match.homeTeam} x ${match.awayTeam}: Palpite, Prognóstico e Odds | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} x ${match.awayTeam}: Palpite e Análise`,
    description: (match) => `${match.homeTeam} x ${match.awayTeam}: palpite, apostas e análise da partida para ${match.date || "este jogo"}. Veja nossa escolha principal, odds e contexto estatístico.`,
    intro: (match) => `${match.homeTeam} x ${match.awayTeam} é um confronto que exige leitura de contexto, forma e mercado. A análise abaixo destaca o palpite principal e os fatores mais relevantes.`,
  },
  es: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: Pronóstico, Apuestas y Cuotas | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: Pronóstico y Análisis`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: pronóstico, apuestas y análisis del partido para ${match.date || "este encuentro"}. Consulta nuestra selección principal, cuotas y argumentos estadísticos.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} se presenta como un partido con lectura táctica y de mercado. La previa resume la selección principal y los puntos clave.`,
  },
  fr: {
    separator: ":",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam} : Pronostic, Paris et Cotes | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam} : Pronostic et Analyse`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam} : pronostic, paris sportifs et analyse du match pour ${match.date || "ce match"}. Consultez notre sélection principale, les cotes et les repères statistiques.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} mérite une lecture précise du contexte, du marché et du niveau des équipes. L'analyse ci-dessous met en avant le pari principal.`,
  },
  de: {
    separator: "gegen",
    title: (match) => `${match.homeTeam} gegen ${match.awayTeam}: Prognose, Tipps & Quoten | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} gegen ${match.awayTeam}: Prognose und Analyse`,
    description: (match) => `${match.homeTeam} gegen ${match.awayTeam}: Prognose, Tipps und Spielanalyse für ${match.date || "diese Partie"}. Dazu kommen Haupttipp, Quoten und statistische Einordnung.`,
    intro: (match) => `${match.homeTeam} gegen ${match.awayTeam} wird über Form, Markt und Wettwert eingeordnet. Die Analyse unten konzentriert sich auf den Haupttipp und die wichtigsten Risiken.`,
  },
  it: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: Pronostico, Scommesse e Quote | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: Pronostico e Analisi`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: pronostico, scommesse e analisi partita per ${match.date || "questa gara"}. Vedi la selezione principale, le quote e il supporto statistico.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} viene letta attraverso forma, mercato e valore della giocata. Il testo seguente evidenzia il pronostico principale e i rischi.`,
  },
  nl: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: Voorspelling, Wedtips en Odds | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: Voorspelling en Analyse`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: voorspelling, wedtips en wedstrijdanalyse voor ${match.date || "deze wedstrijd"}. Bekijk onze hoofdkeuze, odds en statistische onderbouwing.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} krijgt hier een analyse op basis van vorm, markt en waarde. Hieronder staat de hoofdvoorspelling centraal.`,
  },
  tr: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: Tahmin, Bahis İpuçları ve Oranlar | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: Tahmin ve Analiz`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: tahmin, bahis ipuçları ve maç analizi için ${match.date || "bu maç"}. Ana seçim, oranlar ve istatistiksel gerekçeyi inceleyin.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} karşılaşması form, piyasa ve değer üzerinden okunur. Aşağıdaki analiz ana tahmine odaklanır.`,
  },
  id: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: Prediksi, Tips Taruhan, dan Odds | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: Prediksi dan Analisis`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: prediksi, tips taruhan, dan analisis pertandingan untuk ${match.date || "laga ini"}. Lihat pilihan utama, odds, dan dasar statistiknya.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} dibahas dari sudut form, pasar, dan nilai taruhan. Analisis berikut menyorot pilihan utama dan risikonya.`,
  },
  vi: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: Dự đoán, Soi Kèo và Tỷ Lệ | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: Dự đoán và Phân tích`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: dự đoán, soi kèo và phân tích trận đấu cho ${match.date || "trận này"}. Xem lựa chọn chính, tỷ lệ và cơ sở thống kê.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} được phân tích theo phong độ, thị trường và giá trị cược. Phần dưới nhấn mạnh lựa chọn chính và rủi ro.`,
  },
  ar: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: توقعات، نصائح المراهنات والأسعار | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: توقعات وتحليل المباراة`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: توقعات، نصائح المراهنات وتحليل المباراة لـ ${match.date || "هذه المباراة"}. راجع الاختيار الرئيسي والأسعار والأساس الإحصائي.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} تُقرأ من زاوية الأداء والسوق والقيمة. يركز التحليل التالي على الاختيار الرئيسي والمخاطر.`,
  },
  ja: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: 予想、ベッティング分析、オッズ | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: 予想と試合分析`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: ${match.date || "この試合"} の予想、ベッティング分析、オッズを紹介します。主な選択と統計的な根拠を確認できます。`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} は、フォーム、オッズ、試合状況から整理して読むのが自然です。以下で主な予想を示します。`,
  },
  ko: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: 예측, 베팅 팁 및 배당률 | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: 예측 및 경기 분석`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: ${match.date || "이 경기"} 의 예측, 베팅 팁, 경기 분석입니다. 주요 선택, 배당률, 통계적 근거를 확인하세요.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam}는 폼, 시장, 가치 관점에서 읽는 것이 핵심입니다. 아래 분석은 주요 선택과 위험을 설명합니다.`,
  },
  th: {
    separator: "vs",
    title: (match) => `${match.homeTeam} vs ${match.awayTeam}: ทำนาย, ทีเด็ดบอล และอัตราต่อรอง | ${siteConfig.name}`,
    h1: (match) => `${match.homeTeam} vs ${match.awayTeam}: ทำนายและวิเคราะห์เกม`,
    description: (match) => `${match.homeTeam} vs ${match.awayTeam}: ทำนาย ทีเด็ดบอล และวิเคราะห์เกมสำหรับ ${match.date || "นัดนี้"}. ดูตัวเลือกหลัก ราคาต่อรอง และเหตุผลเชิงสถิติ.`,
    intro: (match) => `${match.homeTeam} vs ${match.awayTeam} ควรถูกมองผ่านฟอร์ม ตลาด และความคุ้มค่า บทวิเคราะห์ด้านล่างเน้นตัวเลือกหลักและความเสี่ยง.`,
  },
};

function getLeagueName(match: Match) {
  return leagues.find((league) => league.slug === match.league)?.name ?? "the competition";
}

function hasFutureKickoff(match: Match) {
  const kickoff = match.kickoffUtc || (match.date ? `${match.date}T${match.time !== "TBD" ? `${match.time}:00` : "00:00:00"}Z` : "");
  return kickoff ? new Date(kickoff).getTime() > Date.now() : false;
}

function hasAnalysis(match: Match) {
  return match.analysis.some((paragraph) => paragraph.trim().length > 0);
}

function marketLabel(mainPick: string) {
  return mainPick.replace(/\s+/g, " ").trim();
}

export function shouldApplySearchIntentSEO(match: Match) {
  return match.status === "published" && hasAnalysis(match) && !isMatchCompleted(match);
}

function isMatchCompleted(match: Match) {
  return match.fixtureStatus === "completed";
}

export function buildMatchSearchIntent(match: Match, locale: SearchLocale = "en"): MatchSearchIntent {
  const pick = marketLabel(match.predictions.find((item) => item.label === "Main Prediction")?.value ?? "");
  const odds = match.predictions.find((item) => item.label === "Odds")?.value;
  const leagueName = getLeagueName(match);
  const copy = localeCopy[locale];
  const teams = `${match.homeTeam} ${copy.separator} ${match.awayTeam}`;

  return {
    locale,
    primaryQuery: `${teams} ${locale === "pt-BR" ? "palpite" : locale === "es" ? "pronóstico" : locale === "fr" ? "pronostic" : locale === "de" ? "prognose" : locale === "it" ? "pronostico" : locale === "nl" ? "voorspelling" : locale === "tr" ? "tahmin" : locale === "id" ? "prediksi" : locale === "vi" ? "dự đoán" : locale === "ar" ? "توقعات" : locale === "ja" ? "予想" : locale === "ko" ? "예측" : locale === "th" ? "ทำนาย" : "prediction"}`,
    secondaryQueries: [
      `${teams} ${locale === "pt-BR" ? "análise" : locale === "es" ? "análisis" : locale === "fr" ? "analyse" : locale === "de" ? "analyse" : locale === "it" ? "analisi" : locale === "nl" ? "analyse" : locale === "tr" ? "analiz" : locale === "id" ? "analisis" : locale === "vi" ? "phân tích" : locale === "ar" ? "تحليل" : locale === "ja" ? "分析" : locale === "ko" ? "분석" : locale === "th" ? "วิเคราะห์" : "analysis"}`,
      `${teams} ${locale === "pt-BR" ? "odds" : locale === "es" ? "cuotas" : locale === "fr" ? "cotes" : locale === "de" ? "quoten" : locale === "it" ? "quote" : locale === "nl" ? "odds" : locale === "tr" ? "oranlar" : locale === "id" ? "odds" : locale === "vi" ? "tỷ lệ cược" : locale === "ar" ? "الأسعار" : locale === "ja" ? "オッズ" : locale === "ko" ? "배당률" : locale === "th" ? "อัตราต่อรอง" : "odds"}`,
    ],
    marketQueries: pick ? [pick, `${teams} ${pick}`] : [],
    statisticalQueries: [
      `${teams} statistics`,
      `${teams} standings`,
    ],
    temporalQueries: hasFutureKickoff(match)
      ? [`${teams} today`, `${teams} tomorrow`, `${teams} kickoff`]
      : [`${teams} date`],
    competitionQueries: [
      `${leagueName} prediction`,
      `${leagueName} betting tips`,
    ],
  };
}

export function buildMatchSearchIntentCopy(match: Match, locale: SearchLocale = "en") {
  const copy = localeCopy[locale] ?? localeCopy.en;
  const intent = buildMatchSearchIntent(match, locale);
  return {
    ...intent,
    title: copy.title(match, locale),
    h1: copy.h1(match, locale),
    description: copy.description(match, locale),
    intro: copy.intro(match),
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
