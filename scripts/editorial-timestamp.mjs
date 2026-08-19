import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

const [, , action, inputPath, suppliedTimestamp] = process.argv;
const root = process.cwd();

function fail(message) {
  console.error(`Editorial timestamp: ${message}`);
  process.exit(1);
}

if (!["publish", "update"].includes(action) || !inputPath) {
  fail("use `npm run editorial:timestamp -- publish|update <prediction-file> [ISO timestamp]`.");
}

const file = resolve(root, inputPath);
const relativePath = relative(root, file).split(sep).join("/");
if (!relativePath.startsWith("src/data/predictions/") || !relativePath.endsWith(".ts")) {
  fail("the target must be a TypeScript prediction file under src/data/predictions/.");
}

const timestamp = suppliedTimestamp ?? new Date().toISOString();
if (Number.isNaN(Date.parse(timestamp)) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(timestamp)) {
  fail("the timestamp must be a valid ISO-8601 timestamp.");
}

let source = readFileSync(file, "utf8");
if (!/published:\s*true/.test(source)) fail("the prediction must currently have published: true.");

if (action === "publish") {
  if (/publishedAt:\s*["']/.test(source)) fail("publishedAt already exists and was not changed.");

  let previous = "";
  try {
    previous = execFileSync("git", ["show", `HEAD:${relativePath}`], { encoding: "utf8" });
  } catch {
    // A new, untracked prediction has no HEAD version and is eligible for first publication.
  }
  if (/published:\s*true/.test(previous)) {
    fail("HEAD already contains this prediction as published; this is not a new publication transition.");
  }

  source = source.replace(/(^\s*)published:\s*true/m, `$1publishedAt: "${timestamp}",\n\n$1published: true`);
} else {
  const publishedAt = source.match(/publishedAt:\s*["']([^"']+)["']/)?.[1];
  if (!publishedAt) fail("set publishedAt before recording an editorial update.");
  if (Date.parse(timestamp) < Date.parse(publishedAt)) fail("updatedAt cannot be earlier than publishedAt.");

  if (/updatedAt:\s*["']/.test(source)) {
    source = source.replace(/updatedAt:\s*["'][^"']+["']/, `updatedAt: "${timestamp}"`);
  } else {
    source = source.replace(/(^\s*)publishedAt:\s*(["'][^"']+["'],?)/m, `$1publishedAt: $2\n$1updatedAt: "${timestamp}",`);
  }
}

writeFileSync(file, source, "utf8");
console.log(`${action === "publish" ? "publishedAt" : "updatedAt"} set to ${timestamp} in ${relativePath}`);
