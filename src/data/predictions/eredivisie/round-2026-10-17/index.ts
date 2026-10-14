import type { EditorialPrediction } from "@/types";
import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";
import { espnVenueSplitCore } from "../../editorial-tools/psp-import-33/espn-venue-splits";

// Source: PSP 33-analyses football publication package (Brazilian Série A, Eliteserien, Eredivisie and
// Süper Lig, 17-19 October 2026, revised 14 October 2026). Predictions, odds and FREE/BEST BET/PRIME VIP
// labels are taken from the package unchanged. Fixture identity, home/away order, kick-off times and venues
// were checked against ESPN's schedule on 14 October 2026 (kick-off shown in local stadium time); league
// tables were checked against ESPN's standings and Wikipedia. Team news and projected lineups come from the
// package; the few factual corrections made after the check are limited to results and table positions.
const base = {
  league: "eredivisie" as const,
  competition: "Dutch Eredivisie",
  round: "Matchweek 9",
  publishedAt: "2026-10-14T09:00:00.000-03:00",
  updatedAt: "2026-10-14T09:00:00.000-03:00",
  oddsSource: "Editor-supplied PSP 33-analyses publication package (14 October 2026)",
};

const m_ado_den_haag_vs_psv_eindhoven = createPspImport26Prediction({
  ...base,
  slug: "ado-den-haag-vs-psv-eindhoven",
  home: "ADO Den Haag",
  away: "PSV Eindhoven",
  date: "2026-10-17",
  time: "16:30",
  venue: "ADO Den Haag Stadium",
  venueAddress: { addressLocality: "The Hague", addressCountry: "Netherlands" },
  pick: "PSV -1.5",
  odds: 1.64,
  access: "vip",
  teaser: "PSV travel to winless ADO after a European defeat at RB Leipzig, with several key players on the injury list. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "PSV's away scoring against winless ADO",
  matchAnalysis: [
    "PSV enter Round 9 second with 19 points and 26 goals, while ADO are 17th with three points and have conceded 19. That gap in both scoring power and table position is the core case for a two-goal away win. PSV should dominate territory and create repeated box entries against a side still looking for its first league victory. PSV are **2nd: 19 points**, 26 scored, 10 conceded. ADO are 17th: three points, nine scored, 19 conceded. PSV's short turnaround from European action is the main contextual change since the original analysis."
  ],
  tactical: "The handicap is harder than the moneyline, especially after PSV's 1-0 European defeat at RB Leipzig on Tuesday. Recovery and rotation matter, and ADO only need to keep the margin to one to beat the selection. Even so, PSV's 3.25 goals-per-game league rate gives them the attacking ceiling required for a 0-2, 1-3 or wider win.",
  risk: "European fatigue and the injury list create the possibility of a controlled one-goal PSV win, which would not cover -1.5.",
  market: "At **1.64** the raw implied probability is **60.98%** (1 / 1.64). PSV have won three of four away games and scored **13 goals** on the road, and ADO have taken one point from three home games while conceding eight. PSV's European defeat at Leipzig and their injury list make a two-goal margin harder than a plain win, and ADO's home sample is only three games, so the evidence is strong in direction and thin in size. The value is real, but it depends on the margin.",
  conclusion: "PSV's scoring and ADO's defensive record make a wide away win realistic, with fatigue and rotation the main reasons it might stop at one goal. PSV -1.5 at 1.64 remains the call.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. ADO list Cameron Peupion with a knee problem. PSV's availability is more affected: Adamo Nagalo is a long-term absentee, with Sam Lammers, Kilian Sildillia, Alassane Pléa, Sami Ouaissa and Jerdy Schouten also on the current injury/doubt list.\n\n**PROJECTED setup:** PSV are expected to stay in a 4-3-3 but may rotate one or two positions after Leipzig. The front three should still be built to attack the box early, while the midfield selection depends on Schouten's availability. ADO are likely to defend in a compact block and use counterattacks rather than match PSV's possession.",
  core: espnVenueSplitCore("eredivisie", "ADO Den Haag", "PSV Eindhoven"),
  sources: [
    {
      "name": "Voetbal International — current Eredivisie table",
      "url": "https://www.vi.nl/competities/eredivisie/stand"
    },
    {
      "name": "KNVB — fixtures",
      "url": "https://www.knvb.nl/competities/eredivisie/programma"
    },
    {
      "name": "FotMob — squad and availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/ned.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/ned.1"
    }
  ],
});

