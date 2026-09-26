import { isPspEditorialStandard } from "@/lib/editorial-standard";
import type { EditorialPrediction } from "@/types";
import { predictionSlug } from "@/lib/editorial";
import { isSeoFeatureEnabled } from "@/config/seo-enterprise";
import { evaluatePredictionIndexQuality, type IndexQualityDecision } from "@/lib/index-quality";

const predictionIndexCache = new WeakMap<
  readonly EditorialPrediction[],
  Map<string, EditorialPrediction>
>();

export type AdSenseContentClassification =
  | "KEEP"
  | "UPGRADE"
  | "LEGACY-NOINDEX"
  | "REMOVE";

export type AdSenseContentQualityDecision = {
  classification: AdSenseContentClassification;
  indexable: boolean;
  source: "audited-snapshot-2026-09-03" | "automatic-fallback" | "manual-publication-allowlist-2026-09-15" | "manual-publication-allowlist-2026-09-18" | "manual-publication-allowlist-2026-09-22";
  reasons: string[];
};

// Manual publication exception approved for the 97-page upcoming upgrade on 2026-09-15.
// This list is intentionally explicit: it does not weaken the quality gate for any other page.
const MANUAL_PUBLICATION_ALLOWLIST_2026_09_15 = new Set<string>([
  // premier-league
  "bournemouth-vs-liverpool",
  "brentford-vs-chelsea",
  "brighton-vs-arsenal",
  "everton-vs-ipswich-town",
  "fulham-vs-manchester-united",
  "leeds-united-vs-crystal-palace",
  "manchester-city-vs-sunderland",
  "newcastle-united-vs-hull-city",
  "nottingham-forest-vs-coventry-city",
  "tottenham-hotspur-vs-aston-villa",
  // bundesliga
  "bayer-leverkusen-vs-rb-leipzig",
  "bayern-munich-vs-union-berlin",
  "borussia-monchengladbach-vs-mainz-05",
  "eintracht-frankfurt-vs-sc-freiburg",
  "hamburger-sv-vs-fc-koln",
  "sc-paderborn-07-vs-tsg-hoffenheim",
  "schalke-04-vs-sv-elversberg",
  "vfb-stuttgart-vs-borussia-dortmund",
  "werder-bremen-vs-augsburg",
  // serie-a
  "ac-milan-lecce",
  "bologna-torino",
  "fiorentina-napoli",
  "frosinone-como",
  "juventus-atalanta",
  "monza-sassuolo",
  "parma-genoa",
  "roma-inter",
  "udinese-cagliari",
  "venezia-lazio",
  // liga-portugal
  "alverca-vs-rio-ave",
  "estoril-vs-casa-pia",
  "estrela-amadora-vs-academico-viseu",
  "fc-porto-vs-benfica",
  "gil-vicente-vs-maritimo",
  "nacional-vs-famalicao",
  "santa-clara-vs-braga",
  "sporting-cp-vs-arouca",
  "vitoria-sc-vs-moreirense",
  // ligue-1
  "angers-vs-troyes",
  "auxerre-vs-brest",
  "le-mans-vs-lorient",
  "lyon-vs-rennes",
  "marseille-vs-psg",
  "monaco-vs-lens",
  "nice-vs-lille",
  "paris-fc-vs-strasbourg",
  "toulouse-vs-le-havre",
  // eredivisie
  "ado-den-haag-vs-sc-cambuur",
  "ajax-vs-excelsior-rotterdam",
  "az-vs-telstar",
  "fc-groningen-vs-pec-zwolle",
  "fc-twente-vs-psv",
  "feyenoord-vs-fc-utrecht",
  "nec-nijmegen-vs-go-ahead-eagles",
  "sparta-rotterdam-vs-sc-heerenveen",
  "willem-ii-vs-fortuna-sittard",
  // super-lig
  "basaksehir-vs-genclerbirligi",
  "corum-vs-alanyaspor",
  "erzurumspor-vs-samsunspor",
  "fenerbahce-vs-eyupspor",
  "goztepe-vs-rizespor",
  "kasimpasa-vs-konyaspor",
  "kocaelispor-vs-gaziantep",
  "trabzonspor-vs-galatasaray",
  // eliteserien
  "brann-bod-glimt",
  "kristiansund-rosenborg",
  "molde-aalesund",
  "sandefjord-start",
  "sarpsborg-08-kfum-oslo",
  "troms-hamkam",
  "v-lerenga-fredrikstad",
  "viking-lillestr-m",
  // mls
  "cf-montreal-columbus-crew",
  "colorado-rapids-seattle-sounders-fc",
  "dc-united-charlotte-fc",
  "fc-dallas-austin-fc",
  "houston-dynamo-fc-fc-cincinnati",
  "inter-miami-cf-san-diego-fc",
  "minnesota-united-fc-la-galaxy",
  "nashville-sc-chicago-fire-fc",
  "new-england-revolution-orlando-city-sc",
  "new-york-city-fc-new-york-red-bulls",
  "portland-timbers-atlanta-united-fc",
  "san-jose-earthquakes-los-angeles-fc",
  "sporting-kansas-city-philadelphia-union",
  "st-louis-city-sc-toronto-fc",
  // brasileirao-serie-a
  "athletico-paranaense-bahia",
  "atletico-mineiro-chapecoense",
  "botafogo-gremio",
  "corinthians-fluminense",
  "flamengo-red-bull-bragantino",
  "gremio-palmeiras",
  "mirassol-botafogo",
  "remo-santos",
  "sao-paulo-internacional",
  "vasco-da-gama-coritiba",
  "vitoria-cruzeiro",
]);

