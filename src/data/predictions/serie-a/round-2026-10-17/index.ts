import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";
import { venueSplitCore } from "../../editorial-tools/psp-import-12/venue-split-core";

// Source: PSP 12-analyses football publication package (Premier League, La Liga and Serie A,
// 17 October 2026). Predictions, odds and FREE/BEST BET/PRIME VIP labels are taken from the package
// unchanged. Kick-off times were checked against the league fixture list; team news, form and
// standings were refreshed on 13 October 2026. Corner averages in the two corner-market articles are
// the BetOnCorners figures supplied with the package: that page was returning a server error on
// 13 October, so they could not be re-verified and are attributed to their source.
const serieA = {
  league: "serie-a" as const,
  competition: "Serie A — 2026/27",
  round: "Matchday 7",
  date: "2026-10-17",
  publishedAt: "2026-10-13T08:30:00.000-03:00",
  updatedAt: "2026-10-13T08:30:00.000-03:00",
  oddsSource: "Editor-supplied PSP 12-analyses publication package (13 October 2026)",
};
const italy = { addressCountry: "Italy" };
const serieATable = { name: "Wikipedia — 2026–27 Serie A (table, results grid and managers, 12 October 2026)", url: "https://en.wikipedia.org/wiki/2026%E2%80%9327_Serie_A" };
const fantaMaster = { name: "FantaMaster — probabili formazioni, 7ª giornata Serie A (13 October 2026)", url: "https://www.fantamaster.it/probabili-formazioni-7-giornata-seriea-2026-2027-titolari-ballottaggi-ultime-dai-campi/" };
const betOnCorners = { name: "BetOnCorners — Serie A corner statistics (figures supplied with the package; page not reachable on 13 October 2026)", url: "https://betoncorners.com/statistics/serie-a-italy/" };
const newsIntro = (fixture: string) => `${fixture} follows Italian match-week reports and club previews published between 10 and 13 October 2026. It is four days before kick-off and several clubs play in Europe in midweek, so every lineup is PROJECTED and the official lineups, released about an hour before the game, will settle it.`;

