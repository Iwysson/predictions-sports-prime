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
const exactForms = (pick) => [`"${pick}"`, `\\"${pick}\\"`, `>${pick}<`];
function pickOccurrences(text, pick, windows) {
  const structured = exactForms(pick).flatMap((form) => occurrences(text, form).map((i) => i + form.indexOf(pick)));
  const multipleLegs = occurrences(text, pick).filter((at) => inside(windows, at));
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
    // JSON result record (plain or backslash-escaped inside an RSC payload string).
    for (const q of ['"', '\\"']) {
      masked = removeRanges(masked, (value) => {
        const start = value.indexOf(`{${q}key${q}:${q}${record.key}${q}`);
        if (start === -1) return null;
        const stamp = value.indexOf(`${q}settledAt${q}:`, start);
        const end = stamp === -1 ? -1 : value.indexOf("}", stamp);
        return end === -1 ? null : [start, end + 1];
      });
    }
  }
  return masked;
}
