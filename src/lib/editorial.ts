import {
  EditorialPrediction,
  Match,
  MatchPreview,
  PredictionItem,
} from "@/types";
import { leaguesBySlug } from "@/data/leagues";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const KICKOFF_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const PLACEHOLDER_PATTERN = /\b(?:lorem ipsum|todo|add analysis|placeholder text|coming soon)\b/i;
const MIN_PUBLISHED_ANALYSIS_CHARACTERS = 300;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;

function isValidIsoTimestamp(value: string) {
  if (!ISO_TIMESTAMP_PATTERN.test(value)) return false;
  return !Number.isNaN(new Date(value).valueOf());
}

export function toMatchPreview(match: Match): MatchPreview {
  const mainPrediction = match.predictions.find((item) => item.label === "Main Prediction");
  const odds = match.predictions.find((item) => item.label === "Odds");

  return {
    id: match.id,
    slug: match.slug,
    league: match.league,
    round: match.round,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    date: match.date,
    time: match.time,
    venue: match.venue,
    status: match.status,
    title: match.title,
    betResult: match.betResult,
    betResultSource: match.betResultSource,
    fixtureStatus: match.fixtureStatus,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    mainPrediction: mainPrediction?.value,
    odds: odds ? Number(odds.value) : undefined,
  };
}