const veneziaVsNapoli = createPspImport26Prediction({
  ...serieA,
  slug: "venezia-vs-napoli",
  home: "Venezia",
  away: "Napoli",
  time: "15:00",
  venue: "Stadio Pier Luigi Penzo, Venice",
  venueAddress: { addressLocality: "Venice", ...italy },
  pick: "Over 7.5 Total Corners + Over 1.5 Goals",
  odds: 1.69,
  access: "vip",
  teaser: "Venezia have lost all six league games and sacked their coach this week, while Napoli arrive with a depleted squad and a busy week. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "A coach sacked on Tuesday meets a Napoli side with a midweek European game",
  matchAnalysis: [
    "Venezia sit bottom of Serie A with **zero points** from six games, five goals scored and 16 conceded, and the situation changed again on Tuesday when the club dismissed Giovanni Stroppa after a 3–1 defeat at Atalanta. Paolo Zanetti and Davide Nicola are reported as the leading candidates, but no successor had been announced when this was written, so the team that takes the field, and its shape, are uncertain. The home split is no better: three games, three defeats, two goals scored and eight conceded, although all three of those games reached at least two goals, which matters for the goals leg of the selection.",
    "Napoli are eighth on **10 points** with three wins, one draw and two defeats, 10 goals scored and six conceded, and arrive after a 3–0 win over Frosinone and a Champions League tie against Villarreal on Tuesday. Massimiliano Allegri has lost Alisson Santos (hamstring), Anguissa (thigh), Olivera (hip) and Vergara (calf) to injury, while Scott McTominay has been cleared after a minor heart procedure and De Bruyne, Højlund and Neres lead the attack. The corner figures supplied with the package are mixed: Napoli's six league games have averaged 10.50 total corners, with 33 won and 30 conceded, while Venezia's have averaged 6.83, from 20 won and 21 conceded, according to BetOnCorners.",
  ],
  tactical: "The projected shapes are a Napoli 3-4-2-1 with Di Lorenzo and Spinazzola as wing-backs, De Bruyne in midfield, McTominay and Neres or Lang behind Højlund, and a Venezia 3-5-2 built for Yeboah and Adams on the break, although that line is a pre-dismissal projection and may change under a new coach. A Napoli side with the ball, using wing-backs and crosses, is the type of game that generates corners, and a home team chasing from behind adds blocks and clearances behind the goal line. An early Napoli goal would push Venezia forward and increase the chances for both thresholds; a patient 1–0 would suit the goals leg only if a second goal followed.",
  risk: "The selection fails if the match stops at seven corners or fewer, which Venezia's low average of 6.83 makes possible, or if it ends 1–0 or 0–0. A new coach could bring a defensive reaction, and Napoli's midweek European game and injury list could slow their tempo. The corner and goal conditions do not always coincide, and a controlled Napoli win with few set pieces is the cleanest way for the bet to lose.",
  market: "The market price of **1.69** corresponds to a raw implied probability of **59.17%** (1 / 1.69). Napoli's higher corner volume and Venezia's all-three-over-1.5 home record support each leg, but the combined price needs both to land, and Venezia's own corner total is low. The value is moderate and depends on Napoli's dominance of territory, not on Venezia's attacking output.",
  conclusion: "Napoli's attacking depth against the league's worst defence makes the goals leg comfortable, and their corner volume carries the second leg, but a new coach and Napoli's busy week keep the outcome uncertain. The identity of Venezia's coach and Napoli's lineup after Tuesday's European tie are the details to confirm. Over 7.5 total corners plus over 1.5 goals at 1.69 therefore stands.",
  teamNews: `${newsIntro("Team news for Venezia against Napoli")}

**Venezia**
- **Coach:** Giovanni Stroppa was dismissed on 13 October after a 3–1 defeat at Atalanta. Paolo Zanetti and Davide Nicola are the reported candidates, and no appointment had been announced when this was written.
- No individual absences or suspensions were found in the sources checked, so none are asserted.

**Napoli**
- **Out:** Alisson Santos (hamstring), Anguissa (thigh), Olivera (hip) and Vergara (calf), as listed on 12 October.
- **Back:** Scott McTominay has been cleared after a minor heart procedure. Napoli play Villarreal in the Champions League on Tuesday.
- No suspensions were reported.

**PROJECTED Venezia (3-5-2):** Stanković; Schingtienne or Halhal, Juan Jesus, Moreno; Hainaut, Basic, Sohm, Perez, Sagrado or Haps; Yeboah, Adams. This projection predates the coaching change.

**PROJECTED Napoli (3-4-2-1):** Meret; Rrahmani, Rafa Marín, Badiashile; Di Lorenzo, Lobotka, De Bruyne, Spinazzola; Neres or Lang, McTominay; Højlund.`,
  core: venueSplitCore("serie-a", "Venezia", "Napoli"),
  sources: [
    serieATable,
    fantaMaster,
    betOnCorners,
    { name: "Football Italia — Venezia sack Stroppa after six defeats in a row (13 October 2026)", url: "https://football-italia.net/official-venezia-sack-stroppa-6-defeats-in-row/" },
    { name: "Reuters (via Devdiscourse) — Serie A bottom club Venezia sack coach Stroppa", url: "https://www.devdiscourse.com/article/international/3991443-soccer-serie-a-bottom-club-venezia-sack-coach-stroppa" },
    { name: "UEFA — Champions League predicted line-ups, Matchday 2 (Napoli injuries)", url: "https://www.uefa.com/uefachampionsleague/news/02aa-21cf3c78cf12-1c26cfd9b696-1000--champions-league-predicted-line-ups-matchday-2-team-news-/" },
  ],
});

