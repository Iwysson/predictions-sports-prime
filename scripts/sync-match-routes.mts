// Keeps the /match/[slug] routes in step with the future-match inventory.
//
// Why: with `output: "export"`, a dynamic route with zero params fails the build,
// and empty match routes are forbidden. So the routes exist only while at least
// one published prediction has a recorded kickoff in the future.
//
// Source of truth: src/templates/match-routes/** (versioned). This script copies
// them into src/app during the build (`prebuild`) or removes them when there is
// nothing to publish. The generated route folders are git-ignored.
//
// Usage:
//   npm run match-routes:sync          write or remove the routes
//   npm run match-routes:sync -- --check   report only, change nothing

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, rmdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { isFutureFixture } from "../src/lib/fixture-state.ts";

const CHECK = process.argv.includes("--check");
const NOW = new Date();

const futureCount = (editorialPredictions as any[]).filter((p) => {
  if (p.published !== true) return false;
  if (!p.matchInfo?.date || !p.matchInfo?.time) return false; // unresolved quarantine: never published
  return isFutureFixture({ status: "published", date: p.matchInfo.date, time: p.matchInfo.time, league: p.league } as any, NOW);
}).length;

const routes = [
  { template: "src/templates/match-routes/en/page.tsx", target: "src/app/(en)/match/[slug]/page.tsx" },
  { template: "src/templates/match-routes/locale/page.tsx", target: "src/app/[locale]/match/[slug]/page.tsx" },
];

const shouldExist = futureCount > 0;
console.log(`future published predictions with recorded kickoff: ${futureCount} -> match routes ${shouldExist ? "ENABLED" : "DISABLED"}`);

for (const { template, target } of routes) {
  const targetPath = resolve(target);
  if (shouldExist) {
    const next = readFileSync(resolve(template), "utf8");
    const current = existsSync(targetPath) ? readFileSync(targetPath, "utf8") : null;
    if (current === next) { console.log(`unchanged  ${target}`); continue; }
    console.log(`${CHECK ? "would write" : "write"}      ${target}`);
    if (!CHECK) {
      mkdirSync(dirname(targetPath), { recursive: true });
      writeFileSync(targetPath, next);
    }
  } else if (existsSync(targetPath)) {
    console.log(`${CHECK ? "would remove" : "remove"}     ${target}`);
    if (!CHECK) {
      rmSync(targetPath);
      // Remove the now-empty route folders, never anything else.
      let dir = dirname(targetPath);
      const stop = resolve("src/app");
      while (dir !== stop && dir.startsWith(stop) && readdirSync(dir).length === 0) {
        rmdirSync(dir);
        dir = dirname(dir);
      }
    }
  } else {
    console.log(`absent     ${target}`);
  }
}
