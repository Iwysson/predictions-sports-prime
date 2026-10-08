import { createWave28Prediction, type Wave28Input } from "../../editorial-tools/wave-28/factory";

const fixtureSource = { name: "Major League Soccer — 2026 regular-season schedule", url: "https://www.mlssoccer.com/news/mls-unveils-2026-regular-season-schedule" };
const statsSource = { name: "SoccerSTATS — 2026 MLS home and away tables", url: "https://www.soccerstats.com/homeaway.asp?league=usa" };
const common = { league: "mls" as const, competition: "Major League Soccer", date: "2026-10-10", round: "Regular season", fixtureSource, statsSource };

const inputs: Wave28Input[] = [
  {
    ...common, slug: "chicago-fire-vs-new-york-city-fc", home: "Chicago Fire", away: "New York City FC", time: "13:30", venue: "Soldier Field", location: "Chicago, Illinois, United States", pick: "Chicago Fire to win", odds: 1.88, access: "free", trend: "Chicago's home edge meets NYCFC's road resistance", teaser: "Chicago's 7-1-4 home record and 1.83 home points per game create the central edge against an NYCFC side that has drawn five times away.", homeMatches: 12, awayMatches: 13, refreshedAt: "2026-10-08T06:25:59.000-03:00",
    teamNews: "No official matchday availability report or confirmed lineup was available at the 8 October review. Projected elevens are therefore omitted; the clubs' confirmed teamsheets remain the reliable reference close to kick-off.",
    coreIntroduction: "Statistical coverage is partial. The current 2026 HOME/AWAY data comes from SoccerSTATS. Chicago's 12 home matches are compared with NYCFC's 13 away matches; metrics not available from that source are left out rather than estimated.",
    conclusion: "Chicago's home win rate and scoring return give the hosts the stronger route, but NYCFC's ability to avoid defeat away keeps the margin narrow. Chicago Fire to win remains the call at the original 1.88 price.",
    analysis: [
      "Chicago arrive fourth in the Eastern Conference on 45 points, and Soldier Field has supplied the foundation for that campaign. Their **7-1-4 home record** includes 22 goals scored and 14 conceded: 1.83 scored, 1.17 allowed and **1.83 points per home match**. Recent form has been uneven, but seven wins from twelve at this venue show a repeatable ability to turn territory into results.",
      "NYCFC sit ninth in the East on 33 points and remain difficult to dismiss on the road. A 4-5-4 away line, with 15 scored and 15 conceded, produces **1.31 away points per game** and nine non-defeats in thirteen trips. The July meeting in New York ended 3-1 to NYCFC, so Chicago must improve its protection against direct breaks rather than assume the table gap will decide the rematch."
    ],
    tactical: "Chicago's best route is to pin NYCFC back with width, then attack the box before the visitors can settle into their compact shape. The July defeat showed the cost of leaving the centre open after losing possession: NYCFC can move quickly through the first pressure and attack the channels. Chicago need controlled rest defence behind their advanced players, not possession for its own sake.",
    risk: "The main risk is NYCFC's balanced away profile: they concede only 1.15 per road match and have avoided defeat in nine of thirteen trips. Chicago therefore need their home chance creation to become a decisive goal, because a level, lower-event game favours the visitor's draw route.",
    rows: [["Matches (N)", "12", "13"], ["W-D-L", "7-1-4", "4-5-4"], ["Points/game", "1.83", "1.31"], ["GF/game", "1.83", "1.15"], ["GA/game", "1.17", "1.15"]]
  },
  {
    ...common, slug: "new-york-red-bulls-vs-san-diego-fc", home: "New York Red Bulls", away: "San Diego FC", time: "19:30", venue: "Sports Illustrated Stadium", location: "Harrison, New Jersey, United States", pick: "Over 2.5 goals", odds: 1.42, access: "free", trend: "Two exposed defensive profiles", teaser: "The Red Bulls concede two goals per home match, while San Diego's away defence also leaves this matchup open.", homeMatches: 13, awayMatches: 13, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "New York's defence is the clearest driver of this pick: **26 goals conceded in 13 home matches**, exactly 2.00 per game, against 18 scored. With home fixtures at Sports Illustrated Stadium sitting around 3.4 total goals, opponents have consistently found enough room to push the scoreline past a controlled one- or two-goal contest.",
      "San Diego raise the ceiling further because their own away defence concedes 1.77 per match. The visitors carry enough attacking output to punish New York whenever that pressure is bypassed, while the Red Bulls face a road side that is similarly open at the back — so the case for the Over rests on mutual exposure at both ends rather than either team being an elite finisher."
    ],
    tactical: "New York's aggressive pressure can create short-field attacks, but it can also open transition lanes behind the first challenge. San Diego should have opportunities if they escape into those spaces, and an early goal would force the trailing side to take greater risks and stretch the match further.",
    risk: "The **1.42 price** leaves little room for a cautious first half. The home sample has not produced an overwhelming Over 2.5 rate, so poor finishing or San Diego choosing a compact away block could keep the total below three despite the defensive warning signs.",
    rows: [["Matches (N)", "13", "13"], ["GF/game", "1.38", "not supplied"], ["GA/game", "2.00", "1.77"], ["Total goals/game", "3.38", "2.92"], ["Over 2.5 goals", "54%", "not supplied"]]
  },
  {
    ...common, slug: "austin-fc-vs-nashville-sc", home: "Austin FC", away: "Nashville SC", time: "19:30", venue: "Q2 Stadium", location: "Austin, Texas, United States", pick: "Over 2.5 goals", odds: 1.78, access: "free", trend: "Austin vulnerability against Nashville quality", teaser: "Austin's defensive process gives Nashville a route to drive the scoring, although the visitor's road defence is a serious restraint.", homeMatches: 13, awayMatches: 13, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Austin's home fixtures have averaged **2.62 total goals**, with 19 scored and 15 conceded across 13 matches at Q2 Stadium. Their underlying numbers tell the more revealing story: an attack closer to 1.00 xG per game against an xGA around 1.85 means the host's defensive vulnerability is the more convincing half of the case, rather than Austin carrying the total on their own.",
      "Nashville are what makes this market genuinely debatable. They have conceded only **9 goals in 13 away matches**, a 0.69 rate, and their road games have averaged just 1.77 goals in total. Their attacking ceiling is strong enough to help drive the scoring toward three goals, but that tight away defensive record keeps the Over from being an automatic play."
    ],
    tactical: "Austin need to draw Nashville out and attack the space left after turnovers, because a settled visitor block can suppress both shot volume and central access. Nashville can make the selection work by turning regains into direct attacks; if they instead control a lead and reduce tempo, the total becomes much harder to reach.",
    risk: "Nashville's away defence is the principal conflict: a team allowing 0.69 goals per road match can remove Austin's contribution altogether. The market requires three goals, so a controlled Nashville performance or Austin's weak finishing would work directly against the pick.",
    rows: [["Matches (N)", "13", "13"], ["GF/game", "1.46", "not supplied"], ["GA/game", "1.15", "0.69"], ["Total goals/game", "2.62", "1.77"], ["Over 2.5 goals", "46%", "not supplied"]]
  },
  {
    ...common, slug: "colorado-rapids-vs-san-jose-earthquakes", home: "Colorado Rapids", away: "San Jose Earthquakes", time: "19:30", venue: "Dick's Sporting Goods Park", location: "Commerce City, Colorado, United States", pick: "Over 2.5 goals", odds: 1.58, access: "free", trend: "San Jose's unusually productive road attack", teaser: "Colorado defend well at home, but San Jose's 1.85 away scoring rate creates the pressure behind the Over.", homeMatches: 13, awayMatches: 13, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Colorado's **9-1-3 home record**, built on 25 goals scored and only 12 conceded, would normally argue against a careless Over pick: a 0.92 concession rate is real evidence of control. What keeps the total alive is Colorado's own 1.92 scoring average, which means the hosts can supply a large part of the required goals on their own.",
      "San Jose are the decisive variable on the other side. Going **7-3-3 away**, scoring 24 and conceding 17, their road matches have averaged 3.15 goals and their attack produces about 1.78 xG per match overall — enough of a credible attacking route to drag Colorado out of what would otherwise be a controlled home game."
    ],
    tactical: "Colorado can use the altitude and home territory to sustain pressure, but San Jose's transition threat means the hosts cannot commit numbers without rest defence. If San Jose score first or answer a Colorado opener, the game state should become more open; if Colorado suppress the visitor's first pass, it can remain compact.",
    risk: "Colorado's seven clean sheets in the home sample and sub-one-goal concession rate are the clear danger. This selection depends on San Jose reproducing their road attacking output against a defence that has been far more resistant than most of the opponents behind that average.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "9-1-3", "7-3-3"], ["GF/game", "1.92", "1.85"], ["GA/game", "0.92", "1.31"], ["Total goals/game", "2.85", "3.15"]]
  },
  {
    ...common, slug: "atlanta-united-vs-fc-cincinnati", home: "Atlanta United", away: "FC Cincinnati", time: "19:30", venue: "Mercedes-Benz Stadium", location: "Atlanta, Georgia, United States", pick: "Over 2.5 goals", odds: 1.42, access: "vip", trend: "High-scoring venue and vulnerable road defence", teaser: "Atlanta's home games and Cincinnati's road profile both point toward an unusually open scoring environment without revealing the protected market.", homeMatches: 13, awayMatches: 14, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Atlanta's home matches average **3.23 total goals**, a figure built on both ends of the pitch: the hosts have scored 19 and conceded 23 across the sample, and that 1.77 home concession rate means Over 2.5 and BTTS have each landed in 77% of their games at Mercedes-Benz Stadium rather than reflecting a purely one-sided attacking case.",
      "Cincinnati add to that volatility on the road, scoring 1.50 per away game while conceding **2.86** over the same stretch. Across their wider 26-match sample they have been involved in 119 goals, and underlying numbers of roughly 1.76 xG and 1.76 xGA for the visitors suggest this open scoring pattern is a genuine process rather than a short run of finishing luck."
    ],
    tactical: "Atlanta can attack the spaces Cincinnati leave when their midfield line is broken, but their own defensive record makes transition control essential. Cincinnati do not need long periods of possession to contribute; direct attacks after recoveries could turn any Atlanta pressure into chances at the opposite end.",
    risk: "A low published price demands efficiency, and either side could choose a more conservative shape after recent defensive problems. The goal profile is strong, but an early lead followed by risk reduction or missed chances would leave little protection at this threshold.",
    rows: [["Matches (N)", "13", "14"], ["GF/game", "1.46", "1.50"], ["GA/game", "1.77", "2.86"], ["Total goals/game", "3.23", "4.36"], ["BTTS", "77%", "not supplied"], ["Over 2.5 goals", "77%", "not supplied"]]
  },
  {
    ...common, slug: "charlotte-fc-vs-fc-dallas", home: "Charlotte FC", away: "FC Dallas", time: "19:30", venue: "Bank of America Stadium", location: "Charlotte, North Carolina, United States", pick: "FC Dallas X2", odds: 1.68, access: "vip", trend: "Dallas's strong road resistance", teaser: "Charlotte are formidable at home, but Dallas have avoided defeat in most away matches and bring a comparable points-per-game return.", homeMatches: 14, awayMatches: 14, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Charlotte are a strong host, posting **7-4-3 at home** with 26 goals scored and 14 conceded, a record that converts into 1.79 home points per game. Their stingy 1.00 concession rate at Bank of America Stadium is exactly why draw protection on the visitor's side is worth paying for rather than treating as an afterthought.",
      "Dallas nearly match that production away from home: their **1.71 points per game** on the road comes with only four defeats in fourteen trips and 25 goals scored. The pick is not a claim that Dallas are clearly the better side here; it leans on a visitor that has avoided defeat in 71% of its road league matches, which is close enough to Charlotte's home strength to make the double chance the sounder way in."
    ],
    tactical: "Charlotte are likely to seek territorial control and use width to pin Dallas back, while Dallas can make the double chance valuable by protecting central zones and countering into the space behind advanced full-backs. The first goal matters: Charlotte leading would force Dallas away from their preferred protected shape.",
    risk: "Charlotte's +12 home goal difference and one-goal concession average are substantial contrary evidence. Dallas must preserve their road discipline because a loose opening phase would remove much of the value supplied by the draw leg.",
    rows: [["Matches (N)", "14", "14"], ["W-D-L", "7-4-3", "7-3-4"], ["Points/game", "1.79", "1.71"], ["GF/game", "1.86", "1.79"], ["GA/game", "1.00", "1.57"]]
  },
  {
    ...common, slug: "inter-miami-vs-dc-united", home: "Inter Miami", away: "D.C. United", time: "19:30", venue: "Miami Freedom Park", location: "Miami, Florida, United States", pick: "Inter Miami to win", odds: 1.42, access: "vip", trend: "Miami's exceptional home attack", teaser: "Miami's home scoring ceiling is the defining matchup feature, although their own defensive openness keeps the visitor relevant.", homeMatches: 13, awayMatches: 12, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Miami's home attack has been exceptional: **35 goals in 13 matches**, a 2.69-per-game rate that has pushed those fixtures to average 4.69 goals in total. Every home match this season has cleared 1.5 goals and 85% have gone past 2.5, which is less a statistical quirk than a reflection of how often Miami's attacking output reshapes the game state at Miami Freedom Park.",
      "D.C. United's away profile is far less explosive, scoring 1.33 and conceding 1.42 per road match. Miami's overall chance creation of 2.06 xG per game gives the hosts a clear edge in that department, but 26 goals conceded at home is the counterweight: this is really a bet on Miami outscoring D.C. rather than shutting them out."
    ],
    tactical: "Miami should be able to push D.C. deeper through sustained occupation around the box, yet their rest defence must handle direct counters when attacks break down. D.C.'s best route is to attack those transition spaces before Miami can reset; if the hosts score first, their superior creation should generate further openings.",
    risk: "Miami concede **2.00 goals per home game**, so their margin for attacking inefficiency is limited. A high-event match helps their strengths but also gives D.C. a route to punish turnovers, making the defensive side of the moneyline the main concern.",
    rows: [["Matches (N)", "13", "12"], ["GF/game", "2.69", "1.33"], ["GA/game", "2.00", "1.42"], ["Total goals/game", "4.69", "2.75"], ["Over 2.5 goals", "85%", "not supplied"]]
  },
  {
    ...common, slug: "los-angeles-fc-vs-vancouver-whitecaps", home: "Los Angeles FC", away: "Vancouver Whitecaps", time: "19:30", venue: "BMO Stadium", location: "Los Angeles, California, United States", pick: "Over 2.5 goals", odds: 1.60, access: "vip", trend: "Two high-quality attacks", teaser: "LAFC's home efficiency meets Vancouver's elite road scoring, creating a quality-versus-quality matchup rather than a simple defensive fade.", homeMatches: 13, awayMatches: 11, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "LAFC's **8-2-3 home record**, with 25 goals scored against only 11 conceded, supplies the attacking base for this pick through a 1.92 scoring average, while their 0.85 concession rate means the goals case cannot simply rest on calling the home defence weak.",
      "Vancouver have been equally impressive on the road, going **6-3-2** with 24 goals scored and 12 conceded, equal to 2.18 for and 1.09 against per trip. Their overall chance creation of around 2.21 xG per match is the central reason this is framed as a quality-versus-quality matchup, with the visitor's attacking strength making three combined goals genuinely attainable rather than a simple bet against a leaky defence."
    ],
    tactical: "Both teams can progress quickly after winning the ball, so midfield turnovers may be more important than settled possession. LAFC will try to sustain pressure in Vancouver's half, while the Whitecaps can attack the channels left behind; an early breakthrough should create a game of repeated transitions.",
    risk: "LAFC's **0.85 home GA/game** is the strongest obstacle, and Vancouver also concede little away. If both teams respect the other's transition threat and keep extra protection behind the ball, a high-quality matchup can still produce a low-event scoreline.",
    rows: [["Matches (N)", "13", "11"], ["W-D-L", "8-2-3", "6-3-2"], ["Points/game", "2.00", "1.91"], ["GF/game", "1.92", "2.18"], ["GA/game", "0.85", "1.09"], ["Total goals/game", "2.77", "3.27"]]
  },
  {
    ...common, slug: "minnesota-united-vs-houston-dynamo", home: "Minnesota United", away: "Houston Dynamo", time: "19:30", venue: "Allianz Field", location: "Saint Paul, Minnesota, United States", pick: "Houston Dynamo X2", odds: 1.75, access: "vip", trend: "Minnesota's weak home conversion", teaser: "Minnesota have won only twice at home, while Houston's steadier away output supports draw protection for the visitor.", homeMatches: 13, awayMatches: 13, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Minnesota's home split is the major weakness behind this pick: **2-6-5 for 0.92 points per game**, with 14 goals scored and 16 conceded. Home fixtures at Allianz Field have averaged only 2.31 goals, so this is not a case of chaotic matches getting away from them — it is a straightforward failure to turn the venue into wins.",
      "Houston, by contrast, are 5-2-6 away, scoring 17 and conceding 20 for **1.31 points per away game**. Their underlying profile is balanced at roughly 1.23 xG and 1.22 xGA, which is exactly the kind of steady away form that supports a double-chance position built on stability rather than any expectation that the visitors will dominate."
    ],
    tactical: "Houston can keep the contest in their preferred range by denying central progression and making Minnesota attack through slower wide circulation. Minnesota's higher overall xG gives them a threat if they recover the ball close to goal, so Houston need clean spacing behind their first pressure.",
    risk: "Minnesota create around 1.59 xG overall and can outperform a poor home win rate in a single match. Houston's six away defeats also prevent the road split from being called dominant; the draw protection is doing important work.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "2-6-5", "5-2-6"], ["Points/game", "0.92", "1.31"], ["GF/game", "1.08", "1.31"], ["GA/game", "1.23", "1.54"], ["Total goals/game", "2.31", "2.85"]]
  },
  {
    ...common, slug: "new-england-revolution-vs-seattle-sounders", home: "New England Revolution", away: "Seattle Sounders", time: "19:30", venue: "Gillette Stadium", location: "Foxborough, Massachusetts, United States", pick: "New England X1 + Over 1.5", odds: 1.53, access: "vip", bestAnalysis: true, trend: "Elite New England home floor", teaser: "New England have lost only twice at home and average two goals there, while Seattle remain capable of contributing to the scoring side.", homeMatches: 13, awayMatches: 13, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "New England own one of the round's strongest venue splits, going **9-2-2 at home** for 29 points from 26 goals scored and 13 conceded. The exact 2.00-for and 1.00-against averages behind that record do double duty: they protect the result and, on their own, comfortably clear a three-goal home environment.",
      "Seattle's away line reads 3-5-5, with roughly 1.36 goals scored and 1.15 conceded per trip, so they remain capable of contributing to the scoring column even away from home. Still, five road defeats against only three wins leave New England's **2.23 home points per game** as the clearly more reliable half of this combination bet."
    ],
    tactical: "New England can use their home pressure to keep Seattle defending longer sequences, but the visitors' transition threat makes a clean rest-defence structure important. The combination benefits from a New England opener: Seattle would have to advance, increasing space without requiring the hosts to chase an outright win late.",
    risk: "Seattle's overall matches average only 2.58 goals, so the second leg is not automatic. A goalless first half or Seattle successfully slowing the rhythm could leave the selection dependent on a late second goal even if New England avoid defeat.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "9-2-2", "3-5-5"], ["Points/game", "2.23", "1.08"], ["GF/game", "2.00", "1.36"], ["GA/game", "1.00", "1.15"], ["Total goals/game", "3.00", "2.51"]]
  },
  {
    ...common, slug: "orlando-city-vs-columbus-crew", home: "Orlando City", away: "Columbus Crew", time: "19:30", venue: "Inter&Co Stadium", location: "Orlando, Florida, United States", pick: "Orlando X1 + Over 1.5", odds: 1.59, access: "vip", trend: "Orlando home strength against an open road defence", teaser: "Orlando's seven home wins meet a Columbus road profile that concedes more than twice per match, supporting a protected home angle.", homeMatches: 13, awayMatches: 13, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Orlando's **7-2-4 home record**, built on 23 goals scored and 17 conceded, converts into 1.77 points per match at Inter&Co Stadium. Those fixtures average 3.08 goals overall, and with Over 1.5 landing in 77% of them, the venue split already supports both legs of this combination without needing Orlando to keep a clean sheet.",
      "Columbus add to that goal supply from the road, conceding **2.08 per away match** while scoring 1.54, for a 3.62-goal environment on their travels. Only two away wins keep the X1 protection attractive, yet Columbus's scoring rate is high enough that it works in the bet's favour rather than against the modest two-goal requirement."
    ],
    tactical: "Orlando should seek width and repeated entries around the Columbus back line, while the Crew can threaten whenever the hosts leave space after advancing numbers. A Columbus goal does not necessarily damage the selection, but it would require Orlando to respond and keep territorial pressure high.",
    risk: "Orlando have conceded heavily overall, and a visitor scoring first could turn the result leg into the harder problem. The combination also fails in a 1-0 home win, so Orlando need result control and at least one further scoring event.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "7-2-4", "2-4-7"], ["Points/game", "1.77", "0.77"], ["GF/game", "1.77", "1.54"], ["GA/game", "1.31", "2.08"], ["Total goals/game", "3.08", "3.62"]]
  },
  {
    ...common, slug: "philadelphia-union-vs-real-salt-lake", home: "Philadelphia Union", away: "Real Salt Lake", time: "19:30", venue: "Subaru Park", location: "Chester, Pennsylvania, United States", pick: "Philadelphia Union to win", odds: 1.46, access: "vip", bestAnalysis: true, trend: "Union form and home defensive control", teaser: "Philadelphia combine a strong home defensive split with an extended winning run, while RSL's road return is materially weaker.", homeMatches: 13, awayMatches: 13, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Philadelphia's **6-4-3 home record**, with 23 goals scored against only 13 conceded, gives them an exact 1.00 GA/game and a +10 goal difference at Subaru Park. That defensive foundation is reinforced by current form, since five straight league wins now sit alongside the venue evidence.",
      "Real Salt Lake's travel record is the weaker side of this matchup: **1.85 goals conceded per away match** and only one road win in the referenced split. With Philadelphia's overall attack generating around 1.78 xG per game, the hosts combine both the recent result trend and the chance creation needed to exploit that road weakness."
    ],
    tactical: "Philadelphia can press RSL's early build-up and turn recoveries into short attacks, then protect the middle once ahead. RSL's best route is to bypass that pressure quickly and isolate the home defence before it resets; a long level game would increase the importance of set pieces and single finishing moments.",
    risk: "The **1.46 price** requires a high win rate, and Philadelphia's four home draws show that defensive control does not always become victory. If RSL survive the opening pressure and keep the centre compact, the market can lose without the hosts being clearly second best.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "6-4-3", "1-5-7"], ["Points/game", "1.69", "0.62"], ["GF/game", "1.77", "not supplied"], ["GA/game", "1.00", "1.85"]]
  },
  {
    ...common, slug: "sporting-kansas-city-vs-portland-timbers", home: "Sporting Kansas City", away: "Portland Timbers", time: "19:30", venue: "Children's Mercy Park", location: "Kansas City, Kansas, United States", pick: "Portland Timbers X2", odds: 1.59, access: "vip", trend: "Sporting's fragile home defence", teaser: "Sporting have lost seven home matches and carry one of the league's weakest defensive processes, giving Portland room to avoid defeat.", homeMatches: 13, awayMatches: 13, refreshedAt: "2026-10-08T15:00:00.000Z",
    analysis: [
      "Sporting KC's home record of **3-3-7** tells its own story: only 0.92 points per match from 18 goals scored and 26 conceded at Children's Mercy Park, with no home clean sheets anywhere in the supplied sample. Their season-long defensive process, around 2.01 xGA per game, backs up what that record already suggests.",
      "Portland's own defence is not solid enough to justify backing them outright, but their attack has scored 48 goals overall and their road games have averaged 3.31 in total. The X2 selection simply asks Portland to exploit Sporting's exposure and come away unbeaten, rather than requiring them to control every phase of the match."
    ],
    tactical: "Portland can attack the spaces behind Sporting's first pressure and should find transition opportunities if the hosts commit players forward. Sporting need sustained possession to pin Portland back, but losing the ball with wide players advanced would expose the same defensive weakness shown by their home concession total.",
    risk: "Portland's own defensive volatility means Sporting can still create a high-scoring home win. The draw cover reduces that concern but does not remove it; Portland must manage the moments after their attacks break down.",
    rows: [["Matches (N)", "13", "13"], ["W-D-L", "3-3-7", "not supplied"], ["Points/game", "0.92", "not supplied"], ["GF/game", "1.38", "1.31"], ["GA/game", "2.00", "not supplied"], ["Total goals/game", "3.38", "3.31"]]
  },
  {
    ...common, slug: "toronto-fc-vs-cf-montreal", home: "Toronto FC", away: "CF Montréal", time: "13:00", venue: "BMO Field", location: "Toronto, Ontario, Canada", pick: "Toronto X1 + Under 4.5", odds: 1.65, access: "vip", trend: "Toronto's BMO Field resistance in the Canadian Classique", teaser: "Toronto have lost only twice at home, while Montréal's road defence gives the hosts an edge within a generous 4.5-goal ceiling.", homeMatches: 14, awayMatches: 13, refreshedAt: "2026-10-08T06:25:59.000-03:00",
    teamNews: "No official availability bulletin or confirmed lineup was available at the 8 October review. No absence is inferred, and projected elevens are omitted until a credible match-specific source or the official teamsheets provide confirmation.",
    coreIntroduction: "Statistical coverage is partial. The 2026 split below compares Toronto's 14 HOME matches with Montréal's 13 AWAY matches using SoccerSTATS. It includes only the available venue metrics; unavailable advanced data is not reconstructed.",
    conclusion: "Toronto's low home defeat rate and Montréal's fragile away defence support the result leg, while the 4.5 line leaves room for a lively derby. Toronto X1 + Under 4.5 remains the call at 1.65, with a five-goal shootout the clearest danger.",
    analysis: [
      "Toronto enter the Canadian Classique tenth in the Eastern Conference, but BMO Field has made them far harder to beat than that position implies. Their **4-8-2 home record in 14 matches** contains 29 goals for and 28 against; only **14% of home league games** have ended in defeat. Eight draws explain why result protection is more persuasive than requiring a home win.",
      "Montréal are 14th in the East and their road defence is the sharpest weakness in the matchup. They score 1.15 but concede **2.77 goals per away match**, while Toronto average 2.07 at home. The first 2026 league meeting ended 0-0 in Montréal, a useful warning against assuming derby emotion guarantees goals, yet the 4.5 ceiling still covers conventional open results such as 2-1, 2-2 and 3-1."
    ],
    tactical: "Toronto can target Montréal's weak road structure with quick switches toward the wide attackers, but the central midfield must stay connected behind the ball. Montréal's most credible route is to invite pressure and counter into the channels. A measured Toronto build-up supports both parts of the selection; repeated end-to-end attacks would make the five-goal failure scenario much more realistic.",
    risk: "Toronto home fixtures average **4.07 goals** and Montréal away games 3.92, so the Under is not comfortable despite the high line. A 3-2 score is enough to lose the selection, while Toronto's eight home draws show why the double chance is safer than the moneyline.",
    rows: [["Matches (N)", "14", "13"], ["W-D-L", "4-8-2", "not supplied"], ["GF/game", "2.07", "1.15"], ["GA/game", "2.00", "2.77"], ["Total goals/game", "4.07", "3.92"]]
  }
];

export const mlsRound2026_10_10 = inputs.map(createWave28Prediction);
