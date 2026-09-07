import type { EditorialPrediction, PredictionResultStatus } from "@/types";
import {
  parseStatisticalCoreRows,
  validatePartialStatisticalCoreRows,
} from "@/lib/statistical-core";

export const PSP_EDITORIAL_STANDARD = "psp-v1" as const;
export const PSP_EDITORIAL_POLICY_EFFECTIVE_AT = "2026-09-02T00:00:00-03:00";
export const PSP_EDITORIAL_TIME_ZONE = "America/Sao_Paulo";
export const PSP_NATURAL_RISK_POLICY_EFFECTIVE_AT = "2026-09-07T12:00:00-03:00";

const PLACEHOLDER_FIELD = /^(?:—|-|–|n\/?a|na|tbd|pending|unknown|null|undefined)?$/i;
const FINAL_RESULT_STATUSES = new Set<PredictionResultStatus>([
  "green",
  "red",
  "push",
  "half-green",
  "half-red",
  "void",
]);

export type PspEditorialLifecycle =
  | "historical-frozen"
  | "future-pre-match"
  | "unresolved-quarantine";

function occurrences(text: string, pattern: RegExp) {
  return [...text.matchAll(new RegExp(
    pattern.source,
    pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`
  ))].length;
}

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function nonPlaceholder(value: string | undefined) {
  return Boolean(value && !PLACEHOLDER_FIELD.test(value.trim()));
}

function localNowParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PSP_EDITORIAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    time: `${value("hour")}:${value("minute")}`,
  };
}

function resultStatus(prediction: EditorialPrediction) {
  const result = prediction.picks.result;
  return typeof result === "string" ? result : result?.status;
}

function hasFinalResult(prediction: EditorialPrediction) {
  const status = resultStatus(prediction);
  if (status && FINAL_RESULT_STATUSES.has(status)) return true;
  const result = prediction.picks.result;
  return typeof result === "object" && Boolean(result?.finalScore);
}

/**
 * Editorial lifecycle only. Historical means "do not rewrite/migrate editorial content".
 * Result ingestion may still finalize score/betResult through the existing result pipeline.
 */
export function classifyPspEditorialLifecycle(
  prediction: EditorialPrediction,
  now: Date = new Date()
): PspEditorialLifecycle {
  if (hasFinalResult(prediction)) return "historical-frozen";

  const date = prediction.matchInfo?.date?.trim();
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "unresolved-quarantine";

  const current = localNowParts(now);
  if (date < current.date) return "historical-frozen";
  if (date > current.date) return "future-pre-match";

  const time = prediction.matchInfo?.time?.trim();
  // Same-day records without a reliable time are quarantined. They must not be migrated
  // until fixture metadata resolves whether kickoff is still future or already historical.
  if (!time || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return "unresolved-quarantine";
  return time <= current.time ? "historical-frozen" : "future-pre-match";
}

export function isPspFutureEligible(
  prediction: EditorialPrediction,
  now: Date = new Date()
) {
  return classifyPspEditorialLifecycle(prediction, now) === "future-pre-match";
}

export function isPspPolicyEnforcedForPrediction(
  prediction: EditorialPrediction,
  now: Date = new Date()
) {
  if (!isPspFutureEligible(prediction, now)) return false;
  if (prediction.editorialStandard === PSP_EDITORIAL_STANDARD) return true;

  const timestamps = [prediction.publishedAt, prediction.updatedAt]
    .filter((value): value is string => Boolean(value))
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value));
  const effectiveAt = Date.parse(PSP_EDITORIAL_POLICY_EFFECTIVE_AT);
  return timestamps.some((value) => value >= effectiveAt);
}

export function validatePspEditorialStandard(prediction: EditorialPrediction) {
  const errors: string[] = [];
  const markdown = prediction.analysis.join("\n\n").replace(/\r\n/g, "\n");
  const naturalRiskPolicyApplies = [prediction.publishedAt, prediction.updatedAt]
    .filter((value): value is string => Boolean(value))
    .some((value) => Date.parse(value) >= Date.parse(PSP_NATURAL_RISK_POLICY_EFFECTIVE_AT));

  if (naturalRiskPolicyApplies && /^#{1,6}\s*(?:Conflict Detector|Risks and Counter-Signals)\s*$/im.test(markdown)) {
    errors.push("new content must integrate risks into natural prose without an artificial risk heading");
  }
  if (naturalRiskPolicyApplies) {
    const provenance = prediction.statisticalCoreProvenance;
    if (provenance) {
      if (provenance.home.sampleType !== "home") errors.push("host Statistical Core must use sampleType: home");
      if (provenance.away.sampleType !== "away") errors.push("visitor Statistical Core must use sampleType: away");
      for (const [side, sample] of [["home", provenance.home], ["away", provenance.away]] as const) {
        if (!sample.source || !sample.competition || sample.matches < 1) errors.push(`${side} Statistical Core provenance is incomplete`);
      }
      if (!/^\d{4}\/\d{2}$/.test(provenance.season)) errors.push("Statistical Core provenance season must use YYYY/YY");
    }
  }

  if (prediction.analysisFormat !== "markdown") errors.push("analysisFormat must be markdown");
  if (!/^#\s+.+Prediction.+(?:Odds|Betting Tips)/im.test(markdown)) errors.push("missing PSP H1 with Prediction and Odds/Betting Tips");

  const predictionLabels = occurrences(markdown, /\*\*Prediction:\*\*/gi);
  const oddsLabels = occurrences(markdown, /\*\*Odds:\*\*/gi);
  if (predictionLabels < 2) errors.push("Prediction must appear at the opening and final closing");
  if (oddsLabels < 2) errors.push("Odds must appear at the opening and final closing");

  if (!prediction.picks.main.trim()) errors.push("main prediction is missing");
  const publishedOdds = prediction.picks.publishedOdds ?? prediction.picks.odds;
  if (publishedOdds === undefined) errors.push("published odds are missing");

  // Date/time are required in the editorial source because they define pre-match vs frozen history.
  // Round/venue/location may come from the verified fixture pipeline and are therefore not duplicated
  // as hard blockers here.
  const info = prediction.matchInfo;
  if (!nonPlaceholder(info?.date)) errors.push("matchInfo.date is required");
  if (!nonPlaceholder(info?.time)) errors.push("matchInfo.time is required");

  if (!/probable lineups|expected lineups|confirmed lineups|projected lineup was not available/i.test(markdown) && !prediction.matchSeo?.lineups) {
    errors.push("lineup status or an explicit unavailability disclosure is required");
  }
  if (prediction.matchSeo?.lineups) {
    if (prediction.matchSeo.lineups.home.players.length !== 11 || prediction.matchSeo.lineups.away.players.length !== 11) {
      errors.push("structured lineups must contain exactly 11 players per team");
    }
  }

  if (!/team news|injur(?:y|ies)|fitness|availability|team-availability report was found/i.test(markdown) && !prediction.matchSeo?.availability && !prediction.matchSeo?.teamNews) {
    errors.push("team-news status or an explicit unavailability disclosure is required");
  }
  if (!/suspension|suspended|eligibility/i.test(markdown)) errors.push("suspensions/eligibility check is required");

  const wordCount = words(markdown);
  if (wordCount < 650) errors.push(`robust analysis requires at least 650 words (found ${wordCount})`);
  if (!/\bhome\b/i.test(markdown) || !/\baway\b/i.test(markdown)) errors.push("HOME-versus-AWAY split analysis is required");
  for (const [label, pattern] of [
    ["xG/xGA", /\bxg\b|\bxga\b/i],
    ["shots/SOT", /shots|sot|shots on target/i],
    ["possession", /possession/i],
    ["goals", /goals?|btts|clean sheet/i],
    ["corners", /corners?/i],
  ] as const) {
    if (!pattern.test(markdown)) errors.push(`advanced-data coverage missing: ${label}`);
  }
  if (!/game state|tactical|territorial|transition|pressure|tempo|state can|forced into/i.test(markdown)) {
    errors.push("tactical / expected game-state analysis is required");
  }

  const coreHeadings = occurrences(markdown, /^#{1,6}\s*Statistical Core Predictions-Sports-Prime\s*$/gim);
  if (coreHeadings !== 1) errors.push(`exactly one Statistical Core source section is required (found ${coreHeadings})`);
  const rows = parseStatisticalCoreRows(markdown);
  if (rows.length) errors.push(...validatePartialStatisticalCoreRows(rows).map((error) => `Statistical Core: ${error}`));
  else if (!/metrics?[\s\S]{0,120}(?:remain|were|was|are) unavailable|no sourced home.*away split/i.test(markdown)) errors.push("partial Statistical Core needs an explicit missing-data disclosure");

  if (!/\b(?:risk|concern|danger|limitation|uncertain|however|although|despite|against the (?:bet|pick|selection))\b/i.test(markdown) &&
      !(!naturalRiskPolicyApplies && /(?:Conflict Detector|Risks and Counter-Signals)/i.test(markdown))) {
    errors.push("integrated risk / contrary-evidence analysis is required");
  }
  if (!/implied probability/i.test(markdown) || !/1\s*\/\s*(?:odds|decimal|price)|1\s*\/\s*\d/i.test(markdown)) {
    errors.push("raw implied-probability explanation is required");
  }
  if (!/\bvalue\b|market price|price of|priced at/i.test(markdown)) errors.push("value/market-price assessment is required");

  const boldFragments = [...markdown.matchAll(/\*\*([^*]+)\*\*/g)].map((match) => match[1]);
  const boldEvidence = boldFragments.filter((value) => /\d|%/.test(value) && !/^(?:Prediction|Odds):?$/i.test(value.trim()));
  if (boldEvidence.length < 2) errors.push("use at least two bold evidence-bearing statistics/percentages for scanability");

  return errors;
}
