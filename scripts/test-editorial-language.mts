import assert from "node:assert/strict";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { findPortuguesePatterns, isBareHostname, sourceLabelsForCheck } from "./lib/editorial-language.mjs";

// --- false positive: a hostname used as a source label -------------------------------------------------
assert.equal(isBareHostname("gol.conmebol.com"), true);
assert.equal(isBareHostname("www1.folha.uol.com.br"), true);
assert.equal(isBareHostname("hockey-reference.com"), true);
assert.deepEqual(sourceLabelsForCheck([{ name: "gol.conmebol.com" }, { name: "UEFA fixtures" }]), ["UEFA fixtures"]);

// A label with prose around the hostname, or any prose label, is NOT exempt.
assert.equal(isBareHostname("Gol Transportes"), false);
assert.equal(isBareHostname("gol.conmebol.com notícia"), false);
assert.equal(isBareHostname("Estudiantes"), false);

// --- the checker keeps detecting real Portuguese -------------------------------------------------------
const flagged = (text: string, teamNames: string[] = []) => findPortuguesePatterns({ teamNames, text }).map(String);
assert.ok(flagged("O jogo terminou com um gol no segundo tempo").length >= 2, "plain Portuguese prose must be flagged");
assert.ok(flagged("Palpite: vitória do mandante").length >= 2);
assert.ok(flagged("A equipe não marcou").length >= 2);
assert.ok(flagged("Source: Gol Transportes report").some((pattern) => pattern.includes("gols?")), "a prose label containing 'gol' stays flagged");
assert.ok(flagged("gol.conmebol.com notícia sobre o gol").some((pattern) => pattern.includes("gols?")), "prose around a hostname stays flagged");
assert.deepEqual(flagged("A tight low-scoring draw; the home side must win on goals."), []);

// Existing exemptions are unchanged: URLs, proper nouns and team names.
assert.deepEqual(flagged("Official page https://gol.conmebol.com/libertadores/en/news/dates-confirmed"), []);
assert.deepEqual(flagged("Casa Pia host Vitória de Guimarães"), []);
assert.deepEqual(flagged("Santos beat Vitória on the road"), []);
assert.ok(flagged("A vitória foi merecida").length >= 1, "the Portuguese noun vitória stays flagged");

// --- the two real records that used to fail ------------------------------------------------------------
for (const slug of ["flamengo-vs-estudiantes", "palmeiras-vs-fluminense"]) {
  const prediction = editorialPredictions.find((p) => p.slug === slug || `${p.homeTeam}-vs-${p.awayTeam}`.toLowerCase() === slug);
  assert.ok(prediction, `${slug}: record not found`);
  const body = [prediction.seoTitle, prediction.title, prediction.teaser, prediction.trend, prediction.picks.main, ...prediction.analysis];
  const teamNames = [prediction.homeTeam, prediction.awayTeam];
  const rawLabels = (prediction.sources ?? []).map((source) => source.name);
  assert.ok(
    rawLabels.some(isBareHostname),
    `${slug}: expected a hostname source label`,
  );
  assert.ok(
    findPortuguesePatterns({ teamNames, text: [...body, ...rawLabels].filter(Boolean).join("\n") }).length > 0,
    `${slug}: the unfiltered labels reproduce the old false positive`,
  );
  assert.deepEqual(
    findPortuguesePatterns({ teamNames, text: [...body, ...sourceLabelsForCheck(prediction.sources)].filter(Boolean).join("\n") }),
    [],
    `${slug}: no Portuguese prose once hostname labels are treated as identifiers`,
  );
}

console.log("editorial-language checker: hostname labels exempt, real Portuguese still detected, both former false positives clean");
