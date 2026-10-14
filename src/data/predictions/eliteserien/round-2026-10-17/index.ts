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
  league: "eliteserien" as const,
  competition: "Eliteserien",
  round: "Round 24",
  publishedAt: "2026-10-14T09:00:00.000-03:00",
  updatedAt: "2026-10-14T09:00:00.000-03:00",
  oddsSource: "Editor-supplied PSP 33-analyses publication package (14 October 2026)",
};

const m_hamkam_vs_bod_glimt = createPspImport26Prediction({
  ...base,
  slug: "hamkam-vs-bod-glimt",
  home: "HamKam",
  away: "Bodø/Glimt",
  date: "2026-10-17",
  time: "14:00",
  venue: "Briskeby Stadion",
  venueAddress: { addressLocality: "Hamar", addressCountry: "Norway" },
  pick: "Over 3.5 Goals",
  odds: 1.7,
  access: "vip",
  teaser: "HamKam arrive after a 4-2 win at Start, while title-chasing Bodø/Glimt are level with Viking on 53 points and short of defenders. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "HamKam's open games against Bodø/Glimt's attack",
  matchAnalysis: [
    "HamKam's 4-2 win at Start was an important attacking response, but the defensive matchup becomes much harder against a Bodø/Glimt side tied with Viking at the top on 53 points. Glimt have 56 league goals in 22 matches, and HamKam have already shown they can be dragged into open games. That combination makes four goals reachable without requiring the visitors to do all the scoring. Bodø/Glimt are second only on tiebreak, level with Viking on **53 points** after 22 games. HamKam are 11th on 26 and have just scored four away at Start, a useful reminder that their attack is capable of helping an Over 3.5."
  ],
  tactical: "Bodø/Glimt's availability is not perfect, especially in defence and midfield, so HamKam have a credible route to contribute. The visitors still carry the stronger attacking structure and beat Kristiansund 3-1 in the previous round. A 1-3 or 2-2 score fits the selection; a controlled 0-3 does not, which is why HamKam's ability to create at home matters.",
  risk: "The line is high. A professional 0-3 or 1-2 Bodø/Glimt win would look dominant without reaching four total goals.",
  market: "At **1.70** the raw implied probability is **58.82%** (1 / 1.70). Bodø/Glimt have scored **56 league goals in 22 matches**, and 3 of their 11 away games have reached four goals, while HamKam have conceded 46 in 22. A reliable HamKam home split could not be reconciled with the league table, so the price rests on the season totals and on Glimt's defensive absences. Four goals is a demanding line and the value is modest.",
  conclusion: "Glimt's scoring and the injuries in their defence and midfield give HamKam room to contribute, and HamKam's 4-2 win at Start shows they can be part of an open game. A controlled 0-3 or 1-2 away win is the main way it fails, so Over 3.5 Goals at 1.70 remains the position.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Bodø/Glimt have Odin Bjørtuft suspended, while Håkon Evjen, Magnus Riisnæs, Julian Mikkelsen, Iver Sjong and Joshua Kitolano are unavailable. Jostein Gundersen has returned to training and could help cover the defensive shortage. HamKam have Anders Trondsen, Mikkel Johnsgård and Bjarne Isufi dealing with injury concerns.\n\n**PROJECTED setup:** Glimt are still expected to use their familiar 4-3-3, but Bjørtuft's suspension forces a centre-back change and the midfield absences reduce rotation options. HamKam should retain much of the side that scored four at Start rather than abandon the attacking shape that worked.",
  core: espnVenueSplitCore("eliteserien", "HamKam", "Bodø/Glimt"),
  sources: [
    {
      "name": "Eliteserien — official table and fixtures",
      "url": "https://www.eliteserien.no/"
    },
    {
      "name": "NFF — HamKam vs Bodø/Glimt match page",
      "url": "https://www.fotball.no/fotballdata/kamp/?fiksId=8986313"
    },
    {
      "name": "Starting11 — pre-match availability",
      "url": "https://starting11.com/fixtures/ham-kam-vs-bodo-glimt"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/nor.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/nor.1"
    }
  ],
});

