# Relatório — correção de nomes/associação de predictions

## Causa raiz

O snapshot continha nomes de clubes com mojibake em UTF-8/Latin-1/CP850. Além disso, os 12 novos jogos da Champions League não tinham mapeamento explícito em `predictionIds`, deixando a associação prediction→fixture dependente da normalização do nome/slug.

## Correções aplicadas

- `src/lib/openfootball.ts`: reparo defensivo de nomes corrompidos antes de exibição/normalização.
- `src/lib/openfootball.ts`: snapshot clonado agora saneia `homeTeam` e `awayTeam` antes de retornar ao frontend.
- `src/lib/openfootball.ts`: aliases `bodglimt`/`bodoglimt` adicionados.
- `src/data/fixtures.snapshot.json`: mojibake conhecido corrigido nos nomes armazenados.
- `src/data/fixtures.snapshot.json`: adicionados 16 mapeamentos prediction→fixture já comprováveis no snapshot (12 Champions, 2 Eredivisie, 2 Liga Portugal).

## Verificação estática

- ocorrências de nomes corrompidos corrigidas no snapshot: 115
- jogos da Champions ainda com marcadores de mojibake: 0
- mapeamentos esperados ausentes/incorretos após o patch: 0
- JSON final: parse válido

## Limite desta correção

Os confrontos pendentes que não existem no snapshot fornecido (parte da EFL Cup, CONMEBOL e Scottish Premiership) não receberam `predictionIds` inventados. Isso preserva integridade; eles precisam continuar associados pelo registro/publication path já criado ou por fixtures reais adicionadas ao snapshot.

## Validação recomendada no projeto

```powershell
npm run fixtures:validate
npm run typecheck
npm run build
npm run audit:psp-editorial-standard
npm run audit:editorial-quality
npm run audit:enterprise-seo
```
