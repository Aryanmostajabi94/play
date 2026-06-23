-- F8 — Venue Settings needs a venue-level notification preferences
-- store. notification_preferences (added for E1) is scoped to user_id
-- only (consumer side) — there's no equivalent for venue staff alerts
-- (new booking requests, cancellations) yet. Mirrors notification_preferences'
-- shape, scoped to venue_id instead of user_id.
create table if not exists venue_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null unique references venues(id) on delete cascade,
  new_request_email boolean default true,
  new_request_whatsapp boolean default true,
  cancellation_email boolean default true,
  daily_summary_email boolean default false,
  updated_at timestamp not null default now()
);

alter table venue_notification_preferences enable row level security;

create policy venue_notification_preferences_service on venue_notification_preferences
  for all using (auth.role() = 'service_role');
