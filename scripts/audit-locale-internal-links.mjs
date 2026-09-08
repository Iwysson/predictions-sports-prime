import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const host = "https://predictions-sports-prime.com";
const locales = ["pt-br", "es", "it", "fr", "de"];
function walk(directory) { return fs.readdirSync(directory).flatMap((name) => { const item = path.join(directory, name); return fs.statSync(item).isDirectory() ? walk(item) : [item]; }); }
function route(file) { const rel = path.relative(root, file).split(path.sep).join("/"); return `/${rel.replace(/index\.html$/, "").replace(/\.html$/, "/")}`; }
function indexable(html) { return /name="robots" content="index, follow"|content="index, follow" name="robots"/i.test(html); }
const pages = new Map(walk(root).filter((item) => item.endsWith(".html")).map((file) => [route(file), fs.readFileSync(file, "utf8")]));
const errors = []; let audited = 0; let avoidable = 0;
for (const [pageRoute, html] of pages) {
  const locale = locales.find((item) => pageRoute.startsWith(`/${item}/`)); if (!locale || !indexable(html)) continue;
  audited += 1;
  for (const match of html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>/g)) {
    if (/hreflang=/i.test(match[0])) continue;
    let href = match[1]; if (href.startsWith(host)) href = new URL(href).pathname;
    if (!href.startsWith("/") || locales.some((item) => href.startsWith(`/${item}/`))) continue;
    const localizedTarget = `/${locale}${href}`;
    if (pages.has(localizedTarget) && indexable(pages.get(localizedTarget))) { avoidable += 1; errors.push(`${pageRoute} -> ${href} (use ${localizedTarget})`); }
  }
}
console.log(`Locale internal links: ${audited} pages; ${avoidable} avoidable cross-locale links.`);
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); process.exitCode = 1; }
else console.log("Locale internal-link audit: PASS");
