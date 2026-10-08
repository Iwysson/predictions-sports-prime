import { createWave28Prediction, type Wave28Input } from "../../editorial-tools/wave-28/factory";

const fixtureSource = { name: "SPFL — official October 2026 Premiership fixtures", url: "https://spfl.co.uk/match-day" };
const statsSource = { name: "SoccerSTATS — 2026/27 Scottish Premiership home and away tables", url: "https://www.soccerstats.com/homeaway.asp?league=scotland" };
const common = { league: "scottish-premiership" as const, competition: "Scottish Premiership", round: "Regular season", fixtureSource, statsSource };

const inputs: Wave28Input[] = [
  {
    ...common, slug: "dundee-united-vs-hibernian", home: "Dundee United", away: "Hibernian", date: "2026-10-10", time: "15:00", venue: "CalForth Construction Arena at Tannadice Park", location: "Dundee, Scotland", pick: "Hibernian X2", odds: 1.42, access: "free", trend: "Hibernian's stronger away production", teaser: "Dundee United remain winless at home, while Hibernian have taken two wins and a draw from their first three trips.", homeMatches: 3, awayMatches: 3, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Dundee United simply have not turned home advantage into results this season: **0-2-1 at Tannadice**, with just two goals scored against four conceded, for only 0.67 home points per game. That limited home attack is the clearest reason to avoid backing the hosts outright.",
      "Hibernian arrive in much better shape on the road, where **2.00 points per game** from a 2-1-0 away record tells its own story, even with five scored against four conceded showing their defence is still some way from airtight. Draw protection remains sensible given that imperfection, but Hibernian's away production is still materially stronger than anything Dundee United have produced at home."
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
    ...common, slug: "aberdeen-vs-st-johnstone", home: "Aberdeen", away: "St Johnstone", date: "2026-10-11", time: "14:00", venue: "Pittodrie Stadium", location: "Aberdeen, Scotland", pick: "Over 2.5 goals", odds: 1.88, access: "free", trend: "A fragile Over facing a low-event home split", teaser: "St Johnstone's scoring profile keeps the total in play, although Aberdeen's early home matches have been notably controlled.", homeMatches: 3, awayMatches: 3, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Aberdeen's home split works firmly against an easy goals case: just **two scored and two conceded across three matches**, a modest 1.33 total-goal average, and that restraint lines up with their wider 7-8 overall balance and a low BTTS rate of roughly 29%.",
      "St Johnstone offer the counterweight, with a livelier 9-10 overall goal profile and a BTTS rate near 71% — the kind of numbers that could open this match up. Their away record is a thinner 0-1-2, with two scored and four conceded, so a single St Johnstone goal would shift the total quickly, even if the home venue evidence alone does not make three goals a high-confidence outcome."
    ],
    tactical: "Aberdeen are likely to prefer controlled territory and pressure from wide areas rather than an end-to-end match. St Johnstone need to break that rhythm through direct attacks and second balls; an early visitor goal would force Aberdeen to increase tempo and make the Over substantially healthier.",
    risk: "This is the Scottish group's clearest conflict: Aberdeen's **0.67 home GF/game and 0.67 home GA/game** point toward another restrained scoreline. The 1.88 price recognises that fragility, but the selection still needs the match to depart from the host's established venue pattern.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-1-1", "0-1-2"], ["GF/game", "0.67", "0.67"], ["GA/game", "0.67", "1.33"], ["Total goals/game", "1.33", "2.00"], ["BTTS", "29% overall", "71% overall"]]
  },
  {
    ...common, slug: "hearts-vs-st-mirren", home: "Hearts", away: "St Mirren", date: "2026-10-10", time: "15:00", venue: "Tynecastle Park", location: "Edinburgh, Scotland", pick: "Over 2.5 goals", odds: 1.47, access: "vip", bestAnalysis: true, trend: "Hearts' perfect and productive home start", teaser: "Hearts have won all three home matches with an 8-2 goal balance, creating the strongest scoring foundation in this Scottish group.", homeMatches: 3, awayMatches: 3, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Hearts have found their scoring touch at home, where a perfect **3-0-0 record at Tynecastle** sits alongside eight goals for and only two against — figures that translate to 2.67 GF, 0.67 GA and a 3.33 total-goal average per home match. Across the full league campaign they have scored 14 times in seven matches, so the home venue is amplifying an already productive attack rather than masking a weaker one.",
      "The underlying process backs that up, with Hearts generating roughly 1.49 xG per match while St Mirren are conceding around 1.63 xGA overall. Hearts' broader BTTS rate of close to 86% is the final piece: even when the hosts control territory, their matches have tended to stay open rather than settle into a one-sided procession."
    ],
    tactical: "Hearts can sustain pressure by winning second balls and forcing St Mirren to defend repeated wide deliveries and set pieces. St Mirren's tighter away approach is the likely brake, but if Hearts score first the visitors must leave their compact shape and expose more space between the lines.",
    risk: "St Mirren's away profile is more controlled than Hearts' overall BTTS figure suggests. A deep block and slow first half could reduce shot quality, while the **1.47 price** leaves little room for a two-goal match.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "3-0-0", "not supplied"], ["Points/game", "3.00", "not supplied"], ["GF/game", "2.67", "not supplied"], ["GA/game", "0.67", "not supplied"], ["Total goals/game", "3.33", "not supplied"]]
  },
  {
    ...common, slug: "rangers-vs-kilmarnock", home: "Rangers", away: "Kilmarnock", date: "2026-10-10", time: "15:00", venue: "Ibrox Stadium", location: "Glasgow, Scotland", pick: "Rangers handicap -2", odds: 1.69, access: "vip", bestAnalysis: true, trend: "Large handicap against the weakest defence", teaser: "Kilmarnock have conceded 15 in seven matches, but Rangers' modest home scoring makes the required winning margin a demanding call.", homeMatches: 3, awayMatches: 4, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Kilmarnock's defensive record is the weakest in this sample, having shipped **15 goals in seven matches** for a -9 goal difference. Rangers sit at the opposite end, conceding only four all season and producing a clear chance-quality edge at around 1.83 xG against roughly 0.97 xGA.",
      "That contrast makes the case for backing Rangers' attack, but the -2 handicap asks for considerably more than a straightforward home win. Rangers themselves are only **2-0-1 at home with three goals scored**, a modest 1.00 home scoring average, so this selection is really a bet against Kilmarnock's defensive resistance rather than proof that Rangers routinely rack up large home margins."
    ],
    tactical: "Rangers need sustained pressure, fast circulation around the box and continued attacking intent after the first goal. Kilmarnock can protect the handicap by keeping the centre crowded and forcing lower-value deliveries from wide areas; every scoreless phase makes the two-goal margin harder to clear.",
    risk: "Rangers' **1.00 home GF/game** is the material conflict. A narrow win is entirely plausible and would not cover -2, while a push or settlement treatment at exactly two goals depends on the market's handicap convention; the stored selection is preserved exactly as supplied.",
    rows: [["Matches (N)", "3", "4"], ["W-D-L", "2-0-1", "not supplied"], ["GF/game", "1.00", "not supplied"], ["GA/game", "0.67", "not supplied"], ["xG/game", "1.83 overall", "not supplied"], ["xGA/game", "0.97 overall", "not supplied"]]
  },
  {
    ...common, slug: "motherwell-vs-celtic", home: "Motherwell", away: "Celtic", date: "2026-10-11", time: "12:00", venue: "Fir Park", location: "Motherwell, Scotland", pick: "Celtic to win", odds: 1.57, access: "vip", bestAnalysis: true, trend: "Celtic's perfect away start", teaser: "Celtic arrive with the league's strongest overall profile and three wins from three away matches, while Motherwell carry a negative goal difference.", homeMatches: 3, awayMatches: 3, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Celtic's overall numbers are already commanding — 18 points from seven matches, a +10 goal difference and 14 goals scored — but the underlying process backs it up too, with roughly **2.77 xG per match** against only about 1.02 xGA giving them the strongest two-way profile in this group.",
      "The away-specific record removes any doubt about whether that form travels: Celtic are a perfect **3-0-0 on the road**, with eight scored and just two conceded. Motherwell, by contrast, are only 1-1-1 at home, with three scored and four allowed, and a negative overall goal difference that leaves the visitors with the far clearer route to control this game."
    ],
    tactical: "Celtic can use sustained possession and counter-pressure to keep Motherwell defending near their own box, then attack through width and quick combinations. Motherwell's best chance is to survive the first wave and use direct transitions or set pieces before Celtic recover their shape.",
    risk: "A short away price always carries the danger of territorial dominance without conversion. Motherwell can make the match physical and compact at Fir Park, and a level score deep into the second half would increase the influence of isolated moments rather than Celtic's broader statistical edge.",
    rows: [["Matches (N)", "3", "3"], ["W-D-L", "1-1-1", "3-0-0"], ["Points/game", "1.33", "3.00"], ["GF/game", "1.00", "2.67"], ["GA/game", "1.33", "0.67"], ["xG/game", "not supplied", "2.77 overall"]]
  }
];

export const scottishPremiershipRound2026_10_10 = inputs.map(createWave28Prediction);
