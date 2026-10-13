import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";
import { venueSplitCore } from "../../editorial-tools/psp-import-12/venue-split-core";

// Source: PSP 12-analyses football publication package (Premier League, La Liga and Serie A,
// 17 October 2026). Predictions, odds and FREE/BEST BET/PRIME VIP labels are taken from the package
// unchanged. Fixture identity, kick-off times and venues were checked against the Premier League's
// published Matchweek 7 schedule; team news, form and standings were refreshed on 13 October 2026.
// Where the package contained a statement that current sources contradict, the sourced fact is used
// and the change is recorded in the article's sources.
const pl = {
  league: "premier-league" as const,
  competition: "Premier League — 2026/27",
  round: "Matchweek 7",
  date: "2026-10-17",
  publishedAt: "2026-10-13T08:30:00.000-03:00",
  updatedAt: "2026-10-13T08:30:00.000-03:00",
  oddsSource: "Editor-supplied PSP 12-analyses publication package (13 October 2026)",
};
const england = { addressCountry: "England" };
const plSchedule = { name: "Premier League — all 380 fixtures for 2026/27", url: "https://www.premierleague.com/en/news/4675097/all-380-fixtures-for-202627-premier-league-season" };
const plTable = { name: "Wikipedia — 2026–27 Premier League (table, results grid and managers, 12 October 2026)", url: "https://en.wikipedia.org/wiki/2026%E2%80%9327_Premier_League" };
const newsIntro = (fixture: string) => `${fixture} follows Squawka's Matchweek 7 previews, club and press reports from 10 to 13 October 2026, and the league's own fixture list. It is four days before kick-off, so every lineup is PROJECTED and the official teamsheets, released about an hour before the game, will settle it.`;

const evertonVsChelsea = createPspImport26Prediction({
  ...pl,
  slug: "everton-vs-chelsea",
  home: "Everton",
  away: "Chelsea",
  time: "12:30",
  venue: "Hill Dickinson Stadium, Liverpool",
  venueAddress: { addressLocality: "Liverpool", ...england },
  pick: "Chelsea Double Chance (X2) + Over 1.5 Goals",
  odds: 1.67,
  access: "vip",
  teaser: "Everton are unbeaten in six at home and away, while Chelsea have swung between a 5–1 win and a 3–0 defeat. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Everton's run of draws meets Chelsea's goal-heavy volatility",
  matchAnalysis: [
    "Everton are fifth with **10 points** from six games, still unbeaten after two wins and four draws, and the pattern is stubborn: they have drawn four of their last five, including a 2–2 at Hull on Sunday and a 2–2 against Manchester United at home, with a 1–0 win over Ipswich the only victory in that stretch. David Moyes's side has been hard to beat at the new Hill Dickinson Stadium, with two wins and a draw from three home games and two clean sheets. Vitalii Mykolenko is the one doubt reported on their side.",
    "Chelsea are sixth, also on 10 points, and their results swing sharply. Xabi Alonso's team beat Bournemouth **5–1** at home on Saturday and Brighton 4–3 the week before, but lost 3–0 at Brentford and 2–1 at Arsenal, and all three of their away games have produced at least three goals. They travel without Jamie Gittens (ankle/foot), Reece James and Emmanuel Emegha, while João Pedro, Cole Palmer and Morgan Rogers have scored 11 goals between them. Chelsea have won one of three on the road, with four goals scored and seven conceded.",
  ],
  tactical: "Squawka's projection sets Chelsea's back three of Colwill, Lacroix and Acheampong behind a midfield of Caicedo and Henderson, with Palmer and Rogers supporting João Pedro, against an Everton 4-2-3-1 in which Armstrong and Garner hold the middle and Grealish, Dewsbury-Hall and Johnson feed Thierno Barry. Everton's aim is to turn set pieces and second balls into pressure, and they have kept two clean sheets in three home games, while Chelsea's wing-backs will push high and leave room behind them. An Everton goal first would test a Chelsea side that has conceded seven in three away games, and a Chelsea goal first would push the home side out of the low-event pattern of their recent draws.",
  risk: "The double chance fails only if Everton win, and a team unbeaten in six at home and away is a realistic candidate, especially as Chelsea have lost two of their three away games and conceded seven in them. The goals leg is the surer half, but a goalless draw, an unlikely result given Chelsea's away games, would defeat it, as would a narrow 1–0 either way.",
  market: "The combination at **1.67** has a raw implied probability of **59.88%** (1 / 1.67). **All three** of Chelsea's road matches have cleared 1.5 goals, so the goals leg is well supported; the double chance leg is less so, because Chelsea have lost two of those three and Everton are unbeaten and have not lost at home. The value case is the goals line, which is a low threshold for two attacks of this quality.",
  conclusion: "Everton's draws and Chelsea's open away games make two goals the likeliest part of the combination, while the double chance leans on Chelsea's quality against a home side that rarely loses. Gittens, James and Emegha are out for Chelsea and Mykolenko is a doubt for Everton, and the final lineups will clarify both. The selection therefore remains Chelsea Double Chance (X2) plus over 1.5 goals at 1.67.",
  teamNews: `${newsIntro("Team news for Everton against Chelsea")}

**Everton**
- **Doubtful:** Vitalii Mykolenko. No other absences or suspensions were reported.
- David Moyes's side drew 2–2 at Hull on Sunday and are unbeaten after six league games.

**Chelsea**
- **Out:** Jamie Gittens (ankle/foot), Reece James and Emmanuel Emegha.
- No suspensions were reported. Xabi Alonso's side beat Bournemouth 5–1 on Saturday.

**PROJECTED Everton (4-2-3-1):** Pickford; Branthwaite, Keane, Tarkowski, Maitland-Niles; Armstrong, Garner; Grealish, Dewsbury-Hall, Johnson; Barry.

**PROJECTED Chelsea (3-4-2-1):** Martínez; Colwill, Lacroix, Acheampong; Chavarria, Caicedo, Henderson, Neto; Rogers, Palmer; João Pedro.`,
  core: venueSplitCore("premier-league", "Everton", "Chelsea"),
  sources: [
    plSchedule,
    plTable,
    { name: "Squawka — Everton vs Chelsea preview (Matchweek 7)", url: "https://www.squawka.com/us/news/premier-league/match-preview-everton-vs-chelsea-17-10-26-premier-league/" },
    { name: "The Guardian — Premier League talking points (12 October 2026)", url: "https://www.theguardian.com/football/2026/oct/12/premier-league-10-talking-points-from-the-weekends-action" },
  ],
});

