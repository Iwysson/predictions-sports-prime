// Verifies the homepage's Today/Results/Predictions-by-League structure and the public release gate's effect on
// the built static export, with no
// not-yet-released match exposed in the crawlable directory or the per-league sitemaps.
// Needs `npm run build` first (also runs `npm run prebuild`, which writes functions/_data/match-release.json).
// Run: npx tsx scripts/test-home-sections.mts   (npm run test:home-sections)
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import { isDateReleased } from "../src/lib/match-release.ts";

const assert = (ok: unknown, label: string) => {
  if (!ok) throw new Error(`FAIL ${label}`);
  console.log(`PASS ${label}`);
};

if (!existsSync("out/index.html")) throw new Error("out/ is missing: run `npm run build` first");

const html = readFileSync("out/index.html", "utf8");

// --- Home sections and league navigation ---------------------------------------------------------

const idxToday = html.indexOf('id="today"');
const idxHistory = html.indexOf('id="history"');
const idxLeagues = html.indexOf('id="leagues"');

assert(idxToday !== -1, "homepage has a Today section");
assert(idxLeagues !== -1, "homepage has a Predictions-by-League section");
assert(!html.includes('home-leagues-sidebar'), "homepage has no duplicate league sidebar");
// The Results section (#history) renders only after client hydration (HomePredictionFeed is a
// client component whose temporal sections depend on useClientNow()); it is verified in a real
// browser below rather than in the pre-hydration static file, where it is never present by design.
void idxHistory;

assert(!html.includes('id="tomorrow"'), "the Tomorrow section was removed from the homepage");
assert(!html.includes('id="upcoming"'), "the Upcoming section was removed from the homepage");
assert(!/Predictions by sport/i.test(html), "the removed 'Predictions by sport' block is gone");
assert(!/How Our Football Predictions Work/i.test(html), "the removed trust-links block is gone");

// --- League navigation --------------------------------------------------------------------------

const leaguesSection = html.slice(idxLeagues);
assert(leaguesSection.includes('href="/nhl/"'), "Predictions by League still links to NHL");
assert(leaguesSection.includes('href="/nfl/"'), "Predictions by League still links to NFL");
for (const slug of ["premier-league", "la-liga", "champions-league", "copa-libertadores"]) {
  assert(leaguesSection.includes(`/league/${slug}/`), `Predictions by League still links to ${slug}`);
}

// --- No future prediction leaks into the crawlable directory or the sitemaps ------------------------

const releaseManifest = JSON.parse(readFileSync("functions/_data/match-release.json", "utf8")) as Array<{ slug: string; date: string }>;
const now = new Date();
const lockedSlugs = releaseManifest.filter((entry) => !isDateReleased(entry.date, now)).map((entry) => entry.slug);

for (const slug of lockedSlugs) {
  assert(!html.includes(`/match/${slug}/`), `homepage never links to the locked future match ${slug}`);
}

if (existsSync("out/sitemaps")) {
  // /sitemaps/upcoming-matches/ is the dedicated, pre-existing "upcoming matches" discovery hub
  // (src/lib/sitemap-data.ts buildUpcomingMatchesSitemap) - it is meant to list future fixtures and
  // is out of scope for this gate, same as the homepage restructuring leaves it untouched.
  const leagueDirs = readdirSync("out/sitemaps", { withFileTypes: true }).filter((e) => e.isDirectory() && e.name !== "upcoming-matches");
  for (const dir of leagueDirs) {
    const sitemapPath = `out/sitemaps/${dir.name}/sitemap.xml`;
    if (!existsSync(sitemapPath)) continue;
    const xml = readFileSync(sitemapPath, "utf8");
    for (const slug of lockedSlugs) {
      assert(!xml.includes(`/match/${slug}/`), `sitemap for ${dir.name} never lists the locked future match ${slug}`);
    }
  }
}

// --- Post-hydration order: Today, then Results, with one league section ----------------------------
// HomePredictionFeed is a client component; #today's full card grid and #history (Results) only
// exist after useClientNow() resolves. A real headless browser is the only faithful way to check the
// order a visitor actually sees, so this drives the built static export exactly like
// scripts/test-nhl-oct17-render.mts does for the NHL gate (no middleware or API needed here: the
// homepage's section order never depends on a fetch).
function findBrowser(): string {
  const local = process.env.LOCALAPPDATA ?? "";
  const playwright = local && existsSync(path.join(local, "ms-playwright"))
    ? readdirSync(path.join(local, "ms-playwright")).filter((d) => d.startsWith("chromium-")).map((d) => path.join(local, "ms-playwright", d, "chrome-win64", "chrome.exe"))
    : [];
  const candidates = [process.env.CHROME_PATH ?? "", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "/usr/bin/google-chrome", "/usr/bin/chromium", ...playwright];
  return candidates.find((p) => p && existsSync(p)) ?? "";
}

