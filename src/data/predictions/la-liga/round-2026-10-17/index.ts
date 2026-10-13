import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";
import { venueSplitCore } from "../../editorial-tools/psp-import-12/venue-split-core";

// Source: PSP 12-analyses football publication package (Premier League, La Liga and Serie A,
// 17 October 2026). Predictions, odds and FREE/PRIME VIP labels are taken from the package
// unchanged. Fixture identity, kick-off times and venues were checked against club and league
// calendars; team news, form and standings were refreshed on 13 October 2026. Real Betis play their
// home games at the Estadio de La Cartuja this season (FC Barcelona's official calendar lists the
// 17 October fixture there), so the package's reference to the Benito Villamarín was replaced.
const laLiga = {
  league: "la-liga" as const,
  competition: "La Liga — 2026/27",
  round: "Matchweek 9",
  date: "2026-10-17",
  publishedAt: "2026-10-13T08:30:00.000-03:00",
  updatedAt: "2026-10-13T08:30:00.000-03:00",
  oddsSource: "Editor-supplied PSP 12-analyses publication package (13 October 2026)",
};
const spain = { addressCountry: "Spain" };
const laLigaTable = { name: "Wikipedia — 2026–27 La Liga (table, results grid and managers, 12 October 2026)", url: "https://en.wikipedia.org/wiki/2026%E2%80%9327_La_Liga" };
const laLigaStandings = { name: "LaLiga — official standings", url: "https://www.laliga.com/laliga-easports/clasificacion" };
const injuryRound9 = { name: "Jornada Perfecta — lesionados que podrían llegar a la jornada 9 (12 October 2026)", url: "https://www.jornadaperfecta.com/blog/lesionados-j9-26-27/" };
const newsIntro = (fixture: string) => `${fixture} follows Spanish match-week injury reports and club previews published between 10 and 13 October 2026. It is four days before kick-off and several clubs also play in Europe in midweek, so every lineup is PROJECTED and the official lineups, released about an hour before the game, will settle it.`;

const espanyolVsAtleticoMadrid = createPspImport26Prediction({
  ...laLiga,
  slug: "espanyol-vs-atletico-madrid",
  home: "Espanyol",
  away: "Atlético Madrid",
  time: "14:00",
  venue: "RCDE Stadium, Cornellà de Llobregat",
  venueAddress: { addressLocality: "Cornellà de Llobregat", ...spain },
  pick: "Atlético Madrid Double Chance (X2) + Under 3.5 Goals",
  odds: 1.7,
  access: "vip",
  teaser: "Atlético are second and winning, while Espanyol are winless in three; the question is whether the goals stay at three or fewer. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Atlético's winning run against Espanyol's three-match winless run",
  matchAnalysis: [
    "Atlético Madrid are second in La Liga with **19 points** from eight games, six wins, one draw and one defeat, 18 goals scored and eight conceded. Diego Simeone's side won 2–1 at Alavés on Saturday and face Manchester United in the Champions League on Tuesday, four days before this trip. Their away split is three wins and one defeat from four, **eight goals scored and five conceded**, and all four of those games passed 2.5 goals while only one reached four. Spanish reports before the United game described the squad as fully available, and no absence has been reported for this league match.",
    "Espanyol are 12th on 8 points with two wins, two draws and four defeats and an 11–11 goal record. Manolo González's side drew 1–1 at Málaga on Friday after conceding in the 93rd minute, which left them winless in three. At home the split is one win, one draw and two defeats from four, six goals scored and six conceded, with three of the four above 2.5 and only one reaching four. Kike García is out for the long term and Jofre Carreras is also listed absent. The X2 half is supported by the form gap, and the Under 3.5 half by the fact that neither side's venue split has produced many four-goal games.",
  ],
  tactical: "Atlético's away games have been open but contained: they score two a game and concede just over one, which is the profile that satisfies an Under 3.5 with a visiting win. Espanyol's home games are more even, six scored and six conceded, so the likeliest game state is Atlético taking the lead and managing it rather than a shoot-out. An early Atlético goal would push Espanyol, who conceded late at Málaga, to commit numbers, which raises the chance of a 3–1 or a 2–0, both inside the line. The risk comes from a late open spell after the second goal, when a fourth could arrive.",
  risk: "The Under 3.5 leg is the exposed one: Atlético's own matches average 3.25 goals, and a 3–1, 4–0 or 2–2 sequence is only one goal away from failing. Atlético's midweek European tie could also lead to rotation, and Espanyol, winless in three, may start the game with more urgency than the table suggests.",
  market: "Dividing one by the **1.70** price gives a raw implied probability of **58.82%** (1 / 1.70) for the combination. Atlético have avoided defeat in three of four away games, and **three of four** of their road games and of Espanyol's home games finished with three goals or fewer. The value is moderate, resting on Atlético's quality on the road and on both venue splits supporting a controlled scoreline.",
  conclusion: "Atlético's form and Espanyol's winless run support the double chance, and the Under 3.5 is a reasonable cap in a fixture where neither side's venue split has been extreme. The Tuesday tie against United and the confirmed lineups are the details to watch. That keeps Atlético Madrid Double Chance (X2) plus under 3.5 goals at 1.70 as the position.",
  teamNews: `${newsIntro("Team news for Espanyol against Atlético Madrid")}

**Espanyol**
- **Out:** Kike García, who is not expected to play again before 2027, and Jofre Carreras, listed absent before the Málaga game.
- Manolo González's side drew 1–1 at Málaga on 9 October. No suspensions were reported.

**Atlético Madrid**
- No absences or suspensions were reported for the Champions League tie against Manchester United on Tuesday or for this league game. Simeone's side won 2–1 at Alavés on Saturday.
- The Champions League game four days earlier makes rotation possible.

**PROJECTED lineups:** reliable projected elevens were not yet available from the sources checked on Tuesday, four days before kick-off. No starting player is asserted beyond the reported absences above.`,
  core: venueSplitCore("la-liga", "Espanyol", "Atlético Madrid"),
  sources: [
    laLigaTable,
    laLigaStandings,
    { name: "LaLiga — RCD Espanyol upcoming matches", url: "https://www.laliga.com/clubes/rcd-espanyol/proximos-partidos" },
    injuryRound9,
    { name: "La Grada — LaLiga jornada 8 results (Málaga 1-1 Espanyol)", url: "https://lagrada.org/laliga-26-27-jornada-8-resultados-clasificacion-cronica-resumen-partidos-malaga-espanyol-domingo/" },
    { name: "Sport Witness — Atlético at full strength to face Manchester United", url: "https://sportwitness.co.uk/from-spain-no-injuries-no-suspensions-atletico-madrid-at-full-strength-to-face-manchester-united" },
  ],
});

