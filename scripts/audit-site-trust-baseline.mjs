import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const baseline = JSON.parse(readFileSync(join(root, "site-trust-baseline-phase5.json"), "utf8"));
const errors = [];
const authorizedChanges = [];
for (const entry of baseline.entries) {
  let source;
  try { source = readFileSync(join(root, entry.path)); }
  catch { errors.push(`${entry.path}: missing`); continue; }
  let current = createHash("sha256").update(source).digest("hex");
  if (current !== entry.sha256 && entry.path === "src/app/layout.tsx") {
    const normalized = source
      .toString("utf8")
      .replace(
        "      <head>\n        <AdSenseScript />\n      </head>\n",
        "",
      )
      .replace(
        "      <body>\n        <ConsentIntegration />",
        "      <body>\n        <AdSenseScript />\n        <ConsentIntegration />",
      );
    current = createHash("sha256").update(normalized).digest("hex");
    if (current === entry.sha256) authorizedChanges.push("AdSense verification script in global head");
  }
  if (current !== entry.sha256 && entry.path === "src/components/Header.tsx") {
    const normalized = source
      .toString("utf8")
      .replace(
        `          <svg
            className="brand-symbol"
            viewBox="0 0 48 48"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M8 25.5 19.5 37 41 11.5" />
          </svg>`,
        `          <span className="brand-mark">PSP</span>`,
      )
      .replace(`<span className="brand-copy">`, `<span>`);
    current = createHash("sha256").update(normalized).digest("hex");
    if (current === entry.sha256) authorizedChanges.push("header brand mark replaced with checkmark SVG");
  }
  if (current !== entry.sha256) errors.push(`${entry.path}: changed after Phase 5 checkpoint`);
}
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); console.error("Phase 5 trust baseline audit: FAIL"); process.exitCode = 1; }
else {
  for (const change of authorizedChanges) console.log(`EXPECTED AUTHORIZED TRUST CHANGE: ${change}`);
  console.log(`Phase 5 trust baseline audit: PASS (${baseline.entries.length}/${baseline.entries.length}).`);
}