const m_telstar_vs_feyenoord = createPspImport26Prediction({
  ...base,
  slug: "telstar-vs-feyenoord",
  home: "Telstar",
  away: "Feyenoord",
  date: "2026-10-17",
  time: "20:00",
  venue: "BUKO Stadion",
  venueAddress: { addressLocality: "Velsen-Zuid", addressCountry: "Netherlands" },
  pick: "Over 2.5 Goals + Over 8.5 Corners",
  odds: 1.7,
  access: "vip",
  teaser: "Unbeaten Feyenoord lead the league on 20 points and visit a Telstar side that has scored just seven goals. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Feyenoord's away attack against Telstar's high-scoring home games",
  matchAnalysis: [
    "Feyenoord are unbeaten after eight league matches, top on 20 points with 27 goals scored and only seven conceded. Telstar are 15th with six points and just seven goals. That difference makes Feyenoord the team most likely to supply the goals, while the corners leg is supported by sustained away pressure and the volume of defending Telstar may be forced to do. Feyenoord: **1st, 20 points**, 27-7 goal difference. Telstar: 15th, six points, 7-14. The league leaders have the strongest statistical platform in this matchup."
  ],
  tactical: "The combined line is still more demanding than a simple goals bet. If Feyenoord score early and become efficient rather than relentless, the corner count can stall. Telstar's best contribution is to attack directly enough to win a few corners of their own rather than spend 90 minutes defending the box.",
  risk: "The corner requirement is more volatile than Over 2.5. A clinical Feyenoord performance can produce three goals without nine corners.",
  market: "At **1.70** the raw implied probability is **58.82%** (1 / 1.70). All four of Telstar's home games have gone over 2.5 goals, and Feyenoord have scored **16 goals in four away wins**, so the goals leg has strong support from a small sample. Corner counts were not available from the sources used, so the second leg rests on Feyenoord's width and territory and cannot be priced from data; it is the weaker half of the combination. The value therefore sits mostly in the goals leg.",
  conclusion: "Feyenoord's scoring makes three goals likely, and their pressure on the flanks should create corners, though a clinical early lead could stall that count. Over 2.5 Goals + Over 8.5 Corners at 1.70 stays as the position.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Feyenoord have been monitoring Gijs Smal, Jordan Bos, Jakub Moder and Bart Nieuwkoop. Anis Hadj Moussa has returned to the selection picture, while Tsuyoshi Watanabe has also been managed through a fitness doubt. Telstar are expected to prioritise defensive coverage and keep extra numbers behind the ball.\n\n**PROJECTED setup:** Feyenoord should keep their aggressive 4-3-3/4-2-3-1 structure, with the full-backs and wingers responsible for creating the width that can drive the corner count. Telstar are likely to defend deeper and break through the channels rather than press man-for-man for long periods.",
  core: espnVenueSplitCore("eredivisie", "Telstar", "Feyenoord"),
  sources: [
    {
      "name": "Voetbal International — Eredivisie table",
      "url": "https://www.vi.nl/competities/eredivisie/stand"
    },
    {
      "name": "KNVB — fixtures",
      "url": "https://www.knvb.nl/competities/eredivisie/programma"
    },
    {
      "name": "FotMob — current team availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/ned.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/ned.1"
    }
  ],
});