const bolognaVsInter = createPspImport26Prediction({
  ...serieA,
  slug: "bologna-vs-inter",
  home: "Bologna",
  away: "Inter",
  time: "18:00",
  venue: "Stadio Renato Dall'Ara, Bologna",
  venueAddress: { addressLocality: "Bologna", ...italy },
  pick: "Over 7.5 Total Corners + Over 1.5 Goals",
  odds: 1.55,
  access: "vip",
  teaser: "Inter lead Serie A with 18 goals in six games, while Bologna have scored five and concede plenty of corners. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Inter's attack and Bologna's corner concessions frame a market-based pick",
  matchAnalysis: [
    "Inter lead Serie A level on **16 points** with Lazio after six games, five wins and a draw, 18 goals scored and eight conceded, and Cristian Chivu's side arrive after a 3–0 win over Parma with a Champions League tie against Club Brugge on Tuesday. The attack has been prolific, with 3–2 and 5–3 wins over Napoli and Udinese, while the defence has conceded in most games. Curtis Jones is out for about a month with an adductor problem, Hakan Çalhanoğlu is available after a week of training, and Spence has resumed full work. Away from San Siro they have won one and drawn one from two games, scoring three and conceding two.",
    "Bologna are 14th with **5 points** from six games, one win, two draws and three defeats, five goals scored and seven conceded. The package's remark that one statistical breakdown showed only three goals in five matches is superseded by the league table, which records five in six, a rate of 0.83 per game. Raffaele Palladino's side have drawn twice and lost once at home, scoring three and conceding four, and they are without Holm, who needs months after thigh-tendon surgery, and Odgaard, whose hamstring problem has a disputed return date. The corner profile is the stronger part of the case: Bologna's six league games have averaged 10.67 total corners, with 24 taken and 40 conceded, while Inter's have averaged 9.33, with 34 won and 22 conceded, according to BetOnCorners.",
  ],
  tactical: "Inter's projected 3-5-2, with Thuram and Lautaro Martínez or Pio Esposito up front and wing-backs Dimarco and Diouf, will keep territory, and a Bologna team that concedes 6.7 corners per game is likely to spend long periods defending. Bologna's 3-4-3 with Bernardeschi and Cambiaghi will counter, but their goals are limited. The corner leg is supported by Bologna's concessions and Inter's attacking volume, and the goals leg needs only two. A 1–0 Inter win with few set pieces, or a game that Inter manage after an early goal with Tuesday's tie in mind, is the scenario that undermines both parts.",
  risk: "The most direct way for the bet to lose is a tight 1–0 or a low-event game: Bologna have scored only five goals in six games, and Inter, with a European game on Tuesday, may rotate and control the game with fewer attacking phases. The corners leg also needs eight or more in the same match as two goals, and averages do not show how often both conditions coincide.",
  market: "At **1.55** the combination carries a raw implied probability of **64.52%** (1 / 1.55). Bologna's concession of 40 corners in six games and Inter's 18 goals support each leg, while Bologna's weak scoring and a possible rotated Inter are the reasons the price is not shorter. The value rests on the corners volume more than on the goals line.",
  conclusion: "Bologna concede many corners and Inter score freely, so both legs have a clear basis, with the main risk a controlled 1–0 after an early goal. Inter's lineup after Tuesday's tie, particularly Lautaro, Thuram and Çalhanoğlu, is the detail to check. On balance, over 7.5 total corners plus over 1.5 goals at 1.55 still reads as the better side of the argument.",
  teamNews: `${newsIntro("Team news for Bologna against Inter")}

**Bologna**
- **Out:** Holm (right-thigh tendon surgery, out for months) and Odgaard (hamstring), whose return is reported as late October in one source and later in another.
- No suspensions were reported.

**Inter**
- **Out:** Curtis Jones (adductors, about a month, early November return).
- **Available:** Hakan Çalhanoğlu after a week of training with the group; Spence has resumed full work.
- Inter play Club Brugge in the Champions League on Tuesday. No suspensions were reported.

**PROJECTED Bologna (3-4-3):** Skorupski or Pessina; Darmian, Heggem or Helland, Casale or Helland; Zortea, Pobega or Moro, Ferguson, Miranda; Bernardeschi, Piccoli or Enem, Cambiaghi.

**PROJECTED Inter (3-5-2):** Josep Martínez or Provedel; Akanji or Pavard, Bisseck, Carlos Augusto or Bastoni; Diouf or Luis Henrique, Barella or Zieliński, Çalhanoğlu, Sučić or Mkhitaryan, Dimarco; Thuram, Lautaro Martínez or Pio Esposito. The sources list alternatives for several places.`,
  core: venueSplitCore("serie-a", "Bologna", "Inter"),
  sources: [
    serieATable,
    fantaMaster,
    betOnCorners,
    { name: "Reuters — Lazio keep pace as top 10-man Roma earn draw at Como (11 October 2026)", url: "https://www.reuters.com/sports/soccer/lazio-keep-pace-top-10-man-roma-earn-draw-como-milan-held-by-sassuolo-2026-10-11/" },
    { name: "UEFA — Champions League predicted line-ups, Matchday 2 (Inter injuries)", url: "https://www.uefa.com/uefachampionsleague/news/02aa-21cf3c78cf12-1c26cfd9b696-1000--champions-league-predicted-line-ups-matchday-2-team-news-/" },
  ],
});

