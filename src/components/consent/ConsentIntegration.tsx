/**
 * Consent Mode bootstrap. Advertising consent starts denied and may only be
 * updated by the Google-certified CMP configured by the publisher in
 * production. This is deliberately not a home-grown consent dialog and does
 * not claim to replace the CMP/TCF integration required by Google.
 */
export function ConsentIntegration() {
  const bootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});`;

  return (
    <script
      id="consent-mode-defaults"
      dangerouslySetInnerHTML={{ __html: bootstrap }}
    />
  );
}
