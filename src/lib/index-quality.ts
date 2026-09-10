import type { EditorialPrediction } from "@/types";
import {
  classifyPspEditorialLifecycle,
  validatePspEditorialStandard,
} from "@/lib/editorial-standard";

export type IndexQualityClassification =
  | "INDEX_PRIME"
  | "INDEX_STANDARD"
  | "UPGRADE"
  | "HISTORICAL"
  | "REMOVE";

export type HistoricalIndexability =
  | "HISTORICAL_INDEXABLE"
  | "HISTORICAL_NOINDEX";

export type LocalizationQuality = "READY" | "NOT_EVALUATED";

export type IndexQualityDecision = {
  classification: IndexQualityClassification;
  indexable: boolean;
  reasons: string[];
  source: "quality-gate-v2-current-quality";
  lifecycle: ReturnType<typeof classifyPspEditorialLifecycle>;
  localizationQuality: LocalizationQuality;
  historicalIndexability?: HistoricalIndexability;
  checks: {
    contentComplete: boolean;
    sourcesComplete: boolean;
    statisticalCoreComplete: boolean;
    provenanceComplete: boolean;
    metadataValid: boolean;
    internalNotesClean: boolean;
    editorialUnique: boolean;
    fixtureValid: boolean;
    resultPickIntegrity: boolean;
    factualConsistency: boolean;
    tacticalQuality: boolean;
    paragraphQuality: boolean;
  };
};

type CurrentDecision = {
  classification: "KEEP" | "UPGRADE" | "LEGACY-NOINDEX" | "REMOVE";
  indexable: boolean;
};

const INTERNAL_NOTE = /\b(?:WAIT LIVE|TODO|FIXME|TBD|PLACEHOLDER|internal note|editorial note|do not publish|undefined|null)\b/i;
const TRACEABLE_SOURCE = /^https:\/\//i;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function hasCompleteProvenance(prediction: EditorialPrediction) {
  const provenance = prediction.statisticalCoreProvenance;
  return Boolean(
    provenance &&
      /^\d{4}\/\d{2}$/.test(provenance.season) &&
      provenance.home.sampleType === "home" &&
      provenance.away.sampleType === "away" &&
      provenance.home.source &&
      provenance.away.source &&
      provenance.home.competition &&
      provenance.away.competition &&
      provenance.home.matches > 0 &&
      provenance.away.matches > 0
  );
}

