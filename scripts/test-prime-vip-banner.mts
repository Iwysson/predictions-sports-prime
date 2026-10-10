import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dictionaries, supportedLocales } from "../src/i18n/dictionaries";
import { isVip } from "../src/lib/vip";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

assert.equal(isVip({ plan: "vip", subscription_status: "active" }), true);
assert.equal(isVip({ plan: "vip", subscription_status: "trialing" }), true);
assert.equal(isVip({ plan: "vip", subscription_status: "expired" }), false);
assert.equal(isVip({ plan: "free", subscription_status: "active" }), false);
assert.equal(isVip(null), false);

for (const locale of supportedLocales) {
  const copy = dictionaries[locale];
  assert.ok(copy.primeVipSupportMessage, `${locale}: support message is required`);
  assert.ok(copy.primeVipSupportCta, `${locale}: CTA is required`);
  assert.ok(copy.primeVipSupportLabel, `${locale}: accessible label is required`);
}

const [englishLayout, localizedLayout, component, analytics, css] = await Promise.all([
  read("src/app/(en)/layout.tsx"),
  read("src/app/[locale]/layout.tsx"),
  read("src/components/PrimeVipSupportBanner.tsx"),
  read("src/components/analytics/SiteAnalytics.tsx"),
  read("src/app/globals.css"),
]);

for (const layout of [englishLayout, localizedLayout]) {
  assert.equal((layout.match(/<PrimeVipSupportBanner \/>/g) ?? []).length, 1);
}

assert.match(component, /if \(!visible\) return null/);
assert.match(component, /const visible = !loading && !isVip/);
assert.match(component, /href="\/login\/"/);
assert.doesNotMatch(component, /whop/i);
assert.match(component, /ResizeObserver/);
assert.match(analytics, /--prime-vip-banner-offset/);
assert.match(css, /prime-vip-support-spacer/);
assert.match(css, /@media \(max-width: 520px\)/);
assert.match(css, /focus-visible/);

console.log("PRIME VIP global banner access, i18n and layout integrity: PASS");
