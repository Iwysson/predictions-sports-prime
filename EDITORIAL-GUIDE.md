# Como publicar uma prediction

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
