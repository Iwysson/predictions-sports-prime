# Google AdSense production setup

The site contains production-ready support for manually positioned AdSense
units. Auto Ads are intentionally not enabled. Until real credentials, consent
configuration and `ads.txt` are ready, keep advertising disabled.

## Setup

1. Create or sign in to the Google AdSense account.
2. Add and verify the real site in AdSense.
3. Copy the Publisher ID supplied by Google. Its format resembles
   `ca-pub-XXXXXXXXXXXXXXXX`; never copy this format example as a real value.
4. Set the real ID as `NEXT_PUBLIC_ADSENSE_CLIENT_ID`.
5. Create manual display ad units for the desired placements.
6. Copy each numeric Slot ID into its corresponding environment variable.
7. Copy `.env.example` to `.env.local` for local testing. Do not commit secrets
   or production values.
8. Create `public/ads.txt` only after Google supplies the authorized line. The
   file must contain exactly the real line shown by AdSense. Do not publish a
   placeholder publisher record.
9. Configure a Google-certified consent management platform before serving
   Google advertising in the EEA, United Kingdom, Switzerland or any other
   region where the applicable rules require it.
10. Do not assume or programmatically set `ad_storage` or `analytics_storage`
    to granted. `ConsentIntegration` is only an integration point and grants
    nothing automatically.
11. Set `NEXT_PUBLIC_ADS_ENABLED=true` only after the Publisher ID, desired
    Slot IDs and required consent configuration are ready.
12. Run `npm run build` and deploy the generated `out/` directory.
13. Check the browser console for configuration or policy errors.
14. Check Network for a single AdSense script request and the expected ad-unit
    requests. Missing slots intentionally remain placeholders.
15. Confirm that `https://YOUR-DOMAIN/ads.txt` returns the exact authorized
    Google record.

To disable all AdSense loading quickly, set:

```env
NEXT_PUBLIC_ADS_ENABLED=false
```

This prevents the Google script and ad initialization from rendering. Reserved
placeholders remain to protect layout stability.

## Placements

```text
home-middle
home-bottom
league-top
league-sidebar
league-middle
match-top
match-content
match-bottom
```

The site initially uses no more than two Home placements. League units include
a top banner, a sidebar rectangle and a controlled middle placement after the
fixtures. Match pages separate top, content and bottom units from the analysis
and main prediction.

## Cloudflare Pages variables

In Cloudflare Pages, open `Settings → Variables and secrets` and add these to
the Production environment:

```text
NEXT_PUBLIC_ADS_ENABLED
NEXT_PUBLIC_ADSENSE_CLIENT_ID
NEXT_PUBLIC_ADSENSE_SLOT_HOME_MIDDLE
NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM
NEXT_PUBLIC_ADSENSE_SLOT_LEAGUE_TOP
NEXT_PUBLIC_ADSENSE_SLOT_LEAGUE_SIDEBAR
NEXT_PUBLIC_ADSENSE_SLOT_LEAGUE_MIDDLE
NEXT_PUBLIC_ADSENSE_SLOT_MATCH_TOP
NEXT_PUBLIC_ADSENSE_SLOT_MATCH_CONTENT
NEXT_PUBLIC_ADSENSE_SLOT_MATCH_BOTTOM
```

Also configure `NEXT_PUBLIC_SITE_URL` with the real HTTPS origin and optionally
`NEXT_PUBLIC_CONTACT_EMAIL`. Changing a `NEXT_PUBLIC_` variable requires a new
build because values are embedded in the static export.

## Consent and CMP

Google may require a certified CMP for serving ads in regulated regions. Select
and configure the CMP through the appropriate Google or certified-provider
workflow. Do not replace it with a custom banner that merely looks like consent.
The repository deliberately contains no fake consent dialog and grants no
advertising consent by default.
