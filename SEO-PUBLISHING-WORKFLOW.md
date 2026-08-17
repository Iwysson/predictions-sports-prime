# SEO Publishing Workflow

## Publishing a prediction

1. Add or update the prediction in `src/data/predictions/<league>/<round>/`.
2. Set `published: true` only after the analysis, main pick and optional odds are ready.
3. Run `npx.cmd tsc --noEmit` and `npm.cmd run build`.
4. Run `npm.cmd run audit:seo` against the generated `out/` directory. The audit also refreshes the internal `SEO-INDEXING-QUEUE.md` report.

A published prediction is automatically converted into a static match route with unique metadata, canonical URL, index/follow directives, league relationship, contextual links and valid structured data. It is included in the sitemap and indexing queue without manually editing `sitemap.ts`.

Drafts marked `published: false` do not receive a match route, sitemap entry, league-hub link or related-prediction link.

## Adding a league

Add the league once to the registry in `src/data/leagues.ts`, including its data-source and display configuration. The shared league route then provides the hub title, description, canonical, introduction, breadcrumbs, structured data, current round, standings and published prediction links. No league-specific page component is required.

Also add the league slug to the `LeagueSlug` type and register its prediction collection. Standings and fixture source configuration must correspond to the real competition; do not create a generic standings page for aggregators such as Other Leagues.

## Automatic internal-link lifecycle

```text
published: true
  → static match route
  → sitemap entry
  → league hub link
  → deterministic related links
  → match-to-league backlink
```

Historical published pages remain available. Related selection prioritizes published matches from the same league and round, then temporal proximity, with published matches from other leagues used only when needed to fill the compact list.

## Automatic SEO lifecycle

```text
published: true
  → static match page
  → unique title and description
  → canonical and index/follow
  → sitemap and league hub
  → Home Today/Latest when current or upcoming
  → Related Predictions
  → Article and Breadcrumb structured data
  → SEO indexing queue
```

## Search Console review

Use `SEO-INDEXING-QUEUE.md` to identify published canonical URLs that are indexable, present in the sitemap and internally linked. Submission or inspection remains a manual Google Search Console action; the project does not call unofficial indexing services.

`lastModified` is emitted only when the prediction has a reliable editorial `updatedAt` or `publishedAt`. Never add a date merely to populate the sitemap or Article schema.