const m_sparta_rotterdam_vs_willem_ii = createPspImport26Prediction({
  ...base,
  slug: "sparta-rotterdam-vs-willem-ii",
  home: "Sparta Rotterdam",
  away: "Willem II",
  date: "2026-10-17",
  time: "21:00",
  venue: "Sparta Stadion Het Kasteel",
  venueAddress: { addressLocality: "Rotterdam", addressCountry: "Netherlands" },
  pick: "Sparta Rotterdam Win",
  odds: 1.59,
  access: "free",
  analysisAccess: "free",
  teaser: "Sparta are 14th and Willem II are bottom without a league win, in a meeting between two struggling teams. The prediction and full analysis are FREE for everyone.",
  trend: "Sparta at home against winless, bottom-placed Willem II",
  matchAnalysis: [
    "This FREE pick backs Sparta in a meeting between two struggling teams rather than a top-side mismatch. Sparta are 14th with six points; Willem II are bottom with two, have not won in eight and have conceded 23. The hosts' recent 3-3 draw with Go Ahead showed both the attacking potential and the defensive fragility that make a straight win less comfortable than the price might suggest. Sparta are **14th (6 points**, 13-20); Willem II are 18th (2 points, 7-23). The visitors remain winless and have the league's weakest points return."
  ],
  tactical: "Willem II's injury list weakens an already unstable back line, while Sparta can at least rely on a more settled home structure. The key is whether the hosts can turn possession into enough chances without giving the visitors easy transitions. A narrow 1-0 or 2-1 is a more realistic path than expecting a dominant performance.",
  risk: "Sparta have only one league win themselves. If their back line repeats the openness seen in the 3-3 draw, Willem II can turn a favorable matchup into another dropped-points game.",
  market: "At **1.59** the raw implied probability is **62.89%** (1 / 1.59). Neither team has a convincing split: Sparta have won none of their four home games and conceded 10, while Willem II have lost three of four away games and conceded 13. The price is justified by Willem II's weakness more than by Sparta's strength, and Sparta's openness at the back is the main reason the value is limited.",
  conclusion: "Willem II are the weaker team in nearly every measure, and Sparta's settled home structure gives them the edge. A narrow 1-0 or 2-1 is the realistic path, so Sparta Rotterdam Win at 1.59 remains the call.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Sparta are without or monitoring Mitchell van Bergen and Shunsuke Mito. Willem II's list is heavier, with Justin Hoogma, Armin Culum, Thomas Didillon-Hödl and Amine Lachkar among the current injury concerns.\n\n**PROJECTED setup:** Sparta's latest XI used Brouwer; Young, Verschuren, Martins Indi, Martes, Kuipers; Van Cruijsen, Toornstra, Hatenboer, Babadi; Zonneveld. That five-defender base gives them continuity. Willem II are more likely to alter personnel because of the absences in defence and goal.",
  core: espnVenueSplitCore("eredivisie", "Sparta Rotterdam", "Willem II"),
  sources: [
    {
      "name": "Voetbal International — current table",
      "url": "https://www.vi.nl/competities/eredivisie/stand"
    },
    {
      "name": "KNVB — schedule",
      "url": "https://www.knvb.nl/competities/eredivisie/programma"
    },
    {
      "name": "FotMob — pre-match availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/ned.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/ned.1"
    }
  ],
});

