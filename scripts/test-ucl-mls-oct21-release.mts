import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { editorialPredictions } from '../src/data/predictions/index.ts';
import content from '../functions/_data/match-content.json';
import release from '../functions/_data/match-release.json';
import footballFeed from '../functions/_data/mobile/football.json';
import { createMatchContentHandler } from '../functions/api/match-content/[slug].js';
import { createMiddlewareHandler } from '../functions/_middleware.js';

const expected = [
  ['como-vs-manchester-united', 'free', 1.53],
  ['lille-vs-galatasaray', 'free', 1.70],
  ['aston-villa-vs-viking', 'vip', 1.55],
  ['bayern-munich-vs-arsenal', 'vip', 1.65],
  ['real-betis-vs-feyenoord', 'free', 1.64],
  ['club-brugge-vs-lens', 'vip', 1.70],
  ['inter-vs-shakhtar-donetsk', 'vip', 1.80],
  ['real-madrid-vs-rb-leipzig', 'vip', 1.57],
  ['sporting-cp-vs-lask', 'vip', 1.65],
  ['fc-cincinnati-vs-d-c-united', 'free', 1.90],
] as const;

const batch = editorialPredictions.filter(p => p.matchInfo?.date === '2026-10-21' && expected.some(([slug]) => slug === p.slug));
assert.equal(batch.length, 10);
assert.equal(batch.filter(p => p.access === 'free').length, 4);
assert.equal(batch.filter(p => p.bestAnalysis && p.access === 'vip').length, 1);
assert.equal(batch.filter(p => p.access === 'vip' && !p.bestAnalysis).length, 5);

const before = new Date('2026-10-21T02:59:59Z');
const released = new Date('2026-10-21T03:00:00Z');
const middleware = (now: Date) => createMiddlewareHandler({
  releaseDateBySlug: new Map(release.map(entry => [entry.slug, entry.date])),
  now: () => now,
});

for (const [slug, access, odds] of expected) {
  const prediction = batch.find(p => p.slug === slug);
  assert.ok(prediction, slug);
  assert.equal(prediction.editorialStandard, 'psp-v1');
  assert.equal(prediction.analysisAccess, access);
  assert.equal(prediction.predictionAccess, access);
  assert.equal(prediction.picks.publishedOdds, odds);
  assert.ok(prediction.statisticalCoreSamples?.length, `${slug}: structured Core provenance`);
  for (const sample of prediction.statisticalCoreSamples ?? []) {
    assert.equal(sample.sampleType, 'overall');
    assert.ok(sample.source && sample.sourceUrl.startsWith('https://') && sample.season && sample.scope);
  }
  assert.equal((prediction.analysis[0].match(/^### Statistical Core Predictions-Sports-Prime$/gm) ?? []).length, 1);
  const analysis = prediction.analysis[0].split('## Match analysis and tactical game state\n\n')[1]?.split('\n\n### Statistical Core')[0];
  assert.equal(analysis?.split('\n\n').length, 3, `${slug}: three supplied analysis paragraphs`);

  const entry = content.find(e => e.slug === slug);
  assert.ok(entry, slug);
  assert.equal(entry.activeFromKey, '2026-10-21');
  assert.equal(entry.releaseTimeZone, 'America/Fortaleza');
  assert.equal(entry.analysisAccess, access);
  assert.equal(entry.predictionAccess, access);
  assert.equal(entry.prediction.odds, odds);
  assert.equal(release.find(e => e.slug === slug)?.date, '2026-10-21');
  assert.ok(existsSync(`.next/server/app/match/${slug}.html`), `${slug}: generated match page`);
  assert.ok(readFileSync('.next/server/app/today-predictions.html', 'utf8').includes(`/match/${slug}`), `${slug}: Today's Football Predictions`);
  assert.ok(readFileSync(`.next/server/app/sitemaps/${prediction.league}/sitemap.xml.body`, 'utf8').includes(`/match/${slug}`), `${slug}: league sitemap`);
  assert.ok(footballFeed[access].today.some(entry => entry.slug === slug), `${slug}: football feed`);

  const path = `https://predictions-sports-prime.com/match/${slug}/index.txt`;
  const context = { request: new Request(path), next: async () => new Response('page') };
  const hidden = await middleware(before)(context);
  assert.equal(hidden.status, 307, `${slug} before fixture date`);
  assert.equal(hidden.headers.get('Location'), 'https://predictions-sports-prime.com/');
  assert.equal((await middleware(released)(context)).status, 200, `${slug} on fixture date`);

  const request = new Request(`https://predictions-sports-prime.com/api/match-content/${slug}`);
  const invoke = (now: Date) => createMatchContentHandler(content, () => now)({ request, params: { slug }, env: { SUPABASE_URL: 'https://example.invalid', SUPABASE_SECRET_KEY: 'test', SUPABASE_PUBLISHABLE_KEY: 'test' } });
  assert.equal((await invoke(before)).status, 404, `${slug} API before fixture date`);
  assert.equal((await invoke(released)).status, access === 'free' ? 200 : 401, `${slug} anonymous API access`);
}

assert.equal(batch.find(p => p.slug === 'fc-cincinnati-vs-d-c-united')?.picks.main, 'FC Cincinnati or Draw (1X) + Under 4.5 Goals');
console.log('October 21 UCL + MLS: 4 FREE, 1 BEST BET / PRIME VIP, 5 PRIME VIP; release and access PASS');
