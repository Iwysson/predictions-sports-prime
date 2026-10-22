import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import release from "../functions/_data/match-release.json";
import gated from "../functions/_data/sitemap-gated.json";
import { createMiddlewareHandler } from "../functions/_middleware.js";
import { appendSitemapEntries, groupGatedBySitemap, releasedEntries } from "../functions/_lib/sitemap-release.js";
import { auditGatedManifest, auditMatchSitemapState, releaseStateOf } from "./lib/seo-release-state.mjs";

const NY = { date: "2026-10-22", timezone: "America/New_York" };

// ---------------------------------------------------------------------------------------------------------
// 1. Release state: hidden / released / closed
// ---------------------------------------------------------------------------------------------------------
const stateAt = (iso: string, release = NY, hasPage = true) => releaseStateOf({ hasPage, release, now: new Date(iso) });
assert.equal(stateAt("2026-10-22T03:59:59Z"), "hidden", "one second before New York midnight");
assert.equal(stateAt("2026-10-22T04:00:00Z"), "released", "New York midnight");
assert.equal(stateAt("2026-10-22T03:00:00Z", { date: "2026-10-22", timezone: "America/Fortaleza" }), "released", "Fortaleza midnight is its own boundary");
assert.equal(stateAt("2026-10-22T03:59:59Z", { date: "2026-10-22", timezone: "Not/AZone" }), "hidden", "unknown zone fails closed");
assert.equal(stateAt("2026-10-30T00:00:00Z", NY, false), "closed", "a settled match has no page");
assert.equal(stateAt("2026-10-01T00:00:00Z", null as any), "released", "no gate means the page is served");

// ---------------------------------------------------------------------------------------------------------
// 2. The SEO rules per state: valid cases pass, real problems still fail
// ---------------------------------------------------------------------------------------------------------
const route = "/match/example-vs-example/";
const lastmod = "2026-10-21T09:00:00.000Z";
const base = { route, shouldBeIndexable: true, expectedLastmod: lastmod, inEffectiveSitemap: false, isGated: false } as const;
const audit = (overrides: Record<string, unknown>) => auditMatchSitemapState({ ...base, ...overrides } as any);
const has = (errors: string[], text: string) => errors.some((error) => error.includes(text));

// hidden
assert.deepEqual(audit({ state: "hidden", isGated: true, gatedLastmod: lastmod }), [], "hidden + queued is valid and not required in the sitemap");
assert.ok(has(audit({ state: "hidden", isGated: true, gatedLastmod: lastmod, inEffectiveSitemap: true, effectiveLastmod: lastmod }), "leaked into the public sitemap"));
assert.ok(has(audit({ state: "hidden" }), "missing from the gated sitemap manifest"), "hidden but never queued would never be listed");
assert.ok(has(audit({ state: "hidden", isGated: true, gatedLastmod: "2026-10-01T00:00:00.000Z" }), "gated sitemap lastmod must equal"));
assert.ok(has(audit({ state: "hidden", isGated: true }), "gated sitemap lastmod must equal"));
assert.deepEqual(audit({ state: "hidden", shouldBeIndexable: false }), [], "hidden noindex page needs nothing");
assert.ok(has(audit({ state: "hidden", shouldBeIndexable: false, isGated: true }), "noindex prediction is queued"));

// released
assert.deepEqual(audit({ state: "released", inEffectiveSitemap: true, effectiveLastmod: lastmod }), []);
assert.ok(has(audit({ state: "released" }), "KEEP prediction missing from sitemap"), "released + indexable must be listed");
assert.ok(has(audit({ state: "released", inEffectiveSitemap: true, effectiveLastmod: "2026-10-01T00:00:00.000Z" }), "sitemap lastmod must equal"));
assert.ok(has(audit({ state: "released", shouldBeIndexable: false, inEffectiveSitemap: true, effectiveLastmod: lastmod }), "noindex prediction leaked into sitemap"));
assert.deepEqual(audit({ state: "released", shouldBeIndexable: false }), []);
assert.ok(has(audit({ state: "released", expectedLastmod: undefined, inEffectiveSitemap: true, effectiveLastmod: lastmod }), "no Article editorial date"));
assert.equal(has(audit({ state: "released", crossedKickoffAfterBuild: true }), "KEEP prediction missing"), false, "kickoff crossed after build keeps its existing presence tolerance");
assert.ok(has(audit({ state: "released", crossedKickoffAfterBuild: true }), "sitemap lastmod must equal"), "...but the lastmod rule still applies, as before");

