import type { EditorialPrediction } from "@/types";
import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";

// Source: PSP NHL + Brasileirão publication package (Brazilian Série A, Round 30, October 10, 2026).
// Predictions, odds, dates, venues and sources are taken from the package unchanged. Access follows
// the project default (PRIME VIP): the package assigns no FREE or BEST BET label to these two games.

// Source: PSP UCL18 + Brasileirão8 publication package (8 October 2026). Predictions, odds, dates,
// venues and FREE/BEST BET labels are taken from the package unchanged. São Paulo vs Vitória and
// Vasco vs Remo above are a separate, already-published wave and are not touched by this one.
const brasileiraoRound30PackageSources = [
  { name: "CBF — official Round 30 schedule", url: "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/cbf-detalha-rodadas-27-a-30-do-brasileirao-betano" },
  { name: "2026 Brasileirão home/away statistical snapshots", url: "https://classificacaogeral.com.br/analises-e-estatisticas/brasileirao/2026" },
  { name: "2026 Brasileirão statistical tables", url: "https://valorfinal.com.br/brasileirao/tabelas-por-recorte" },
];
const brasileiraoRound30PublishedAt = "2026-10-08T15:00:00.000-03:00";

const atleticoMgVsSantos = createPspImport26Prediction({
  league: "brasileirao-serie-a",
  competition: "Brasileirão Série A 2026",
  slug: "atletico-mg-vs-santos",
  home: "Atlético-MG",
  away: "Santos",
  date: "2026-10-11",
  time: "16:00",
  round: "Round 30",
  venue: "Arena MRV",
  venueAddress: { addressLocality: "Belo Horizonte", addressCountry: "Brazil" },
  pick: "Atlético-MG or Draw (1X) + Over 1.5 Goals",
  odds: 1.71,
  access: "vip",
  teaser: "Atlético-MG's home record and Santos's away scoring both point toward goals at Arena MRV. Full pick and odds are in PRIME VIP.",
  trend: "Atlético-MG home control vs. Santos's away goals",
  matchAnalysis: [
    "Atlético-MG have been far tougher to beat in Belo Horizonte than their overall league campaign suggests. In the 14 home games covered by the latest available split, they won **8**, drew 5 and lost only once. They scored 24 goals, an average of **1.71 per game**, but also conceded 16. That last figure matters: Atlético can control long spells at Arena MRV without necessarily keeping their opponents quiet.",
    "Santos bring a very different threat. Their away record in the same 14-match sample includes five wins, with 23 goals scored and 23 conceded. That is **3.29 total goals per away game**, considerably more open than a typical cautious trip. Atlético home fixtures have produced roughly 2.86 goals on average. Neither number guarantees two goals on Sunday, but together they make a 1-1 scoreline or a 2-0 home win easier to envisage than a match with almost no chances.",
  ],
  tactical: "The clash is between Atlético's ability to protect home results and a Santos side that has shown it can score away. Santos have enough pace and finishing quality to punish a loose pass in midfield, while Atlético should have opportunities against a visiting defence conceding **1.64 goals per trip**. A Santos win would defeat the double chance; a 1-0 Atlético win would also fail because of the goals condition. Those are the two clear ways this selection can go wrong.",
  risk: "The main risk is the goals leg rather than the result itself: Atlético's own defence has conceded 16 at home, so a cautious, single-goal afternoon is possible even if the hosts avoid defeat. Santos's away scoring record is the counterweight that keeps the Over plausible, but a conservative visiting approach could leave the total short of two goals.",
  core: {
    kind: "rows",
    introLine: "The figures below use Atlético-MG's home league matches and Santos's away league matches in the 2026 Brasileirão. Statistical coverage is partial; xG, xGA, shots, shots on target, possession and corners were not available in the sourced material and have not been estimated.",
    rows: [["Matches (N)", "14", "14"], ["Wins", "**8**", "5"], ["GF/game", "**1.71**", "1.64"], ["GA/game", "1.14", "**1.64**"]],
    provenance: { season: "2026", homeSource: "classificacaogeral.com.br / valorfinal.com.br", awaySource: "classificacaogeral.com.br / valorfinal.com.br", homeMatches: 14, awayMatches: 14, competition: "Brasileirão Série A" },
  },
  sources: brasileiraoRound30PackageSources,
  publishedAt: brasileiraoRound30PublishedAt,
});

