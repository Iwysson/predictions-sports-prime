export const GA_MEASUREMENT_ID = "G-3XD0F1R16S";
export const ANALYTICS_CONSENT_STORAGE_KEY = "psp-analytics-consent";

export type AnalyticsConsentChoice = "granted" | "denied";

export type GtagCommand = IArguments | unknown[];

type AnalyticsWindow = Window & {
  dataLayer?: GtagCommand[];
};

export function parseAnalyticsConsent(value: string | null): AnalyticsConsentChoice | null {
  return value === "granted" || value === "denied" ? value : null;
}

export function readAnalyticsConsent(storage: Pick<Storage, "getItem"> = window.localStorage) {
  try {
    return parseAnalyticsConsent(storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(
  choice: AnalyticsConsentChoice,
  storage: Pick<Storage, "setItem"> = window.localStorage,
) {
  try {
    storage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, choice);
  } catch {
    // The explicit choice still applies to the current document.
  }
}

export function enqueueGtag(..._args: unknown[]) {
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  // gtag.js expects the Arguments object used by Google's official shim.
  analyticsWindow.dataLayer.push(arguments);
}

export function updateAnalyticsConsent(choice: AnalyticsConsentChoice) {
  enqueueGtag(...analyticsConsentUpdateCommand(choice));
}

export function analyticsConsentUpdateCommand(choice: AnalyticsConsentChoice) {
  return ["consent", "update", { analytics_storage: choice }] as const;
}

export function analyticsConsentBootstrap() {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
var pspAnalyticsConsent = null;
try {
  var pspStoredAnalyticsConsent = window.localStorage.getItem('${ANALYTICS_CONSENT_STORAGE_KEY}');
  if (pspStoredAnalyticsConsent === 'granted' || pspStoredAnalyticsConsent === 'denied') {
    pspAnalyticsConsent = pspStoredAnalyticsConsent;
  }
} catch (error) {}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: pspAnalyticsConsent || 'denied',
  wait_for_update: pspAnalyticsConsent ? 0 : 500
});`;
}

export function pageViewKey(pathname: string) {
  return pathname;
}

export function shouldTrackPageView(previousKey: string | null, nextKey: string) {
  return previousKey !== nextKey;
}

