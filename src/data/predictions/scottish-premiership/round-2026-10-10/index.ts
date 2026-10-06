import { createWave28Prediction, type Wave28Input } from "../../editorial-tools/wave-28/factory";

const fixtureSource = { name: "SPFL — official October 2026 Premiership fixtures", url: "https://spfl.co.uk/match-day" };
const statsSource = { name: "SoccerSTATS — 2026/27 Scottish Premiership home and away tables", url: "https://www.soccerstats.com/homeaway.asp?league=scotland" };
const common = { league: "scottish-premiership" as const, competition: "Scottish Premiership", round: "Regular season", fixtureSource, statsSource };

const inputs: Wave28Input[] = [
  {
    ...common, slug: "dundee-united-vs-hibernian", home: "Dundee United", away: "Hibernian", date: "2026-10-10", time: "15:00", venue: "CalForth Construction Arena at Tannadice Park", location: "Dundee, Scotland", pick: "Hibernian X2", odds: 1.42, access: "free", trend: "Hibernian's stronger away production", teaser: "Dundee United remain winless at home, while Hibernian have taken two wins and a draw from their first three trips.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Dundee United have not converted home advantage into a win: **0-2-1 at Tannadice**, with two goals scored and four conceded. Their 0.67 home points per game and limited attack are the first reasons not to force a home result.",
      "Hibernian's away return is **2-1-0 with 2.00 points per game**, five goals scored and four conceded. The defensive side remains imperfect, so draw protection is important, but their road production is materially stronger than Dundee United's home output."
    ],
    tactical: "Dundee United need to compress the centre and turn the match into a contest for second balls, because a stretched game would give Hibernian more room to use their superior away scoring. Hibs can strengthen X2 by controlling the first pass after regains and avoiding unnecessary exposure when their full-backs advance.",
    risk: "Hibernian have conceded in every match in the cited away sample, and **100% BTTS away** shows that they rarely control games cleanly. The visitors can still lose if Dundee United exploit set pieces or transition moments despite the stronger road record.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "0-2-1", "2-1-0"], ["Points/game", "0.67", "2.00"], ["GF/game", "0.67", "1.67"], ["GA/game", "1.33", "1.33"], ["BTTS", "not supplied", "100%"]]
  },
  {
    ...common, slug: "falkirk-vs-dundee-fc", home: "Falkirk", away: "Dundee FC", date: "2026-10-10", time: "15:00", venue: "Falkirk Stadium", location: "Falkirk, Scotland", pick: "Over 2.5 goals", odds: 1.69, access: "free", trend: "Falkirk defensive exposure meets Dundee scoring", teaser: "Falkirk's defensive process and Dundee's consistent scoring create the route to goals in a league with a lower overall baseline.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Falkirk's six-goal overall return is modest, but their underlying balance is weaker: roughly 0.92 xG created against **1.70 xGA allowed**. At home they are 1-0-2 with three scored and five conceded, so opponents have found the better chances often enough to keep the total live.",
      "Dundee carry a 9-7 overall goal profile and have scored in six of seven league games. Their ability to contribute is important because the Scottish Premiership averages only 2.55 goals per match and around 52% Over 2.5, making this a matchup-specific case rather than a league-wide shortcut."
    ],
    tactical: "Falkirk can make the game open by pressing higher and leaving space behind midfield, while Dundee should have opportunities to attack that first line directly. If either side scores early, the other's defensive record encourages a more aggressive response rather than comfortable game management.",
    risk: "The league baseline and Falkirk's modest scoring remain the principal concern. A compact Dundee away shape or a goalless opening hour could leave three goals out of reach even if the underlying defensive imbalance persists.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-0-2", "not supplied"], ["GF/game", "1.00", "not supplied"], ["GA/game", "1.67", "not supplied"], ["xG/game", "0.92 overall", "not supplied"], ["xGA/game", "1.70 overall", "not supplied"]]
  },
  {
    ...common, slug: "aberdeen-vs-st-johnstone", home: "Aberdeen", away: "St Johnstone", date: "2026-10-11", time: "14:00", venue: "Pittodrie Stadium", location: "Aberdeen, Scotland", pick: "Over 2.5 goals", odds: 1.88, access: "free", trend: "A fragile Over facing a low-event home split", teaser: "St Johnstone's scoring profile keeps the total in play, although Aberdeen's early home matches have been notably controlled.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Aberdeen's home split pulls strongly against an easy goals argument: **two scored and two conceded in three matches**, a 1.33 total-goal average. Their overall 7-8 balance and roughly 29% BTTS rate reinforce the lower-event side of the evidence.",
      "St Johnstone bring a 9-10 overall goal profile and about 71% BTTS, which creates the route to a different game. Their away return is 0-1-2 with two scored and four conceded, so an away goal would change the total quickly, but the venue evidence does not make three goals high confidence."
    ],
    tactical: "Aberdeen are likely to prefer controlled territory and pressure from wide areas rather than an end-to-end match. St Johnstone need to break that rhythm through direct attacks and second balls; an early visitor goal would force Aberdeen to increase tempo and make the Over substantially healthier.",
    risk: "This is the Scottish group's clearest conflict: Aberdeen's **0.67 home GF/game and 0.67 home GA/game** point toward another restrained scoreline. The 1.88 price recognises that fragility, but the selection still needs the match to depart from the host's established venue pattern.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-1-1", "0-1-2"], ["GF/game", "0.67", "0.67"], ["GA/game", "0.67", "1.33"], ["Total goals/game", "1.33", "2.00"], ["BTTS", "29% overall", "71% overall"]]
  },
  {
    ...common, slug: "hearts-vs-st-mirren", home: "Hearts", away: "St Mirren", date: "2026-10-10", time: "15:00", venue: "Tynecastle Park", location: "Edinburgh, Scotland", pick: "Over 2.5 goals", odds: 1.47, access: "vip", bestAnalysis: true, trend: "Hearts' perfect and productive home start", teaser: "Hearts have won all three home matches with an 8-2 goal balance, creating the strongest scoring foundation in this Scottish group.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Hearts have scored 14 times in seven league matches and are a perfect **3-0-0 at Tynecastle**. Their eight home goals and two conceded produce 2.67 GF, 0.67 GA and a 3.33 total-goal average.",
      "The attacking process is also healthy at roughly 1.49 xG per match, while St Mirren allow around 1.63 xGA overall. Hearts' broader BTTS rate is close to 86%, so their games have often stayed active even when the home side controls territory."
    ],
    tactical: "Hearts can sustain pressure by winning second balls and forcing St Mirren to defend repeated wide deliveries and set pieces. St Mirren's tighter away approach is the likely brake, but if Hearts score first the visitors must leave their compact shape and expose more space between the lines.",
    risk: "St Mirren's away profile is more controlled than Hearts' overall BTTS figure suggests. A deep block and slow first half could reduce shot quality, while the **1.47 price** leaves little room for a two-goal match.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "3-0-0", "not supplied"], ["Points/game", "3.00", "not supplied"], ["GF/game", "2.67", "not supplied"], ["GA/game", "0.67", "not supplied"], ["Total goals/game", "3.33", "not supplied"]]
  },
  {
    ...common, slug: "rangers-vs-kilmarnock", home: "Rangers", away: "Kilmarnock", date: "2026-10-10", time: "15:00", venue: "Ibrox Stadium", location: "Glasgow, Scotland", pick: "Rangers handicap -2", odds: 1.69, access: "vip", bestAnalysis: true, trend: "Large handicap against the weakest defence", teaser: "Kilmarnock have conceded 15 in seven matches, but Rangers' modest home scoring makes the required winning margin a demanding call.", homeMatches: 3, awayMatches: 4,
    analysis: [
      "Kilmarnock have the league sample's weakest defensive return, conceding **15 goals in seven matches** with a -9 goal difference. Rangers allow only four overall and produce around 1.83 xG against approximately 0.97 xGA, creating a clear chance-quality advantage.",
      "The handicap is much more demanding than a moneyline because Rangers are **2-0-1 at home with only three goals scored**. Their 1.00 home scoring average means the pick is a direct bet against Kilmarnock's defensive resistance, not evidence that Rangers routinely create large home margins."
    ],
    tactical: "Rangers need sustained pressure, fast circulation around the box and continued attacking intent after the first goal. Kilmarnock can protect the handicap by keeping the centre crowded and forcing lower-value deliveries from wide areas; every scoreless phase makes the two-goal margin harder to clear.",
    risk: "Rangers' **1.00 home GF/game** is the material conflict. A narrow win is entirely plausible and would not cover -2, while a push or settlement treatment at exactly two goals depends on the market's handicap convention; the stored selection is preserved exactly as supplied.",
    rows: [["Matches (N)", "3", "4"], ["W-D-L", "2-0-1", "not supplied"], ["GF/game", "1.00", "not supplied"], ["GA/game", "0.67", "not supplied"], ["xG/game", "1.83 overall", "not supplied"], ["xGA/game", "0.97 overall", "not supplied"]]
  },
  {
    ...common, slug: "motherwell-vs-celtic", home: "Motherwell", away: "Celtic", date: "2026-10-11", time: "12:00", venue: "Fir Park", location: "Motherwell, Scotland", pick: "Celtic to win", odds: 1.57, access: "vip", bestAnalysis: true, trend: "Celtic's perfect away start", teaser: "Celtic arrive with the league's strongest overall profile and three wins from three away matches, while Motherwell carry a negative goal difference.", homeMatches: 3, awayMatches: 3,
    analysis: [
      "Celtic have taken 18 points from seven league matches with a +10 goal difference and 14 goals scored. Their underlying attack is around **2.77 xG per match**, while approximately 1.02 xGA gives them the strongest two-way profile in this group.",
      "The away split removes a common concern: Celtic are **3-0-0 on the road**, with eight goals scored and two conceded. Motherwell are 1-1-1 at home with three scored and four allowed, and their negative overall goal difference leaves the visitor with the clearer route to control."
    ],
    tactical: "Celtic can use sustained possession and counter-pressure to keep Motherwell defending near their own box, then attack through width and quick combinations. Motherwell's best chance is to survive the first wave and use direct transitions or set pieces before Celtic recover their shape.",
    risk: "A short away price always carries the danger of territorial dominance without conversion. Motherwell can make the match physical and compact at Fir Park, and a level score deep into the second half would increase the influence of isolated moments rather than Celtic's broader statistical edge.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-1-1", "3-0-0"], ["Points/game", "1.33", "3.00"], ["GF/game", "1.00", "2.67"], ["GA/game", "1.33", "0.67"], ["xG/game", "not supplied", "2.77 overall"]]
  }
];

export const scottishPremiershipRound2026_10_10 = inputs.map(createWave28Prediction);
