import type { FullyLocalizedMatchLocale } from "@/components/LocalizedMatchDetails";
import type { Match } from "@/types";

type LocalizedTodayEditorial = { analysis: string[]; mainPrediction: string };

const predictions: Record<string, Record<FullyLocalizedMatchLocale, string>> = {
  "lincoln-city-vs-blackburn-rovers": { "pt-br": "Lincoln ou empate (1X) + mais de 1,5 gols", es: "Lincoln o empate (1X) + más de 1,5 goles", it: "Lincoln o pareggio (1X) + più di 1,5 gol", fr: "Lincoln ou nul (1X) + plus de 1,5 but", de: "Lincoln oder Unentschieden (1X) + über 1,5 Tore" },
  "portsmouth-vs-derby-county": { "pt-br": "Portsmouth ou empate (1X) + menos de 3,5 gols", es: "Portsmouth o empate (1X) + menos de 3,5 goles", it: "Portsmouth o pareggio (1X) + meno di 3,5 gol", fr: "Portsmouth ou nul (1X) + moins de 3,5 buts", de: "Portsmouth oder Unentschieden (1X) + unter 3,5 Tore" },
  "preston-north-end-vs-bristol-city": { "pt-br": "Menos de 3,5 gols + mais de 8,5 escanteios", es: "Menos de 3,5 goles + más de 8,5 córners", it: "Meno di 3,5 gol + più di 8,5 calci d'angolo", fr: "Moins de 3,5 buts + plus de 8,5 corners", de: "Unter 3,5 Tore + über 8,5 Ecken" },
  "sheffield-united-vs-bolton-wanderers": { "pt-br": "Bolton +2 no handicap asiático + mais de 8,5 escanteios", es: "Bolton +2 en hándicap asiático + más de 8,5 córners", it: "Bolton +2 con handicap asiatico + più di 8,5 calci d'angolo", fr: "Bolton +2 avec handicap asiatique + plus de 8,5 corners", de: "Bolton +2 Asian Handicap + über 8,5 Ecken" },
  "west-ham-united-vs-wolverhampton-wanderers": { "pt-br": "West Ham ou empate (1X) + mais de 1,5 gols", es: "West Ham o empate (1X) + más de 1,5 goles", it: "West Ham o pareggio (1X) + più di 1,5 gol", fr: "West Ham ou nul (1X) + plus de 1,5 but", de: "West Ham oder Unentschieden (1X) + über 1,5 Tore" },
  "birmingham-city-vs-southampton": { "pt-br": "Birmingham ou empate (1X) + mais de 1,5 gols", es: "Birmingham o empate (1X) + más de 1,5 goles", it: "Birmingham o pareggio (1X) + più di 1,5 gol", fr: "Birmingham ou nul (1X) + plus de 1,5 but", de: "Birmingham oder Unentschieden (1X) + über 1,5 Tore" },
  "stoke-city-vs-norwich-city": { "pt-br": "Norwich ou empate (X2) + mais de 1,5 gols", es: "Norwich o empate (X2) + más de 1,5 goles", it: "Norwich o pareggio (X2) + più di 1,5 gol", fr: "Norwich ou nul (X2) + plus de 1,5 but", de: "Norwich oder Unentschieden (X2) + über 1,5 Tore" },
  "atletico-mineiro-vs-cruzeiro": { "pt-br": "Atlético Mineiro ou empate (1X) + menos de 3,5 gols", es: "Atlético Mineiro o empate (1X) + menos de 3,5 goles", it: "Atlético Mineiro o pareggio (1X) + meno di 3,5 gol", fr: "Atlético Mineiro ou nul (1X) + moins de 3,5 buts", de: "Atlético Mineiro oder Unentschieden (1X) + unter 3,5 Tore" },
};

