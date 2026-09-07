import type { EditorialPrediction } from "@/types";
import { classifyPspEditorialLifecycle } from "@/lib/editorial-standard";

const WAVE_08_SLUGS = new Set([
  "real-betis-vs-real-madrid", "valencia-vs-barcelona", "deportivo-alaves-vs-osasuna", "malaga-vs-levante", "espanyol-vs-sevilla", "getafe-vs-celta-vigo", "elche-vs-real-sociedad",
  "fiorentina-vs-torino", "inter-vs-napoli", "genoa-vs-como", "roma-vs-atalanta", "parma-vs-monza", "frosinone-vs-venezia", "juventus-vs-ac-milan", "cagliari-vs-lecce", "udinese-vs-lazio",
  "sporting-cp-vs-nacional", "vitoria-sc-vs-casa-pia", "gil-vicente-vs-academico-viseu", "estoril-vs-arouca",
  "blackburn-rovers-vs-sheffield-united", "bolton-wanderers-vs-west-ham-united", "cardiff-city-vs-stoke-city", "charlton-athletic-vs-queens-park-rangers", "derby-county-vs-west-bromwich-albion", "norwich-city-vs-birmingham-city", "southampton-vs-swansea-city", "watford-vs-preston-north-end", "wrexham-vs-burnley",
  "istanbul-basaksehir-vs-galatasaray", "erzurumspor-fk-vs-konyaspor", "fenerbahce-vs-besiktas", "kasimpasa-vs-amed-sk", "corum-fk-vs-eyupspor", "kocaelispor-vs-samsunspor", "trabzonspor-vs-genclerbirligi", "goztepe-vs-gaziantep-fk", "caykur-rizespor-vs-alanyaspor",
  "aek-athens-vs-lask", "club-brugge-vs-aston-villa", "borussia-dortmund-vs-villarreal", "porto-vs-manchester-city", "lille-vs-real-betis", "real-madrid-vs-inter",
]);

// These prefixes identify the long, exact boilerplate groups classified P1-A/B/C/D/E/F
// in Wave 0.8. Factual source, lineup and probability statements (P1-G/H) are retained.
const LOW_VALUE_PARAGRAPH_PREFIXES = [
  "signals supporting the main scenario the venue specific process",
  "assessment the evidence is directionally useful but not unanimous",
  "most current season home away samples contain only one league match",
  "the core is descriptive evidence not a probability model",
  "the evidence is mixed rather than unanimous",
  "the main case comes from the venue specific process above",
  "the main limitation is sample size the relevant home away windows contain 2 and 2 matches",
  "btts stands at 100 for the home sample and 50 for the away sample",
  "the first restraint is sample size the main home away comparison contains only",
  "the primary home away rows remain restricted to championship",
  "btts stands at 50 for the home sample and 100 for the away sample",
  "btts stands at 100 for the home sample and 100 for the away sample",
  "the market price is attractive only if the full pre match picture supports",
  "signals supporting the main scenario the venue specific chance and territorial profile",
  "that distinction matters because the two teams operate in different domestic environments",
  "the current domestic sample is still small",
  "the most useful feature of this table is not any isolated percentage",
  "domestic league position is included because it places the opening weeks in context",
  "a level score deep into the second half is the clearest route",
  "the first risk is sample size none of these domestic campaigns",
  "the third risk is lineup uncertainty",
  "there are also ordinary match risks that statistics cannot remove",
  "this conversion is a market price reference only",
  "a selection can still lose even when the underlying profile is coherent",
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/^#{1,6}\s+/, "")
    .replace(/[*_`:[\]()/.,;=+%-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function applyWave08EditorialDebtRemediation(
  prediction: EditorialPrediction,
): EditorialPrediction {
  if (
    !prediction.slug ||
    !WAVE_08_SLUGS.has(prediction.slug) ||
    classifyPspEditorialLifecycle(prediction) !== "future-pre-match"
  ) return prediction;

  const analysis = prediction.analysis.map((section) =>
    section
      .replace(/\r\n/g, "\n")
      .split(/\n\s*\n/)
      .filter((paragraph) => {
        const normalized = normalize(paragraph);
        return !LOW_VALUE_PARAGRAPH_PREFIXES.some((prefix) =>
          normalized.startsWith(prefix),
        );
      })
      .join("\n\n"),
  );

  if (prediction.slug === "getafe-vs-celta-vigo") {
    analysis[0] = analysis[0].replace(
      "Getafe still created 1.22 home xG and eight corners",
      "Getafe still created **1.22 home xG** and eight corners",
    );
  }

  if (new Set([
    "aek-athens-vs-lask",
    "club-brugge-vs-aston-villa",
    "borussia-dortmund-vs-villarreal",
    "lille-vs-real-betis",
  ]).has(prediction.slug)) {
    analysis[0] = analysis[0].replace(
      "**Availability:**",
      "**Availability / suspensions / eligibility:**",
    );
  }

  return {
    ...prediction,
    analysis,
  };
}
