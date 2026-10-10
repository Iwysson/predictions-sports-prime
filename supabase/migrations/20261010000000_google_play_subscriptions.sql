-- Predictions-Sports-Prime: Google Play (Android app) subscription state, reconciled into
-- public.profiles alongside the existing Whop flow (see 20261005000000_vip_whop_subscriptions.sql).
-- NOT applied automatically. Review, then run manually in the Supabase SQL Editor.
-- Idempotent: safe to re-run. Existing rows and existing data are preserved.
-- This migration does not touch the website's Whop flow in any way.

begin;

-- 1) Which rail last granted/updated entitlement for a profile. Informational only; the
--    source of truth for "is this user VIP right now" stays profiles.plan/subscription_status.
alter table public.profiles
  add column if not exists billing_source text;

alter table public.profiles
  drop constraint if exists profiles_billing_source_check;
alter table public.profiles
  add constraint profiles_billing_source_check
  check (billing_source is null or billing_source in ('whop', 'google_play'));

-- 2) Google Play subscription ledger. One row per purchase token ever seen. Server-only:
--    no client (anon/authenticated) may read or write this table - all access is through
--    the service role from functions/api/google-play/*. Never exposes purchase_token to the app.
create table if not exists public.google_play_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  package_name text not null,
  product_id text not null,
  base_plan_id text,
  purchase_token text not null,
  latest_order_id text,
  subscription_state text not null,
  acknowledgement_state text,
  start_time timestamptz,
  expiry_time timestamptz,
  auto_renew_enabled boolean,
  is_trial boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_verified_at timestamptz
);

-- One purchase token identifies one purchase for its whole lifetime (renewals update the
-- same row via subscriptionsv2.get; they do not create a new token).
create unique index if not exists google_play_subscriptions_purchase_token_key
  on public.google_play_subscriptions (purchase_token);

create index if not exists google_play_subscriptions_user_id_idx
  on public.google_play_subscriptions (user_id);

alter table public.google_play_subscriptions
  drop constraint if exists google_play_subscriptions_state_check;
alter table public.google_play_subscriptions
  add constraint google_play_subscriptions_state_check
  check (
    subscription_state in (
      'SUBSCRIPTION_STATE_UNSPECIFIED',
      'SUBSCRIPTION_STATE_PENDING',
      'SUBSCRIPTION_STATE_ACTIVE',
      'SUBSCRIPTION_STATE_PAUSED',
      'SUBSCRIPTION_STATE_IN_GRACE_PERIOD',
      'SUBSCRIPTION_STATE_ON_HOLD',
      'SUBSCRIPTION_STATE_CANCELED',
      'SUBSCRIPTION_STATE_EXPIRED',
      'SUBSCRIPTION_STATE_REVOKED'
    )
  );

create or replace function public.set_google_play_subscriptions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists google_play_subscriptions_set_updated_at on public.google_play_subscriptions;
create trigger google_play_subscriptions_set_updated_at
  before update on public.google_play_subscriptions
  for each row execute function public.set_google_play_subscriptions_updated_at();

-- 3) RTDN idempotency ledger, mirroring whop_webhook_events. message_id is the Pub/Sub
--    messageId - rejecting a repeat is what makes redelivery (Pub/Sub's at-least-once
--    delivery) safe without double-processing an event.
create table if not exists public.google_play_rtdn_events (
  message_id text primary key,
  notification_type text not null,
  outcome text not null,
  received_at timestamptz not null default now()
);

-- 4) Lock the whole feature down to the service role, same posture as the Whop tables.
alter table public.google_play_subscriptions enable row level security;
alter table public.google_play_rtdn_events enable row level security;

revoke all
on public.google_play_subscriptions
from anon, authenticated;

revoke all
on public.google_play_rtdn_events
from anon, authenticated;

commit;

-- Post-migration checks (run manually, read-only):
--   select subscription_state, count(*) from public.google_play_subscriptions group by 1;
--   select billing_source, plan, subscription_status, count(*) from public.profiles group by 1, 2, 3;
