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
  league: "brasileirao-serie-a" as const,
  competition: "Brazilian Série A",
  round: "Round 31",
  publishedAt: "2026-10-14T09:00:00.000-03:00",
  updatedAt: "2026-10-14T09:00:00.000-03:00",
  oddsSource: "Editor-supplied PSP 33-analyses publication package (14 October 2026)",
};

const m_botafogo_vs_chapecoense = createPspImport26Prediction({
  ...base,
  slug: "botafogo-vs-chapecoense",
  home: "Botafogo",
  away: "Chapecoense",
  date: "2026-10-17",
  time: "18:00",
  venue: "Estádio Nilton Santos",
  venueAddress: { addressLocality: "Rio de Janeiro", addressCountry: "Brazil" },
  pick: "Botafogo Win",
  odds: 1.4,
  access: "vip",
  bestAnalysis: true,
  teaser: "Botafogo are 13th and need home points, while bottom-placed Chapecoense arrive after a 4-1 defeat to Athletico-PR. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Botafogo at home against the league's bottom side",
  matchAnalysis: [
    "Botafogo return to Nilton Santos after a 1-1 draw at Coritiba, while Chapecoense are coming off a damaging 4-1 home defeat to Athletico-PR. The gap in momentum is important, but the bigger angle is territorial control: Botafogo should spend more time in the final third and can force Chapecoense into long defensive spells. That profile suits the straight home win, provided the hosts turn possession into clear chances rather than sterile pressure. Botafogo sit **13th on 36 points** after Round 30, still close enough to the relegation fight that home points matter. Chapecoense's 4-1 loss to Athletico-PR was one of the round's heaviest defeats and increased the pressure on their defensive unit."
  ],
  tactical: "The price is short enough that efficiency matters. Chapecoense can still threaten in transition, especially if Botafogo's full-backs push simultaneously, but their latest defensive performance offers little margin for another extended period without the ball. The home side do not need a high-scoring game for this selection; a patient 1-0 or 2-0 is enough.",
  risk: "The main risk is Botafogo controlling the ball without creating enough high-quality shots. A low block and an early Chapecoense counter would make a short-priced home win uncomfortable.",
  market: "At **1.40** the raw implied probability is **71.43%** (1 / 1.40), so the bet needs Botafogo to win roughly seven times in ten. Botafogo's home record of five wins, six draws and four defeats from 15 games is modest for a favourite this short, but Chapecoense have taken **one win and four draws from 15 away games** and conceded 28 goals on the road. The gap between 13th and 20th is the reason the price is justified; the thin value comes from the six home draws, which show that control does not always become a win.",
  conclusion: "Chapecoense's away record and their heavy defeat in Chapecó give Botafogo the clearer route, although the hosts have drawn too often at Nilton Santos to treat the win as automatic. If Botafogo turn territory into early chances, Botafogo Win at 1.40 remains the position.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Botafogo have been managing defensive availability: Lucas Monzón has been dealing with a calf problem and Arthur Chaves with a knock, while Álvaro Montoro has returned to the selection picture. Fernando served a suspension in the previous round, while Dudu, Heitor, Max, Rafael Carvalheira, Robert and Vinícius Balieiro have recently been on Chapecoense's injury list. Any late recovery would mainly affect the visitors' depth rather than the core tactical approach.\n\n**PROJECTED setup:** Botafogo are expected to keep Gabriel Batista in goal, with Vitinho/Ponte and Alex Telles providing width and Arthur Cabral leading the attack; Allan/Danilo and Medina are options for the central midfield structure. Chapecoense's recent setup was built around Anderson; Bruno Tubarão, Eduardo Doma and Bruno Pacheco in the back line; Camilo, Yago Felipe and Giovanni Augusto in midfield; and Marcinho/Garcez in the front unit.",
  core: espnVenueSplitCore("brasileirao-serie-a", "Botafogo", "Chapecoense"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "CBF — Brazilian Série A",
      "url": "https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a"
    },
    {
      "name": "ge — Brazilian football team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

const m_atletico_mg_vs_coritiba = createPspImport26Prediction({
  ...base,
  slug: "atletico-mg-vs-coritiba",
  home: "Atlético-MG",
  away: "Coritiba",
  date: "2026-10-17",
  time: "18:30",
  venue: "Arena MRV",
  venueAddress: { addressLocality: "Belo Horizonte", addressCountry: "Brazil" },
  pick: "Over 1.5 Goals + Over 8.5 Corners",
  odds: 1.6,
  access: "vip",
  teaser: "Atlético-MG beat Santos with a late comeback, while Coritiba arrive from a 1-1 draw at Botafogo with 28 goals conceded on the road. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Atlético-MG's home attack against Coritiba's open away games",
  matchAnalysis: [
    "Atlético-MG's late 2-1 comeback against Santos reinforced how much pressure they can generate at Arena MRV. Coritiba were more conservative in a 1-1 draw with Botafogo, so this combined market needs two different things from the match: enough attacking volume for two goals and enough wide pressure for nine corners. Atlético-MG entered this round after beating Santos 2-1 and are the second-best team of the Brasileirão's second half behind Flamengo. Coritiba's 1-1 draw with Botafogo showed more resistance but did not remove the need to improve away from home."
  ],
  tactical: "Atlético's best route is to pin Coritiba back, attack the outside channels and force blocks and clearances. Coritiba can contribute to both legs through counters and set pieces if they avoid being trapped too deep. The goals threshold is modest; the corner line is the more volatile part of the selection and becomes vulnerable if Atlético score early and then slow the game.",
  risk: "A narrow 1-0 with few attacking phases from Coritiba can kill both parts of the combination, especially the corner requirement.",
  market: "At **1.60** the raw implied probability is **62.50%** (1 / 1.60) for the combination. The goals leg is well supported: **12 of Atlético-MG's 15 home games and 12 of Coritiba's 15 away games** have reached two goals, and Coritiba have conceded 28 on the road. Corner counts were not available from the sources used, so the second leg rests on Atlético's wide play and cannot be priced from data; it is the part of the bet that carries the real risk, and the value is moderate rather than generous.",
  conclusion: "Both teams regularly produce two goals, and Atlético's pressure down the flanks gives the corner line a plausible route, even if an early goal followed by a controlled second half would hurt it. With that caveat, Over 1.5 Goals + Over 8.5 Corners at 1.60 stays as the call.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Atlético have recently had Everson, Cassierra, Scarpa and Ruan managed through physical issues. Cuello and Tomás Pérez missed the previous round through suspension and are eligible to return, adding options for width and midfield rotation. Coritiba have no comparably significant confirmed suspension shaping the matchup at this stage.\n\n**PROJECTED setup:** Atlético's recent shape has featured Gabriel Delfim behind Natanael, Vitor Hugo, Léo Duarte and Pascini, with Alan Franco/Cissé/Castaño supplying the midfield platform and Igor Gomes linking to Minda and Borbas. Any return of Cuello or Tomás Pérez would increase the options for width and ball progression.",
  core: espnVenueSplitCore("brasileirao-serie-a", "Atlético-MG", "Coritiba"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "CBF — second-half form",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/flamengo-e-o-melhor-time-do-2-turno-do-brasileirao-2026-seguido-pelo-atletico-mg"
    },
    {
      "name": "ge — team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

const m_athletico_pr_vs_palmeiras = createPspImport26Prediction({
  ...base,
  slug: "athletico-pr-vs-palmeiras",
  home: "Athletico-PR",
  away: "Palmeiras",
  date: "2026-10-17",
  time: "19:30",
  venue: "Arena da Baixada",
  venueAddress: { addressLocality: "Curitiba", addressCountry: "Brazil" },
  pick: "X2 + Under 3.5 Goals",
  odds: 1.81,
  access: "vip",
  teaser: "Athletico-PR are third after a 4-1 away win and Palmeiras sit one point off the lead after a 4-1 derby win, so both arrive scoring freely. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Palmeiras' away resilience against Athletico's home attack",
  matchAnalysis: [
    "Athletico-PR arrive with real confidence after a 4-1 away win at Chapecoense, while Palmeiras answered with a 4-1 derby victory over Corinthians. The X2 leg leans on Palmeiras' ability to survive difficult phases and avoid defeat even when the home side raise the tempo. The under 3.5 is a separate judgment: despite the latest scorelines, this fixture can become more controlled once the first pressing wave settles. Athletico-PR climbed to third with **53 points** after Round 30. Palmeiras are second on 63, only one point behind leaders Flamengo, so the title race leaves little room for a low-intensity performance."
  ],
  tactical: "Athletico are dangerous in transition and should not be treated as a passive home side. Palmeiras, however, have more ways to manage the game through possession and midfield control. A 1-1 draw or 1-2 away win fits the selection; the obvious danger is another early exchange of goals that turns the match into the same kind of open game both teams produced last weekend.",
  risk: "The under 3.5 is the fragile leg. Both teams scored four in the previous round, so an early goal can quickly change the match from controlled to transitional.",
  market: "At **1.81** the raw implied probability is **55.25%** (1 / 1.81). Palmeiras have avoided defeat in **13 of 15 away games** (seven wins, six draws) and conceded only 12 goals on the road, which supports the double chance, while only 4 of Athletico's 15 home games and 5 of Palmeiras' 15 away games have passed 3.5 goals. The cap is therefore backed by frequency even after last weekend's two 4-1 scorelines. Two legs must land together, so the value is fair rather than generous.",
  conclusion: "Palmeiras' away record and midfield control make the double chance sound, and the under 3.5 is a reasonable cap if the first pressing wave passes without an early exchange of goals. Vitor Roque's status and the title race are the details to watch. X2 + Under 3.5 Goals at 1.81 remains the position.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Athletico coach Odair Hellmann is available to return to the technical area after serving his suspension. Palmeiras are monitoring Vitor Roque after an ankle sprain kept him out of the Libertadores delegation; his status materially affects how direct the visitors can be through the middle.\n\n**PROJECTED setup:** Palmeiras are expected to retain the usual defensive core around Gustavo Gómez, Murilo and Piquerez, with Marlon Freitas/Lucas Evangelista/Andreas competing for midfield roles. If Vitor Roque is not cleared, Flaco López becomes the most natural reference point up front. Athletico should keep much of the side that produced the 4-1 win in Chapecó.",
  core: espnVenueSplitCore("brasileirao-serie-a", "Athletico-PR", "Palmeiras"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "CBF — title-race update",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/flamengo-e-o-melhor-time-do-2-turno-do-brasileirao-2026-seguido-pelo-atletico-mg"
    },
    {
      "name": "ge — team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

const m_sao_paulo_vs_vasco = createPspImport26Prediction({
  ...base,
  slug: "sao-paulo-vs-vasco",
  home: "São Paulo",
  away: "Vasco",
  date: "2026-10-17",
  time: "21:00",
  venue: "Estádio do Morumbis (Cícero Pompeu de Toledo)",
  venueAddress: { addressLocality: "São Paulo", addressCountry: "Brazil" },
  pick: "São Paulo Win",
  odds: 2.14,
  access: "vip",
  teaser: "São Paulo's home form meets a Vasco side that has drawn more away games than it has won. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "São Paulo at home against Vasco's draw-heavy road record",
  matchAnalysis: [
    "São Paulo's 2-1 win over Vitória restored some momentum before another home fixture, while Vasco come from a 0-0 draw with Remo. The case for the home win is built around initiative at MorumBIS: São Paulo can press higher, recover second balls close to goal and make Vasco defend more frequently than they did in a slower match against Remo. São Paulo won their Round 30 match 2-1; Vasco were held 0-0 at São Januário. That contrast matters more than an old head-to-head sample because both squads have changed substantially during the season."
  ],
  tactical: "The 2.14 quote correctly reflects the uncertainty. Vasco have enough technical quality to keep possession and can make this a low-event contest if São Paulo's attacking reference is limited. The hosts therefore need quick circulation and runners beyond the first line rather than relying on one striker. This is a value-oriented home selection, not a claim that the matchup is one-sided.",
  risk: "If Calleri is limited and Vasco succeed in slowing the central zones, the game can drift toward the kind of draw that makes a 2.14 home price attractive but risky.",
  market: "At **2.14** the raw implied probability is **46.73%** (1 / 2.14), so São Paulo need to win in just under half of such games. They have won **9 of 15 home games** and lost only three, while Vasco have won two of 14 away games and drawn five. That makes the home win a sensible lean at a price above evens. It is a value position more than a claim of dominance: Calleri's fitness is the main uncertainty, and Vasco's draws show how often they can neutralise a stronger home side.",
  conclusion: "São Paulo's home record and Vasco's modest road results favour the hosts, but the match is closer than a one-sided call would suggest. If Calleri is fit or the front line adapts, São Paulo Win at 2.14 is the position.",
  teamNews: "Team news is as of 14 October 2026, three days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Calleri felt thigh discomfort after scoring twice against Vitória and has been working on an adapted program, making his starting status one of the key pre-match checks. Vasco recently travelled without Cuesta, Spinelli and Rojas, while Bruno Duarte returned after a rib problem and is again part of the attacking rotation.\n\n**PROJECTED setup:** Vasco's latest continental XI used Léo Jardim; Paulo Henrique, Saldivia, Robert Renan, Cuiabano; Sosa, Thiago Mendes, Lescano; Adson, Bruno Duarte and Andrés Gómez. São Paulo's attacking structure depends on Calleri's fitness; if he is not ready for 90 minutes, the front line will need a different reference point and more support from the attacking midfielders.",
  core: espnVenueSplitCore("brasileirao-serie-a", "São Paulo", "Vasco"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "ge — São Paulo/Vasco team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "CBF — Série A",
      "url": "https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261017/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

const m_fluminense_vs_santos = createPspImport26Prediction({
  ...base,
  slug: "fluminense-vs-santos",
  home: "Fluminense",
  away: "Santos",
  date: "2026-10-18",
  time: "16:00",
  venue: "Maracanã",
  venueAddress: { addressLocality: "Rio de Janeiro", addressCountry: "Brazil" },
  pick: "X2 — Santos or Draw",
  odds: 1.77,
  access: "vip",
  teaser: "Fluminense host Santos at the Maracanã after a derby defeat, while Santos arrive with Neymar's return in doubt and a high-scoring away record. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Santos' away scoring against a Fluminense side coming off a derby defeat",
  matchAnalysis: [
    "This is a deliberately contrarian double-chance position. Fluminense have home advantage but come from a 1-0 derby defeat, while Santos lost 2-1 at Atlético-MG after conceding late. Santos do not need to dominate the ball for X2 to work; they need to stay compact, protect the centre and use Neymar and the wide runners when Fluminense push numbers forward. Santos are eighth on **42 points** in the latest table update, still close enough to the continental places to keep the fixture meaningful. Fluminense are coming off the Fla-Flu and have also had to manage minutes around their continental schedule."
  ],
  tactical: "Fluminense can still control long stretches at the Maracanã, so the visitors' defensive discipline is more important than raw possession. The draw protection is valuable because both teams have recently played tight games. Santos' route improves if Neymar is fit to start, but the midfield must cope without a suspended senior option.",
  risk: "The obvious threat is Fluminense turning sustained home pressure into an early lead; Santos then have to open up and the protection of the draw becomes much weaker.",
  market: "At **1.77** the raw implied probability is **56.50%** (1 / 1.77). The season-long frequencies argue against this pick: Fluminense have won **11 of 15 home games** and lost one, so Santos or draw is a contrarian position and the price reflects it. What supports it is Santos' open road form, with 24 goals scored and a goal in 14 of 15 away games, plus Fluminense's 1-0 defeat to Flamengo and a rotated squad. The value is a judgment about this match rather than the season.",
  conclusion: "The home record is the strongest argument against the pick, and an early Fluminense lead would make the draw cover fragile. Santos' goals on the road and Fluminense's rotation questions are why X2 — Santos or Draw at 1.77 is kept as a contrarian position rather than a comfortable one.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Willian Arão is suspended for Santos, while Neymar is expected to return to the starting XI if there is no late setback. Arthur, Gabriel Brazão and Vini Lira remain in the medical picture, and Arão has also been managing thigh discomfort. Fluminense have rotated several regulars around the Libertadores schedule, which makes recovery and final selection important.\n\n**PROJECTED setup:** Santos are likely to build around Neymar in the front line, with Rollheiser/Coutinho-type creators behind the striker and a reshuffled midfield without Arão. Fluminense should restore more first-choice players after rotation, with the exact balance between possession midfielders and runners depending on recovery from the continental game.",
  core: espnVenueSplitCore("brasileirao-serie-a", "Fluminense", "Santos"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "ge — Santos/Fluminense team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "CBF — Série A",
      "url": "https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

const m_gremio_vs_cruzeiro = createPspImport26Prediction({
  ...base,
  slug: "gremio-vs-cruzeiro",
  home: "Grêmio",
  away: "Cruzeiro",
  date: "2026-10-18",
  time: "16:00",
  venue: "Arena do Grêmio",
  venueAddress: { addressLocality: "Porto Alegre", addressCountry: "Brazil" },
  pick: "X2 + Over 1.5 Goals",
  odds: 1.8,
  access: "vip",
  teaser: "Grêmio's derby draw left them in the bottom four, while Cruzeiro arrive after conceding four at Bragantino. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Cruzeiro's attack against a Grêmio side that needs wins",
  matchAnalysis: [
    "Grêmio's 1-1 derby draw with Internacional showed resistance but left them needing wins, while Cruzeiro's 4-2 defeat to Bragantino exposed defensive space in transition. The combination asks Cruzeiro to avoid defeat and the match to reach at least two goals. That is a reasonable pairing if the visitors recover some defensive structure without losing their ability to attack quickly through Matheus Pereira and the front line. Grêmio drew 1-1 in the Grenal; Cruzeiro conceded four at Bragantino in Round 30. The visitors therefore arrive with a stronger need to correct defensive spacing than to reinvent their attacking approach."
  ],
  tactical: "Grêmio's urgency at home should prevent a passive game, and the hosts may have to alter their back line. Cruzeiro can benefit if those changes affect defensive timing. A 1-1 draw is enough for the market, while 1-2 or 0-2 also fit. The selection becomes vulnerable if Grêmio turn territorial pressure into a first-half lead and force Cruzeiro to chase.",
  risk: "Cruzeiro's 4-2 loss is the warning: another loose defensive display would make the X2 leg much harder even if the goals requirement is met quickly.",
  market: "At **1.80** the raw implied probability is **55.56%** (1 / 1.80). The goals leg is the better supported half: **13 of Cruzeiro's 15 away games** reached two goals, as did 11 of Grêmio's 15 home games. The result leg is harder, because Cruzeiro have avoided defeat in only 8 of 15 away games, so the double chance depends on the visitors repairing the spacing that Bragantino exposed. The price is fair, with the value sitting in the goals.",
  conclusion: "A competitive game at Porto Alegre should produce goals, and Cruzeiro's attack gives them a route to avoid defeat, but their defensive spacing is the concern. X2 + Over 1.5 Goals at 1.80 remains the call.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Grêmio are without Wallace, who is suspended and also undergoing nose surgery. Cruzeiro have been monitoring Lucas Romero's calf issue; Fabrício Bruno has returned to the squad and Arroyo is expected to be available again, increasing the options in both defence and the front line.\n\n**PROJECTED setup:** Cruzeiro's recent core has included Otávio; William, Jonathan Jesus, João Marcelo/Fabrício Bruno, Gabriel Rojas; Zé Lucas, Gerson, Matheus Pereira; Arroyo, Felipe Morais/Wesley and Kaio Jorge. Grêmio must reshuffle the central defence around the available centre-backs because of Wallace's absence.",
  core: espnVenueSplitCore("brasileirao-serie-a", "Grêmio", "Cruzeiro"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "ge — Grêmio/Cruzeiro team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "CBF — Série A",
      "url": "https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

const m_bahia_vs_flamengo = createPspImport26Prediction({
  ...base,
  slug: "bahia-vs-flamengo",
  home: "Bahia",
  away: "Flamengo",
  date: "2026-10-18",
  time: "18:30",
  venue: "Arena Fonte Nova",
  venueAddress: { addressLocality: "Salvador", addressCountry: "Brazil" },
  pick: "1X — Bahia or Draw",
  odds: 1.75,
  access: "vip",
  teaser: "Bahia are fifth after a narrow win over Mirassol, and league leaders Flamengo travel to Salvador with injuries and another continental fixture. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Bahia's home resilience against the league leaders",
  matchAnalysis: [
    "Bahia's 1-0 win over Mirassol lifted them back into the top-five conversation, and this 1X selection is built on their ability to make Arena Fonte Nova a difficult place for the league leaders. Flamengo are first on 64 points and have been the best team of the second half, so the case against an away win has to come from context rather than reputation: Bahia can compress central spaces, compete for second balls and make Flamengo build through wider, slower routes. Flamengo lead with **64 points**, one ahead of Palmeiras, after beating Fluminense 1-0. Bahia also won 1-0 in Round 30 and are back among the teams competing for the upper places."
  ],
  tactical: "The draw is a major part of the value. Flamengo still own the superior attacking ceiling, but their squad is carrying important absences and another continental game affects recovery. Bahia need to avoid allowing Flamengo to dictate the first 20 minutes; if the hosts settle, the market becomes much more realistic.",
  risk: "This is still a bet against the strongest second-half team in the league. If Flamengo score first, Bahia will have to open spaces that suit the visitors.",
  market: "At **1.75** the raw implied probability is **57.14%** (1 / 1.75). Bahia have lost only **2 of 15 home games** (seven wins, six draws) and conceded 14, which supports the cover, while Flamengo's away record of eight wins, four draws and three defeats shows how strong the visitors remain. The value is moderate: it rests on Bahia's home resilience and Flamengo's absences, not on any weakness in the leaders.",
  conclusion: "Bahia are hard to beat at the Fonte Nova and Flamengo are managing absences and a congested schedule, but the visitors still own the higher ceiling. An early Flamengo goal is the main way the cover fails, so 1X — Bahia or Draw at 1.75 stays as the position.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Flamengo remain without Arrascaeta after wrist surgery and have also been managing Evertton Araújo, Ayrton Lucas and Danilo. Bahia's recent side featured Ronaldo; Marcos Victor/Roman Gómez, David Duarte, Kanu/Marco Moreno, Luciano Juba; Caio Alexandre, Jean Lucas, Rodrigo Nestor; Kike Olivera, Erick Pulga and Alejo Véliz. Acevedo, suspended in the previous round, is again a selection option if fit.\n\n**PROJECTED setup:** Bahia are likely to retain their 4-3-3/4-2-3-1 hybrid around Caio Alexandre and Jean Lucas. Flamengo's expected XI depends on recovery from continental duty, with Rossi, Léo Ortiz/Léo Pereira, Pulgar and Pedro among the core pieces and the attacking-midfield roles adjusted around the unavailable players.",
  core: espnVenueSplitCore("brasileirao-serie-a", "Bahia", "Flamengo"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "CBF — second-half standings",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/flamengo-e-o-melhor-time-do-2-turno-do-brasileirao-2026-seguido-pelo-atletico-mg"
    },
    {
      "name": "ge — team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

const m_remo_vs_red_bull_bragantino = createPspImport26Prediction({
  ...base,
  slug: "remo-vs-red-bull-bragantino",
  home: "Remo",
  away: "Red Bull Bragantino",
  date: "2026-10-18",
  time: "19:30",
  venue: "Estádio Olímpico do Pará (Mangueirão)",
  venueAddress: { addressLocality: "Belém", addressCountry: "Brazil" },
  pick: "X2 + Over 1.5 Goals",
  odds: 1.71,
  access: "vip",
  teaser: "Remo held Vasco goalless in Rio, while Bragantino ended a long winless run with a 4-2 win over Cruzeiro. Full prediction, odds and analysis are available with PRIME VIP.",
  trend: "Bragantino's attacking ceiling against a compact Remo",
  matchAnalysis: [
    "Remo's 0-0 draw at Vasco showed that they can stay compact and frustrate stronger possession sides. Bragantino bring the opposite recent reference: a 4-2 win over Cruzeiro that ended a six-game winless run and pushed them to ninth on 40 points. The X2 leg follows the visitors' higher attacking ceiling, while Over 1.5 needs the match to move beyond the low-event pattern Remo produced in Rio. Bragantino's 4-2 win was their first in seven league matches and moved them to ninth with **40 points**. Remo come from a clean-sheet draw at Vasco, so the contrast is between renewed away confidence and a home side that has just shown defensive discipline."
  ],
  tactical: "Bragantino should have enough pace to create transition chances, but they cannot assume Remo will chase early. The home side are more likely to protect space and wait for set pieces. One Bragantino goal would change the shape considerably; at 0-0 deep into the game, the goals leg becomes the bigger concern.",
  risk: "The danger is a repeat of Remo's 0-0 approach. If Bragantino do not score first, the Over 1.5 leg can remain exposed for a long time.",
  market: "At **1.71** the raw implied probability is **58.48%** (1 / 1.71). Remo have won only 3 of 15 home games and lost six, which gives the double chance a clear base, and **12 of their 15 home games and 12 of Bragantino's 15 away games** reached two goals. The value is acceptable rather than generous, because Bragantino's away record of four wins, four draws and seven defeats is not dominant and Remo's 0-0 at Vasco showed they can shut a game down.",
  conclusion: "Bragantino's pace gives them the better chance of avoiding defeat and scoring, while Remo's deep block is the risk to the goals leg. X2 + Over 1.5 Goals at 1.71 remains the call.",
  teamNews: "Team news is as of 14 October 2026, four days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Remo had Galeano suspended in the previous round, so he returns to the selection pool if there is no new issue; João Lucas and Matheus Felipe have been dealing with injuries. Bragantino's recent medical list included Davi Gomes and Rodriguinho.\n\n**PROJECTED setup:** Remo's latest core used Marcelo Rangel; Marcelinho, Marllon, Zé Ivaldo, Marlon; Picco, Zé Ricardo, Vitor Bueno; Pikachu, Jajá and Taliari. Bragantino recently lined up with Tiago Volpi; Ryan, Gustavo Marques, Alix Vinícius, Juninho Capixaba; Patrick, Eric Ramires, Lucas Barbosa; Wallace Yan, Fernando and Eduardo Sasha.",
  core: espnVenueSplitCore("brasileirao-serie-a", "Remo", "Red Bull Bragantino"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "ge — Remo/Bragantino team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "CBF — Série A",
      "url": "https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261018/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

const m_corinthians_vs_vitoria = createPspImport26Prediction({
  ...base,
  slug: "corinthians-vs-vitoria",
  home: "Corinthians",
  away: "Vitória",
  date: "2026-10-19",
  time: "20:00",
  venue: "Neo Química Arena",
  venueAddress: { addressLocality: "São Paulo", addressCountry: "Brazil" },
  pick: "Corinthians Win",
  odds: 1.73,
  access: "free",
  analysisAccess: "free",
  teaser: "Corinthians start the Clarence Seedorf era at home after a heavy derby defeat, while Vitória have not won away all season. The prediction and full analysis are FREE for everyone.",
  trend: "Corinthians' home response under a new coach against winless Vitória on the road",
  matchAnalysis: [
    "Corinthians reach this match under heavy pressure after the 4-1 derby loss to Palmeiras and sit 16th on 32 points. The home win is therefore as much about urgency and a coaching reset as it is about recent form. The expected debut of Clarence Seedorf gives the fixture a different tactical context: Corinthians are likely to seek more control at home and should have Rodrigo Garro available again after serving his previous suspension, with Kaio César also back from the same ban. Corinthians are **16th with 32 points** after the heavy derby defeat. Vitória lost 2-1 at São Paulo and remain directly involved in the lower-table battle, which should make the game intense rather than passive."
  ],
  tactical: "Vitória lost 2-1 at São Paulo and continue to carry squad problems. Corinthians should create enough volume at home to justify the 1.73 price, but the absence of Memphis removes an important final-third option. This is not a comfortable favorite; it is a home-side response angle in a relegation-sensitive game.",
  risk: "The biggest concern is Corinthians' lack of margin for error without Memphis. If the first goal does not arrive, anxiety can quickly turn a home favorite into a tense, low-quality contest.",
  market: "At **1.73** the raw implied probability is **57.80%** (1 / 1.73). Vitória have not won any of their 15 away games (five draws and ten defeats) and have conceded 32, which is the strongest argument for the price. Corinthians' own home record is poor, though, with five wins from 15 and only 15 goals scored, and Memphis Depay's suspension removes their main creative option. The value therefore depends on the response to the coaching change rather than on form.",
  conclusion: "Vitória's away record and Corinthians' urgency make the home win the likelier result, but the hosts have little margin for error without Memphis. If the first goal arrives early, Corinthians Win at 1.73 stays as the call.",
  teamNews: "Team news is as of 14 October 2026, five days before kick-off, so every lineup below is PROJECTED until the official team sheets appear about an hour before the game. Memphis Depay is suspended after his third yellow card. Hugo Souza, Gabriel Paulista and Raniele have been managing physical issues in training. Vitória's recent unavailable list included Baralhas, Camutanga, Edu, Fabiano Souza, Ramon and Kauan Coutinho; Tarzia served a suspension in the previous round.\n\n**PROJECTED setup:** If cleared, Corinthians can build around Hugo Souza; Matheuzinho, Gabriel Paulista/Gustavo Henrique, Matheus Bidu; Raniele, Breno Bidon, Rodrigo Garro; with the front line adjusted for Memphis' suspension. Vitória's recent structure featured Lucas Arcanjo; Mateus Silva, Cacá, Luan Cândido, Jamerson; Caíque Gonçalves, Emmanuel Martínez, Zé Vitor; Erick, Matheuzinho and Renê.",
  core: espnVenueSplitCore("brasileirao-serie-a", "Corinthians", "Vitória"),
  sources: [
    {
      "name": "CBF — Round 30 results",
      "url": "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/brasileirao-30-rodada-termina-com-vitoria-do-red-bull-bragantino-sobre-o-cruzeiro"
    },
    {
      "name": "ge — Corinthians/Vitória team news",
      "url": "https://ge.globo.com/futebol/"
    },
    {
      "name": "CBF — Série A",
      "url": "https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a"
    },
    {
      "name": "Tribuna de Jundiaí — Corinthians lose Memphis Depay for Seedorf's debut",
      "url": "https://tribunadejundiai.com.br/mais/esportes/corinthians-perde-memphis-depay-para-estreia-de-seedorf/"
    },
    {
      "name": "ESPN — fixture schedule and venue",
      "url": "https://www.espn.com/soccer/schedule/_/date/20261019/league/bra.1"
    },
    {
      "name": "ESPN — league standings",
      "url": "https://www.espn.com/soccer/standings/_/league/bra.1"
    }
  ],
});

export const brasileiraoSerieARound2026_10_17: EditorialPrediction[] = [
  m_botafogo_vs_chapecoense,
  m_atletico_mg_vs_coritiba,
  m_athletico_pr_vs_palmeiras,
  m_sao_paulo_vs_vasco,
  m_fluminense_vs_santos,
  m_gremio_vs_cruzeiro,
  m_bahia_vs_flamengo,
  m_remo_vs_red_bull_bragantino,
  m_corinthians_vs_vitoria,
];
