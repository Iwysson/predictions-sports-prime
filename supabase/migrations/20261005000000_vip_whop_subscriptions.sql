-- Predictions-Sports-Prime: VIP subscription state synchronised from Whop.
-- NOT applied automatically. Review, then run manually in the Supabase SQL Editor.
-- Idempotent: safe to re-run. Existing rows and existing data are preserved.

begin;

-- 1) Subscription columns on public.profiles.
alter table public.profiles
  add column if not exists trial_ends_at timestamptz,
  add column if not exists current_period_end timestamptz,
  add column if not exists whop_membership_id text,
  add column if not exists whop_user_id text,
  add column if not exists whop_plan_id text,
  add column if not exists updated_at timestamptz not null default now();

-- 2) Allowed states. Validated against existing rows: if any row is invalid the
--    whole migration fails and rolls back, leaving the database unchanged.
alter table public.profiles
  drop constraint if exists profiles_plan_check;
alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('free', 'vip'));

alter table public.profiles
  drop constraint if exists profiles_subscription_status_check;
alter table public.profiles
  add constraint profiles_subscription_status_check
  check (
    subscription_status is null
    or subscription_status in ('inactive', 'trialing', 'active', 'canceled', 'expired', 'past_due')
  );

-- 3) One Whop membership maps to at most one profile.
create unique index if not exists profiles_whop_membership_id_key
  on public.profiles (whop_membership_id)
  where whop_membership_id is not null;

-- 4) updated_at maintained by trigger.
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

-- 5) Webhook idempotency ledger. Only the service role (server-side) writes here.
--    payload_keys holds field NAMES only (never values) to confirm the real payload shape.
create table if not exists public.whop_webhook_events (
  event_id text primary key,
  event_type text not null,
  outcome text not null,
  payload_keys text[] not null default '{}',
  received_at timestamptz not null default now()
);

alter table public.whop_webhook_events enable row level security;

-- 6) Clients must never write profiles or the webhook ledger. The only profile
--    policy is SELECT own row; writes happen only through the service role.
revoke insert, update, delete
on public.profiles
from anon, authenticated;

revoke all
on public.whop_webhook_events
from anon, authenticated;

commit;

-- Post-migration checks (run manually, read-only):
--   select plan, subscription_status, count(*) from public.profiles group by 1, 2;