// Manual publication exception approved for the LaLiga Matchday 7 + UEFA
// Nations League 2026/27 launch (21 pages) on 2026-09-18.
// This list is intentionally explicit: it does not weaken the quality gate for any other page.
const MANUAL_PUBLICATION_ALLOWLIST_2026_09_18 = new Set<string>([
  // la-liga (round-07)
  "athletic-club-vs-deportivo-alaves",
  "atletico-madrid-vs-real-madrid",
  "celta-vigo-vs-racing-santander",
  "getafe-vs-malaga",
  "osasuna-vs-rayo-vallecano",
  "rc-deportivo-vs-real-betis",
  "sevilla-vs-barcelona",
  "valencia-vs-real-sociedad",
  "villarreal-vs-levante",
  // uefa-nations-league (matchday-01 + matchday-02)
  "serbia-vs-greece",
  "netherlands-vs-germany",
  "portugal-vs-wales",
  "norway-vs-denmark",
  "turkiye-vs-france",
  "italy-vs-belgium",
  "czechia-vs-croatia",
  "england-vs-spain",
  "serbia-vs-netherlands",
  "norway-vs-portugal",
  "germany-vs-greece",
  "denmark-vs-wales",
]);

// Explicit publication authorization for the 31-page international wave.
// Partial data coverage remains disclosed in-page and is not a publication blocker.
const MANUAL_PUBLICATION_ALLOWLIST_2026_09_22 = new Set<string>([
  // UEFA Nations League B (11)
  "kosovo-vs-republic-of-ireland",
  "austria-vs-israel",
  "georgia-vs-northern-ireland",
  "hungary-vs-ukraine",
  "poland-vs-bosnia-herzegovina",
  "sweden-vs-romania",
  "slovenia-vs-scotland",
  "north-macedonia-vs-switzerland",
  "austria-vs-kosovo",
  "israel-vs-republic-of-ireland",
  "georgia-vs-ukraine",
  // International Friendlies (7)
  "azerbaijan-vs-tajikistan",
  "japan-vs-uruguay",
  "australia-vs-brazil",
  "south-korea-vs-ecuador",
  "canada-vs-chile",
  "mexico-vs-colombia",
  "usa-vs-peru",
  // Gulf Cup (1)
  "iraq-vs-oman",
  // UEFA Nations League C (8)
  "armenia-vs-latvia",
  "montenegro-vs-cyprus",
  "bulgaria-vs-luxembourg",
  "faroe-islands-vs-kazakhstan",
  "san-marino-vs-finland",
  "albania-vs-belarus",
  "iceland-vs-estonia",
  "slovakia-vs-moldova",
  // UEFA Nations League D (4)
  "andorra-vs-malta",
  "liechtenstein-vs-lithuania",
  "lithuania-vs-azerbaijan",
  "gibraltar-vs-andorra",
]);

