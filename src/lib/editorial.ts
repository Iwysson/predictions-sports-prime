import {
  EditorialPrediction,
  Match,
  PredictionItem,
} from "@/types";

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
  const slug = predictionSlug(
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
    predictions: picksToItems(prediction),
  };
}

export function buildPublishedMatches(
  predictions: EditorialPrediction[]
) {
  return predictions
    .filter((prediction) => prediction.published !== false)
    .map(editorialToMatch);
}

export function validateEditorialPredictions(
  predictions: EditorialPrediction[]
) {
  const errors: string[] = [];
  const seen = new Set<string>();

  predictions.forEach((prediction, index) => {
    const label = `Prediction ${index + 1}`;
    const isDraft = prediction.published === false;

    if (!prediction.league) {
      errors.push(`${label}: league is required.`);
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
    }

    if (
      prediction.picks.odds !== undefined &&
      (!Number.isFinite(prediction.picks.odds) ||
        prediction.picks.odds <= 1)
    ) {
      errors.push(`${label}: odds must be a finite number greater than 1.`);
    }

    const slug = predictionSlug(
      prediction.homeTeam,
      prediction.awayTeam
    );

    if (seen.has(slug)) {
      errors.push(`${label}: duplicated match (${slug}).`);
    }

    seen.add(slug);
  });

  return errors;
}