const romaVsGenoa = createPspImport26Prediction({
  ...serieA,
  slug: "roma-vs-genoa",
  home: "Roma",
  away: "Genoa",
  time: "20:45",
  venue: "Stadio Olimpico, Rome",
  venueAddress: { addressLocality: "Rome", ...italy },
  pick: "Roma to Win + Over 1.5 Goals",
  odds: 1.58,
  access: "vip",
  bestAnalysis: true,
  teaser: "Roma are unbeaten with the joint-best defence in the league, but they are without their suspended striker and goalkeeper and face Real Madrid in midweek. Full pick and odds are in PRIME VIP.",
  trend: "Roma's unbeaten start is tested by a suspended striker and a midweek Madrid tie",
  matchAnalysis: [
    "Roma begin Matchday 7 unbeaten, third on **14 points** with four wins and two draws from six games, 14 goals scored and only three conceded, a goal difference of +11. They have scored eight and conceded three in three home games at the Olimpico, and each of those games passed 2.5 goals. The latest league result was a goalless draw at Como in which Donyell Malen was sent off, which means he misses this match through a Serie A suspension, while Mile Svilar, out for about a month after a fracture, means Gollini keeps goal and Bryan Cristante's knee leaves midfield rotation limited. Gian Piero Gasperini's side also host Real Madrid in the Champions League on Wednesday, so the lineup is likely to change.",
    "Genoa are 17th with **4 points** from six games, one win, one draw and four defeats, five goals scored and 11 conceded, and their away split is two games, two defeats, one goal scored and three conceded. Daniele De Rossi's side have lost four of their six league games, including a 1–0 defeat at Lazio. Genoa's projected line-up is a 4-4-2 or 3-5-2 built around Osmajić, Vitinha and Baldanzi, and no reliable absentee list has been published. Roma's attack will find a visiting defence that has conceded 1.83 goals per game across the season.",
  ],
  tactical: "Roma's projected 3-4-2-1 has Mancini, N'Dicka and Hermoso behind Koné and De Roon, with Molina and Wesley as wing-backs and Dybala and a second creator, Soulé or Pellegrini, supporting Castro in place of the suspended Malen. Without a recognised striker, more weight falls on Dybala's link play. Genoa's compact block and counter threat through Osmajić will try to keep the game level, but a team that has conceded 11 in six games will find it hard to hold a lead against a home side scoring 2.67 per game at the Olimpico. An early Roma goal would put the game beyond Genoa's plan; a goalless first half would raise the 1–0 risk.",
  risk: "Roma must win and score at least twice in total: a 1–0 would fail, and the evidence for that outcome is real, since Roma drew 0–0 at Como on Sunday and Madrid's visit on Wednesday could prompt rotation. Malen's absence and the lack of a recognised striker are the clearest reasons for the goals leg to be less automatic than 14 goals in six games suggests.",
  market: "Dividing one by the **1.58** price gives a raw implied probability of **63.29%** (1 / 1.58) for the combination. Roma have won two of three at home with all three over 2.5, and Genoa have lost both away games, which supports each leg. The price already reflects a strong home side, and the missing striker and midweek tie are the reasons it is not shorter. The value rests on Roma's home defence and Genoa's weak attack.",
  conclusion: "Roma's home form, the joint-best defensive record in the league and Genoa's poor attack give the combination a clear basis, with the main risks a 1–0 result and a rotated eleven. Malen's suspension is confirmed, and the lineup after Wednesday's tie is the detail to check. That keeps Roma to win plus over 1.5 goals at 1.58 as the position.",
  teamNews: `${newsIntro("Team news for Roma against Genoa")}

**Roma**
- **Suspended:** Donyell Malen, sent off in the 0–0 draw at Como, serves a Serie A ban in this match.
- **Out:** Mile Svilar (fracture), expected to be out for about a month, so Gollini is the projected goalkeeper. Bryan Cristante (knee) is a doubt.
- Roma play Real Madrid in the Champions League on Wednesday, so rotation is likely.

**Genoa**
- No reliable absentee list was found in the sources checked, so none are asserted. No suspensions were reported.
- Daniele De Rossi is the head coach.

**PROJECTED Roma (3-4-2-1):** Gollini; Mancini, N'Dicka or Balerdi, Hermoso; Molina, Koné, De Roon or Pisilli, Wesley; Dybala or Soulé, Pellegrini or Mora; Castro.

**PROJECTED Genoa (4-4-2):** Bijlow; Ehizibue, Marcandalli, Østigård, Vásquez; Ellertsson, Frendrup, Traoré or Baldanzi, El Shaarawy; Messias or Vitinha, Osmajić.`,
  core: venueSplitCore("serie-a", "Roma", "Genoa"),
  sources: [
    serieATable,
    fantaMaster,
    { name: "Reuters — Lazio keep pace as top 10-man Roma earn draw at Como (11 October 2026)", url: "https://www.reuters.com/sports/soccer/lazio-keep-pace-top-10-man-roma-earn-draw-como-milan-held-by-sassuolo-2026-10-11/" },
    { name: "Voce Giallorossa — Malen salta Roma-Genoa", url: "https://www.vocegiallorossa.it/altre-notizie/malen-salta-roma-genoa-285570" },
    { name: "Calcio Genoa — Roma-Genoa, probabili formazioni (13 October 2026)", url: "https://www.calciogenoa.it/2026/10/13/roma-genoa-probabili-formazioni-e-dove-vederla-in-tv/" },
    { name: "Sport Mole — Roma vs Real Madrid preview (Roma injuries and form)", url: "https://www.sportsmole.co.uk/football/roma/champions-league/preview/roma-vs-real-madrid-prediction-team-news-lineups_606745.html" },
  ],
});

export const serieARound2026_10_17 = [
  veneziaVsNapoli,
  bolognaVsInter,
  romaVsGenoa,
];
