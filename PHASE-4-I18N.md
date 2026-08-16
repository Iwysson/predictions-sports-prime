# FASE 4 — INTERNACIONALIZAÇÃO COMPLETA

Idiomas disponíveis:

- English
- Português
- Español
- Français
- Deutsch
- Italiano
- العربية
- हिन्दी
- বাংলা
- اردو
- Türkçe
- Русский
- 中文
- 日本語
- 한국어
- Bahasa Indonesia
- Bahasa Melayu
- ไทย
- Tiếng Việt
- Nederlands
- Polski
- فارسی
- עברית

## Detecção automática

Na primeira visita o site verifica:

```text
navigator.language
```

e seleciona automaticamente o idioma mais próximo.

Exemplos:

```text
pt-BR → Português
en-US → English
ar-SA → العربية
hi-IN → हिन्दी
bn-IN → বাংলা
ur-PK → اردو
zh-CN → 中文
ja-JP → 日本語
```

## Escolha manual

O usuário pode mudar o idioma pelo seletor no header.

A escolha fica salva em:

```text
localStorage
```

Portanto, na próxima visita, o site mantém o idioma escolhido.

## RTL

Idiomas com escrita da direita para a esquerda são tratados automaticamente:

- Árabe
- Urdu
- Persa
- Hebraico

O documento muda para:

```html
dir="rtl"
```

e o layout é reorganizado automaticamente.

## Marca localizada

O nome exibido também muda conforme o idioma.

Exemplos:

```text
English:
Predictions Sports Prime

Português:
Palpites Sports Prime

Español:
Predicciones Sports Prime

العربية:
برايم للتوقعات الرياضية

हिन्दी:
स्पोर्ट्स प्राइम भविष्यवाणियाँ
```

## Conteúdo editorial

A interface está internacionalizada.

Os textos das análises e predictions continuam exatamente como você escrever em:

```text
src/data/predictions/
```

Na próxima evolução, se desejado, podemos permitir que uma mesma prediction tenha versões manuais em vários idiomas.
