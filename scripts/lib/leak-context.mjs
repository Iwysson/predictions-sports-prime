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

// A short pick that is part of a longer public pick ("Over 1.5 Goals" inside "X1 + Over 1.5 Goals") is
// matched only as a whole quoted or tagged value, so public text cannot cause a false positive.
const exactForms = (pick) => [`"${pick}"`, `\\"${pick}\\"`, `>${pick}<`];
function pickOccurrences(text, entry) {
  if (!entry.exact) return occurrences(text, entry.pick);
  return exactForms(entry.pick).flatMap((form) => occurrences(text, form).map((i) => i + form.indexOf(entry.pick)));
}

// Leaks for one protected entry in one text. `entry` = { pick, oddsText, exact? }. `label` names the entry in reports.
export function protectedPickLeaks(text, entry, label) {
  const leaks = [];
  const windows = multipleWindows(text);
  const pickHits = pickOccurrences(text, entry);
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
