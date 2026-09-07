# Relatório — correção manual do Statistical Core

## Causa raiz

O erro de runtime era provocado por linhas opcionais do `Statistical Core` presentes com valor em apenas um lado da comparação HOME/AWAY. O runtime exibido exigia que uma linha presente tivesse os dois valores efetivamente preenchidos. A política nova permite Core parcial, portanto a correção mais segura foi **remover somente as linhas opcionais assimétricas**, sem inventar o valor ausente.

## Arquivos corrigidos

- `src/data/predictions/champions-league/matchday-01/porto-vs-manchester-city.ts`
  - removida: `| Offsides/game | 3.50 | — |`
- `src/data/predictions/champions-league/matchday-01/aek-athens-vs-lask.ts`
  - removida: `| Fouls/game | 15.33 | — |`
  - removida: `| Shot conversion | 19% | — |`
- `src/data/predictions/champions-league/matchday-01/borussia-dortmund-vs-villarreal.ts`
  - removida: `| Fouls/game | 10.00 | — |`
  - removida: `| Offsides/game | — | 2.50 |`
- `src/data/predictions/champions-league/matchday-01/club-brugge-vs-aston-villa.ts`
  - removida: `| Offsides/game | 2.25 | — |`
- `src/data/predictions/champions-league/matchday-01/real-madrid-vs-inter.ts`
  - removida: `| Offsides/game | 1.25 | — |`

## Resultado estático

- Arquivos alterados: 5
- Linhas opcionais assimétricas removidas: 7
- Linhas assimétricas restantes em jogos futuros fornecidos: 0
- Nenhum valor foi inventado, copiado do outro time ou convertido para zero/N/A.
- Picks, odds, slugs, datas e conteúdo histórico não foram alterados.
- O arquivo histórico `amedspor-vs-trabzonspor.ts` continua intacto, conforme a política de freeze histórico.

## Observação de validação

Os ZIPs enviados não contêm o projeto completo com `package.json`/dependências, portanto não foi possível executar `npm run typecheck`, `npm run build` ou iniciar o Next.js neste ambiente. A verificação estática confirma que as linhas que reproduziam exatamente o erro de runtime foram removidas e que não restam linhas HOME/AWAY assimétricas nos jogos futuros fornecidos.

Após substituir os arquivos, rode no projeto:

```powershell
npm run typecheck
npm run audit:psp-editorial-standard
npm run audit:editorial-quality
npm run build
npm run audit:enterprise-seo
```

Depois reinicie o servidor local (encerre o `next dev` anterior antes de iniciar novamente) para eliminar cache/stale Turbopack.
