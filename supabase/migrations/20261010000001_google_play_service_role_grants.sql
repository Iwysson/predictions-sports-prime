-- Predictions-Sports-Prime: service_role privileges the Google Play verify/RTDN Functions need.
-- NOT applied automatically. Run manually in the Supabase SQL Editor after review.
-- Idempotent: GRANT is safe to re-run. No RLS, policy or other permission changes.
-- Mirrors 20261007000000_whop_webhook_service_role_grants.sql for the new Android rail.

begin;

grant usage on schema public to service_role;

grant select, insert, update
on table public.google_play_subscriptions
to service_role;

grant select, insert
on table public.google_play_rtdn_events
to service_role;

grant select, update
on table public.profiles
to service_role;

commit;

-- Post-migration checks (run manually, read-only):
--   select has_table_privilege('service_role', 'public.google_play_subscriptions', 'SELECT') as gp_select,
--          has_table_privilege('service_role', 'public.google_play_subscriptions', 'INSERT') as gp_insert,
--          has_table_privilege('service_role', 'public.google_play_subscriptions', 'UPDATE') as gp_update,
--          has_table_privilege('service_role', 'public.google_play_rtdn_events', 'SELECT')   as rtdn_select,
--          has_table_privilege('service_role', 'public.google_play_rtdn_events', 'INSERT')   as rtdn_insert;
