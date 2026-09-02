import { editorialPredictions } from "../src/data/predictions/index.ts";
import {
  PSP_EDITORIAL_STANDARD,
  classifyPspEditorialLifecycle,
} from "../src/lib/editorial-standard.ts";

const now = process.env.PSP_AUDIT_NOW ? new Date(process.env.PSP_AUDIT_NOW) : new Date();
if (Number.isNaN(now.valueOf())) throw new Error("PSP_AUDIT_NOW must be a valid ISO date-time when supplied.");

const boilerplate = /this preview is intentionally limited|retained evidence boundary|verified fixture only/i;
const pspCore = /Statistical Core Predictions-Sports-Prime/i;
const contextSignals = [
  /form|recent|last \d|record/i,
  /home|away/i,
  /goal|scor|conced|attack|defen/i,
  /corner/i,
  /head-to-head|h2h|meeting/i,
  /injur|suspend|lineup|team news/i,
  /rest|schedule|calendar|preparation/i,
  /market|odds|price|selection|pick/i,
  /risk|conflict/i,
];

const published = editorialPredictions.filter((prediction) => prediction.published === true);
const historical = published.filter((prediction) => classifyPspEditorialLifecycle(prediction, now) === "historical-frozen");
const future = published.filter((prediction) => classifyPspEditorialLifecycle(prediction, now) === "future-pre-match");
const unresolved = published.filter((prediction) => classifyPspEditorialLifecycle(prediction, now) === "unresolved-quarantine");

const records = future.map((prediction) => {
  const text = prediction.analysis.join("\n\n");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const signals = contextSignals.filter((pattern) => pattern.test(text)).length;
  const reasons = [];
  let status = "good";

  if (!prediction.picks.main?.trim() || !prediction.analysis.length || /lorem ipsum|placeholder text|add analysis/i.test(text) || /\bTODO\b/.test(text)) {
    status = "critical";
    reasons.push("missing or placeholder editorial content");
  } else {
    if (prediction.editorialStandard !== PSP_EDITORIAL_STANDARD) reasons.push(`not marked ${PSP_EDITORIAL_STANDARD}`);
    if (words < 650) reasons.push(`${words} words (<650 PSP target)`);
    if (signals < 4) reasons.push(`${signals} context signals`);
    if (boilerplate.test(text)) reasons.push("evidence-boundary boilerplate");
    if (!pspCore.test(text)) reasons.push("missing Statistical Core Predictions-Sports-Prime");
    if (reasons.length) status = "warning";
  }

  const slug = prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`;
  return { file: `${prediction.league}/${slug}`, status, reasons };
});

const counts = Object.fromEntries(["good", "warning", "critical"].map((status) => [
  status,
  records.filter((record) => record.status === status).length,
]));

console.log("Editorial quality audit — FUTURE ONLY");
console.log(`Historical frozen/skipped: ${historical.length}`);
console.log(`Future/pre-match audited: ${future.length}`);
console.log(`Unresolved/quarantined skipped: ${unresolved.length}`);
console.log(`Future editorial quality: ${counts.good} good / ${counts.warning} warning / ${counts.critical} critical`);
records.filter((record) => record.status !== "good").forEach((record) => {
  console.log(`${record.status.toUpperCase()}: ${record.file}: ${record.reasons.join(", ")}`);
});
if (counts.critical) process.exitCode = 1;