const brentfordVsLiverpool = createPspImport26Prediction({
  ...pl,
  slug: "brentford-vs-liverpool",
  home: "Brentford",
  away: "Liverpool",
  time: "15:00",
  venue: "Gtech Community Stadium, London",
  venueAddress: { addressLocality: "London", ...england },
  pick: "Over 2.5 Goals",
  odds: 1.58,
  access: "vip",
  teaser: "Brentford's home games have been low in risk but rich in goals, while Liverpool arrive with injuries, a suspension and a 3–0 defeat to explain. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Brentford's goal-heavy home form meets a bruised Liverpool",
  matchAnalysis: [
    "Liverpool arrive after a **3–0 home defeat to Manchester City** on Sunday in which Ryan Gravenberch was sent off, a result that exposed how easily their press can be bypassed. Andoni Iraola's side are ninth with 9 points, having won twice, drawn three times and lost once, and they play LASK on Wednesday before this trip. The squad news is poor: Gravenberch is suspended for this league game, Hugo Ekitiké, Conor Bradley and Giovanni Leoni are out, and Cody Gakpo, Alexander Isak and Dominik Szoboszlai all carry knocks. Away from Anfield they have two wins and a draw from three, scoring five and conceding two.",
    "Brentford are fourth on 10 points and unbeaten, with two wins and four draws, 12 goals scored and six conceded, an average of **three goals a game** across their league matches. Keith Andrews's team beat Chelsea 3–0 at home, drew 2–2 at Aston Villa on Saturday, and have scored seven and conceded one in three home games. Joshua Dasilva, Antoni Milambo and Kaye Furo are out, and Mikkel Damsgaard, Jannik Schuster, Nathan Collins and Kevin Schade are fitness doubts, so the back line may be rebuilt even as Vitaly Janelt, Keane Lewis-Potter and Igor Thiago carry the attack.",
  ],
  tactical: "Brentford play for second balls, crosses and quick attacks, and their projected 4-2-3-1 gives Lewis-Potter and Schade the wide space to attack a Liverpool back four of Kerkez, Van Dijk, Jacquet and Araújo that has been exposed in transitions in the City defeat. Liverpool's route is Florian Wirtz between the lines with Mac Allister behind him, and Barcola and Muñoz stretching the pitch against a compact block. With Gravenberch suspended, Liverpool lose a starter in central midfield, which gives Brentford more room to counter. Whoever scores first changes the tempo: an early Liverpool goal brings Brentford forward, and an early Brentford goal tests a Liverpool side that has conceded seven in six league games.",
  risk: "Three goals are needed, and neither team's venue split makes that automatic: Brentford's home games average 2.67 goals but only two of three went over 2.5, and Liverpool's three away games produced only one over. A controlled 1–0 or 1–1 would end the bet, and Liverpool's recent clean-sheet win at Bournemouth and goalless draw with Fulham show they can play without scoring.",
  market: "Converted to a raw implied probability, **1.58** is **63.29%** (1 / 1.58) before the bookmaker's margin. Brentford's league games average **3.00** goals and Liverpool's 2.33, so the blended average sits above the line, but a low sample and Liverpool's mixed away record mean the price is fair rather than generous. The value rests on Brentford's open home matches and on Liverpool's weakened midfield.",
  conclusion: "Brentford's attack and Liverpool's problems in midfield make three goals plausible, especially with both lineups changed by injuries. The confirmed lineup, particularly whether Isak and Gakpo start for Liverpool and who replaces Gravenberch, is the key detail. With that caveat in mind, over 2.5 goals at 1.58 remains the call.",
  teamNews: `${newsIntro("Team news for Brentford against Liverpool")}

**Brentford**
- **Out:** Joshua Dasilva, Antoni Milambo and Kaye Furo.
- **Doubtful:** Mikkel Damsgaard, Jannik Schuster, Nathan Collins and Kevin Schade, described as touch-and-go.
- Vitaly Janelt, Keane Lewis-Potter and Igor Thiago are expected to carry the attack.

**Liverpool**
- **Suspended:** Ryan Gravenberch, after his red card against Manchester City. He is eligible for Wednesday's Champions League game at LASK.
- **Out:** Hugo Ekitiké, Conor Bradley and Giovanni Leoni.
- **Knocks:** Cody Gakpo, Alexander Isak and Dominik Szoboszlai, who were all doubtful for Wednesday and have not been confirmed fit.

**PROJECTED Brentford (4-2-3-1):** Kelleher; Diouf, Ajer, Schuster, Kayode; Janelt, Yarmoliuk; Schade, Lewis-Potter, Anthony; Igor Thiago.

**PROJECTED Liverpool (4-2-3-1):** Alisson; Kerkez, Van Dijk, Jacquet, Araújo; Mac Allister and a replacement for Gravenberch; Barcola, Wirtz, Muñoz; Koumas. Squawka's projection still lists Gravenberch, who is suspended.`,
  core: venueSplitCore("premier-league", "Brentford", "Liverpool"),
  sources: [
    plSchedule,
    plTable,
    { name: "Squawka — Brentford vs Liverpool preview (Matchweek 7)", url: "https://www.squawka.com/us/news/premier-league/match-preview-brentford-vs-liverpool-17-10-26-premier-league/" },
    { name: "Brentford FC — Gtech naming rights partnership", url: "https://www.brentfordfc.com/en/news/article/gtech-announced-as-stadium-naming-rights-partner" },
  ],
});