// closed (settled): never advertised
assert.deepEqual(audit({ state: "closed" }), []);
assert.ok(has(audit({ state: "closed", inEffectiveSitemap: true }), "closed (settled) match is still advertised"));
assert.ok(has(audit({ state: "closed", isGated: true }), "closed (settled) match is still queued"));

// manifest consistency
const queued = { sitemap: "/sitemaps/uefa-europa-league/sitemap.xml", slug: "a-vs-b", url: "https://predictions-sports-prime.com/match/a-vs-b/" };
assert.deepEqual(auditGatedManifest({ gatedEntries: [queued], pageSlugs: new Set(["a-vs-b"]), releaseSlugs: new Set(["a-vs-b"]) }), []);
assert.ok(has(auditGatedManifest({ gatedEntries: [queued], pageSlugs: new Set(), releaseSlugs: new Set(["a-vs-b"]) }), "no generated page"), "queued entry for a settled/removed page");
assert.ok(has(auditGatedManifest({ gatedEntries: [queued], pageSlugs: new Set(["a-vs-b"]), releaseSlugs: new Set() }), "could never open"));
assert.ok(has(auditGatedManifest({ gatedEntries: [{ ...queued, sitemap: "/evil.xml" }], pageSlugs: new Set(["a-vs-b"]), releaseSlugs: new Set(["a-vs-b"]) }), "unknown sitemap"));

// ---------------------------------------------------------------------------------------------------------
// 3. The edge function appends entries exactly when the page gate opens (synthetic sitemap)
// ---------------------------------------------------------------------------------------------------------
const STATIC_XML = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://predictions-sports-prime.com/match/already-public/</loc></url></urlset>';
const SITEMAP = "/sitemaps/uefa-europa-league/sitemap.xml";
const entries = [
  { sitemap: SITEMAP, slug: "hidden-ny", url: "https://predictions-sports-prime.com/match/hidden-ny/", lastmod: "2026-10-21T09:00:00.000Z" },
  { sitemap: SITEMAP, slug: "already-public", url: "https://predictions-sports-prime.com/match/already-public/" },
  { sitemap: SITEMAP, slug: "no-rule", url: "https://predictions-sports-prime.com/match/no-rule/" },
];
const synthetic = (iso: string, path = SITEMAP, status = 200) => {
  const handler = createMiddlewareHandler({
    releaseDateBySlug: new Map<string, any>([["hidden-ny", NY], ["already-public", "2026-10-01"]]),
    gatedSitemapEntries: groupGatedBySitemap(entries),
    now: () => new Date(iso),
  });
  return handler({
    request: new Request(`https://predictions-sports-prime.com${path}`),
    next: async () => new Response(STATIC_XML, { status, headers: { "Content-Type": "application/xml", ETag: '"abc"', "Content-Length": String(STATIC_XML.length) } }),
  });
};
const countOf = (xml: string, text: string) => xml.split(text).length - 1;

const early = await synthetic("2026-10-22T03:59:59Z");
const earlyXml = await early.text();
assert.equal(early.status, 200);
assert.equal(earlyXml.includes("/match/hidden-ny/"), false, "hidden entry absent one second before the gate");
assert.equal(countOf(earlyXml, "/match/already-public/"), 1);
assert.equal(earlyXml.includes("/match/no-rule/"), false, "an entry with no release rule fails closed");

