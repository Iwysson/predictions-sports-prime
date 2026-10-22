// Detection of Portuguese prose inside English editorial content (scripts/check-editorial-language.mjs).

export const portuguesePatterns = [
  /\banálise(?:s)?\b/i, /\bjogos?\b/i, /\bgols?\b/i, /\bvence(?:r)?\b/i,
  /\bequipes?\b/i, /\btemporada\b/i, /\bnão\b/i, /\btambém\b/i,
  /\bmais de\b/i, /\bmenos de\b/i, /\bcasa\b/i, /\bfora\b/i,
  /\bpalpite\b/i, /\bprognóstico\b/i, /\bescanteios\b/i, /\bempate\b/i,
  /\bvitórias?\b/i, /\bderrotas?\b/i, /\bpartidas?\b/i, /\bmandante\b/i,
  /\bvisitante\b/i, /\bsofre(?:u|r)?\b/i, /\bmarcou\b/i, /\bpressão\b/i,
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Club names that contain a Portuguese word but are proper nouns in English text.
export const properNouns = ["Vitória de Guimarães", "Casa Pia"];
// The Brazilian club Vitória (Esporte Clube Vitória) is a proper noun in English text when it is mentioned as an
// opponent of another fixture. Matched case-sensitively and capitalised only, so the Portuguese noun "vitória" stays flagged.
export const caseSensitiveProperNouns = ["Vitória"];
// URLs are identifiers, not editorial prose: an official source link such as ".../match/temporada-2026-2027-laliga-..."
// is not Portuguese text and cannot be translated without breaking the link. Prose around the link is still checked.
const URL_PATTERN = /https?:\/\/[^\s)\]>"']+/gi;

// A source label that is nothing but a hostname (for example "gol.conmebol.com", the official CONMEBOL domain) is an
// identifier exactly like the URL it labels: its first label can coincide with a Portuguese word without being one.
// Only a label that is entirely a hostname is exempt; a label with any prose around it is still checked.
const BARE_HOSTNAME = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
export const isBareHostname = (label) => BARE_HOSTNAME.test(String(label ?? "").trim());

export function sourceLabelsForCheck(sources) {
  return (sources ?? []).map((source) => source.name).filter((name) => name && !isBareHostname(name));
}

// Portuguese patterns found in `text` after removing the fixture's own team names, known proper nouns and URLs.
export function findPortuguesePatterns({ teamNames = [], text }) {
  const withoutNames = [...teamNames, ...properNouns].reduce(
    (value, teamName) => value.replace(new RegExp(escapeRegExp(teamName), "gi"), ""),
    text.replace(URL_PATTERN, " "),
  );
  const editorialText = caseSensitiveProperNouns.reduce(
    (value, noun) => value.replace(new RegExp(escapeRegExp(noun), "g"), ""),
    withoutNames,
  );
  return portuguesePatterns.filter((pattern) => pattern.test(editorialText));
}
