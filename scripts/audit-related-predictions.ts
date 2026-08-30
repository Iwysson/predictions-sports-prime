import { matches } from "../src/data/matches";
import { fixtureKickoffMillis } from "../src/lib/fixture-state";
import { selectRelatedPredictions } from "../src/lib/related-predictions";

const now = new Date();
const errors: string[] = [];
const linkCounts = new Map<string, number>();

for (const current of matches.filter((match) => match.status === "published")) {
  const related = selectRelatedPredictions(current, matches, 4, now);
  for (const candidate of related) {
    linkCounts.set(candidate.slug, (linkCounts.get(candidate.slug) ?? 0) + 1);
    const kickoff = fixtureKickoffMillis(candidate);
    if (kickoff === null || kickoff <= now.valueOf()) {
      errors.push(`${current.slug}: non-future related match ${candidate.slug}`);
    }
    if (candidate.status !== "published") {
      errors.push(`${current.slug}: unpublished related match ${candidate.slug}`);
    }
    if (candidate.slug === current.slug) {
      errors.push(`${current.slug}: related list contains itself`);
    }
  }
}

for (const future of matches.filter((match) => {
  const kickoff = fixtureKickoffMillis(match);
  return match.status === "published" && kickoff !== null && kickoff > now.valueOf();
})) {
  if ((linkCounts.get(future.slug) ?? 0) < 2) {
    errors.push(`${future.slug}: future published match has fewer than two related links`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Related predictions: PASS (${matches.length} pages checked; future published matches only)`);