const m_kristiansund_vs_aalesund = createPspImport26Prediction({
  ...base,
  slug: "kristiansund-vs-aalesund",
  home: "Kristiansund",
  away: "Aalesund",
  date: "2026-10-17",
  time: "16:00",
  venue: "Nordmøre Stadion",
  venueAddress: { addressLocality: "Kristiansund", addressCountry: "Norway" },
  pick: "Over 2.5 Goals",
  odds: 1.5,
  access: "vip",
  teaser: "Fifteenth meets fourteenth, with Kristiansund beaten 3-1 at Bodø/Glimt and Aalesund beaten 4-2 at home by Sarpsborg. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Two unstable defences in a relegation-zone meeting",
  matchAnalysis: [
    "This is a meeting between 15th and 14th, and both sides have given opponents too many clear looks. Kristiansund have just lost 3-1 at Bodø/Glimt after earlier conceding eight at Viking, while Aalesund come from a 4-2 home defeat to Sarpsborg. The match has enough defensive instability for Over 2.5 to be the natural angle. Aalesund are **14th with 21 points**; Kristiansund are 15th with 19. Both need points immediately, which reduces the incentive to protect a draw if the match reaches the final half-hour level."
  ],
  tactical: "The strongest case is not simply season-long goals against; it is the way recent games have opened once either side falls behind. Kristiansund still have a home route through direct play and set pieces, while Aalesund have shown they can score away. Three goals are attainable even if neither side controls the game for long periods.",
  risk: "Kristiansund's finishing has been inconsistent. If the hosts fail to turn home pressure into a goal, the game can remain below three despite both defenses being vulnerable.",
  market: "At **1.50** the raw implied probability is **66.67%** (1 / 1.50), so the over has to land in two matches out of three. The league totals point that way: Aalesund's 22 games have produced 85 goals, an average of **3.86 per match**, and Kristiansund's 65, or 2.95. Venue splits for the two clubs could not be reconciled with the table, so the case rests on those season averages. The value is limited at this short price for a pair that has been inconsistent at finishing.",
  conclusion: "Both defences concede regularly and neither side can afford to protect a draw late on, which makes three goals the likelier outcome. A scrappy 1-0 at Kristiansund is the risk, so Over 2.5 Goals at 1.50 stays as the call.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Kristiansund list Frederik Flex and Zymer Bytyqi as doubtful. Aalesund are without Simen Haram and have Paul Ngongo Iversen dealing with a thigh problem. These absences affect defensive continuity more than attacking ambition.\n\n**PROJECTED setup:** Both teams are expected to stay close to their recent starting structures rather than make wholesale tactical changes. Kristiansund's selection question is how much risk to take around the doubtful players; Aalesund need a replacement plan in defence for Haram.",
  core: espnVenueSplitCore("eliteserien", "Kristiansund", "Aalesund"),
  sources: [
    {
      "name": "Eliteserien — official fixture list",
      "url": "https://www.eliteserien.no/terminliste/"
    },
    {
      "name": "FotMob — Kristiansund vs Aalesund",
      "url": "https://www.fotmob.com/en-GB/matches/aalesund-vs-kristiansund/2e4s7a"
    },
    {
      "name": "Eliteserien — official table",
      "url": "https://www.eliteserien.no/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/nor.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/nor.1"
    }
  ],
});

