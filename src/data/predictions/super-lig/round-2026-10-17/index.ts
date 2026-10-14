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
  league: "super-lig" as const,
  competition: "Turkish Süper Lig",
  round: "Matchweek 8",
  publishedAt: "2026-10-14T09:00:00.000-03:00",
  updatedAt: "2026-10-14T09:00:00.000-03:00",
  oddsSource: "Editor-supplied PSP 33-analyses publication package (14 October 2026)",
};

const m_erzurumspor_vs_eyupspor = createPspImport26Prediction({
  ...base,
  slug: "erzurumspor-vs-eyupspor",
  home: "Erzurumspor",
  away: "Eyüpspor",
  date: "2026-10-17",
  time: "13:30",
  venue: "Erzurum Kazım Karabekir Stadium",
  venueAddress: { addressLocality: "Erzurum", addressCountry: "Turkey" },
  pick: "Over 1.5 Goals + Over 6.5 Corners",
  odds: 1.64,
  access: "vip",
  teaser: "Erzurumspor and Eyüpspor have scored five league goals between them, but both defences have already conceded heavily. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Two low-scoring attacks and two leaking defences",
  matchAnalysis: [
    "Erzurumspor and Eyüpspor have produced only five league goals between them so far, which makes the goals leg look less obvious than the defensive records suggest. Erzurum have conceded 11; Eyüp 20, including a 4-0 home defeat to Göztepe on Monday. The selection therefore relies on vulnerability rather than prolific attacks: two goals can arrive through set pieces, transition mistakes or an early opener that forces the trailing side to abandon a low block. Erzurumspor are 14th on eight points with a **3-11 goal record**. Eyüpspor are 18th with three points and a 2-20 goal record after seven matches. The standings show two low-scoring attacks but two defenses that have already conceded heavily."
  ],
  tactical: "The corner requirement is similarly tied to game state. Both teams are in the bottom five and need points, so a late draw may not satisfy either side. If the match remains level, more direct wing play and set-piece pressure can lift the corner count beyond 6.5.",
  risk: "The obvious danger is the weak attacking output: a cautious 1-0 can miss both the two-goal and corner requirements.",
  market: "At **1.64** the raw implied probability is **60.98%** (1 / 1.64). The goals evidence is thin: Over 1.5 has landed in only one of Erzurumspor's three home games and two of Eyüpspor's three away games, though Eyüpspor have conceded 12 goals in those three road matches. Corner counts were not available from the sources used, so the corner leg cannot be tested against data. The value is limited and rests on Eyüpspor's defensive record.",
  conclusion: "Eyüpspor's defence and the pressure on both bottom-half sides to take points make two goals the likelier outcome, with direct play and set pieces feeding the corner count. A cautious 1-0 is the risk, so Over 1.5 Goals + Over 6.5 Corners at 1.64 stays as the position.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Abdelhamid Sabiri has been dealing with a muscle issue. Neither side otherwise has a major confirmed suspension dominating the matchup, so the more important selection question is whether the two low-scoring attacks can exploit vulnerable defensive records.\n\n**PROJECTED setup:** Both sides are expected to stay close to a 4-2-3-1/4-1-4-1 structure. Erzurum should have the greater incentive to push the full-backs higher at home, while Eyüp are more likely to protect the centre and counter.",
  core: espnVenueSplitCore("super-lig", "Erzurumspor", "Eyüpspor"),
  sources: [
    {
      "name": "TFF — 2026/27 table and fixtures",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "Starting11 — Süper Lig projected lineups",
      "url": "https://starting11.com/super-lig"
    },
    {
      "name": "FotMob — current availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/tur.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/tur.1"
    }
  ],
});

