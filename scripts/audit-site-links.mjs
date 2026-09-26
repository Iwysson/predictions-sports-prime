// Read-only crawler over the static export (out/). Run after `npm run build`.
// Usage: node scripts/audit-site-links.mjs [outDir]
// Fails on broken internal links/assets, malformed URLs, invalid canonical/hreflang, sitemap
// URLs that do not exist, and pt-BR match URLs other than the frozen historical archive.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] || "out");
const ORIGIN = "https://predictions-sports-prime.com";
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(p);
  }
})(OUT);
const fileSet = new Set(files.map((f) => "/" + path.relative(OUT, f).split(path.sep).join("/")));
const htmls = [...fileSet].filter((f) => f.endsWith(".html") && !f.startsWith("/_next/"));

function exists(p) {
  // p = pathname (decoded) starting with /
  if (fileSet.has(p)) return true;
  if (p.endsWith("/") && fileSet.has(p + "index.html")) return true;
  if (!p.endsWith("/") && fileSet.has(p + "/index.html")) return "noslash";
  if (fileSet.has(p + ".html")) return true;
  return false;
}
const res = {
  pages: htmls.length, internalLinks: 0, uniqueInternal: new Set(), broken: new Map(), noslash: new Map(), malformed: [],
  emptyHref: new Map(), assets404: new Map(), canonBad: [], hreflangBad: [], hreflangNonRecip: [], ogBad: [], imgNoDim: new Map(), imgTotal: 0, ptbrLinks: new Map(), extLinks: new Map(), jsonldBad: [],
};
const attrRe = /\b(href|src)=("([^"]*)"|'([^']*)')/gi;
const canonRe = /<link[^>]+rel="canonical"[^>]*>/i;
function attr(tag, name) { const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i")); return m ? m[1] : undefined; }
function decodeEnt(s) { return s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"'); }
function add(map, key, page) { if (!map.has(key)) map.set(key, new Set()); map.get(key).add(page); }

const pageInfo = new Map();
for (const page of htmls) {
  const html = fs.readFileSync(path.join(OUT, page), "utf8");
  const pageUrl = ORIGIN + (page.endsWith("index.html") ? page.slice(0, -"index.html".length) : page);
  const info = { canonical: undefined, alts: [] };
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = attr(tag, "rel");
    if (rel === "canonical") info.canonical = decodeEnt(attr(tag, "href") || "");
    if (rel === "alternate" && attr(tag, "hreflang")) info.alts.push([attr(tag, "hreflang"), decodeEnt(attr(tag, "href") || "")]);
  }
  pageInfo.set(pageUrl, info);
  // anchors + assets
  for (const m of html.matchAll(/<(a|link|script|img|source|iframe)\b[^>]*>/gi)) {
    const tag = m[0], name = m[1].toLowerCase();
    for (const key of ["href", "src"]) {
      let v = attr(tag, key);
      if (v === undefined) continue;
      v = decodeEnt(v);
      if (name === "a" && key === "href") {
        if (v === "" ) add(res.emptyHref, 'href=""', page);
        else if (v === "#") add(res.emptyHref, 'href="#"', page);
        else if (/^(undefined|null|\[object Object\])$/.test(v)) add(res.emptyHref, `href="${v}"`, page);
      }
      if (v === "" || v.startsWith("#") || /^(mailto:|tel:|javascript:|data:)/i.test(v)) continue;
      // malformed patterns
      if (/^https?:\/(?!\/)/i.test(v) || /^https?:\/{3,}/i.test(v) || /\s/.test(v) || /%20/.test(v) || /\?\?|&&/.test(v) || /localhost|127\.0\.0\.1|^file:|[A-Za-z]:\\/i.test(v) || /(?<!:)\/\/(?!$)/.test(v.replace(/^https?:\/\//i, "").replace(/^\/\//, "x")) ) {
        res.malformed.push([page, name, v]);
      }
      let u;
      try { u = new URL(v, pageUrl); } catch { res.malformed.push([page, name, v, "unparseable"]); continue; }
      const external = u.origin !== ORIGIN;
      if (external) { if (name === "a") add(res.extLinks, u.href.split("#")[0], page); continue; }
      if (name === "a" && key === "href") { res.internalLinks++; res.uniqueInternal.add(u.pathname); }
      const p = decodeURIComponent(u.pathname);
      const ex = exists(p);
      if (name === "a") {
        if (/^\/pt-br\/match\//.test(p)) add(res.ptbrLinks, p, page);
        if (!ex) add(res.broken, u.pathname, page);
        else if (ex === "noslash") add(res.noslash, u.pathname, page);
      } else if (!ex) add(res.assets404, u.pathname, page);
    }
  }
  // images
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    res.imgTotal++;
    const tag = m[0];
    const hasW = /\bwidth=/.test(tag), hasH = /\bheight=/.test(tag);
    if (!hasW || !hasH) add(res.imgNoDim, attr(tag, "src") || "(no src)", page);
  }
  // JSON-LD url checks
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch { res.jsonldBad.push(page); }
    for (const u of m[1].matchAll(/"(?:url|@id)":"(http[^"#]*)/g)) {
      if (u[1].startsWith("http://")) res.jsonldBad.push([page, "http", u[1]]);
    }
  }
}
// canonical / hreflang
for (const [url, info] of pageInfo) {
  const isNoindexShell = false;
  if (info.canonical) {
    try {
      const u = new URL(info.canonical);
      if (u.origin !== ORIGIN) res.canonBad.push([url, "host", info.canonical]);
      else if (!exists(decodeURIComponent(u.pathname))) res.canonBad.push([url, "404", info.canonical]);
      else if (!u.pathname.endsWith("/") && u.pathname !== "/") res.canonBad.push([url, "noslash", info.canonical]);
    } catch { res.canonBad.push([url, "malformed", info.canonical]); }
  }
  const seen = new Set();
  for (const [lang, href] of info.alts) {
    if (seen.has(lang)) res.hreflangBad.push([url, "dup", lang]);
    seen.add(lang);
    let u; try { u = new URL(href); } catch { res.hreflangBad.push([url, "malformed", href]); continue; }
    if (u.origin !== ORIGIN) res.hreflangBad.push([url, "host", href]);
    else if (!exists(decodeURIComponent(u.pathname))) res.hreflangBad.push([url, "404", href]);
    else {
      const target = pageInfo.get(href);
      if (target && target.alts.length && !target.alts.some(([, h]) => h === url) && href !== url) res.hreflangNonRecip.push([url, lang, href]);
    }
  }
}
// sitemaps
const sm = { files: 0, urls: 0, dup: 0, missing: [], nonCanon: [], ptbrMatch: [], listedMissing: [] };
const smFiles = [...fileSet].filter((f) => /sitemap.*\.xml$/.test(f) || f.endsWith("/sitemap.xml"));
const seenUrls = new Set();
for (const f of smFiles) {
  const x = fs.readFileSync(path.join(OUT, f), "utf8");
  sm.files++;
  for (const m of x.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = decodeEnt(m[1]);
    let u; try { u = new URL(loc); } catch { sm.missing.push([f, "malformed", loc]); continue; }
    if (f.includes("sitemap-index")) { if (!exists(u.pathname)) sm.listedMissing.push([f, loc]); continue; }
    sm.urls++;
    if (seenUrls.has(loc)) sm.dup++; seenUrls.add(loc);
    if (u.origin !== ORIGIN) sm.missing.push([f, "host", loc]);
    else if (!exists(decodeURIComponent(u.pathname))) sm.missing.push([f, "404", loc]);
    else {
      const info = pageInfo.get(loc);
      if (info && info.canonical && info.canonical !== loc) sm.nonCanon.push([loc, info.canonical]);
    }
    if (/\/pt-br\/match\//.test(loc)) sm.ptbrMatch.push(loc);
  }
}
const show = (m, n = 8) => [...m].slice(0, n).map(([k, v]) => `${k}  (x${v.size}; e.g. ${[...v][0]})`);
const out = {
  pages: res.pages, internalLinkInstances: res.internalLinks, uniqueInternalTargets: res.uniqueInternal.size,
  brokenInternalLinks: res.broken.size, brokenSample: show(res.broken),
  missingTrailingSlash: res.noslash.size, noslashSample: show(res.noslash, 5),
  malformed: res.malformed.length, malformedSample: res.malformed.slice(0, 8),
  emptyHref: Object.fromEntries([...res.emptyHref].map(([k, v]) => [k, v.size])),
  assets404: res.assets404.size, assets404Sample: show(res.assets404),
  canonicalBad: res.canonBad.length, canonicalBadSample: res.canonBad.slice(0, 5),
  hreflangBad: res.hreflangBad.length, hreflangBadSample: res.hreflangBad.slice(0, 5),
  hreflangNonReciprocal: res.hreflangNonRecip.length, nonRecipSample: res.hreflangNonRecip.slice(0, 5),
  imgTotal: res.imgTotal, imgWithoutWidthHeight: res.imgNoDim.size, imgNoDimSample: show(res.imgNoDim, 8),
  jsonldBad: res.jsonldBad.length,
  ptbrMatchLinks: [...res.ptbrLinks.keys()],
  externalUnique: res.extLinks.size,
  sitemaps: { files: sm.files, urls: sm.urls, dup: sm.dup, missing: sm.missing.length, missingSample: sm.missing.slice(0, 5), nonCanonical: sm.nonCanon.length, nonCanonSample: sm.nonCanon.slice(0, 5), ptbrMatch: sm.ptbrMatch, listedMissing: sm.listedMissing.length },
};
console.log(JSON.stringify(out, null, 1));

const HISTORICAL_PTBR = new Set(["/pt-br/match/aston-villa-vs-arsenal/", "/pt-br/match/barcelona-vs-feyenoord/"]);
const unexpectedPtbr = [...res.ptbrLinks.keys(), ...sm.ptbrMatch.map((u) => new URL(u).pathname)].filter((p) => !HISTORICAL_PTBR.has(p));
const failures = res.broken.size + res.malformed.length + res.assets404.size + res.canonBad.length + res.hreflangBad.length + res.jsonldBad.length + res.emptyHref.size + sm.missing.length + sm.listedMissing.length + unexpectedPtbr.length + res.noslash.size;
console.log(failures ? `Site link audit: FAIL (${failures} problem groups)` : "Site link audit: PASS");
if (unexpectedPtbr.length) console.log("Unexpected pt-BR match URLs:", unexpectedPtbr);
process.exitCode = failures ? 1 : 0;
