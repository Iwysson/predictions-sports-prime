// Local runtime harness for the NHL release gate: serves the built static export (out/) and the real Pages Function
// handlers (/api/nhl/slate, /api/match-content, /api/nhl/history, /api/nhl/status) with ONE frozen clock, and injects the same
// frozen clock into the browser (a Date override at the top of every HTML page). Nothing in the application code is
// stubbed: the page, its client bundle and the handlers are the production artefacts.
// Run: npx tsx scripts/lib/nhl-gate-harness.mts --at=2026-10-17T04:00:00Z --port=4173   (needs `npm run build` first)
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const AT = arg("at");
const PORT = Number(arg("port") ?? 4173);
if (!AT || Number.isNaN(Date.parse(AT))) throw new Error("--at=<ISO instant> is required");
const FROZEN = Date.parse(AT);

// Freeze the server clock for the handlers (they call `new Date()` per request).
const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...args: any[]) {
    super(...(args.length ? (args as [any]) : [FROZEN]));
  }
  static now() {
    return FROZEN;
  }
} as DateConstructor;

const { createMatchContentHandler } = await import("../../functions/api/match-content/[slug].js");
const { createNhlSlateHandler } = await import("../../functions/api/nhl/slate/[day].js");
const { createNhlHistoryHandler } = await import("../../functions/api/nhl/history.js");
const index = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8"));
// Placeholder auth configuration: a request without a bearer token is answered 401 before any auth call is made, and a request with one
// would fail closed (the Supabase URL is unreachable), so the harness can never grant premium content.
const HARNESS_ENV = { SUPABASE_URL: 'http://127.0.0.1:9', SUPABASE_SECRET_KEY: 'harness', SUPABASE_PUBLISHABLE_KEY: 'harness' };
const matchContent = createMatchContentHandler(index);
const nhlSlate = createNhlSlateHandler(() => new Date());
const noProvider = (async () => new Response("{}", { status: 503 })) as typeof fetch;
const nhlHistory = createNhlHistoryHandler(noProvider, () => new Date());

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2",
};
const clockScript = `<script>(function(){var F=${FROZEN},R=Date;function D(){var a=[].slice.call(arguments);return a.length?new (Function.prototype.bind.apply(R,[null].concat(a)))():new R(F)}D.prototype=R.prototype;D.now=function(){return F};D.UTC=R.UTC;D.parse=R.parse;window.Date=D;})();</script>`;

const send = (res: import("node:http").ServerResponse, status: number, body: string | Buffer, type: string) => {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
};
const sendResponse = async (res: import("node:http").ServerResponse, r: Response) => send(res, r.status, Buffer.from(await r.arrayBuffer()), r.headers.get("content-type") ?? "application/json");

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://harness");
    const api = url.pathname.match(/^\/api\/(.+)$/)?.[1];
    if (api) {
      const slate = api.match(/^nhl\/slate\/([^/]+)$/);
      const content = api.match(/^match-content\/([^/]+)$/);
      if (slate) return sendResponse(res, await nhlSlate({ params: { day: slate[1] } }));
      if (content) {
        const headers = new Headers();
        if (req.headers.authorization) headers.set("Authorization", String(req.headers.authorization));
        return sendResponse(res, await matchContent({ request: new Request(`http://harness${url.pathname}`, { headers }), params: { slug: decodeURIComponent(content[1]) }, env: HARNESS_ENV }));
      }
      if (api === "nhl/history") return sendResponse(res, await nhlHistory());
      if (api === "nhl/status") return send(res, 200, JSON.stringify({ date: "n/a", state: "unavailable", games: [] }), "application/json");
      return send(res, 404, "{}", "application/json");
    }
    let file = path.join("out", decodeURIComponent(url.pathname));
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
    if (!existsSync(file)) return send(res, 404, readFileSync("out/404.html"), "text/html; charset=utf-8");
    const type = TYPES[path.extname(file)] ?? "application/octet-stream";
    if (type.startsWith("text/html")) return send(res, 200, readFileSync(file, "utf8").replace(/<head>/i, `<head>${clockScript}`), type);
    return send(res, 200, readFileSync(file), type);
  } catch (error) {
    send(res, 500, String(error), "text/plain");
  }
}).listen(PORT, "127.0.0.1", () => console.log(`READY ${PORT} ${new RealDate(FROZEN).toISOString()}`));