const m_amedspor_vs_konyaspor = createPspImport26Prediction({
  ...base,
  slug: "amedspor-vs-konyaspor",
  home: "Amedspor",
  away: "Konyaspor",
  date: "2026-10-17",
  time: "16:00",
  venue: "Diyarbakır Stadium",
  venueAddress: { addressLocality: "Diyarbakır", addressCountry: "Turkey" },
  pick: "1X + Over 1.5 Goals",
  odds: 1.65,
  access: "vip",
  teaser: "Third-placed Amedspor have scored 17 in seven matches and face a Konyaspor side that has managed four. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Amedspor's perfect home record against Konyaspor's low scoring",
  matchAnalysis: [
    "Amedspor have been one of the early-season surprises: third on 14 points with 17 goals in seven matches. Konyaspor are 16th with five points and only four goals. That makes the 1X leg strong, while Over 1.5 can be cleared by Amed alone if their current attacking rate holds. Amedspor: **3rd, 14 points**, 17-9. Konyaspor: 16th, five points, 4-8. The nine-point gap and the 13-goal difference in attacking output are the key table signals."
  ],
  tactical: "The hosts' 2-2 draw at Gençlerbirliği showed both sides of their profile: enough attacking quality to score twice, but enough defensive looseness to keep opponents involved. Konyaspor's low scoring output is the main reason not to overstate the goals angle. A 2-0 or 2-1 home performance is the cleanest path to the combination.",
  risk: "Konyaspor's low scoring rate can make the Over 1.5 dependent on Amed scoring twice. A flat 1-0 home win would miss the combination.",
  market: "At **1.65** the raw implied probability is **60.61%** (1 / 1.65). Amedspor have won **all four home games** with 13 goals scored, and each of them reached two goals; Konyaspor have taken one point from three away games and scored two. Both legs are supported, though the samples are only three and four games, and the value is real, while the risk is a 1-0 home win.",
  conclusion: "Amedspor's attacking rate is high enough to clear the goals line without Konyaspor's help, and their home record covers the double chance. A flat 1-0 is the way it fails, so 1X + Over 1.5 Goals at 1.65 remains the call.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. There is no major confirmed suspension changing the core matchup. The latest available selections give both coaches relatively familiar structures, so tactical continuity is more relevant than a speculative injury list.\n\n**PROJECTED setup:** Amed's latest XI featured Alban Lafont; David Bates, Lumbardh Dellova, Umut Meraş; Rayan Raveloson, Mohamed Khalil, Furkan Soyalp; Dia Saba, Samuel Ballet, Ermal Krasniqi and Gift Orban. Konyaspor recently used Bahadır Güngördü; Rayyan Baniya, Adil Demirbağ, Arthur Masuaku, Uğurcan Yazğılı; Rajmund Tóth, Marko Jevtović, Deniz Türüç, Melih İbrahimoğlu; Diogo Gonçalves and Jackson Muleka.",
  core: espnVenueSplitCore("super-lig", "Amedspor", "Konyaspor"),
  sources: [
    {
      "name": "TFF — current table",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "TFF — fixtures",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "Starting11 — Süper Lig lineups",
      "url": "https://starting11.com/super-lig"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/tur.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/tur.1"
    }
  ],
});

const m_genclerbirligi_vs_galatasaray = createPspImport26Prediction({
  ...base,
  slug: "genclerbirligi-vs-galatasaray",
  home: "Gençlerbirliği",
  away: "Galatasaray",
  date: "2026-10-17",
  time: "16:00",
  venue: "Eryaman Stadium",
  venueAddress: { addressLocality: "Ankara", addressCountry: "Turkey" },
  pick: "Galatasaray Win",
  odds: 1.4,
  access: "vip",
  bestAnalysis: true,
  teaser: "Galatasaray lead the league on 16 points but arrive after a heavy European defeat, and Gençlerbirliği have conceded 15 in seven matches. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "League leaders Galatasaray after Europe against a leaky Gençlerbirliği",
  matchAnalysis: [
    "Galatasaray lead the league with 16 points and face a Gençlerbirliği side that has conceded 15 in seven matches. The away win is supported by the visitors' superior attacking depth and a +5 goal difference, but the squad context is less comfortable than the original version suggested. Galatasaray come off a heavy European defeat and must replace two suspended midfielders. Galatasaray are **1st: 16 points**, 16-11. Gençlerbirliği are 13th: eight points, 7-15. The visitors' league position remains strong despite the 4-1 Champions League loss to Barcelona on 13 October."
  ],
  tactical: "Even with those changes, Gençlerbirliği have not shown the defensive consistency to justify opposing the leaders. Galatasaray beat Kasımpaşa 3-1 in their latest league game and can create through multiple lines. The key is avoiding a slow post-Europe start.",
  risk: "The combination of European fatigue and two midfield suspensions is the main reason the 1.40 favorite is not risk-free.",
  market: "At **1.40** the raw implied probability is **71.43%** (1 / 1.40). The splits are less one-sided than the table: Galatasaray have won two of three away games but conceded six in them, and Gençlerbirliği have lost only one of four at home. The price is justified by the gap in results across seven games, five wins against two, rather than by venue frequency, and the 4-1 defeat at Barcelona on 13 October plus two midfield suspensions make it a short price with limited value and real risk.",
  conclusion: "Galatasaray's depth and attacking quality still outweigh a Gençlerbirliği side with one of the league's weaker defensive records, even with two midfielders suspended. A slow start after Europe is the danger, so Galatasaray Win at 1.40 remains the position.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Lesley Ugochukwu and Lucas Torreira are suspended for this league fixture, forcing a midfield reshuffle. Wilfried Singo has returned to training. Other players have been managed through fitness doubts, so the final bench depth may differ from the strongest XI.\n\n**PROJECTED setup:** Galatasaray are still expected to use a 4-2-3-1/4-3-3, but the double midfield suspension means at least two role changes around the central zone. Gençlerbirliği should keep a compact block and try to attack the space left by the visitors' full-backs.",
  core: espnVenueSplitCore("super-lig", "Gençlerbirliği", "Galatasaray"),
  sources: [
    {
      "name": "TFF — current standings",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "TFF — matchweek fixtures",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "FotMob — current squad availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/tur.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/tur.1"
    }
  ],
});

