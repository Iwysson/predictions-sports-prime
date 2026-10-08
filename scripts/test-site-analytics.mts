import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  analyticsConsentBootstrap,
  analyticsConsentUpdateCommand,
  pageViewKey,
  parseAnalyticsConsent,
  shouldTrackPageView,
} from "../src/lib/analytics-consent.ts";

type ConsentCommand = IArguments;

function runBootstrap(saved: string | null) {
  const context = {
    window: {
      localStorage: {
        getItem(key: string) {
          assert.equal(key, ANALYTICS_CONSENT_STORAGE_KEY);
          return saved;
        },
      },
    } as { dataLayer?: ConsentCommand[]; localStorage: { getItem(key: string): string | null } },
  };
  runInNewContext(analyticsConsentBootstrap(), context);
  return Array.from(context.window.dataLayer?.[0] ?? []);
}

function consentState(command: unknown[]) {
  assert.deepEqual(command.slice(0, 2), ["consent", "default"]);
  return command[2] as Record<string, unknown>;
}

assert.equal(parseAnalyticsConsent("granted"), "granted");
assert.equal(parseAnalyticsConsent("denied"), "denied");
assert.equal(parseAnalyticsConsent("invalid"), null);

assert.deepEqual(analyticsConsentUpdateCommand("granted"), [
  "consent", "update", { analytics_storage: "granted" },
]);
assert.deepEqual(analyticsConsentUpdateCommand("denied"), [
  "consent", "update", { analytics_storage: "denied" },
]);

const firstVisit = consentState(runBootstrap(null));
assert.equal(firstVisit.analytics_storage, "denied");
assert.equal(firstVisit.wait_for_update, 500);

const revisitAfterAccept = consentState(runBootstrap("granted"));
assert.equal(revisitAfterAccept.analytics_storage, "granted");
assert.equal(revisitAfterAccept.wait_for_update, 0);

const revisitAfterDecline = consentState(runBootstrap("denied"));
assert.equal(revisitAfterDecline.analytics_storage, "denied");
assert.equal(revisitAfterDecline.wait_for_update, 0);

for (const state of [firstVisit, revisitAfterAccept, revisitAfterDecline]) {
  assert.equal(state.ad_storage, "denied");
  assert.equal(state.ad_user_data, "denied");
  assert.equal(state.ad_personalization, "denied");
}

assert.equal(pageViewKey("/match/example/"), "/match/example/");
assert.equal(shouldTrackPageView(null, "/match/example/"), true);
assert.equal(shouldTrackPageView("/match/example/", "/match/example/"), false);
assert.equal(shouldTrackPageView("/match/example/", "/league/example/"), true);

const analyticsSource = readFileSync("src/components/analytics/SiteAnalytics.tsx", "utf8");
assert.match(analyticsSource, /send_page_view:\s*false/);
assert.equal((analyticsSource.match(/enqueueGtag\("event",\s*"page_view"/g) ?? []).length, 1);
assert.match(analyticsSource, /updateAnalyticsConsent\(next\)/);

for (const layout of ["src/app/(en)/layout.tsx", "src/app/[locale]/layout.tsx"]) {
  const source = readFileSync(layout, "utf8");
  assert.equal((source.match(/<ConsentIntegration\s*\/>/g) ?? []).length, 1, `${layout}: consent bootstrap`);
  assert.equal((source.match(/<SiteAnalytics\s*\/>/g) ?? []).length, 1, `${layout}: analytics component`);
}

console.log("Site analytics consent and navigation tests: PASS");