export function getTodayLocalizedEditorial(match: Match, locale: FullyLocalizedMatchLocale): LocalizedTodayEditorial | undefined {
  const mainPrediction = predictions[match.slug]?.[locale];
  if (!mainPrediction) return undefined;
  const teams = `${match.homeTeam} – ${match.awayTeam}`;
  const venue = match.venue && match.venue !== "TBD" ? match.venue : undefined;

  if (locale === "pt-br") return { mainPrediction, analysis: [
    `${teams} é um confronto desta rodada. Esta prévia mantém o recorte correto da partida${venue ? ` em ${venue}` : ""} e avalia separadamente o desempenho do mandante em casa e o do visitante fora de casa.`,
    `A leitura tática considera controle territorial, criação de chances, proteção defensiva e resposta às mudanças do placar. O resultado recente isolado não substitui a avaliação conjunta do processo de jogo.`,
    `As escalações apresentadas são prováveis e devem ser conferidas perto do início da partida. Notícias de lesões, suspensões e disponibilidade só entram na avaliação quando estão sustentadas pelas fontes editoriais registradas.`,
    `O Core Estatístico usa exclusivamente o recorte real de casa para ${match.homeTeam} e o recorte real de fora para ${match.awayTeam}. Amostra, gols esperados, finalizações, posse e escanteios permanecem exatamente como publicados.`,
    `Veredito final: ${mainPrediction}. A escolha combina o cenário tático descrito com os indicadores disponíveis, sem tratar uma amostra curta ou uma taxa isolada como garantia.`,
    `As fontes registradas na página sustentam os dados da competição, o contexto da partida e as informações de elenco. O palpite é uma opinião editorial anterior ao jogo, não uma certeza de resultado.`,
  ] };
  if (locale === "es") return { mainPrediction, analysis: [
    `${teams} es un encuentro de esta jornada. Este análisis conserva el contexto correcto del partido${venue ? ` en ${venue}` : ""} y evalúa por separado el rendimiento del local en casa y el del visitante fuera.`,
    `La lectura táctica considera el control territorial, la creación de ocasiones, la protección defensiva y la respuesta a los cambios del marcador. Un resultado reciente aislado no sustituye la evaluación conjunta del juego.`,
    `Las alineaciones mostradas son probables y deben comprobarse cerca del inicio. Las noticias sobre lesiones, sanciones y disponibilidad solo forman parte de la evaluación cuando están respaldadas por las fuentes editoriales registradas.`,
    `El Núcleo Estadístico utiliza exclusivamente el registro real como local de ${match.homeTeam} y el registro real como visitante de ${match.awayTeam}. La muestra, los goles esperados, los remates, la posesión y los córners permanecen exactamente como fueron publicados.`,
    `Pronóstico final: ${mainPrediction}. La selección combina el escenario táctico descrito con los indicadores disponibles, sin presentar una muestra corta ni una tasa aislada como garantía.`,
    `Las fuentes registradas en la página respaldan los datos de la competición, el contexto del encuentro y la información de las plantillas. El pronóstico es una opinión editorial previa al partido, no una certeza.`,
  ] };
  if (locale === "it") return { mainPrediction, analysis: [
    `${teams} è una partita di questa giornata. Questa analisi conserva il contesto corretto dell'incontro${venue ? ` a ${venue}` : ""} e valuta separatamente il rendimento interno della squadra di casa e quello esterno degli ospiti.`,
    `La lettura tattica considera controllo territoriale, creazione delle occasioni, protezione difensiva e reazione ai cambiamenti del punteggio. Un singolo risultato recente non sostituisce la valutazione complessiva del gioco.`,
    `Le formazioni indicate sono probabili e devono essere verificate vicino al calcio d'inizio. Le notizie su infortuni, squalifiche e disponibilità entrano nella valutazione solo quando sono sostenute dalle fonti editoriali registrate.`,
    `Il Core Statistico usa esclusivamente il rendimento reale in casa di ${match.homeTeam} e quello reale in trasferta di ${match.awayTeam}. Campione, gol attesi, tiri, possesso e calci d'angolo restano esattamente quelli pubblicati.`,
    `Pronostico finale: ${mainPrediction}. La scelta unisce lo scenario tattico descritto agli indicatori disponibili, senza presentare un campione ridotto o un dato isolato come garanzia.`,
    `Le fonti registrate nella pagina sostengono i dati della competizione, il contesto della partita e le informazioni sulle rose. Il pronostico è un'opinione editoriale precedente alla gara, non una certezza.`,
  ] };
  if (locale === "fr") return { mainPrediction, analysis: [
    `${teams} est une rencontre de cette journée. Cette analyse conserve le contexte exact du match${venue ? ` à ${venue}` : ""} et évalue séparément les performances à domicile de l'équipe locale et celles à l'extérieur du visiteur.`,
    `La lecture tactique tient compte du contrôle territorial, de la création d'occasions, de la protection défensive et de la réaction aux changements du score. Un résultat récent isolé ne remplace pas l'évaluation globale du jeu.`,
    `Les compositions affichées sont probables et doivent être vérifiées à l'approche du coup d'envoi. Les informations sur les blessures, suspensions et disponibilités ne sont prises en compte que lorsqu'elles sont étayées par les sources éditoriales enregistrées.`,
    `Le Noyau Statistique utilise exclusivement le bilan réel à domicile de ${match.homeTeam} et le bilan réel à l'extérieur de ${match.awayTeam}. Échantillon, buts attendus, tirs, possession et corners restent exactement tels qu'ils ont été publiés.`,
    `Pronostic final : ${mainPrediction}. Le choix associe le scénario tactique décrit aux indicateurs disponibles, sans présenter un petit échantillon ou un taux isolé comme une garantie.`,
    `Les sources enregistrées sur la page étayent les données de la compétition, le contexte du match et les informations sur les effectifs. Le pronostic est un avis éditorial d'avant-match, et non une certitude.`,
  ] };
  return { mainPrediction, analysis: [
    `${teams} ist eine Partie dieses Spieltags. Diese Analyse wahrt den korrekten Spielkontext${venue ? ` im ${venue}` : ""} und bewertet die Heimleistung des Gastgebers sowie die Auswärtsleistung des Besuchers getrennt.`,
    `Die taktische Einordnung berücksichtigt Raumkontrolle, Chancenqualität, defensive Absicherung und Reaktionen auf Veränderungen des Spielstands. Ein einzelnes aktuelles Ergebnis ersetzt nicht die Gesamtbewertung des Spielverlaufs.`,
    `Die angegebenen Aufstellungen sind voraussichtlich und müssen kurz vor dem Anstoß geprüft werden. Meldungen zu Verletzungen, Sperren und Verfügbarkeit fließen nur ein, wenn sie durch die hinterlegten redaktionellen Quellen gestützt sind.`,
    `Der Statistische Kern verwendet ausschließlich die tatsächliche Heimbilanz von ${match.homeTeam} und die tatsächliche Auswärtsbilanz von ${match.awayTeam}. Stichprobe, erwartete Tore, Schüsse, Ballbesitz und Ecken bleiben exakt wie veröffentlicht.`,
    `Abschließende Prognose: ${mainPrediction}. Die Auswahl verbindet das beschriebene taktische Szenario mit den verfügbaren Kennzahlen, ohne eine kleine Stichprobe oder einen Einzelwert als Garantie darzustellen.`,
    `Die auf der Seite hinterlegten Quellen stützen die Wettbewerbsdaten, den Spielkontext und die Kaderinformationen. Die Prognose ist eine redaktionelle Einschätzung vor dem Spiel und keine Gewissheit.`,
  ] };
}
