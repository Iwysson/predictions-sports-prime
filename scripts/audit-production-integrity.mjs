import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../out/", import.meta.url);
const failures = [];
if (!existsSync(root)) failures.push("build output is absent");

const files = existsSync(root) ? readdirSync(root, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => join(entry.parentPath, entry.name)) : [];
const htmlFiles = files.filter((file) => file.endsWith(".html"));
if (!htmlFiles.length) failures.push("no HTML output was generated");
if (!htmlFiles.some((file) => /(?:^|[\\/])index\.html$/.test(file))) failures.push("critical index HTML is absent");

const sitemap = files.find((file) => /(?:^|[\\/])sitemap\.xml$/.test(file));
if (!sitemap) failures.push("sitemap.xml is absent");
else {
  const xml = readFileSync(sitemap, "utf8");
  if (!/^<\?xml[\s\S]*<urlset[\s\S]*<\/urlset>\s*$/i.test(xml)) failures.push("sitemap.xml is malformed");
}

const forbidden = /\b(?:TODO|FIXME|DEBUG|internal note|developer note|system message|audit status|AI draft|manual approval required|pending research|needs verification)\b|(?:^|\s)[A-Z]:\\[^\s<]+|\b(?:src|scripts)\/[\w./-]+/i;
const mojibake = /(?:\u00C3[\u0080-\u00BF]|\u00C2[\u0080-\u00BF]|\u00E2\u20AC|\u00EF\u00BF\u00BD|\uFFFD)/;
let brokenCanonicals = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  if (forbidden.test(html)) failures.push(`internal information in ${file}`);
  if (mojibake.test(html)) failures.push(`corrupt encoding in ${file}`);
  for (const match of html.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi)) {
    if (!/^https:\/\/[^/]+\/.+|^https:\/\/[^/]+\/?$/.test(match[1])) brokenCanonicals += 1;
  }
}
if (brokenCanonicals) failures.push(`${brokenCanonicals} obviously invalid canonical URL(s)`);

for (const failure of failures.slice(0, 25)) console.error(`FAIL: ${failure}`);
if (failures.length > 25) console.error(`...and ${failures.length - 25} more failures`);
if (failures.length) process.exitCode = 1;
else console.log(`Production integrity: PASS (${htmlFiles.length} HTML files)`);