const m_fenerbahce_vs_alanyaspor = createPspImport26Prediction({
  ...base,
  slug: "fenerbahce-vs-alanyaspor",
  home: "Fenerbahçe",
  away: "Alanyaspor",
  date: "2026-10-17",
  time: "19:00",
  venue: "Şükrü Saracoğlu Stadium",
  venueAddress: { addressLocality: "Istanbul", addressCountry: "Turkey" },
  pick: "Fenerbahçe -1.5 Asian Handicap",
  odds: 1.78,
  access: "vip",
  teaser: "Fenerbahçe have scored 19 and conceded six in seven matches, and Alanyaspor have conceded only six themselves. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Fenerbahçe's home attack against Alanyaspor's tight defence",
  matchAnalysis: [
    "Fenerbahçe have the league's best goal difference after seven rounds: 19 scored and only six conceded. They are fourth on 13 points, just one ahead of Alanyaspor, but the visitors' 8-6 record shows why a -1.5 handicap is much more aggressive than the table gap suggests. Fenerbahçe: **4th, 13 points**, 19-6. Alanyaspor: 6th, 12 points, 8-6. The home side own the stronger attack; the visitors own a defensive record that makes the handicap demanding."
  ],
  tactical: "Fener's 3-0 win at Rizespor demonstrated the margin this bet needs. At home they can pin Alanyaspor deep and create multiple waves through the wide players, yet the visitors have conceded fewer than one goal per match. A two-goal victory is plausible, not automatic. The selection depends on Fenerbahçe sustaining pressure after taking the lead rather than protecting a narrow advantage.",
  risk: "Alanyaspor have conceded only six in seven. A routine 1-0 Fenerbahçe win is entirely possible and would lose the handicap.",
  market: "At **1.78** the raw implied probability is **56.18%** (1 / 1.78) for Fenerbahçe to win by two or more goals. Fenerbahçe have scored **13 goals in three home games**, but Alanyaspor have conceded only four in four away games and lost one, so a handicap this wide is less certain than the table gap implies. The value depends on Fenerbahçe converting early pressure into a two-goal lead; a 1-0 win would not cover.",
  conclusion: "Fenerbahçe's goals at home give them the ceiling for a two-goal win, while Alanyaspor's discipline is the reason it is not automatic. If the hosts keep pressing after taking the lead, Fenerbahçe -1.5 Asian Handicap at 1.78 remains the call.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Mert Hakan Yandaş is suspended. Mert Müldür is sidelined after meniscus surgery and Jayden Oosterwolde remains out with an Achilles problem, reducing defensive and wide options.\n\n**PROJECTED setup:** Fenerbahçe should maintain an attacking 4-2-3-1/4-3-3 with the front four instructed to keep Alanyaspor pinned back. The absence of Mert Hakan changes midfield rotation, while the full-back choices are affected by Müldür and Oosterwolde.",
  core: espnVenueSplitCore("super-lig", "Fenerbahçe", "Alanyaspor"),
  sources: [
    {
      "name": "TFF — current standings",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "TFF — fixtures",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "FotMob — injury/suspension data",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/tur.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/tur.1"
    }
  ],
});

