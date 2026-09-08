import { IntentHubPage } from "@/components/IntentHubPage";
import { intentHubMetadata } from "@/lib/intent-hubs";
export const metadata = intentHubMetadata("betting-tips");
export default function Page() { return <IntentHubPage slug="betting-tips" />; }
