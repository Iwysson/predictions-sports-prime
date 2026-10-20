import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import nbaSlate from '../src/data/nba/deferred-slate-2026-10-21.json';
import nhlSlate from '../src/data/nhl/deferred-slate-2026-10-21.json';
import nbaProtected from '../src/data/nba/protected-2026-10-21.json';
import nhlProtected from '../src/data/nhl/protected-2026-10-21.json';
import content from '../functions/_data/match-content.json';
import release from '../functions/_data/match-release.json';
import { createNbaSlateHandler } from '../functions/api/nba/slate/[day].js';
import { createNhlSlateHandler } from '../functions/api/nhl/slate/[day].js';
import { createMatchContentHandler } from '../functions/api/match-content/[slug].js';
import { createMiddlewareHandler } from '../functions/_middleware.js';
import { buildMobileNhlIndex } from '../src/lib/mobile-feed-build-nhl-nfl.ts';

const before = new Date('2026-10-21T03:59:59Z');
const at = new Date('2026-10-21T04:00:00Z');
assert.equal(nbaSlate.matches.length, 11);
assert.equal(nhlSlate.matches.length, 2);
assert.equal(nbaProtected.entries.length, 11);
assert.equal(nhlProtected.entries.length, 2);
assert.equal(nbaSlate.matches.filter(m => m.access === 'free').length, 11);
assert.equal(nhlSlate.matches.find(m => m.slug === 'buffalo-sabres-vs-philadelphia-flyers')?.access, 'free');
assert.equal(nhlSlate.matches.find(m => m.slug === 'ottawa-senators-vs-florida-panthers')?.access, 'vip');

const all = [...nbaSlate.matches, ...nhlSlate.matches];
assert.equal(new Set(all.map(m => m.slug)).size, 13);
const nb = createNbaSlateHandler(() => before);
const na = createNbaSlateHandler(() => at);
const hb = createNhlSlateHandler(() => before);
const ha = createNhlSlateHandler(() => at);
assert.equal((await nb({params:{day:'2026-10-21'}})).status, 404);
assert.equal((await hb({params:{day:'2026-10-21'}})).status, 404);
assert.equal((await na({params:{day:'2026-10-21'}})).status, 200);
assert.equal((await ha({params:{day:'2026-10-21'}})).status, 200);
assert.equal(buildMobileNhlIndex(before).free.some(m => m.slug === nhlSlate.matches[0].slug), false);
assert.equal(buildMobileNhlIndex(at).free.some(m => m.slug === nhlSlate.matches[0].slug), true);
assert.equal(buildMobileNhlIndex(at).vip.some(m => m.slug === nhlSlate.matches[1].slug), true);

const outNba = readFileSync('out/nba/index.html', 'utf8');
const outNhl = readFileSync('out/nhl/index.html', 'utf8');
const sitemap = readFileSync('out/sitemap.xml', 'utf8');
const publicFiles: string[] = [];
function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const file = `${dir}/${name}`;
    if (statSync(file).isDirectory()) walk(file);
    else if (/\.(?:html|js|json|txt|xml)$/.test(name)) publicFiles.push(file);
  }
}
walk('out');
const publicCorpus = publicFiles.map(file => readFileSync(file, 'utf8')).join('\n');
for (const m of all) {
  const protectedEntry = [...nbaProtected.entries, ...nhlProtected.entries].find(e => e.slug === m.slug);
  const indexed = content.find(e => e.slug === m.slug);
  const manifest = release.find(e => e.slug === m.slug);
  assert.ok(protectedEntry && indexed && manifest, m.slug);
  assert.equal(indexed.activeFromKey, '2026-10-21', m.slug);
  assert.equal(indexed.releaseTimeZone, 'America/New_York', m.slug);
  assert.equal(manifest.timezone, 'America/New_York', m.slug);
  assert.equal(indexed.analysisAccess, m.access, m.slug);
  assert.equal(indexed.predictionAccess, m.access, m.slug);
  assert.equal(indexed.prediction.main, protectedEntry.pick, m.slug);
  assert.equal(indexed.prediction.odds, protectedEntry.odds, m.slug);
  assert.equal(outNba.includes(m.slug), false, m.slug);
  assert.equal(outNhl.includes(m.slug), false, m.slug);
  assert.equal(sitemap.includes(m.slug), false, m.slug);
  assert.equal(publicCorpus.includes(m.slug), false, `${m.slug} static export`);
  const request = new Request(`https://predictions-sports-prime.com/api/match-content/${m.slug}`);
  const invoke = (now: Date) => createMatchContentHandler(content, () => now)({request,params:{slug:m.slug},env:{}});
  assert.equal((await invoke(before)).status, 404, `${m.slug} pre-release API`);
  assert.equal((await invoke(at)).status, m.access === 'free' ? 200 : 503, `${m.slug} post-release API tier`);
  const path = nbaSlate.matches.includes(m as any) ? 'nba' : 'nhl';
  for (const suffix of ['', '/index.html', '/index.txt']) {
    const url = `https://predictions-sports-prime.com/${path}/${m.slug}${suffix}`;
    const ctx = {request:new Request(url), next:async()=>new Response('static asset')};
    const pre = await createMiddlewareHandler({now:()=>before})(ctx);
    const post = await createMiddlewareHandler({now:()=>at})(ctx);
    assert.equal(pre.status, 307, `${m.slug} ${suffix} pre-release redirect`);
    assert.equal(pre.headers.get('location'), 'https://predictions-sports-prime.com/');
    assert.equal(pre.headers.get('cache-control'), 'no-store');
    assert.equal(post.status, 200, `${m.slug} ${suffix} post-release pass through`);
  }
}
console.log('October 21 release: 13 unique entries; 12 FREE and 1 PRIME VIP; 03:59:59Z closed, 04:00:00Z open; static, API, mobile, sitemap, cache and direct paths PASS');
