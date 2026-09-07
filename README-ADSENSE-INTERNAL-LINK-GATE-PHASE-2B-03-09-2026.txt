PSP — ADSENSE INTERNAL LINK QUALITY GATE — FASE 2B
Data: 03/09/2026

PROBLEMA CORRIGIDO
Após o Content Quality Gate, páginas UPGRADE e LEGACY-NOINDEX continuavam
existindo, porém os módulos de descoberta ainda promoviam essas URLs.
O audit antigo também tratava qualquer link para uma página noindex como
"draft or broken", mesmo quando o HTML existia.

POLÍTICA IMPLEMENTADA
1. Home:
   somente matches KEEP entram nos feeds de Today / Tomorrow / Upcoming / History.

2. League pages:
   - Published Analysis e Editorial Hub recebem apenas KEEP.
   - Current/Next Round continuam mostrando fixtures factuais.
   - Se uma fixture publicada for noindex, ela continua visível como fixture,
     mas o botão/link para a análise é suprimido.

3. Related Predictions:
   apenas KEEP é promovido em páginas indexáveis.

4. Results archive:
   continua podendo apontar para análises históricas noindex, porque é uma
   superfície de transparência, não um módulo de aquisição/discovery.

5. audit:adsense-quality:
   - BROKEN = destino realmente inexistente.
   - NOINDEX existente = não é broken.
   - Links de discovery/editorial para noindex continuam sendo erro.
   - /results/ é a única exceção explícita para preservar o arquivo histórico.

NÃO FOI FEITO
- nenhuma página foi recolocada no índice;
- nenhuma URL histórica foi removida;
- nenhum validator foi enfraquecido;
- /results/ não perdeu transparência.

ARQUIVOS ALTERADOS
src/lib/adsense-content-quality.ts
src/app/(en)/page.tsx
src/app/[locale]/page.tsx
src/components/HomePredictionFeed.tsx
src/components/MatchCard.tsx
src/components/LiveLeagueRounds.tsx
src/components/LeagueEditorialHub.tsx
src/app/(en)/league/[slug]/page.tsx
src/app/[locale]/league/[slug]/page.tsx
src/components/RelatedPredictions.tsx
src/app/(en)/match/[slug]/page.tsx
src/components/LocalizedMatchPageContent.tsx
scripts/audit-adsense-quality.mjs

VALIDAÇÃO
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:international-seo
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