function manualPublicationAllowlistMatch(
  prediction: EditorialPrediction
): "2026-09-15" | "2026-09-18" | "2026-09-22" | null {
  if (prediction.published !== true) return null;
  const slug =
    prediction.slug ?? predictionSlug(prediction.homeTeam, prediction.awayTeam);
  if (MANUAL_PUBLICATION_ALLOWLIST_2026_09_15.has(slug)) return "2026-09-15";
  if (MANUAL_PUBLICATION_ALLOWLIST_2026_09_18.has(slug)) return "2026-09-18";
  if (MANUAL_PUBLICATION_ALLOWLIST_2026_09_22.has(slug)) return "2026-09-22";
  return null;
}

const AUDITED_KEEP = new Set<string>([
  "aalesund-vs-start",
  "angers-vs-rennes",
  "arsenal-vs-chelsea",
  "aston-villa-vs-arsenal",
  "atalanta-bc-vs-bologna-fc-1909",
  "athletic-club-vs-atletico-madrid",
  "barcelona-vs-rayo-vallecano",
  "bayer-04-leverkusen-vs-1-fc-union-berlin",
  "borussia-monchengladbach-vs-sv-07-elversberg",
  "botafogo-vs-palmeiras",
  "brann-vs-lillestrom",
  "brentford-vs-sunderland",
  "brighton-hove-albion-vs-leeds-united",
  "burnley-vs-middlesbrough",
  "cagliari-vs-lecce",
  "caykur-rizespor-vs-alanyaspor",
  "celtic-vs-aberdeen",
  "corinthians-vs-chapecoense",
  "coritiba-vs-mirassol",
  "corum-fk-vs-eyupspor",
  "cruzeiro-vs-athletico-pr",
  "deportivo-alaves-vs-osasuna",
  "dundee-vs-st-johnstone",
  "eintracht-frankfurt-vs-augsburg",
  "elche-vs-real-sociedad",
  "erzurumspor-fk-vs-konyaspor",
  "espanyol-vs-sevilla",
  "estoril-vs-arouca",
  "estrela-da-amadora-vs-famalicao",
  "everton-vs-manchester-united",
  "falkirk-vs-rangers",
  "fc-porto-vs-moreirense",
  "fenerbahce-vs-besiktas",
  "fiorentina-vs-torino",
  "flamengo-vs-mirassol",
  "fluminense-vs-vasco-da-gama",
  "fredrikstad-vs-bodo-glimt",
  "frosinone-vs-venezia",
  "fulham-vs-crystal-palace",
  "genoa-vs-como",
  "getafe-vs-celta-vigo",
  "gil-vicente-vs-academico-viseu",
  "goztepe-vs-gaziantep-fk",
  "gremio-vs-internacional",
  "hamburger-sv-vs-1-fsv-mainz-05",
  "hibernian-vs-hearts",
  "hull-city-vs-aston-villa",
  "inter-vs-napoli",
  "internacional-vs-santos",
  "ipswich-town-vs-liverpool",
  "istanbul-basaksehir-vs-galatasaray",
  "juventus-vs-ac-milan",
  "kasimpasa-vs-amed-sk",
  "kilmarnock-vs-st-mirren",
  "kocaelispor-vs-samsunspor",
  "kristiansund-vs-tromso",
  "le-havre-vs-brest",
  "lens-vs-lorient",
  "lyon-vs-auxerre",
  "malaga-vs-levante",
  "manchester-city-vs-coventry-city",
  "maritimo-vs-benfica",
  "millwall-vs-wrexham",
  "molde-vs-kfum-oslo",
  "motherwell-vs-dundee-united",
  "newcastle-united-vs-bournemouth",
  "nice-vs-le-mans",
  "nottingham-forest-vs-tottenham-hotspur",
  "olympique-de-marseille-vs-paris-fc",
  "osasuna-vs-getafe",
  "paris-saint-germain-vs-as-monaco",
  "parma-vs-monza",
  "queens-park-rangers-vs-cardiff-city",
  "rayo-vallecano-vs-racing-santander",
  "real-betis-vs-real-madrid",
  "red-bull-bragantino-vs-bahia",
  "remo-vs-flamengo",
  "roma-vs-atalanta",
  "rosenborg-vs-hamkam",
  "sandefjord-vs-viking",
  "santa-clara-vs-rio-ave",
  "santos-vs-palmeiras",
  "sao-paulo-vs-atletico-mg",
  "sarpsborg-08-vs-valerenga",
  "sc-paderborn-07-vs-sc-freiburg",
  "schalke-04-vs-bayern-munchen",
  "sporting-cp-vs-nacional",
  "sv-werder-bremen-vs-rb-leipzig",
  "telstar-vs-sc-cambuur",
  "ado-den-haag-vs-fortuna-sittard",
  "ajax-vs-psv-eindhoven",
  "fc-groningen-vs-fc-twente",
  "fc-utrecht-vs-go-ahead-eagles",
  "nec-nijmegen-vs-feyenoord",
  "sc-heerenveen-vs-az-alkmaar",
  "sparta-rotterdam-vs-pec-zwolle",
  "willem-ii-vs-excelsior",
  "toulouse-vs-lille",
  "trabzonspor-vs-genclerbirligi",
  "troyes-vs-strasbourg",
  "tsg-1899-hoffenheim-vs-borussia-dortmund",
  "udinese-vs-lazio",
  "us-lecce-vs-as-roma",
  "valencia-vs-barcelona",
  "vfb-stuttgart-vs-1-fc-koln",
  "villarreal-vs-deportivo-la-coruna",
  "vitoria-sc-vs-casa-pia",
  "vitoria-vs-gremio",
  "vitoria-vs-vasco-da-gama",
  "west-bromwich-albion-vs-charlton-athletic",
]);

