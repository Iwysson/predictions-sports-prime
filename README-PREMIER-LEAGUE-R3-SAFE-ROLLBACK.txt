PSP — PREMIER LEAGUE ROUND 03 — SAFE ROLLBACK
Data: 03/09/2026

Motivo:
O primeiro batch de upgrade da Premier League R3 converteu células antigas
de fallback do Statistical Core para "—". Isso respeitou a regra editorial
de não mascarar dados, mas o validador psp-v1 exige Statistical Core completo
para páginas nesse padrão. O resultado foi falha nas predictions 21–30.

Este pacote NÃO enfraquece o validador e NÃO inventa números.

Ele restaura SOMENTE os arquivos tocados pelo batch da Premier League para o
último estado validado antes desse upgrade:

KEEP: 52
UPGRADE: 87
LEGACY-NOINDEX: 153
REMOVE: 0

Inclui:
- src/data/predictions/premier-league/round-03/ (versão original pré-upgrade)
- src/lib/adsense-content-quality.ts (snapshot validado 52/87/153/0)
- scripts/audit-adsense-content-gate.mjs (snapshot validado 52/87/153/0)

Depois de extrair na raiz do projeto:
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo

Próximo passo editorial correto:
Pesquisar e preencher os splits HOME/AWAY faltantes com dados rastreáveis
antes de tentar novamente UPGRADE -> KEEP para a Premier League.