export function slugifyMatchPart(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function predictionSlug(
  homeTeam: string,
  awayTeam: string
) {
  return `${slugifyMatchPart(homeTeam)}-vs-${slugifyMatchPart(awayTeam)}`;
}

function picksToItems(
  prediction: EditorialPrediction
): PredictionItem[] {
  const picks = prediction.picks;
  const items: PredictionItem[] = [
    {
      label: "Main Prediction",
      value: picks.main,
    },
  ];

  if (picks.odds !== undefined) {
    items.push({
      label: "Odds",
      value: String(picks.odds),
    });
  }

  return items;
}

export function editorialToMatch(
  prediction: EditorialPrediction
): Match {
  const slug = prediction.slug ?? predictionSlug(
      prediction.homeTeam,
      prediction.awayTeam
    );

  return {
    id: `${prediction.league}-${slug}`,
    slug,
    league: prediction.league,
    round: prediction.matchInfo?.round ?? "Current Round",
    homeTeam: prediction.homeTeam,
    awayTeam: prediction.awayTeam,
    date: prediction.matchInfo?.date ?? "",
    time: prediction.matchInfo?.time ?? "TBD",
    venue: prediction.matchInfo?.venue,
    status: "published",
    title:
      prediction.title ??
      `${prediction.homeTeam} vs ${prediction.awayTeam} Prediction`,
    analysis: prediction.analysis,
    comment: prediction.comment,
    predictions: picksToItems(prediction),
    betResult: typeof prediction.picks.result === "string"
      ? prediction.picks.result
      : prediction.picks.result?.status,
    betResultSource: prediction.picks.result
      ? (typeof prediction.picks.result === "string"
          ? "manual"
          : prediction.picks.result.source ?? "manual")
      : undefined,
    publishedAt: prediction.publishedAt,
    updatedAt: prediction.updatedAt,
  };
}

export function buildPublishedMatches(
  predictions: EditorialPrediction[]
) {
  return predictions
    .filter((prediction) => prediction.published === true)
    .map(editorialToMatch);
}

export function validateEditorialPredictions(
  predictions: EditorialPrediction[]
) {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();
  const seenIdentities = new Set<string>();
  const seenImports = new Set<EditorialPrediction>();
  const seenPublishedBodies = new Map<string, string>();

  predictions.forEach((prediction, index) => {
    const label = `Prediction ${index + 1}`;
    const isPublished = prediction.published === true;
    const isDraft = !isPublished;

    if (seenImports.has(prediction)) {
      errors.push(`${label}: the same prediction object was imported more than once.`);
    }
    seenImports.add(prediction);

    if (typeof prediction.published !== "boolean") {
      errors.push(`${label}: published must be explicitly true or false.`);
    }

    if (!prediction.league) {
      errors.push(`${label}: league is required.`);
    } else if (!leaguesBySlug[prediction.league]) {
      errors.push(`${label}: league is not registered.`);
    }

    if (!prediction.homeTeam.trim()) {
      errors.push(`${label}: homeTeam is required.`);
    }

    if (!prediction.awayTeam.trim()) {
      errors.push(`${label}: awayTeam is required.`);
    }

    if (
      prediction.homeTeam.trim().toLowerCase() ===
      prediction.awayTeam.trim().toLowerCase()
    ) {
      errors.push(`${label}: home and away team cannot be the same.`);
    }

    if (!isDraft) {
      if (
        !prediction.analysis.length ||
        prediction.analysis.every((paragraph) => !paragraph.trim())
      ) {
        errors.push(`${label}: add at least one analysis paragraph.`);
      }

      if (!prediction.picks.main.trim()) {
        errors.push(`${label}: main prediction is required.`);
      }

      const analysisText = prediction.analysis.join(" ").replace(/\s+/g, " ").trim();
      if (analysisText.length < MIN_PUBLISHED_ANALYSIS_CHARACTERS) {
        errors.push(
          `${label}: published analysis must contain at least ${MIN_PUBLISHED_ANALYSIS_CHARACTERS} meaningful characters.`
        );
      }

      if (PLACEHOLDER_PATTERN.test(analysisText) || PLACEHOLDER_PATTERN.test(prediction.picks.main)) {
        errors.push(`${label}: published content contains placeholder text.`);
      }

      const bodyKey = analysisText.toLowerCase();
      const duplicateBody = seenPublishedBodies.get(bodyKey);
      if (duplicateBody) {
        errors.push(`${label}: editorial body duplicates ${duplicateBody}.`);
      } else if (bodyKey) {
        seenPublishedBodies.set(bodyKey, label);
      }
    }

    if (
      prediction.picks.odds !== undefined &&
      (!Number.isFinite(prediction.picks.odds) ||
        prediction.picks.odds <= 1)
    ) {
      errors.push(`${label}: odds must be a finite number greater than 1.`);
    }

    for (const [field, value] of [
      ["publishedAt", prediction.publishedAt],
      ["updatedAt", prediction.updatedAt],
    ] as const) {
      if (value !== undefined && !isValidIsoTimestamp(value)) {
        errors.push(`${label}: ${field} must be a valid ISO 8601 timestamp.`);
      }
    }

    if (
      prediction.publishedAt &&
      prediction.updatedAt &&
      Date.parse(prediction.updatedAt) < Date.parse(prediction.publishedAt)
    ) {
      errors.push(`${label}: updatedAt cannot be earlier than publishedAt.`);
    }

    const date = prediction.matchInfo?.date;
    if (date !== undefined) {
      const parsedDate = new Date(`${date}T00:00:00Z`);
      if (
        !ISO_DATE_PATTERN.test(date) ||
        Number.isNaN(parsedDate.valueOf()) ||
        parsedDate.toISOString().slice(0, 10) !== date
      ) {
        errors.push(`${label}: matchInfo.date must be a valid YYYY-MM-DD date.`);
      }
    }

    const time = prediction.matchInfo?.time;
    if (time !== undefined && !KICKOFF_PATTERN.test(time)) {
      errors.push(`${label}: matchInfo.time must use 24-hour HH:mm format.`);
    }

    if (prediction.matchInfo?.round !== undefined && !prediction.matchInfo.round.trim()) {
      errors.push(`${label}: matchInfo.round cannot be empty when supplied.`);
    }

    const slug = prediction.slug ?? predictionSlug(
      prediction.homeTeam,
      prediction.awayTeam
    );

    if (!SLUG_PATTERN.test(slug)) {
      errors.push(`${label}: slug must contain lowercase letters, numbers and single hyphens only.`);
    }

    if (seenSlugs.has(slug)) {
      errors.push(`${label}: duplicated canonical slug (${slug}).`);
    }

    seenSlugs.add(slug);

    if (isPublished && date) {
      const teams = [prediction.homeTeam, prediction.awayTeam]
        .map((team) => slugifyMatchPart(team))
        .join("-vs-");
      const identity = `${prediction.league}:${teams}:${date}`;
      if (seenIdentities.has(identity)) {
        errors.push(`${label}: duplicated teams and canonical date (${identity}).`);
      }
      seenIdentities.add(identity);
    }
  });

  return errors;
}
