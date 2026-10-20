// Context-aware leak rules for the static output. A protected pick (VIP or BEST BET) is allowed only
// inside the FREE accumulator block that the product publishes on purpose. Anywhere else, including
// the individual match card, it is a leak. Allowances are per context, never global text exemptions.

export const MULTIPLE_MARKERS = ["NHL + FOOTBALL BEST MULTIPLE TODAY", "NHL BEST MULTIPLE TODAY", "NFL + FOOTBALL BEST MULTIPLE TODAY"];

// Characters after a multiple marker that belong to the same block (title, legs, odds, comment).
export const MULTIPLE_SPAN = 2400;

// Picks that the FREE accumulators publish on purpose. Only these may appear in a multiple block.
export const FREE_MULTIPLE_LEGS = [
  "New Jersey Devils to win",
  "Over 5.5 Goals",
  "Colorado Avalanche to Win",
  "Cruzeiro X1 + Over 1.5 Goals",
  "Montreal Canadiens to Win (Including OT/SO)",
  "New York Islanders to Win (Including OT/SO)",
  "Fluminense to Win + Over 1.5 Goals",
  "Dallas Cowboys -3.5",
];

// [start, end) ranges of every multiple block in a text.
export function multipleWindows(text) {
  const ranges = [];
  for (const marker of MULTIPLE_MARKERS) {
    let i = text.indexOf(marker);
    while (i !== -1) {
      ranges.push([i, Math.min(text.length, i + MULTIPLE_SPAN)]);
      i = text.indexOf(marker, i + 1);
    }
  }
  return ranges;
}

const inside = (ranges, index) => ranges.some(([s, e]) => index >= s && index < e);

function occurrences(text, needle) {
  const found = [];
  if (!needle) return found;
  let i = text.indexOf(needle);
  while (i !== -1) {
    found.push(i);
    i = text.indexOf(needle, i + needle.length);
  }
  return found;
}

// Match the protected entry's complete value in serialized fields or rendered elements.
// A phrase inside a longer public pick (for example the NHL's New York Rangers selection)
// is not the Dundee entry. Multiple legs are also checked as plain text inside their
// bounded block, where the pick may be followed by an @odds suffix.
const exactForms = (pick) => [`"${pick}"`, `\\"${pick}\\"`, `\\\\\\"${pick}\\\\\\"`, `>${pick}<`];
function pickOccurrences(text, pick, windows) {
  const structured = exactForms(pick).flatMap((form) => occurrences(text, form).map((i) => i + form.indexOf(pick)));
  // A short pick can be a text prefix of a longer, different FREE_MULTIPLE_LEGS entry (for example "New York
  // Islanders to Win" inside "New York Islanders to Win (Including OT/SO)"). That is not an occurrence of the
  // shorter pick at all, so skip positions where a different allowed leg is what is actually printed there.
  const multipleLegs = occurrences(text, pick).filter(
    (at) => inside(windows, at) && !FREE_MULTIPLE_LEGS.some((leg) => leg !== pick && leg.startsWith(pick) && text.startsWith(leg, at)),
  );
  return [...new Set([...structured, ...multipleLegs])];
}

// Leaks for one protected entry in one text. `entry` = { pick, oddsText }. `label` names the entry in reports.
export function protectedPickLeaks(text, entry, label) {
  const leaks = [];
  const windows = multipleWindows(text);
  const pickHits = pickOccurrences(text, entry.pick, windows);
  for (const at of pickHits) {
    const allowed = inside(windows, at) && FREE_MULTIPLE_LEGS.includes(entry.pick);
    if (!allowed) leaks.push({ kind: "pick-outside-context", label, at });
  }
  // The odds belong to the protected pick: a nearby "1.65" outside a multiple block is a leak too.
  for (const at of pickHits) {
    for (const odd of occurrences(text, entry.oddsText)) {
      if (Math.abs(odd - at) <= 160 && !inside(windows, odd)) leaks.push({ kind: "odds-outside-context", label, at: odd });
    }
  }
  return leaks;
}

// Strict contextual exception: the central Results dataset may publish the ORIGINAL pick and odds of a
// prediction that is officially FINAL and settled. Only the serialized result record itself is removed
// before the leak rules run (the HTML result card, or the JSON record in the RSC payload). A pick
// anywhere else (upcoming, live, match page, metadata) stays in the text and is reported as a leak.

function removeRanges(text, find) {
  let out = text;
  for (;;) {
    const range = find(out);
    if (!range) return out;
    out = out.slice(0, range[0]) + out.slice(range[1]);
  }
}

