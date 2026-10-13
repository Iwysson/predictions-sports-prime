import { readFileSync } from 'node:fs';
import { getNhlTodayKey } from '../src/lib/nhl-day.ts';
import { resolveNhlSlate } from '../src/data/nhl/slates.ts';
import { buildMobileNhlIndex } from '../src/lib/mobile-feed-build-nhl-nfl.ts';
import { editorialPredictions } from '../src/data/predictions/index.ts';

const { createMatchContentHandler } = await import('../functions/api/match-content/[slug].js');
const index = JSON.parse(readFileSync('functions/_data/match-content.json', 'utf8'));
const assert = (ok: unknown, label: string) => { if (!ok) throw new Error(label); console.log(`PASS ${label}`); };
const expected = { '2026-10-14': { total: 2, free: 1, best: 1, vip: 0 }, '2026-10-15': { total: 11, free: 2, best: 1, vip: 8 } } as const;
const RealDate = Date;
try {
  for (const [iso, day, count] of [
    ['2026-10-14T03:59:59Z', '2026-10-13', 16],
    ['2026-10-14T04:00:00Z', '2026-10-14', 2],
    ['2026-10-14T04:00:01Z', '2026-10-14', 2],
    ['2026-10-15T03:59:59Z', '2026-10-14', 2],
    ['2026-10-15T04:00:00Z', '2026-10-15', 11],
    ['2026-10-15T04:00:01Z', '2026-10-15', 11],
  ] as const) {
    const now = new RealDate(iso);
    assert(getNhlTodayKey(now) === day, `${iso}: New York date`);
    const slate = resolveNhlSlate(getNhlTodayKey(now));
    assert(slate?.dayKey === day && slate.matches.length === count, `${iso}: web slate ${day}, ${count} games`);
    const mobile = buildMobileNhlIndex(now);
    assert(mobile.free.length + mobile.vip.length === count, `${iso}: mobile slate ${count} games`);
    globalThis.Date = class extends RealDate { constructor(...args: any[]) { super(...(args.length ? args as [any] : [iso])); } } as DateConstructor;
    for (const target of ['2026-10-14','2026-10-15'] as const) {
      const entries = index.filter((entry: any) => entry.activeFromKey === target);
      const expectedStatus = day < target ? 404 : 401;
      const statuses = await Promise.all(entries.map(async (entry: any) => {
        const response = await createMatchContentHandler(index)({ request: new Request(`https://example.test/api/match-content/${entry.slug}`), params: { slug: entry.slug }, env: { SUPABASE_URL: 'https://supabase.test', SUPABASE_SECRET_KEY: 'sb_secret_TESTONLY', SUPABASE_PUBLISHABLE_KEY: 'pub-test' } });
        return response.status;
      }));
      assert(statuses.length === (target === '2026-10-14' ? 1 : 9) && statuses.every((status) => status === expectedStatus), `${iso}: protected ${target} status ${expectedStatus}`);
    }
  }
} finally { globalThis.Date = RealDate; }

for (const [day, counts] of Object.entries(expected)) {
  const matches = resolveNhlSlate(day)!.matches;
  assert(matches.length === counts.total && matches.filter(m=>m.access==='free').length===counts.free && matches.filter(m=>m.access==='best').length===counts.best && matches.filter(m=>m.access==='vip').length===counts.vip, `${day}: labels`);
  assert(matches.filter(m=>m.access==='free').every(m=>m.pick && m.odds && m.analysis?.length && m.sources?.length), `${day}: FREE full content without login`);
  assert(matches.filter(m=>m.access!=='free').every(m=>m.pick===undefined && m.odds===undefined && m.analysis===undefined), `${day}: no VIP/BEST public leak`);
}
const football = editorialPredictions.filter(p=>['ligue-1','bundesliga'].includes(p.league) && p.publishedAt==='2026-10-13T12:00:00.000-03:00');
assert(football.length===11, '11 new football analyses');
assert(football.filter(p=>p.league==='ligue-1').length===4 && football.filter(p=>p.league==='bundesliga').length===7, 'Ligue 1 4 / Bundesliga 7');
assert(football.filter(p=>p.access==='free').length===2 && football.filter(p=>p.bestAnalysis).length===2, 'football access labels');
assert(football.filter(p=>p.access==='free').every(p=>p.predictionAccess==='free' && p.analysisAccess==='free' && p.analysis.length>0 && p.picks.main && p.picks.publishedOdds), 'football FREE pick, odds and full analysis public');
assert(football.filter(p=>p.access!=='free').every(p=>p.predictionAccess==='vip' && p.analysisAccess==='vip'), 'football VIP/BEST protected');
const homeSource = readFileSync('src/app/(en)/page.tsx', 'utf8');
assert((homeSource.match(/Predictions by sport/g) ?? []).length===1, 'home sport block occurs once');
assert(homeSource.indexOf('<HomePredictionFeed') < homeSource.indexOf('Predictions by sport') && homeSource.indexOf('Predictions by sport') < homeSource.indexOf('How Our Football Predictions Work'), 'home sport block follows feed Results and precedes final trust section');
for (const href of ['/football-predictions/','/nfl/','/nhl/','/league/mls/']) assert(homeSource.includes(`href="${href}"`), `home sport link ${href}`);
for (const match of ['2026-10-14','2026-10-15'].flatMap(day=>resolveNhlSlate(day)!.matches)) {
  assert(!editorialPredictions.some(p=>p.slug===match.slug), `${match.slug}: no individual NHL match page`);
}