const bahiaVsMirassol = createPspImport26Prediction({
  league: "brasileirao-serie-a",
  competition: "Brasileirão Série A 2026",
  slug: "bahia-vs-mirassol",
  home: "Bahia",
  away: "Mirassol",
  date: "2026-10-11",
  time: "19:30",
  round: "Round 30",
  venue: "Arena Fonte Nova",
  venueAddress: { addressLocality: "Salvador", addressCountry: "Brazil" },
  pick: "Bahia to Win",
  odds: 1.74,
  access: "vip",
  teaser: "Bahia's defensive record at Fonte Nova and Mirassol's struggles on the road frame this as a home-advantage pick. Full pick and odds are in PRIME VIP.",
  trend: "Bahia's tight home defence vs. Mirassol's poor away form",
  matchAnalysis: [
    "Bahia have made Fonte Nova a difficult place to visit, even if too many draws have stopped their home results from looking dominant. Their 14-game home split contains just **two defeats**, with 14 goals conceded — **one per match**. Across 28 league games they scored 43 times, around 1.54 per fixture. Those are solid attacking numbers, but the six home draws are a warning against treating a home win as automatic.",
    "Mirassol have found away matches much harder. In the corresponding 14 trips they won only twice and lost **eight times**, scoring fewer than one goal per game while allowing about **1.57**. That leaves a straightforward question for the visitors: can they withstand long periods without the ball and still create enough to hurt Bahia? If they spend the afternoon defending deep, Bahia should have repeated chances to work the ball into dangerous areas.",
  ],
  tactical: "Bahia's advantage is not just a matter of stadium atmosphere. They concede fewer at home than Mirassol do away, and their season-long scoring rate gives them more ways to find a winner. Mirassol can make the game awkward by keeping the score level into the second half, which is precisely where Bahia's high number of home draws becomes relevant. Still, the difference between the teams' home and away records gives Bahia the better case for three points.",
  risk: "The six home draws in Bahia's 14-game split are the central risk, since they show the hosts have repeatedly failed to turn control into a win even in winnable fixtures. Mirassol's capacity to sit deep and limit chances, as their away numbers suggest, could again produce a level scoreline rather than the win this selection needs.",
  core: {
    kind: "rows",
    introLine: "The figures below use Bahia's home league matches and Mirassol's away league matches in the 2026 Brasileirão. Statistical coverage is partial; xG, xGA, shots, shots on target, possession and corners were not available in the sourced material and have not been estimated.",
    rows: [["Matches (N)", "14", "14"], ["Losses", "**2**", "**8**"], ["GA/game", "**1.00**", "1.57"], ["Wins", "Unavailable", "2"]],
    provenance: { season: "2026", homeSource: "classificacaogeral.com.br / valorfinal.com.br", awaySource: "classificacaogeral.com.br / valorfinal.com.br", homeMatches: 14, awayMatches: 14, competition: "Brasileirão Série A" },
  },
  sources: brasileiraoRound30PackageSources,
  publishedAt: brasileiraoRound30PublishedAt,
});

const bragantinoVsCruzeiro = createPspImport26Prediction({
  league: "brasileirao-serie-a",
  competition: "Brasileirão Série A 2026",
  slug: "bragantino-vs-cruzeiro",
  home: "Bragantino",
  away: "Cruzeiro",
  date: "2026-10-12",
  time: "21:00",
  round: "Round 30",
  venue: "Estádio Cícero de Souza Marques",
  venueAddress: { addressLocality: "Bragança Paulista", addressCountry: "Brazil" },
  pick: "Over 2.5 Goals",
  odds: 1.84,
  access: "free",
  bestAnalysis: false,
  teaser: "Cruzeiro's goal involvement this season is well above Bragantino's, and the visitors' away defence adds to the goals case. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Cruzeiro's goal-heavy season meets Bragantino's tighter home numbers",
  matchAnalysis: [
    "Cruzeiro have played in matches with far more goals than Bragantino this season. In the **29-game league sample**, Cruzeiro scored 44 and conceded 40: 84 goals in all, or **2.90 per fixture**. Bragantino's games averaged 2.31. The gap is worth taking seriously, because this over depends on the visitors helping to turn a potentially tight home match into something more open.",
    "Bragantino have scored about **1.43 goals per home game** and conceded **1.07**. Those numbers describe a team that can compete in Bragança Paulista without giving away many clear openings. Cruzeiro, by contrast, have allowed around **1.71 goals per away game**. If Bragantino find the net, Cruzeiro's own attacking ability becomes especially important: both teams would then have a reason to keep looking for goals rather than protect a goalless draw.",
  ],
  tactical: "Cruzeiro's 44 league goals show they can create enough to reach a three-goal match, but Bragantino's lower-scoring profile is a genuine obstacle. A controlled 1-1 draw or a narrow 1-0 result would leave the over short. This is a bet on the visitors' attacking quality and the chances their away defence tends to concede, not on an assumption that every Bragantino home game is high scoring.",
  risk: "Bragantino's tighter home scoring rate (1.43 per game) is the main danger to the Over, since a cautious home performance and a disciplined Cruzeiro away display could easily produce a 1-0 or 1-1 result that falls short of the 2.5 line.",
  core: {
    kind: "disclosure",
    note: "Bragantino's venue-specific GF/game (1.43) and GA/game (1.07) and Cruzeiro's away GA/game (1.71) are stated directly in the sourced material, but a matching Cruzeiro away GF/game split was not separated from the season-overall figure (44 goals in 29 matches, 1.52 per game) and is not presented here as a venue split. The remaining target metrics, including xG, xGA, shots, shots on target, possession and corners, remain unavailable and were not estimated.",
  },
  sources: brasileiraoRound30PackageSources,
  publishedAt: brasileiraoRound30PublishedAt,
});

