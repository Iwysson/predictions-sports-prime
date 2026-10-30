// Activation (does the card exist yet?) is separate from access (who may read the pick?).
// NFL individual games: active now. Only NHL Oct-08 games and the Oct-08 multiples wait for 00:00 ET.
import { readFileSync } from "node:fs";
import { NFL_WEEK5_2026 } from "../src/data/nfl/week5-2026-public.ts";
import { NFL_WEEK6_2026 } from "../src/data/nfl/week6-2026-public.ts";
import { resolveNhlSlate } from "../src/data/nhl/slates.ts";

const mod: any = await import("../functions/api/match-content/[slug].js");
const index = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8"));
let failures = 0;
const check = (name: string, ok: boolean) => { console.log(`${ok ? "PASS" : "FAIL"} ${name}`); if (!ok) failures += 1; };

const RealDate = Date;
const at = (iso: string) => {
  globalThis.Date = class extends RealDate { constructor(...a: any[]) { super(...(a.length ? (a as [any]) : [iso])); } } as any;
};
const status = async (slug: string) => {
  const handle = mod.createMatchContentHandler(index);
  const res = await handle({ request: new Request("https://x/api/match-content/" + slug), params: { slug }, env: { SUPABASE_URL: "https://supabase.test", SUPABASE_SECRET_KEY: "sb_secret_TESTONLY", SUPABASE_PUBLISHABLE_KEY: "pub-test" } });
  return res.status;
};

const tiers = (games: typeof NFL_WEEK5_2026, t: string) => games.filter((g) => g.access === t).length;
check("NFL week 5: 15 games, 4 FREE / 2 BEST / 9 VIP", NFL_WEEK5_2026.length === 15 && tiers(NFL_WEEK5_2026, "free") === 4 && tiers(NFL_WEEK5_2026, "best") === 2 && tiers(NFL_WEEK5_2026, "vip") === 9);
const dal = NFL_WEEK5_2026.find((g) => g.slug === "dallas-cowboys-vs-tampa-bay-buccaneers");
check("NFL: Dallas/Tampa present and BEST BET with teaser", dal?.access === "best" && Boolean(dal.teaser));
check("NFL week 5: public data of BEST/VIP carries no pick, odds or analysis", NFL_WEEK5_2026.filter((g) => g.access !== "free").every((g) => g.pick === undefined && g.odds === undefined && g.analysis === undefined));

check("NFL week 6: 14 games, all PRIME VIP (no tier supplied by the package)", NFL_WEEK6_2026.length === 14 && tiers(NFL_WEEK6_2026, "vip") === 14 && tiers(NFL_WEEK6_2026, "free") === 0 && tiers(NFL_WEEK6_2026, "best") === 0);
check("NFL week 6: public data carries no pick, odds or analysis", NFL_WEEK6_2026.every((g) => g.pick === undefined && g.odds === undefined && g.analysis === undefined));

const nflSlugs = [...NFL_WEEK5_2026, ...NFL_WEEK6_2026].map((g) => g.slug);
const protectedNfl = index.filter((e: any) => nflSlugs.includes(e.slug));
check("NFL: all 25 BEST/VIP entries (11 week 5 + 14 week 6) protected and none has an activation gate", protectedNfl.length === 25 && protectedNfl.every((e: any) => !e.activeFromKey));

for (const [label, iso, nhlKey] of [
  ["2026-10-07 23:59:59 ET", "2026-10-08T03:59:59Z", "2026-10-07"],
  ["2026-10-08 00:00:00 ET", "2026-10-08T04:00:00Z", "2026-10-08"],
] as const) {
  at(iso);
  const before = label.startsWith("2026-10-07");
  const dallas = await status("dallas-cowboys-vs-tampa-bay-buccaneers");
  const all = await Promise.all(protectedNfl.map((e: any) => status(e.slug)));
  check(`${label}: all 11 protected NFL entries active (401 for visitor, never 404)`, dallas === 401 && all.every((s) => s === 401));
  const slate = resolveNhlSlate(nhlKey);
  const oct8Games = (slate?.matches ?? []).filter((m: any) => m.date === "2026-10-08").length;
  const oct8Multiples = (slate?.multiples ?? []).filter((m: any) => slate?.dayKey === "2026-10-08").length;
  const gatedSlugs = index.filter((e: any) => e.activeFromKey === "2026-10-08");
  const gated = await Promise.all(gatedSlugs.map((e: any) => status(e.slug)));
  check(`${label}: NHL Oct-08 protected entries ${before ? "hidden (404)" : "active (401)"}`, gated.length > 0 && gated.every((s) => s === (before ? 404 : 401)));
  check(`${label}: Oct-08 slate ${before ? "not resolved (0 games, 0 multiples)" : "resolved (10 games, 3 multiples)"}`, before ? oct8Games === 0 && oct8Multiples === 0 : slate?.dayKey === "2026-10-08" && slate.matches.length === 10 && (slate.multiples?.length ?? 0) === 3);
}
globalThis.Date = RealDate;
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
