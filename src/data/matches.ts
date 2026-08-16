import { editorialPredictions } from "@/data/predictions";
import {
  buildPublishedMatches,
  validateEditorialPredictions,
} from "@/lib/editorial";

const editorialErrors =
  validateEditorialPredictions(editorialPredictions);

if (editorialErrors.length > 0) {
  console.error(
    "Predictions Sports Prime — editorial validation errors:",
    editorialErrors
  );
}

// Compatibilidade com o restante do site.
// NÃO edite este arquivo para publicar predictions.
// Edite somente: src/data/predictions.ts
export const matches = buildPublishedMatches(
  editorialPredictions
);
