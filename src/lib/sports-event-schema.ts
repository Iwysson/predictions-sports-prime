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

function schemaEventStatus(status: Match["fixtureStatus"]) {
  if (status === "postponed") return "https://schema.org/EventPostponed";
  if (status === "canceled" || status === "abandoned") return "https://schema.org/EventCancelled";
  if (status === "completed") return "https://schema.org/EventCompleted";
  if (status === "in-progress") return "https://schema.org/EventInProgress";
  return "https://schema.org/EventScheduled";
}

export function buildSportsEventJsonLd(
  match: Match,
  { url, description }: { url: string; description: string }
) {
  const location = sportsEventLocation(match);

  // Never publish a SportsEvent that Google will treat as incomplete. The
  // Article remains valid on its own when verified venue address data is absent.
  if (!location) return undefined;

  return {
    "@type": "SportsEvent" as const,
    "@id": `${url}#sports-event`,
    name: `${match.homeTeam} vs ${match.awayTeam}`,
    startDate: sportsEventStartDate(match),
    eventStatus: schemaEventStatus(match.fixtureStatus),
    url,
    location,
    homeTeam: {
      "@type": "SportsTeam" as const,
      name: match.homeTeam,
    },
    awayTeam: {
      "@type": "SportsTeam" as const,
      name: match.awayTeam,
    },
    description,
  };
}
