PSP — ADSENSE INTERNAL LINK QUALITY GATE — FASE 2C
Data: 03/09/2026

DIAGNÓSTICO DO LOG ANTERIOR
O validator da Fase 2B ficou amplo demais: tratava TODO link interno para uma
página noindex como erro de "discovery". Isso confundia navegação factual /
preservação histórica com módulos de aquisição editorial.

Além disso, LeaguePublishedAnalysis ainda não filtrava efetivamente o conjunto
KEEP, embora uma das páginas já tentasse passar a lista de slugs.

CORREÇÃO
1. Todo link /match/ continua sendo validado contra existência física do HTML.
   Destino inexistente = erro BROKEN.

2. Somente módulos editoriais de aquisição marcam links com:
   data-quality-gated-match-link="true"

3. O audit exige que cada link marcado aponte para uma página KEEP/indexável.

4. Links factuais/navegacionais para páginas existentes noindex,follow são
   permitidos. Isso preserva histórico e navegabilidade sem recolocar a URL
   no sitemap ou no índice.

5. LeaguePublishedAnalysis agora filtra explicitamente apenas KEEP.

MÓDULOS COM QUALITY GATE EXPLÍCITO
- Home prediction cards / upcoming / history
- League Published Analysis
- League Editorial Hub
- Related Predictions

A política NÃO foi afrouxada:
- links quebrados continuam falhando;
- aquisição editorial para noindex continua falhando;
- noindex continua fora do sitemap;
- páginas noindex não voltam a index,follow.

VALIDAÇÃO
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:international-seo
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
