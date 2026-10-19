import assert from 'node:assert/strict';
import content from '../functions/_data/match-content.json';
import release from '../functions/_data/match-release.json';
import slate from '../src/data/nhl/deferred-slate-2026-10-20.json';
import protectedSlate from '../src/data/nhl/protected-2026-10-20.json';
import { createMatchContentHandler } from '../functions/api/match-content/[slug].js';
import { createMiddlewareHandler } from '../functions/_middleware.js';
import { isNhlSlateReleased } from '../src/lib/nhl-publication-policy.ts';
import routes from '../public/_routes.json';

assert.equal(routes.include.includes('/*'),true);
assert.equal(routes.exclude.some(pattern=>pattern==='/*.html'||pattern==='/*.txt'),false,'Cloudflare must invoke middleware for match HTML and RSC text assets');

const football = [
  ['braga-vs-gil-vicente','2026-10-19','free',1.71],
  ['vasco-da-gama-vs-boca-juniors','2026-10-20','free',1.45],
  ['flamengo-vs-estudiantes','2026-10-22','free',1.41],
  ['palmeiras-vs-fluminense','2026-10-21','vip',1.71],
  ['montevideo-city-torque-vs-atletico-mg','2026-10-21','vip',1.91],
] as const;
const nhlSlugs = new Set(slate.matches.map(m=>m.slug));
assert.equal(slate.matches.length,11);
assert.equal(protectedSlate.entries.length,11);
assert.equal(slate.matches.filter(m=>m.access==='free').length,4);
assert.equal(slate.matches.filter(m=>m.access==='vip').length,7);
assert.equal(football.filter(([, ,tier])=>tier==='free').length,3);
assert.equal(football.filter(([, ,tier])=>tier==='vip').length,2);
assert.equal(new Set([...nhlSlugs,...football.map(([slug])=>slug)]).size,16);
assert.equal(isNhlSlateReleased({date:'2026-10-20',timezone:'America/New_York'},new Date('2026-10-20T03:59:59Z')),false);
assert.equal(isNhlSlateReleased({date:'2026-10-20',timezone:'America/New_York'},new Date('2026-10-20T04:00:00Z')),true);

for (const match of slate.matches) {
  const entry = protectedSlate.entries.find(e=>e.slug===match.slug);
  assert.ok(entry);
  assert.equal(entry.analysisAccess,match.access);
  assert.equal(entry.predictionAccess,match.access);
  assert.equal(entry.analysis.length,1);
  assert.equal(entry.odds > 1,true);
  const indexed = content.find(e=>e.slug===match.slug);
  assert.equal(indexed?.activeFromKey,'2026-10-20');
  assert.equal(indexed?.releaseTimeZone,'America/New_York');
}
for (const [slug,date,tier,odds] of football) {
  const entry = content.find(e=>e.slug===slug);
  assert.ok(entry,slug);
  assert.equal(entry.activeFromKey,date);
  assert.equal(entry.releaseTimeZone,'America/Fortaleza');
  assert.equal(entry.analysisAccess,tier);
  assert.equal(entry.prediction.odds,odds);
  assert.equal(release.find(e=>e.slug===slug)?.date,date);
  const before = new Date(`${date}T02:59:59Z`);
  const after = new Date(`${date}T03:00:00Z`);
  const request = new Request(`https://predictions-sports-prime.com/api/match-content/${slug}`);
  const invoke = (now:Date) => createMatchContentHandler(content,()=>now)({request,params:{slug},env:{}});
  assert.equal((await invoke(before)).status,404,`${slug} API before midnight`);
  assert.notEqual((await invoke(after)).status,404,`${slug} API at midnight`);
  const middleware = (now:Date) => createMiddlewareHandler({releaseDateBySlug:new Map(release.map(e=>[e.slug,e.date])),now:()=>now});
  const context = {request:new Request(`https://predictions-sports-prime.com/match/${slug}/index.txt`),next:async()=>new Response('private')};
  assert.equal((await middleware(before)(context)).status,307,`${slug} HTML asset before midnight`);
  assert.equal((await middleware(after)(context)).status,200,`${slug} HTML asset at midnight`);
}
console.log('16 predictions: 7 FREE, 9 PRIME VIP; football and NHL release gates PASS');
