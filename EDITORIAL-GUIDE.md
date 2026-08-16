# COMO PUBLICAR UMA PREDICTION

A partir da Fase 2, você edita somente:

```text
src/data/predictions.ts
```

Para Premier League, La Liga, Bundesliga e Serie A, o formato é:

```ts
{
  league: "premier-league",
  homeTeam: "Arsenal",
  awayTeam: "Chelsea",

  analysis: [
    "Seu primeiro parágrafo.",
    "Seu segundo parágrafo.",
  ],

  picks: {
    main: "Arsenal or Draw",
    goals: "Over 1.5",
    btts: "Yes",
    score: "2-1",
  },
},
```

Você NÃO precisa preencher:

- id
- slug
- data
- horário
- rodada
- status
- título

O sistema cria ou busca esses dados automaticamente.

## Campos opcionais

Você não é obrigado a usar todos:

```ts
picks: {
  main: "Arsenal Win",       // obrigatório
  goals: "Over 2.5",
  btts: "Yes",
  corners: "Over 8.5",
  cards: "Over 3.5",
  score: "2-1",
}
```

## Rascunho

Para deixar uma análise preparada sem publicar:

```ts
published: false,
```

Quando quiser publicar:

```ts
published: true,
```

ou simplesmente remova a linha `published`.

## Outras Ligas

Como `other-leagues` não possui feed automático nesta versão,
você pode fornecer os dados manualmente:

```ts
{
  league: "other-leagues",
  homeTeam: "Time A",
  awayTeam: "Time B",

  analysis: [
    "Sua análise.",
  ],

  picks: {
    main: "Time A or Draw",
  },

  matchInfo: {
    date: "2026-08-20",
    time: "20:00",
    round: "Champions League",
    venue: "Stadium",
  },
},
```

## Regra principal

Para publicar uma prediction de uma das quatro ligas principais,
você normalmente só precisará escolher o jogo e escrever:

1. análise
2. main prediction
3. mercados adicionais que quiser
