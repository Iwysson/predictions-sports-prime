import { EditorialPrediction } from "@/types";

/*
==============================================================
PREDICTIONS SPORTS PRIME — ARQUIVO QUE VOCÊ VAI EDITAR
==============================================================

Para publicar um novo prognóstico nas ligas principais, você
precisa informar somente:

1. liga
2. time da casa
3. time visitante
4. sua análise
5. seus palpites

NÃO precisa informar:
- id
- slug
- rodada
- data
- horário

Esses dados são obtidos automaticamente dos fixtures.

Para esconder uma prediction sem apagá-la:
published: false

IMPORTANTE:
Escreva os nomes dos clubes de forma compatível com os nomes
mostrados na página da liga.
==============================================================
*/

export const editorialPredictions: EditorialPrediction[] = [
  {
    league: "premier-league",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",

    analysis: [
      "Substitua este texto pela sua análise manual da partida.",
      "Você pode adicionar quantos parágrafos quiser dentro deste bloco.",
    ],

    picks: {
      main: "Example main prediction",
      goals: "Example goals prediction",
      btts: "Example BTTS prediction",
      score: "Example score",
    },

    // Conteúdo de modelo: mantenha como rascunho até substituir os textos.
    published: false,
  },

  {
    league: "premier-league",
    homeTeam: "Liverpool",
    awayTeam: "Everton",

    analysis: [
      "Exemplo de segunda prediction. Substitua pelo seu prognóstico.",
    ],

    picks: {
      main: "Example main prediction",
    },

    // Conteúdo de modelo: mantenha como rascunho até substituir os textos.
    published: false,
  },

  {
    league: "la-liga",
    homeTeam: "Barcelona",
    awayTeam: "Sevilla",

    analysis: [
      "Exemplo de prediction para La Liga.",
    ],

    picks: {
      main: "Example main prediction",
      goals: "Example goals prediction",
    },

    // Exemplo de rascunho:
    published: false,
  },
];

/*
==============================================================
MODELO PARA COPIAR E COLAR
==============================================================

{
  league: "premier-league",
  homeTeam: "Arsenal",
  awayTeam: "Chelsea",

  analysis: [
    "Primeiro parágrafo da análise.",
    "Segundo parágrafo da análise.",
  ],

  picks: {
    main: "Arsenal or Draw",
    goals: "Over 1.5",
    btts: "Yes",
    corners: "Over 8.5",
    cards: "Over 3.5",
    score: "2-1",
  },
},

==============================================================
*/