const chapecoenseVsAthleticoPr = createPspImport26Prediction({
  league: "brasileirao-serie-a",
  competition: "Brasileirão Série A 2026",
  slug: "chapecoense-vs-athletico-pr",
  home: "Chapecoense",
  away: "Athletico-PR",
  date: "2026-10-12",
  time: "19:30",
  round: "Round 30",
  venue: "Arena Condá",
  venueAddress: { addressLocality: "Chapecó", addressCountry: "Brazil" },
  pick: "Athletico-PR or Draw (X2) + Over 1.5 Goals",
  odds: 1.74,
  access: "free",
  teaser: "Chapecoense's leaky home defence and Athletico-PR's steadier away numbers shape this combination pick. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Chapecoense's home defensive problems vs. Athletico-PR's away balance",
  matchAnalysis: [
    "Chapecoense have spent much of this Brasileirão chasing games because they concede far too often. Their 28-match record shows **57 goals allowed**, more than two per game. At Arena Condá the problem has been even sharper: **29 conceded in 13 home fixtures**. With home matches averaging around 3.62 total goals, it has been difficult for Chapecoense to turn even decent attacking spells into points.",
    "Athletico-PR have been more balanced over the same stage of the season, scoring 43 goals and conceding 32 in 28 matches. Their away record is not imposing — five wins, three draws and six defeats in 14 trips — but an average of **1.29 scored per away game** offers a reasonable chance of troubling a defence that has leaked more than two per home match. Athletico also concede **1.50 per trip**, so Chapecoense have a route to a goal of their own.",
  ],
  tactical: "That mixture explains the two parts of the selection. Athletico do not need to win, only avoid defeat, and Chapecoense's defensive numbers make two total goals a realistic target. The danger is that Athletico's uneven away performances leave them exposed to an early home goal. Chapecoense's own home scoring rate of **1.38** shows they are capable of causing trouble, even during a difficult campaign.",
  risk: "Athletico-PR's six defeats in 14 away matches show the double-chance leg is not automatic, and a disciplined Chapecoense start could expose the visitors' uneven away form. The combination also needs two goals, which is not guaranteed if either side plays for control rather than chasing an opening.",
  core: {
    kind: "rows",
    introLine: "The figures below use Chapecoense's home league matches and Athletico-PR's away league matches in the 2026 Brasileirão. Statistical coverage is partial; xG, xGA, shots, shots on target, possession and corners were not available in the sourced material and have not been estimated.",
    rows: [["Matches (N)", "13", "14"], ["GF/game", "**1.38**", "1.29"], ["GA/game", "**2.23**", "1.50"]],
    provenance: { season: "2026", homeSource: "classificacaogeral.com.br / valorfinal.com.br", awaySource: "classificacaogeral.com.br / valorfinal.com.br", homeMatches: 13, awayMatches: 14, competition: "Brasileirão Série A" },
  },
  sources: brasileiraoRound30PackageSources,
  publishedAt: brasileiraoRound30PublishedAt,
});

const coritibaVsBotafogo = createPspImport26Prediction({
  league: "brasileirao-serie-a",
  competition: "Brasileirão Série A 2026",
  slug: "coritiba-vs-botafogo",
  home: "Coritiba",
  away: "Botafogo",
  date: "2026-10-11",
  time: "19:30",
  round: "Round 30",
  venue: "Couto Pereira",
  venueAddress: { addressLocality: "Curitiba", addressCountry: "Brazil" },
  pick: "Coritiba or Draw (1X)",
  odds: 1.50,
  access: "vip",
  teaser: "Botafogo's away form has been poor enough to make Coritiba's home draw-protection the central angle. Full pick and odds are in PRIME VIP.",
  trend: "Botafogo's weak travel record protects the home double chance",
  matchAnalysis: [
    "Coritiba have been inconsistent at Couto Pereira: **five wins, four draws and five defeats** in the 14 home matches included in the latest split. They have scored and conceded at almost identical rates, about 1.36 per game. It is not a record that makes them overwhelming favourites, but Botafogo's travels have been difficult enough to make the home double chance worth examining.",
    "Botafogo lost **eight of their first 14 away league games** in this sample and conceded 25 goals, nearly **1.79 per trip**. They still scored around 1.21 per away match, so the visitors are not harmless going forward. Coritiba have also struggled defensively over the full season, allowing 43 goals in 28 matches. A clean sheet should not be taken for granted on either side.",
  ],
  tactical: "The case for Coritiba avoiding defeat rests on Botafogo's weak away results rather than any claim that the hosts are in commanding form. If Coritiba use the crowd and early pressure to get ahead, Botafogo may have to take risks. But the visitors have enough attacking threat to punish Coritiba's defensive mistakes, and a home side that has lost five of 14 at this ground cannot be called safe. The draw protection is important here.",
  risk: "Coritiba's own five home defeats in 14 matches are the clearest counter-evidence, showing the hosts are far from unbeatable at Couto Pereira. Botafogo's away scoring rate of roughly 1.21 per game also means an outright visiting win remains a live possibility despite the poor overall away record.",
  core: {
    kind: "rows",
    introLine: "The figures below use Coritiba's home league matches and Botafogo's away league matches in the 2026 Brasileirão. Statistical coverage is partial; xG, xGA, shots, shots on target, possession and corners were not available in the sourced material and have not been estimated.",
    rows: [["Matches (N)", "14", "14"], ["W-D-L", "**5-4-5**", "Unavailable"], ["GF/game", "1.36", "1.21"], ["GA/game", "1.36", "**1.79**"], ["Losses", "5", "**8**"]],
    provenance: { season: "2026", homeSource: "classificacaogeral.com.br / valorfinal.com.br", awaySource: "classificacaogeral.com.br / valorfinal.com.br", homeMatches: 14, awayMatches: 14, competition: "Brasileirão Série A" },
  },
  sources: brasileiraoRound30PackageSources,
  publishedAt: brasileiraoRound30PublishedAt,
});

