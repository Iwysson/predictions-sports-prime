import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const BASELINE_SCHEMA_VERSION = 1;
export const ANALYSIS_HASH_METHOD = "sha256(JSON.stringify(decoded analysis string array), UTF-8)";

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function decodeString(raw, label) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`${label}: expected a JSON-compatible quoted string.`);
  }
}

function stringProperty(source, property, label, required = false) {
  const match = source.match(new RegExp(`^\\s*${property}:\\s*("(?:\\\\.|[^"\\\\])*")`, "m"));
  if (match) return decodeString(match[1], label);
  if (required) throw new Error(`${label}: missing ${property}.`);
  return null;
}

function numberProperty(source, property) {
  const match = source.match(new RegExp(`^\\s*${property}:\\s*(-?\\d+(?:\\.\\d+)?)`, "m"));
  return match ? Number(match[1]) : null;
}

function balancedValue(source, property, open, close, label) {
  const propertyMatch = new RegExp(`^\\s*${property}:\\s*\\${open}`, "m").exec(source);
  if (!propertyMatch) throw new Error(`${label}: missing ${property}.`);
  const start = propertyMatch.index + propertyMatch[0].lastIndexOf(open);
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === open) depth += 1;
    if (character === close) depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }

  throw new Error(`${label}: unterminated ${property}.`);
}

function parseAnalysis(source, label) {
  const block = balancedValue(source, "analysis", "[", "]", label);
  const values = [...block.matchAll(/"(?:\\.|[^"\\])*"/g)].map((match) =>
    decodeString(match[0], label)
  );
  if (values.length === 0) throw new Error(`${label}: published analysis is empty.`);
  return values;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseResult(picks, label) {
  const stringResult = picks.match(/^\s*result:\s*("(?:\\.|[^"\\])*")/m);
  if (stringResult) {
    return { status: decodeString(stringResult[1], label), source: "manual", finalScore: null };
  }
  if (!/^\s*result:\s*\{/m.test(picks)) {
    return { status: null, source: null, finalScore: null };
  }

  const result = balancedValue(picks, "result", "{", "}", label);
  const status = stringProperty(result, "status", label, true);
  const source = stringProperty(result, "source", label) ?? "manual";
  const scoreMatch = result.match(/finalScore:\s*\{\s*home:\s*(\d+)\s*,\s*away:\s*(\d+)\s*\}/m);
  return {
    status,
    source,
    finalScore: scoreMatch
      ? { home: Number(scoreMatch[1]), away: Number(scoreMatch[2]) }
      : null,
  };
}

export function collectEditorialState(root = process.cwd()) {
  const predictionsDirectory = join(root, "src", "data", "predictions");
  const files = walk(predictionsDirectory)
    .filter((file) => file.endsWith(".ts") && !file.endsWith(`${sep}index.ts`))
    .sort();
  const entries = [];
  let drafts = 0;

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const published = /^\s*published:\s*true\s*,?\s*$/m.test(source);
    if (!published) {
      drafts += 1;
      continue;
    }

    const path = relative(root, file).split(sep).join("/");
    const league = stringProperty(source, "league", path, true);
    const homeTeam = stringProperty(source, "homeTeam", path, true);
    const awayTeam = stringProperty(source, "awayTeam", path, true);
    const slug = stringProperty(source, "slug", path) ?? `${slugify(homeTeam)}-vs-${slugify(awayTeam)}`;
    const analysis = parseAnalysis(source, path);
    const picks = balancedValue(source, "picks", "{", "}", path);
    const mainPick = stringProperty(picks, "main", path, true);
    const odds = numberProperty(picks, "publishedOdds") ?? numberProperty(picks, "odds");
    const result = parseResult(picks, path);

    entries.push({
      slug,
      league,
      published: true,
      mainPick,
      odds,
      publishedAt: stringProperty(source, "publishedAt", path),
      updatedAt: stringProperty(source, "updatedAt", path),
      resultStatus: result.status,
      resultSource: result.source,
      finalScore: result.finalScore,
      analysisHash: createHash("sha256").update(JSON.stringify(analysis), "utf8").digest("hex"),
    });
  }

  entries.sort((left, right) => left.slug.localeCompare(right.slug));
  return { drafts, entries };
}

export function createBaselineManifest(root = process.cwd()) {
  const state = collectEditorialState(root);
  return {
    schemaVersion: BASELINE_SCHEMA_VERSION,
    hashAlgorithm: ANALYSIS_HASH_METHOD,
    publishedCount: state.entries.length,
    draftCount: state.drafts,
    entries: state.entries,
  };
}
