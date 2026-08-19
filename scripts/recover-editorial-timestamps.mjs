import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const predictionRoot = join(root, "src", "data", "predictions");
const shouldWrite = process.argv.includes("--write");

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

const recovered = [];
const unresolved = [];

for (const file of walk(predictionRoot).filter((path) => path.endsWith(".ts") && !path.endsWith(`${sep}index.ts`))) {
  let source = readFileSync(file, "utf8");
  if (!/published:\s*true/.test(source) || /publishedAt:\s*["']/.test(source)) continue;

  const gitPath = relative(root, file).split(sep).join("/");
  const commits = git(["log", "--format=%H|%aI|%s", "--", gitPath]).split(/\r?\n/).filter(Boolean);
  const publicationStates = [];

  for (const entry of commits) {
    const [hash, authoredAt, ...subjectParts] = entry.split("|");
    let historicalSource;
    try {
      historicalSource = git(["show", `${hash}:${gitPath}`]);
    } catch {
      continue;
    }
    if (/published:\s*true/.test(historicalSource)) {
      publicationStates.push({ hash, authoredAt, subject: subjectParts.join("|") });
    }
  }

  const publication = publicationStates.at(-1);
  if (!publication) {
    unresolved.push(gitPath);
    continue;
  }

  const timestamp = new Date(publication.authoredAt).toISOString();
  recovered.push({ gitPath, timestamp, ...publication });

  if (shouldWrite) {
    source = source.replace(/(^\s*)published:\s*true/m, `$1publishedAt: "${timestamp}",\n\n$1published: true`);
    writeFileSync(file, source, "utf8");
  }
}

const groups = Map.groupBy(recovered, (item) => `${item.hash}|${item.timestamp}|${item.subject}`);
const report = [
  "# Editorial Timestamp Recovery",
  "",
  "Publication timestamps were recovered from the earliest Git commit in which each current prediction file contains `published: true`. Git author timestamps were normalized to UTC. Match dates and build time were not used.",
  "",
  `- Recovered publishedAt: ${recovered.length}`,
  "- Recovered updatedAt: 0",
  `- Still unresolved: ${unresolved.length}`,
  "",
  "No `updatedAt` values were inferred: later file changes found during review were fixture metadata or non-editorial changes, not reliably significant editorial revisions.",
  "",
  "## Sources",
  "",
  "| Commit | Author timestamp (UTC) | Subject | Predictions |",
  "|---|---|---|---:|",
  ...[...groups.entries()].map(([key, items]) => {
    const [hash, timestamp, subject] = key.split("|");
    return `| \`${hash.slice(0, 7)}\` | ${timestamp} | ${subject} | ${items.length} |`;
  }),
  "",
  ...(unresolved.length ? ["## Unresolved", "", ...unresolved.map((path) => `- \`${path}\``), ""] : []),
].join("\n");

if (shouldWrite) writeFileSync(join(root, "EDITORIAL-TIMESTAMP-RECOVERY.md"), report, "utf8");
console.log(report);