const flamengoVsFluminense = createPspImport26Prediction({
  league: "brasileirao-serie-a",
  competition: "Brasileirão Série A 2026",
  slug: "flamengo-vs-fluminense",
  home: "Flamengo",
  away: "Fluminense",
  date: "2026-10-11",
  time: "17:30",
  round: "Round 30",
  venue: "Maracanã",
  venueAddress: { addressLocality: "Rio de Janeiro", addressCountry: "Brazil" },
  pick: "Flamengo to Win",
  odds: 1.47,
  access: "vip",
  bestAnalysis: true,
  teaser: "Flamengo's home balance of scoring and defending is the strongest statistical edge in this Fla-Flu, though Fluminense's away record keeps the derby alive. This is PSP's BEST BET of the round — full pick and odds are in PRIME VIP.",
  trend: "Flamengo's home balance headlines PSP's round BEST BET",
  matchAnalysis: [
    "Flamengo's strength this season has been their ability to attack without leaving the back door wide open. Across 28 league games they scored **55 goals** and conceded 23, close to two scored and fewer than one allowed per match. Their **14-game home record includes ten wins** and only ten goals conceded. That balance matters in a Fla-Flu, where a side that loses control for ten minutes can suddenly find itself behind.",
    "Fluminense have scored 44 goals in 28 league fixtures, so they have more than enough attacking quality to challenge their rivals. Their away results, however, tell a less convincing story: **three wins and six draws from 14 trips**, with around 1.43 goals scored and **1.57 conceded** per match. They often stay competitive on the road, but turning a close game into a win has been harder.",
  ],
  tactical: "Flamengo should have opportunities if they can push Fluminense back and force rushed clearances, while Fluminense will look for space when Flamengo commit players forward. The visitors' respectable away scoring rate makes the clean sheet uncertain. Even so, Flamengo's stronger home finishing and much tighter defending provide the clearest argument for a win. The draw remains a real concern in a derby between sides that know each other well.",
  risk: "The draw is the principal risk against an outright Flamengo win: Fluminense have drawn six of their 14 away league matches, and a Fla-Flu's unpredictability has repeatedly produced level scorelines regardless of the underlying numbers. Fluminense's away scoring rate of roughly 1.43 also keeps an upset in play.",
  core: {
    kind: "rows",
    introLine: "The figures below use Flamengo's home league matches and Fluminense's away league matches in the 2026 Brasileirão. Statistical coverage is partial; xG, xGA, shots, shots on target, possession and corners were not available in the sourced material and have not been estimated.",
    rows: [["Matches (N)", "14", "14"], ["Wins", "**10**", "3"], ["Draws", "Unavailable", "**6**"], ["GA/game", "**0.71**", "1.57"], ["GF/game", "Unavailable", "1.43"]],
    provenance: { season: "2026", homeSource: "classificacaogeral.com.br / valorfinal.com.br", awaySource: "classificacaogeral.com.br / valorfinal.com.br", homeMatches: 14, awayMatches: 14, competition: "Brasileirão Série A" },
  },
  sources: brasileiraoRound30PackageSources,
  publishedAt: brasileiraoRound30PublishedAt,
});

// Editorial refresh (9 October 2026): confirmed team-news update for this match specifically.
// Flamengo's Giorgian De Arrascaeta underwent wrist surgery on 1 October 2026 (ge.globo) and
// remains out; Fluminense confirmed on 9 October that Germán Cano has a grade-3 right-hamstring
// strain and is also out. Both are verified against ge.globo reporting, not inferred. The rest of
// the analysis, the prediction, the odds and the access level are unchanged from the 8 October
// publication.
flamengoVsFluminense.analysis[0] = flamengoVsFluminense.analysis[0]
  .replace(
    "## Team news and projected lineups\n\nThe supplied pre-match source set does not establish reliable team-news lists or projected lineups for both clubs. No absence, suspension or starting player has been inferred, and those fields remain unavailable rather than being filled with unsupported information.",
    "## Team news and projected lineups\n\nFlamengo will be without Giorgian De Arrascaeta, who underwent surgery on a fractured left wrist on 1 October 2026 and remains sidelined. Fluminense confirmed on 9 October that Germán Cano has a grade-3 strain in his right hamstring and is also out. No further suspensions are confirmed for either club in the current source set, and no officially confirmed lineup exists at the time of writing.",
  )
  .replace(
    "Flamengo should have opportunities if they can push Fluminense back and force rushed clearances, while Fluminense will look for space when Flamengo commit players forward. The visitors' respectable away scoring rate makes the clean sheet uncertain.",
    "Flamengo should have opportunities if they can push Fluminense back and force rushed clearances, though the absence of Arrascaeta removes a key creative outlet for the hosts, while Fluminense will look for space when Flamengo commit players forward. The visitors' respectable away scoring rate makes the clean sheet uncertain, but losing Germán Cano to a grade-3 hamstring strain takes away their most direct source of away goals and should make Fluminense's attack less threatening than the season-long numbers alone suggest.",
  );
