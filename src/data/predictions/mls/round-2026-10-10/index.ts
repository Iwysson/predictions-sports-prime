import { createWave28Prediction, type Wave28Input } from "../../editorial-tools/wave-28/factory";

const fixtureSource = { name: "Major League Soccer — 2026 regular-season schedule", url: "https://www.mlssoccer.com/news/mls-unveils-2026-regular-season-schedule" };
const statsSource = { name: "SoccerSTATS — 2026 MLS home and away tables", url: "https://www.soccerstats.com/homeaway.asp?league=usa" };
const common = { league: "mls" as const, competition: "Major League Soccer", date: "2026-10-10", round: "Regular season", fixtureSource, statsSource };

const inputs: Wave28Input[] = [
  {
    ...common, slug: "chicago-fire-vs-new-york-city-fc", home: "Chicago Fire", away: "New York City FC", time: "13:30", venue: "Soldier Field", location: "Chicago, Illinois, United States", pick: "Chicago Fire to win", odds: 1.88, access: "free", trend: "Chicago's stronger home conversion", teaser: "Chicago's 7-1-4 home record and 1.83 home points per game create the central edge against NYCFC's balanced road split.", homeMatches: 12, awayMatches: 13,
    analysis: [
      "Chicago have been much stronger at Soldier Field than their overall position suggests. Their **7-1-4 home record** contains 22 goals scored and 14 conceded, equal to 1.83 scored and 1.17 allowed per game, while 1.83 home points per match shows that the venue advantage has translated into results.",
      "NYCFC are competitive away rather than weak: a 4-5-4 road line, 15 goals scored and 15 conceded produce **1.31 away points per game**. That resistance prevents the home price from being treated as routine, but Chicago's stronger scoring process and markedly higher home win rate still give the hosts the clearer path."
    ],
    tactical: "Chicago's best route is to establish pressure in the attacking half without leaving the centre exposed when NYCFC play through the first line. NYCFC can keep the contest level by slowing the tempo and protecting the space in front of their back line; Chicago need territorial control to become repeated box entries rather than harmless possession.",
    risk: "The main risk is NYCFC's balanced away profile: they concede only 1.15 per road match and have avoided defeat in nine of thirteen trips. Chicago therefore need their home chance creation to become a decisive goal, because a level, lower-event game favours the visitor's draw route.",
    rows: [["Matches (N)", "12", "13"], ["W-D-L", "7-1-4", "4-5-4"], ["Points/game", "1.83", "1.31"], ["GF/game", "1.83", "1.15"], ["GA/game", "1.17", "1.15"]]
  },
  {
    ...common, slug: "new-york-red-bulls-vs-san-diego-fc", home: "New York Red Bulls", away: "San Diego FC", time: "19:30", venue: "Sports Illustrated Stadium", location: "Harrison, New Jersey, United States", pick: "Over 2.5 goals", odds: 1.42, access: "free", trend: "Two exposed defensive profiles", teaser: "The Red Bulls concede two goals per home match, while San Diego's away defence also leaves this matchup open.", homeMatches: 13, awayMatches: 13,
    analysis: [
      "The Red Bulls have conceded **26 goals in 13 home matches**, exactly 2.00 per game, while scoring 18. Their home fixtures sit around 3.4 total goals, so opponents have regularly found enough space to make the scoreline move beyond a controlled one- or two-goal contest.",
      "San Diego raise the ceiling because their away defence concedes 1.77 per match. The visitors have enough attacking output to punish New York's pressure when it is bypassed, while the Red Bulls face a road defence that also permits chances; the case rests more on mutual exposure than on either side being an elite finisher."
    ],
    tactical: "New York's aggressive pressure can create short-field attacks, but it can also open transition lanes behind the first challenge. San Diego should have opportunities if they escape into those spaces, and an early goal would force the trailing side to take greater risks and stretch the match further.",
    risk: "The **1.42 price** leaves little room for a cautious first half. The home sample has not produced an overwhelming Over 2.5 rate, so poor finishing or San Diego choosing a compact away block could keep the total below three despite the defensive warning signs.",
    rows: [["Matches (N)", "13", "13"], ["GF/game", "1.38", "not supplied"], ["GA/game", "2.00", "1.77"], ["Total goals/game", "3.38", "2.92"], ["Over 2.5 goals", "54%", "not supplied"]]
  },
  {
    ...common, slug: "austin-fc-vs-nashville-sc", home: "Austin FC", away: "Nashville SC", time: "19:30", venue: "Q2 Stadium", location: "Austin, Texas, United States", pick: "Over 2.5 goals", odds: 1.78, access: "free", trend: "Austin vulnerability against Nashville quality", teaser: "Austin's defensive process gives Nashville a route to drive the scoring, although the visitor's road defence is a serious restraint.", homeMatches: 13, awayMatches: 13,
    analysis: [
      "Austin's home fixtures average **2.62 total goals**, with 19 scored and 15 conceded across 13 matches. Their underlying attack is closer to 1.00 xG per game while xGA is around 1.85, so the host's defensive vulnerability is more convincing than its ability to carry a high total alone.",
      "Nashville create the tension in this market. They have conceded only **9 goals in 13 away matches**, a 0.69 rate, and their road games average just 1.77 goals. Their stronger attacking ceiling means they can drive the total, but the home-away contrast makes this a genuinely debatable Over rather than an automatic play."
    ],
    tactical: "Austin need to draw Nashville out and attack the space left after turnovers, because a settled visitor block can suppress both shot volume and central access. Nashville can make the selection work by turning regains into direct attacks; if they instead control a lead and reduce tempo, the total becomes much harder to reach.",
    risk: "Nashville's away defence is the principal conflict: a team allowing 0.69 goals per road match can remove Austin's contribution altogether. The market requires three goals, so a controlled Nashville performance or Austin's weak finishing would work directly against the pick.",
    rows: [["Matches (N)", "13", "13"], ["GF/game", "1.46", "not supplied"], ["GA/game", "1.15", "0.69"], ["Total goals/game", "2.62", "1.77"], ["Over 2.5 goals", "46%", "not supplied"]]
  },
  {
    ...common, slug: "colorado-rapids-vs-san-jose-earthquakes", home: "Colorado Rapids", away: "San Jose Earthquakes", time: "19:30", venue: "Dick's Sporting Goods Park", location: "Commerce City, Colorado, United States", pick: "Over 2.5 goals", odds: 1.58, access: "free", trend: "San Jose's unusually productive road attack", teaser: "Colorado defend well at home, but San Jose's 1.85 away scoring rate creates the pressure behind the Over.", homeMatches: 13, awayMatches: 13,
    analysis: [
      "Colorado's **9-1-3 home record** comes with 25 goals scored and only 12 conceded. A 0.92 concession rate is strong evidence against a careless Over argument, although their own 1.92 scoring average means they can supply a large part of the required total.",
      "San Jose are the decisive variable: they are **7-3-3 away**, scoring 24 and conceding 17. Their road matches average 3.15 goals and their attack produces about 1.78 xG per match overall, giving the visitors a credible route to forcing Colorado out of a controlled home game."
    ],
    tactical: "Colorado can use the altitude and home territory to sustain pressure, but San Jose's transition threat means the hosts cannot commit numbers without rest defence. If San Jose score first or answer a Colorado opener, the game state should become more open; if Colorado suppress the visitor's first pass, it can remain compact.",
    risk: "Colorado's seven clean sheets in the home sample and sub-one-goal concession rate are the clear danger. This selection depends on San Jose reproducing their road attacking output against a defence that has been far more resistant than most of the opponents behind that average.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "9-1-3", "7-3-3"], ["GF/game", "1.92", "1.85"], ["GA/game", "0.92", "1.31"], ["Total goals/game", "2.85", "3.15"]]
  },
  {
    ...common, slug: "atlanta-united-vs-fc-cincinnati", home: "Atlanta United", away: "FC Cincinnati", time: "19:30", venue: "Mercedes-Benz Stadium", location: "Atlanta, Georgia, United States", pick: "Over 2.5 goals", odds: 1.42, access: "vip", trend: "High-scoring venue and vulnerable road defence", teaser: "Atlanta's home games and Cincinnati's road profile both point toward an unusually open scoring environment without revealing the protected market.", homeMatches: 13, awayMatches: 14,
    analysis: [
      "Atlanta's home matches average **3.23 total goals**, with Over 2.5 and BTTS both landing in 77% of the sample. The hosts have scored 19 and conceded 23, so their 1.77 home concession rate creates opportunities at both ends rather than a one-sided attacking case.",
      "Cincinnati intensify that profile by scoring 1.50 per away game while conceding **2.86 on the road**. Their overall fixtures have produced 119 goals across 26 matches, and underlying figures around 1.76 xG and 1.76 xGA support the idea that the volatility is not merely a finishing outlier."
    ],
    tactical: "Atlanta can attack the spaces Cincinnati leave when their midfield line is broken, but their own defensive record makes transition control essential. Cincinnati do not need long periods of possession to contribute; direct attacks after recoveries could turn any Atlanta pressure into chances at the opposite end.",
    risk: "A low published price demands efficiency, and either side could choose a more conservative shape after recent defensive problems. The goal profile is strong, but an early lead followed by risk reduction or missed chances would leave little protection at this threshold.",
    rows: [["Matches (N)", "13", "14"], ["GF/game", "1.46", "1.50"], ["GA/game", "1.77", "2.86"], ["Total goals/game", "3.23", "4.36"], ["BTTS", "77%", "not supplied"], ["Over 2.5 goals", "77%", "not supplied"]]
  },
  {
    ...common, slug: "charlotte-fc-vs-fc-dallas", home: "Charlotte FC", away: "FC Dallas", time: "19:30", venue: "Bank of America Stadium", location: "Charlotte, North Carolina, United States", pick: "FC Dallas X2", odds: 1.68, access: "vip", trend: "Dallas's strong road resistance", teaser: "Charlotte are formidable at home, but Dallas have avoided defeat in most away matches and bring a comparable points-per-game return.", homeMatches: 14, awayMatches: 14,
    analysis: [
      "Charlotte are a strong host, posting **7-4-3 at home** with 26 goals scored and 14 conceded. Their 1.79 home points per game and 1.00 concession rate show why draw protection is essential rather than optional.",
      "Dallas nearly match that production on the road: their away return is **1.71 points per game**, with only four defeats in fourteen trips and 25 goals scored. The selection does not claim Dallas are clearly superior; it relies on a visitor that has avoided defeat in 71% of its road league matches."
    ],
    tactical: "Charlotte are likely to seek territorial control and use width to pin Dallas back, while Dallas can make the double chance valuable by protecting central zones and countering into the space behind advanced full-backs. The first goal matters: Charlotte leading would force Dallas away from their preferred protected shape.",
    risk: "Charlotte's +12 home goal difference and one-goal concession average are substantial contrary evidence. Dallas must preserve their road discipline because a loose opening phase would remove much of the value supplied by the draw leg.",
    rows: [["Matches (N)", "14", "14"], ["W-D-L", "7-4-3", "7-3-4"], ["Points/game", "1.79", "1.71"], ["GF/game", "1.86", "1.79"], ["GA/game", "1.00", "1.57"]]
  },
  {
    ...common, slug: "inter-miami-vs-dc-united", home: "Inter Miami", away: "D.C. United", time: "19:30", venue: "Miami Freedom Park", location: "Miami, Florida, United States", pick: "Inter Miami to win", odds: 1.42, access: "vip", trend: "Miami's exceptional home attack", teaser: "Miami's home scoring ceiling is the defining matchup feature, although their own defensive openness keeps the visitor relevant.", homeMatches: 13, awayMatches: 12,
    analysis: [
      "Miami have scored **35 goals in 13 home matches**, an exceptional 2.69 per game, and those fixtures average 4.69 goals. Every home match has cleared 1.5 goals and 85% have cleared 2.5, showing how often their attacking output changes the game state.",
      "D.C. score 1.33 and concede 1.42 per away match, a much less explosive road profile. Miami's 2.06 xG per game overall gives the hosts a large chance-creation advantage, but 26 home goals conceded explain why this is a call on outscoring the visitor rather than controlling the match defensively."
    ],
    tactical: "Miami should be able to push D.C. deeper through sustained occupation around the box, yet their rest defence must handle direct counters when attacks break down. D.C.'s best route is to attack those transition spaces before Miami can reset; if the hosts score first, their superior creation should generate further openings.",
    risk: "Miami concede **2.00 goals per home game**, so their margin for attacking inefficiency is limited. A high-event match helps their strengths but also gives D.C. a route to punish turnovers, making the defensive side of the moneyline the main concern.",
    rows: [["Matches (N)", "13", "12"], ["GF/game", "2.69", "1.33"], ["GA/game", "2.00", "1.42"], ["Total goals/game", "4.69", "2.75"], ["Over 2.5 goals", "85%", "not supplied"]]
  },
  {
    ...common, slug: "los-angeles-fc-vs-vancouver-whitecaps", home: "Los Angeles FC", away: "Vancouver Whitecaps", time: "19:30", venue: "BMO Stadium", location: "Los Angeles, California, United States", pick: "Over 2.5 goals", odds: 1.60, access: "vip", trend: "Two high-quality attacks", teaser: "LAFC's home efficiency meets Vancouver's elite road scoring, creating a quality-versus-quality matchup rather than a simple defensive fade.", homeMatches: 13, awayMatches: 11,
    analysis: [
      "LAFC are **8-2-3 at home**, scoring 25 and conceding only 11. Their 1.92 scoring average supplies the attacking base, while the 0.85 concession rate shows that the goals case cannot rely on calling the home defence weak.",
      "Vancouver have been exceptional away: **6-3-2**, 24 goals scored and 12 conceded, equal to 2.18 for and 1.09 against per trip. Their overall chance creation is around 2.21 xG per match, making the visitor's attacking quality the central reason three combined goals remain attainable."
    ],
    tactical: "Both teams can progress quickly after winning the ball, so midfield turnovers may be more important than settled possession. LAFC will try to sustain pressure in Vancouver's half, while the Whitecaps can attack the channels left behind; an early breakthrough should create a game of repeated transitions.",
    risk: "LAFC's **0.85 home GA/game** is the strongest obstacle, and Vancouver also concede little away. If both teams respect the other's transition threat and keep extra protection behind the ball, a high-quality matchup can still produce a low-event scoreline.",
    rows: [["Matches (N)", "13", "11"], ["W-D-L", "8-2-3", "6-3-2"], ["Points/game", "2.00", "1.91"], ["GF/game", "1.92", "2.18"], ["GA/game", "0.85", "1.09"], ["Total goals/game", "2.77", "3.27"]]
  },
  {
    ...common, slug: "minnesota-united-vs-houston-dynamo", home: "Minnesota United", away: "Houston Dynamo", time: "19:30", venue: "Allianz Field", location: "Saint Paul, Minnesota, United States", pick: "Houston Dynamo X2", odds: 1.75, access: "vip", trend: "Minnesota's weak home conversion", teaser: "Minnesota have won only twice at home, while Houston's steadier away output supports draw protection for the visitor.", homeMatches: 13, awayMatches: 13,
    analysis: [
      "Minnesota's home split is a major weakness: **2-6-5 with 0.92 points per game**, 14 goals scored and 16 conceded. Their home fixtures average only 2.31 goals, so the problem is not constant chaos but a failure to convert the venue into wins.",
      "Houston are 5-2-6 away, scoring 17 and conceding 20 for **1.31 away points per game**. Their underlying profile is balanced at roughly 1.23 xG and 1.22 xGA, which supports a double-chance position built on stability rather than expecting the visitors to dominate."
    ],
    tactical: "Houston can keep the contest in their preferred range by denying central progression and making Minnesota attack through slower wide circulation. Minnesota's higher overall xG gives them a threat if they recover the ball close to goal, so Houston need clean spacing behind their first pressure.",
    risk: "Minnesota create around 1.59 xG overall and can outperform a poor home win rate in a single match. Houston's six away defeats also prevent the road split from being called dominant; the draw protection is doing important work.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "2-6-5", "5-2-6"], ["Points/game", "0.92", "1.31"], ["GF/game", "1.08", "1.31"], ["GA/game", "1.23", "1.54"], ["Total goals/game", "2.31", "2.85"]]
  },
  {
    ...common, slug: "new-england-revolution-vs-seattle-sounders", home: "New England Revolution", away: "Seattle Sounders", time: "19:30", venue: "Gillette Stadium", location: "Foxborough, Massachusetts, United States", pick: "New England X1 + Over 1.5", odds: 1.53, access: "vip", bestAnalysis: true, trend: "Elite New England home floor", teaser: "New England have lost only twice at home and average two goals there, while Seattle remain capable of contributing to the scoring side.", homeMatches: 13, awayMatches: 13,
    analysis: [
      "New England own one of the round's strongest venue splits: **9-2-2 at home** with 29 points, 26 goals scored and 13 conceded. Their exact 2.00-for and 1.00-against averages create both result protection and a three-goal home environment.",
      "Seattle's away line is 3-5-5, with roughly 1.36 goals scored and 1.15 conceded per trip. They remain capable of contributing, but five road defeats and only three wins make New England's **2.23 home PPG** the more reliable side of the combination."
    ],
    tactical: "New England can use their home pressure to keep Seattle defending longer sequences, but the visitors' transition threat makes a clean rest-defence structure important. The combination benefits from a New England opener: Seattle would have to advance, increasing space without requiring the hosts to chase an outright win late.",
    risk: "Seattle's overall matches average only 2.58 goals, so the second leg is not automatic. A goalless first half or Seattle successfully slowing the rhythm could leave the selection dependent on a late second goal even if New England avoid defeat.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "9-2-2", "3-5-5"], ["Points/game", "2.23", "1.08"], ["GF/game", "2.00", "1.36"], ["GA/game", "1.00", "1.15"], ["Total goals/game", "3.00", "2.51"]]
  },
  {
    ...common, slug: "orlando-city-vs-columbus-crew", home: "Orlando City", away: "Columbus Crew", time: "19:30", venue: "Inter&Co Stadium", location: "Orlando, Florida, United States", pick: "Orlando X1 + Over 1.5", odds: 1.59, access: "vip", trend: "Orlando home strength against an open road defence", teaser: "Orlando's seven home wins meet a Columbus road profile that concedes more than twice per match, supporting a protected home angle.", homeMatches: 13, awayMatches: 13,
    analysis: [
      "Orlando are **7-2-4 at home**, scoring 23 and conceding 17 for 1.77 points per match. Their home fixtures average 3.08 goals, with Over 1.5 landing in 77%, so the venue split supports both legs without demanding a home clean sheet.",
      "Columbus concede **2.08 goals per away match** while scoring 1.54, producing a 3.62-goal road environment. Only two away wins make the X1 protection attractive, but their scoring rate is high enough to help rather than hinder the modest two-goal requirement."
    ],
    tactical: "Orlando should seek width and repeated entries around the Columbus back line, while the Crew can threaten whenever the hosts leave space after advancing numbers. A Columbus goal does not necessarily damage the selection, but it would require Orlando to respond and keep territorial pressure high.",
    risk: "Orlando have conceded heavily overall, and a visitor scoring first could turn the result leg into the harder problem. The combination also fails in a 1-0 home win, so Orlando need result control and at least one further scoring event.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "7-2-4", "2-4-7"], ["Points/game", "1.77", "0.77"], ["GF/game", "1.77", "1.54"], ["GA/game", "1.31", "2.08"], ["Total goals/game", "3.08", "3.62"]]
  },
  {
    ...common, slug: "philadelphia-union-vs-real-salt-lake", home: "Philadelphia Union", away: "Real Salt Lake", time: "19:30", venue: "Subaru Park", location: "Chester, Pennsylvania, United States", pick: "Philadelphia Union to win", odds: 1.46, access: "vip", bestAnalysis: true, trend: "Union form and home defensive control", teaser: "Philadelphia combine a strong home defensive split with an extended winning run, while RSL's road return is materially weaker.", homeMatches: 13, awayMatches: 13,
    analysis: [
      "Philadelphia are **6-4-3 at home**, with 23 goals scored and only 13 conceded. The exact 1.00 home GA/game and +10 goal difference provide a controlled foundation, while five straight league wins add current form to the venue evidence.",
      "RSL concede **1.85 goals per away match** and have only one road win in the referenced split. Philadelphia's overall attack operates around 1.78 xG per game, so the hosts have both the recent result trend and chance creation to exploit that road weakness."
    ],
    tactical: "Philadelphia can press RSL's early build-up and turn recoveries into short attacks, then protect the middle once ahead. RSL's best route is to bypass that pressure quickly and isolate the home defence before it resets; a long level game would increase the importance of set pieces and single finishing moments.",
    risk: "The **1.46 price** requires a high win rate, and Philadelphia's four home draws show that defensive control does not always become victory. If RSL survive the opening pressure and keep the centre compact, the market can lose without the hosts being clearly second best.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "6-4-3", "1-5-7"], ["Points/game", "1.69", "0.62"], ["GF/game", "1.77", "not supplied"], ["GA/game", "1.00", "1.85"]]
  },
  {
    ...common, slug: "sporting-kansas-city-vs-portland-timbers", home: "Sporting Kansas City", away: "Portland Timbers", time: "19:30", venue: "Children's Mercy Park", location: "Kansas City, Kansas, United States", pick: "Portland Timbers X2", odds: 1.59, access: "vip", trend: "Sporting's fragile home defence", teaser: "Sporting have lost seven home matches and carry one of the league's weakest defensive processes, giving Portland room to avoid defeat.", homeMatches: 13, awayMatches: 13,
    analysis: [
      "Sporting KC are **3-3-7 at home**, taking only 0.92 points per match while scoring 18 and conceding 26. They have no home clean sheets in the supplied sample, and their season-long defensive process is around 2.01 xGA per game.",
      "Portland's defence is not strong enough to justify an away-win-only position, but their attack has scored 48 overall and their road games average 3.31 goals. X2 asks them to exploit Sporting's exposure and avoid defeat rather than control every phase."
    ],
    tactical: "Portland can attack the spaces behind Sporting's first pressure and should find transition opportunities if the hosts commit players forward. Sporting need sustained possession to pin Portland back, but losing the ball with wide players advanced would expose the same defensive weakness shown by their home concession total.",
    risk: "Portland's own defensive volatility means Sporting can still create a high-scoring home win. The draw cover reduces that concern but does not remove it; Portland must manage the moments after their attacks break down.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "3-3-7", "not supplied"], ["Points/game", "0.92", "not supplied"], ["GF/game", "1.38", "1.31"], ["GA/game", "2.00", "not supplied"], ["Total goals/game", "3.38", "3.31"]]
  },
  {
    ...common, slug: "toronto-fc-vs-cf-montreal", home: "Toronto FC", away: "CF Montréal", time: "13:00", venue: "BMO Field", location: "Toronto, Ontario, Canada", pick: "Toronto X1 + Under 4.5", odds: 1.65, access: "vip", trend: "Toronto's home resistance with a wide goal ceiling", teaser: "Toronto have lost only twice at home, while Montréal's road defence makes the hosts competitive without requiring a high-risk moneyline.", homeMatches: 14, awayMatches: 13,
    analysis: [
      "Toronto's overall record is modest, but the home split is **4-8-2 in 14 matches**, with 29 goals scored and 28 conceded. Losing only 14% of home league games supports the X1 leg even though the two-goal concession average makes a straight home win less appealing.",
      "Montréal score 1.15 and concede **2.77 per away match**, one of the weakest road defensive returns in the league sample. The 4.5 ceiling still permits 2-1, 2-2 or 3-1, so the total leg is designed to protect against a normal open game rather than predict a low-scoring derby."
    ],
    tactical: "Toronto can improve the result leg by keeping their midfield compact and attacking Montréal's weak road defence through quick switches. Montréal will look for transition chances if Toronto overcommit; a controlled home possession structure matters because repeated end-to-end exchanges would threaten the generous Under ceiling.",
    risk: "Toronto home fixtures average **4.07 goals** and Montréal away games 3.92, so the Under is not comfortable despite the high line. A 3-2 score is enough to lose the selection, while Toronto's eight home draws show why the double chance is safer than the moneyline.",
    rows: [["Matches (N)", "14", "13"], ["W-D-L", "4-8-2", "not supplied"], ["GF/game", "2.07", "1.15"], ["GA/game", "2.00", "2.77"], ["Total goals/game", "4.07", "3.92"]]
  }
];

export const mlsRound2026_10_10 = inputs.map(createWave28Prediction);