const late = await synthetic("2026-10-22T04:00:00Z");
const lateXml = await late.text();
assert.equal(countOf(lateXml, "<loc>https://predictions-sports-prime.com/match/hidden-ny/</loc>"), 1, "appended exactly once at the gate");
assert.ok(lateXml.includes("<lastmod>2026-10-21T09:00:00.000Z</lastmod>"));
assert.equal(countOf(lateXml, "/match/already-public/"), 1, "an entry the static build already lists is never duplicated");
assert.equal(lateXml.includes("/match/no-rule/"), false);
assert.ok(lateXml.trimEnd().endsWith("</urlset>"));
assert.equal(late.headers.get("cache-control"), "no-cache");
assert.equal(late.headers.get("etag"), null, "validators of the static body no longer apply");
assert.equal(late.headers.get("content-length"), null);

assert.equal((await synthetic("2026-10-22T04:00:00Z", "/sitemaps/serie-a/sitemap.xml")).headers.get("etag"), '"abc"', "a sitemap with no queued entries is untouched");
assert.equal(await (await synthetic("2026-10-22T04:00:00Z", "/sitemap.xml")).text(), STATIC_XML, "the top-level sitemap is untouched");
assert.equal((await synthetic("2026-10-22T04:00:00Z", SITEMAP, 404)).status, 404, "a missing static sitemap passes through");
assert.equal(appendSitemapEntries(STATIC_XML, []), STATIC_XML);
assert.equal(releasedEntries(entries, () => undefined, new Date("2030-01-01T00:00:00Z")).length, 0);