flamengoVsFluminense.sources = [
  ...(flamengoVsFluminense.sources ?? []),
  { name: "ge.globo — Arrascaeta discharged after wrist surgery", url: "https://ge.globo.com/futebol/times/flamengo/noticia/2026/10/01/arrascaeta-recebe-alta-apos-cirurgia-no-punho.ghtml", accessedAt: "2026-10-09T15:00:00.000-03:00" },
  { name: "CNN Brasil — Fluminense confirms Cano and Ignácio injuries", url: "https://www.cnnbrasil.com.br/esportes/futebol/dupla-do-fluminense-vira-desfalque-no-brasileirao/", accessedAt: "2026-10-09T15:00:00.000-03:00" },
];
flamengoVsFluminense.updatedAt = "2026-10-09T15:00:00.000-03:00";

const gremioVsInternacional = createPspImport26Prediction({
  league: "brasileirao-serie-a",
  competition: "Brasileirão Série A 2026",
  slug: "gremio-vs-internacional",
  home: "Grêmio",
  away: "Internacional",
  date: "2026-10-11",
  time: "17:30",
  round: "Round 30",
  venue: "Arena do Grêmio",
  venueAddress: { addressLocality: "Porto Alegre", addressCountry: "Brazil" },
  pick: "Grêmio or Draw (1X)",
  odds: 1.49,
  access: "vip",
  teaser: "Grêmio's home record is well ahead of their season-long numbers, while Internacional have struggled on the road in this Gre-Nal. Full pick and odds are in PRIME VIP.",
  trend: "Grêmio's home edge in a tight Gre-Nal",
  matchAnalysis: [
    "Grêmio have had a frustrating league campaign, but their home performances have been better than their overall numbers. They won **seven of the 14 home games** in the available split and lost only three, scoring about **1.57 goals per match** in Porto Alegre. Across the full season their scoring rate was closer to 1.07, which shows how much more comfortable they have been in front of their own supporters.",
    "Internacional's away figures offer Grêmio another reason for encouragement. Inter managed **three wins in 14 trips**, scoring one goal per away game and conceding around **1.43**. The clubs' overall records are similarly modest: Grêmio scored 31 and conceded 39, while Inter scored 32 and allowed 37 in their respective league samples. There is no strong statistical basis for expecting either team to dominate this Gre-Nal.",
  ],
  tactical: "The derby can turn on a set piece, a mistake or a moment of individual quality, so a narrow result is more believable than a comfortable victory. Grêmio's home record is the main reason to favour them not losing; Inter's problems away from Beira-Rio add weight to that view. The draw is fully covered, but an Inter goal followed by a disciplined defensive display would still be enough to spoil the selection.",
  risk: "Grêmio's own three home defeats in 14 matches show the double chance is not risk-free, and a Gre-Nal's unpredictable nature means Internacional's modest away numbers do not rule out a direct result for the visitors on the day.",
  core: {
    kind: "rows",
    introLine: "The figures below use Grêmio's home league matches and Internacional's away league matches in the 2026 Brasileirão. Statistical coverage is partial; xG, xGA, shots, shots on target, possession and corners were not available in the sourced material and have not been estimated.",
    rows: [["Matches (N)", "14", "14"], ["Wins", "**7**", "3"], ["GF/game", "**1.57**", "1.00"], ["GA/game", "Unavailable", "**1.43**"]],
    provenance: { season: "2026", homeSource: "classificacaogeral.com.br / valorfinal.com.br", awaySource: "classificacaogeral.com.br / valorfinal.com.br", homeMatches: 14, awayMatches: 14, competition: "Brasileirão Série A" },
  },
  sources: brasileiraoRound30PackageSources,
  publishedAt: brasileiraoRound30PublishedAt,
});

