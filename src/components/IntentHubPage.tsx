import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import type { IntentHubSlug } from "@/lib/intent-hubs";
import { IntentHubContent } from "@/components/IntentHubContent";
import { PublishedMatchDirectory } from "@/components/PublishedMatchDirectory";
import { selectTemporalClientMatches } from "@/lib/match-feed";

export async function IntentHubPage({ slug }: { slug: IntentHubSlug }) {
  const resolved = await hydratePredictions(matches.map(toMatchPreview));
  return <IntentHubContent
    slug={slug}
    matches={selectTemporalClientMatches(resolved)}
    discovery={<PublishedMatchDirectory matches={resolved} />}
  />;
}
