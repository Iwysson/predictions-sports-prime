-- Predictions-Sports-Prime: event ordering for Whop webhooks.
-- NOT applied automatically. Run manually in the Supabase SQL Editor after review.
-- Idempotent. Adds the columns the webhook uses to ignore out-of-order events.

begin;

-- Which profile an event was applied to, and the event's own timestamp
-- (the webhook envelope's `timestamp`, documented by Whop).
alter table public.whop_webhook_events
  add column if not exists profile_id uuid,
  add column if not exists event_at timestamptz;

create index if not exists whop_webhook_events_profile_applied_idx
  on public.whop_webhook_events (profile_id, event_at)
  where outcome = 'applied';

commit;