const m_pec_zwolle_vs_go_ahead_eagles = createPspImport26Prediction({
  ...base,
  slug: "pec-zwolle-vs-go-ahead-eagles",
  home: "PEC Zwolle",
  away: "Go Ahead Eagles",
  date: "2026-10-18",
  time: "12:15",
  venue: "MAC³PARK Stadion",
  venueAddress: { addressLocality: "Zwolle", addressCountry: "Netherlands" },
  pick: "Over 2.5 Goals",
  odds: 1.42,
  access: "vip",
  teaser: "PEC have conceded 21 goals in eight matches, and Go Ahead have been involved in some of the league's most open games. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Zwolle's leaky defence meets Go Ahead's open games",
  matchAnalysis: [
    "PEC have conceded 21 goals in eight matches and sit 16th with only four points. Go Ahead are eighth, have scored 19 and conceded 17, a profile that regularly produces open games. Over 2.5 therefore does not require an extreme assumption: PEC's defensive record and Go Ahead's willingness to attack provide multiple routes to three goals. PEC: 16th, four points, 6-21. Go Ahead: **8th, 11 points**, 19-17. The combined 38 goals conceded/scored around the two sides make the total more compelling than the result market."
  ],
  tactical: "The visitors' recent run contains several draws, so this is not a bet on Go Ahead dominance. PEC can contribute at home, particularly from transitions if Go Ahead commit numbers forward. The line becomes most vulnerable if PEC's injury-hit midfield struggles to progress the ball and the visitors settle for control rather than pace.",
  risk: "A weakened PEC midfield can also reduce their own attacking contribution, leaving the total dependent on Go Ahead scoring three by themselves.",
  market: "At **1.42** the raw implied probability is **70.42%** (1 / 1.42), so the over has to land in about seven games out of ten. PEC have conceded 13 goals in four home games, every one of Go Ahead's four away games has seen both teams score, and three of them passed 2.5 goals. The risk is PEC's single home goal in four games: if they cannot score, Go Ahead must reach three on their own. The value at this short price is modest.",
  conclusion: "Both defences give chances and Go Ahead are not a side that settles for control. If PEC's midfield can still progress the ball, Over 2.5 Goals at 1.42 stays as the position.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. PEC list Younes Namli with a knee issue and Filip Krastev with an Achilles problem. Go Ahead have Pim Saathof unavailable and Gerrit Nauber has also been managing a leg problem.\n\n**PROJECTED setup:** PEC may need a more direct midfield if Namli and Krastev are not ready, while Go Ahead can keep their usual attacking width. That tactical contrast favors transitions rather than a slow possession game.",
  core: espnVenueSplitCore("eredivisie", "PEC Zwolle", "Go Ahead Eagles"),
  sources: [
    {
      "name": "Voetbal International — Eredivisie table",
      "url": "https://www.vi.nl/competities/eredivisie/stand"
    },
    {
      "name": "KNVB — fixtures",
      "url": "https://www.knvb.nl/competities/eredivisie/programma"
    },
    {
      "name": "FotMob — current availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/ned.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/ned.1"
    }
  ],
});

