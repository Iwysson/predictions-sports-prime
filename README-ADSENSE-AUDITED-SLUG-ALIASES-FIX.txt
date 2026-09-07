PSP — AdSense audited slug aliases fix
Data: 03/09/2026

Diagnóstico:
37 predictions atuais estavam caindo em automatic-fallback porque seus slugs
atuais diferem dos slugs usados no snapshot editorial auditado.

Dessas 37:
- 27 pertencem originalmente a LEGACY-NOINDEX.
- 10 pertencem originalmente a UPGRADE.

O fallback transformava todas as 37 em LEGACY-NOINDEX, produzindo drift:
KEEP 33 / UPGRADE 96 / LEGACY-NOINDEX 163.

Correção:
Foi criada uma tabela explícita AUDITED_SLUG_ALIASES que mapeia o slug atual
para o slug auditado original. Nenhuma decisão editorial foi alterada.

Resultado esperado:
KEEP 33
UPGRADE 106
LEGACY-NOINDEX 153
REMOVE 0
Automatic fallback decisions: 0

Substituir:
src/lib/adsense-content-quality.ts

Depois rodar:
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:international-seo
