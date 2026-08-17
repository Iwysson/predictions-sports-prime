# SEO Publishing Workflow

## Publishing a prediction

1. Add or update the prediction in `src/data/predictions/<league>/<round>/`.
2. Set `published: true` only after the analysis, main pick and optional odds are ready.
3. Run `npx.cmd tsc --noEmit` and `npm.cmd run build`.
4. Run `npm.cmd run audit:seo` against the generated `out/` directory.

A published prediction is automatically converted into a match route, included in the sitemap, linked from its league hub and considered for related predictions. Related links require no manual configuration.

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