const fulhamVsHullCity = createPspImport26Prediction({
  ...pl,
  slug: "fulham-vs-hull-city",
  home: "Fulham",
  away: "Hull City",
  time: "15:00",
  venue: "Craven Cottage, London",
  venueAddress: { addressLocality: "London", ...england },
  pick: "Fulham to Win",
  odds: 1.7,
  access: "vip",
  teaser: "Fulham are bottom of the table without a win, while Hull have settled into the top half. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Winless Fulham host a Hull side that has settled in the top half",
  matchAnalysis: [
    "Fulham are the sharpest contrast in Matchweek 7: **20th with 2 points** from six games, no win, and a record of two draws and four defeats. The latest was a 2–1 defeat at Ipswich on Saturday, and Álvaro Arbeloa, who took over in July, has seen his side lose 2–3 to Crystal Palace at home and 1–0 at Sunderland as well as draw 1–1 with Manchester United and 0–0 at Liverpool. At Craven Cottage the split is three games, no wins, one draw and two defeats, with five goals scored and seven conceded and goals at both ends in all three. Antonee Robinson (ankle/foot) and Tom Cairney (knee) are fitness doubts, and Joshua King, with two goals from 14 shots, has led the line.",
    "Hull City are not the struggling newcomer the table might suggest. Sergej Jakirović's side are eighth with **9 points**, having drawn 2–2 at Chelsea and at home to Everton, 0–0 with Aston Villa, and beaten Coventry 1–0 away, with only the 2–1 defeat at Newcastle as a loss. Away from home they have won one, drawn one and lost one, scoring four and conceding four. Jack Butland, Eliot Matazo, Darko Gyabi, Ilyas Ansah, Matt Targett and Charlie Hughes are out, which strips depth, and Mohamed Belloumi, with three goals and two assists, is the player Fulham most need to contain.",
  ],
  tactical: "Fulham's projected 4-2-3-1 asks Charles and Berge to protect the back four while Iwobi, King and Bobb support Gonzalo García, against a Hull 5-4-1 that is built to stay compact and counter, with Belloumi the creative outlet and McBurnie the target. If Fulham take the lead, the pressure on Hull's five-man defence to hold shape is considerable, whereas an early Hull goal would reinforce a game in which Fulham's lack of confidence is the issue. Hull's absence list weakens their bench, so a long period of home pressure is the likeliest route to a Fulham win.",
  risk: "The main risk to the selection is Fulham themselves: a winless side at the bottom of the table, with a home split that has produced two defeats in three, is a difficult team to price as a 1.70 favourite. Hull's recent draws show how often a compact visitor takes a point, and a 1–1 draw, a result Fulham have already taken twice this season, loses the bet.",
  market: "Taking **1.70** at face value gives a raw implied probability of **58.82%** (1 / 1.70). That is a favourite's price for a team that has not won in six, so the market is leaning on class and a gentle fixture rather than on form. The case for value is that Hull are missing six players, but it rests on a bounce for Fulham that the results have not yet shown.",
  conclusion: "Fulham are a difficult team to back on form, and the selection depends on home pressure against a depleted Hull squad turning into a first win. Robinson's and Cairney's fitness are the details to confirm in the teamsheet. Nothing in the latest news changes the selection: Fulham to win at 1.70, though the risk of a draw is real.",
  teamNews: `${newsIntro("Team news for Fulham against Hull City")}

**Fulham**
- **Doubtful:** Antonee Robinson (ankle/foot) and Tom Cairney (knee).
- Manager Álvaro Arbeloa has been in charge since July. No suspensions were reported.

**Hull City**
- **Out:** Jack Butland, Eliot Matazo, Darko Gyabi, Ilyas Ansah, Matt Targett and Charlie Hughes.
- No suspensions were reported. Hull drew 2–2 at home to Everton on Sunday.

**PROJECTED Fulham (4-2-3-1):** Leno; Sessegnon, Bassey, Affengruber, Tete; S. Charles, Berge; Iwobi, King, Bobb; Gonzalo García.

**PROJECTED Hull City (5-4-1):** Tzolakis; Giles, Mendy, Egan, Ajayi, Coyle; Thomas, Slater, Crooks, Gelhardt; McBurnie.`,
  core: venueSplitCore("premier-league", "Fulham", "Hull City"),
  sources: [
    plSchedule,
    plTable,
    { name: "Squawka — Fulham vs Hull City preview (Matchweek 7)", url: "https://www.squawka.com/us/news/premier-league/match-preview-fulham-vs-hull-city-17-10-26-premier-league/" },
  ],
});

