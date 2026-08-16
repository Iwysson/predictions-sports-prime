# Estrutura editorial das predictions

Cada prediction possui um arquivo próprio. No VS Code, navegue sempre nesta ordem:

```text
src/data/predictions/premier-league/round-01/arsenal-vs-coventry.ts
```

## Onde editar

As ligas ficam em:

```text
src/data/predictions/premier-league/
src/data/predictions/la-liga/
src/data/predictions/bundesliga/
src/data/predictions/serie-a/
src/data/predictions/other-leagues/
```

Dentro de cada liga, use pastas com dois dígitos: `round-01`, `round-02`, até
`round-38` quando aplicável. Só crie uma rodada quando ela for preparada.

## Como editar um jogo

Abra o arquivo do confronto. Ele começa como rascunho:

```ts
import type { EditorialPrediction } from "@/types";

export const arsenalVsCoventry: EditorialPrediction = {
  league: "premier-league",
  homeTeam: "Arsenal",
  awayTeam: "Coventry City",
  analysis: [],
  picks: {
    main: "",
    // odds: 1.72,
  },
  published: false,
};
```

Escreva cada parágrafo como um item de `analysis`:

```ts
analysis: [
  "Primeiro parágrafo escrito manualmente.",
  "Segundo parágrafo escrito manualmente.",
],
```

Preencha a prediction principal e, se disponível, a odd como número separado:

```ts
picks: {
  main: "Arsenal -1.75 Asian Handicap",
  odds: 1.72,
},
```

Não escreva a odd dentro do texto de `main`. A odd é opcional, deve ser um
número finito maior que `1` e será exibida separadamente na página.

Não adicione `id`, `slug`, data, horário, rodada, URL ou status técnico. O site
resolve esses dados automaticamente.

## Rascunho e publicação

Mantenha `published: false` enquanto estiver escrevendo. Rascunhos podem ter
`analysis: []` e `picks.main: ""`; eles não aparecem nas áreas públicas.

Quando terminar, use:

```ts
published: true,
```

Também é possível remover `published`, pois sua ausência significa publicada.
Uma prediction publicada precisa ter times válidos, análise e `picks.main`.
O sistema editorial público permanece limitado a Match Analysis, Main
Prediction e Odds; não existem estratégias ao vivo ou placares projetados.

## Como adicionar uma rodada

1. Crie uma pasta como `round-02` dentro da liga.
2. Crie um arquivo `home-vs-away.ts` em kebab-case para cada jogo.
3. Crie `round-02/index.ts` reunindo os jogos.
4. Importe a rodada no `index.ts` da liga e espalhe sua lista.

A estrutura aceita progressivamente `round-01` até `round-38`; não é necessário
criar centenas de arquivos vazios antecipadamente.

As pastas `round-01` das quatro ligas principais já contêm seus confrontos
reais como rascunhos: 10 da Premier League, 10 da La Liga, 9 da Bundesliga e
10 da Serie A. `other-leagues/round-01` permanece vazio porque essa categoria
não possui feed automático; adicione apenas jogos reais e preencha `matchInfo`
quando necessário.

## Conferência e publicação via Git

```powershell
npx tsc --noEmit
npm run build
git add .
git commit -m "Publish Arsenal vs Coventry prediction"
git push
```

O proprietário executa o push manualmente. O deploy continua estático pelo
provedor conectado ao GitHub, sem backend, banco ou painel administrativo.
