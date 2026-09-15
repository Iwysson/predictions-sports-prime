/** Conservative consent gate for a separately installed, certified TCF CMP.
 * https://support.google.com/adsense/answer/9804260
 * https://support.google.com/adsense/answer/9999955
 */
export type AdConsentData = {
  listenerId?: number;
  cmpStatus?: string;
  eventStatus?: string;
  tcString?: string;
  purpose?: { consents?: Record<number, boolean> };
  vendor?: { consents?: Record<number, boolean> };
};

export function hasAdConsent(data: AdConsentData | undefined, success: boolean) {
  return success === true && data?.cmpStatus === "loaded" &&
    (data.eventStatus === "tcloaded" || data.eventStatus === "useractioncomplete") &&
    typeof data.tcString === "string" && data.tcString.length > 0 &&
    data.vendor?.consents?.[755] === true &&
    [1, 3, 4].every((purpose) => data.purpose?.consents?.[purpose] === true);
}

export type TcfApi = (
  command: "addEventListener" | "removeEventListener",
  version: 2,
  callback: (data: AdConsentData | undefined, success: boolean) => void,
  listenerId?: number,
) => void;

/** Never infer consent from CMP readiness, region, timeout or missing data. */
export function observeAdConsent(api: TcfApi, onChange: (granted: boolean) => void) {
  let active = true;
  let listenerId: number | undefined;
  const remove = () => {
    if (listenerId === undefined) return;
    try { api("removeEventListener", 2, () => {}, listenerId); } catch { /* Stay denied. */ }
  };
  onChange(false);
  try {
    api("addEventListener", 2, (data, success) => {
      if (typeof data?.listenerId === "number") listenerId = data.listenerId;
      if (!active) { remove(); return; }
      onChange(hasAdConsent(data, success));
    });
  } catch { onChange(false); }
  return () => { active = false; remove(); };
}
