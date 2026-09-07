PSP — ADSENSE LEAGUE HUB QUALITY GATE — FASE 2D
Data: 03/09/2026

DIAGNÓSTICO
O audit anterior caiu de centenas de erros para apenas 2:

- /league/efl-cup/
- /league/super-lig/

As duas ligas continuam com páginas válidas e fixtures, mas hoje não têm
nenhuma prediction classificada KEEP. Por isso não existe link editorial
publicado elegível para sustentar uma superfície indexável de aquisição.

CORREÇÃO
Uma league page só permanece indexável quando:
1. passa a regra estrutural de isLeagueIndexable(); E
2. possui pelo menos uma prediction publicada que passa o AdSense Content Gate.

Quando não possui KEEP:
- a página continua existindo;
- mantém follow;
- recebe noindex;
- sai do sitemap;
- versões localizadas também recebem noindex;
- hreflang deixa de ser anunciado para esse hub.

Quando uma prediction da liga for promovida a KEEP no futuro, o hub volta
automaticamente a ficar elegível.

NENHUMA prediction foi reclassificada.
Nenhuma URL foi apagada.
Nenhum validator foi afrouxado.

ARQUIVOS ALTERADOS
src/lib/adsense-content-quality.ts
src/app/(en)/league/[slug]/page.tsx
src/app/[locale]/league/[slug]/page.tsx
src/app/sitemap.ts

VALIDAÇÃO
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:international-seo
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
