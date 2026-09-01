import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const host = "https://predictions-sports-prime.com";
const matchLocales = [{ slug: "pt-br", lang: "pt-BR" }, { slug: "es", lang: "es" }, { slug: "it", lang: "it" }, { slug: "fr", lang: "fr" }, { slug: "de", lang: "de" }];
const rolloutLocales = [{ slug: "nl", lang: "nl" }, { slug: "tr", lang: "tr" }];
const expectedHreflangs = ["en", ...matchLocales.map((item) => item.lang), "x-default"];
const errors = [];
let clusters = 0;
let localizedPages = 0;

function walk(directory) { return fs.readdirSync(directory).flatMap((name) => { const file = path.join(directory, name); return fs.statSync(file).isDirectory() ? walk(file) : [file]; }); }
function routeForFile(file) { const name = path.relative(root, file).split(path.sep).join("/"); return name === "index.html" ? "/" : `/${name.replace(/index\.html$/, "").replace(/\.html$/, "/")}`; }
function htmlFile(route) { return path.join(root, ...route.split("/").filter(Boolean), "index.html"); }
function isIndexable(html) { return /content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html); }
function alternates(html) { return [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"\/>/g)].map((match) => ({ lang: match[1], href: match[2] })); }

const pages = new Map(walk(root).filter((file) => file.endsWith(".html")).map((file) => [routeForFile(file), fs.readFileSync(file, "utf8")]));
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

for (const [route, html] of pages) {
  if (!isIndexable(html)) continue;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== `${host}${route}`) errors.push(`${route}: canonical is not self-referencing`);
  const lang = html.match(/<html[^>]*lang="([^"]+)"/)?.[1];
  const locale = matchLocales.find((item) => route.startsWith(`/${item.slug}/`) || route === `/${item.slug}/`);
  if (locale) {
    localizedPages += 1;
    if (lang !== locale.lang) errors.push(`${route}: html lang ${lang} != ${locale.lang}`);
  }
  if (!sitemap.includes(`<loc>${host}${route}</loc>`)) errors.push(`${route}: indexable page missing from sitemap`);
}

const englishMatches = [...pages.keys()].filter((route) => /^\/match\/[^/]+\/$/.test(route) && isIndexable(pages.get(route)) && matchLocales.every(({ slug }) => pages.has(`/${slug}${route}`)));
for (const route of englishMatches) {
  clusters += 1;
  const clusterRoutes = [route, ...matchLocales.map(({ slug }) => `/${slug}${route}`)];
  for (const member of clusterRoutes) {
    const html = pages.get(member);
    if (!html || !isIndexable(html)) { errors.push(`${member}: hreflang target missing or noindex`); continue; }
    const hrefLangs = alternates(html);
    for (const required of expectedHreflangs) if (!hrefLangs.some((entry) => entry.lang === required)) errors.push(`${member}: missing hreflang ${required}`);
    const defaultHref = hrefLangs.find((entry) => entry.lang === "x-default")?.href;
    if (defaultHref !== `${host}${route}`) errors.push(`${member}: x-default does not target English`);
    for (const entry of hrefLangs) {
      const target = new URL(entry.href).pathname;
      const targetHtml = pages.get(target);
      if (!targetHtml || !isIndexable(targetHtml)) errors.push(`${member}: hreflang ${entry.lang} points to missing/noindex ${target}`);
      else if (!alternates(targetHtml).some((back) => back.href === `${host}${member}`)) errors.push(`${member}: hreflang ${entry.lang} is not reciprocal`);
    }
  }
}

for (const { slug } of rolloutLocales) {
  for (const route of [`/${slug}/`, ...[...pages.keys()].filter((item) => item.startsWith(`/${slug}/league/`))]) {
    const html = pages.get(route); if (!html) continue;
    if (isIndexable(html)) errors.push(`${route}: rollout hub must remain noindex`);
    if (sitemap.includes(`<loc>${host}${route}</loc>`)) errors.push(`${route}: noindex rollout hub leaked into sitemap`);
  }
}

for (const file of walk(root).filter((item) => /\.(?:html|xml)$/.test(item))) if (fs.readFileSync(file, "utf8").includes("predictions-sports-prime.pages.dev")) errors.push(`${path.relative(root, file)}: legacy domain leakage`);

console.log("International SEO Audit");
console.log(`Indexable localized pages checked: ${localizedPages}`);
console.log(`Complete match hreflang clusters: ${clusters}`);
console.log(`Required hreflangs: ${expectedHreflangs.join(", ")}`);
console.log(`Rollout locales checked: ${rolloutLocales.map((item) => item.lang).join(", ")}`);
if (errors.length) { for (const error of errors) console.error(`ERROR: ${error}`); process.exitCode = 1; }
else console.log("International SEO audit: PASS");
