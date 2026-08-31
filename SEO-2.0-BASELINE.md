# SEO 2.0 Baseline

Baseline consolidada das Fases 6–8 em 31/08/2026.

## Cobertura

- Rotas estáticas geradas: 292
- Páginas HTML estáticas auditadas: 290
- Páginas indexáveis: 278
- Partidas publicadas: 228
- Match SEO 2.0 completo (A): 3
- Match SEO 2.0 parcial factual (B): 202
- Partidas legacy (C): 23
- Partidas migradas para Match SEO 2.0: 205
- Ligas com League SEO 2.0: 12/12
- Locales indexáveis: 7 (`pt-BR`, `es`, `fr`, `de`, `it`, `nl`, `tr`)

## Integridade

- Links internos quebrados: 0
- Páginas órfãs: 0
- Capability mismatches: 0
- Titles duplicados exatos: 0
- Descriptions duplicadas exatas: 0
- Zeros indevidos: 0
- Jogos futuros no histórico: 0
- Drafts indexáveis: 0

## Performance do export

- HTML total: 18.652.612 bytes
- JavaScript total: 1.033.657 bytes
- Home: 116.013 bytes HTML, 664.635 bytes JS, 11 scripts
- Match piloto: 91.313 bytes HTML, 681.790 bytes JS, 11 scripts
- League piloto: 96.135 bytes HTML, 940.947 bytes JS, 12 scripts

Não havia baseline anterior equivalente para comparação direta. Lighthouse/Chrome não estava disponível; LCP, INP e CLS não foram estimados.

## Mensuração externa futura

Search Console deve separar Home de tráfego editorial e acompanhar clicks, impressions, CTR, average position, queries por partida, páginas com impressions, faixas Top 3/4–10/11–20/21–50/51–100, clicks de league/match pages, país, dispositivo e locale.

## Reprodução

```bash
npm run typecheck
npm run build
npm run validate:production
npm run audit:site-quality
npm run audit:sources
npm run audit:fixture-lifecycle
npm run report:seo2-performance
git diff --check
```