const m_kas_mpasa_vs_samsunspor = createPspImport26Prediction({
  ...base,
  slug: "kas-mpasa-vs-samsunspor",
  home: "Kasımpaşa",
  away: "Samsunspor",
  date: "2026-10-18",
  time: "13:30",
  venue: "Recep Tayyip Erdoğan Stadium",
  venueAddress: { addressLocality: "Istanbul", addressCountry: "Turkey" },
  pick: "1X + Over 1.5 Goals",
  odds: 1.95,
  access: "vip",
  teaser: "Kasımpaşa have lost only once in seven league games, while Samsunspor are second from bottom and have conceded 15. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Kasımpaşa's draw-heavy home form against Samsunspor's leaky defence",
  matchAnalysis: [
    "Kasımpaşa have lost only once in seven league games and sit ninth on ten points. Samsunspor are 17th with four points, 15 conceded and only six scored. The 1X leg therefore follows both table position and defensive reliability; Over 1.5 is supported by Samsun's concession rate rather than by Kasımpaşa being a prolific side. Kasımpaşa: **9th, 10 points**, 8-8. Samsunspor: 17th, four points, 6-15. The visitors' defensive record is the clearest support for the goals leg."
  ],
  tactical: "The hosts' latest 3-1 loss at Galatasaray should not be treated as a collapse because the level of opposition was different. Against Samsun, Kasımpaşa should see more of the ball and more territory. A 1-1 draw still qualifies, which is important because the home side have drawn four of seven.",
  risk: "Kasımpaşa's four draws show why the double chance is preferable to a home win, but a 0-0 would still defeat the combined market.",
  market: "At **1.95** the raw implied probability is **51.28%** (1 / 1.95). The frequencies give limited help: Kasımpaşa have drawn all three home games, and Over 1.5 landed in two of those and in only one of Samsunspor's three away games, even though Samsunspor have conceded 15 in seven league matches. The goals leg is the doubtful half, and the longer price reflects that, with moderate value.",
  conclusion: "Kasımpaşa's resilience protects the double chance and Samsunspor's concessions give the goals leg a base, but a 0-0 would beat the combination. 1X + Over 1.5 Goals at 1.95 remains the position.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Kasımpaşa are monitoring Mortadha Ben Ouanes. Samsunspor have Kamil Çörekçi out and list Oskar Øhlenschlæger and Afonso Sousa among the current fitness concerns. Their availability issues reduce both defensive continuity and midfield creativity.\n\n**PROJECTED setup:** Kasımpaşa can stay close to the side used in recent league games and rely on a compact midfield behind the front line. Samsun's projected XI is more uncertain because of the injury list, particularly in the wide and midfield roles.",
  core: espnVenueSplitCore("super-lig", "Kasımpaşa", "Samsunspor"),
  sources: [
    {
      "name": "TFF — standings",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "TFF — fixtures",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "FotMob — current availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/tur.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/tur.1"
    }
  ],
});

