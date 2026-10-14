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
// Matchday-eve editorial refresh of the 14 October fixtures (team news, projected lineups, form).
const oct14RefreshAt = "2026-10-13T08:30:00.000-03:00";

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
  teaser: "Palmeiras' attacking volume and a goal-heavy recent head-to-head support the Over at the Maracanã. The prediction and full analysis are FREE for everyone.",
  trend: "A goal-heavy head-to-head frames the Over 1.5 pick",
  matchAnalysis: [
    "Fluminense host the first leg after rotating heavily for Sunday's Brasileirão match against Flamengo, when the reports had only Fábio, Millán, Martinelli, Soteldo and Canobbio from the regular side, with Guga, Thiago Silva, Ganso and Hulk held back for this tie. Rested players returning is the story: Canobbio is back from suspension, Soteldo is available again after load management, and Renê, who had been recovering from an ankle sprain, was expected to be fit for the semifinal. They reached the last four by eliminating Platense 3–2 on aggregate.",
    "Palmeiras are the team with the greater attacking volume in this Libertadores, with **57 shots on target** against Fluminense's **41** in the competition figures reported before the tie. Since the international break they have beaten Bahia 1–0 and won the derby against Corinthians, they were second in the Brasileirão going into that game, and they face ten matches in about a month. Abel Ferreira is serving a Libertadores suspension and cannot lead the team from the touchline in this leg. Gustavo Gómez trained normally after a wrist trauma that was not a fracture, and Paulinho, who has not played since 26 July, is being assessed for a return. The head-to-head supports goals, since their August league meeting finished **3–2** after a 2–1 Palmeiras win in February, and four of the last six meetings produced at least two goals.",
  ],
  tactical: "Palmeiras' probable 3-5-2 has Murilo, Gómez and Barboza behind a midfield of Giay, Lucas Evangelista, Andreas Pereira, Arias and Piquerez, with López and Vitor Roque up front, and it is built to attack the flanks through the wing-backs. Fluminense's rotated side at the weekend means the regulars, including Thiago Silva and Hulk, are expected to return for the tie, which makes the Maracanã a stronger home side than the one that played Flamengo. A semifinal first leg can begin cautiously, and Abel's absence from the bench adds some uncertainty to in-game management, yet one goal for each side clears the line, as does an early goal followed by a controlled second half. A fast Palmeiras start through the wing-backs would force Fluminense to open up.",
  risk: "Palmeiras' continental defensive structure and the tendency for semifinal first legs to start cautiously are the clearest reasons the game could stay tight into the second half. A 1–0 either way would defeat the pick, and with ten matches in a month Palmeiras have reason to protect a narrow result, although the recent head-to-head record of goal-heavy meetings works against a repeat of a goalless or one-goal game.",
  market: "At **1.61** the Over 1.5 line carries a raw implied probability of **62.11%** (1 / 1.61). The line only needs two goals in the match, which four of the last six meetings between the clubs have cleared, and both attacks have been productive in the competition. The value is moderate rather than large, since a semifinal first leg is the type of match that can end 1–0, but the price is low enough that one goal from each team is sufficient.",
  conclusion: "Both teams have attacking depth and a recent head-to-head that leans toward goals, and Fluminense's regulars are expected to return after the rotation at the weekend. The main risk is a cagey first leg, so the confirmed teamsheets, especially who starts for Fluminense and whether Paulinho features for Palmeiras, are worth checking before kick-off. With that caveat in mind, over 1.5 goals at 1.61 remains the call.",
  teamNews: `Team news follows club and press previews published between 11 and 13 October 2026. Lineups are PROJECTED because the official teamsheets are released shortly before kick-off.

**Fluminense**
- **Rotation:** coach Marcão rested Guga, Thiago Silva, Paulo Henrique Ganso and Hulk for Sunday's league game with Flamengo, so they are expected back for the tie.
- **Back:** Canobbio returns after suspension, Soteldo is available again after load management, and Renê, recovering from an ankle sprain, was expected to be fit.
- No suspensions were reported for the semifinal.

**Palmeiras**
- **Suspended:** coach Abel Ferreira cannot be on the touchline for the first leg after a Libertadores suspension.
- **Doubt:** Paulinho, who has not played since 26 July, trained on Saturday and Palmeiras believe he can return against Fluminense. Gustavo Gómez has a wrist trauma, a fracture was ruled out and he is training normally.
- Giay, Jhon Arias and Piquerez were rested against Bahia after international duty and are expected back.

**PROJECTED Palmeiras (3-5-2):** Carlos Miguel; Murilo, Gustavo Gómez, Barboza; Giay, Lucas Evangelista, Andreas Pereira, Arias, Piquerez; López, Vitor Roque. Marlon Freitas is an alternative in midfield.

**PROJECTED Fluminense:** Fábio; Millán, Martinelli, Canobbio and Soteldo are the regulars expected to start. With Thiago Silva, Hulk, Ganso and Guga rested at the weekend, the rest of the eleven is open until the teamsheet.`,
  core: singleLegCore,
  sources: [
    { name: "CONMEBOL — semifinal schedule confirmed", url: "https://gol.conmebol.com/libertadores/pt-br/news/datas-confirmadas-confira-como-serao-disputadas-semifinais-da-conmebol-libertadores" },
    { name: "CBF — Fluminense x Palmeiras match listing", url: "https://www.cbf.com.br/futebol-brasileiro/jogos/conmebol-libertadores/profissional/2026/fluminense-x-palmeiras/835382?view=escalacao" },
    { name: "Betfair — competition statistics and head-to-head", url: "https://betting.betfair.com/football/predictions/conmebol-libertadores/fluminense-vs-palmeiras/dfcrp6w30he6eoanz1tddy044/" },
    { name: "Verdão.net (PTD) — Abel expected to repeat the derby eleven (13 October 2026)", url: "https://ptd.verdao.net/fluminense-x-palmeiras-abel-deve-repetir-time-do-classico-veja-escalacao/" },
    { name: "Nosso Palestra — Palmeiras lineup dilemmas before the derby (11 October 2026)", url: "https://nossopalestra.com.br/noticias/palmeiras-enfrenta-dilemas-na-escalacao-para-o-derbi-com-semifinal-da-libertadores-no-horizonte" },
    { name: "Bolavip — Fluminense to rest some starters against Flamengo", url: "https://br.bolavip.com/fluminense/fluminense-decide-poupar-alguns-titulares-contra-o-flamengo-e-escalara-time-alternativo" },
  ],
  publishedAt,
  updatedAt: oct14RefreshAt,
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