const m_viking_vs_fredrikstad = createPspImport26Prediction({
  ...base,
  slug: "viking-vs-fredrikstad",
  home: "Viking",
  away: "Fredrikstad",
  date: "2026-10-17",
  time: "18:00",
  venue: "Viking Stadion",
  venueAddress: { addressLocality: "Stavanger", addressCountry: "Norway" },
  pick: "Viking Win + Over 2.5 Goals",
  odds: 1.61,
  access: "vip",
  bestAnalysis: true,
  teaser: "Viking share the league lead on 53 points after an 8-1 home win, and eighth-placed Fredrikstad arrive on 29 points. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Viking's perfect home record against Fredrikstad's weak road form",
  matchAnalysis: [
    "Viking remain level with Bodø/Glimt at the top on 53 points and have paired 56 goals scored with only 20 conceded. Their recent home ceiling is exceptional, including an 8-1 win over Kristiansund, and they have scored 16 across their last five matches. The home-win leg is therefore the foundation of this BEST BET. Viking are first on tiebreak, **53 points** from 22 matches; Fredrikstad are eighth on 29. Viking's recent five-game scoring run is the clearest form advantage entering Round 24."
  ],
  tactical: "Over 2.5 requires Viking either to score three themselves or for Fredrikstad to contribute. The visitors are eighth on 29 points and have scored in several recent games, so a 3-0, 3-1 or 2-1 home win is realistic. Viking's injury list removes some depth, but the attacking structure remains strong enough to sustain pressure at Viking Stadion.",
  risk: "A 2-0 Viking win is the obvious bad scoreline: it confirms the favorite's superiority but misses the goals leg by one.",
  market: "At **1.61** the raw implied probability is **62.11%** (1 / 1.61). Viking have won **all 10 home games**, scoring 38 and conceding 10, and every one of those 10 reached three goals; Fredrikstad have won three of 11 away games and conceded 21. Frequency strongly backs both legs, so the value looks fair to slightly generous for a 100% home record. The cautions are the size of the sample and Viking's injury list.",
  conclusion: "Viking's home record is the strongest single piece of evidence on the card: they have not dropped a point at home and have reached three goals every time. A tidy 2-0 is the realistic way to lose, so Viking Win + Over 2.5 Goals at 1.61 stays as the position.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Viking have Sondre Bjørshol, Nicholas D'Agostino, Anders Bærtelsen, Veton Berisha and Martin Roseth on the current injury list. Fredrikstad list Kennedy Okpaleke and Sigurd Kvile unavailable. The home side therefore have fewer rotation options than usual, but the first-choice attacking core is still capable of carrying the matchup.\n\n**PROJECTED setup:** Viking should keep the aggressive shape that has produced repeated high-scoring wins, with Zlatko Tripić remaining the main chance-creation reference. Fredrikstad are more likely to protect the centre first and use direct transitions rather than match Viking's tempo from kickoff.",
  core: espnVenueSplitCore("eliteserien", "Viking", "Fredrikstad"),
  sources: [
    {
      "name": "Eliteserien — official table",
      "url": "https://www.eliteserien.no/"
    },
    {
      "name": "FotMob — Viking vs Fredrikstad",
      "url": "https://www.fotmob.com/en-GB/matches/fredrikstad-vs-viking/2czcwu"
    },
    {
      "name": "Eliteserien — official fixture list",
      "url": "https://www.eliteserien.no/terminliste/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/nor.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/nor.1"
    }
  ],
});

