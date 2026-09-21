// Full link / asset / canonical / hreflang / sitemap / JSON-LD audit over the exported `out/` directory.
// Read-only: never builds. Usage: node scripts/audit-out-links.mjs [--external-list=<file>]
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const ORIGIN = "https://predictions-sports-prime.com";
if (!fs.existsSync(OUT)) throw new Error("out/ not found; this audit does not build.");

const files = new Set();
const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else {
      const rel = "/" + path.relative(OUT, p).split(path.sep).join("/");
      files.add(rel);
      if (rel.endsWith(".html")) htmlFiles.push(rel);
    }
  }
})(OUT);

const routeOf = (rel) => (rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel.replace(/\.html$/, "/"));
const routes = new Set(htmlFiles.filter((f) => f !== "/404.html" && !f.includes("/__next")).map(routeOf));
const routeExists = (p) => routes.has(p) || files.has(p.replace(/\/$/, ""));

const norm = (href) => {
  if (!href) return null;
  if (/^(mailto:|tel:|javascript:|data:|#)/.test(href)) return null;
  let u = href;
  if (u.startsWith(ORIGIN)) u = u.slice(ORIGIN.length) || "/";
  else if (/^https?:\/\//.test(u) || u.startsWith("//")) return { external: href };
  if (!u.startsWith("/")) return null;
  return { path: u.split("#")[0].split("?")[0] };
};

const res = { pages: 0, links: 0, uniqueLinks: new Set(), brokenLinks: [], slashIssues: [], assets: 0, uniqueAssets: new Set(), missingAssets: [], canon: 0, badCanon: [], hreflang: 0, badHreflang: [], jsonld: 0, badJsonld: [], sm: 0, badSm: [], external: new Set() };
const meta = new Map();

for (const f of htmlFiles) {
  if (f === "/404.html" || /^\/google[0-9a-f]+\.html$/.test(f) || f.includes("/__next") || f.startsWith("/_next") || f.startsWith("/_not-found")) continue;
  const html = fs.readFileSync(path.join(OUT, f), "utf8");
  const page = routeOf(f);
  res.pages++;
  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const alts = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map((m) => [m[1], m[2]]);
  const alts2 = [...html.matchAll(/<link rel="alternate" href="([^"]+)" hrefLang="([^"]+)"/gi)].map((m) => [m[2], m[1]]);
  meta.set(page, { robots, canonical, alts: [...alts, ...alts2] });

  for (const m of html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)) {
    const n = norm(m[1].replace(/&amp;/g, "&"));
    if (!n) continue;
    if (n.external) { res.external.add(n.external); continue; }
    res.links++; res.uniqueLinks.add(n.path);
    if (!routeExists(n.path)) res.brokenLinks.push([page, n.path]);
    else if (!n.path.endsWith("/") && !files.has(n.path) && !n.path.includes(".")) res.slashIssues.push([page, n.path]);
  }
  const assetRefs = [
    ...[...html.matchAll(/<img\s[^>]*?src="([^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<link\s[^>]*?href="([^"]*)"/g)].filter((m) => !/rel="(canonical|alternate)"/.test(m[0])).map((m) => m[1]),
    ...[...html.matchAll(/<script\s[^>]*?src="([^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<meta property="og:image" content="([^"]*)"/g)].map((m) => m[1]),
  ];
  for (const a of assetRefs) {
    const n = norm(a.replace(/&amp;/g, "&"));
    if (!n) continue;
    if (n.external) { if (!/fonts\.(googleapis|gstatic)|googlesyndication|googletagmanager|google-analytics/.test(n.external)) res.external.add(n.external); continue; }
    res.assets++; res.uniqueAssets.add(n.path);
    let p = decodeURIComponent(n.path);
    if (!files.has(p)) res.missingAssets.push([page, p]);
  }
  // external links from any text (sources lists are rendered as anchors already)
  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data; try { data = JSON.parse(m[1]); } catch { res.badJsonld.push([page, "unparseable"]); continue; }
    (function visit(v, key) {
      if (typeof v === "string") {
        if (["url", "@id", "item", "mainEntityOfPage", "image", "logo", "sameAs"].includes(key) || v.startsWith(ORIGIN)) {
          const n = norm(v);
          if (n && n.path !== undefined) {
            res.jsonld++;
            if (!v.startsWith(ORIGIN) && !v.startsWith("/")) return;
            if (!routeExists(n.path) && !files.has(n.path)) res.badJsonld.push([page, v]);
          }
        }
      } else if (Array.isArray(v)) v.forEach((x) => visit(x, key));
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) visit(x, k);
    })(data);
    const mainUrl = data["url"] ;
    void mainUrl;
  }
}

// canonical / hreflang
for (const [page, m] of meta) {
  if (m.canonical) {
    res.canon++;
    const n = norm(m.canonical);
    if (!n?.path) res.badCanon.push([page, m.canonical, "not internal"]);
    else if (!routeExists(n.path)) res.badCanon.push([page, m.canonical, "missing"]);
    else if (n.path !== page && !/noindex/.test(m.robots)) res.badCanon.push([page, m.canonical, "non-self canonical on indexable page"]);
    if (m.canonical && !m.canonical.startsWith("https://")) res.badCanon.push([page, m.canonical, "not https"]);
  } else if (!/noindex/.test(m.robots)) res.badCanon.push([page, "", "indexable page without canonical"]);
  for (const [lang, href] of m.alts) {
    res.hreflang++;
    if (!/^(x-default|[a-z]{2}(-[A-Za-z]{2})?)$/.test(lang)) res.badHreflang.push([page, lang, href, "locale"]);
    const n = norm(href);
    if (!n?.path || !routeExists(n.path)) { res.badHreflang.push([page, lang, href, "missing target"]); continue; }
    const t = meta.get(n.path);
    if (t && /noindex/.test(t.robots)) res.badHreflang.push([page, lang, href, "target noindex"]);
    if (t && t.canonical && norm(t.canonical)?.path !== n.path) res.badHreflang.push([page, lang, href, "target canonical differs"]);
    if (t && n.path !== page && !/noindex/.test(m.robots)) {
      const back = t.alts.some(([, h]) => norm(h)?.path === page);
      if (!back) res.badHreflang.push([page, lang, href, "no return link"]);
    }
  }
}

// sitemaps
const smFiles = [...files].filter((f) => /sitemap.*\.xml$/.test(f) && !f.includes("/_next"));
const smUrls = [];
let indexable = 0, excluded = [];
const seen = new Map();
for (const f of smFiles) {
  const xml = fs.readFileSync(path.join(OUT, f), "utf8");
  const isIndex = /<sitemapindex/.test(xml);
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    res.sm++;
    const n = norm(m[1]);
    if (!n?.path) { res.badSm.push([f, m[1], "not internal"]); continue; }
    if (isIndex) { if (!files.has(n.path)) res.badSm.push([f, m[1], "sitemap missing"]); continue; }
    smUrls.push([f, n.path]);
    if (!routeExists(n.path)) { res.badSm.push([f, m[1], "page missing"]); continue; }
    const t = meta.get(n.path);
    if (t && /noindex/.test(t.robots)) res.badSm.push([f, m[1], "noindex page in sitemap"]);
    else if (t?.canonical && norm(t.canonical)?.path !== n.path) res.badSm.push([f, m[1], "canonical mismatch"]);
    if (seen.has(n.path) && seen.get(n.path) === f) res.badSm.push([f, m[1], "duplicate in file"]);
    seen.set(n.path, f);
  }
}
const uniqueSm = new Set(smUrls.map((x) => x[1]));
const indexablePages = [...meta].filter(([, m]) => !/noindex/.test(m.robots));
const noindexPages = [...meta].filter(([, m]) => /noindex/.test(m.robots));
const matchPages = [...meta].filter(([p]) => /^\/(?:[a-z-]+\/)?match\/[^/]+\/$/.test(p));
const idxMatch = matchPages.filter(([, m]) => !/noindex/.test(m.robots)).length;

const show = (l, a) => { console.log(`${l}: ${a.length}`); a.slice(0, 15).forEach((x) => console.log("   ", x.join(" | "))); };
console.log(`HTML pages audited: ${res.pages} (indexable ${indexablePages.length}, noindex ${noindexPages.length}); match pages ${matchPages.length}, indexable ${idxMatch}`);
console.log(`Internal links checked: ${res.links}; unique URLs: ${res.uniqueLinks.size}`);
show("Broken internal links", res.brokenLinks);
show("Trailing-slash issues", res.slashIssues);
console.log(`Asset references checked: ${res.assets}; unique: ${res.uniqueAssets.size}`);
show("Missing assets", res.missingAssets);
console.log(`Canonicals checked: ${res.canon}`);
show("Invalid canonicals", res.badCanon);
console.log(`hreflang entries checked: ${res.hreflang}`);
show("Invalid hreflang", res.badHreflang);
console.log(`Sitemap <loc> entries checked: ${res.sm} (page URLs ${smUrls.length}, unique ${uniqueSm.size}); indexable pages not in any sitemap: ${indexablePages.filter(([p]) => !uniqueSm.has(p)).length}`);
show("Invalid sitemap URLs", res.badSm);
console.log(`JSON-LD internal URLs checked: ${res.jsonld}`);
show("Invalid JSON-LD URLs", res.badJsonld);
console.log(`Unique external URLs found: ${res.external.size}`);
if (process.argv.find((a) => a.startsWith("--external-list="))) {
  fs.writeFileSync(process.argv.find((a) => a.startsWith("--external-list=")).split("=")[1], [...res.external].join("\n"));
}
const notInSm = indexablePages.filter(([p]) => !uniqueSm.has(p)).map(([p]) => p);
if (process.argv.includes("--list-unsitemapped")) console.log(notInSm.join("\n"));
process.exitCode = res.brokenLinks.length + res.missingAssets.length + res.badCanon.length + res.badHreflang.length + res.badSm.length + res.badJsonld.length ? 1 : 0;