const palmeirasVsCorinthians = createPspImport26Prediction({
  league: "brasileirao-serie-a",
  competition: "Brasileirão Série A 2026",
  slug: "palmeiras-vs-corinthians",
  home: "Palmeiras",
  away: "Corinthians",
  date: "2026-10-11",
  time: "17:30",
  round: "Round 30",
  venue: "Allianz Parque",
  venueAddress: { addressLocality: "São Paulo", addressCountry: "Brazil" },
  pick: "Palmeiras to Win",
  odds: 1.59,
  access: "vip",
  teaser: "Palmeiras's home defensive record and Corinthians's lack of away goals frame this São Paulo derby around the hosts' control. Full pick and odds are in PRIME VIP.",
  trend: "Palmeiras's defensive discipline against Corinthians's lack of goals",
  matchAnalysis: [
    "Palmeiras have built their title challenge on a defence that gives opponents very little. They conceded just **21 goals in 28 league matches** in the available season snapshot, and only **nine across 13 home fixtures**. That is fewer than 0.70 conceded per home game. It gives Palmeiras a major advantage in a derby where one goal can decide everything.",
    "Corinthians have found goals harder to come by. Their 29-match total of 30 scored works out at barely one per game, and they won only **three of their first 14 away fixtures** in the same statistical sample. Palmeiras, meanwhile, won **nine of 13 at home** and averaged around 1.77 goals scored there. That combination of reliable home finishing and disciplined defending makes the hosts better equipped to win a tight contest.",
  ],
  tactical: "The biggest warning is the derby itself. Corinthians do not need to outplay Palmeiras for 90 minutes to frustrate them; a compact defensive shape and a dangerous counterattack can keep the match close. Palmeiras also cannot count on a two-goal cushion. But if they reproduce the defensive control shown throughout the season, they should have enough chances to take the three points without needing an unusually high-scoring game.",
  risk: "Corinthians's ability to sit compact and break quickly is the main threat, and their derby unpredictability means a single counterattack goal could be enough to force a draw even against a defence as disciplined as Palmeiras's. Only three wins in 14 away games also limits how much weight to place on Corinthians causing an upset outright.",
  core: {
    kind: "rows",
    introLine: "The figures below use Palmeiras's home league matches and Corinthians's away league matches in the 2026 Brasileirão. Statistical coverage is partial; xG, xGA, shots, shots on target, possession and corners were not available in the sourced material and have not been estimated.",
    rows: [["Matches (N)", "13", "14"], ["Wins", "**9**", "3"], ["GA/game", "**0.69**", "Unavailable"], ["GF/game", "**1.77**", "Unavailable"]],
    provenance: { season: "2026", homeSource: "classificacaogeral.com.br / valorfinal.com.br", awaySource: "classificacaogeral.com.br / valorfinal.com.br", homeMatches: 13, awayMatches: 14, competition: "Brasileirão Série A" },
  },
  sources: brasileiraoRound30PackageSources,
  publishedAt: brasileiraoRound30PublishedAt,
});

const saoPauloVsVitoria = `# São Paulo vs Vitória Prediction, Odds and Betting Tips

**Prediction:** São Paulo to Win
**Odds:** 1.67

## Match information

- **Competition:** Brasileirão Série A
- **Date:** 10 October 2026
- **Kick-off:** 21:00 (BRT, UTC−3)
- **Round:** Round 30
- **Venue:** MorumBIS
- **Location:** São Paulo, Brazil

## Team news and availability

São Paulo are short of familiar options. Rafael, Luciano, Lucas Moura and Domingos Duarte are all listed among the injured, while Jonathan Calleri returns to give the attack a focal point. The sourced material reports no specific absentees for Vitória, and it mentions no suspensions or eligibility issues for either club; none has been inferred. No officially confirmed lineup exists at the time of writing and a projected lineup was not available for either club, so the official teamsheet remains the authority close to kick-off.

## Match analysis

São Paulo return to MorumBIS needing a response after successive league defeats, the latest a 2–0 loss away to Cruzeiro. The results have exposed a side that has struggled to turn possession into chances, particularly while important players remain unavailable. Their recent form is a genuine concern rather than something the home record can simply erase.

Their performances in São Paulo nevertheless offer a stronger basis for optimism. They have won **8 of 14 home league fixtures** and conceded only **12 goals, or 0.86 per match**, which shows how much harder they are to break down at MorumBIS. They have also scored 22 times in those 14 games, an average of 1.57. Vitória's away figures are a sharp contrast: **no wins in 14 league trips**, 30 goals conceded (**2.14 per match**) and only 10 scored (0.71). That gap suggests São Paulo should have enough territory and opportunities to test the visitors' defense, even if their recent finishing has been poor.

Vitória cannot be judged by their away record alone. Their emphatic 4–0 home victory over Chapecoense in the previous round, with Erick and Matheuzinho each scoring twice, shows a team capable of playing with confidence when its attacking combinations work. The challenge is carrying that production to a ground where São Paulo have generally defended well.

## Tactical analysis and expected game state

The expected shape is a home side with the territory and a visiting side that has rarely turned travel into points. Calleri's return matters because São Paulo's recent problem has been converting possession into clear chances, and a central reference point gives the wide and midfield players somewhere to deliver the ball. The absences of Lucas Moura and the other injured players reduce the hosts' creativity and depth, so they may need patience rather than a quick breakthrough. Vitória's best route is the confidence generated by the 4–0 win over Chapecoense, with Erick and Matheuzinho supplying the finishing, but a team conceding 2.14 per away game will struggle to protect a lead or a draw for long.

### Statistical Core Predictions-Sports-Prime

The figures below use São Paulo's home league matches and Vitória's away league matches in the 2026 Brasileirão. Coverage is partial: xG, xGA, shots, shots on target, possession and corners were not available in the sourced material and have not been estimated.

| Metric | São Paulo HOME | Vitória AWAY |
| --- | ---: | ---: |
| Matches (N) | 14 | 14 |
| Wins | **8** | **0** |
| GF/game | 1.57 | 0.71 |
| GA/game | **0.86** | **2.14** |

The table describes each club only in its relevant venue split, so São Paulo's defensive record at MorumBIS is set directly against Vitória's record on the road. Past frequency is not a forecast, and the hosts' recent league defeats sit outside this home sample.

## Market assessment and risk

The published price is **1.67**, a raw implied probability of **59.88%** (1 / 1.67). That is the market threshold, not a claim that the home and away splits translate directly into a win probability. The value case rests on the venue gap between the two teams, set against the main risks, which are São Paulo's recent run of league defeats, their poor finishing and the injuries to Rafael, Luciano, Lucas Moura and Domingos Duarte. Vitória's improvement after the 4–0 win over Chapecoense adds further uncertainty, although it does not remove the large gap between the two teams' home and away numbers.

## Conclusion

The venue split is the deciding factor: a São Paulo side that has won 8 of 14 at MorumBIS and conceded 0.86 per game faces a Vitória team without an away win and conceding 2.14 per trip. Recent form and injuries keep the price honest, but the evidence still favors the hosts.

**Prediction:** São Paulo to Win
**Odds:** **1.67**
Raw implied probability: **59.88%** (1 / odds)`;

