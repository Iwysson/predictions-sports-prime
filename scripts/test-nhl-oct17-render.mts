// Real-browser integration test for the NHL 2026-10-17 release gate. Drives the BUILT static export (out/) and the real
// Pages Function handlers through scripts/lib/nhl-gate-harness.mts, with one frozen clock shared by the server and the browser,
// in a headless Chromium-based browser over the DevTools protocol (no new dependency: Node's WebSocket + an installed Chrome/Edge).
// Needs `npm run build` first. Browser: CHROME_PATH, or Chrome / Edge / the Playwright Chromium cache when present.
// Run: npx tsx scripts/test-nhl-oct17-render.mts   (npm run test:nhl-oct17-render)
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const assert = (ok: unknown, label: string) => {
  if (!ok) throw new Error(`FAIL ${label}`);
  console.log(`PASS ${label}`);
};
if (!existsSync("out/nhl/index.html")) throw new Error("out/ is missing: run `npm run build` first");

function findBrowser(): string {
  const local = process.env.LOCALAPPDATA ?? "";
  const playwright = local && existsSync(path.join(local, "ms-playwright"))
    ? readdirSync(path.join(local, "ms-playwright")).filter((d) => d.startsWith("chromium-")).map((d) => path.join(local, "ms-playwright", d, "chrome-win64", "chrome.exe"))
    : [];
  const candidates = [process.env.CHROME_PATH ?? "", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "/usr/bin/google-chrome", "/usr/bin/chromium", ...playwright];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) throw new Error("no Chrome/Edge found: set CHROME_PATH");
  return found;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const children: ChildProcess[] = [];
async function waitFor(check: () => Promise<boolean>, what: string, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await check().catch(() => false)) return;
    await delay(250);
  }
  throw new Error(`timeout waiting for ${what}`);
}

type Cdp = { send: (method: string, params?: object) => Promise<any>; events: any[]; close: () => void };
async function connect(port: number): Promise<Cdp> {
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map<number, (m: any) => void>();
  const events: any[] = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(String(m.data));
    if (msg.id && pending.has(msg.id)) pending.get(msg.id)!(msg);
    else if (msg.method) events.push(msg);
  };
  const send = (method: string, params: object = {}) => new Promise<any>((resolve, reject) => {
    const myId = ++id;
    pending.set(myId, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id: myId, method, params }));
  });
  for (const domain of ["Page", "Runtime", "Log", "Network"]) await send(`${domain}.enable`);
  return { send, events, close: () => ws.close() };
}
const evaluate = async (cdp: Cdp, expression: string) => {
  const r = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(`page exception: ${JSON.stringify(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)}`);
  return r.result.value;
};