const villarrealVsElche = createPspImport26Prediction({
  ...laLiga,
  slug: "villarreal-vs-elche",
  home: "Villarreal",
  away: "Elche",
  time: "16:15",
  venue: "Estadio de la Cerámica, Villarreal",
  venueAddress: { addressLocality: "Villarreal", ...spain },
  pick: "Over 2.5 Goals",
  odds: 1.49,
  access: "vip",
  teaser: "Villarreal's home games have all been open and Elche concede two goals a game, but the visitors' road matches are less one-sided. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Open home games at Villarreal meet Elche's leaky defence",
  matchAnalysis: [
    "Villarreal are 11th on 8 points with two wins, two draws and four defeats, and their league matches produce goals at both ends: 13 scored and 13 conceded in eight games, an average of **3.25 per match**. At the Cerámica the split is three games, one win and two defeats, six goals each way, and **all three** passed 2.5 goals with goals at both ends. Their last league game was a 1–0 defeat at Real Madrid, and the Saturday kick-off follows a Champions League tie against Napoli on Tuesday. Iñigo Pérez's side lack Buchanan (a muscle injury) and Pépé (eye surgery) is a doubt, while Foyth and Comesaña were back in training.",
    "Elche are 18th on 6 points with one win, three draws and four defeats, 11 goals scored and 17 conceded, so their matches average **3.50 goals**. Martín Anselmi's team have conceded 2.13 per game, and their away split is one win, two draws and one defeat from four, seven scored and six conceded, with both teams scoring in all four. Sangaré, whose return was confirmed in a press conference although the injury list still shows him as doubtful, and Yago Santiago, with a knee problem and an indefinite return, are the injury questions. A side that scores in every road game gives the hosts a route to goals even if their own finishing is uneven.",
  ],
  tactical: "Villarreal's projected 4-2-3-1 has Moleiro, Akhomach and Ayoze behind Mikautadze with Comesaña and Pape Gueye in the middle, which suits a team that creates chances but concedes freely. Elche's 4-3-3 relies on Lemar, Morcillo and Gonzalo Villar in midfield and the wide runners Germán Valera and Fer Niño to break forward. The first goal matters: a Villarreal lead pulls Elche into a game where they score and concede, as in all four of their road matches, while an Elche goal first would test a home team that has conceded six at the Cerámica in three games.",
  risk: "Elche's road matches produce goals for both teams but have gone over 2.5 only twice in four, and a Villarreal side coming off a midweek European tie may be more measured. A 1–1 or a 2–0 would end the bet, and Villarreal's 1–0 defeat at Madrid shows they can play low-scoring games.",
  market: "The over at **1.49** has a raw implied probability of **67.11%** (1 / 1.49), so the bet needs a success rate above two in three to break even. Villarreal's home frequency of 100% over three games and Elche's 50% over four are a small sample, and the blended average of 3.38 goals per match is above the line, but averages do not guarantee a high-scoring game, so the value in the price is modest rather than generous.",
  conclusion: "Both teams concede regularly and Villarreal's home games have all been open, which makes three goals the likelier outcome than not. The midweek Napoli tie and the injuries to Buchanan and Pépé are the details to check before kick-off. The selection therefore remains over 2.5 goals at 1.49.",
  teamNews: `${newsIntro("Team news for Villarreal against Elche")}

**Villarreal**
- **Out:** Buchanan (muscle injury).
- **Doubtful:** Pépé (eye surgery, return expected around the middle of October).
- Foyth and Comesaña trained with the group. Villarreal also play Napoli in the Champions League on Tuesday. No suspensions were reported.

**Elche**
- **Doubtful:** Sangaré (muscle injury, return confirmed in a press conference) and Yago Santiago (knee, indefinite).
- Cepeda is not yet back. No suspensions were reported.

**PROJECTED Villarreal (4-2-3-1):** Gulácsi; Foyth, Veiga, Freeman, Sergi Cardona; Comesaña, Pape Gueye; Akhomach, Moleiro, Ayoze; Mikautadze.

**PROJECTED Elche (4-3-3):** Dituro; Rubén Sánchez, Chust, Revivo, Tete; Lemar, Javi Morcillo, Gonzalo Villar; Germán Valera, Redondo, Fer Niño.`,
  core: venueSplitCore("la-liga", "Villarreal", "Elche"),
  sources: [
    laLigaTable,
    laLigaStandings,
    { name: "Villarreal CF — first-team calendar (Elche, 17 October 16:15)", url: "https://villarrealcf.es/en/calendario-primer-equipo/" },
    { name: "Jornada Perfecta — Villarreal vs Elche probable lineups and injuries", url: "https://www.jornadaperfecta.com/partido/13402/villarreal-elche" },
    injuryRound9,
  ],
});