const vascoVsRemo = `# Vasco da Gama vs Remo Prediction, Odds and Betting Tips

**Prediction:** Vasco da Gama to Win
**Odds:** 1.33

## Match information

- **Competition:** Brasileirão Série A
- **Date:** 10 October 2026
- **Kick-off:** 17:00 (BRT, UTC−3)
- **Round:** Round 30
- **Venue:** São Januário
- **Location:** Rio de Janeiro, Brazil

## Team news and availability

The sourced material does not establish reliable injury, suspension or eligibility information for either club, and none has been inferred. A projected lineup was not available for either club, and the official teamsheet remains the authority close to kick-off.

## Match analysis

Vasco's season has taken a dramatic turn. Five consecutive league victories have pulled the Rio club away from its worst spell, and the latest came in a tense 2–1 derby against Botafogo, decided by goals from Alan Lescano and David. The run has produced **12 goals in five league matches, an average of 2.40**, far above their season-long scoring rate of roughly 1.29 per game. It is a meaningful improvement in the way Vasco attack space and turn promising moves into goals.

São Januário has not been an automatic source of points: **7 wins and 5 defeats in 14 home league games** show the inconsistency that shaped the earlier campaign, and Vasco have conceded approximately 1.29 goals per home match, so a clean sheet should not be taken for granted. The comparison with Remo's travels is nevertheless striking. The visitors have **lost 9 of 14 away league matches**, conceded two goals per trip and scored only one on average. Their defense is particularly vulnerable against a home side now creating and finishing chances more regularly.

Remo's late equalizer in the 1–1 draw with Grêmio at least showed resilience, but it did not end their winless sequence, which has stretched to **nine league matches**. A side repeatedly forced to chase games faces a Vasco attack arriving with confidence and momentum.

## Tactical analysis and expected game state

Vasco's recent scoring suggests a team that is now finding space quickly and finishing the moves it creates, and the derby win over Botafogo, with Alan Lescano and David on the scoresheet, shows more than one route to goals. Remo's profile on the road is that of a team forced to chase: with two goals conceded per trip and only one scored, an early Vasco goal would push the visitors into the kind of open game where their defensive problems are most exposed. The counterpoint is at the other end, because Vasco have conceded around 1.29 goals per home match, and a demanding derby may have taken a physical toll. Remo can look to their late equalizer against Grêmio as proof they can stay in games, but nine league matches without a win make that a fragile foundation.

### Statistical Core Predictions-Sports-Prime

The figures below use Vasco's home league matches and Remo's away league matches in the 2026 Brasileirão where the sourced material provides a venue split. Coverage is partial: Vasco's scoring rate at home, xG, xGA, shots, shots on target, possession and corners were not available as venue-specific figures and have not been estimated.

| Metric | Vasco HOME | Remo AWAY |
| --- | ---: | ---: |
| Matches (N) | 14 | 14 |
| Wins | **7** | Unavailable |
| Defeats | 5 | **9** |
| GF/game | Unavailable | 1.00 |
| GA/game | 1.29 | **2.00** |

Vasco's season-long scoring rate of roughly 1.29 per game is an overall figure and is not shown as a home split. The recent five-match average of 2.40 is likewise a form measure rather than a venue split, and the sample is small.

## Market assessment and risk

The published price is **1.33**, a raw implied probability of **75.19%** (1 / 1.33). That is a short price, and it is the market threshold rather than a historical frequency: Vasco's own home record of 7 wins and 5 defeats shows that São Januário has not been a guaranteed source of points. The main risks are Vasco's home defensive record, the physical cost of a demanding derby and the fact that Remo's late equalizer against Grêmio showed they can stay competitive. The value case rests on the combination of Vasco's current finishing and Remo's weak road numbers rather than on the home record alone.

## Conclusion

Vasco arrive with five straight league wins, 12 goals in that run and a home side confident in front of goal, against a Remo team that has lost 9 of 14 away, conceded two per trip and gone nine league matches without winning. The defensive questions at São Januário keep the price short rather than safe, but the hosts are the more convincing winners.

**Prediction:** Vasco da Gama to Win
**Odds:** **1.33**
Raw implied probability: **75.19%** (1 / odds)`;

