// October 9 NHL slate (4 games) activates at 00:00 America/New_York with no redeploy; the two
// Brasileirão Round 30 games are visible immediately. Time is simulated by overriding Date.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { resolveNhlSlate } from "../src/data/nhl/slates.ts";
import { getNhlTodayKey } from "../src/lib/nhl-day.ts";
import { settleNhlPrediction, buildNhlHistoryDay } from "../src/lib/nhl-results.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";

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

const NHL = [
  "detroit-red-wings-vs-seattle-kraken",
  "columbus-blue-jackets-vs-pittsburgh-penguins",
  "washington-capitals-vs-new-york-rangers",
  "winnipeg-jets-vs-anaheim-ducks",
];
const gated = index.filter((e: any) => e.activeFromKey === "2026-10-09");
check("3 protected NHL Oct-09 entries (BEST + 2 VIP) carry activeFromKey; FREE is public", gated.length === 3);

const slugsOf = (key: string) => (resolveNhlSlate(key)?.matches ?? []).map((m: any) => m.slug);
const bra = editorialPredictions.filter((p: any) => p.league === "brasileirao-serie-a" && (p.slug === "sao-paulo-vs-vitoria" || p.slug === "vasco-vs-remo"));
check("Brasileirão: 2 predictions registered, published, psp-v1, English", bra.length === 2 && bra.every((p: any) => p.published === true && p.editorialStandard === "psp-v1" && p.analysisLanguage === "en"));
check("Brasileirão: picks and odds unchanged", bra.find((p: any) => p.slug === "sao-paulo-vs-vitoria")?.picks.main === "São Paulo to Win" && bra.find((p: any) => p.slug === "sao-paulo-vs-vitoria")?.picks.publishedOdds === 1.67 && bra.find((p: any) => p.slug === "vasco-vs-remo")?.picks.main === "Vasco da Gama to Win" && bra.find((p: any) => p.slug === "vasco-vs-remo")?.picks.publishedOdds === 1.33);

for (const [label, iso] of [
  ["2026-10-08 23:59:59 ET", "2026-10-09T03:59:59Z"],
  ["2026-10-09 00:00:00 ET", "2026-10-09T04:00:00Z"],
  ["2026-10-09 00:00:01 ET", "2026-10-09T04:00:01Z"],
] as const) {
  at(iso);
  const before = label.startsWith("2026-10-08");
  const key = getNhlTodayKey();
  const visible = slugsOf(key).filter((s: string) => NHL.includes(s));
  check(`${label}: NHL day key ${key}, Oct-09 slate games visible = ${visible.length} (${before ? "expect 0" : "expect 4"})`, before ? visible.length === 0 && key === "2026-10-08" : visible.length === 4 && key === "2026-10-09");
  const codes = await Promise.all(gated.map((e: any) => status(e.slug)));
  check(`${label}: protected NHL entries ${before ? "hidden (404)" : "active (401 for visitor)"}`, codes.every((c: number) => c === (before ? 404 : 401)));
  const braCodes = await Promise.all(bra.map((p: any) => status(p.slug)));
  check(`${label}: Brasileirão protected entries visible (401, never 404)`, braCodes.every((c: number) => c === 401));
  if (before) {
    const texts = await Promise.all(gated.map((e: any) => body(e.slug)));
    check(`${label}: hidden responses leak no pick, odds or analysis`, texts.every((t: string) => !/Over 5\.5|1\.63|1\.85|1\.91|Winnipeg Jets to Win|Puck drop/.test(t)));
  }
}
globalThis.Date = RealDate;

// Public data never carries protected content.
const slate = resolveNhlSlate("2026-10-09")!;
check("Oct-09 slate: 4 games, FREE/BEST/VIP/VIP, no multiples", slate.matches.length === 4 && slate.matches.map((m: any) => m.access).join() === "free,best,vip,vip" && slate.multiples.length === 0);
check("Oct-09 public data: only FREE carries pick/odds/analysis", slate.matches.every((m: any) => (m.access === "free") === (m.pick !== undefined && m.odds !== undefined && m.analysis !== undefined)));
check("Oct-09 FREE: Detroit to Win incl. OT & Shootout @1.88", slate.matches[0].pick === "Detroit Red Wings to Win (Including OT & Shootout)" && slate.matches[0].odds === 1.88);
check("Oct-09 teasers do not reveal the protected pick", slate.matches.filter((m: any) => m.access !== "free").every((m: any) => !/over 5\.5|to win|@|\b1\.\d\d\b/i.test(m.teaser)));
const protectedJson = JSON.parse(readFileSync("src/data/nhl/protected-2026-10-09.json", "utf8"));
check("Protected picks/odds: BEST Over 5.5 @1.63, Rangers Over 5.5 @1.85, Winnipeg incl. OT & Shootout @1.91", protectedJson.entries.map((e: any) => `${e.pick}@${e.odds}`).join("|") === "Over 5.5 Total Goals@1.63|Over 5.5 Total Goals@1.85|Winnipeg Jets to Win (Including OT & Shootout)@1.91");

// Automatic settlement.
const win = { homeScore: 4, awayScore: 3, state: "finished" as const };
check("settle: Detroit (home) wins 4-3 in OT -> win", settleNhlPrediction("Detroit Red Wings to Win (Including OT & Shootout)", "Detroit Red Wings", "Seattle Kraken", win) === "win");
check("settle: Winnipeg loses 2-3 -> loss", settleNhlPrediction("Winnipeg Jets to Win (Including OT & Shootout)", "Winnipeg Jets", "Anaheim Ducks", { homeScore: 2, awayScore: 3, state: "finished" }) === "loss");
check("settle: Over 5.5 Total Goals 7 goals -> win; 5 goals -> loss; not final -> pending", settleNhlPrediction("Over 5.5 Total Goals", "A", "B", { homeScore: 4, awayScore: 3, state: "finished" }) === "win" && settleNhlPrediction("Over 5.5 Total Goals", "A", "B", { homeScore: 3, awayScore: 2, state: "finished" }) === "loss" && settleNhlPrediction("Over 5.5 Total Goals", "A", "B", { homeScore: 1, awayScore: 0, state: "live" as any }) === "pending");
const hist = buildNhlHistoryDay("2026-10-09", []);
check("history: before any game is final only the FREE pick is exposed (pending)", hist.rows.length === 1 && hist.rows[0].slug === "detroit-red-wings-vs-seattle-kraken" && hist.rows[0].result === "pending");

console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