function hasParagraphQuality(markdown: string) {
  const analytical = markdown
    .split(/\n\s*\n/)
    .filter((item) => !/^\s*(?:#|\||[-*]\s|\*\*(?:Prediction|Odds):)/.test(item));
  return analytical.every((item) => words(item) >= 20);
}

function hasEditorialUniqueness(markdown: string) {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((item) => item.toLowerCase().replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 80 && !item.startsWith("|"));
  return new Set(paragraphs).size === paragraphs.length;
}

export function evaluatePredictionIndexQuality(
  prediction: EditorialPrediction,
  current: CurrentDecision
): IndexQualityDecision {
  const lifecycle = classifyPspEditorialLifecycle(prediction);
  const markdown = prediction.analysis.join("\n\n");
  const sourceCount = (prediction.sources ?? []).filter((source) =>
    TRACEABLE_SOURCE.test(source.url)
  ).length;
  const pspErrors = prediction.editorialStandard === "psp-v1"
    ? validatePspEditorialStandard(prediction)
    : [];
  const coreRequired = prediction.editorialStandard === "psp-v1";
  const provenanceRequired = pspErrors.some((error) => /structured Statistical Core|provenance/i.test(error));
  const provenanceComplete = !provenanceRequired || hasCompleteProvenance(prediction);
  const statisticalCoreComplete =
    !coreRequired || !pspErrors.some((error) => /Statistical Core/i.test(error));
  const checks = {
    contentComplete: words(markdown) >= (coreRequired ? 650 : 300),
    sourcesComplete:
      sourceCount > 0 &&
      (prediction.sourceStatus === "verified" || prediction.sourceStatus === "partial"),
    statisticalCoreComplete,
    provenanceComplete,
    metadataValid: Boolean(prediction.homeTeam && prediction.awayTeam && prediction.picks.main),
    internalNotesClean: !INTERNAL_NOTE.test(markdown),
    editorialUnique: hasEditorialUniqueness(markdown),
    fixtureValid: Boolean(
      prediction.matchInfo?.date?.match(/^\d{4}-\d{2}-\d{2}$/) &&
      (lifecycle === "historical-frozen" || prediction.matchInfo?.time?.match(/^(?:[01]\d|2[0-3]):[0-5]\d$/))
    ),
    resultPickIntegrity: Boolean(
      prediction.picks.main.trim() &&
      (prediction.picks.publishedOdds ?? prediction.picks.odds) !== undefined
    ),
    factualConsistency: prediction.homeTeam !== prediction.awayTeam && !/\bVERIFY\b/i.test(markdown),
    tacticalQuality: !coreRequired || /tactical|transition|press(?:ing|ure)|game state|set pieces?|width|half-spaces?/i.test(markdown),
    paragraphQuality: coreRequired ? true : hasParagraphQuality(markdown),
  };

  const localizationQuality: LocalizationQuality = "NOT_EVALUATED";
  if (!prediction.published || current.classification === "REMOVE") {
    return { classification: "REMOVE", indexable: false, reasons: [current.classification === "REMOVE" ? "remove_sovereign" : "not_published"], source: "quality-gate-v2-current-quality", lifecycle, localizationQuality, checks };
  }

  const failureReasons: Record<keyof typeof checks, string> = {
    contentComplete: "content_incomplete",
    sourcesComplete: "sources_incomplete",
    statisticalCoreComplete: "statistical_core_incomplete",
    provenanceComplete: "source_provenance_missing",
    metadataValid: "metadata_invalid",
    internalNotesClean: "internal_notes_present",
    editorialUnique: "editorial_duplication_blocking",
    fixtureValid: "fixture_invalid",
    resultPickIntegrity: "result_pick_integrity_invalid",
    factualConsistency: "factual_consistency_invalid",
    tacticalQuality: "tactical_quality_insufficient",
    paragraphQuality: "paragraph_quality_insufficient",
  };
  const failed = (Object.entries(checks) as Array<[keyof typeof checks, boolean]>)
    .filter(([, passed]) => !passed)
    .map(([name]) => failureReasons[name]);
  // For current future psp-v1 pages, word-count and keyword heuristics are
  // diagnostics rather than publication blockers. The editorial contract
  // permits publishable gaps; integrity, provenance, fixture identity,
  // metadata, sources and pick/odds checks remain mandatory below.
  const blockingFailed = coreRequired && lifecycle === "future-pre-match"
    ? failed.filter((reason) =>
        reason !== "content_incomplete" &&
        reason !== "tactical_quality_insufficient"
      )
    : failed;

  if (lifecycle === "unresolved-quarantine") {
    return { classification: "UPGRADE", indexable: false, reasons: ["lifecycle_unresolved", ...failed], source: "quality-gate-v2-current-quality", lifecycle, localizationQuality, checks };
  }

  if (lifecycle === "historical-frozen") {
    const historicalSafetyPassed = checks.metadataValid && checks.internalNotesClean && checks.resultPickIntegrity && checks.factualConsistency;
    const historicalIndexable = historicalSafetyPassed && (current.indexable || failed.length === 0);
    return {
      classification: "HISTORICAL",
      indexable: historicalIndexable,
      historicalIndexability: historicalIndexable ? "HISTORICAL_INDEXABLE" : "HISTORICAL_NOINDEX",
      reasons: historicalIndexable ? ["historical_quality_minimum_passed"] : ["historical_quality_minimum_failed", ...failed],
      source: "quality-gate-v2-current-quality",
      lifecycle,
      localizationQuality,
      checks,
    };
  }

  if (pspErrors.length || blockingFailed.length) {
    return { classification: "UPGRADE", indexable: false, reasons: [...new Set([...blockingFailed, ...pspErrors.map(() => "editorial_contract_failed")])], source: "quality-gate-v2-current-quality", lifecycle, localizationQuality, checks };
  }

  const prime = coreRequired && prediction.sourceStatus === "verified" && provenanceComplete;
  return {
    classification: prime ? "INDEX_PRIME" : "INDEX_STANDARD",
    indexable: true,
    reasons: prime
      ? ["editorial_complete", "sources_verified", "metadata_valid", "unique_content", "statistical_core_complete", "provenance_complete"]
      : ["essential_quality_gate_passed", "sources_acceptable", "metadata_valid", "unique_content"],
    source: "quality-gate-v2-current-quality",
    lifecycle,
    localizationQuality,
    checks,
  };
}
