import type { SeoLocaleSlug } from "@/lib/seo-locales";

export type LocalizedEditorial = {
  analysis: string[];
  mainPrediction: string;
  sourceDescription: string;
};

const astonVillaArsenal: Record<SeoLocaleSlug, LocalizedEditorial> = {
  "pt-br": {
    analysis: [
      "O Aston Villa recebe o Arsenal pela Premier League. Esta prévia se limita intencionalmente ao confronto verificado e à estrutura da seleção editorial fornecida: mais de 2,5 gols.",
      "O componente de gols torna a faixa total de gols parte da seleção.",
      "A seleção é específica para esta partida porque atribui a proteção relevante, a linha de gols ou a exigência de vitória a Aston Villa e Arsenal exatamente como apresentado. Ela deve ser avaliada como uma posição de aposta completa, e não como uma afirmação de que qualquer uma das equipes certamente terá determinado desempenho.",
      "O principal risco é que a partida se desenvolva fora das condições do mercado selecionado. O palpite continua sendo uma opinião editorial pré-jogo, não uma garantia, e as odds fornecidas não estabelecem a probabilidade do resultado sem um registro de mercado documentado separadamente.",
    ],
    mainPrediction: "Mais de 2,5 gols",
    sourceDescription: "Dados diretos da temporada que confirmam competição, rodada, data, mandante e visitante usados nesta análise.",
  },
  es: {
    analysis: [
      "Aston Villa recibe al Arsenal en la Premier League. Este análisis se limita intencionadamente al partido verificado y a la estructura de la selección editorial proporcionada: más de 2,5 goles.",
      "El componente de goles convierte el rango total de anotación en parte de la selección.",
      "La selección es específica para este partido porque asigna la protección relevante, la línea de goles o el requisito de victoria a Aston Villa y Arsenal exactamente como se presenta. Debe evaluarse como una posición de apuesta completa, no como una afirmación de que alguno de los equipos vaya a ofrecer con certeza un rendimiento determinado.",
      "El principal riesgo es que el partido se desarrolle fuera de las condiciones del mercado seleccionado. El pronóstico sigue siendo una opinión editorial previa al partido, no una garantía, y las cuotas proporcionadas no establecen la probabilidad del resultado sin un registro de mercado documentado por separado.",
    ],
    mainPrediction: "Más de 2,5 goles",
    sourceDescription: "Datos directos de la temporada que confirman la competición, jornada, fecha, local y visitante utilizados en este análisis.",
  },
  fr: {
    analysis: [
      "Aston Villa reçoit Arsenal en Premier League. Cette analyse se limite volontairement au match vérifié et à la structure du choix éditorial fourni : plus de 2,5 buts.",
      "La composante liée aux buts fait de la fourchette totale de buts un élément du pronostic.",
      "Le choix est propre à ce match, car il attribue la protection pertinente, la ligne de buts ou la condition de victoire à Aston Villa et Arsenal exactement comme indiqué. Il doit être évalué comme une position de pari complète, et non comme l’affirmation que l’une ou l’autre équipe produira avec certitude une performance particulière.",
      "Le principal risque est que le match évolue en dehors des conditions du marché sélectionné. Le pronostic reste un avis éditorial d’avant-match, et non une garantie, et les cotes fournies n’établissent pas la probabilité du résultat sans un relevé de marché documenté séparément.",
    ],
    mainPrediction: "Plus de 2,5 buts",
    sourceDescription: "Données directes de la saison confirmant la compétition, la journée, la date, l’équipe à domicile et l’équipe à l’extérieur utilisées dans cette analyse.",
  },
  de: {
    analysis: [
      "Aston Villa empfängt Arsenal in der Premier League. Diese Vorschau beschränkt sich bewusst auf die bestätigte Partie und die Struktur der vorliegenden redaktionellen Auswahl: über 2,5 Tore.",
      "Durch den Torbestandteil wird die gesamte Trefferzahl zum Gegenstand der Auswahl.",
      "Die Auswahl ist auf dieses Spiel zugeschnitten, da sie den maßgeblichen Schutz, die Torlinie oder die Siegbedingung genau wie angegeben Aston Villa und Arsenal zuordnet. Sie sollte als vollständige Wettposition bewertet werden und nicht als Behauptung, dass eine der beiden Mannschaften mit Sicherheit eine bestimmte Leistung zeigen wird.",
      "Das Hauptrisiko besteht darin, dass sich das Spiel außerhalb der Bedingungen des ausgewählten Marktes entwickelt. Der Tipp bleibt eine redaktionelle Einschätzung vor dem Spiel und keine Garantie. Die angegebenen Quoten belegen ohne eine separat dokumentierte Markterfassung nicht die Wahrscheinlichkeit des Ergebnisses.",
    ],
    mainPrediction: "Über 2,5 Tore",
    sourceDescription: "Direkte Saisondaten, die Wettbewerb, Spieltag, Datum, Heim- und Auswärtsteam dieser Analyse bestätigen.",
  },
  it: {
    analysis: [
      "Aston Villa ospita l'Arsenal in Premier League. Questa anteprima riguarda la partita verificata e la selezione editoriale pubblicata: più di 2,5 gol.",
      "La linea sul totale dei gol richiede almeno tre reti complessive e va valutata come un'unica posizione, non come la certezza di una particolare prestazione di una delle due squadre.",
      "Il rischio principale è che la partita rimanga al di sotto della linea scelta. Il pronostico è un'opinione editoriale pre-partita, non una garanzia, e le quote registrate non determinano da sole la probabilità dell'esito.",
    ],
    mainPrediction: "Più di 2,5 gol",
    sourceDescription: "Dati diretti della stagione che confermano competizione, giornata, data e squadre utilizzate nell'analisi.",
  },
  nl: {
    analysis: [
      "Aston Villa ontvangt Arsenal in de Premier League. Deze voorbeschouwing beperkt zich tot de bevestigde wedstrijd en de gepubliceerde redactionele keuze: meer dan 2,5 doelpunten.",
      "De totaallijn vereist minimaal drie doelpunten in de hele wedstrijd en moet als één volledige positie worden beoordeeld, niet als zekerheid over de prestatie van een van beide teams.",
      "Het belangrijkste risico is dat de wedstrijd onder de gekozen lijn blijft. De voorspelling is een redactionele mening vóór de aftrap, geen garantie, en de vastgelegde odds bepalen op zichzelf niet de kans op de uitkomst.",
    ],
    mainPrediction: "Meer dan 2,5 doelpunten",
    sourceDescription: "Directe seizoensgegevens die competitie, speelronde, datum en beide teams in deze analyse bevestigen.",
  },
  tr: {
    analysis: [
      "Aston Villa, Premier League'de Arsenal'ı konuk ediyor. Bu ön inceleme doğrulanmış karşılaşma ve yayımlanan editoryal seçimle sınırlıdır: 2,5 gol üstü.",
      "Toplam gol çizgisinin aşılması için maçta en az üç gol gerekir. Seçim, takımlardan birinin belirli bir performans göstereceği kesinliği olarak değil, tek bir bütün bahis pozisyonu olarak değerlendirilmelidir.",
      "Temel risk maçın seçilen gol çizgisinin altında kalmasıdır. Tahmin maç öncesi editoryal bir görüştür, garanti değildir; kayıtlı oranlar da sonucun olasılığını tek başına belirlemez.",
    ],
    mainPrediction: "2,5 gol üstü",
    sourceDescription: "Analizde kullanılan lig, hafta, tarih, ev sahibi ve deplasman takımını doğrulayan doğrudan sezon verileri.",
  },
};

export const localizedEditorialBySlug: Record<string, Record<SeoLocaleSlug, LocalizedEditorial>> = {
  "aston-villa-vs-arsenal": astonVillaArsenal,
};

export function getLocalizedEditorial(slug: string, locale: SeoLocaleSlug) {
  return localizedEditorialBySlug[slug]?.[locale];
}

export function hasCompleteLocalizedEditorial(slug: string, locale: SeoLocaleSlug) {
  const value = getLocalizedEditorial(slug, locale);
  return Boolean(value && value.analysis.length >= 3 && value.analysis.every((paragraph) => paragraph.trim().length >= 40));
}
