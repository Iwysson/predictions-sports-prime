import type { EditorialPrediction } from "@/types";
import { classifyPspEditorialLifecycle } from "@/lib/editorial-standard";

const WAVE_08_SLUGS = new Set([
  "real-betis-vs-real-madrid", "valencia-vs-barcelona", "deportivo-alaves-vs-osasuna", "malaga-vs-levante", "espanyol-vs-sevilla", "getafe-vs-celta-vigo", "elche-vs-real-sociedad",
  "fiorentina-vs-torino", "inter-vs-napoli", "genoa-vs-como", "roma-vs-atalanta", "parma-vs-monza", "frosinone-vs-venezia", "juventus-vs-ac-milan", "cagliari-vs-lecce", "udinese-vs-lazio",
  "sporting-cp-vs-nacional", "vitoria-sc-vs-casa-pia", "gil-vicente-vs-academico-viseu", "estoril-vs-arouca",
  "blackburn-rovers-vs-sheffield-united", "bolton-wanderers-vs-west-ham-united", "cardiff-city-vs-stoke-city", "charlton-athletic-vs-queens-park-rangers", "derby-county-vs-west-bromwich-albion", "norwich-city-vs-birmingham-city", "southampton-vs-swansea-city", "watford-vs-preston-north-end", "wrexham-vs-burnley",
  "istanbul-basaksehir-vs-galatasaray", "erzurumspor-fk-vs-konyaspor", "fenerbahce-vs-besiktas", "kasimpasa-vs-amed-sk", "corum-fk-vs-eyupspor", "kocaelispor-vs-samsunspor", "trabzonspor-vs-genclerbirligi", "goztepe-vs-gaziantep-fk", "caykur-rizespor-vs-alanyaspor",
  "aek-athens-vs-lask", "club-brugge-vs-aston-villa", "borussia-dortmund-vs-villarreal", "porto-vs-manchester-city", "lille-vs-real-betis", "real-madrid-vs-inter",
  "serbia-vs-greece", "netherlands-vs-germany", "portugal-vs-wales", "norway-vs-denmark", "turkiye-vs-france", "italy-vs-belgium", "czechia-vs-croatia", "england-vs-spain",
  "serbia-vs-netherlands", "norway-vs-portugal", "germany-vs-greece", "denmark-vs-wales",
]);

const NATIONS_LEAGUE_OPENING_CONTEXT: Record<string, string> = {
  "serbia-vs-greece": "Serbia and Greece enter Matchday 1 without a 2026/27 HOME/AWAY competition sample. Their squad availability, central-midfield roles and the duel between Serbia's forwards and Greece's defensive line are therefore more relevant than unrelated club numbers.",
  "netherlands-vs-germany": "Netherlands and Germany start the new edition before any current Nations League venue split exists. The useful pre-match evidence is the announced personnel, Germany's first-window squad allocation and how the Dutch wide threats can attack the visitors' changed defensive unit.",
  "portugal-vs-wales": "Portugal and Wales have no 2026/27 Nations League HOME/AWAY record before this opener. The assessment instead rests on the available squads, Portugal's control through midfield and Wales' capacity to defend compactly before breaking into the channels.",
  "norway-vs-denmark": "Norway and Denmark reach the opening round with no current-edition venue sample. The matchup is better judged through Norway's direct attacking references, Denmark's midfield balance and the space each side may leave when their full-backs advance.",
  "turkiye-vs-france": "Türkiye and France begin Group A1 before the competition can provide a current HOME/AWAY sample. Squad changes, the hosts' intensity between the lines and France's options against an aggressive press form the credible pre-match base.",
  "italy-vs-belgium": "Italy and Belgium open their Nations League schedule without a current-season venue record. The relevant questions concern the announced players, Italy's build-up under pressure and Belgium's ability to turn recoveries into attacks through their advanced creators.",
  "czechia-vs-croatia": "Czechia and Croatia arrive at Matchday 1 with no 2026/27 competition split to compare. Current squad roles, Czechia's set-piece threat and Croatia's capacity to control the centre carry more weight than figures imported from other tournaments.",
  "england-vs-spain": "England and Spain meet before either has produced a current Nations League HOME/AWAY sample. Wembley, the announced returns and Spain's established possession structure provide the matchup evidence without mixing in club statistics as if they belonged to this competition.",
  "serbia-vs-netherlands": "Serbia and the Netherlands reach their second fixture inside a compressed window, while the source was prepared before Matchday 1 created any current-edition venue data. Recovery, rotation and the direct duel between Serbia's centre-forwards and the Dutch back line shape this matchup.",
  "norway-vs-portugal": "Norway and Portugal play again three days after their openers, so the pre-Matchday 1 source cannot supply a valid 2026/27 HOME/AWAY split. The analysis instead centres on recovery, midfield protection and the contrast between Norway's vertical attack and Portugal's circulation.",
  "germany-vs-greece": "Germany and Greece enter this second-round fixture before a current competition venue sample was available at publication. Germany's assigned first-window squad, Greece's compact structure and the minutes accumulated on Matchday 1 are the decisive pre-kickoff references.",
  "denmark-vs-wales": "Denmark and Wales meet in Matchday 2 after only a three-day recovery period, and no current-edition HOME/AWAY sample existed at the time of writing. Rotation, Denmark's central combinations and Wales' transition outlets define the more useful comparison.",
};

