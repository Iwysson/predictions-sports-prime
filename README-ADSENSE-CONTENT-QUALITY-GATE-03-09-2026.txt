PSP — ADSENSE CONTENT QUALITY GATE
Data: 03/09/2026

POLÍTICA
KEEP = index,follow + sitemap
UPGRADE = noindex,follow + fora do sitemap
LEGACY-NOINDEX = noindex,follow + fora do sitemap
REMOVE = não indexável

Snapshot auditado:
KEEP 33
UPGRADE 106
LEGACY-NOINDEX 153
REMOVE 0

O gate preserva as URLs e o conteúdo. Ele controla indexabilidade/sitemap.

Novas predictions que não estavam no snapshot só recebem KEEP automático se:
- editorialStandard=psp-v1
- sourceStatus=verified
- ao menos uma fonte HTTPS rastreável
- Statistical Core Predictions-Sports-Prime
- Conflict Detector
- evidência Data-First
- contexto de equipe/availability/lineups/team news

Arquivos:
src/lib/adsense-content-quality.ts
src/app/sitemap.ts
src/lib/seo.ts
src/app/[locale]/match/[slug]/page.tsx
scripts/audit-adsense-content-gate.mjs
package.json

Validação:
npm run typecheck
npm run audit:adsense-content-gate
npm run audit:adsense-quality
npm run audit:international-seo
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run build
