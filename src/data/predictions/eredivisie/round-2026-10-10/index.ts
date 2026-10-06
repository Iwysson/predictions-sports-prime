import { createWave28Prediction, type Wave28Input } from "../../editorial-tools/wave-28/factory";

const fixtureSource = { name: "Eredivisie — official autumn 2026/27 fixture programme", url: "https://eredivisie.b-cdn.net/production/Programma-najaar-VriendenLoterij-Eredivisie_2026-09-08-102542_akvd.pdf" };
const statsSource = { name: "SoccerSTATS — 2026/27 Eredivisie home and away tables", url: "https://www.soccerstats.com/homeaway.asp?league=netherlands" };
const common = { league: "eredivisie" as const, competition: "Eredivisie", round: "Round 8", fixtureSource, statsSource };

const inputs: Wave28Input[] = [
  {
    ...common, slug: "pec-zwolle-vs-cambuur", home: "PEC Zwolle", away: "Cambuur", date: "2026-10-11", time: "14:30", venue: "MAC³PARK Stadion", location: "Zwolle, Netherlands", pick: "PEC Zwolle X1 + Under 4.5", odds: 1.67, access: "free", trend: "Home protection with a high goal ceiling", teaser: "Two struggling teams create uncertainty, but the home protection and a four-goal allowance shape the public selection.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Zwolle are 1-1-5 overall, scoring 0.86 goals per match and conceding 2.86. Their attack produces around 1.18 xG and 3.4 shots on target, and a **43% failure-to-score rate** explains why the selection protects the home side rather than demanding a win.",
      "Cambuur are also unstable at 1-2-4, with 1.43 goals scored and 2.71 conceded per match. Their 71% BTTS and 86% Over 2.5 rates show the danger to the total leg, although the Under 4.5 still allows four goals and Zwolle's limited attack can restrain the ceiling."
    ],
    tactical: "Zwolle should try to keep their midfield distances short and attack after Cambuur lose the ball, because an open exchange would favour the visitor's volatile scoring environment. Cambuur can threaten if they force early turnovers and stretch the game, but a slower first half would strengthen both the home protection and the Under leg.",
    risk: "The conflict is visible in Zwolle's **4.33 total goals per home match** and Cambuur's high Over rates. Five goals are still required to beat the ceiling, but neither defence has been stable enough to call the Under comfortable.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "0-0-3", "not supplied"], ["GF/game", "0.33", "not supplied"], ["GA/game", "4.00", "not supplied"], ["Total goals/game", "4.33", "not supplied"], ["Failed to score", "43% overall", "not supplied"]]
  },
  {
    ...common, slug: "telstar-vs-ado-den-haag", home: "Telstar", away: "ADO Den Haag", date: "2026-10-11", time: "14:30", venue: "BUKO Stadion", location: "Velsen-Zuid, Netherlands", pick: "Telstar X1 + Over 1.5", odds: 1.58, access: "free", trend: "Opposing ADO's winless away start", teaser: "Telstar's attack is limited, but ADO's winless start and exposed defence make a protected home position relevant.", homeMatches: 3, awayMatches: 4,
    analysis: [
      "Telstar score only 0.83 goals per match and create around 0.98 xG, with 2.3 shots on target. Their **0-1-2 home record** is not a basis for an aggressive moneyline, so the draw protection is central to the selection.",
      "ADO are winless, average only 0.29 points per match and concede 2.43 goals overall. They have no clean sheets, while 71% of their matches have produced BTTS; that defensive profile gives the modest two-goal leg support even if Telstar cannot carry the scoring alone."
    ],
    tactical: "Telstar need to avoid a slow, sterile possession game and instead attack the spaces that appear after ADO's first line is bypassed. ADO can undermine X1 through direct transition attacks, but their defensive record means protecting a lead or a level score for long periods has been difficult.",
    risk: "Telstar's **50% failure-to-score rate** is the main danger to both legs. ADO's poor defence helps, but a goalless home contribution could leave the total dependent on a visitor that has also struggled for control.",
    rows: [["Matches (N)", "3", "4"], ["W-D-L", "0-1-2", "not supplied"], ["Points/game", "0.33", "0.25"], ["GF/game", "1.00", "not supplied"], ["GA/game", "3.00", "not supplied"], ["Total goals/game", "4.00", "not supplied"]]
  },
  {
    ...common, slug: "excelsior-vs-fc-groningen", home: "Excelsior", away: "FC Groningen", date: "2026-10-11", time: "16:45", venue: "Van Donge & De Roo Stadion", location: "Rotterdam, Netherlands", pick: "Groningen X2 + Over 1.5", odds: 1.81, access: "free", trend: "Groningen scoring with result protection", teaser: "Both teams have scored freely, but Groningen's road return and broader attacking output support the protected visitor angle.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Excelsior are 3-2-2 overall and score 2.14 goals per game, but their home split is **1-0-2 with four scored and five conceded**. Every league match has cleared 2.5 goals, so the two-goal requirement is modest even though the result leg remains demanding.",
      "Groningen also stand at 3-2-2, scoring 2.14 and conceding 1.86 per match. Their fixtures average 4.00 goals, BTTS and Over 2.5 have both landed in 86%, and approximately 1.66 xG with 5.4 shots on target supports the visitor's scoring threat."
    ],
    tactical: "Both sides have reasons to press forward rather than protect a point, so the space behind midfield could decide the match. Groningen can make X2 work by using their stronger attacking process to answer Excelsior pressure, while the host's direct scoring form means the visitor cannot defend passively.",
    risk: "Excelsior's strong overall start is the major warning, and their negative xG differential does not erase the results already achieved. Groningen need to avoid defeat as well as help produce two goals, so a sharp home attacking performance can break the combination despite a favourable scoring environment.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-0-2", "not supplied"], ["Points/game", "1.00", "1.33"], ["GF/game", "1.33", "not supplied"], ["GA/game", "1.67", "not supplied"], ["Total goals/game", "3.00", "not supplied"]]
  },
  {
    ...common, slug: "go-ahead-eagles-vs-sparta-rotterdam", home: "Go Ahead Eagles", away: "Sparta Rotterdam", date: "2026-10-10", time: "16:30", venue: "De Adelaarshorst", location: "Deventer, Netherlands", pick: "Go Ahead Eagles to win", odds: 1.78, access: "vip", trend: "Unbeaten home split against poor Sparta form", teaser: "Go Ahead's unbeaten home record and stronger attacking process meet a Sparta side conceding more than twice per league match.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Go Ahead are **2-1-0 at home**, scoring eight and conceding three for 2.33 points per game. Their overall attack creates around 1.7 xG and has already produced four goals against Willem II and three against ADO, giving the home record a credible attacking base.",
      "Sparta are 1-2-4 overall, take only 0.71 points per game and concede 2.43. They have no clean sheets and five league matches without a win, while roughly 1.91 xGA reinforces the defensive concern rather than dismissing it as finishing variance."
    ],
    tactical: "Go Ahead can use the narrow home ground to sustain pressure and recover second balls close to Sparta's box. Sparta's best response is to play through that pressure before the hosts reset, because Go Ahead's own defence is not flawless and can be exposed when the game stretches.",
    risk: "Go Ahead have conceded 14 in seven overall, so the **1.00 home GA/game** should not be read as a guarantee of control. Sparta can threaten in transition, and the moneyline fails if the host's attacking superiority produces only a draw.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "2-1-0", "not supplied"], ["Points/game", "2.33", "1.00"], ["GF/game", "2.67", "not supplied"], ["GA/game", "1.00", "not supplied"]]
  },
  {
    ...common, slug: "feyenoord-vs-az-alkmaar", home: "Feyenoord", away: "AZ Alkmaar", date: "2026-10-10", time: "18:45", venue: "De Kuip", location: "Rotterdam, Netherlands", pick: "Over 2.5 goals", odds: 1.38, access: "vip", bestAnalysis: true, trend: "Two elite attacking processes", teaser: "Feyenoord and AZ both bring high scoring and xG production into a matchup shaped by attacking quality rather than weak teams.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Feyenoord score around **3.4 goals per league match** and generate roughly 2.4 xG, more than 22 shots and about 8.6 shots on target. Their Over 2.5 rate is approximately 86%, so three goals is a modest threshold for their current attacking process.",
      "AZ add 2.57 goals and roughly **2.30 xG per match**, with close to 20 attempts. Both sides have taken around 2.6 points per game in the recent five-match sample, which makes this an Over based on two functioning attacks rather than two teams simply conceding badly."
    ],
    tactical: "Feyenoord should try to pin AZ's wide defenders and keep attacks alive through counter-pressure, while AZ can exploit the space behind that pressure with direct progression. If either side scores early, the other has the attacking quality to chase rather than settle, encouraging a stretched second phase.",
    risk: "The **1.38 price** offers little margin for an unusually controlled contest. Two strong teams can cancel each other through cautious rest defence, and poor finishing would matter more at a short price even when shot volume remains high.",
    rows: [["Matches (N)", "3", "3"], ["GF/game", "3.4 overall", "2.57 overall"], ["xG/game", "2.40 overall", "2.30 overall"], ["Shots/game", "22+ overall", "about 20 overall"], ["Over 2.5 goals", "86% overall", "not supplied"]]
  },
  {
    ...common, slug: "fortuna-sittard-vs-fc-twente", home: "Fortuna Sittard", away: "FC Twente", date: "2026-10-10", time: "20:00", venue: "Fortuna Sittard Stadion", location: "Sittard, Netherlands", pick: "Over 2.5 goals", odds: 1.35, access: "vip", trend: "Twente attack against Fortuna home concessions", teaser: "Fortuna's home defence has conceded at a high rate, while Twente arrive with sustained chance creation and scoring form.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Fortuna have 13 points from seven matches but have conceded 14 goals, exactly 2.00 per game. At home they are **1-0-2 with four scored and eight conceded**, making their 2.67 concession rate the clearest route to a three-goal total.",
      "Twente are 5-1-1 overall, score 2.14 per match and create approximately **2.38 xG with 21-plus shots per game**. Four goals away at Cambuur and a 4-1-0 recent league sequence show that the visitors can do most of the scoring work if Fortuna's defence remains exposed."
    ],
    tactical: "Twente can press Fortuna's build-up and use repeated wide-to-central attacks to keep the home defence moving. Fortuna's scoring average means they can contribute if Twente leave space behind their pressure, but the visitor's sustained shot volume also creates a route to three goals without a large home contribution.",
    risk: "Twente concede only 1.00 goal per match overall, so a controlled away performance could reduce Fortuna's role. At a short price, the selection remains vulnerable to Twente taking a narrow lead and prioritising game management over continued attacking volume.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-0-2", "1-1-1"], ["GF/game", "1.33", "not supplied"], ["GA/game", "2.67", "not supplied"], ["xG/game", "not supplied", "2.38 overall"]]
  },
  {
    ...common, slug: "ajax-vs-nec-nijmegen", home: "Ajax", away: "NEC Nijmegen", date: "2026-10-10", time: "21:00", venue: "Johan Cruijff ArenA", location: "Amsterdam, Netherlands", pick: "Over 3.5 goals", odds: 1.78, access: "vip", bestAnalysis: true, trend: "Ajax firepower meets NEC volatility", teaser: "Ajax's scoring run meets an NEC side that both creates chances and concedes frequently, producing several routes to a high total.", homeMatches: 4, awayMatches: 3,
    analysis: [
      "Ajax have scored **21 goals in seven league matches**, with recent results including 5-1, 5-1, 4-0 and 2-2. Their xG is comfortably above two per game, so a four-goal line is supported by chance creation as well as finished scores.",
      "NEC score 1.71 and concede 1.86 per match, with 86% BTTS, 86% Over 2.5 and **57% Over 3.5**. They create around 1.71 xG and take about 15 shots, which matters because the selection is healthier if the visitor contributes rather than requiring Ajax to score four alone."
    ],
    tactical: "Ajax should dominate territory and look to create overloads around NEC's defensive block, but their advanced positioning gives the visitors transition opportunities. NEC's willingness to attack can accelerate the game state; a visitor goal would open direct routes to 3-1 or 2-2 rather than merely hurting Ajax.",
    risk: "Four goals remains an aggressive demand, and Ajax controlling possession after taking a lead could reduce the late tempo. NEC's strong away points return also suggests they may defend more effectively than their overall concession rate implies.",
    rows: [["Matches (N)", "4", "3"], ["GF/game", "3.00 overall", "1.71 overall"], ["GA/game", "not supplied", "1.86 overall"], ["xG/game", "above 2.00 overall", "1.71 overall"], ["BTTS", "not supplied", "86% overall"], ["Over 3.5 goals", "not supplied", "57% overall"]]
  },
  {
    ...common, slug: "fc-utrecht-vs-willem-ii", home: "FC Utrecht", away: "Willem II", date: "2026-10-11", time: "12:15", venue: "Stadion Galgenwaard", location: "Utrecht, Netherlands", pick: "FC Utrecht to win", odds: 1.48, access: "vip", trend: "Opposing Willem II's winless start", teaser: "Utrecht's own form is fragile, but Willem II arrive winless with the league's weaker attacking and defensive profile.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Utrecht are only 1-2-4 overall, score 1.57 and concede 3.43 per match. Their **0-1-2 home line with 5 scored and 13 conceded** is significant contrary evidence, so this is not a claim that the hosts have played well.",
      "The case comes from Willem II being even weaker: 0-2-5, 0.86 goals scored and 2.86 conceded per match. Their roughly 1.20 xG against 2.33 xGA creates a large negative chance-quality gap, while no clean sheets and no wins leave Utrecht with the better opportunity to convert home advantage."
    ],
    tactical: "Utrecht need to protect the space behind midfield and avoid turning the match into the same end-to-end pattern behind their poor concession rate. Willem II can threaten if the hosts overcommit, but a compact Utrecht structure followed by quicker attacks into the visitor's exposed back line is the clearest home route.",
    risk: "Utrecht's **6.00 total-goal home average** and winless home split make a short moneyline uncomfortable. Their defence can keep Willem II in the contest, and the selection requires a host that has not yet shown reliable game control at Galgenwaard.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "0-1-2", "not supplied"], ["GF/game", "1.67", "not supplied"], ["GA/game", "4.33", "not supplied"], ["Total goals/game", "6.00", "not supplied"], ["xGA/game", "2.09 overall", "2.33 overall"]]
  }
];

export const eredivisieRound2026_10_10 = inputs.map(createWave28Prediction);
