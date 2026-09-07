PSP — ADSENSE HOME VISIBILITY RESTORE — FASE 2E
Data: 03/09/2026

PROBLEMA
A Fase 2B aplicou o Content Quality Gate também à seleção VISÍVEL da Home.
Isso fez partidas publicadas desaparecerem de Hoje, Amanhã, Próximos e Histórico.

Essa consequência não era desejada.

REGRA CORRETA
O AdSense Content Quality Gate controla:
- robots index/noindex
- sitemap
- hreflang/indexability
- módulos editoriais secundários de aquisição

Ele NÃO deve remover partidas publicadas das superfícies primárias do produto.

CORREÇÃO
- Today volta a usar todas as predictions publicadas elegíveis.
- Tomorrow volta a usar todas.
- Upcoming volta a usar todas.
- Home history volta a usar todas.
- O botão "Ver/View" continua disponível para predictions publicadas.
- A Home localizada volta a usar todas as rotas localizadas elegíveis.

PROTEÇÃO ADSENSE PRESERVADA
Uma prediction UPGRADE/LEGACY-NOINDEX:
- continua noindex,follow;
- continua fora do sitemap;
- não recupera hreflang indexável;
- não vira KEEP;
- apenas continua visível/navegável para o usuário.

Nenhuma classificação foi alterada:
KEEP 33
UPGRADE 106
LEGACY-NOINDEX 153
REMOVE 0

ARQUIVOS ALTERADOS
src/components/HomePredictionFeed.tsx
src/components/HomeMatchCard.tsx
src/app/(en)/page.tsx
src/app/[locale]/page.tsx

VALIDAÇÃO
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:international-seo
