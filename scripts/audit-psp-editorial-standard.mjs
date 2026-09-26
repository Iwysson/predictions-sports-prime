import { editorialPredictions } from "../src/data/predictions/index.ts";
import {
  classifyPspEditorialLifecycle,
  isPspEditorialStandard,
  validatePspEditorialStandard,
} from "../src/lib/editorial-standard.ts";

const errors = [];
const future = editorialPredictions.filter((prediction) =>
  prediction.published === true && classifyPspEditorialLifecycle(prediction) === "future-pre-match"
);

for (const prediction of future) {
  const label = `${prediction.league}/${prediction.slug}`;
  if (isPspEditorialStandard(prediction.editorialStandard)) {
    for (const error of validatePspEditorialStandard(prediction)) errors.push(`${label}: ${error}`);
  }
}

console.log("PSP Editorial Standard Audit");
console.log(`Future published predictions checked: ${future.length}`);
console.log(`PSP v1 predictions checked: ${future.filter((prediction) => isPspEditorialStandard(prediction.editorialStandard)).length}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log("PSP editorial standard audit: PASS");
}
