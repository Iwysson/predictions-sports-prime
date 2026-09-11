import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "out");
const protectedTextFiles = new Set([
  "ads.txt",
  "robots.txt",
  path.join("data", "brasileirao-2026.txt"),
]);
const removableRootArtifacts = new Set(["ads.txt.example", "league-badges.zip"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolutePath));
    else if (entry.isFile()) files.push(absolutePath);
  }

  return files;
}

function relativePath(absolutePath) {
  return path.relative(outputRoot, absolutePath);
}

async function isRoutePayload(absolutePath) {
  const name = path.basename(absolutePath);
  const relative = relativePath(absolutePath);

  if (protectedTextFiles.has(relative)) return false;
  if (name === "__next._full.txt" || name === "__next._tree.txt") return true;

  if (name === "index.txt") {
    const siblingHtml = path.join(path.dirname(absolutePath), "index.html");
    return stat(siblingHtml).then((value) => value.isFile()).catch(() => false);
  }

  if (name === "__PAGE__.txt") {
    return relative.split(path.sep).some((segment) => segment.startsWith("__next."));
  }

  return false;
}

const before = await walk(outputRoot);
const routePayloads = [];

for (const absolutePath of before) {
  if (await isRoutePayload(absolutePath)) routePayloads.push(absolutePath);
}

for (const absolutePath of routePayloads) await rm(absolutePath);

const removedRootArtifacts = [];
for (const artifact of removableRootArtifacts) {
  const absolutePath = path.join(outputRoot, artifact);
  if (before.includes(absolutePath)) {
    await rm(absolutePath);
    removedRootArtifacts.push(artifact);
  }
}

const after = await walk(outputRoot);
const remainingRoutePayloads = [];
for (const absolutePath of after) {
  if (await isRoutePayload(absolutePath)) remainingRoutePayloads.push(relativePath(absolutePath));
}

if (remainingRoutePayloads.length > 0) {
  throw new Error(`Route payload pruning incomplete: ${remainingRoutePayloads.slice(0, 5).join(", ")}`);
}

for (const protectedFile of protectedTextFiles) {
  if (!after.includes(path.join(outputRoot, protectedFile))) {
    throw new Error(`Protected public text file is missing: ${protectedFile}`);
  }
}

if (after.length >= 20_000) {
  throw new Error(`Cloudflare Pages Free file limit not met: ${after.length} files remain`);
}

console.log(`Static route payloads removed: ${routePayloads.length}`);
console.log(`Unused public artifacts removed: ${removedRootArtifacts.length}`);
console.log(`Deployment files: ${before.length} -> ${after.length}`);
