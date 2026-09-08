import fs from "node:fs";
import path from "node:path";
import { matches } from "../src/data/matches.ts";
import { hasCompleteLocalizedEditorial } from "../src/data/localized-editorial.ts";

const phase = process.argv[2];
if (!['baseline', 'after'].includes(phase)) throw new Error('Usage: report-wave-3-international.mjs baseline|after');

const locales = ['pt-br', 'es', 'it', 'fr', 'de'];
const out = path.resolve('out');
const indexable = (html) => /content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html);
const rows = [];

for (const locale of locales) {
  for (const match of matches) {
    const file = path.join(out, locale, 'match', match.slug, 'index.html');
    const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    rows.push({
      locale,
      league: match.league,
      slug: match.slug,
      routeExists: Boolean(html),
      indexable: Boolean(html) && indexable(html),
      complete: hasCompleteLocalizedEditorial(match.slug, locale),
    });
  }
}

const byLocale = Object.fromEntries(locales.map((locale) => {
  const localeRows = rows.filter((row) => row.locale === locale);
  const hubDirectory = path.join(out, locale, 'league');
  const hubs = fs.existsSync(hubDirectory)
    ? fs.readdirSync(hubDirectory).filter((league) => {
        const file = path.join(hubDirectory, league, 'index.html');
        return fs.existsSync(file) && indexable(fs.readFileSync(file, 'utf8'));
      }).length
    : 0;
  return [locale, {
    totalMatchPages: localeRows.filter((row) => row.routeExists).length,
    indexable: localeRows.filter((row) => row.indexable).length,
    noindexFallback: localeRows.filter((row) => row.routeExists && !row.indexable && !row.complete).length,
    completeEditorialAvailable: localeRows.filter((row) => row.complete).length,
    completePages: localeRows.filter((row) => row.routeExists && row.complete).length,
    fallbackPages: localeRows.filter((row) => row.routeExists && !row.complete).length,
    indexableLeagueHubs: hubs,
  }];
}));

const distribution = Object.fromEntries(locales.map((locale) => [locale,
  Object.fromEntries([...new Set(matches.map((match) => match.league))].sort().map((league) => {
    const group = rows.filter((row) => row.locale === locale && row.league === league);
    return [league, { total: group.length, indexable: group.filter((row) => row.indexable).length, complete: group.filter((row) => row.complete).length }];
  }))
]));

const report = {
  phase,
  generatedAt: new Date().toISOString(),
  scope: { locales, claimsOrganicGain: false },
  byLocale,
  totals: {
    localizedMatchPages: rows.filter((row) => row.routeExists).length,
    indexable: rows.filter((row) => row.indexable).length,
    noindex: rows.filter((row) => row.routeExists && !row.indexable).length,
    complete: rows.filter((row) => row.complete).length,
    fallback: rows.filter((row) => row.routeExists && !row.complete).length,
  },
  distribution,
};

const directory = path.join(process.cwd(), 'reports', 'wave-3');
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(directory, `${phase}.json`), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Wave 3 ${phase}: ${report.totals.indexable} indexable / ${report.totals.noindex} noindex localized match pages.`);
