import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";

// Source: PSP Football Predictions 6 Leagues publication package (9 October 2026). Predictions,
// odds and FREE/BEST BET labels are taken from the package unchanged. CONMEBOL Sudamericana 2026
// semifinal, first leg. Kick-off times and venues in the supplied package were marked "subject to
// confirmation"; that qualification is preserved rather than replaced with unsupported certainty.
// Boca Juniors vs Vasco da Gama (FREE) was refreshed on 12 October 2026 with current team news,
// projected lineups and form; its pick, odds and FREE label are unchanged, and the CONMEBOL-confirmed
// 21:30 kick-off at La Bombonera replaced the "subject to confirmation" wording.
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
// Matchday-eve editorial refresh of the 14 October fixtures (team news, projected lineups, form).
const oct14RefreshAt = "2026-10-13T08:30:00.000-03:00";

const bocaJuniorsVsVascoDaGama = createPspImport26Prediction({
  ...sudamericana,
  slug: "boca-juniors-vs-vasco-da-gama",
  home: "Boca Juniors",
  away: "Vasco da Gama",
  date: "2026-10-13",
  time: "21:30",
  venue: "La Bombonera, Buenos Aires, Argentina (kick-off 21:30 Argentina and Brasília time)",
  venueAddress: { addressLocality: "Buenos Aires", addressCountry: "Argentina" },
  pick: "Boca Juniors to Win",
  odds: 1.89,
  access: "free",
  teaser: "Boca's home control at La Bombonera against a Vasco side that reached the semifinal on merit. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Boca's home territorial control anchors the first leg",
  matchAnalysis: [
    "Boca's case rests on a settled home side that is hard to beat. They are unbeaten in **11 Clausura matches**, most recently drawing 2–2 at Instituto on Friday, and they eliminated São Paulo 2–1 on aggregate in the quarterfinal (1–0 at La Bombonera, 1–1 at the Morumbi). The price is Leandro Paredes, who suffered a grade-two tear in his right thigh in that Instituto draw and is expected to miss both legs. Milton Delgado or Williams Alarcón must now connect midfield and attack alongside Ascacíbar.",
    "Vasco arrive in uneven shape. They are 14th in the Brasileirão with **35 points**, four above the relegation zone, and Saturday's 0–0 draw with Remo ended a run of league wins. The travelling group is reshaped too: Spinelli stayed home after a foot knock in Sunday's training, Cuesta (back) and Cauan Barros (car accident, cut foot) are out, and Colidio cannot play because River Plate registered him in the competition. Brenner and Bruno Duarte are back in the squad, and Adson, with four goals in nine Sudamericana matches, is tipped to start.",
  ],
  tactical: "The first leg should be about territory. Boca's likely 4–2–3–1, or a 4–4–2 if Alarcón replaces Sebastián Villa, runs through Leonel Flores and Carlos Palacios behind Miguel Merentiel, with captain Lautaro Blanco and Leandro Lozano providing width. Vasco's probable base is a back four of Puma Rodríguez, Saldívia, Robert Renan and Cuiabano ahead of Léo Jardim, with Sosa, Thiago Mendes and Lescano in midfield, and without Spinelli and Colidio they lean on the pace of Adson or Nuno Moreira. With the second leg in Rio on 20 October, Vasco can accept a compact block and a low-scoring first leg, which gives Boca the natural job of pushing a deep opponent back and attacking the space between its lines.",
  risk: "A Boca win is not the same as Boca dominating. The 1–0 home win over São Paulo shows how tight knockout games at La Bombonera can be, and Paredes' absence removes the player Vasco's Santiago Sosa described as Boca's best. Discipline is a second concern, since Boca have collected several red cards in recent big matches and Chilean referee Piero Maza will be tested early. A first-leg draw that leaves the tie open for Vasco in Rio is the most obvious way for this pick to fail.",
  market: "At **1.89** the win carries a raw implied probability of **52.91%** (1 / 1.89). That is the price of an outright Boca victory in 90 minutes with no margin required, which suits a home side unbeaten for 11 league games and facing a visitor with a depleted attack. Historical frequency and recent form both favour Boca, but the narrow quarterfinal result and the missing Paredes mean the value case is for a close win rather than a comfortable one.",
  conclusion: "Boca are the more settled team, they play the first leg at home, and Vasco must rebuild their front line after the withdrawals of Spinelli and Colidio. Paredes' injury and the risk of a cagey draw keep the price from being a bargain, so the final teamsheets and Boca's discipline early on are the things to watch. The call stays with Boca Juniors to win at 1.89.",
  teamNews: `Checked on 12 October 2026 against Argentine and Brazilian match previews and squad reports published on 11 and 12 October. The lineups below are PROJECTED, not confirmed; official teamsheets are released shortly before kick-off.

**Boca Juniors**

- **Out:** Leandro Paredes (grade-two tear in the right thigh, suffered against Instituto on 9 October; expected to miss both legs), Alan Velasco (left adductor), Tomás Belmonte (meniscus), Tomás Aranda (fibula), Adam Bareiro (lumbar disc) and Agustín Marchesín (cruciate ligament). None of them is on the squad list.
- Paredes is the significant loss: Milton Delgado and Williams Alarcón are competing for the role he would have filled. Lautaro Blanco is set to captain the side.
- No suspensions were reported.

**Vasco da Gama**

- **Out or not travelling:** Cuesta (back problem), Spinelli (foot knock in Sunday's training, did not travel), Cauan Barros (car accident, cut to the left foot) and Rojas (left out by the coach). Colidio is ineligible because he was registered by River Plate in the competition.
- **Back in the squad:** Brenner, out since early August, and Bruno Duarte, who was rested against Remo with a back problem.
- Léo Jardim is expected in goal for Pedro Emanuel's side, and Adson is tipped to start in attack. No suspensions were reported.

**PROJECTED Boca Juniors (4-2-3-1):** Montero; Lozano, Di Lollo, Herrera, Blanco; Ascacíbar, Delgado; Palacios, Flores, Villa; Merentiel. Alarcón could replace Villa in a 4-4-2.

**PROJECTED Vasco da Gama:** only the base of the side can be projected with confidence: Léo Jardim; Puma Rodríguez, Saldívia, Robert Renan, Cuiabano; Sosa, Thiago Mendes, Lescano. The front line is open between Adson, Nuno Moreira, Hinestroza, Andrés Gómez, Brenner and Bruno Duarte.`,
  core: {
    kind: "disclosure" as const,
    note: "A Copa Sudamericana semifinal is a single first-leg fixture rather than a repeated home and away league sample, and no sourced HOME/AWAY split in the 22-metric format exists for this tie. The figures used in the analysis (Boca's league run and quarterfinal scorelines, Vasco's league position and points) are the sourced metrics, and they are written into the analysis rather than restated in a table. The previous meetings between the clubs are too old to carry weight.",
  },
  sources: [
    { name: "SofaScore — Boca Juniors vs Vasco da Gama", url: "https://www.sofascore.com/football/match/boca-juniors-vasco-da-gama/zOscob" },
    { name: "FFERJ — match listing", url: "https://www.fferj.com.br/partidas/6115" },
    { name: "La Gaceta — Sin Paredes, Boca recibe a Vasco da Gama", url: "https://www.lagaceta.com.ar/nota/1157760/deportes/sin-paredes-boca-recibe-vasco-da-gama-semifinal-copa-sudamericana.html" },
    { name: "El Destape — Boca vs Vasco da Gama: formation doubt and injuries", url: "http://www.eldestapeweb.com/deportes/todo-listo-boca-vs-vasco-da-gama-duda-formacion-paredes-otros-4-lesionados-20261012161542" },
    { name: "CNN Brasil — Boca Juniors confirma ausência de Paredes", url: "https://www.cnnbrasil.com.br/esportes/futebol/futebol-internacional/sulamericana/boca-juniors-confirma-ausencia-de-paredes-em-semifinal-contra-o-vasco/" },
    { name: "SuperVasco — Os relacionados do Vasco para enfrentar o Boca Juniors", url: "https://www.supervasco.com/noticias/os-relacionados-do-vasco-para-enfrentar-o-boca-juniors-457533.html" },
    { name: "Gazeta Esportiva — Vasco 0-0 Remo, Brasileirão round 30", url: "https://www.gazetaesportiva.com/times/vasco/vasco-x-remo-empate-sem-gols-brasileirao-30-rodada/" },
  ],
  publishedAt,
  updatedAt: "2026-10-12T19:35:00.000-03:00",
});

