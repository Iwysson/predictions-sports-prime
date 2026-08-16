# FASE 5 — SEO

A implementação inclui:

- metadata global
- metadata dinâmica por partida
- metadata dinâmica por liga
- canonical URL
- Open Graph
- Twitter Card
- sitemap.xml
- robots.txt
- manifest
- favicon
- ícones 192 / 512 / Apple
- imagem social 1200x630
- JSON-LD WebSite
- JSON-LD Organization
- JSON-LD Article nas páginas de prediction

## Antes de publicar

Crie:

```text
.env.local
```

e coloque:

```env
NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO.com
```

Sem barra `/` no final.

Exemplo futuro:

```env
NEXT_PUBLIC_SITE_URL=https://predictionssportsprime.com
```

Não use o domínio do exemplo até realmente possuir/configurar o domínio.

## URLs indexáveis

Home:

```text
/
```

Ligas:

```text
/league/premier-league/
/league/la-liga/
/league/bundesliga/
/league/serie-a/
```

Predictions:

```text
/match/arsenal-vs-chelsea/
```

## Título automático de uma prediction

Exemplo:

```text
Arsenal vs Chelsea Prediction, Tips & Match Preview
```

## Sitemap

Gerado automaticamente a partir de:

- Home
- ligas
- predictions com status published

Uma prediction com:

```ts
published: false
```

não entra no sitemap porque não entra em `matches`.

## Search Console

Após o site estar online:

1. cadastrar domínio no Google Search Console
2. verificar propriedade
3. enviar:

```text
https://SEU-DOMINIO.com/sitemap.xml
```

4. solicitar indexação das principais páginas

## Observação sobre idiomas

A interface troca idioma no navegador, mas nesta versão ainda existe uma URL única
por página. Para SEO internacional avançado com `hreflang`, o passo ideal é criar
rotas indexáveis por idioma, por exemplo:

```text
/en/
/pt-br/
/es/
/ar/
```

Isso deve ser feito apenas quando também houver conteúdo editorial realmente
localizado nesses idiomas.
