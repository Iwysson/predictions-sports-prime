import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const slugs = ["football-predictions", "soccer-predictions", "betting-tips", "picks", "today-predictions"];
const values = { title: [], h1: [], description: [], canonical: [] };
let cards = 0;
for (const slug of slugs) {
  const html = readFileSync(join(process.cwd(), "out", slug, "index.html"), "utf8");
  const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const mainHtml = visibleHtml.match(/<main>[\s\S]*?<\/main>/i)?.[0] ?? visibleHtml;
  const get = (pattern, label) => {
    const value = html.match(pattern)?.[1];
    assert.ok(value, `${slug}: missing ${label}`);
    return value;
  };
  values.title.push(get(/<title>([^<]+)<\/title>/, "title"));
  values.h1.push(get(/<h1[^>]*>([^<]+)<\/h1>/, "H1"));
  values.description.push(get(/<meta name="description" content="([^"]+)"/, "description"));
  values.canonical.push(get(/<link rel="canonical" href="([^"]+)"/, "canonical"));
  assert.match(html, new RegExp(`https://predictions-sports-prime\\.com/${slug}/`), `${slug}: canonical URL missing`);
  assert.match(html, /<meta name="robots" content="index, follow"/, `${slug}: index/follow missing`);
  assert.match(html, /"@type":"CollectionPage"/, `${slug}: CollectionPage missing`);
  assert.match(html, /"@type":"BreadcrumbList"/, `${slug}: BreadcrumbList missing`);
  assert.match(html, /aria-label="Breadcrumb"/, `${slug}: visible breadcrumb missing`);
  assert.doesNotMatch(mainHtml, /guaranteed|safe bet|sure win|easy money/i, `${slug}: prohibited hub claim found`);
  assert.doesNotMatch(mainHtml, /lorem ipsum|undefined|null odds/i, `${slug}: hub placeholder found`);
  cards += (mainHtml.match(/<article class="intent-match-card/g) ?? []).length;
}
for (const [field, entries] of Object.entries(values)) assert.equal(new Set(entries).size, slugs.length, `${field} is duplicated across hubs`);
const sitemap = readFileSync(join(process.cwd(), "out", "sitemap.xml"), "utf8");
for (const slug of slugs) assert.match(sitemap, new RegExp(`<loc>https://predictions-sports-prime\\.com/${slug}/</loc>`), `${slug}: absent from sitemap`);
console.log(`Intent hub HTML pages: ${slugs.length}`);
console.log(`Rendered match cards: ${cards}`);
console.log("Intent hub HTML, SEO and structured-data audit: PASS");