const AUDITED_UPGRADE = new Set<string>([
  "amedspor-vs-trabzonspor",
  "angers-vs-lille",
  "benfica-vs-estoril",
  "besiktas-vs-corum-fk",
  "braga-vs-vitoria-de-guimaraes",
  "cambuur-vs-feyenoord",
  "estoril-praia-vs-rio-ave",
  "estrela-da-amadora-vs-braga",
  "fc-porto-vs-arouca",
  "fortuna-sittard-vs-az",
  "gil-vicente-vs-casa-pia",
  "go-ahead-eagles-vs-ado-den-haag",
  "heerenveen-vs-pec-zwolle",
  "le-havre-vs-monaco",
  "le-mans-vs-stade-brestois",
  "lens-vs-auxerre",
  "maritimo-vs-academico-de-viseu",
  "moreirense-vs-benfica",
  "nice-vs-lorient",
  "paris-saint-germain-vs-rennes",
  "psv-vs-groningen",
  "real-sociedad-vs-celta-vigo",
  "remo-vs-coritiba",
  "santa-clara-vs-famalicao",
  "sparta-rotterdam-vs-utrecht",
  "sporting-cp-vs-fc-alverca",
  "toulouse-vs-lyon",
  "troyes-vs-paris-fc",
  "vitoria-guimaraes-vs-nacional",
]);