const m_sarpsborg_08_vs_rosenborg = createPspImport26Prediction({
  ...base,
  slug: "sarpsborg-08-vs-rosenborg",
  home: "Sarpsborg 08",
  away: "Rosenborg",
  date: "2026-10-18",
  time: "14:30",
  venue: "Sarpsborg Stadion",
  venueAddress: { addressLocality: "Sarpsborg", addressCountry: "Norway" },
  pick: "Over 2.5 Goals",
  odds: 1.48,
  access: "vip",
  teaser: "Sarpsborg scored four at Aalesund, while Rosenborg travel without three suspended players from the spine of the team. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Rosenborg's suspension-hit spine meets a Sarpsborg side coming off a four-goal game",
  matchAnalysis: [
    "Sarpsborg's latest league match ended in a 4-2 win at Aalesund, while Rosenborg have been one of the league's most productive recent teams. That already points toward goals, but the away side's suspension list strengthens the argument: Rosenborg will have to alter the midfield and defensive structure, increasing the chance of a less controlled game. Rosenborg are fifth after 22 matches; Sarpsborg are ninth. Sarpsborg scored four last time out, while Rosenborg's recent run includes several multi-goal wins before the 1-1 draw with Sandefjord."
  ],
  tactical: "Sarpsborg are ninth on 28 points and should attack at home rather than sit in a low block. Rosenborg are fifth on 34 and still carry the greater scoring quality. With both teams capable of contributing and neither likely to field its ideal defensive unit, three goals is a realistic threshold.",
  risk: "If Sarpsborg fail to take advantage of Rosenborg's absences, the visitors are still capable of managing possession and turning the match into a lower-tempo 0-2 or 1-1.",
  market: "At **1.48** the raw implied probability is **67.57%** (1 / 1.48), so the bet needs a success rate near two in three, and the venue splits are less emphatic than the price: Over 2.5 landed in 5 of Sarpsborg's 10 home games and 5 of Rosenborg's 10 away games. The case for the over rests on the matchup, meaning Rosenborg's three suspensions and Sarpsborg's 4-2 win at Aalesund, more than on frequency. The value is thin at this price.",
  conclusion: "A reshaped Rosenborg midfield and a Sarpsborg side that attacks at home make an open game plausible, even if the split numbers are only average. If the hosts take advantage early, Over 2.5 Goals at 1.48 remains the call.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Rosenborg have Ole Kristian Selnæs, Amin Chiakha and Tomáš Nemčík suspended for this match, with Johan Bakke, Iver Fossum and Dino Islamović also listed unavailable. Sarpsborg are monitoring Chris Kouakou, Michael Opoku and Frederik Carstensen.\n\n**PROJECTED setup:** Rosenborg's projected XI must be reshaped through the spine because of three suspensions; Sarpsborg can keep a more familiar attacking setup but may need changes around the injured trio. That imbalance makes a perfectly controlled away performance less likely.",
  core: espnVenueSplitCore("eliteserien", "Sarpsborg 08", "Rosenborg"),
  sources: [
    {
      "name": "Eliteserien — official table",
      "url": "https://www.eliteserien.no/"
    },
    {
      "name": "FotMob — Sarpsborg 08 vs Rosenborg",
      "url": "https://www.fotmob.com/en-GB/matches/rosenborg-vs-sarpsborg-08/2dcer7"
    },
    {
      "name": "Eliteserien — official fixture list",
      "url": "https://www.eliteserien.no/terminliste/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/nor.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/nor.1"
    }
  ],
});

const m_molde_vs_start = createPspImport26Prediction({
  ...base,
  slug: "molde-vs-start",
  home: "Molde",
  away: "Start",
  date: "2026-10-18",
  time: "17:00",
  venue: "Aker Stadion",
  venueAddress: { addressLocality: "Molde", addressCountry: "Norway" },
  pick: "Molde Win + Over 2.5 Goals",
  odds: 1.62,
  access: "vip",
  teaser: "Fourth-placed Molde face bottom-placed Start, who conceded four at home to HamKam. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Molde's home attack against the league's bottom side",
  matchAnalysis: [
    "Molde are fourth on 37 points and face bottom-side Start, who have only 16. The home side have scored 46 league goals and drew 2-2 at Lillestrøm last time out, while Start conceded four at home to HamKam. That is a strong statistical and situational base for combining the Molde win with Over 2.5. Molde are fourth with **37 points**; Start are 16th with 16. The gap in both results and defensive stability is one of the clearest in this round."
  ],
  tactical: "The most direct route is a multi-goal home victory. Molde's injury list is long, but the team have still produced five goals at HamKam in September and four at Vålerenga in August. Start can help the total if they attack rather than simply protect the box, but Molde have enough home scoring capacity to clear the line themselves.",
  risk: "The main bad outcome is a controlled 2-0. Molde can be clearly superior and still miss the total-goals leg by one.",
  market: "At **1.62** the raw implied probability is **61.73%** (1 / 1.62). Molde have won **7 of 11 home games** with 24 goals scored, and Start have lost nine of 11 away games, conceding 29; 7 of Molde's home games and 8 of Start's away games have gone over 2.5 goals. Both legs are supported by frequency, and the value is fair, with Molde's long injury list the main reason it is not shorter.",
  conclusion: "Molde's home scoring and Start's defensive record point to a multi-goal home win, with the main alternative a controlled 2-0. Molde Win + Over 2.5 Goals at 1.62 stays as the position.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Molde list Birk Risa as doubtful and have Eirik Haugan, Sivert Hansen, Eirik Hestad, Seydina Diop, Halldor Stenevik, Vebjørn Hoff and Mads Kikkenborg among the current absences. Start are without Jens Husebø, Filip Manojlović and Kristoffer Tønnessen, while Lien, Koutsakos and Mvoué have been listed as doubts.\n\n**PROJECTED setup:** Molde's expected XI will be shaped by the defensive and midfield absences, but the front line should still be set up to attack from the opening phase. Start are likely to keep a more compact 4-3-3/4-5-1 and look for counters rather than trade long spells of possession.",
  core: espnVenueSplitCore("eliteserien", "Molde", "Start"),
  sources: [
    {
      "name": "Eliteserien — official table",
      "url": "https://www.eliteserien.no/"
    },
    {
      "name": "FotMob — Molde vs Start",
      "url": "https://www.fotmob.com/en-GB/matches/molde-vs-start/3953t1"
    },
    {
      "name": "Eliteserien — fixture list",
      "url": "https://www.eliteserien.no/terminliste/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/nor.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/nor.1"
    }
  ],
});