const browserPath = findBrowser();
if (!browserPath) {
  console.log("SKIP post-hydration order check: no Chrome/Edge found (set CHROME_PATH). Static checks above still ran.");
} else {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const children: ChildProcess[] = [];
  async function waitFor(check: () => Promise<boolean>, what: string, ms = 20000) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (await check().catch(() => false)) return;
      await delay(200);
    }
    throw new Error(`timeout waiting for ${what}`);
  }

  const TYPES: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2" };
  const server = createServer((req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://harness");
      let file = path.join("out", decodeURIComponent(url.pathname));
      if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
      const type = TYPES[path.extname(file)] ?? "application/octet-stream";
      res.writeHead(existsSync(file) ? 200 : 404, { "Content-Type": type });
      res.end(existsSync(file) ? readFileSync(file) : "not found");
    } catch (error) {
      res.writeHead(500);
      res.end(String(error));
    }
  });
  const PORT = 4311;
  await new Promise<void>((resolve) => server.listen(PORT, "127.0.0.1", resolve));

  type Cdp = { send: (method: string, params?: object) => Promise<any>; close: () => void };
  async function connect(port: number): Promise<Cdp> {
    const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
    let id = 0;
    const pending = new Map<number, (m: any) => void>();
    ws.onmessage = (m) => {
      const msg = JSON.parse(String(m.data));
      if (msg.id && pending.has(msg.id)) pending.get(msg.id)!(msg);
    };
    const send = (method: string, params: object = {}) => new Promise<any>((resolve, reject) => {
      const myId = ++id;
      pending.set(myId, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
      ws.send(JSON.stringify({ id: myId, method, params }));
    });
    await send("Page.enable");
    await send("Runtime.enable");
    return { send, close: () => ws.close() };
  }
  const evaluate = async (cdp: Cdp, expression: string) => {
    const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(`page exception: ${JSON.stringify(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)}`);
    return r.result.value;
  };

  const DEBUG_PORT = 9311;
  const profileDir = path.join(path.dirname(path.resolve("out")), ".psp-home-sections-profile");
  const browser = spawn(browserPath, [`--headless=new`, `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profileDir}`, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "about:blank"], { stdio: "ignore" });
  children.push(browser);
  try {
    await waitFor(async () => (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)).ok, "browser DevTools");
    const cdp = await connect(DEBUG_PORT);
    await cdp.send("Page.navigate", { url: `http://127.0.0.1:${PORT}/` });
    await waitFor(async () => (await evaluate(cdp, "document.readyState")) === "complete", "page load");
    await waitFor(async () => (await evaluate(cdp, "document.getElementById('history') !== null")) === true, "client hydration (Results section)");

    const order = await evaluate(cdp, `(() => {
      const ids = ['today', 'history', 'leagues'];
      return ids.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : null;
      });
    })()`) as [number | null, number | null, number | null];
    const [todayTop, historyTop, leaguesTop] = order;

    assert(await evaluate(cdp, "document.getElementById('today') !== null"), "hydrated homepage has a Today section");
    assert(await evaluate(cdp, "document.getElementById('history') !== null"), "hydrated homepage has a Results section");
    assert(await evaluate(cdp, "document.querySelectorAll('.home-leagues-sidebar').length === 0"), "hydrated homepage has no duplicate league sidebar");
    assert(await evaluate(cdp, "document.getElementById('leagues') !== null"), "hydrated homepage has a Predictions-by-League section");
    assert(await evaluate(cdp, "document.getElementById('tomorrow') === null"), "hydrated homepage has no Tomorrow section");
    assert(await evaluate(cdp, "document.getElementById('upcoming') === null"), "hydrated homepage has no Upcoming section");
    assert(todayTop !== null && historyTop !== null && todayTop < historyTop, "Today renders before Results in the real DOM");
    assert(leaguesTop !== null, "Predictions by League remains visible in the real DOM");

    cdp.close();
  } finally {
    browser.kill();
    server.close();
    await delay(300);
  }
}

console.log(`All home-sections tests passed (${lockedSlugs.length} locked future match(es) checked).`);
