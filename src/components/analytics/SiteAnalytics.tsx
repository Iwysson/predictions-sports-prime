import { GoogleAnalytics } from "@next/third-parties/google";

const GA_MEASUREMENT_ID = "G-3XD0F1R16S";

export function SiteAnalytics() {
  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
