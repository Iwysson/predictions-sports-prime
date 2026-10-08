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
import { hasMatchPage } from "../src/lib/match-page-lifecycle.ts";
import { predictionSlug } from "../src/lib/editorial.ts";
import { hasCompleteLocalizedEditorial } from "../src/data/localized-editorial.ts";
import { seoLocaleSlugs } from "../src/lib/seo-locales.ts";

const CHECK = process.argv.includes("--check");

// Upcoming, live and final-but-unsettled matches keep a page; FINAL + settled ones do not.
const futureCount = (editorialPredictions as any[]).filter((p) => hasMatchPage(p)).length;

// Localized routes exist only where a complete localized editorial is available. Otherwise
// they would publish untranslated pages in other locales.
const localizedCount = (editorialPredictions as any[]).reduce((n, p) => {
  if (!hasMatchPage(p)) return n;
  const slug = p.slug ?? predictionSlug(p.homeTeam, p.awayTeam);
  return n + seoLocaleSlugs.filter((locale) => hasCompleteLocalizedEditorial(slug, locale)).length;
}, 0);

const routes = [
  { template: "src/templates/match-routes/en/page.tsx", target: "src/app/(en)/match/[slug]/page.tsx", enabled: futureCount > 0 },
  { template: "src/templates/match-routes/locale/page.tsx", target: "src/app/[locale]/match/[slug]/page.tsx", enabled: futureCount > 0 && localizedCount > 0 },
];

const shouldExist = futureCount > 0;
console.log(`match-page predictions (upcoming, live or final-unsettled): ${futureCount} -> match routes ${shouldExist ? "ENABLED" : "DISABLED"}`);

for (const { template, target, enabled } of routes) {
  const targetPath = resolve(target);
  if (enabled) {
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