const m_sandefjord_vs_lillestr_m = createPspImport26Prediction({
  ...base,
  slug: "sandefjord-vs-lillestr-m",
  home: "Sandefjord",
  away: "Lillestrøm",
  date: "2026-10-18",
  time: "17:00",
  venue: "Jotun Arena",
  venueAddress: { addressLocality: "Sandefjord", addressCountry: "Norway" },
  pick: "X2 + Over 1.5 Goals",
  odds: 1.78,
  access: "vip",
  teaser: "Lillestrøm are sixth on 33 points and nine clear of Sandefjord, who held Rosenborg to a 1-1 draw. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Lillestrøm's table advantage against a compact Sandefjord",
  matchAnalysis: [
    "Lillestrøm are sixth on 33 points, nine clear of 12th-placed Sandefjord, and arrive after a 2-2 draw with Molde. The X2 part therefore has a clear table basis, while Over 1.5 is supported by common scorelines such as 1-1 or 0-2 rather than by expecting a shootout. Lillestrøm are sixth with **33 points**; Sandefjord are 12th with 24. Both drew against top-five opposition in Round 23, so neither enters this game in collapse."
  ],
  tactical: "Sandefjord have shown they can frustrate stronger sides, including the recent 1-1 at Rosenborg, so the draw protection matters. Their squad is also dealing with several defensive injuries, which gives Lillestrøm a route to create enough chances even if the hosts sit deeper. This selection is designed for a competitive game rather than a comfortable away win.",
  risk: "A slow 0-0 or a narrow 1-0 home win is the danger. Sandefjord's ability to compress space means Lillestrøm cannot rely on table position alone.",
  market: "At **1.78** the raw implied probability is **56.18%** (1 / 1.78). Lillestrøm have avoided defeat in 7 of 11 away games and Sandefjord have lost only three of 11 at home, which supports the double chance without making it comfortable. The goals leg is weaker than it looks: Over 1.5 landed in 7 of Sandefjord's 11 home games, and both sides score sparingly, with 10 and 11 goals in 11 games. The value comes from the result cover rather than from the goals.",
  conclusion: "Lillestrøm have the steadier platform and Sandefjord's injuries give them a route to chances, but a slow 0-0 or 1-0 is the danger. X2 + Over 1.5 Goals at 1.78 remains the call.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Sandefjord have Tobias Børkeeiet suspended and list Devon Koswal, Marcus Melchior, Nikolaj Möller, Filip Loftesnes-Bjune and Linus Alperud among the injury concerns. Lillestrøm have Espen Garnås and Camil Jebara on the current unavailable list.\n\n**PROJECTED setup:** Sandefjord will need at least one defensive adjustment because of the suspension, while Lillestrøm can stay closer to the side that drew 2-2 with Molde. The visitors should have the more stable midfield and attacking platform.",
  core: espnVenueSplitCore("eliteserien", "Sandefjord", "Lillestrøm"),
  sources: [
    {
      "name": "Eliteserien — official table",
      "url": "https://www.eliteserien.no/"
    },
    {
      "name": "FotMob — Sandefjord vs Lillestrøm",
      "url": "https://www.fotmob.com/en-GB/matches/lillestrom-vs-sandefjord/2ewjwk"
    },
    {
      "name": "Eliteserien — fixture list",
      "url": "https://www.eliteserien.no/terminliste/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/nor.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/nor.1"
    }
  ],
});

