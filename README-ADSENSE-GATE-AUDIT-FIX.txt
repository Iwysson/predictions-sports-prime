PSP — FIX DO AUDIT ADSENSE CONTENT GATE
03/09/2026

ERRO CORRIGIDO
TypeError: sitemap is not a function

CAUSA
O arquivo src/app/sitemap.ts é uma Metadata Route do Next. Quando carregado
diretamente via tsx/Node, o default export pode chegar envolvido por uma camada
de interoperabilidade diferente daquela usada pelo Next durante o build.

O site/build não estava quebrado. O erro era somente no script de auditoria.

CORREÇÃO
O script agora resolve com segurança:
- module.default
- module.default.default
- module.sitemap

e falha com diagnóstico explícito se nenhuma forma for chamável.

SUBSTITUIR
scripts/audit-adsense-content-gate.mjs

RODAR
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:international-seo