const NATIONS_LEAGUE_CORE_CONTEXT: Record<string, string> = {
  "serbia-vs-greece": "Current-edition venue metrics for Serbia-Greece remain unavailable before the opening whistle. Friendlies, World Cup matches and older Nations League editions stay outside this Core so that the table does not present mixed competitions as a 2026/27 sample.",
  "netherlands-vs-germany": "No Netherlands HOME or Germany AWAY record exists yet in this edition. The Core therefore records the genuine absence of current competition data instead of substituting results gathered under different tournament conditions.",
  "portugal-vs-wales": "Portugal's current HOME split and Wales' current AWAY split begin with this match. Older meetings remain useful H2H context, but they are not inserted into the Core as if they described the 2026/27 group.",
  "norway-vs-denmark": "The Norway HOME and Denmark AWAY columns have no current-edition matches before kickoff. Keeping other competitions outside the Core preserves the distinction between squad/form context and Nations League statistical evidence.",
  "turkiye-vs-france": "Türkiye and France have not yet generated a 2026/27 venue sample. The Core remains limited rather than borrowing goal, corner or xG figures from friendlies and presenting them under the Nations League label.",
  "italy-vs-belgium": "Italy's HOME column and Belgium's AWAY column start empty in the new edition. Prior tournaments inform the narrative only; they do not become surrogate current-season rows in the Core.",
  "czechia-vs-croatia": "Czechia-Croatia is the first source match for both current competition venue splits. Until it is played, goals, corners and chance-quality metrics from other events remain outside the Core.",
  "england-vs-spain": "Wembley supplies England's first HOME observation and Spain's first AWAY observation of the edition. The Core therefore shows unavailable current data and leaves older H2H evidence in its own section.",
  "serbia-vs-netherlands": "The source predates Matchday 1, so Serbia HOME and Netherlands AWAY metrics for this edition were not yet available. Those first-round results require a later factual refresh rather than a pre-emptive estimate.",
  "norway-vs-portugal": "Norway's HOME and Portugal's AWAY numbers cannot be established until the opening fixtures are complete. The Core does not convert older international matches into a false current-edition split.",
  "germany-vs-greece": "Germany HOME and Greece AWAY data from the 2026/27 competition did not exist at the time of writing. Matchday 1 can supply the first relevant observations, but no value is filled in before that evidence exists.",
  "denmark-vs-wales": "Denmark's HOME record and Wales' AWAY record begin during this condensed window. The table remains honest about that timing instead of blending World Cup, friendly or previous-edition figures.",
};

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
  const predictionSlug = prediction.slug;

  const analysis = prediction.analysis.map((section) =>
    section
      .replace(/\r\n/g, "\n")
      .split(/\n\s*\n/)
      .flatMap((paragraph) => {
        const normalized = normalize(paragraph);
        if ((normalized.startsWith("the 2026 27 nations league has not started at the editorial cutoff") || normalized.startsWith("the 2026 27 nations league has not started at the time of writing"))) {
          return NATIONS_LEAGUE_OPENING_CONTEXT[predictionSlug] ?? paragraph;
        }
        if (normalized.startsWith("the core is intentionally limited to the current competition and current edition")) {
          const context = NATIONS_LEAGUE_CORE_CONTEXT[predictionSlug] ?? paragraph;
          return `${context} Shots, shots on target (SOT) and possession are also unavailable for that current-edition venue split.`;
        }
        return LOW_VALUE_PARAGRAPH_PREFIXES.some((prefix) =>
          normalized.startsWith(prefix),
        ) ? [] : [paragraph];
      })
      .join("\n\n")
      .replace(/^### (?:Risks and Counter-Signals|Conflict Detector)\s*$/gim, ""),
  );

  if (NATIONS_LEAGUE_OPENING_CONTEXT[predictionSlug]) {
    analysis[0] = analysis[0]
      .replace(
        /^### Head-to-Head$/m,
        `No verified suspension list for ${prediction.homeTeam} or ${prediction.awayTeam} was available at the time of writing, so no additional absence is assumed.\n\n### Head-to-Head`,
      );
  }

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
