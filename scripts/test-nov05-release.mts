import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { editorialPredictions } from '../src/data/predictions/index.ts';
import { parsePredictionMarket } from '../src/lib/prediction-results.ts';
import { createMiddlewareHandler } from '../functions/_middleware.js';
import { createMatchContentHandler } from '../functions/api/match-content/[slug].js';

const expected = new Map<string, [string, number]>([
  ['palmeiras-vs-remo', ['Palmeiras -1.5 Asian Handicap', 1.66]],
  ['cruzeiro-vs-bahia', ['Cruzeiro or Draw (1X) + Under 4.5 Total Goals', 1.60]],
  ['anderlecht-vs-rb-salzburg', ['Over 2.5 Total Goals', 1.60]],
  ['levski-sofia-vs-jagiellonia-bialystok', ['Levski or Draw (1X) + Over 1.5 Total Goals', 1.70]],
  ['ac-milan-vs-ferencvaros', ['AC Milan Win + Over 2.5 Total Goals', 1.74]],
  ['real-sociedad-vs-lyon', ['Over 2.5 Total Goals', 1.60]],
  ['sparta-praha-vs-afc-bournemouth', ['Over 2.5 Total Goals', 1.65]],
  ['nec-nijmegen-vs-omonia-nicosia', ['NEC Nijmegen Win', 1.79]],
  ['lillestrom-sk-vs-viktoria-plzen', ['Lillestrøm or Draw (1X)', 1.65]],
  ['crystal-palace-vs-tsg-hoffenheim', ['Over 2.5 Total Goals', 1.55]],
  ['bayer-leverkusen-vs-olympique-marseille', ['Over 3.5 Total Goals', 2.00]],
  ['az-alkmaar-vs-juventus', ['Juventus or Draw (X2) + Over 1.5 Total Goals', 1.70]],
  ['benfica-vs-lech-poznan', ['Benfica Win + Under 4.5 Total Goals', 1.70]],
  ['hapoel-beer-sheva-vs-ofi-crete', ['Hapoel Be’er Sheva or Draw (1X) + Over 1.5 Total Goals', 1.77]],
  ['sk-sturm-graz-vs-nk-celje', ['SK Sturm Graz Win', 1.55]],
  ['sunderland-vs-dinamo-zagreb', ['Sunderland Win + Over 1.5 Total Goals', 1.70]],
  ['torreense-vs-ararat-armenia', ['Torreense Win', 1.72]],
  ['celta-vigo-vs-union-saint-gilloise', ['Celta Vigo or Draw (1X) + Over 1.5 Total Goals', 1.70]],
  ['celtic-vs-besiktas', ['Over 2.5 Total Goals', 1.60]],
]);

const wave = editorialPredictions.filter(x => x.matchInfo?.date === '2026-11-05' && expected.has(x.slug ?? ''));
assert.equal(wave.length, 19);
assert.equal(new Set(wave.map(x => x.slug)).size, 19);
const content = JSON.parse(readFileSync('functions/_data/match-content.json', 'utf8')) as Array<any>;
const manifest = JSON.parse(readFileSync('functions/_data/match-release.json', 'utf8')) as Array<any>;
const before = new Date('2026-11-05T04:59:59Z');
const at = new Date('2026-11-05T05:00:00Z');
const release = new Map([...expected.keys()].map(slug => [slug, {date: '2026-11-05', timezone: 'America/New_York'}]));
const middleware = (now: Date) => createMiddlewareHandler({settledSlugs: new Set(), releaseDateBySlug: release, gatedSitemapEntries: new Map(), now: () => now});

for (const p of wave) {
  const slug = p.slug!;
  const [pick, odds] = expected.get(slug)!;
  assert.equal(p.picks.main, pick, slug);
  assert.equal(p.picks.publishedOdds, odds, slug);
  assert.deepEqual([p.access, p.analysisAccess, p.predictionAccess], ['free','free','free'], slug);
  assert.equal(p.editorialStandard, 'psp-v1');
  assert.equal(p.matchInfo?.releaseTimeZone, 'America/New_York');
  assert.equal(p.published, true);
  assert.deepEqual(parsePredictionMarket(pick).unsupportedLegs, [], `${slug}: unsupported market`);
  const text = p.analysis.join('\n');
  assert.equal((text.match(/^### Statistical Core Predictions-Sports-Prime$/gm) ?? []).length, 1, slug);
  assert.equal((text.match(/^\| (?!Metric|---)/gm) ?? []).length, 23, `${slug}: Core rows`);
  assert.equal((text.match(/^### (?:Match Context|Statistical Analysis|Tactical Analysis|Betting Analysis)$/gm) ?? []).length, 4, `${slug}: analysis paragraphs`);
  assert.equal((text.match(/^\*\*[^\n]+\(projected\):\*\*/gm) ?? []).length, 2, `${slug}: projected XIs`);
  assert.ok(text.endsWith(`**Prediction:** **${pick}**\n**Odds:** **${odds.toFixed(2)}**`), slug);
  const entry = content.filter(x => x.slug === slug);
  assert.equal(entry.length, 1, `${slug}: content entry`);
  assert.deepEqual([entry[0].analysisAccess, entry[0].predictionAccess], ['free','free']);
  assert.equal(entry[0].activeFromKey, '2026-11-05');
  assert.equal(entry[0].releaseTimeZone, 'America/New_York');
  assert.equal(manifest.find(x => x.slug === slug)?.timezone, 'America/New_York');
  const page = (now: Date) => middleware(now)({request: new Request(`https://predictions-sports-prime.com/match/${slug}/`), next: async () => new Response('page')} as never);
  assert.equal((await page(before)).status, 307, `${slug}: page before release`);
  assert.equal((await page(at)).status, 200, `${slug}: page at release`);
  const api = (now: Date) => createMatchContentHandler(content, () => now)({request: new Request(`https://predictions-sports-prime.com/api/match-content/${slug}`), params: {slug}, env: {}} as never);
  assert.equal((await api(before)).status, 404, `${slug}: API before release`);
  assert.equal((await api(at)).status, 200, `${slug}: API at release`);
}
console.log('November 5 release tests passed: 19 FREE, 0 VIP; markets, Core, lineups, page/API gates.');