const realBetisVsBarcelona = createPspImport26Prediction({
  ...laLiga,
  slug: "real-betis-vs-barcelona",
  home: "Real Betis",
  away: "Barcelona",
  time: "18:30",
  venue: "Estadio de La Cartuja, Seville",
  venueAddress: { addressLocality: "Seville", ...spain },
  pick: "Barcelona to Win",
  odds: 1.48,
  access: "free",
  analysisAccess: "free",
  teaser: "Barcelona have won all eight league games, but Betis have won all four at home and have conceded only two there.",
  trend: "Barcelona's perfect start meets Betis's perfect home record",
  matchAnalysis: [
    "Barcelona have won all eight league games, scoring **34 goals** and conceding seven, an average of 4.25 for and 0.88 against. Hansi Flick's side have been just as emphatic away from home: four wins from four, 17 goals scored and three conceded, with every one of those matches finishing with at least four goals. They play Galatasaray in Istanbul on Tuesday, so the trip to Seville comes four days later. Raphinha has a small muscular problem at the back of the right thigh and is expected to return for this game, Frenkie de Jong is recovering from a knee-ligament injury and is also due back around now, and Andreas Christensen and Roony Bardghji are out.",
    "Betis are third with **19 points** from eight games, six wins, one draw and one defeat, 14 goals scored and nine conceded. Manuel Pellegrini's side have won all four home games at La Cartuja, scoring eight and conceding two, with three clean sheets, and they beat Osasuna 5–2 last weekend. They play Porto in the Champions League on Wednesday, three days before this match, and Pellegrini has seven games to manage before the end of October. Junior Firpo is out and Aitor Ruibal is doubtful, with Antony pending medical tests.",
  ],
  tactical: "Barcelona's away games have all produced at least four goals, so the question is how Betis' compact 4-2-3-1 handles that attack. Isco and Abde Ezzalzouli between the lines are Betis' creative route, with Bernal and Ceballos protecting the back four, and Pellegrini's side have kept three clean sheets at home. The first goal matters: if Barcelona score in the opening half hour, Betis must open up and the match becomes the type Barcelona have won by large margins. If Betis score first, their home record shows how hard they are to catch.",
  risk: "A draw is enough to lose, and Betis are the most credible home side Barcelona have faced: perfect at home, three clean sheets. Both teams play in Europe in midweek, which makes fatigue and rotation a factor, and Raphinha's thigh and De Jong's knee add small uncertainties to the visiting attack.",
  market: "Converted to a raw implied probability, **1.48** is **67.57%** (1 / 1.48) before the bookmaker's margin. Barcelona's four away wins from four, with **17 goals scored**, support a short price, while Betis' perfect home record is the main reason the price is not shorter. The value rests on the gap in goals, 34 for Barcelona against 14 for Betis, rather than on the home and away records alone.",
  conclusion: "Barcelona's scoring record is the strongest in the league, and their away form has matched it, though Betis' home results make this a demanding fixture. The confirmed fitness of Raphinha and De Jong and the lineups after the midweek European games are worth checking. With that caveat in mind, Barcelona to win at 1.48 remains the call.",
  teamNews: `${newsIntro("Team news for Real Betis against Barcelona")}

**Real Betis**
- **Out:** Junior Firpo, who picked up an injury on international duty.
- **Doubtful:** Aitor Ruibal, with a return expected soon, and Antony, pending medical tests.
- Real Betis also play Porto in the Champions League on Wednesday. No suspensions were reported.

**Barcelona**
- **Out:** Andreas Christensen (quadriceps, expected back in November) and Roony Bardghji (cruciate ligament, long term).
- **Doubtful:** Raphinha, who has a small muscular oedema in the back of the right thigh and is expected to be back for this game, and Frenkie de Jong, who is recovering from a knee-ligament injury and is due back around this fixture.
- Barcelona play Galatasaray in the Champions League on Tuesday. No suspensions were reported.

**PROJECTED lineups:** reliable projected elevens were not yet available from the sources checked on Tuesday, four days before kick-off, and both teams play in Europe in midweek. For reference, Betis' most recent projected eleven (for the Porto game) used a 4-2-3-1 with Vallés; Bellerín, Bartra, Natan, Fran García; Bernal, Ceballos; Riquelme, Isco, Abde Ezzalzouli; Parrott.`,
  core: venueSplitCore("la-liga", "Real Betis", "Barcelona"),
  sources: [
    laLigaTable,
    laLigaStandings,
    { name: "FC Barcelona — first-team calendar (Real Betis, 17 October 18:30, Estadio La Cartuja de Sevilla)", url: "https://www.fcbarcelona.com/en/futbol/primer-equipo/calendario" },
    { name: "Real Betis — first-team schedule (17 October 18:30)", url: "https://en.realbetisbalompie.es/first_team/schedule/primer-equipo" },
    injuryRound9,
    { name: "Football España — Barcelona squad for Galatasaray (13 October 2026)", url: "https://www.football-espana.net/2026/10/13/barcelona-squad-galatasaray" },
  ],
});

