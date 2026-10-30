// The site is football-only: every NBA, NHL and NFL URL answers 410, and no built surface carries them.
// Parts that read out/ need a fresh build. Run: npm run test:retired-sports
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createMiddlewareHandler } from "../functions/_middleware.js";

const handler = createMiddlewareHandler({ settledSlugs: new Set(), releaseDateBySlug: new Map(), gatedSitemapEntries: new Map() });
const request = (path: string) => handler({ request: new Request(`https://predictions-sports-prime.com${path}`), next: async () => new Response("static", { status: 200 }) } as never);

for (const path of [
  "/nba/", "/nhl/", "/nfl/", "/nba", "/nhl", "/nfl",
  "/nba/los-angeles-lakers-vs-boston-celtics/", "/nhl/buffalo-sabres-vs-boston-bruins/", "/nfl/chiefs-vs-bills/",
  "/pt-br/nfl/", "/es/nfl/", "/nfl/index.html", "/nfl.txt", "/nhl/index.txt", "/NBA/",
  "/api/nba/slate/2026-10-23", "/api/nhl/slate/2026-10-23", "/api/nhl/history", "/api/nhl/status", "/api/mobile/nhl/feed", "/api/mobile/nfl/feed",
]) {
  const response = await request(path);
  assert.equal(response.status, 410, path);
  assert.equal(response.headers.get("location"), null, `${path} must not redirect`);
  assert.ok((await response.text()).length > 0, `${path} must have a body`);
}
const gone = await request("/nfl/");
assert.match(gone.headers.get("x-robots-tag") ?? "", /noindex/);

// Football paths are untouched by the retirement rule, including names that merely start with those letters.
for (const path of ["/", "/results/", "/football-predictions/", "/match/lille-vs-lens/", "/api/results/", "/api/mobile/football/feed", "/nflx/", "/match/nhl-style-slug/"]) {
  assert.equal((await request(path)).status, 200, path);
}

// The records are preserved, outside every built path.
for (const path of ["archive/retired-sports/src/data/nhl/slates.ts", "archive/retired-sports/src/data/nfl/weeks.ts", "archive/retired-sports/src/data/nba/slates.ts"]) {
  assert.ok(existsSync(path), `${path} must be preserved`);
}
for (const path of ["src/data/nba", "src/data/nhl", "src/data/nfl", "src/app/(en)/nba", "src/app/(en)/nhl", "src/app/(en)/nfl", "functions/api/nba", "functions/api/nhl", "functions/api/mobile/nhl", "functions/api/mobile/nfl", ".github/workflows/update-nfl-standings.yml"]) {
  assert.ok(!existsSync(path), `${path} must no longer exist in a built path`);
}

// Protected and mobile data bundled with the Functions.
const content = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8")) as Array<{ slug: string; prediction?: { main?: string } }>;
assert.ok(!content.some((entry) => /\(Including OT\/SO\)|\bPuck Line\b/i.test(entry.prediction?.main ?? "")), "no retired-sport pick in match-content.json");
assert.ok(!existsSync("functions/_data/mobile/nhl.json") && !existsSync("functions/_data/mobile/nfl.json"));

if (!existsSync("out/index.html")) {
  console.log("retired sports tests passed (no out/; build-output checks skipped)");
  process.exit(0);
}

// Built output: no page, no link, no sitemap entry, no structured data.
for (const route of ["nba", "nhl", "nfl", "pt-br/nfl", "es/nfl"]) assert.ok(!existsSync(`out/${route}`), `out/${route} exists`);
const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const files = walk("out").filter((file) => /\.(?:html|xml|txt|json)$/.test(file));
assert.ok(files.length > 100, "out/ looks incomplete");
const offenders: string[] = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  if (/(?:href|src)=\\?"(?:\/[a-z]{2}(?:-[a-z]{2})?)?\/(?:nba|nhl|nfl)\//.test(text) || /predictions-sports-prime\.com\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?(?:nba|nhl|nfl)\//.test(text)) offenders.push(`${file}: link`);
  if (/\b(?:NFL|NHL|NBA) (?:predictions|picks|hub)\b/i.test(text)) offenders.push(`${file}: copy`);
}
assert.deepEqual(offenders.slice(0, 20), []);
const home = readFileSync("out/index.html", "utf8");
assert.ok(!/\b(?:NFL|NHL|NBA)\b/.test(home.replace(/<script[\s\S]*?<\/script>/g, "")), "the homepage markup mentions no retired sport");
assert.ok(readFileSync("out/results/index.html", "utf8").includes('id="league-performance-heading"'));

console.log("retired sports tests passed");