const AUDITED_LEGACY_NOINDEX = new Set<string>([
  "aberdeen-vs-rangers",
  "ac-milan-vs-venezia",
  "ac-monza-vs-udinese-calcio",
  "academico-de-viseu-vs-porto",
  "acf-fiorentina-vs-frosinone-calcio",
  "alaves-vs-villarreal",
  "alverca-vs-santa-clara",
  "arouca-vs-maritimo",
  "arsenal-vs-coventry",
  "atalanta-vs-sassuolo",
  "athletic-club-vs-sevilla",
  "athletico-pr-vs-fluminense",
  "atletico-madrid-vs-malaga",
  "atletico-madrid-vs-villarreal",
  "atletico-mineiro-vs-cruzeiro",
  "atletico-mineiro-vs-vitoria",
  "augsburg-vs-schalke",
  "auxerre-vs-angers",
  "az-alkmaar-vs-go-ahead-eagles",
  "bahia-vs-internacional",
  "barcelona-vs-athletic-club",
  "bayern-munich-vs-stuttgart",
  "birmingham-city-vs-brentford",
  "birmingham-city-vs-southampton",
  "bologna-vs-lazio",
  "botafogo-vs-athletico-paranaense",
  "bournemouth-vs-everton",
  "brentford-vs-tottenham",
  "brest-vs-toulouse",
  "brighton-vs-aston-villa",
  "c-d-nacional-vs-estrela",
  "ca-osasuna-vs-levante-ud",
  "cagliari-calcio-vs-internazionale-milano",
  "cardiff-city-vs-norwich-city",
  "casa-pia-vs-benfica",
  "casa-pia-vs-moreirense",
  "celta-vigo-vs-athletic-club",
  "celta-vigo-vs-osasuna",
  "celtic-vs-falkirk",
  "chapecoense-vs-sao-paulo",
  "chelsea-vs-brighton-and-hove-albion",
  "chelsea-vs-luton-town",
  "corinthians-vs-santos",
  "coritiba-vs-corinthians",
  "coventry-city-vs-hull-city",
  "cruzeiro-vs-atletico-mineiro",
  "cruzeiro-vs-flamengo",
  "crystal-palace-vs-manchester-city",
  "deportivo-la-coruna-vs-elche",
  "deportivo-vs-valencia",
  "doncaster-rovers-vs-middlesbrough",
  "dortmund-vs-hamburg",
  "dundee-vs-hibernian",
  "elche-vs-barcelona",
  "elversberg-vs-leverkusen",
  "everton-vs-crystal-palace",
  "excelsior-vs-sparta-rotterdam",
  "eyupspor-vs-alanyaspor",
  "famalicao-vs-gil-vicente",
  "feyenoord-rotterdam-vs-ado-den-haag",
  "flamengo-vs-botafogo",
  "fluminense-vs-remo",
  "freiburg-vs-werder-bremen",
  "frosinone-vs-juventus",
  "fulham-vs-afc-wimbledon",
  "fulham-vs-chelsea",
  "galatasaray-vs-goztepe",
  "gaziantep-fk-vs-caykur-rizespor",
  "genclerbirligi-vs-erzurumspor",
  "genoa-vs-napoli",
  "getafe-vs-real-racing-club-de-santander",
  "gremio-vs-chapecoense",
  "groningen-vs-fortuna-sittard",
  "hearts-vs-st-johnstone",
  "hull-vs-man-united",
  "inter-vs-monza",
  "internacional-vs-atletico-mineiro",
  "internacional-vs-gremio",
  "ipswich-town-vs-leicester-city",
  "ipswich-vs-sunderland",
  "istanbul-basaksehir-vs-kas-mpasa",
  "juventus-vs-parma-calcio-1913",
  "kilmarnock-vs-dundee-united",
  "koln-vs-hoffenheim",
  "konyaspor-vs-kocaelispor",
  "leeds-united-vs-brentford",
  "leipzig-vs-monchengladbach",
  "levante-vs-real-betis",
  "lille-vs-paris-saint-germain",
  "lincoln-city-vs-blackburn-rovers",
  "liverpool-vs-nottingham-forest",
  "lorient-vs-troyes",
  "lyon-vs-le-havre",
  "mainz-vs-paderborn",
  "malaga-vs-rc-deportivo-la-coruna",
  "man-city-vs-bournemouth",
  "manchester-united-vs-ipswich-town",
  "mirassol-vs-palmeiras",
  "monaco-vs-marseille",
  "newcastle-united-vs-west-bromwich-albion",
  "newcastle-vs-liverpool",
  "nottingham-forest-vs-leeds",
  "nottingham-forest-vs-leeds-united-efl-cup",
  "olympique-de-marseille-vs-strasbourg",
  "palmeiras-vs-santos",
  "palmeiras-vs-vasco-da-gama",
  "paris-fc-vs-nice",
  "parma-vs-cagliari",
  "pec-zwolle-vs-nec-nijmegen",
  "portsmouth-vs-derby-county",
  "preston-north-end-vs-bristol-city",
  "racing-santander-vs-elche",
  "rayo-vallecano-vs-deportivo-alaves",
  "rcd-espanyol-de-barcelona-vs-real-madrid",
  "real-betis-vs-real-sociedad",
  "real-madrid-vs-malaga",
  "real-madrid-vs-real-sociedad",
  "real-sociedad-vs-espanyol",
  "red-bull-bragantino-vs-gremio",
  "rennes-vs-le-mans",
  "rio-ave-vs-sporting-cp",
  "roma-vs-fiorentina",
  "samsunspor-vs-fenerbahce",
  "santos-vs-mirassol",
  "sao-paulo-vs-red-bull-bragantino",
  "sevilla-vs-atletico-madrid",
  "sheffield-united-vs-bolton-wanderers",
  "sheffield-wednesday-vs-wolverhampton-wanderers",
  "southampton-vs-west-ham",
  "ss-lazio-vs-genoa-cfc",
  "ssc-napoli-vs-como-1907",
  "st-mirren-vs-motherwell",
  "stoke-city-vs-norwich-city",
  "strasbourg-vs-lens",
  "sunderland-vs-fulham",
  "swansea-city-vs-watford",
  "telstar-vs-ajax-amsterdam",
  "torino-vs-milan",
  "tottenham-hotspur-vs-charlton-athletic",
  "tottenham-hotspur-vs-newcastle-united",
  "udinese-vs-como",
  "union-berlin-vs-frankfurt",
  "us-sassuolo-calcio-vs-torino",
  "utrecht-vs-psv-eindhoven",
  "valencia-vs-rc-celta-de-vigo",
  "valencia-vs-real-betis",
  "vasco-da-gama-vs-cruzeiro",
  "vasco-da-gama-vs-vitoria",
  "venezia-vs-lecce",
  "vitoria-vs-bahia",
  "watford-vs-peterborough-united",
  "west-ham-united-vs-wolverhampton-wanderers",
  "willem-ii-vs-heerenveen",
]);

