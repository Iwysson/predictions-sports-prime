import { editorialPredictions } from "@/data/predictions";
import { buildPublishedMatches, predictionSlug, toMatchPreview } from "@/lib/editorial";
import { resolveAccess } from "@/lib/vip";
import type { MatchPreview } from "@/types";

/**
 * Published predictions with their ORIGINAL pick and published odds, for
 * server-side settlement only. Public listings hide the pick of VIP content;
 * settlement must still grade it. Output is exposed only through the central
 * results dataset, and only once the fixture is officially final.
 */
export function settlementPreviews(): MatchPreview[] {
  const published = editorialPredictions.filter((prediction) => prediction.published === true);
  const previews = buildPublishedMatches(
    published.map((prediction) => ({
      ...prediction,
      access: "free" as const,
      analysisAccess: "free" as const,
      predictionAccess: "free" as const,
    }))
  ).map(toMatchPreview);
  // Restore the real access tier so the results dataset can mask protected picks.
  const accessBySlug = new Map(published.map((prediction) => [`${prediction.league}:${prediction.slug ?? predictionSlug(prediction.homeTeam, prediction.awayTeam)}`, resolveAccess(prediction)]));
  return previews.map((preview) => {
    const access = accessBySlug.get(`${preview.league}:${preview.slug}`);
    return access ? { ...preview, analysisAccess: access.analysis, predictionAccess: access.prediction } : preview;
  });
}
