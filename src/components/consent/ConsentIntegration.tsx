import { analyticsConsentBootstrap } from "@/lib/analytics-consent";

/**
 * Consent Mode bootstrap. Advertising consent starts denied and may only be
 * updated by the Google-certified CMP configured by the publisher in
 * production. This is deliberately not a home-grown consent dialog and does
 * not claim to replace the CMP/TCF integration required by Google.
 */
export function ConsentIntegration() {
  return (
    <script
      id="consent-mode-defaults"
      dangerouslySetInnerHTML={{ __html: analyticsConsentBootstrap() }}
    />
  );
}
