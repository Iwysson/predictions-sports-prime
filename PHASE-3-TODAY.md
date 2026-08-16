# FASE 3 — TODAY'S PREDICTIONS AUTOMÁTICO

A Home agora funciona assim:

1. Você publica uma prediction em:

```text
src/data/predictions/
```

2. O site procura o jogo real no feed da liga.

3. O sistema obtém automaticamente:

- data
- horário
- rodada

4. Se a data do jogo for hoje, a prediction aparece automaticamente em:

```text
Today's Predictions
```

5. Quando o dia termina, ela deixa de aparecer nessa seção automaticamente.

Você NÃO precisa:

- mover cards
- editar a Home
- duplicar o jogo
- informar a data manualmente nas quatro ligas principais

## Ordem

Os jogos de hoje são mostrados por horário:

```text
15:00
17:30
20:00
TBD
```

Jogos sem horário confirmado aparecem depois dos demais.

## Latest Predictions

A seção `Latest Predictions` agora mostra somente predictions publicadas
de hoje em diante, ordenadas por data e horário.
