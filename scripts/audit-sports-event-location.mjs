import { buildSportsEventJsonLd, sportsEventLocation, sportsEventStartDate } from "../src/lib/sports-event-schema.ts";

const cases = [
  {
    name: "full address",
    match: {
      venue: "Verified Stadium",
      venueAddress: {
        streetAddress: "Verified Street 1",
        addressLocality: "Verified City",
        addressRegion: "Verified Region",
        postalCode: "00000",
        addressCountry: "BR",
      },
    },
    expectedFields: 5,
  },
  {
    name: "city and country",
    match: {
      venue: "Verified Stadium",
      venueAddress: { addressLocality: "Verified City", addressCountry: "BR" },
    },
    expectedFields: 2,
  },
  {
    name: "venue name only",
    match: { venue: "Stadium Without Structured Address" },
    expectedFields: 0,
  },
];

for (const testCase of cases) {
  const location = sportsEventLocation(testCase.match);
  const serialized = JSON.stringify({
    "@type": "SportsEvent",
    startDate: sportsEventStartDate({ date: "2026-08-29", time: "20:00" }),
    ...(location ? { location } : {}),
  });
  const parsed = JSON.parse(serialized);
  const fieldCount = location
    ? Object.keys(location.address).filter((key) => key !== "@type").length
    : 0;

  if (fieldCount !== testCase.expectedFields) throw new Error(`${testCase.name}: unexpected address fields`);
  if (testCase.expectedFields === 0 && "location" in parsed) throw new Error(`${testCase.name}: location should be omitted`);
  if (/"(?:address|location)":\{\}/.test(serialized)) throw new Error(`${testCase.name}: empty object emitted`);
  if (/null|undefined|""/.test(serialized)) throw new Error(`${testCase.name}: invalid empty value emitted`);
}

console.log("SportsEvent location cases: 3/3 PASS");

const baseMatch = {
  slug: "home-vs-away",
  homeTeam: "Home",
  awayTeam: "Away",
  league: "test",
  date: "2026-08-29",
  time: "20:00",
  predictions: [],
  analysis: [],
};
const eventWithoutLocation = buildSportsEventJsonLd(baseMatch, {
  url: "https://predictions-sports-prime.com/match/home-vs-away/",
  description: "Verified test description",
});
if (eventWithoutLocation !== undefined) {
  throw new Error("SportsEvent must be omitted when verified location is unavailable");
}

const eventWithLocation = buildSportsEventJsonLd(
  { ...baseMatch, ...cases[1].match },
  {
    url: "https://predictions-sports-prime.com/match/home-vs-away/",
    description: "Verified test description",
  }
);
if (!eventWithLocation?.location?.address) {
  throw new Error("SportsEvent with verified location must contain a structured address");
}

console.log("SportsEvent emission guard: 2/2 PASS");
