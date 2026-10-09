import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";

// Source: PSP Football Predictions 6 Leagues publication package (9 October 2026). Predictions,
// odds and FREE/BEST BET labels are taken from the package unchanged. CONMEBOL Libertadores 2026
// semifinal, first leg.
const libertadores = {
  league: "copa-libertadores" as const,
  competition: "CONMEBOL Libertadores 2026",
  round: "Semifinal, First Leg",
};
const singleLegCore = {
  kind: "disclosure" as const,
  note: "This is a single-leg Copa Libertadores semifinal first-leg fixture rather than a repeated home/away league sample, so a structured HOME/AWAY split; no sourced home and away split in the 22-metric target format is available for this matchup. The competition-record figures cited above (shots on target, head-to-head results, group-stage points) are the sourced metrics for this tie and are presented in prose rather than restated in a table to avoid duplicating them without new interpretation.",
};
const publishedAt = "2026-10-09T10:00:00.000-03:00";

const fluminenseVsPalmeiras = createPspImport26Prediction({
  ...libertadores,
  slug: "fluminense-vs-palmeiras",
  home: "Fluminense",
  away: "Palmeiras",
  date: "2026-10-14",
  time: "21:30",
  venue: "Maracanã, Rio de Janeiro, Brazil",
  venueAddress: { addressLocality: "Rio de Janeiro", addressCountry: "Brazil" },
  pick: "Over 1.5 Goals",
  odds: 1.61,
  access: "free",
  teaser: "Palmeiras' attacking volume and a goal-heavy recent head-to-head support the Over at the Maracanã. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "A goal-heavy head-to-head frames the Over 1.5 pick",
  matchAnalysis: [
    "Fluminense return to the Maracanã after eliminating Platense 3–2 on aggregate, while Palmeiras reached the semifinal after advancing past LDU on penalties. Palmeiras have produced the greater attacking volume in this Libertadores, with **57 shots on target** compared with Fluminense's **41** in the competition figures reported ahead of the tie. Fluminense, however, have repeatedly shown that they can turn home matches into more aggressive contests when the game opens up.",
    "The recent head-to-head record offers further support for goals. Their August league meeting finished **3–2**, following a 2–1 Palmeiras win in February, and four of the last six meetings produced at least two goals.",
  ],
  tactical: "A semifinal first leg can begin cautiously, and Palmeiras' continental defensive structure is the main reason not to expect a wide-open game from the first whistle. Even with that risk, both teams have enough attacking quality to punish a mistake, and the Over 1.5 line does not require the match to become a shootout — one goal from each side, or an early goal followed by a controlled second half, both clear it.",
  risk: "Palmeiras' continental defensive structure and the tendency for semifinal first legs to start cautiously are the clearest reasons the game could stay tight into the second half, though the recent head-to-head record of goal-heavy meetings between these two sides works against a repeat 0-0 or 1-0 outcome.",
  core: singleLegCore,
  sources: [
    { name: "CONMEBOL — semifinal schedule confirmed", url: "https://gol.conmebol.com/libertadores/pt-br/news/datas-confirmadas-confira-como-serao-disputadas-semifinais-da-conmebol-libertadores" },
    { name: "CBF — Fluminense x Palmeiras match listing", url: "https://www.cbf.com.br/futebol-brasileiro/jogos/conmebol-libertadores/profissional/2026/fluminense-x-palmeiras/835382?view=escalacao" },
    { name: "Betfair — competition statistics and head-to-head", url: "https://betting.betfair.com/football/predictions/conmebol-libertadores/fluminense-vs-palmeiras/dfcrp6w30he6eoanz1tddy044/" },
  ],
  publishedAt,
});

const estudiantesVsFlamengo = createPspImport26Prediction({
  ...libertadores,
  slug: "estudiantes-vs-flamengo",
  home: "Estudiantes de La Plata",
  away: "Flamengo",
  date: "2026-10-15",
  time: "21:30",
  venue: "Estadio UNO Jorge Luis Hirschi, La Plata, Argentina (21:30 local time, also BRT)",
  venueAddress: { addressLocality: "La Plata", addressCountry: "Argentina" },
  pick: "Estudiantes or Draw (1X)",
  odds: 1.63,
  access: "vip",
  bestAnalysis: true,
  teaser: "Estudiantes' unbeaten home record in this Libertadores and a tight recent history with Flamengo make this PSP's BEST BET of the Libertadores wave. Full pick and odds are in PRIME VIP.",
  trend: "Estudiantes' unbeaten home record headlines PSP's Libertadores BEST BET",
  matchAnalysis: [
    "Estudiantes have reached this stage through resilience and control rather than overwhelming attacking numbers. They collected **nine points** in the group stage and remained unbeaten at home, including a 1–1 draw against Flamengo, before eliminating Universidad Católica and Corinthians. That home record matters in a semifinal first leg, where avoiding an early deficit is often as important as chasing an advantage.",
    "The recent history between these teams also points toward a competitive game. Their two group-stage meetings finished **1–1** in La Plata and **1–0** to Flamengo at the Maracanã, while the 2025 knockout tie was similarly tight: Estudiantes won 1–0 at home after losing 2–1 away before going out on penalties.",
  ],
  tactical: "Guido Carrillo gives the hosts a physical reference point in attack to hold up play and draw fouls near the box, while Fernando Muslera's experience behind a compact defensive line is central to Estudiantes' plan to avoid an early deficit. Flamengo have the greater individual quality and enough attacking talent to win anywhere, but Estudiantes' home performance in this Libertadores campaign — including the earlier 1–1 draw with this same opponent — gives the hosts a credible chance to protect the first leg from defeat.",
  risk: "Flamengo have the greater individual quality and have already shown they can win away at La Plata in the 2025 knockout tie, so a repeat of that specific result remains the clearest way the double chance fails despite Estudiantes' unbeaten home record in this campaign.",
  core: singleLegCore,
  sources: [
    { name: "CONMEBOL — semifinal schedule confirmed", url: "https://gol.conmebol.com/libertadores/pt-br/news/datas-confirmadas-confira-como-serao-disputadas-semifinais-da-conmebol-libertadores" },
    { name: "CONMEBOL — Estudiantes 2026 results, squad and schedule", url: "https://gol.conmebol.com/libertadores/en/news/estudiantes-2026-conmebol-libertadores-results-squad-and-schedule" },
    { name: "CONMEBOL — Flamengo-Estudiantes 2025 semifinal precedent", url: "https://gol.conmebol.com/libertadores/en/news/flamengo-estudiantes-2025-semifinal-precedent-heart-stopping-finish" },
  ],
  publishedAt,
});

export const copaLibertadoresRound20261014 = [
  fluminenseVsPalmeiras,
  estudiantesVsFlamengo,
];
