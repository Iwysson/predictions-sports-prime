import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { hasCompleteLocalizedEditorial } from "../src/data/localized-editorial.ts";

const root = process.cwd();
const output = path.join(root, "out");
const locales = ["pt-br", "es", "fr", "de", "it", "nl", "tr"];
const records = [];
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

for (const locale of locales) {
  const directory = path.join(output, locale, "match");
  if (!fs.existsSync(directory)) continue;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(directory, entry.name, "index.html");
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "";
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] ?? "";
    const indexable = /content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html) && !html.includes('id="__next_error__"');
    const body = text(html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? "");
    records.push({
      url: `https://predictions-sports-prime.com/${locale}/match/${entry.name}/`,
      locale,
      slug: entry.name,
      title,
      description,
      bodyHash: hash(body),
      editorialCompleteness: hasCompleteLocalizedEditorial(entry.name, locale),
      canonical,
      indexability: indexable ? "indexable" : "noindex-or-error",
    });
  }
}

const groups = [];
for (const field of ["title", "description", "bodyHash"]) {
  const owners = new Map();
  for (const record of records) {
    if (!record[field]) continue;
    owners.set(record[field], [...(owners.get(record[field]) ?? []), record]);
  }
  for (const [value, items] of owners) {
    if (items.length > 1) groups.push({ type: `exact-${field}`, value, pages: items });
  }
}
groups.sort((a, b) => a.type.localeCompare(b.type) || a.value.localeCompare(b.value));
const report = { schemaVersion: 1, pagesScanned: records.length, duplicateGroups: groups };
const directory = path.join(root, "reports", "seo-baseline");
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(directory, "international-duplicates.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`International duplicates: ${records.length} pages; ${groups.length} exact groups.`);
