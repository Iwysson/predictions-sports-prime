import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { editorialPredictions } from '../src/data/predictions/index.ts';
import { hasMatchPage } from '../src/lib/match-page-lifecycle.ts';
import content from '../functions/_data/match-content.json';
import release from '../functions/_data/match-release.json';
import { createMiddlewareHandler } from '../functions/_middleware.js';
import { createMatchContentHandler } from '../functions/api/match-content/[slug].js';
import nhlSlate from '../src/data/nhl/deferred-slate-2026-10-22.json';
import nbaSlate from '../src/data/nba/deferred-slate-2026-10-22.json';
import nhlProtected from '../src/data/nhl/protected-2026-10-22.json';
import nbaProtected from '../src/data/nba/protected-2026-10-22.json';
import { createNbaSlateHandler } from '../functions/api/nba/slate/[day].js';
import { createNhlSlateHandler } from '../functions/api/nhl/slate/[day].js';

const before = new Date('2026-10-22T03:59:59Z');
const at = new Date('2026-10-22T04:00:00Z');

const freeFootball = ['dinamo-zagreb-vs-nec-nijmegen', 'juventus-vs-rennes', 'sturm-graz-vs-marseille', 'olympiacos-vs-sparta-praha', 'omonia-vs-benfica', 'ferencvaros-vs-torreense', 'jagiellonia-vs-anderlecht'];
const vipFootball = ['ararat-armenia-vs-az-alkmaar', 'lech-poznan-vs-sunderland', 'ofi-crete-vs-leverkusen', 'union-sg-vs-hapoel-beer-sheva', 'besiktas-vs-crystal-palace', 'bournemouth-vs-milan', 'celtic-vs-celta', 'lillestrom-vs-real-sociedad', 'celje-vs-salzburg', 'hoffenheim-vs-lyon', 'viktoria-plzen-vs-levski-sofia'];
const libertadoresFree = ['flamengo-vs-estudiantes-combined'];
const allFootballSlugs = [...freeFootball, ...vipFootball, ...libertadoresFree];
assert.equal(allFootballSlugs.length, 19, 'expected 19 football/Libertadores October 22 slugs');
// Once a match is settled its page leaves the release manifest and content index (410 lifecycle), so the
// gate assertions below only apply to slugs that still have a match page.
const gatedFootballSlugs = allFootballSlugs.filter((slug) => hasMatchPage((editorialPredictions as any[]).find((p) => (p.slug ?? '') === slug)));

// 1. Publisher added a FREE Jagiellonia 1X prediction to the original 32-match wave.
const nbaFree = nbaSlate.matches.filter((m) => m.access === 'free').length;
const nhlFree = nhlSlate.matches.filter((m) => m.access === 'free').length;
const nhlVip = nhlSlate.matches.filter((m) => m.access === 'vip').length;
assert.equal(nbaSlate.matches.length, 2);
assert.equal(nbaFree, 2);
assert.equal(nhlSlate.matches.length, 12);
assert.equal(nhlFree, 1);
assert.equal(nhlVip, 11);
assert.equal(freeFootball.length + libertadoresFree.length, 8);
assert.equal(vipFootball.length, 11);
const totalFree = freeFootball.length + libertadoresFree.length + nbaFree + nhlFree;
const totalVip = vipFootball.length + nhlVip;
assert.equal(totalFree, 11, 'expected exactly 11 FREE across the expanded wave');
assert.equal(totalVip, 22, 'expected exactly 22 PRIME VIP across the wave');
console.log(`access split: ${totalFree} FREE, ${totalVip} PRIME VIP (33 total)`);

// 2. Every football/Libertadores slug carries the America/New_York override in all three gate layers.
for (const slug of gatedFootballSlugs) {
  const prediction = (editorialPredictions as any[]).find((p) => (p.slug ?? '') === slug);
  assert.ok(prediction, `${slug}: prediction not found`);
  assert.equal(prediction.matchInfo?.releaseTimeZone, 'America/New_York', `${slug}: matchInfo.releaseTimeZone`);
  const indexed = content.find((e: any) => e.slug === slug);
  assert.ok(indexed, `${slug}: not in match-content index`);
  assert.equal(indexed.releaseTimeZone, 'America/New_York', `${slug}: content index releaseTimeZone`);
  const manifestEntry = release.find((e: any) => e.slug === slug);
  assert.ok(manifestEntry, `${slug}: not in release manifest`);
  assert.equal(manifestEntry.timezone, 'America/New_York', `${slug}: release manifest timezone`);
}