const m_kocaelispor_vs_goztepe = createPspImport26Prediction({
  ...base,
  slug: "kocaelispor-vs-goztepe",
  home: "Kocaelispor",
  away: "Göztepe",
  date: "2026-10-18",
  time: "16:00",
  venue: "Kocaeli Stadium",
  venueAddress: { addressLocality: "Kocaeli", addressCountry: "Turkey" },
  pick: "1X (Kocaelispor or Draw)",
  odds: 1.51,
  access: "free",
  analysisAccess: "free",
  teaser: "Seventh-placed Kocaelispor have not conceded at home, and Göztepe arrive after a 4-0 win at Eyüpspor. The prediction and full analysis are FREE for everyone.",
  trend: "Kocaelispor's clean-sheet home form against Göztepe's improving attack",
  matchAnalysis: [
    "Kocaelispor have made a strong start at home and overall, sitting seventh with 12 points from seven matches and only six conceded. Göztepe climbed to 15th on six points by winning 4-0 at Eyüpspor on Monday, their first league victory of the season. The 1X market therefore has a clear foundation without requiring Kocaelispor to dominate for 90 minutes. Kocaelispor: **7th, 12 points**, 8-6. Göztepe: 15th, six points from seven games, 15-15. The hosts have four wins; the visitors have one, the 4-0 at Eyüpspor on Monday."
  ],
  tactical: "Göztepe's 15 goals in seven matches show that they are more dangerous than the points total suggests, so the draw protection is important. Kocaelispor's own injury list is sizeable and prevents this from being a simple home-win call. The selection is about the hosts' stronger structure and results, not dismissing the visitors' attacking threat.",
  risk: "Kocaelispor's absences are substantial. If they reduce the hosts' attacking quality, Göztepe have enough scoring threat to turn this into a difficult home afternoon.",
  market: "At **1.51** the raw implied probability is **66.23%** (1 / 1.51). Kocaelispor have won all three home games without conceding, while Göztepe have scored 11 goals in four away games and all four passed 2.5 goals, which is why the draw cover matters. Göztepe's 4-0 win at Eyüpspor shows their attack is real, but it came against the bottom side, and the injury list at Kocaelispor is the main reason the price is not shorter, so the value is fair rather than large.",
  conclusion: "Kocaelispor's home structure gives them the stronger foundation, and the draw cover handles the likeliest alternative given Göztepe's attacking threat. The hosts' absences are the risk, so 1X (Kocaelispor or Draw) at 1.51 remains the call.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Kocaelispor list Tanguy Zoukrou, Massadio Haïdara, Tobias Gulliksen, Bruno Petković and Aleksandar Jovanović among the current injury concerns, with Rigoberto Rivas also a doubt. Göztepe have Allan Godoi, Furkan Bayır, Ibrahim Sabra and Nevzat Üzel on the pre-match availability list.\n\n**PROJECTED setup:** Because of the injuries, Kocaelispor may have to adjust both defence and the attacking midfield line while keeping the same overall shape. Göztepe are expected to retain a front-foot transition approach rather than sit extremely deep, which is why the draw remains a realistic outcome.",
  core: espnVenueSplitCore("super-lig", "Kocaelispor", "Göztepe"),
  sources: [
    {
      "name": "TFF — 2026/27 table",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "TFF — matchweek fixtures",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "FotMob — squad availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/tur.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/tur.1"
    }
  ],
});

const m_istanbul_basaksehir_vs_gaziantep_fk = createPspImport26Prediction({
  ...base,
  slug: "istanbul-basaksehir-vs-gaziantep-fk",
  home: "İstanbul Başakşehir",
  away: "Gaziantep FK",
  date: "2026-10-18",
  time: "19:00",
  venue: "Başakşehir Fatih Terim Stadium",
  venueAddress: { addressLocality: "Istanbul", addressCountry: "Turkey" },
  pick: "İstanbul Başakşehir Win",
  odds: 1.69,
  access: "vip",
  teaser: "Başakşehir and Gaziantep are level on eight points, with the hosts holding the better attacking record. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Başakşehir's home attack in a meeting of two sides level on points",
  matchAnalysis: [
    "Başakşehir and Gaziantep are level on eight points, so the home win is not supported by a large table gap. The argument is venue and attacking upside: Başakşehir have scored ten, three more than Gaziantep, and should have more sustained possession at home. Their 11 conceded also explain why the price remains above a short favorite. Başakşehir are 11th on eight points with a **10-11 goal record**; Gaziantep are 12th, also on eight, with 7-10. The hosts' extra attacking production is the main statistical separation."
  ],
  tactical: "Gaziantep can make this awkward by defending the central areas and attacking quickly after turnovers. Başakşehir need to move the ball faster than they did in the 0-0 draw at Konyaspor and use width to create better final-third entries. This is a narrow home edge rather than a mismatch.",
  risk: "The teams are level on points for a reason. Başakşehir's defensive record makes a clean, routine home win less certain than the market might initially suggest.",
  market: "At **1.69** the raw implied probability is **59.17%** (1 / 1.69). Başakşehir have scored nine goals in four home games and lost only once, while Gaziantep have won two of three away games, so the venue edge is real but modest. With the sides level on eight points, the value is thin because the price asks more of the home win than the table supports, and the main risk is a draw.",
  conclusion: "Başakşehir should have more of the ball and a clearer attacking route, but Gaziantep's counters keep the match tight. İstanbul Başakşehir Win at 1.69 stays as the position on the venue edge.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Edin Višća is listed as a doubt for Başakşehir. Gaziantep are monitoring Ali Kalın and Nazım Sangaré, while Fuat Bavuk is unavailable. Those absences can affect the visitors' ability to defend wide areas and break forward.\n\n**PROJECTED setup:** Başakşehir should keep a possession-first 4-2-3-1, with the right-side selection depending on Višća's fitness. Gaziantep are expected to defend in a medium block and look for direct transitions rather than hold long possession spells.",
  core: espnVenueSplitCore("super-lig", "İstanbul Başakşehir", "Gaziantep FK"),
  sources: [
    {
      "name": "TFF — current standings",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "TFF — fixtures",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "FotMob — team availability",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/tur.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/tur.1"
    }
  ],
});