const AUDITED_REMOVE = new Set<string>([

]);

const AUDITED_SLUG_ALIASES = new Map<string, string>([
  ["arsenal-vs-coventry-city", "arsenal-vs-coventry"],
  ["hull-city-vs-manchester-united", "hull-vs-man-united"],
  ["ipswich-town-vs-sunderland", "ipswich-vs-sunderland"],
  ["nottingham-forest-vs-leeds-united", "nottingham-forest-vs-leeds"],
  ["brentford-vs-tottenham-hotspur", "brentford-vs-tottenham"],
  ["manchester-city-vs-bournemouth", "man-city-vs-bournemouth"],
  ["brighton-hove-albion-vs-aston-villa", "brighton-vs-aston-villa"],
  ["newcastle-united-vs-liverpool", "newcastle-vs-liverpool"],
  ["chelsea-vs-brighton-hove-albion", "chelsea-vs-brighton-and-hove-albion"],
  ["rc-deportivo-la-coruna-vs-elche", "deportivo-la-coruna-vs-elche"],
  ["osasuna-vs-levante", "ca-osasuna-vs-levante-ud"],
  ["malaga-vs-deportivo-la-coruna", "malaga-vs-rc-deportivo-la-coruna"],
  ["getafe-vs-racing-santander", "getafe-vs-real-racing-club-de-santander"],
  ["bayern-munchen-vs-vfb-stuttgart", "bayern-munich-vs-stuttgart"],
  ["rb-leipzig-vs-borussia-monchengladbach", "leipzig-vs-monchengladbach"],
  ["1-fsv-mainz-05-vs-sc-paderborn-07", "mainz-vs-paderborn"],
  ["1-fc-union-berlin-vs-eintracht-frankfurt", "union-berlin-vs-frankfurt"],
  ["sv-07-elversberg-vs-bayer-04-leverkusen", "elversberg-vs-leverkusen"],
  ["borussia-dortmund-vs-hamburger-sv", "dortmund-vs-hamburg"],
  ["augsburg-vs-schalke-04", "augsburg-vs-schalke"],
  ["1-fc-koln-vs-tsg-1899-hoffenheim", "koln-vs-hoffenheim"],
  ["sc-freiburg-vs-sv-werder-bremen", "freiburg-vs-werder-bremen"],
  ["udinese-calcio-vs-como-1907", "udinese-vs-como"],
  ["genoa-cfc-vs-ssc-napoli", "genoa-vs-napoli"],
  ["internazionale-milano-vs-ac-monza", "inter-vs-monza"],
  ["parma-calcio-1913-vs-cagliari-calcio", "parma-vs-cagliari"],
  ["estrela-da-amadora-vs-sc-braga", "estrela-da-amadora-vs-braga"],
  ["vitoria-de-guimaraes-vs-nacional", "vitoria-guimaraes-vs-nacional"],
  ["estoril-vs-rio-ave", "estoril-praia-vs-rio-ave"],
  ["maritimo-vs-academico-viseu", "maritimo-vs-academico-de-viseu"],
  ["le-mans-vs-brest", "le-mans-vs-stade-brestois"],
  ["monaco-vs-olympique-de-marseille", "monaco-vs-marseille"],
  ["fortuna-sittard-vs-az-alkmaar", "fortuna-sittard-vs-az"],
  ["sparta-rotterdam-vs-fc-utrecht", "sparta-rotterdam-vs-utrecht"],
  ["sc-heerenveen-vs-pec-zwolle", "heerenveen-vs-pec-zwolle"],
  ["psv-eindhoven-vs-fc-groningen", "psv-vs-groningen"],
  ["sc-cambuur-vs-feyenoord", "cambuur-vs-feyenoord"],
]);

