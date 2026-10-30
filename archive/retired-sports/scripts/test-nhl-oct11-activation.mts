import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveNhlSlate } from "../src/data/nhl/slates.ts";
import { getNhlTodayKey } from "../src/lib/nhl-day.ts";
import { buildMobileNhlIndex } from "../src/lib/mobile-feed-build-nhl-nfl.ts";
import { createMobileNhlFeedHandler } from "../functions/api/mobile/nhl/feed.js";

const matchContentModule: any = await import("../functions/api/match-content/[slug].js");
const matchContentIndex = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8"));
const matchContentEnv = {
  SUPABASE_URL: "https://supabase.test",
  SUPABASE_SECRET_KEY: "sb_secret_TESTONLY",
  SUPABASE_PUBLISHABLE_KEY: "pub-test",
};
const RealDate = Date;
const protectedStatus = async (slug: string, iso: string) => {
  globalThis.Date = class extends RealDate {
    constructor(...args: any[]) {
      super(...(args.length ? (args as [any]) : [iso]));
    }
  } as DateConstructor;
  try {
    const handler = matchContentModule.createMatchContentHandler(matchContentIndex);
    const response = await handler({
      request: new Request(`https://example.test/api/match-content/${slug}`),
      params: { slug },
      env: matchContentEnv,
    });
    return response.status;
  } finally {
    globalThis.Date = RealDate;
  }
};

const OCT_11 = [
  "seattle-kraken-vs-washington-capitals",
  "vancouver-canucks-vs-new-york-rangers",
  "carolina-hurricanes-vs-philadelphia-flyers",
];
const moments = [
  ["2026-10-11T03:59:59.000Z", false],
  ["2026-10-11T04:00:00.000Z", true],
  ["2026-10-11T04:00:01.000Z", true],
] as const;

for (const [iso, active] of moments) {
  const now = new Date(iso);
  const key = getNhlTodayKey(now);
  const web = resolveNhlSlate(key)?.matches ?? [];
  const mobile = buildMobileNhlIndex(now);
  const webSlugs = new Set(web.map((m) => m.slug));
  const mobileSlugs = new Set([...mobile.free, ...mobile.vip].map((m) => m.slug));
  assert.deepEqual(mobileSlugs, webSlugs, `${iso}: web/mobile slate mismatch`);
  assert.equal(OCT_11.every((slug) => webSlugs.has(slug)), active, `${iso}: Oct 11 activation mismatch`);

  const response = await createMobileNhlFeedHandler(() => now)();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "public, max-age=0", `${iso}: mobile feed must not cross midnight in CDN cache`);
  const payload = await response.json() as { free: Array<{ slug: string }>; vip: Array<{ slug: string }> };
  assert.deepEqual(new Set([...payload.free, ...payload.vip].map((m) => m.slug)), webSlugs, `${iso}: API/web mismatch`);

  for (const slug of [OCT_11[0], OCT_11[2]]) {
    assert.equal(await protectedStatus(slug, iso), active ? 401 : 404, `${iso}: protected payload gate mismatch for ${slug}`);
  }
}

const gated = matchContentIndex.filter((entry: { activeFromKey?: string }) => entry.activeFromKey === "2026-10-11");
assert.equal(gated.length, 2, "BEST BET and PRIME VIP entries must be midnight-gated");
assert.ok(gated.every((entry: { predictionAccess: string; analysisAccess: string }) => entry.predictionAccess === "vip" && entry.analysisAccess === "vip"));

const slate = resolveNhlSlate("2026-10-11");
assert.equal(slate?.matches.length, 3);
assert.equal(slate?.matches.find((m) => m.slug === OCT_11[0])?.access, "best");
assert.deepEqual(
  { pick: slate?.matches.find((m) => m.slug === OCT_11[1])?.pick, odds: slate?.matches.find((m) => m.slug === OCT_11[1])?.odds },
  { pick: "New York Rangers to Win (Including OT & Shootout)", odds: 1.43 },
);
assert.equal(slate?.matches.find((m) => m.slug === OCT_11[2])?.access, "vip");

console.log("NHL October 11 midnight activation, access and web/mobile parity: PASS");
