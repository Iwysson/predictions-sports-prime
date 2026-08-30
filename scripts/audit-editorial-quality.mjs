import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const predictionRoot = join(root, "src", "data", "predictions");
const files = [];
const walk = (directory) => readdirSync(directory).forEach((name) => {
  const path = join(directory, name);
  if (statSync(path).isDirectory()) walk(path);
  else if (path.endsWith(".ts") && !path.endsWith(`${sep}index.ts`)) files.push(path);
});
walk(predictionRoot);

const quoted = (source, key) => source.match(new RegExp(`\\b${key}:\\s*["']([^"']+)["']`))?.[1];
const stringsInAnalysis = (source) => {
  const start = source.indexOf("analysis:");
  const end = source.indexOf("picks:", start);
  return [...source.slice(start, end).matchAll(/"((?:\\.|[^"\\])*)"/g)].map((match) => JSON.parse(`"${match[1]}"`));
};
const boilerplate = /this preview is intentionally limited|retained evidence boundary|verified fixture only/i;
const contextSignals = [
  /form|recent|last \d|record/i, /home|away/i, /goal|scor|conced|attack|defen/i,
  /corner/i, /head-to-head|h2h|meeting/i, /injur|suspend|lineup|team news/i,
  /rest|schedule|calendar|preparation/i, /market|odds|price|selection|pick/i, /risk/i,
];
const records = files.filter((file) => /\bpublished:\s*true/.test(readFileSync(file, "utf8"))).map((file) => {
  const source = readFileSync(file, "utf8");
  const paragraphs = stringsInAnalysis(source);
  const text = paragraphs.join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const signals = contextSignals.filter((pattern) => pattern.test(text)).length;
  const reasons = [];
  let status = "good";
  if (!quoted(source, "main") || !paragraphs.length || /lorem ipsum|placeholder text|add analysis/i.test(text) || /\bTODO\b/.test(text)) {
    status = "critical";
    reasons.push("missing or placeholder editorial content");
  } else if (words < 220 || paragraphs.length < 3 || signals < 4 || boilerplate.test(text)) {
    status = "warning";
    if (words < 220) reasons.push(`${words} words`);
    if (paragraphs.length < 3) reasons.push(`${paragraphs.length} paragraphs`);
    if (signals < 4) reasons.push(`${signals} context signals`);
    if (boilerplate.test(text)) reasons.push("evidence-boundary boilerplate");
  }
  return { file: relative(root, file).split(sep).join("/"), status, reasons };
});

const counts = Object.fromEntries(["good", "warning", "critical"].map((status) => [status, records.filter((record) => record.status === status).length]));
console.log(`Editorial quality: ${counts.good} good / ${counts.warning} warning / ${counts.critical} critical`);
records.filter((record) => record.status !== "good").forEach((record) => console.log(`${record.status.toUpperCase()}: ${record.file}: ${record.reasons.join(", ")}`));
if (counts.critical) process.exitCode = 1;