const manchesterCityVsIpswichTown = createPspImport26Prediction({
  ...pl,
  slug: "manchester-city-vs-ipswich-town",
  home: "Manchester City",
  away: "Ipswich Town",
  time: "15:00",
  venue: "Etihad Stadium, Manchester",
  venueAddress: { addressLocality: "Manchester", ...england },
  pick: "Manchester City -1.5 Asian Handicap",
  odds: 1.6,
  access: "vip",
  teaser: "City arrive perfect after six games and a 3–0 win at Liverpool, but this price needs a two-goal margin on the back of a Champions League night. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "City's perfect start meets the stricter demand of a two-goal handicap",
  matchAnalysis: [
    "Manchester City lead the table with **18 points** from six wins and a goal difference of +11, having scored 16 and conceded five. Enzo Maresca's side won 3–0 at Anfield on Sunday, 5–3 at home against Sunderland and 1–0 at Manchester United, and have kept five clean sheets this season. Their home split, however, is a reminder that the handicap is not automatic: three home wins by 5–3, 2–1 and 1–0, so only one of three has been by two goals or more. They play Paris Saint-Germain on Wednesday and AEK Athens the following Tuesday, and Squawka reports no fitness concerns.",
    "Ipswich Town, under Gary O'Neil, are 10th with three wins and three defeats. They won 2–1 at home against Fulham on Saturday, 3–2 at Crystal Palace, and lost 5–2 at Manchester United, 2–0 at home to Liverpool and 1–0 at Everton. Away from Portman Road they have won one of three, scoring five and conceding eight, so they give up chances, but they also score, which is why a 2–1 City win loses this handicap. Issahaku Fatawu is suspended, leaving Jack Clarke and Zian Flemming to carry more of the attack behind the striker Emersonn.",
  ],
  tactical: "City's projected 4-2-3-1 has Haaland supported by Semenyo, Cherki and Ndiaye with Fernández and Anderson in midfield, which is a front line designed to overwhelm a visitor that wants to stay in the game. Ipswich's 4-2-3-1 will use Philogene and Enciso behind Emersonn to run in behind, and a defensive line that concedes 2.67 away goals per game. An early City goal would turn the game into the type that favours a handicap, with Ipswich forced to open up, while a scoreless first half would raise the chance of City managing the game with Wednesday's PSG tie in mind.",
  risk: "A handicap of -1.5 asks for two goals of margin, and City's three home wins have produced just one such margin. Rotation after the PSG game is also possible, and Ipswich have scored in three of their last five league games, so a 2–1 City win would lose. The risk is a controlled one-goal win rather than a defeat.",
  market: "The market price of **1.60** corresponds to a raw implied probability of **62.50%** (1 / 1.60). City's strength supports a short price, but the home margin record and a congested week argue that the market is already pricing in a convincing win, so the value is thin and depends on City converting the quality gap into a two-goal lead.",
  conclusion: "City's form and Ipswich's open away games make a multiple-goal win a reasonable expectation, but the handicap leaves little room. The confirmed lineup after the PSG game, particularly Haaland and Cherki, will shape it. Manchester City -1.5 on the Asian handicap at 1.60 therefore stands.",
  teamNews: `${newsIntro("Team news for Manchester City against Ipswich Town")}

**Manchester City**
- No fitness concerns were reported by Squawka. City play Paris Saint-Germain in the Champions League on Wednesday, so rotation is possible.
- No suspensions were reported.

**Ipswich Town**
- **Suspended:** Issahaku Fatawu. Jack Clarke and Zian Flemming are expected to carry more of the attacking load behind the striker Emersonn.

**PROJECTED Manchester City (4-2-3-1):** Donnarumma; O'Reilly, Guéhi, Rúben Dias, Matheus Nunes; Enzo Fernández, Anderson; Semenyo, Cherki, Ndiaye; Haaland.

**PROJECTED Ipswich Town (4-2-3-1):** Walton; Davis, O'Shea, Diop, Ouattara; Florentino, Lukic; Philogene, Enciso, Maeda; Emersonn.`,
  core: venueSplitCore("premier-league", "Manchester City", "Ipswich Town"),
  sources: [
    plSchedule,
    plTable,
    { name: "Squawka — Manchester City vs Ipswich Town preview (Matchweek 7)", url: "https://www.squawka.com/us/news/premier-league/match-preview-manchester-city-vs-ipswich-town-17-10-26-premier-league/" },
    { name: "RotoWire — Manchester City vs PSG preview (City fixture list and recent results)", url: "https://www.rotowire.com/soccer/article/manchester-city-vs-psg-prediction-predicted-lineups-team-news-140682" },
  ],
});

