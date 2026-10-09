import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";

// Source: PSP Football Predictions 6 Leagues publication package (9 October 2026). Predictions,
// odds and FREE/BEST BET labels are taken from the package unchanged. CONMEBOL Sudamericana 2026
// semifinal, first leg. Kick-off times and venues in the supplied package were marked "subject to
// confirmation"; that qualification is preserved rather than replaced with unsupported certainty.
const sudamericana = {
  league: "copa-sudamericana" as const,
  competition: "CONMEBOL Sudamericana 2026",
  round: "Semifinal, First Leg",
};
const singleLegCore = {
  kind: "disclosure" as const,
  note: "This is a single-leg Copa Sudamericana semifinal first-leg fixture rather than a repeated home/away league sample, so a structured HOME/AWAY split; no sourced home and away split in the 22-metric target format is available for this matchup. The competition-record figures cited above (group-stage points, goals scored/conceded, individual scoring totals) are the sourced metrics for this tie and are presented in prose rather than restated in a table to avoid duplicating them without new interpretation.",
};
const publishedAt = "2026-10-09T10:00:00.000-03:00";

const bocaJuniorsVsVascoDaGama = createPspImport26Prediction({
  ...sudamericana,
  slug: "boca-juniors-vs-vasco-da-gama",
  home: "Boca Juniors",
  away: "Vasco da Gama",
  date: "2026-10-13",
  time: "21:30",
  venue: "La Bombonera, Buenos Aires, Argentina (kick-off time 21:30 BRT, subject to confirmation)",
  venueAddress: { addressLocality: "Buenos Aires", addressCountry: "Argentina" },
  pick: "Boca Juniors to Win",
  odds: 1.89,
  access: "free",
  teaser: "Boca's home control at La Bombonera against a Vasco side that reached the semifinal on merit. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Boca's home territorial control anchors the first leg",
  matchAnalysis: [
    "Boca Juniors have the clearest situational advantage in the first leg: La Bombonera gives them an environment in which they can play with greater territorial pressure and force the opponent to defend for longer spells. In a semifinal, that matters because Boca do not need to make the game chaotic to create an edge. They can use possession, second balls and sustained pressure to gradually push Vasco deeper and increase the value of every set piece or defensive error.",
    "Vasco have shown enough quality to reach the final four and cannot be treated as a passive opponent. Their best route is likely to come from staying compact, protecting the space between midfield and defense and making Boca work for clean chances. The return leg in Brazil also gives the Argentine side a strong incentive to leave Buenos Aires with an advantage rather than settle for a neutral result.",
  ],
  tactical: "Boca's path to control rests on sustained possession and set-piece volume rather than forcing transitions, which fits a La Bombonera crowd that rewards patient territorial pressure. Vasco's most credible counter is a compact block between the lines that denies clean sight of goal and asks Boca to break them down repeatedly rather than in one or two moments. A **two-leg tie** format also shapes the approach: Vasco can afford to prioritise damage limitation over an expansive response in Buenos Aires.",
  risk: "Vasco reached the semifinal on merit and cannot be dismissed as a passive visitor, so a disciplined defensive performance that denies Boca clean chances, combined with the away side's incentive to protect the second leg at home, is the clearest route to the pick failing.",
  core: singleLegCore,
  sources: [
    { name: "SofaScore — Boca Juniors vs Vasco da Gama", url: "https://www.sofascore.com/football/match/boca-juniors-vasco-da-gama/zOscob" },
    { name: "FFERJ — match listing", url: "https://www.fferj.com.br/partidas/6115" },
  ],
  publishedAt,
});

const atleticoMineiroVsMontevideoCityTorque = createPspImport26Prediction({
  ...sudamericana,
  slug: "atletico-mineiro-vs-montevideo-city-torque",
  home: "Atlético Mineiro",
  away: "Montevideo City Torque",
  date: "2026-10-14",
  time: "19:00",
  venue: "Arena MRV, Belo Horizonte, Brazil (kick-off time 19:00 BRT, subject to confirmation)",
  venueAddress: { addressLocality: "Belo Horizonte", addressCountry: "Brazil" },
  pick: "Atlético Mineiro to Win",
  odds: 1.45,
  access: "vip",
  bestAnalysis: true,
  teaser: "Atlético's quarterfinal comeback at Arena MRV and their deeper knockout experience make this PSP's BEST BET of the Sudamericana wave. Full pick and odds are in PRIME VIP.",
  trend: "Atlético's Arena MRV comeback form headlines PSP's Sudamericana BEST BET",
  matchAnalysis: [
    "Atlético Mineiro arrive at the semifinal after a quarterfinal that showed both their vulnerability and their ability to respond under pressure. They overturned a 2–0 first-leg defeat against Santos with a **4–2 home win** before advancing on penalties, with Reinier scoring twice and Tomás Cuello adding another important goal. Their group-stage numbers were less dominant — **10 points**, eight goals scored and six conceded in six matches — but the home performance in the quarterfinal demonstrated how much more dangerous Atlético can become when they are able to push the game forward at Arena MRV.",
    "Montevideo City Torque deserve significant respect. The Uruguayan side collected **13 group-stage points**, scored 11 goals and have had a major attacking contribution from Salomón Rodríguez, who has **seven goals** in the competition. That makes this far from a routine home win.",
  ],
  tactical: "Atlético's quarterfinal turnaround leaned on Reinier and Tomás Cuello combining in the final third once the home crowd's pressure built, a pattern they will look to repeat against a Montevideo City Torque side built around Salomón Rodríguez's movement in behind. The difference is Atlético's deeper attacking quality, greater knockout experience and the pressure they can generate at home, which in a first leg where the Brazilian side should be motivated to build an advantage before the return match, give them the stronger overall profile.",
  risk: "Montevideo City Torque's 13 group-stage points and Salomón Rodríguez's seven goals in the competition show a side capable of scoring against anyone, so a repeat of Atlético's earlier quarterfinal defensive lapses would give the visitors a route back into the tie regardless of the home side's attacking quality.",
  core: singleLegCore,
  sources: [
    { name: "CONMEBOL — Atlético Mineiro in Copa Sudamericana 2026", url: "https://gol.conmebol.com/sudamericana/pt-br/news/atletico-mineiro-na-conmebol-sudamericana-2026-resultados-elenco-e-calendario" },
    { name: "CONMEBOL — Montevideo City Torque in Copa Sudamericana 2026", url: "https://gol.conmebol.com/sudamericana/pt-br/news/montevideo-city-torque-na-conmebol-sudamericana-2026-resultados-elenco-e-calendario" },
  ],
  publishedAt,
});

export const copaSudamericanaRound20261013 = [
  bocaJuniorsVsVascoDaGama,
  atleticoMineiroVsMontevideoCityTorque,
];
