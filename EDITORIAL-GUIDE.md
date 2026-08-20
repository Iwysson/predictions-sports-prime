# Como publicar uma prediction

Toda prediction publicada aparece automaticamente em `/results/`, inclusive quando estiver pending ou resultar em loss, push, half-result ou void. Nao remova uma prediction do arquivo por causa do resultado. O settlement reutiliza o pipeline oficial; mercados que nao possam ser avaliados com seguranca permanecem pending para revisao, sem resultado inventado.

## Fontes e odds para novas publicacoes

As 52 predictions publicadas antes da Politica de Fontes da Fase 2 formam o arquivo legado e permanecem sem fontes retroativamente atribuidas. Conteudo publicado depois de `2026-08-20T23:59:59-03:00` deve informar `sourceStatus: "verified"` e `sources` com as fontes realmente usadas para sustentar afirmacoes factuais.

Cada fonte exige `name` e uma `url` HTTPS direta. `description` explica a relacao da fonte com a analise quando isso nao for evidente; `accessedAt` e opcional e usa ISO 8601. Links vazios, HTTP, dominios de exemplo e fontes sem relacao editorial sao rejeitados. A validacao tecnica nao substitui a revisao humana de relevancia.

Se uma nova publicacao incluir `picks.odds`, inclua `picks.oddsProvenance` com a fonte real e `capturedAt`. `market` e opcional. Nunca invente bookmaker, fonte ou horario para conteudo legado.

As predictions são organizadas por liga, rodada e jogo em:

```text
src/data/predictions/
```

Para editar Arsenal vs Coventry, abra:

```text
src/data/predictions/premier-league/round-01/arsenal-vs-coventry.ts
```

Preencha os parágrafos de `analysis`, `picks.main` e, opcionalmente,
`picks.odds` como número maior que `1`. Depois mude `published` de `false` para
`true` e registre a publicação uma vez com:

```text
npm.cmd run editorial:timestamp -- publish src/data/predictions/<liga>/<rodada>/<jogo>.ts
```

Para uma alteração editorial significativa posterior, registre `updatedAt` explicitamente:

```text
npm.cmd run editorial:timestamp -- update src/data/predictions/<liga>/<rodada>/<jogo>.ts
```

Esses comandos alteram o arquivo editorial; builds não criam nem atualizam timestamps. Datas, horários, rodada, slug e URL continuam
sendo obtidos automaticamente; não os adicione ao arquivo editorial.

Consulte [PREDICTIONS-STRUCTURE.md](./PREDICTIONS-STRUCTURE.md) para o fluxo
completo, como adicionar rodadas e os comandos de publicação via Git.
