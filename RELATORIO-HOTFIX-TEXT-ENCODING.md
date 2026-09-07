# Relatório — hotfix de text encoding

## Causa
O patch anterior corrigiu os nomes exibidos, mas introduziu literais de mojibake dentro de `TEAM_NAME_MOJIBAKE_REPLACEMENTS`. O audit de encoding detectou esses literais como **7 novas linhas rastreadas**, fazendo o Enterprise SEO cair de 13/13 para 12/13.

## Correção
Os padrões corrompidos continuam sendo reconhecidos em runtime, porém agora são construídos por `String.fromCodePoint(...)`, sem armazenar os caracteres mojibake literalmente no código-fonte.

## Resultado estático
- Arquivo alterado: `src/lib/openfootball.ts`
- Marcadores mojibake literais restantes no arquivo: 0
- A lógica de reparo de nomes continua ativa.
- Nenhuma alteração adicional em fixtures, predictions, picks ou odds.

## Validação recomendada
```powershell
npm run audit:text-encoding
npm run typecheck
npm run build
npm run audit:enterprise-seo
```

Resultado esperado:
- `audit:text-encoding`: PASS
- `Enterprise SEO audit`: 13/13 PASS
