// NHL settlement coverage report. Fetches the official final scores (api-web.nhle.com) for every published NHL day and
// prints, per day: games published, games already FINAL, settled results, pending, unsupported. Nothing is typed in by
// hand; a day that is not released yet at `--at` (default: now) reports 0 rows because the history never reveals it.
// Run: npx tsx scripts/report-nhl-settlement.mts [--at=2026-10-17T04:00:00Z]
import { SLATES } from "../src/data/nhl/slates.ts";
import { deferredMatchesFor } from "../src/data/nhl/deferred-slates.ts";
import { PROTECTED_NHL_PICKS_BY_DAY } from "../src/data/nhl/protected-registry.ts";
import { buildNhlHistoryDay, getNhlFullPredictionsForDay } from "../src/lib/nhl-results.ts";
import { normalizeFinalScores } from "../src/lib/nhl-live.ts";

const atArg = process.argv.find((a) => a.startsWith("--at="))?.slice(5);
const now = atArg ? new Date(atArg) : new Date();

const rows: string[][] = [["day", "published", "protected picks", "FINAL", "settled (W/L/P/V)", "pending", "unsupported", "status"]];
for (const slate of SLATES) {
  const listed = slate.deferred ? deferredMatchesFor(slate.dayKey).length : slate.matches.length;
  const protectedCount = (PROTECTED_NHL_PICKS_BY_DAY[slate.dayKey] ?? []).length;
  const res = await fetch(`https://api-web.nhle.com/v1/score/${slate.dayKey}`, { headers: { Accept: "application/json" } }).catch(() => null);
  const scores = res?.ok ? (normalizeFinalScores(await res.json()) ?? []) : [];
  const day = buildNhlHistoryDay(slate.dayKey, scores, now);
  const predictions = getNhlFullPredictionsForDay(slate.dayKey, now);
  const count = (r: string) => day.rows.filter((row) => row.result === r).length;
  const finals = scores.filter((s) => s.state === "finished").length;
  const settledTotal = day.rows.filter((r) => ["win", "loss", "push", "void"].includes(r.result)).length;
  rows.push([
    slate.dayKey,
    String(listed),
    String(protectedCount),
    predictions.length === 0 && listed > 0 ? "gated" : String(finals),
    `${settledTotal} (${count("win")}/${count("loss")}/${count("push")}/${count("void")})`,
    String(count("pending")),
    String(count("unsupported")),
    predictions.length === 0 && listed > 0 ? "not released at this instant" : settledTotal === day.rows.length && day.rows.length ? "fully settled" : "partially settled / pending finals",
  ]);
}
const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
console.log(`NHL settlement report at ${now.toISOString()}`);
for (const r of rows) console.log(r.map((c, i) => c.padEnd(widths[i])).join("  "));