const m_trabzonspor_vs_besiktas = createPspImport26Prediction({
  ...base,
  slug: "trabzonspor-vs-besiktas",
  home: "Trabzonspor",
  away: "Beşiktaş",
  date: "2026-10-19",
  time: "20:00",
  venue: "Papara Park",
  venueAddress: { addressLocality: "Trabzon", addressCountry: "Turkey" },
  pick: "Over 2.5 Goals",
  odds: 1.51,
  access: "vip",
  teaser: "Trabzonspor and Beşiktaş are both in the top five and have scored 16 league goals each, but Trabzon have conceded only five. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Two top-five attacks, one of the league's best defences",
  matchAnalysis: [
    "Trabzonspor and Beşiktaş are both in the top five and both have scored 16 league goals. That is the strongest support for Over 2.5. The counterweight is Trabzonspor's excellent defensive record: only five conceded in seven games, so this is not a blind goals play based on two famous attacks. Beşiktaş: **2nd, 15 points**, 16-8. Trabzonspor: 5th, 13 points, 16-5. Both attacks average above two goals per league match, but Trabzon's defence is the best argument against an automatic Over."
  ],
  tactical: "Beşiktaş are second on 15 points and come from a 2-1 win over Kocaelispor; Trabzonspor are fifth on 13 after beating Samsunspor 3-0. If Beşiktaş score first, the home side have enough attacking quality to force the match open. If Trabzonspor control the first hour without conceding, the line becomes much harder.",
  risk: "Trabzonspor have been excellent defensively. A 1-0 or 1-1 match is very plausible if the hosts impose their preferred tempo.",
  market: "At **1.51** the raw implied probability is **66.23%** (1 / 1.51). All three of Trabzonspor's home games have gone over 2.5 goals, but they conceded only one goal in them, 11-1, so the goals have come from Trabzon's own attack; Beşiktaş's away games have also produced goals, with four scored and five conceded in three. The risk is Trabzonspor's low concession rate: if they keep a clean sheet, the over needs three of their own. The value is moderate.",
  conclusion: "Both attacks are productive enough to reach three goals, and a Beşiktaş opener would force Trabzonspor to open the game. A 1-0 or 1-1 is the way it fails, so Over 2.5 Goals at 1.51 remains the call.",
  teamNews: "Team news is as of 14 October 2026, five days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Trabzonspor are without Ruslan Malinovskyi and Tim Jabol-Folcarelli, while Okay Yokuşlu is a fitness doubt; Arseniy Batahov has returned to training. Beşiktaş have also been managing fitness concerns in the attacking unit, which could influence how aggressively they press from the start.\n\n**PROJECTED setup:** Trabzon should preserve the compact base that has conceded only five, with the midfield adjusted around the absences. Beşiktaş are likely to keep an aggressive front line and press higher than many of Trabzon's recent opponents, which can create the transitions needed for three goals.",
  core: espnVenueSplitCore("super-lig", "Trabzonspor", "Beşiktaş"),
  sources: [
    {
      "name": "TFF — current table",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "TFF — fixtures",
      "url": "https://www.tff.org/Default.aspx?pageId=198"
    },
    {
      "name": "FotMob — current injury data",
      "url": "https://www.fotmob.com/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261019/league/tur.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/tur.1"
    }
  ],
});

export const superLigRound2026_10_17: EditorialPrediction[] = [
  m_erzurumspor_vs_eyupspor,
  m_amedspor_vs_konyaspor,
  m_genclerbirligi_vs_galatasaray,
  m_fenerbahce_vs_alanyaspor,
  m_kas_mpasa_vs_samsunspor,
  m_kocaelispor_vs_goztepe,
  m_istanbul_basaksehir_vs_gaziantep_fk,
  m_trabzonspor_vs_besiktas,
];
