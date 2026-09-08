import { IntentHubPage } from "@/components/IntentHubPage";
import { intentHubMetadata } from "@/lib/intent-hubs";
export const metadata = intentHubMetadata("soccer-predictions");
export default function Page() { return <IntentHubPage slug="soccer-predictions" />; }
