-- Predictions-Sports-Prime: persist the service_role privileges the Whop webhook needs.
-- NOT applied automatically. Run manually in the Supabase SQL Editor after review.
-- Idempotent: GRANT is safe to re-run. No RLS, policy or other permission changes.

begin;

grant usage on schema public to service_role;

grant select, insert
on table public.whop_webhook_events
to service_role;

grant select, update
on table public.profiles
to service_role;

commit;

-- Post-migration checks (run manually, read-only):
--   select has_table_privilege('service_role', 'public.profiles', 'SELECT')               as profiles_select,
--          has_table_privilege('service_role', 'public.profiles', 'UPDATE')               as profiles_update,
--          has_table_privilege('service_role', 'public.whop_webhook_events', 'SELECT')    as events_select,
--          has_table_privilege('service_role', 'public.whop_webhook_events', 'INSERT')    as events_insert,
--          has_schema_privilege('service_role', 'public', 'USAGE')                        as schema_usage;