export const brasileiraoRound30: EditorialPrediction[] = [
  {
    league: "brasileirao-serie-a",
    homeTeam: "São Paulo",
    awayTeam: "Vitória",
    slug: "sao-paulo-vs-vitoria",
    title: "São Paulo vs Vitória",
    seoTitle: "São Paulo vs Vitória Prediction, Odds and Betting Tips",
    access: "vip",
    analysisAccess: "vip",
    predictionAccess: "vip",
    teaser: "São Paulo's record at MorumBIS and Vitória's numbers on the road sit at opposite ends of the table, while the hosts' recent form and injuries complicate the picture. Full pick and odds are in PRIME VIP.",
    editorialStandard: "psp-v1",
    analysisFormat: "markdown",
    analysisLanguage: "en",
    analysis: [saoPauloVsVitoria],
    picks: {
      main: "São Paulo to Win",
      publishedOdds: 1.67,
      oddsProvenance: {
        source: "Editor-supplied PSP NHL + Brasileirão publication package",
        provenance: "author_attested",
        market: "São Paulo to Win",
      },
    },
    matchInfo: { date: "2026-10-10", time: "21:00", round: "Round 30", venue: "MorumBIS" },
    published: true,
    publishedAt: "2026-10-08T12:00:00.000-03:00",
    updatedAt: "2026-10-08T12:00:00.000-03:00",
    sourceStatus: "partial",
    statisticalCoreProvenance: {
      season: "2026",
      home: { sampleType: "home", source: "Radar Onze", competition: "Brasileirão Série A", matches: 14 },
      away: { sampleType: "away", source: "Radar Onze", competition: "Brasileirão Série A", matches: 14 },
    },
    sources: [
      { name: "São Paulo–Vitória match statistics", url: "https://radaronze.com.br/brasileirao/rodada/30/sao-paulo-x-vitoria-1492408" },
      { name: "São Paulo injury and form update", url: "https://www.uol.com.br/esporte/futebol/ultimas-noticias/2026/10/07/calleri-aponta-desfalques-no-sao-paulo-e-diz-que-time-jogou-pior-que-treina.ghtm" },
      { name: "Vitória's latest result", url: "https://www.uol.com.br/esporte/futebol/ultimas-noticias/2026/10/07/vitoria-x-chapecoense---brasileirao.ghtm" },
    ],
  },
  {
    league: "brasileirao-serie-a",
    homeTeam: "Vasco",
    awayTeam: "Remo",
    slug: "vasco-vs-remo",
    title: "Vasco da Gama vs Remo",
    seoTitle: "Vasco da Gama vs Remo Prediction, Odds and Betting Tips",
    access: "vip",
    analysisAccess: "vip",
    predictionAccess: "vip",
    teaser: "Vasco arrive on a five-match winning run and Remo's league form on the road has been poor, but São Januário has not always been a source of points. Full pick and odds are in PRIME VIP.",
    editorialStandard: "psp-v1",
    analysisFormat: "markdown",
    analysisLanguage: "en",
    analysis: [vascoVsRemo],
    picks: {
      main: "Vasco da Gama to Win",
      publishedOdds: 1.33,
      oddsProvenance: {
        source: "Editor-supplied PSP NHL + Brasileirão publication package",
        provenance: "author_attested",
        market: "Vasco da Gama to Win",
      },
    },
    matchInfo: { date: "2026-10-10", time: "17:00", round: "Round 30", venue: "São Januário" },
    published: true,
    publishedAt: "2026-10-08T12:00:00.000-03:00",
    updatedAt: "2026-10-08T12:00:00.000-03:00",
    sourceStatus: "partial",
    statisticalCoreProvenance: {
      season: "2026",
      home: { sampleType: "home", source: "ogol", competition: "Brasileirão Série A", matches: 14 },
      away: { sampleType: "away", source: "ogol", competition: "Brasileirão Série A", matches: 14 },
    },
    sources: [
      { name: "Vasco–Remo match and squad information", url: "https://www.ogol.com.br/jogo/2026-10-10-vasco-remo/11861070" },
      { name: "Vasco's latest derby win", url: "https://www.uol.com.br/esporte/futebol/ultimas-noticias/2026/10/07/botafogo-vasco-brasileirao-26-como-foi-o-jogo.ghtm" },
      { name: "Remo's recent form", url: "https://www.uol.com.br/esporte/futebol/ultimas-noticias/2026/10/07/remo-x-gremio---brasileirao.ghtm" },
    ],
  },
  atleticoMgVsSantos,
  bahiaVsMirassol,
  bragantinoVsCruzeiro,
  chapecoenseVsAthleticoPr,
  coritibaVsBotafogo,
  flamengoVsFluminense,
  gremioVsInternacional,
  palmeirasVsCorinthians,
];