const m_valerenga_vs_brann = createPspImport26Prediction({
  ...base,
  slug: "valerenga-vs-brann",
  home: "Vålerenga",
  away: "Brann",
  date: "2026-10-18",
  time: "17:00",
  venue: "Intility Arena",
  venueAddress: { addressLocality: "Oslo", addressCountry: "Norway" },
  pick: "Over 2.5 Goals",
  odds: 1.4,
  access: "free",
  analysisAccess: "free",
  teaser: "Vålerenga's league games average well over three goals, and Brann play in Europe on Thursday before travelling to Oslo. The prediction and full analysis are FREE for everyone.",
  trend: "Vålerenga's goal-heavy season meets Brann between European fixtures",
  matchAnalysis: [
    "Vålerenga's 2-1 loss at KFUM left them 13th on 23 points, while Brann sit seventh on 29. The table alone does not explain the Over 2.5; the more important angle is schedule and defensive context. Brann play Conference League football on Thursday before travelling to Oslo, while Vålerenga have conceded regularly enough to invite another open home game. Vålerenga are 13th after losing 2-1 at KFUM. Brann are seventh and lost 0-2 to Viking in their last league match before the European fixture, so both sides are looking for a response."
  ],
  tactical: "Vålerenga still carry attacking threat through Ravn-Haren, Zahid and the central runners, and Brann have enough quality to punish turnovers. The visitors' short turnaround may reduce pressing intensity late on, which can create extra space rather than necessarily lower the goal count. Three goals is a modest target if both teams contribute.",
  risk: "If Brann manage the European turnaround by lowering the tempo and Vålerenga struggle to create, the match can settle into a controlled 1-1.",
  market: "At **1.40** the raw implied probability is **71.43%** (1 / 1.40), so the line needs the over to land roughly seven times in ten. The totals support it: Vålerenga's 22 league games have produced 80 goals, or **3.64 per match**, and **7 of Brann's 10 away games** have gone over 2.5. A reliable Vålerenga home split could not be reconciled with the table, and Brann's Thursday fixture could lower their pressing intensity, so the value is modest at a short price.",
  conclusion: "Both sides have been involved in open games, and Brann's short turnaround is as likely to create space as to slow the match down. A controlled 1-1 is the main risk, so Over 2.5 Goals at 1.40 remains the position.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Brann have Kristall Ingason suspended for 18 October and Sondre Tronstad sidelined with a cruciate-ligament injury; Kjartan Kjartansson and Sakarias Opsahl are also fitness concerns. Vålerenga have Fidel Brice Ambina and Omar Bully Drammeh on the injury list.\n\n**PROJECTED setup:** Vålerenga's latest XI included Hedvall behind Sjåtil, Olsen, Jarl and Finnsson, with Holm/Zahid in midfield and Ravn-Haren supporting Håvard Nielsen. Brann's selection may rotate after Thursday's Conference League game, especially in midfield and the wide positions.",
  core: espnVenueSplitCore("eliteserien", "Vålerenga", "Brann"),
  sources: [
    {
      "name": "Eliteserien — official table",
      "url": "https://www.eliteserien.no/"
    },
    {
      "name": "Vålerenga — official fixture list",
      "url": "https://www.vif-fotball.no/terminliste"
    },
    {
      "name": "FotMob — Brann squad/availability",
      "url": "https://www.fotmob.com/teams/8468/squad/brann"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/nor.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/nor.1"
    }
  ],
});

