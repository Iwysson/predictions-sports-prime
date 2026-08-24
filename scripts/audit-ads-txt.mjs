import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const sourcePath = join(publicDir, "ads.txt");
const exportPath = join(root, "out", "ads.txt");
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hash(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function collectSourceFiles(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return [path];
  });
}

console.log("AdSense ads.txt audit\n");

const rootAdsFiles = readdirSync(publicDir).filter(
  (name) => name.toLowerCase() === "ads.txt",
);
check(
  rootAdsFiles.length === 1 && rootAdsFiles[0] === "ads.txt",
  "public must contain exactly one lowercase root ads.txt file",
);
check(existsSync(sourcePath), "public/ads.txt is missing");
check(existsSync(exportPath), "out/ads.txt is missing; run the production build first");

let publisherId;
let sourceBuffer;

if (existsSync(sourcePath)) {
  sourceBuffer = readFileSync(sourcePath);
  const sourceText = sourceBuffer.toString("utf8");
  const declaration = sourceText.match(
    /^google\.com, pub-(\d{16}), DIRECT, f08c47fec0942fa0\n$/,
  );

  check(
    !sourceBuffer.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])),
    "public/ads.txt must not contain a UTF-8 BOM",
  );
  check(
    [...sourceBuffer].every((byte) => byte <= 0x7f),
    "public/ads.txt must contain ASCII-compatible text only",
  );
  check(!sourceText.includes("\r"), "public/ads.txt must use LF line endings");
  check(
    !/<(?:!doctype|html|head|body)\b/i.test(sourceText),
    "public/ads.txt contains HTML instead of an ads declaration",
  );
  check(
    Boolean(declaration),
    "public/ads.txt must contain one canonical Google DIRECT declaration and one trailing LF",
  );

  publisherId = declaration?.[1];
}

if (sourceBuffer && existsSync(exportPath)) {
  const exportBuffer = readFileSync(exportPath);
  check(
    sourceBuffer.equals(exportBuffer),
    "out/ads.txt is not byte-for-byte identical to public/ads.txt",
  );
}

if (publisherId) {
  const productionFiles = collectSourceFiles(join(root, "src")).filter((path) =>
    [".ts", ".tsx", ".js", ".jsx"].includes(extname(path)),
  );
  const sourcePublisherIds = new Set();

  for (const path of productionFiles) {
    const contents = readFileSync(path, "utf8");
    for (const match of contents.matchAll(/ca-pub-(\d{16})/g)) {
      sourcePublisherIds.add(match[1]);
    }
  }

  check(sourcePublisherIds.size > 0, "no ca-pub publisher ID found in application source");
  check(
    sourcePublisherIds.size === 1 && sourcePublisherIds.has(publisherId),
    `application publisher IDs do not match ads.txt pub-${publisherId}`,
  );
}

if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  console.error(`\nAdSense ads.txt audit: FAIL (${errors.length} error(s))`);
  process.exit(1);
}

const sourceHash = hash(sourceBuffer);
console.log(`Source: ${relative(root, sourcePath)}`);
console.log(`Export: ${relative(root, exportPath)}`);
console.log(`Publisher: pub-${publisherId}`);
console.log(`Bytes: ${sourceBuffer.length}`);
console.log(`SHA-256: ${sourceHash}`);
console.log("Encoding: UTF-8/ASCII, no BOM, LF");
console.log("Source/export parity: PASS");
console.log("Publisher consistency: PASS");
console.log("AdSense ads.txt audit: PASS");