const valenciaVsAthleticClub = createPspImport26Prediction({
  ...laLiga,
  slug: "valencia-vs-athletic-club",
  home: "Valencia",
  away: "Athletic Club",
  time: "21:00",
  venue: "Estadio de Mestalla, Valencia",
  venueAddress: { addressLocality: "Valencia", ...spain },
  pick: "Athletic Club Double Chance (X2) + Over 1.5 Goals",
  odds: 1.79,
  access: "free",
  analysisAccess: "free",
  teaser: "Valencia have scored twice in four home games, while Athletic arrive with fewer matches played and a depleted squad.",
  trend: "Valencia's home struggles meet a short-handed Athletic",
  matchAnalysis: [
    "Valencia are 19th on **5 points** with one win, two draws and five defeats, six goals scored and 15 conceded. Javier Aguirre arrived on 23 September after Carlos Corberán was sacked and the caretaker spell of Óscar Sánchez ended, and his debut was a draw at Racing on Sunday. At Mestalla the picture is bleak, no wins, one draw and three defeats from four home games, **two goals scored and nine conceded**, and they have failed to score in three of those four. Aguirre is also weighing a change of system because of the lack of wingers. Diego López (knee surgery, out until late November), Sadiq (hamstring, early November), Sergi Canós and Foulquier are out or doubtful depending on the report, Rioja has been ruled out by Aguirre in one report and listed as a doubt in another, and Danjuma has recovered.",
    "Athletic are 10th on 8 points from six games, with two wins, two draws and two defeats and seven goals scored and six conceded. They have played fewer games than most because Rayo Vallecano's visit was suspended at 0–0 after 13 minutes of fan protests on 10 October and the trip to Levante was postponed by a storm, now rescheduled for 21 October. Oihan Sancet (calf) is out until November, Nico Williams is doubtful with a possible return mid-October, and Egiluz is out, but Aymeric Laporte has recovered from the illness that kept him out of the Rayo squad. Away from San Mamés the split is two games, one win and one defeat, two goals scored and two conceded, both games finishing with exactly two goals.",
  ],
  tactical: "Valencia's projected group keeps Gayà, Guido Rodríguez and Pepelu at the core, with Danjuma back and Aguirre unsure about the width of his system. Athletic's likely line has Yeray and Laporte at centre-back, Galarreta and Gerenabarrena in midfield and Unai Simón behind them, and without Sancet and possibly Nico Williams they lean on Iñaki Williams, Berenguer and Canales. A Valencia goal first would be a rare event at Mestalla this season, and an Athletic lead would test whether a team that has failed to score in three of four home games can respond.",
  risk: "The first half of the combination fails if Valencia win, and the home side has shown flashes under a new coach, while Athletic travel without Sancet and possibly Williams and have played little competitive football in the past ten days. The goals leg is also exposed: a 1–0 Athletic win is the cheapest way for the bet to lose, as Athletic's attack has scored only 1.17 per game.",
  market: "Taking **1.79** at face value gives a raw implied probability of **55.87%** (1 / 1.79). Valencia have lost three of four at home and conceded **nine** goals there, and both of Athletic's away games finished with two goals, so each half of the bet has a supporting number. The price is cautious because Athletic's attack is modest and their squad is thin, which makes the value moderate rather than large.",
  conclusion: "Valencia's results and defensive record give Athletic a credible route to avoiding defeat, and the home side's weakness at the back supports a second goal. Athletic's injury list and Valencia's new-coach reaction are the variables, so the confirmed lineups are worth checking. Nothing in the latest news changes the selection: Athletic Club double chance (X2) plus over 1.5 goals at 1.79.",
  teamNews: `${newsIntro("Team news for Valencia against Athletic Club")}

**Valencia**
- **Out:** Diego López (knee surgery, late November), Sadiq (hamstring, early November) and Sergi Canós.
- **Out or doubtful:** Dimitri Foulquier, Luis Rioja and José Copete, with the reports differing on how likely they are to be fit. Danjuma has recovered and Guido Rodríguez is back in training.
- Manager Javier Aguirre has been in charge since 23 September and is considering a change of system because of the lack of wingers. No suspensions were reported.

**Athletic Club**
- **Out:** Oihan Sancet (calf, early November) and Unai Egiluz.
- **Doubtful:** Nico Williams, who may recover in time. Aymeric Laporte has recovered from the illness that kept him out of the squad for the Rayo game, and Yuri is back in training.
- No suspensions were reported.

**PROJECTED Valencia (no formation available):** Dimitrievski, Maffeo, Gayà, Otorbi, Raba, De Haas, Guido Rodríguez, Pepelu, Javi Guerra, Danjuma and Elliott. The system is open while Aguirre decides how to use his wide players.

**PROJECTED Athletic Club (no formation available):** Unai Simón, Areso, Yeray, Laporte, Yuri, De Galarreta, Gerenabarrena, Berenguer, Canales, Navarro and Iñaki Williams. Laporte is rated about 60% likely to start, with Paredes the alternative.`,
  core: venueSplitCore("la-liga", "Valencia", "Athletic Club"),
  sources: [
    laLigaTable,
    laLigaStandings,
    { name: "Deportevalenciano — Athletic y Valencia CF, con bajas en Mestalla (13 October 2026)", url: "https://www.deportevalenciano.com/2026/10/13/athletic-valencia-cf-bajas-mestalla" },
    { name: "Jornada Perfecta — Valencia vs Athletic probable lineups and injuries", url: "https://www.jornadaperfecta.com/partido/13401/valencia-athletic" },
    injuryRound9,
    { name: "Primicias — Rayo Vallecano vs Athletic suspended after fan protests", url: "https://www.primicias.ec/deportes/futbol/suspende-partido-rayo-vallecano-athletic-protestas-hinchas-aviones-papel-cancha-134617/" },
  ],
});

export const laLigaRound2026_10_17 = [
  espanyolVsAtleticoMadrid,
  villarrealVsElche,
  realBetisVsBarcelona,
  valenciaVsAthleticClub,
];
