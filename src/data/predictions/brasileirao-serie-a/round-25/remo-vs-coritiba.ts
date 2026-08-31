import type { EditorialPrediction } from "@/types";

export const remoVsCoritiba: EditorialPrediction = {
  league: "brasileirao-serie-a",
  homeTeam: "Remo",
  awayTeam: "Coritiba",

  analysis: [
    "Coritiba arrive in the stronger league position and with the better immediate result. Their 2-1 victory over Corinthians moved them to 34 points, while Remo remain inside the relegation zone on 23 after losing 2-1 to Fluminense.",
    "The 11-point gap matters, but the selection is deliberately protected because playing in Belém is not a simple away assignment. Remo’s need for points should make them aggressive at home, so demanding a Coritiba victory would expose us to more risk than necessary.",
    "X2 gives us two routes: Coritiba can win, or they can manage the match well enough to leave with a draw. Their current position allows them to play with more patience than Remo, who are under greater pressure to chase results.",
    "Coritiba’s latest win also showed they can remain efficient in a competitive game without needing overwhelming possession. That profile travels well for a double-chance selection: stay organized, avoid giving away cheap transitions and use the opponent’s urgency to create opportunities.",
    "At 1.65, the draw protection is valuable. We are backing the stronger current campaign without underestimating Remo’s home environment.",
  ],

  picks: {
    main: "Coritiba or Draw (X2)",
    odds: 1.65,
    oddsProvenance: {
      source: "Betano — editor-supplied price",
      bookmaker: "Betano",
      provenance: "author_attested",
      market: "Coritiba or Draw (X2)",
    },
  },

  matchInfo: {
    date: "2026-08-31",
    time: "20:00",
    round: "Matchday 25",
    venue: "Mangueirão",
  },

  publishedAt: "2026-08-25T06:17:27-03:00",
  sourceStatus: "verified",
  sources: [
    {
      name: "CBF — Brasileirão 2026 Matchdays 25 and 26",
      url: "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/cbf-detalha-rodadas-25-e-26-do-brasileirao-betano",
      description: "Official schedule and competition context for Brasileirão Matchday 25.",
      accessedAt: "2026-08-25T06:17:27-03:00",
    },
    { name: "Bem Parana - Remo vs Coritiba team news", url: "https://www.bemparana.com.br/esportes/coritiba/remo-x-coritiba-escalacoes-onde-assistir-e-sem-o-garcom/", description: "Current probable lineups, absences, venue and kickoff.", accessedAt: "2026-08-31T08:00:00-03:00" },
    { name: "ge - Jaja fitness update", url: "https://ge.globo.com/pa/futebol/times/remo/noticia/2026/08/27/artilheiro-do-remo-no-brasileirao-e-duvida-para-jogo-com-coritiba.ghtml", description: "Medical context for Jaja before the fixture.", accessedAt: "2026-08-31T08:00:00-03:00" },
  ],
  matchSeo: {
    information: { city: "Belem", country: "Brazil", timezone: "America/Belem", referee: "Daiane Muniz", sources: [{ name: "Bem Parana", url: "https://www.bemparana.com.br/esportes/coritiba/remo-x-coritiba-escalacoes-onde-assistir-e-sem-o-garcom/", accessedAt: "2026-08-31T08:00:00-03:00" }] },
    lineups: { status: "expected", home: { formation: "4-2-3-1", players: ["Marcelo Rangel", "Marcelinho", "Marllon", "Tchamba", "Marlon", "Ze Welison", "Ze Ricardo", "Yago Pikachu", "Vitor Bueno", "Alef Manga", "Gabriel Taliari"] }, away: { formation: "4-2-3-1", players: ["Pedro Morisco", "JP Chermont", "Tiago Coser", "Jacy", "Bruno Melo", "Vitor Tissi", "Sebas Gomez", "Lavega", "Fernando Sobral", "Breno Lopes", "Pedro Rocha"] }, sources: [{ name: "Bem Parana", url: "https://www.bemparana.com.br/esportes/coritiba/remo-x-coritiba-escalacoes-onde-assistir-e-sem-o-garcom/", accessedAt: "2026-08-31T08:00:00-03:00" }] },
    availability: { entries: [{ team: "home", player: "Jaja", status: "injured", detail: "ankle injury; reported out in the latest match preview" }, { team: "away", player: "Josue", status: "injured", detail: "thigh pain; did not travel" }, { team: "away", player: "Thiago Santos", status: "suspended", detail: "yellow-card accumulation" }, { team: "away", player: "Brian Ocampo", status: "injured" }, { team: "away", player: "Tinga", status: "injured" }, { team: "away", player: "Lucas Ronier", status: "injured" }], sources: [{ name: "Bem Parana", url: "https://www.bemparana.com.br/esportes/coritiba/remo-x-coritiba-escalacoes-onde-assistir-e-sem-o-garcom/", accessedAt: "2026-08-31T08:00:00-03:00" }, { name: "ge", url: "https://ge.globo.com/pa/futebol/times/remo/noticia/2026/08/27/artilheiro-do-remo-no-brasileirao-e-duvida-para-jogo-com-coritiba.ghtml", accessedAt: "2026-08-31T08:00:00-03:00", note: "Earlier medical report; later preview resolves Jaja as out" }] },
  },
  published: true,
};