// Quote forms of a JSON/RSC string: plain, escaped once (a JSON string inside a script) and escaped twice
// (the RSC payload that Next.js embeds as a JS string literal in the page HTML).
const QUOTE_FORMS = ['"', '\\"', '\\\\\\"'];

// End index (exclusive) of the bracketed RSC element that starts at `start` (a "["), or -1 when it never balances.
function balancedEnd(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "[") depth += 1;
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

// RSC elements of a settled record's result card, at any escape depth: the keyed `article` element and the
// separately streamed `result-card__details` element. The details element carries no slug, so it is tied to a
// record only when it holds that record's own prediction, odds and match date together.
function settledRscElements(value, record, q) {
  const ranges = [];
  const article = `[${q}$${q},${q}article${q},${q}${record.key}${q},`;
  for (let i = value.indexOf(article); i !== -1; i = value.indexOf(article, i + 1)) {
    const end = balancedEnd(value, i);
    if (end !== -1) ranges.push([i, end]);
  }
  const details = `[${q}$${q},${q}dl${q},null,{${q}className${q}:${q}result-card__details${q}`;
  for (let i = value.indexOf(details); i !== -1; i = value.indexOf(details, i + 1)) {
    const end = balancedEnd(value, i);
    if (end === -1) continue;
    const element = value.slice(i, end);
    const sameRecord =
      element.includes(`${q}${record.prediction}${q}`) &&
      element.includes(`${q}${record.date}${q}`) &&
      (element.includes(`:${record.odds}`) || element.includes(`:${Number(record.odds).toFixed(2)}`));
    if (sameRecord) ranges.push([i, end]);
  }
  return ranges;
}

// When two settled result cards publish the identical "Published prediction"/"Published odds" text, Next.js
// streams each shared div once and the other card references it by chunk id instead of repeating it inline.
// That shared definition carries no match date, so `settledRscElements` (which ties date+prediction+odds
// together) cannot attribute it to a specific record. Remove it directly by its own (prediction, odds) pair:
// this exact dt/dd shape is only ever emitted by the settled-results UI, never by a protected rendering path.
function publishedFieldChunks(record, q) {
  const predictionDiv =
    `[${q}$${q},${q}div${q},null,{${q}children${q}:[[${q}$${q},${q}dt${q},null,{${q}children${q}:${q}Published prediction${q}}],` +
    `[${q}$${q},${q}dd${q},null,{${q}children${q}:${q}${record.prediction}${q}}]]}]`;
  const oddsDiv =
    `[${q}$${q},${q}div${q},null,{${q}children${q}:[[${q}$${q},${q}dt${q},null,{${q}children${q}:${q}Published odds${q}}],` +
    `[${q}$${q},${q}dd${q},null,{${q}children${q}:${record.odds}}]]}]`;
  return [predictionDiv, oddsDiv];
}

export function maskSettledResultRecords(text, records) {
  let masked = text;
  for (const record of Object.values(records ?? {})) {
    if (!record || !record.slug || !record.key || !record.finalScore || !record.result) continue;
    // HTML result card of this settled record.
    masked = removeRanges(masked, (value) => {
      const marker = value.indexOf(`data-result-slug="${record.slug}"`);
      if (marker === -1) return null;
      const start = value.lastIndexOf('<article class="result-card"', marker);
      const end = value.indexOf("</article>", marker);
      return start === -1 || end === -1 ? null : [start, end + "</article>".length];
    });
    // "Settled predictions" history-row link to this record on a hub page (for example /football-predictions/).
    masked = removeRanges(masked, (value) => {
      const marker = value.indexOf(`href="/results/#${record.slug}" class="history-row"`);
      if (marker === -1) return null;
      const start = value.lastIndexOf("<a ", marker);
      const end = value.indexOf("</a>", marker);
      return start === -1 || end === -1 ? null : [start, end + "</a>".length];
    });
    // JSON result record and RSC result-card elements (plain, or escaped once or twice inside the page payload).
    for (const q of QUOTE_FORMS) {
      masked = removeRanges(masked, (value) => {
        const start = value.indexOf(`{${q}key${q}:${q}${record.key}${q}`);
        if (start === -1) return null;
        const stamp = value.indexOf(`${q}settledAt${q}:`, start);
        const end = stamp === -1 ? -1 : value.indexOf("}", stamp);
        return end === -1 ? null : [start, end + 1];
      });
      masked = removeRanges(masked, (value) => settledRscElements(value, record, q)[0] ?? null);
      for (const chunk of publishedFieldChunks(record, q)) {
        masked = masked.split(chunk).join("");
      }
    }
  }
  return masked;
}
