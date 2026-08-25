import type { Match, VenueAddress } from "@/types";

function clean(value?: string) {
  const normalized = value?.trim();
  return normalized || undefined;
}

export function sportsEventLocation(
  match: Pick<Match, "venue" | "venueAddress">
) {
  const name = clean(match.venue);
  const source = match.venueAddress;
  const addressLocality = clean(source?.addressLocality);
  const addressCountry = clean(source?.addressCountry);

  // A Place without at least a reliable city and country triggers an
  // incomplete Event address. Venue names alone are not address evidence.
  if (!name || !addressLocality || !addressCountry) return undefined;

  const address: VenueAddress & { "@type": "PostalAddress" } = {
    "@type": "PostalAddress",
    ...(clean(source?.streetAddress) ? { streetAddress: clean(source?.streetAddress) } : {}),
    addressLocality,
    ...(clean(source?.addressRegion) ? { addressRegion: clean(source?.addressRegion) } : {}),
    ...(clean(source?.postalCode) ? { postalCode: clean(source?.postalCode) } : {}),
    addressCountry,
  };

  return {
    "@type": "Place" as const,
    name,
    address,
  };
}

export function sportsEventStartDate(
  match: Pick<Match, "date" | "time" | "kickoffUtc">
) {
  if (match.kickoffUtc && !Number.isNaN(Date.parse(match.kickoffUtc))) {
    return match.kickoffUtc;
  }

  // A date is preferable to a local date-time with no trustworthy UTC offset.
  return match.date;
}
