PSP — INTERNATIONAL MOBILE HEADER FIX V4
03/09/2026

Esta versão corrige o problema real observado nas capturas de tela de celular.

O QUE FOI CONFIRMADO NOS ARQUIVOS ORIGINAIS
- O header inglês tinha desktop-nav + menu-button + mobile-nav.
- O header localizado original tinha apenas main-nav e NÃO tinha botão/menu mobile.
- O CSS original esconde desktop-nav em viewport pequeno, mas não podia corrigir
  o header localizado porque ele usava outra estrutura.
- Em celulares reais, também adicionamos um fallback por capacidade touch
  (hover:none + pointer:coarse), evitando que a navegação desktop reapareça por
  peculiaridades de viewport/zoom do navegador.

ARQUIVOS A SUBSTITUIR
src/components/Header.tsx
src/components/LocalizedSiteChrome.tsx
src/components/RouteLanguageSelector.tsx
src/app/globals.css

IMPORTANTE
O bloco "PSP LOCALIZED MOBILE HEADER — FINAL OVERRIDE" foi colocado no FINAL
de globals.css e usa !important somente nas propriedades responsivas do header.
Isso impede regras antigas posteriores de reexibir o menu desktop.

VALIDAÇÃO
npm run typecheck
npm run audit:international-seo
npm run audit:prediction-first-search-intent
npm run build

TESTE REAL
Abra no telefone:
- /pt-br/
- /es/
- /fr/
- /de/
- /it/
- /nl/
- /tr/

Esperado no telefone:
check/logo + seletor de idioma + botão hambúrguer.
Nenhuma sequência de links deve ficar espremida na linha superior.
