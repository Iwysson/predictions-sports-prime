import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "src/app/layout.tsx", "src/app/about/page.tsx", "src/app/contact/page.tsx",
  "src/app/methodology/page.tsx", "src/app/editorial-policy/page.tsx",
  "src/app/results/page.tsx", "src/app/author/iwysson-nascimento/page.tsx",
  "src/app/sitemap.ts", "src/app/robots.ts", "src/components/Header.tsx",
  "src/components/Footer.tsx", "src/lib/editorial-identity.ts", "src/lib/seo.ts",
];
const entries = files.map((path) => ({
  path,
  sha256: createHash("sha256").update(readFileSync(join(root, path))).digest("hex"),
}));
const baseline = {
  schemaVersion: 1,
  purpose: "Phase 5 institutional trust, metadata, structured data and navigation checkpoint",
  createdAt: "2026-08-20T23:59:00.000-03:00",
  entries,
};
writeFileSync(join(root, "site-trust-baseline-phase5.json"), `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
console.log(`Phase 5 trust baseline written: ${entries.length} files.`);