// ---------------------------------------------------------------------------------------------------------
// 4. The real built sitemaps and manifests, around the New York boundary (needs `npm run build`)
// ---------------------------------------------------------------------------------------------------------
const out = "out";
if (!existsSync(`${out}/sitemaps/uefa-europa-league/sitemap.xml`)) {
  console.log("out/ not found - skipping real-sitemap and audit checks (run npm run build first)");
} else {
  const staticXml = (path: string) => readFileSync(`${out}${path}`, "utf8");
  const served = async (path: string, iso: string) => {
    const response = await createMiddlewareHandler({ now: () => new Date(iso) })({
      request: new Request(`https://predictions-sports-prime.com${path}`),
      next: async () => new Response(staticXml(path), { headers: { "Content-Type": "application/xml" } }),
    });
    return response.text();
  };
  const slugsFor = (sitemap: string, zone: string) =>
    (gated as any[]).filter((entry) => entry.sitemap === sitemap && release.find((r: any) => r.slug === entry.slug)?.timezone === zone).map((entry) => entry.slug);

  const uelSlugs = slugsFor("/sitemaps/uefa-europa-league/sitemap.xml", "America/New_York");
  const upcomingNy = slugsFor("/sitemaps/upcoming-matches/sitemap.xml", "America/New_York");
  assert.equal(uelSlugs.length, 18, "18 Europa League matches queued for New York midnight");
  assert.equal(upcomingNy.length, 19, "19 New York matches queued in the upcoming sitemap (18 Europa League + 1 Libertadores)");

  // No hidden slug is in any static sitemap shipped in out/.
  for (const sitemap of new Set((gated as any[]).map((entry) => entry.sitemap))) {
    for (const entry of (gated as any[]).filter((candidate) => candidate.sitemap === sitemap)) {
      assert.equal(staticXml(sitemap).includes(`<loc>${entry.url}</loc>`), false, `${entry.url}: must not be in the static ${sitemap}`);
    }
  }

  for (const path of ["/sitemaps/uefa-europa-league/sitemap.xml", "/sitemaps/upcoming-matches/sitemap.xml"]) {
    const before = await served(path, "2026-10-22T03:59:59Z");
    const after = await served(path, "2026-10-22T04:00:00Z");
    const ny = path.includes("upcoming") ? upcomingNy : uelSlugs;
    for (const slug of ny) {
      assert.equal(before.includes(`/match/${slug}/`), false, `${slug}: absent from ${path} before New York midnight`);
      assert.equal(countOf(after, `<loc>https://predictions-sports-prime.com/match/${slug}/</loc>`), 1, `${slug}: listed once in ${path} at New York midnight`);
    }
  }

  // The retained combined Flamengo pick opens at the New York release gate.
  const libertadores = "/sitemaps/copa-libertadores/sitemap.xml";
  const straight = "https://predictions-sports-prime.com/match/flamengo-vs-estudiantes/";
  const combined = "https://predictions-sports-prime.com/match/flamengo-vs-estudiantes-combined/";
  const lib = { early: await served(libertadores, "2026-10-22T02:59:59Z"), fortaleza: await served(libertadores, "2026-10-22T03:00:00Z"), ny: await served(libertadores, "2026-10-22T04:00:00Z") };
  assert.equal(lib.early.includes(straight), false);
  assert.equal(lib.fortaleza.includes(`<loc>${straight}</loc>`), false, "removed straight-win page stays absent");
  assert.equal(lib.fortaleza.includes(combined), false, "combined pick stays out until New York midnight");
  assert.equal(lib.ny.includes(`<loc>${combined}</loc>`), true);
  assert.equal(countOf(lib.ny, `<loc>${straight}</loc>`), 0);

  // Page and sitemap share one rule: whenever a queued URL is listed, the page is served; otherwise it redirects.
  for (const iso of ["2026-10-22T03:59:59Z", "2026-10-22T04:00:00Z"]) {
    for (const slug of uelSlugs.slice(0, 4)) {
      const page = await createMiddlewareHandler({ now: () => new Date(iso) })({
        request: new Request(`https://predictions-sports-prime.com/match/${slug}/`),
        next: async () => new Response("page"),
      });
      const listed = (await served("/sitemaps/uefa-europa-league/sitemap.xml", iso)).includes(`/match/${slug}/`);
      assert.equal(page.status === 200, listed, `${slug} at ${iso}: page served <=> listed in the sitemap`);
    }
  }

  // The real audit, as the site looks just before and just after the gate, with no redeploy in between.
  const runAudit = (env: Record<string, string>) => spawnSync(process.execPath, ["--import", "tsx", "scripts/audit-seo.mjs"], { env: { ...process.env, ...env }, encoding: "utf8" });
  for (const at of ["2026-10-22T03:59:59Z", "2026-10-22T04:00:00Z", "2026-10-30T12:00:00Z"]) {
    const result = runAudit({ SEO_AUDIT_NOW: at });
    assert.equal(result.status, 0, `audit:seo at ${at} must pass:\n${result.stdout}\n${result.stderr}`);
  }
  // ...and it still fails when the queue is wrong (hidden pages that would never be listed).
  const empty = join(mkdtempSync(join(tmpdir(), "seo-gated-")), "empty.json");
  writeFileSync(empty, "[]");
  const broken = runAudit({ SEO_AUDIT_NOW: "2026-10-22T03:59:59Z", SEO_AUDIT_GATED_MANIFEST: empty });
  assert.notEqual(broken.status, 0, "audit:seo must fail when hidden pages are not queued for release");
  assert.ok(broken.stderr.includes("missing from the gated sitemap manifest"), broken.stderr.slice(0, 600));
  // After release with an empty queue the same pages would be missing from the sitemap: also a failure.
  const brokenAfter = runAudit({ SEO_AUDIT_NOW: "2026-10-22T04:00:00Z", SEO_AUDIT_GATED_MANIFEST: empty });
  assert.notEqual(brokenAfter.status, 0);
  assert.ok(brokenAfter.stderr.includes("KEEP prediction missing from sitemap"), brokenAfter.stderr.slice(0, 600));
}

console.log("SEO release gate: hidden/released/closed rules, edge sitemap release at the New York boundary and audit before/after release PASS");
