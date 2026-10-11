// Plan ids are public identifiers. Keeping the current PRIME VIP plan in code makes
// checkout and webhook deployment atomic even if a stale Cloudflare variable lingers.
export const PRIME_VIP_WHOP_PLAN_ID = "plan_OzwiIv69pwRNm";

export function primeVipWhopPlanId(env) {
  return env.WHOP_PLAN_ID === PRIME_VIP_WHOP_PLAN_ID
    ? env.WHOP_PLAN_ID
    : PRIME_VIP_WHOP_PLAN_ID;
}