const DATA_FIRST_METRIC_PATTERN =
  /\b(?:xg|xga|shots?|sot|corners?|possession|points?\/game|gf\/game|ga\/game|w-d-l)\b/i;

const TEAM_CONTEXT_PATTERN =
  /\b(?:probable lineups?|expected xi|team news|injur(?:y|ies)|suspend(?:ed|sion)|availability)\b/i;

function validHttpsSourceCount(prediction: EditorialPrediction) {
  return (prediction.sources ?? []).filter((source) => {
    try {
      return new URL(source.url).protocol === "https:";
    } catch {
      return false;
    }
  }).length;
}

function hasStructuredTeamContext(prediction: EditorialPrediction) {
  return Boolean(
    prediction.matchSeo?.lineups ||
      prediction.matchSeo?.availability ||
      prediction.matchSeo?.teamNews
  );
}

function fallbackDecision(
  prediction: EditorialPrediction
): AdSenseContentQualityDecision {
  if (!prediction.published) {
    return {
      classification: "REMOVE",
      indexable: false,
      source: "automatic-fallback",
      reasons: ["not_published"],
    };
  }

  const text = prediction.analysis.join("\n\n");
  const hasStatisticalCore =
    /Statistical Core Predictions-Sports-Prime/i.test(text);
  const hasConflictDetector = /(?:Conflict Detector|Risks and Counter-Signals)/i.test(text);
  const hasDataEvidence = DATA_FIRST_METRIC_PATTERN.test(text);
  const hasTeamContext =
    hasStructuredTeamContext(prediction) || TEAM_CONTEXT_PATTERN.test(text);
  const hasTraceableSource = validHttpsSourceCount(prediction) > 0;
  const sourceVerified = prediction.sourceStatus === "verified";
  const pspEditorialStandard = isPspEditorialStandard(prediction.editorialStandard);

  const missing = [
    !pspEditorialStandard ? "missing_psp_v1" : "",
    !sourceVerified ? "source_not_verified" : "",
    !hasTraceableSource ? "missing_traceable_source" : "",
    !hasStatisticalCore ? "missing_statistical_core" : "",
    !hasConflictDetector ? "missing_conflict_detector" : "",
    !hasDataEvidence ? "weak_data_evidence" : "",
    !hasTeamContext ? "missing_team_context" : "",
  ].filter(Boolean);

  if (missing.length === 0) {
    return {
      classification: "KEEP",
      indexable: true,
      source: "automatic-fallback",
      reasons: ["new_content_passed_psp_quality_gate"],
    };
  }

  const publishedAt = prediction.publishedAt
    ? Date.parse(prediction.publishedAt)
    : Number.NaN;
  const auditCutoff = Date.parse("2026-09-03T00:00:00Z");
  const historicalAtAudit =
    Number.isFinite(publishedAt) && publishedAt < auditCutoff;

  return {
    classification: historicalAtAudit ? "LEGACY-NOINDEX" : "UPGRADE",
    indexable: false,
    source: "automatic-fallback",
    reasons: missing,
  };
}

