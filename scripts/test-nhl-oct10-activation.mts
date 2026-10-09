// October 10 NHL slate (14 games) activates at 00:00 America/New_York with no redeploy. Time is
// simulated by overriding Date, following the same pattern as test-nhl-oct9-activation.mts.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { resolveNhlSlate } from "../src/data/nhl/slates.ts";
import { getNhlTodayKey } from "../src/lib/nhl-day.ts";

const mod: any = await import("../functions/api/match-content/[slug].js");
const index = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8"));
const env = { SUPABASE_URL: "https://supabase.test", SUPABASE_SECRET_KEY: "sb_secret_TESTONLY", SUPABASE_PUBLISHABLE_KEY: "pub-test" };
let failures = 0;
const check = (name: string, ok: boolean) => { console.log(`${ok ? "PASS" : "FAIL"} ${name}`); if (!ok) failures += 1; };

const RealDate = Date;
const at = (iso: string) => {
  globalThis.Date = class extends RealDate { constructor(...a: any[]) { super(...(a.length ? (a as [any]) : [iso])); } } as any;
};
const status = async (slug: string) => {
  const handle = mod.createMatchContentHandler(index);
  const res = await handle({ request: new Request("https://x/api/match-content/" + slug), params: { slug }, env });
  return res.status;
};
const body = async (slug: string) => {
  const handle = mod.createMatchContentHandler(index);
  const res = await handle({ request: new Request("https://x/api/match-content/" + slug), params: { slug }, env });
  return res.text();
};

const NHL_OCT_10 = [
  "boston-bruins-vs-philadelphia-flyers",
  "new-jersey-devils-vs-vancouver-canucks",
  "san-jose-sharks-vs-edmonton-oilers",
  "florida-panthers-vs-minnesota-wild",
  "buffalo-sabres-vs-utah-mammoth",
  "chicago-blackhawks-vs-carolina-hurricanes",
  "colorado-avalanche-vs-toronto-maple-leafs",
  "montreal-canadiens-vs-detroit-red-wings",
  "ottawa-senators-vs-nashville-predators",
  "pittsburgh-penguins-vs-dallas-stars",
  "st-louis-blues-vs-columbus-blue-jackets",
  "new-york-islanders-vs-tampa-bay-lightning",
  "calgary-flames-vs-anaheim-ducks",
  "vegas-golden-knights-vs-los-angeles-kings",
];

const gated = index.filter((e: any) => e.activeFromKey === "2026-10-10");
check("10 protected NHL Oct-10 entries (2 BEST + 8 VIP) carry activeFromKey; 4 FREE are public", gated.length === 10);

const slugsOf = (key: string) => (resolveNhlSlate(key)?.matches ?? []).map((m: any) => m.slug);

for (const [label, iso] of [
  ["2026-10-09 23:59:59 ET", "2026-10-10T03:59:59Z"],
  ["2026-10-10 00:00:00 ET", "2026-10-10T04:00:00Z"],
  ["2026-10-10 00:00:01 ET", "2026-10-10T04:00:01Z"],
] as const) {
  at(iso);
  const before = label.startsWith("2026-10-09");
  const key = getNhlTodayKey();
  const visible = slugsOf(key).filter((s: string) => NHL_OCT_10.includes(s));
  check(`${label}: NHL day key ${key}, Oct-10 slate games visible = ${visible.length} (${before ? "expect 0" : "expect 14"})`, before ? visible.length === 0 && key === "2026-10-09" : visible.length === 14 && key === "2026-10-10");
  const codes = await Promise.all(gated.map((e: any) => status(e.slug)));
  check(`${label}: protected NHL entries ${before ? "hidden (404)" : "active (401 for visitor)"}`, codes.every((c: number) => c === (before ? 404 : 401)));
  if (before) {
    const texts = await Promise.all(gated.map((e: any) => body(e.slug)));
    check(`${label}: hidden responses leak no pick, odds or analysis`, texts.every((t: string) => !/Boston Bruins to Win|Buffalo Sabres to Win|Colorado Avalanche to Win|Over 5\.5|Under 6\.5|1\.78|1\.89|1\.62/.test(t)));
  }
}
globalThis.Date = RealDate;

// Public data never carries protected content.
const slate = resolveNhlSlate("2026-10-10")!;
check("Oct-10 slate: 14 games, no multiples", slate.matches.length === 14 && slate.multiples.length === 0);
check("Oct-10 access mix: 4 free, 2 best, 8 vip", slate.matches.filter((m: any) => m.access === "free").length === 4 && slate.matches.filter((m: any) => m.access === "best").length === 2 && slate.matches.filter((m: any) => m.access === "vip").length === 8);
check("Oct-10 public data: only FREE carries pick/odds/analysis", slate.matches.every((m: any) => (m.access === "free") === (m.pick !== undefined && m.odds !== undefined && m.analysis !== undefined)));
check("Oct-10 teasers do not reveal the protected pick", slate.matches.filter((m: any) => m.access !== "free").every((m: any) => !/over 5\.5|under 6\.5|to win \(including|@|\b1\.\d\d\b/i.test(m.teaser)));

const protectedJson = JSON.parse(readFileSync("src/data/nhl/protected-2026-10-10.json", "utf8"));
check("Protected entries: 10 total", protectedJson.entries.length === 10);
check("Protected BEST BETs: Buffalo Sabres ML @1.89, Colorado Avalanche ML @1.62", protectedJson.entries.find((e: any) => e.slug === "buffalo-sabres-vs-utah-mammoth").odds === 1.89 && protectedJson.entries.find((e: any) => e.slug === "colorado-avalanche-vs-toronto-maple-leafs").odds === 1.62);

// FREE picks/odds unchanged from source package.
check("FREE Montreal Canadiens ML @1.73", slate.matches.find((m: any) => m.slug === "montreal-canadiens-vs-detroit-red-wings")?.odds === 1.73);
check("FREE Dallas/Pittsburgh Over 5.5 @1.68", slate.matches.find((m: any) => m.slug === "pittsburgh-penguins-vs-dallas-stars")?.odds === 1.68);
check("FREE Columbus/St. Louis Over 5.5 @1.80", slate.matches.find((m: any) => m.slug === "st-louis-blues-vs-columbus-blue-jackets")?.odds === 1.80);
check("FREE LA Kings/Vegas Over 5.5 @1.80", slate.matches.find((m: any) => m.slug === "vegas-golden-knights-vs-los-angeles-kings")?.odds === 1.80);

console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
