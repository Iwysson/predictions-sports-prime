PSP — AdSense Content Gate Snapshot Update
Data: 03/09/2026

Motivo:
O batch editorial da Süper Lig promoveu 9 páginas auditadas de UPGRADE para KEEP.

Antes:
KEEP 33
UPGRADE 106
LEGACY-NOINDEX 153
REMOVE 0

Novo snapshot oficial:
KEEP 42
UPGRADE 97
LEGACY-NOINDEX 153
REMOVE 0

Esta alteração NÃO enfraquece o audit.
Ela apenas atualiza a expectativa fixa do snapshot para refletir as 9 promoções editoriais já aprovadas.

Nenhuma regra de indexabilidade, sitemap, metadata, fallback ou classificação automática foi relaxada.

Após substituir:
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo

Observação:
Rodar audit:adsense-quality depois do build evita ler a saída HTML de um build anterior.