// 3. The actual edge middleware blocks every football/Libertadores match page before 04:00 UTC and
// opens it exactly at 04:00 UTC (America/New_York midnight on 2026-10-22), never one hour early
// (America/Fortaleza midnight, 03:00 UTC, which is this site's unrelated default gate).
const middleware = (now: Date) => createMiddlewareHandler({
  releaseDateBySlug: new Map(release.map((entry: any) => [entry.slug, entry.timezone ? { date: entry.date, timezone: entry.timezone } : entry.date])),
  now: () => now,
});
for (const slug of gatedFootballSlugs) {
  const url = `https://predictions-sports-prime.com/match/${slug}/`;
  const ctx = (now: Date) => ({ request: new Request(url), next: async () => new Response('static asset') });
  const atFortaleza = new Date('2026-10-22T03:00:00Z');
  const pre = await middleware(before)(ctx(before));
  const atFortalezaResp = await middleware(atFortaleza)(ctx(atFortaleza));
  const post = await middleware(at)(ctx(at));
  assert.equal(pre.status, 307, `${slug}: must be blocked before 04:00 UTC`);
  assert.equal(pre.headers.get('location'), 'https://predictions-sports-prime.com/');
  assert.equal(pre.headers.get('cache-control'), 'no-store');
  assert.equal(atFortalezaResp.status, 307, `${slug}: must still be blocked at 03:00 UTC (Fortaleza midnight) - NOT the gate for this wave`);
  assert.equal(post.status, 200, `${slug}: must open at 04:00 UTC (New York midnight)`);
}
console.log(`middleware gate: all ${gatedFootballSlugs.length} unsettled football/Libertadores slugs closed before 04:00Z, closed at 03:00Z (Fortaleza), open at 04:00Z (New York)`);

// 4. The protected content API (/api/match-content/[slug]) follows the same instant for both tiers.
for (const slug of gatedFootballSlugs) {
  const entry = content.find((e: any) => e.slug === slug);
  const invoke = (now: Date) => createMatchContentHandler(content, () => now)({ request: new Request(`https://predictions-sports-prime.com/api/match-content/${slug}`), params: { slug }, env: {} });
  assert.equal((await invoke(before)).status, 404, `${slug}: API must 404 before release`);
  const postStatus = (await invoke(at)).status;
  assert.equal(postStatus, entry.analysisAccess === 'free' ? 200 : 503, `${slug}: API tier status after release`);
}
console.log(`match-content API: blocked pre-release for all ${gatedFootballSlugs.length} unsettled slugs (${allFootballSlugs.length - gatedFootballSlugs.length} settled), correct tier status at release`);

// 5. NHL/NBA slates stay not-found before 04:00 UTC and open at 04:00 UTC via their own deferred-slate gate.
const nb = createNbaSlateHandler(() => before);
const na = createNbaSlateHandler(() => at);
const hb = createNhlSlateHandler(() => before);
const ha = createNhlSlateHandler(() => at);
assert.equal((await nb({ params: { day: '2026-10-22' } })).status, 404);
assert.equal((await hb({ params: { day: '2026-10-22' } })).status, 404);
assert.equal((await na({ params: { day: '2026-10-22' } })).status, 200);
assert.equal((await ha({ params: { day: '2026-10-22' } })).status, 200);
console.log('NHL/NBA slate endpoints: not-found before 04:00Z, open at 04:00Z');

// 6. No new slug leaks into the static export or sitemap built before the gate opens.
const outDir = 'out';
if (existsSync(`${outDir}/sitemap.xml`)) {
  const sitemap = readFileSync(`${outDir}/sitemap.xml`, 'utf8');
  for (const slug of allFootballSlugs) {
    assert.equal(sitemap.includes(slug), false, `${slug}: must not appear in sitemap.xml before release`);
  }
  console.log('sitemap.xml: no October 22 slug present (static export reflects pre-release build time)');
} else {
  console.log('sitemap.xml not found in out/ - skip (run npm run build first if this check is needed)');
}

console.log('October 22 wave (33 matches): all checks PASS');