const newcastleUnitedVsAstonVilla = createPspImport26Prediction({
  ...pl,
  slug: "newcastle-united-vs-aston-villa",
  home: "Newcastle United",
  away: "Aston Villa",
  time: "17:30",
  venue: "St James' Park, Newcastle upon Tyne",
  venueAddress: { addressLocality: "Newcastle upon Tyne", ...england },
  pick: "Over 2.5 Goals",
  odds: 1.62,
  access: "vip",
  teaser: "Newcastle's home games have been open at both ends, and the hosts come off a 4–1 defeat at Coventry. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Newcastle's goal-heavy home games meet a Villa side with a Champions League night in between",
  matchAnalysis: [
    "Newcastle are 11th with **8 points** and need a response after losing 4–1 at Coventry on Monday, their second 4–1 defeat on the road after Leeds. Matthias Jaissle apologised to the travelling fans, and the penalty conceded after six minutes and Joelinton's loss of possession for the third goal summed up the problems, although Joelinton's first appearance since May and Nico González's return from concussion are positives. At St James' Park the picture is different: one win and two draws from three, six goals scored and five conceded, with **all three** home games finishing over 2.5 goals and goals at both ends every time.",
    "Aston Villa are 16th on 5 points, with one win, two draws and three defeats and a goal difference of −5. Unai Emery's side drew 2–2 at home with Brentford on Saturday and play Fenerbahçe in the Champions League on Wednesday, so Saturday's trip comes at the end of a busy week with a squad missing Amadou Onana, Ian Maatsen, Modou Cissé, Leon Goretzka and Matteo Ruggeri, and with Brian Madjo and George Hemmings doubtful. Their away split is a win, a draw and a defeat from three, scoring three and conceding six, with two of three over 2.5 goals.",
  ],
  tactical: "Newcastle's four-man defence of Hall, Botman, Thiaw and Miley was opened four times at Coventry, and Villa's quality in transition through Jackson, McGinn, Manzambi and Buendía is the sort of threat that exploits that. Newcastle's route is direct running by Barnes, Murphy and Wissa and balls into the box, which creates chances but also leaves space. The Wednesday game and a thin Villa squad could cut both ways: a tired team may be slower to press, which would give Newcastle room, or may sit deeper and limit the game. A first-half goal for either side should open a match that has been open at both ends.",
  risk: "Villa's priorities are split with a Champions League night just before this game, and Emery could manage minutes and shape in a way that reduces tempo. Newcastle might also respond to the Coventry defeat by tightening their shape, and a controlled 1–1 or a 2–0 result would leave the line short.",
  market: "At **1.62** the over carries a raw implied probability of **61.73%** (1 / 1.62). Newcastle's home games have all cleared the line, and Villa's away games have done so two times in three, so the price sits below the recent venue frequencies. The value is a modest one, resting on a home side whose games are open and a visitor with defensive absentees.",
  conclusion: "Newcastle's home matches have been open every time and Villa's defence is missing several players, which supports three goals. The main variable is how Villa's Wednesday game and Newcastle's reaction to Coventry shape the lineups. On balance, over 2.5 goals at 1.62 still reads as the better side of the argument.",
  teamNews: `${newsIntro("Team news for Newcastle United against Aston Villa")}

**Newcastle United**
- **Reported out:** Ewen Jaouen and Valentino Livramento, according to Squawka's preview. Squawka also lists Jacob Ramsey, Anthony Elanga, Dan Burn, Amar Dedić, Lewis Miley and William Osula as doubts, but Burn, Dedić, Miley and Osula all played at Coventry on Monday, so that list needs checking.
- **Back:** Joelinton made his first competitive appearance since May at Coventry, and Nico González returned from concussion.

**Aston Villa**
- **Out:** Amadou Onana, Ian Maatsen, Modou Cissé, Leon Goretzka and Matteo Ruggeri, according to Squawka.
- **Doubtful:** Brian Madjo and George Hemmings.
- Villa play Fenerbahçe on Wednesday, so rotation is likely. No suspensions were reported.

**PROJECTED Newcastle United (4-2-3-1):** Hornicek; Hall, Botman, Thiaw, Miley; Willock, Nico González; Barnes, Wissa, Murphy; Fernandez-Pardo. This is the eleven that started at Coventry.

**PROJECTED Aston Villa (4-2-3-1):** Suzuki; Cash, Mings, Lindelöf, Wan-Bissaka; João Gomes, Kamara; Manzambi, Buendía, McGinn; Jackson. Squawka's version lists Ruggeri at left-back despite his reported absence, so the left-back slot is adjusted here.`,
  core: venueSplitCore("premier-league", "Newcastle United", "Aston Villa"),
  sources: [
    plSchedule,
    plTable,
    { name: "Squawka — Newcastle United vs Aston Villa preview (Matchweek 7)", url: "https://www.squawka.com/us/news/premier-league/match-preview-newcastle-vs-aston-villa-17-10-26-premier-league/" },
    { name: "Newcastle United — Coventry City 4 Newcastle United 1 (match report, 12 October 2026)", url: "https://www.newcastleunited.com/en/news/coventry-city-a-26-27-report" },
    { name: "Sky Sports — Coventry 4-1 Newcastle report", url: "https://www.skysports.com/football/coventry-city-vs-newcastle-united/report/559497" },
  ],
});

export const premierLeagueRound2026_10_17 = [
  evertonVsChelsea,
  brentfordVsLiverpool,
  fulhamVsHullCity,
  manchesterCityVsIpswichTown,
  newcastleUnitedVsAstonVilla,
];
