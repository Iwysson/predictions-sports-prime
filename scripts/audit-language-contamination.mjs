import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const locales = ["pt-br", "es", "it", "fr", "de"];
const english = new Set("the and with this that from for into before after while where when which our their has have was were will would should match prediction analysis published odds source data home away team teams first goal goals shots corners possession lineup lineups available current risk result read latest upcoming".split(" "));
const localWords = {
  "pt-br": new Set("o a os as e com este esta que de para antes depois quando onde nossa seu sua jogo palpite analise publicado odds fonte dados casa fora time times primeiro gol gols chutes escanteios posse escalacao disponivel atual risco resultado ver proximos".split(" ")),
  es: new Set("el la los las y con este esta que de para antes despues cuando donde nuestro partido pronostico analisis publicado cuotas fuente datos local visitante equipo primero gol goles tiros corners posesion alineacion disponible actual riesgo resultado ver proximos".split(" ")),
  it: new Set("il la i le e con questo questa che di per prima dopo quando dove nostro partita pronostico analisi pubblicato quote fonte dati casa trasferta squadra primo gol tiri corner possesso formazione disponibile attuale rischio risultato vedere prossimi".split(" ")),
  fr: new Set("le la les et avec ce cette que de pour avant apres quand ou notre match pronostic analyse publie cotes source donnees domicile exterieur equipe premier but buts tirs corners possession composition disponible actuel risque resultat voir prochains".split(" ")),
  de: new Set("der die das und mit diese dass von fur vor nach wenn wo unser spiel prognose analyse veroffentlicht quoten quelle daten heim auswarts mannschaft erste tor tore schusse ecken ballbesitz aufstellung verfugbar aktuell risiko ergebnis lesen kommende".split(" ")),
};
function walk(directory) { return fs.readdirSync(directory).flatMap((name) => { const item = path.join(directory, name); return fs.statSync(item).isDirectory() ? walk(item) : [item]; }); }
function route(file) { const rel = path.relative(root, file).split(path.sep).join("/"); return `/${rel.replace(/index\.html$/, "").replace(/\.html$/, "/")}`; }
function indexable(html) { return /name="robots" content="index, follow"|content="index, follow" name="robots"/i.test(html); }
function visible(html) { return (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, " ").replace(/&[a-z#0-9]+;/gi, " ").toLowerCase(); }
function tokens(text) { return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[a-z]+/g) ?? []; }
const counts = Object.fromEntries(locales.map((locale) => [locale, { pages: 0, residues: 0, urls: [] }]));
for (const file of walk(root).filter((item) => item.endsWith(".html"))) {
  const pageRoute = route(file); const locale = locales.find((item) => pageRoute.startsWith(`/${item}/`));
  if (!locale) continue; const html = fs.readFileSync(file, "utf8"); if (!indexable(html)) continue;
  counts[locale].pages += 1; const words = tokens(visible(html));
  const englishHits = words.filter((word) => english.has(word) && !localWords[locale].has(word)).length;
  const localHits = words.filter((word) => localWords[locale].has(word)).length;
  const contaminated = englishHits >= 18 && englishHits > localHits * 1.25;
  if (contaminated) { counts[locale].residues += 1; counts[locale].urls.push(pageRoute); }
}
console.log("Language contamination audit");
for (const locale of locales) console.log(`${locale} pages: ${counts[locale].pages}; English residue: ${counts[locale].residues}`);
const total = Object.values(counts).reduce((sum, item) => sum + item.residues, 0);
if (total) { for (const [locale, result] of Object.entries(counts)) for (const url of result.urls) console.error(`ERROR: ${locale}: English-majority body ${url}`); process.exitCode = 1; }
else console.log("Language contamination audit: PASS");
