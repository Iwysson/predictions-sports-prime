import { existsSync, readFileSync } from 'node:fs';
import { editorialPredictions } from '../src/data/predictions/index.ts';
import { resolveNhlSlate } from '../src/data/nhl/slates.ts';

const assert = (ok: unknown, label: string) => { if (!ok) throw new Error(label); console.log(`PASS ${label}`); };
const expectedFootball = [
  ['corum-fk-vs-caykur-rizespor', 'Çorum FK or Draw (1X) + Over 1.5 Goals', 1.68, 'free', false],
  ['sc-heerenveen-vs-excelsior', 'Over 2.5 Goals', 1.40, 'vip', true],
  ['frosinone-vs-sassuolo', 'Over 2.5 Goals', 1.50, 'vip', false],
  ['deportivo-la-coruna-vs-levante', 'Deportivo or Draw (1X) + Over 1.5 Goals', 1.70, 'vip', false],
  ['mirassol-vs-internacional', 'Over 2.5 Goals', 1.98, 'vip', false],
] as const;
const published = editorialPredictions.filter((p) => p.matchInfo?.date === '2026-10-16' && expectedFootball.some(([slug]) => slug === p.slug));
assert(published.length === 5, 'five October 16 football records');
for (const [slug, pick, odds, access, best] of expectedFootball) {
  const p = published.find((entry) => entry.slug === slug);
  assert(p?.published === true && p.picks.main === pick && p.picks.publishedOdds === odds && p.access === access && Boolean(p.bestAnalysis) === best, `${slug} pick, odds and access`);
  assert(existsSync(`out/match/${slug}/index.html`), `${slug} static match page`);
  const sitemap = readFileSync(`out/sitemaps/${p?.league}/sitemap.xml`, 'utf8');
  assert(sitemap.includes(`/match/${slug}/`), `${slug} sitemap entry`);
}
const nhl = resolveNhlSlate('2026-10-13');
assert(nhl?.matches.length === 16, '16 October 13 NHL records');
for (const game of nhl?.matches ?? []) assert(!existsSync(`out/nhl/${game.slug}/index.html`), `${game.slug} has no individual NHL page`);