async function phase(label: string, at: string, serverPort: number, debugPort: number, run: (cdp: Cdp, base: string) => Promise<void>) {
  const server = spawn(process.execPath, ["--import", "tsx", "scripts/lib/nhl-gate-harness.mts", `--at=${at}`, `--port=${serverPort}`], { stdio: ["ignore", "pipe", "pipe"] });
  children.push(server);
  let serverErr = "";
  server.stderr?.on("data", (d) => (serverErr += String(d)));
  await waitFor(async () => (await fetch(`http://127.0.0.1:${serverPort}/nhl/`)).ok, `harness (${label}) ${serverErr}`);
  const profile = mkdtempSync(path.join(tmpdir(), "psp-render-"));
  const browser = spawn(findBrowser(), [`--headless=new`, `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "about:blank"], { stdio: "ignore" });
  children.push(browser);
  try {
    await waitFor(async () => (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).ok, "browser DevTools");
    const cdp = await connect(debugPort);
    await run(cdp, `http://127.0.0.1:${serverPort}`);
    cdp.close();
  } finally {
    browser.kill();
    server.kill();
    await delay(500);
    try { rmSync(profile, { recursive: true, force: true }); } catch { /* the browser may still hold the profile */ }
  }
}

const SNAPSHOT = `(() => {
  const text = (id) => (document.getElementById(id)?.innerText ?? '').replace(/\\s+/g, ' ');
  return {
    now: new Date().toISOString(),
    games: document.querySelectorAll('section.psp-game').length,
    free: document.querySelectorAll('section.psp-game--free').length,
    vip: document.querySelectorAll('section.psp-game--vip').length,
    slugs: [...document.querySelectorAll('section.psp-game')].map((s) => s.id),
    hero: document.querySelector('.psp-hero')?.innerText ?? '',
    body: document.body.innerText,
    html: document.documentElement.outerHTML,
    htmlWithoutFreeCards: (() => { const c = document.documentElement.cloneNode(true); c.querySelectorAll('section.psp-game--free').forEach((n) => n.remove()); return c.outerHTML; })(),
    text: { rangers: text('columbus-blue-jackets-vs-new-york-rangers'), sabres: text('montreal-canadiens-vs-buffalo-sabres-2026-10-17'), best: text('utah-mammoth-vs-edmonton-oilers'), washington: text('washington-capitals-vs-new-jersey-devils') },
  };
})()`;

const premiumTerms = /1\.62|1\.89|1\.77|Over 5\.0|Under 6\.5|BEST TOTAL ON THE CARD|REJECT KINGS|Slate ranking|Verdict:/;
const runtimeProblems = (cdp: Cdp) =>
  cdp.events.filter((e) =>
    (e.method === "Runtime.exceptionThrown") ||
    (e.method === "Log.entryAdded" && e.params.entry.level === "error" && !/favicon|analytics|googletag|gtag|doubleclick/i.test(`${e.params.entry.text} ${e.params.entry.url ?? ""}`)) ||
    (e.method === "Runtime.consoleAPICalled" && e.params.type === "error"),
  );

try {
  // ---- BEFORE the gate: 23:59:59 America/New_York on Oct 16 ------------------------------------------------
  await phase("before", "2026-10-17T03:59:59Z", 4181, 9331, async (cdp, base) => {
    await cdp.send("Page.navigate", { url: `${base}/nhl/` });
    await delay(4000);
    const s = await evaluate(cdp, SNAPSHOT);
    const problems = runtimeProblems(cdp); // taken before this test makes its own probe requests
    assert(s.now === "2026-10-17T03:59:59.000Z", "before: the browser clock is 23:59:59 America/New_York on Oct 16");
    assert(s.games === 2 && !s.slugs.some((slug: string) => /edmonton|utah|buffalo|montreal-canadiens-vs-buffalo|rangers|capitals/.test(slug)), "before: /nhl/ shows only the Oct 16 slate (2 games), no Oct 17 card");
    assert(!/Edmonton|Utah Mammoth|Buffalo|Washington Capitals|October 17/.test(s.body) && !/Edmonton Oilers|Buffalo Sabres|Utah Mammoth|October 17/.test(s.html), "before: no Oct 17 team or date anywhere in the rendered HTML");
    assert(!premiumTerms.test(s.body) && !premiumTerms.test(s.html), "before: no Oct 17 pick, odds or verdict in the DOM");
    const slateApi = await evaluate(cdp, `fetch('/api/nhl/slate/2026-10-17').then(async (r) => [r.status, await r.text()])`);
    assert(slateApi[0] === 404 && !/Edmonton|Utah|Buffalo/.test(slateApi[1]), "before: /api/nhl/slate/2026-10-17 answers 404 without a listing");
    const content = await evaluate(cdp, `Promise.all(['utah-mammoth-vs-edmonton-oilers','montreal-canadiens-vs-buffalo-sabres-2026-10-17','columbus-blue-jackets-vs-new-york-rangers'].map((slug) => fetch('/api/match-content/' + slug).then(async (r) => [r.status, await r.text()])))`);
    assert(content.every(([status, body]: [number, string]) => status === 404 && !/Over 5\.5|1\.6\d|1\.72/.test(body)), "before: /api/match-content answers 404 for the BEST BET and both FREE games");
    assert(problems.length === 0, `before: no runtime, hydration or fetch errors (${JSON.stringify(problems).slice(0, 300)})`);
  });

  // ---- AT the gate (00:00:00) and ONE SECOND after ----------------------------------------------------------------
  for (const [label, at, serverPort, debugPort] of [["at the gate", "2026-10-17T04:00:00Z", 4182, 9332], ["1 second after", "2026-10-17T04:00:01Z", 4183, 9333]] as const) {
    await phase(label, at, serverPort, debugPort, async (cdp, base) => {
      await cdp.send("Page.navigate", { url: `${base}/nhl/` });
      await waitFor(async () => (await evaluate(cdp, "document.querySelectorAll('section.psp-game').length")) === 14, `14 games (${label})`, 20000);
      await delay(2500); // let the two FREE games fetch their content
      const s = await evaluate(cdp, SNAPSHOT);
      const problems = runtimeProblems(cdp); // taken before this test makes its own probe requests
      assert(s.now === at.replace("Z", ".000Z"), `${label}: the browser clock is ${at}`);
      assert(s.games === 14 && s.free === 2 && s.vip === 12, `${label}: /nhl/ renders 14 games (2 FREE, 12 PRIME VIP incl. the BEST BET)`);
      assert(/Saturday, October 17, 2026/.test(s.hero) && /14 NHL games today/.test(s.hero), `${label}: hero shows Saturday, October 17 and 14 games`);
      assert(/MAIN PREDICTION\s*Over 5\.5 total goals/i.test(s.text.rangers) && /1\.72/.test(s.text.rangers), `${label}: FREE Rangers @ Columbus shows Over 5.5 @ 1.72 and its analysis`);
      assert(/MAIN PREDICTION\s*Over 5\.5 total goals/i.test(s.text.sabres) && /1\.64/.test(s.text.sabres), `${label}: FREE Buffalo @ Montreal shows Over 5.5 @ 1.64 and its analysis`);
      assert(/Statistical matchup/i.test(s.text.rangers) && /Columbus' 4\.20 GA\/GP/.test(s.text.rangers), `${label}: the FREE analysis text is rendered`);
      assert(/BEST BET/.test(s.text.best) && !/Over 5\.5|1\.62|Projected total|Verdict/.test(s.text.best), `${label}: BEST BET shows only its teaser (prediction, odds and verdict protected)`);
      assert(!/Over 5\.5|Projected total|Verdict/.test(s.text.washington) && /Unlock PRIME VIP/.test(s.text.washington), `${label}: premium games stay locked`);
      const leaked = s.htmlWithoutFreeCards.match(/1.62|1.89|1.77|Over 5.0 total|Under 6.5 total|BEST TOTAL ON THE CARD|REJECT KINGS|Slate ranking/g);
      assert(leaked === null, `${label}: no premium odds, pick or verdict anywhere in the DOM outside the two FREE cards (${leaked?.join(',')})`);
      const protectedStatus = await evaluate(cdp, `Promise.all(['utah-mammoth-vs-edmonton-oilers','washington-capitals-vs-new-jersey-devils'].map((slug) => fetch('/api/match-content/' + slug).then(async (r) => [r.status, await r.text()])))`);
      assert(protectedStatus.every(([status, body]: [number, string]) => status === 401 && !/Over 5\.5|1\.62/.test(body)), `${label}: BEST BET / premium /api/match-content answers 401 without a VIP session`);
      assert(problems.length === 0, `${label}: no runtime, hydration or fetch errors (${JSON.stringify(problems).slice(0, 300)})`);
    });
  }
  console.log("ALL NHL OCT 17 RENDER TESTS PASSED");
} finally {
  for (const child of children) child.kill();
}