const m_sc_cambuur_vs_az_alkmaar = createPspImport26Prediction({
  ...base,
  slug: "sc-cambuur-vs-az-alkmaar",
  home: "SC Cambuur",
  away: "AZ Alkmaar",
  date: "2026-10-18",
  time: "14:30",
  venue: "Kooi Stadium",
  venueAddress: { addressLocality: "Leeuwarden", addressCountry: "Netherlands" },
  pick: "AZ Alkmaar Win",
  odds: 1.44,
  access: "vip",
  bestAnalysis: true,
  teaser: "Third-placed AZ have conceded only eight goals in eight matches and visit a Cambuur side in 12th with a 11-19 goal record. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "AZ's defensive record against Cambuur's home struggles",
  matchAnalysis: [
    "AZ are third on 19 points and have conceded only eight in eight matches; Cambuur are 12th on eight points with a 11-19 goal record. The away win is built on that balance: AZ do not need a shootout because they have been both more productive and much harder to break down. AZ are **3rd (19 points**, 18-8); Cambuur 12th (8 points, 11-19). Only Feyenoord and PSV sit above AZ entering the round."
  ],
  tactical: "Cambuur's home energy can make the first hour competitive, but their defensive record leaves little room for repeated errors. AZ's main task is to avoid turning possession into a low-tempo game and to force Cambuur to defend facing their own goal. The 1.44 price is short, yet the table and goal difference clearly favor the visitors.",
  risk: "The short price offers little protection against a wasteful AZ performance. A 0-0 deep into the second half would make the favorite increasingly uncomfortable.",
  market: "At **1.44** the raw implied probability is **69.44%** (1 / 1.44). AZ have won three of four away games and conceded only five goals on the road, while Cambuur have lost three of four at home and let in 13, so frequency and price line up. With little margin for a short price, a goalless AZ stretch is the risk to weigh.",
  conclusion: "AZ are both more productive and harder to break down than Cambuur, and the home side's defensive record leaves little room for repeated errors. A wasteful AZ performance is the main concern, so AZ Alkmaar Win at 1.44 remains the position.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Cambuur are monitoring Wout Asselman and Daan Visser. AZ have Denso Kasius dealing with a groin problem and Stije Resink sidelined by a knee injury, so the visitors have fewer options in the defensive/midfield rotation.\n\n**PROJECTED setup:** AZ should preserve their possession-based structure with the strongest available central midfield and a mobile front line. Cambuur are likely to protect the central lane first and try to exploit the spaces left when AZ's full-backs advance.",
  core: espnVenueSplitCore("eredivisie", "SC Cambuur", "AZ Alkmaar"),
  sources: [
    {
      "name": "Voetbal International — current table",
      "url": "https://www.vi.nl/competities/eredivisie/stand"
    },
    {
      "name": "KNVB — fixtures",
      "url": "https://www.knvb.nl/competities/eredivisie/programma"
    },
    {
      "name": "FotMob — squad availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/ned.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/ned.1"
    }
  ],
});

const m_fc_groningen_vs_ajax = createPspImport26Prediction({
  ...base,
  slug: "fc-groningen-vs-ajax",
  home: "FC Groningen",
  away: "Ajax",
  date: "2026-10-18",
  time: "16:45",
  venue: "Euroborg",
  venueAddress: { addressLocality: "Groningen", addressCountry: "Netherlands" },
  pick: "Over 3.5 Goals",
  odds: 1.89,
  access: "vip",
  teaser: "Groningen and Ajax are separated by a single point and have scored 42 goals between them in eight league games. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Two attacking sides, one point apart, with depleted squads",
  matchAnalysis: [
    "Groningen and Ajax have combined for 42 goals scored through eight league games: 20 for the hosts and 22 for Ajax. They are also separated by only one point in the table, which makes this a much more competitive fixture than the club names might suggest. Over 3.5 is aggressive, but both teams have enough attacking output to make a 2-2 or 1-3 scenario credible. Ajax are **5th on 15 points** with a 22-10 goal record; Groningen are 6th on 14 with 20-14. Both sit in the upper half and both average well above two total goals in their matches."
  ],
  tactical: "Ajax's injury list is the main counterargument because several creative and attacking options are unavailable. Groningen also have multiple absences, especially in defence and midfield, so the game can lose structure as the squads are adjusted. For four goals, the match benefits from an early breakthrough rather than a cautious first half.",
  risk: "Four goals is a high bar. Ajax's missing attackers could turn an otherwise open matchup into a 1-2 or 1-1 rather than the required four-goal game.",
  market: "At **1.89** the raw implied probability is **52.91%** (1 / 1.89). Over 3.5 has landed in two of Groningen's four home games and two of Ajax's three away games, and the 20 goals scored by Groningen and 22 by Ajax give the line a base. But Ajax have conceded only one goal in three away games and are missing Dolberg, Adingra and Blind, so four goals is a stretch; the value is fair for a coin-flip line, not generous.",
  conclusion: "Both teams attack freely enough for a 2-2 or 1-3, and injuries on both sides could loosen the structure. An early breakthrough would help, so Over 3.5 Goals at 1.89 stays as the call.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Groningen list Wouter Prins, Nikolas Brandis, Elvis van der Laan, Travis Hernes, Tyrique Mercera, Ryan Metu and Malcolm Jeng among the current absences. Ajax have Kasper Dolberg, Aaron Bouwman, Simon Adingra and Daley Blind unavailable, with the recent XI already adjusted around those losses.\n\n**PROJECTED setup:** Ajax are expected to keep a front-foot setup but may again use alternative wide/central options such as Tsygankov and Tolu around the attack. Groningen's projected XI will need defensive changes because of the injury volume, which can create unfamiliar partnerships.",
  core: espnVenueSplitCore("eredivisie", "FC Groningen", "Ajax"),
  sources: [
    {
      "name": "Voetbal International — Eredivisie table",
      "url": "https://www.vi.nl/competities/eredivisie/stand"
    },
    {
      "name": "KNVB — schedule",
      "url": "https://www.knvb.nl/competities/eredivisie/programma"
    },
    {
      "name": "FotMob — availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/ned.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/ned.1"
    }
  ],
});