const m_troms_vs_kfum_oslo = createPspImport26Prediction({
  ...base,
  slug: "troms-vs-kfum-oslo",
  home: "Tromsø",
  away: "KFUM Oslo",
  date: "2026-10-18",
  time: "19:15",
  venue: "Romssa Arena",
  venueAddress: { addressLocality: "Tromsø", addressCountry: "Norway" },
  pick: "Tromsø Win",
  odds: 1.53,
  access: "vip",
  teaser: "Third-placed Tromsø host tenth-placed KFUM Oslo, who beat Vålerenga 2-1 in their last match. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Tromsø's home defence against KFUM's weak road form",
  matchAnalysis: [
    "Tromsø are third on 39 points and have a clear table and scoring advantage over 10th-placed KFUM. The 1-1 draw at Fredrikstad was not spectacular, but it extended a competitive profile that has kept Tromsø in the top three. At Romssa Arena they should have more territory and more final-third entries than a KFUM side coming off a 2-1 win over Vålerenga. Tromsø sit third with **39 points**; KFUM are 10th with 28. The visitors' latest win keeps them dangerous, but the home side still hold the stronger season-long platform."
  ],
  tactical: "The home-win price is attractive because it does not require a high-scoring performance. Tromsø can win through control and set pieces as well as transitions. Their injury list is meaningful, however, and KFUM have enough midfield aggression to keep the game uncomfortable if Tromsø do not score first.",
  risk: "The injury load is the concern. If Tromsø's reshuffled back line gives KFUM an early transition goal, a straight home win becomes much less comfortable.",
  market: "At **1.53** the raw implied probability is **65.36%** (1 / 1.53). Tromsø have won **7 of 11 home games**, lost one and kept seven clean sheets, while KFUM have won two of 10 away games and conceded 22. The records line up with the price, so the value is fair, and the injury list at Tromsø is the reason it is not shorter.",
  conclusion: "Tromsø hold the stronger platform at Romssa Arena, and KFUM's road record offers little resistance. An early transition goal against a reshuffled back line is the risk, so Tromsø Win at 1.53 stays as the call.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Tromsø are without Daniel Braut, Casper Øyvann, Mathias Tønnessen and Andreas Prestmo. KFUM have Tore André Sørås, Jonas Sjøkvist and Henrik Gonstad among the unavailable players, while Robin Rasch is also carrying a calf problem and remains doubtful.\n\n**PROJECTED setup:** Tromsø are expected to preserve their usual attacking structure and replace the unavailable defenders rather than change identity. KFUM should keep a compact midfield and use direct transitions, with Rasch's status important to their ability to control central spaces.",
  core: espnVenueSplitCore("eliteserien", "Tromsø", "KFUM Oslo"),
  sources: [
    {
      "name": "Eliteserien — official table",
      "url": "https://www.eliteserien.no/"
    },
    {
      "name": "NFF — Tromsø fixtures",
      "url": "https://www.fotball.no/fotballdata/lag/hjem/?fiksId=2"
    },
    {
      "name": "Starting11 — Tromsø vs KFUM",
      "url": "https://starting11.com/fixtures/tromso-vs-kfum-oslo"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/nor.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/nor.1"
    }
  ],
});

export const eliteserienRound2026_10_17: EditorialPrediction[] = [
  m_hamkam_vs_bod_glimt,
  m_kristiansund_vs_aalesund,
  m_viking_vs_fredrikstad,
  m_sarpsborg_08_vs_rosenborg,
  m_molde_vs_start,
  m_sandefjord_vs_lillestr_m,
  m_valerenga_vs_brann,
  m_troms_vs_kfum_oslo,
];