const atleticoMineiroVsMontevideoCityTorque = createPspImport26Prediction({
  ...sudamericana,
  slug: "atletico-mineiro-vs-montevideo-city-torque",
  home: "Atlético Mineiro",
  away: "Montevideo City Torque",
  date: "2026-10-14",
  time: "19:00",
  venue: "Arena MRV, Belo Horizonte, Brazil (kick-off 19:00 Brasília time)",
  venueAddress: { addressLocality: "Belo Horizonte", addressCountry: "Brazil" },
  pick: "Atlético Mineiro to Win",
  odds: 1.45,
  access: "vip",
  bestAnalysis: true,
  teaser: "Atlético's quarterfinal comeback at Arena MRV and their deeper knockout experience make this PSP's BEST BET of the Sudamericana wave. Full pick and odds are in PRIME VIP.",
  trend: "Atlético's Arena MRV comeback form headlines PSP's Sudamericana BEST BET",
  matchAnalysis: [
    "Atlético Mineiro reached the semifinal the hard way. They lost 2–0 at Santos in the quarterfinal first leg, then won the return **4–2 at home** and advanced on penalties 3–1 after goalkeeper Gabriel Delfim saved three, with Reinier scoring twice. At Arena MRV, Eduardo Domínguez has 15 wins, five draws and one defeat in 21 games, they have won four and drawn one of their five Sudamericana home matches, and they are unbeaten in their last five games in all competitions, the latest a 2–1 Brasileirão win over Santos. The cost is availability: Fred is out with a left-thigh muscle injury suffered against Athletico-PR, and Everson, Ruan Tressoldi, Mateo Cassierra and Gustavo Scarpa are also unavailable.",
    "Montevideo City Torque deserve respect. They led Group F with **13 points**, scored 17 goals in ten Sudamericana games and also recovered from a 2–0 defeat in the quarterfinal, losing at Cienciano in Cusco before winning the return 3–0. They lead the Uruguayan Clausura with 22 points from ten rounds, though they went four games without a win before beating Danubio 1–0 on 9 October through Salomón Rodríguez. Rodríguez has seven goals in the competition and 19 in 37 games this season, eight of them with his head. There are no confirmed absentees for Marcelo Méndez's side, and this is the first official meeting between the clubs.",
  ],
  tactical: "Domínguez is likely to use a 4-3-3, with Victor Hugo covering for Fred in midfield alongside Alan Franco and Maycon, and Cuello, Bernard and Reinier as the front three; Reinier and Thiago Borbas are competing for the striker role. City Torque's projected 4-4-2 or 4-3-3 sends Obregón, Luka Andrade and Rodríguez at a back line of Natanael, Lyanco, Vitor Hugo and Renan Lodi, and Rodríguez's aerial threat means set pieces and crosses are the visiting side's best route. In five of Atlético's last six games both teams have scored, so Atlético will expect to concede at least once, and the plan is to win the first leg by enough to play the return in Montevideo with a cushion. An early Atlético goal puts the Uruguayans in the position they struggled in after the quarterfinal first leg.",
  risk: "City Torque's 13 group-stage points and Rodríguez's goals show a side capable of scoring against anyone, and the visitors decide the tie at home on 21 October because of their better group record. Both teams have also scored in most of Atlético's recent games, so a 2–2 or 1–1 first leg is plausible, and Atlético's management of minutes for key players with the return in mind means the lineup could be weaker than the best available.",
  market: "Taking **1.45** at face value gives a raw implied probability of **68.97%** (1 / 1.45), the market's view that a strong home side is a clear favourite in a first leg. The home record under Domínguez and Atlético's goal-scoring in recent matches support it, while the visitors' away scoring and the injuries to Fred and others limit the margin. The value is in the home form, not in a decisive statistical gap.",
  conclusion: "Atlético are the stronger side, they play the first leg at Arena MRV with a strong home record, and City Torque will have to cope with a larger stage than their group matches. Fred's absence and the managed minutes for several players are the details to check on the teamsheet before kick-off. Nothing in the latest news changes the selection: Atlético Mineiro to win at 1.45.",
  teamNews: `Team news follows Trivela, O Tempo and club previews published on 12 and 13 October 2026. Both lineups are PROJECTED; the official teamsheets are released shortly before kick-off.

**Atlético Mineiro**
- **Out:** Fred (left-thigh muscle injury suffered against Athletico-PR, not expected to play), Everson, Ruan Tressoldi, Mateo Cassierra and Gustavo Scarpa (all physical problems).
- **Managed:** Natanael, Alan Franco, Kevin Castaño and Victor Hugo had their minutes managed with the semifinal in mind. Victor Hugo is expected to take Fred's place.
- **Check:** O Tempo reported Tomás Cuello as suspended for the Santos league game on 11 October, while other previews include him in the projected eleven, so his eligibility for this match should be confirmed.

**Montevideo City Torque**
- No confirmed absentees have been reported. Salomón Rodríguez, who scored the winner against Danubio on 9 October, is expected to lead the attack.

**PROJECTED Atlético Mineiro (4-3-3):** Gabriel Delfim; Natanael, Lyanco, Vitor Hugo, Renan Lodi; Alan Franco, Maycon, Victor Hugo; Cuello, Bernard, Reinier. Reinier and Thiago Borbas are competing for the striker role.

**PROJECTED Montevideo City Torque (4-4-2):** Torgnascioli; Agüero, Kevin Silva, Kagelmacher, Silvera; Pizzichillo, Siles, Montes; Obregón, Andrade, Salomón Rodríguez.`,
  core: {
    kind: "disclosure" as const,
    note: "A Copa Sudamericana semifinal first leg is a single fixture rather than a repeated home and away league sample, so no sourced HOME/AWAY split in the 22-metric format exists for this tie. The quarterfinal scorelines, group record and individual scoring totals used above are the sourced figures, and they are written into the analysis.",
  },
  sources: [
    { name: "CONMEBOL — Atlético Mineiro in Copa Sudamericana 2026", url: "https://gol.conmebol.com/sudamericana/pt-br/news/atletico-mineiro-na-conmebol-sudamericana-2026-resultados-elenco-e-calendario" },
    { name: "CONMEBOL — Montevideo City Torque in Copa Sudamericana 2026", url: "https://gol.conmebol.com/sudamericana/pt-br/news/montevideo-city-torque-na-conmebol-sudamericana-2026-resultados-elenco-e-calendario" },
    { name: "Trivela — Atlético-MG v City Torque probable lineups and preview (14 October 2026)", url: "https://trivela.com.br/onde-assistir/palpite-escalacoes-atletico-mg-x-city-torque-14-10-2026/" },
    { name: "O Tempo — Montevideo City Torque ahead of the Atlético tie (12 October 2026)", url: "https://otempo.com.br/sports/atletico/2026/10/12/montevideo-city-torque-chega-para-jogo-contra-o-atletico-apos-se-recuperar-na-temporada" },
    { name: "O Tempo — Atlético lineup and absences against Santos (11 October 2026)", url: "https://www.otempo.com.br/sports/atletico/2026/10/11/veja-a-escalacao-e-os-desfalques-do-atletico-para-enfrentar-o-santos-pelo-campeonato-brasileiro" },
  ],
  publishedAt,
  updatedAt: oct14RefreshAt,
});

export const copaSudamericanaRound20261013 = [
  bocaJuniorsVsVascoDaGama,
  atleticoMineiroVsMontevideoCityTorque,
];