export function getAdSenseContentQualityDecision(
  prediction: EditorialPrediction
): AdSenseContentQualityDecision | IndexQualityDecision {
  const allowlistMatch = manualPublicationAllowlistMatch(prediction);
  if (allowlistMatch) {
    return {
      classification: "KEEP",
      indexable: true,
      source: `manual-publication-allowlist-${allowlistMatch}` as
        | "manual-publication-allowlist-2026-09-15"
        | "manual-publication-allowlist-2026-09-18"
        | "manual-publication-allowlist-2026-09-22",
      reasons: [`manual_publication_override_${allowlistMatch.replace(/-/g, "_")}`],
    };
  }

  const legacyDecision = getLegacyAdSenseContentQualityDecision(prediction);
  return isSeoFeatureEnabled("quality-gate-v2")
    ? evaluatePredictionIndexQuality(prediction, legacyDecision)
    : legacyDecision;
}

export function getLegacyAdSenseContentQualityDecision(
  prediction: EditorialPrediction
): AdSenseContentQualityDecision {
  const slug =
    prediction.slug ??
    predictionSlug(prediction.homeTeam, prediction.awayTeam);
  const auditedSlug = AUDITED_SLUG_ALIASES.get(slug) ?? slug;

  if (AUDITED_KEEP.has(auditedSlug)) {
    return {
      classification: "KEEP",
      indexable: true,
      source: "audited-snapshot-2026-09-03",
      reasons: ["audited_keep"],
    };
  }

  if (AUDITED_UPGRADE.has(auditedSlug)) {
    return {
      classification: "UPGRADE",
      indexable: false,
      source: "audited-snapshot-2026-09-03",
      reasons: ["audited_upgrade"],
    };
  }

  if (AUDITED_LEGACY_NOINDEX.has(auditedSlug)) {
    return {
      classification: "LEGACY-NOINDEX",
      indexable: false,
      source: "audited-snapshot-2026-09-03",
      reasons: ["audited_legacy_noindex"],
    };
  }

  if (AUDITED_REMOVE.has(auditedSlug)) {
    return {
      classification: "REMOVE",
      indexable: false,
      source: "audited-snapshot-2026-09-03",
      reasons: ["audited_remove"],
    };
  }

  return fallbackDecision(prediction);
}

export function getAdSenseContentQualityDecisionBySlug(
  slug: string,
  predictions: readonly EditorialPrediction[]
): AdSenseContentQualityDecision | IndexQualityDecision | undefined {
  let index = predictionIndexCache.get(predictions);
  if (!index) {
    index = new Map(predictions.map((item) => [
      item.slug ?? predictionSlug(item.homeTeam, item.awayTeam),
      item,
    ]));
    predictionIndexCache.set(predictions, index);
  }
  const prediction = index.get(slug);

  return prediction
    ? getAdSenseContentQualityDecision(prediction)
    : undefined;
}

export function isAdSenseContentIndexable(
  slug: string,
  predictions: readonly EditorialPrediction[]
) {
  return Boolean(
    getAdSenseContentQualityDecisionBySlug(slug, predictions)?.indexable
  );
}

export function auditedAdSenseContentDecisionCounts() {
  return {
    keep: AUDITED_KEEP.size,
    upgrade: AUDITED_UPGRADE.size,
    legacyNoindex: AUDITED_LEGACY_NOINDEX.size,
    remove: AUDITED_REMOVE.size,
  };
}


export function getAdSenseIndexableSlugs(
  predictions: readonly EditorialPrediction[]
) {
  return predictions
    .filter((prediction) => getAdSenseContentQualityDecision(prediction).indexable)
    .map(
      (prediction) =>
        prediction.slug ??
        predictionSlug(prediction.homeTeam, prediction.awayTeam)
    );
}


export function isAdSenseLeagueIndexable(
  leagueSlug: string,
  matches: readonly { slug: string; league: string; status: string }[],
  predictions: readonly EditorialPrediction[]
) {
  return matches.some(
    (match) =>
      match.league === leagueSlug &&
      match.status === "published" &&
      isAdSenseContentIndexable(match.slug, predictions)
  );
}
