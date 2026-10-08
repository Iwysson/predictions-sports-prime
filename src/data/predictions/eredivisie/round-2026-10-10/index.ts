import { createWave28Prediction, type Wave28Input } from "../../editorial-tools/wave-28/factory";

const fixtureSource = { name: "Eredivisie — official autumn 2026/27 fixture programme", url: "https://eredivisie.b-cdn.net/production/Programma-najaar-VriendenLoterij-Eredivisie_2026-09-08-102542_akvd.pdf" };
const statsSource = { name: "SoccerSTATS — 2026/27 Eredivisie home and away tables", url: "https://www.soccerstats.com/homeaway.asp?league=netherlands" };
const common = { league: "eredivisie" as const, competition: "Eredivisie", round: "Round 8", fixtureSource, statsSource };

const inputs: Wave28Input[] = [
  {
    ...common, slug: "pec-zwolle-vs-cambuur", home: "PEC Zwolle", away: "Cambuur", date: "2026-10-11", time: "14:30", venue: "MAC³PARK Stadion", location: "Zwolle, Netherlands", pick: "PEC Zwolle X1 + Under 4.5", odds: 1.67, access: "free", trend: "Home protection with a high goal ceiling", teaser: "Two struggling teams create uncertainty, but the home protection and a four-goal allowance shape the public selection.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Zwolle's overall record of 1-1-5 tells only part of the story: scoring just 0.86 goals per match while conceding 2.86 to an attack that rarely finishes what it creates. Around 1.18 xG and 3.4 shots on target per game hint at some chance creation, but a **43% failure-to-score rate** is exactly why the selection leans on protecting the home side rather than backing them outright to win.",
      "Cambuur arrive just as unstable at 1-2-4, averaging 1.43 goals scored against 2.71 conceded. A 71% BTTS rate and 86% of their matches going Over 2.5 both point to an open scoring pattern that threatens the total leg — though the Under 4.5 still has room for four goals, and Zwolle's blunt attack should help keep the ceiling in check."
    ],
    tactical: "Zwolle should try to keep their midfield distances short and attack after Cambuur lose the ball, because an open exchange would favour the visitor's volatile scoring environment. Cambuur can threaten if they force early turnovers and stretch the game, but a slower first half would strengthen both the home protection and the Under leg.",
    risk: "The conflict is visible in Zwolle's **4.33 total goals per home match** and Cambuur's high Over rates. Five goals are still required to beat the ceiling, but neither defence has been stable enough to call the Under comfortable.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "0-0-3", "not supplied"], ["GF/game", "0.33", "not supplied"], ["GA/game", "4.00", "not supplied"], ["Total goals/game", "4.33", "not supplied"], ["Failed to score", "43% overall", "not supplied"]]
  },
  {
    ...common, slug: "telstar-vs-ado-den-haag", home: "Telstar", away: "ADO Den Haag", date: "2026-10-11", time: "14:30", venue: "BUKO Stadion", location: "Velsen-Zuid, Netherlands", pick: "Telstar X1 + Over 1.5", odds: 1.58, access: "free", trend: "Opposing ADO's winless away start", teaser: "Telstar's attack is limited, but ADO's winless start and exposed defence make a protected home position relevant.", homeMatches: 3, awayMatches: 4,
    analysis: [
      "Telstar's attack has been thin all season — just 0.83 goals per match on around 0.98 xG and 2.3 shots on target — and a **0-1-2 home record** gives little reason to back them outright, which is why the draw protection sits at the centre of this pick rather than a straight home win.",
      "ADO, meanwhile, are still winless, taking only 0.29 points per match and shipping 2.43 goals a game with zero clean sheets. That leaky defence has produced BTTS in 71% of their matches, which is enough on its own to support the modest two-goal line even if Telstar can't be relied on to do much of the scoring."
    ],
    tactical: "Telstar need to avoid a slow, sterile possession game and instead attack the spaces that appear after ADO's first line is bypassed. ADO can undermine X1 through direct transition attacks, but their defensive record means protecting a lead or a level score for long periods has been difficult.",
    risk: "Telstar's **50% failure-to-score rate** is the main danger to both legs. ADO's poor defence helps, but a goalless home contribution could leave the total dependent on a visitor that has also struggled for control.",
    rows: [["Matches (N)", "3", "4"], ["W-D-L", "0-1-2", "not supplied"], ["Points/game", "0.33", "0.25"], ["GF/game", "1.00", "not supplied"], ["GA/game", "3.00", "not supplied"], ["Total goals/game", "4.00", "not supplied"]]
  },
  {
    ...common, slug: "excelsior-vs-fc-groningen", home: "Excelsior", away: "FC Groningen", date: "2026-10-11", time: "16:45", venue: "Van Donge & De Roo Stadion", location: "Rotterdam, Netherlands", pick: "Groningen X2 + Over 1.5", odds: 1.81, access: "free", trend: "Groningen scoring with result protection", teaser: "Both teams have scored freely, but Groningen's road return and broader attacking output support the protected visitor angle.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Excelsior's overall record of 3-2-2 and 2.14 goals per game look solid, but their home form tells a different story at **1-0-2, with four scored and five conceded**. Every one of their league matches has cleared 2.5 goals this season, though, so the two-goal requirement here is modest even if the result side of the bet remains a tougher ask.",
      "Groningen match that overall record almost exactly at 3-2-2, scoring 2.14 and conceding 1.86 per game, and their matches have averaged four goals combined. BTTS and Over 2.5 have both landed in 86% of their fixtures, and roughly 1.66 xG from 5.4 shots on target backs the visitors as a genuine scoring threat rather than just a product of weak opposition defences."
    ],
    tactical: "Both sides have reasons to press forward rather than protect a point, so the space behind midfield could decide the match. Groningen can make X2 work by using their stronger attacking process to answer Excelsior pressure, while the host's direct scoring form means the visitor cannot defend passively.",
    risk: "Excelsior's strong overall start is the major warning, and their negative xG differential does not erase the results already achieved. Groningen need to avoid defeat as well as help produce two goals, so a sharp home attacking performance can break the combination despite a favourable scoring environment.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-0-2", "not supplied"], ["Points/game", "1.00", "1.33"], ["GF/game", "1.33", "not supplied"], ["GA/game", "1.67", "not supplied"], ["Total goals/game", "3.00", "not supplied"]]
  },
  {
    ...common, slug: "go-ahead-eagles-vs-sparta-rotterdam", home: "Go Ahead Eagles", away: "Sparta Rotterdam", date: "2026-10-10", time: "16:30", venue: "De Adelaarshorst", location: "Deventer, Netherlands", pick: "Go Ahead Eagles to win", odds: 1.78, access: "vip", trend: "Unbeaten home split against poor Sparta form", teaser: "Go Ahead's unbeaten home record and stronger attacking process meet a Sparta side conceding more than twice per league match.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Go Ahead Eagles are unbeaten at home this season, **2-1-0** with eight scored against three conceded for 2.33 points per game. That record is backed by substance rather than luck: an attack generating around 1.7 xG overall has already delivered four goals against Willem II and three against ADO, giving the home run a credible foundation.",
      "Sparta, by contrast, sit at 1-2-4 overall with only 0.71 points per game and 2.43 goals conceded. Five league matches without a win and zero clean sheets paint a struggling side, and an xGA of roughly 1.91 suggests the defensive issues are structural rather than a run of bad finishing luck against them."
    ],
    tactical: "Go Ahead can use the narrow home ground to sustain pressure and recover second balls close to Sparta's box. Sparta's best response is to play through that pressure before the hosts reset, because Go Ahead's own defence is not flawless and can be exposed when the game stretches.",
    risk: "Go Ahead have conceded 14 in seven overall, so the **1.00 home GA/game** should not be read as a guarantee of control. Sparta can threaten in transition, and the moneyline fails if the host's attacking superiority produces only a draw.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "2-1-0", "not supplied"], ["Points/game", "2.33", "1.00"], ["GF/game", "2.67", "not supplied"], ["GA/game", "1.00", "not supplied"]]
  },
  {
    ...common, slug: "feyenoord-vs-az-alkmaar", home: "Feyenoord", away: "AZ Alkmaar", date: "2026-10-10", time: "18:45", venue: "De Kuip", location: "Rotterdam, Netherlands", pick: "Over 2.5 goals", odds: 1.38, access: "vip", bestAnalysis: true, trend: "Two elite attacking processes", teaser: "Feyenoord and AZ both bring high scoring and xG production into a matchup shaped by attacking quality rather than weak teams.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Feyenoord's attack has been relentless, averaging **3.4 goals per league match** off roughly 2.4 xG, more than 22 shots and about 8.6 shots on target per game. With an Over 2.5 rate near 86%, three goals is a low bar for an attack running at this level.",
      "AZ aren't far behind, adding 2.57 goals of their own from close to **2.30 xG per match** and nearly 20 attempts a game. Both sides have averaged around 2.6 points per game across their last five matches, underlining that this Over is built on two attacks that are genuinely firing rather than two defences simply collapsing."
    ],
    tactical: "Feyenoord should try to pin AZ's wide defenders and keep attacks alive through counter-pressure, while AZ can exploit the space behind that pressure with direct progression. If either side scores early, the other has the attacking quality to chase rather than settle, encouraging a stretched second phase.",
    risk: "The **1.38 price** offers little margin for an unusually controlled contest. Two strong teams can cancel each other through cautious rest defence, and poor finishing would matter more at a short price even when shot volume remains high.",
    rows: [["Matches (N)", "3", "3"], ["GF/game", "3.4 overall", "2.57 overall"], ["xG/game", "2.40 overall", "2.30 overall"], ["Shots/game", "22+ overall", "about 20 overall"], ["Over 2.5 goals", "86% overall", "not supplied"]]
  },
  {
    ...common, slug: "fortuna-sittard-vs-fc-twente", home: "Fortuna Sittard", away: "FC Twente", date: "2026-10-10", time: "20:00", venue: "Fortuna Sittard Stadion", location: "Sittard, Netherlands", pick: "Over 2.5 goals", odds: 1.35, access: "vip", trend: "Twente attack against Fortuna home concessions", teaser: "Fortuna's home defence has conceded at a high rate, while Twente arrive with sustained chance creation and scoring form.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Fortuna have collected 13 points from seven matches, but their defence has leaked 14 goals along the way, exactly 2.00 per game. At home that weakness sharpens further to **1-0-2, with four scored and eight conceded**, and a 2.67 home concession rate is the clearest single route to this match clearing three goals.",
      "Twente bring the attack to match it: 5-1-1 overall, scoring 2.14 per game from approximately **2.38 xG and 21-plus shots per match**. A four-goal haul away at Cambuur and a 4-1-0 run in their last five league games show the visitors are capable of doing most of the scoring themselves if Fortuna's defence stays as exposed as it has been."
    ],
    tactical: "Twente can press Fortuna's build-up and use repeated wide-to-central attacks to keep the home defence moving. Fortuna's scoring average means they can contribute if Twente leave space behind their pressure, but the visitor's sustained shot volume also creates a route to three goals without a large home contribution.",
    risk: "Twente concede only 1.00 goal per match overall, so a controlled away performance could reduce Fortuna's role. At a short price, the selection remains vulnerable to Twente taking a narrow lead and prioritising game management over continued attacking volume.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-0-2", "1-1-1"], ["GF/game", "1.33", "not supplied"], ["GA/game", "2.67", "not supplied"], ["xG/game", "not supplied", "2.38 overall"]]
  },
  {
    ...common, slug: "ajax-vs-nec-nijmegen", home: "Ajax", away: "NEC Nijmegen", date: "2026-10-10", time: "21:00", venue: "Johan Cruijff ArenA", location: "Amsterdam, Netherlands", pick: "Over 3.5 goals", odds: 1.78, access: "vip", bestAnalysis: true, trend: "Ajax firepower meets NEC volatility", teaser: "Ajax's scoring run meets an NEC side that both creates chances and concedes frequently, producing several routes to a high total.", homeMatches: 4, awayMatches: 3,
    analysis: [
      "Ajax have been scoring at will, netting **21 goals in seven league matches** with recent scorelines of 5-1, 5-1, 4-0 and 2-2. With their xG comfortably above two per game, the four-goal line is grounded in genuine chance creation rather than a short run of clinical finishing.",
      "NEC add to the picture themselves, scoring 1.71 and conceding 1.86 per match, with BTTS in 86% of fixtures, Over 2.5 in 86% and **Over 3.5 in 57%**. Around 1.71 xG and roughly 15 shots per game show they're no pushover defensively either, which matters here because the bet is healthier if the visitors chip in a goal rather than leaving Ajax to find four on their own."
    ],
    tactical: "Ajax should dominate territory and look to create overloads around NEC's defensive block, but their advanced positioning gives the visitors transition opportunities. NEC's willingness to attack can accelerate the game state; a visitor goal would open direct routes to 3-1 or 2-2 rather than merely hurting Ajax.",
    risk: "Four goals remains an aggressive demand, and Ajax controlling possession after taking a lead could reduce the late tempo. NEC's strong away points return also suggests they may defend more effectively than their overall concession rate implies.",
    rows: [["Matches (N)", "4", "3"], ["GF/game", "3.00 overall", "1.71 overall"], ["GA/game", "not supplied", "1.86 overall"], ["xG/game", "above 2.00 overall", "1.71 overall"], ["BTTS", "not supplied", "86% overall"], ["Over 3.5 goals", "not supplied", "57% overall"]]
  },
  {
    ...common, slug: "fc-utrecht-vs-willem-ii", home: "FC Utrecht", away: "Willem II", date: "2026-10-11", time: "12:15", venue: "Stadion Galgenwaard", location: "Utrecht, Netherlands", pick: "FC Utrecht to win", odds: 1.48, access: "vip", trend: "Opposing Willem II's winless start", teaser: "Utrecht's own form is fragile, but Willem II arrive winless with the league's weaker attacking and defensive profile.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Utrecht's own form offers little encouragement: just 1-2-4 overall, scoring 1.57 and conceding 3.43 per match, with a **0-1-2 home line that has shipped 13 goals against only five scored**. None of that should be mistaken for a claim that the hosts have been playing well.",
      "The case instead rests on Willem II being even weaker. At 0-2-5 with just 0.86 goals scored against 2.86 conceded per match, and roughly 1.20 xG against 2.33 xGA, the visitors carry a wide negative chance-quality gap. With no clean sheets and no wins to their name, Utrecht still look better placed to turn home advantage into three points."
    ],
    tactical: "Utrecht need to protect the space behind midfield and avoid turning the match into the same end-to-end pattern behind their poor concession rate. Willem II can threaten if the hosts overcommit, but a compact Utrecht structure followed by quicker attacks into the visitor's exposed back line is the clearest home route.",
    risk: "Utrecht's **6.00 total-goal home average** and winless home split make a short moneyline uncomfortable. Their defence can keep Willem II in the contest, and the selection requires a host that has not yet shown reliable game control at Galgenwaard.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "0-1-2", "not supplied"], ["GF/game", "1.67", "not supplied"], ["GA/game", "4.33", "not supplied"], ["Total goals/game", "6.00", "not supplied"], ["xGA/game", "2.09 overall", "2.33 overall"]]
  }
];

export const eredivisieRound2026_10_10 = inputs.map((input) => ({
  ...createWave28Prediction(input),
  updatedAt: "2026-10-08T15:00:00.000Z",
}));
