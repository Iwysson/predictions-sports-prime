import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "out");
function walk(path) { return readdirSync(path).flatMap((name) => { const item = join(path, name); return statSync(item).isDirectory() ? walk(item) : [item]; }); }
function bytes(files) { return files.reduce((total, file) => total + statSync(file).size, 0); }
function route(path) {
  const htmlPath = join(out, ...path.split("/").filter(Boolean), "index.html");
  const html = readFileSync(htmlPath, "utf8");
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  const jsFiles = [...new Set(scripts)].map((src) => join(out, ...src.replace(/^\//, "").split("/"))).filter((file) => statSync(file, { throwIfNoEntry: false }));
  return { htmlBytes: Buffer.byteLength(html), jsBytes: bytes(jsFiles), scripts: scripts.length };
}
const files = walk(out);
const metrics = {
  htmlTotalBytes: bytes(files.filter((file) => file.endsWith(".html"))),
  jsTotalBytes: bytes(files.filter((file) => file.endsWith(".js"))),
  home: route("/"),
  matchPilot: route("/match/barcelona-vs-rayo-vallecano/"),
  leaguePilot: route("/league/premier-league/"),
};
console.log(JSON.stringify(metrics, null, 2));
