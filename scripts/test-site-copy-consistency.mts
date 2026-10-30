// Regression checks for customer-facing copy that must stay true:
//  - the only PRIME VIP price is $19.99/month: no struck-through legacy price, no fake 24h promotion timer, no trial promo;
//  - the cookie policy describes Google Analytics as it actually behaves (tag may load, analytics_storage starts denied);
//  - the track record states its scope instead of claiming a lifetime / "all settled" record;
// Run: npx tsx scripts/test-site-copy-consistency.mts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

let failures = 0;
const check = (label: string, ok: boolean) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failures += 1;
};

function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(?:tsx?|json)$/.test(name)) out.push(path);
  }
  return out;
}

const sources = walk("src").filter((file) => !file.includes(join("src", "data", "predictions")));
const text = (file: string) => readFileSync(file, "utf8");
const offenders = (pattern: RegExp) => sources.filter((file) => pattern.test(text(file)));

check("no legacy $29.99 price in src", offenders(/\$\s?29\.99/).length === 0);
check("no 'BIG PROMOTION' copy in src", offenders(/BIG PROMOTION/i).length === 0);
check("no countdown/promo-deadline component or storage key", offenders(/PrimeVipCountdown|psp-prime-vip-promo-deadline/).length === 0);
check("no free-trial / 1-day-trial promotional copy in src", offenders(/free[ -]trial|1-day trial|one-day trial/i).length === 0);
check("current $19.99 offer is present on the offer card", /\$19\.99/.test(text("src/components/PrimeVipOfferCard.tsx")));

const cookies = text("src/app/(en)/cookies/page.tsx");
check("cookie policy no longer says Google Analytics is not loaded", !/Google Analytics is not loaded/i.test(cookies));
check("cookie policy says the tag can load before a choice", /can load when a page opens, before you make a choice/i.test(cookies));
check("cookie policy says analytics storage starts denied", /Analytics storage starts denied/i.test(cookies));
check("cookie policy mentions cookieless measurement pings", /cookieless measurement pings/i.test(cookies));
check("cookie policy limits persistent cookies to after consent", /Persistent analytics cookies are used only after you choose Accept analytics/i.test(cookies));

const trackRecord = text("src/components/FootballTrackRecord.tsx");
check("football track record does not claim 'all settled' predictions", !/across all settled/i.test(trackRecord) && !/Overall Track Record/.test(trackRecord));
check("football track record states a snapshot scope, not lifetime", /not a lifetime or all-time record/.test(trackRecord));
process.exit(failures === 0 ? 0 : 1);