const m_nec_nijmegen_vs_fortuna_sittard = createPspImport26Prediction({
  ...base,
  slug: "nec-nijmegen-vs-fortuna-sittard",
  home: "NEC Nijmegen",
  away: "Fortuna Sittard",
  date: "2026-10-18",
  time: "20:00",
  venue: "Goffertstadion",
  venueAddress: { addressLocality: "Nijmegen", addressCountry: "Netherlands" },
  pick: "NEC Nijmegen Win",
  odds: 1.56,
  access: "vip",
  teaser: "NEC are 11th on nine points, while seventh-placed Fortuna Sittard have the stronger start but a leaky defence. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "NEC's home push against a Fortuna side with the stronger start",
  matchAnalysis: [
    "NEC are below Fortuna in the table, so this home-win selection is not based on league position alone. Fortuna are seventh on 14 points; NEC are 11th on nine. The argument is that NEC can raise their attacking level at home and that Fortuna's 15 goals conceded leave enough space for a side that has scored 13 despite an uneven start. Fortuna: **7th, 14 points**, 14-15. NEC: 11th, nine points, 13-14. The visitors have the stronger start, which makes this a genuine home-value play rather than a statistical mismatch."
  ],
  tactical: "The matchup is more balanced than a 1.56 quote might imply, and NEC need to be cleaner in both boxes than they were in the recent draw with Ajax. Fortuna are comfortable in transition and can punish a high defensive line. Home initiative is the edge, but it must translate into an early territorial advantage.",
  risk: "Fortuna's stronger points return is the warning. If NEC overcommit in search of the first goal, the visitors have the profile to turn the selection against them.",
  market: "At **1.56** the raw implied probability is **64.10%** (1 / 1.56), but the records point the other way: NEC have won none of their four home games (two draws, two defeats), and Fortuna have taken 10 points from four away games. The pick therefore relies on NEC lifting their home level against a visiting defence that has conceded 15, and the price looks short for that case. The value is limited and the risk is real.",
  conclusion: "NEC need to be cleaner in both boxes than they were against Ajax, and Fortuna are dangerous in transition if the hosts overcommit. It is the least comfortable favourite of the Eredivisie picks, and NEC Nijmegen Win at 1.56 remains the position on home initiative alone.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. NEC have Emre Mor, Deveron Fonville and Ahmetcan Kaplan on the current injury list. Fortuna are monitoring Siebe Wylin, Sven Simons and Iván Márquez, reducing options in defence and midfield.\n\n**PROJECTED setup:** NEC are likely to keep an attacking home shape and use the wing-backs/full-backs aggressively; Tobias Storm has recently been used in a wider defensive role. Fortuna can retain a compact midfield and look for fast transitions behind those advanced positions.",
  core: espnVenueSplitCore("eredivisie", "NEC Nijmegen", "Fortuna Sittard"),
  sources: [
    {
      "name": "Voetbal International — current table",
      "url": "https://www.vi.nl/competities/eredivisie/stand"
    },
    {
      "name": "KNVB — fixtures",
      "url": "https://www.knvb.nl/competities/eredivisie/programma"
    },
    {
      "name": "FotMob — current availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/ned.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/ned.1"
    }
  ],
});

const m_fc_twente_vs_fc_utrecht = createPspImport26Prediction({
  ...base,
  slug: "fc-twente-vs-fc-utrecht",
  home: "FC Twente",
  away: "FC Utrecht",
  date: "2026-10-18",
  time: "20:00",
  venue: "De Grolsch Veste",
  venueAddress: { addressLocality: "Enschede", addressCountry: "Netherlands" },
  pick: "Over 3.5 Goals",
  odds: 1.81,
  access: "vip",
  teaser: "Twente play in the Conference League on Thursday before hosting Utrecht, who have conceded more goals than any other Eredivisie side. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Utrecht's open defence against Twente between European fixtures",
  matchAnalysis: [
    "Twente are fourth with 17 points and have conceded only eight goals; Utrecht are 13th with eight points and have allowed 25. That defensive mismatch gives Twente the ability to drive the scoreline, but Over 3.5 still needs a very open game because the hosts themselves are usually controlled without the ball. Twente: **4th, 17 points**, 16-8. Utrecht: 13th, eight points, 14-25. Utrecht's 25 conceded are the most conceded in the league entering Round 9."
  ],
  tactical: "The schedule helps the total in one sense: Twente play Conference League football against Thun on Thursday, leaving a short recovery window before Sunday. Rotation or tired legs can reduce defensive intensity. Utrecht's own injury list is significant, however, so their ability to contribute a goal is not guaranteed. A 3-1 home win is the clearest route.",
  risk: "Twente's own defensive record is strong. If Utrecht cannot score, the hosts probably need four themselves, which is a much tougher requirement.",
  market: "At **1.81** the raw implied probability is **55.25%** (1 / 1.81). Over 3.5 has landed in two of Twente's four home games and two of Utrecht's four away games, and Utrecht's 11 goals conceded on the road (**2.75 per game**) make the line reachable. Twente's own home defence is the problem for the bet, with only three goals conceded in four home games, so the hosts probably need to supply most of the goals. The value is moderate.",
  conclusion: "Utrecht's defensive record gives Twente the route, and a rotated side after Thursday could loosen the structure. A 3-1 home win is the clearest path, so Over 3.5 Goals at 1.81 remains the call.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Twente are monitoring Kristian Hlynsson and Stav Lemkin, with other recent availability issues affecting Unnerstall and attacking depth. Utrecht list Alonzo Engwanda, Oualid Agougil, Noah Ohio, Miliano Jonathans and Victor Jensen among the current absences.\n\n**PROJECTED setup:** Twente may rotate after Thursday's European fixture but should keep their usual proactive midfield and wide attacks. Utrecht's projected XI will need changes in both midfield and attack because of the absences, increasing the chance of a less settled defensive block.",
  core: espnVenueSplitCore("eredivisie", "FC Twente", "FC Utrecht"),
  sources: [
    {
      "name": "Voetbal International — Eredivisie table",
      "url": "https://www.vi.nl/competities/eredivisie/stand"
    },
    {
      "name": "KNVB — fixtures",
      "url": "https://www.knvb.nl/competities/eredivisie/programma"
    },
    {
      "name": "FotMob — current availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/ned.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/ned.1"
    }
  ],
});

export const eredivisieRound2026_10_17: EditorialPrediction[] = [
  m_ado_den_haag_vs_psv_eindhoven,
  m_telstar_vs_feyenoord,
  m_sparta_rotterdam_vs_willem_ii,
  m_pec_zwolle_vs_go_ahead_eagles,
  m_sc_cambuur_vs_az_alkmaar,
  m_fc_groningen_vs_ajax,
  m_nec_nijmegen_vs_fortuna_sittard,
  m_fc_twente_vs_fc_utrecht,
];
