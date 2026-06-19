-- Play v1 — Initial schema
-- Source of truth: Notion "Database Schema v1.0" (last updated Jun 10 2026)
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type user_tier as enum ('free', 'insider', 'elite');
create type subscription_status as enum ('inactive', 'active', 'past_due', 'cancelled');
create type listing_tier as enum ('ghost', 'claimed', 'partner');
create type venue_status as enum ('draft', 'live', 'suspended', 'removed');
create type venue_category as enum ('beach', 'finedining', 'restaurants', 'nightlife', 'brunch', 'events', 'exclusive');
create type booking_type as enum ('instant', 'request', 'none');
create type booking_status as enum ('pending', 'confirmed', 'completed', 'declined', 'expired', 'cancelled_by_user', 'cancelled_by_venue');
create type cancellation_policy as enum ('flexible', '24hr', '48hr', 'non_refundable', 'custom');
create type cancelled_by_type as enum ('user', 'venue');
create type price_range as enum ('$', '$$', '$$$', '$$$$');
create type venue_user_role as enum ('owner', 'manager', 'host');
create type admin_role as enum ('super_admin', 'ops', 'content');
create type verification_status as enum ('pending', 'approved', 'rejected', 'manual_review');
create type description_source as enum ('ai_generated', 'venue_submitted');
create type optional_check_type as enum ('email_domain', 'instagram', 'gps', 'manual');
create type subscription_event_status as enum ('received', 'processed', 'failed');

-- ============================================================
-- 4. venues (created before users/venue_users since they FK into it)
-- ============================================================

create table venues (
  id uuid primary key default gen_random_uuid(),
  name varchar(200) not null,
  slug varchar(200) not null unique,
  listing_tier listing_tier not null default 'ghost',
  status venue_status not null default 'draft',
  category venue_category not null,
  area varchar(100) not null,
  address text,
  lat decimal(10,7),
  lng decimal(10,7),
  description text,
  description_source description_source default 'ai_generated',
  price_range price_range,
  price_display varchar(100),
  phone varchar(20),
  website varchar(500),
  instagram_handle varchar(100),
  whatsapp_number varchar(20),
  amenities text[] default '{}',
  vibe_tags text[] default '{}',
  play_tags text[] default '{}',
  access_tier user_tier not null default 'free',
  accent_color varchar(7) default '#FF2D78',
  cover_image varchar(500),
  images text[] default '{}',
  rating decimal(2,1),
  review_count int default 0,
  quality_score int default 0,
  booking_type booking_type default 'none',
  confirmation_window_hrs int default 4,
  cancellation_policy cancellation_policy default 'flexible',
  cancellation_window_hrs int,
  cancellation_fee_per_person int default 0,
  requires_card boolean default false,
  min_party_size int default 1,
  max_party_size int default 20,
  is_featured boolean default false,
  ai_boost boolean default false,
  data_sources jsonb default '{}',
  last_scraped_at timestamp,
  claimed_at timestamp,
  claimed_by uuid, -- FK to venue_users, added after venue_users exists
  verified_at timestamp,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- ============================================================
-- 1. users
-- ============================================================

create table users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) not null unique,
  name varchar(100) not null,
  phone varchar(20),
  tier user_tier not null default 'free',
  stripe_customer_id varchar(100),
  stripe_subscription_id varchar(100),
  subscription_status subscription_status default 'inactive',
  subscription_expires_at timestamp,
  city varchar(100) default 'Dubai',
  whatsapp_opted_in boolean default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- ============================================================
-- 2. venue_users
-- ============================================================

create table venue_users (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  email varchar(255) not null unique,
  name varchar(100) not null,
  role venue_user_role not null,
  is_active boolean default true,
  last_login_at timestamp,
  created_at timestamp not null default now()
);

alter table venues
  add constraint venues_claimed_by_fkey foreign key (claimed_by) references venue_users(id);

-- ============================================================
-- 3. admin_users
-- ============================================================

create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) not null unique,
  name varchar(100) not null,
  role admin_role not null,
  is_active boolean default true,
  created_at timestamp not null default now()
);

-- ============================================================
-- 5. venue_availability
-- ============================================================

create table venue_availability (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  is_closed boolean default false,
  open_time time,
  close_time time,
  slot_duration_mins int default 30,
  max_party_size int
);

-- ============================================================
-- 6. blackout_dates
-- ============================================================

create table blackout_dates (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  date date not null,
  reason text,
  created_at timestamp not null default now()
);

-- ============================================================
-- 7. bookings — the most important transactional table
-- ============================================================

create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  venue_id uuid not null references venues(id) on delete cascade,
  status booking_status not null default 'pending',
  booking_type booking_type not null,
  date date not null,
  time_slot time not null,
  party_size int not null,
  occasion varchar(50),
  special_requests text check (char_length(special_requests) <= 280),
  notification_channels text[] default '{}',
  cancellation_policy cancellation_policy not null,
  cancellation_window_hrs int,
  confirmation_deadline timestamp,
  confirmed_at timestamp,
  declined_at timestamp,
  cancelled_at timestamp,
  cancellation_reason text,
  cancelled_by cancelled_by_type,
  user_tier_at_booking user_tier not null,
  reminder_sent_at timestamp,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- ============================================================
-- 8. saved_venues
-- ============================================================

create table saved_venues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  venue_id uuid not null references venues(id) on delete cascade,
  created_at timestamp not null default now(),
  unique (user_id, venue_id)
);

-- ============================================================
-- 9. notification_preferences
-- ============================================================

create table notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  in_app_enabled boolean default true,
  email_enabled boolean default true,
  whatsapp_enabled boolean default false,
  reminder_hours_before int default 3,
  weekly_picks_enabled boolean default true,
  elite_drop_enabled boolean default true,
  updated_at timestamp not null default now()
);

-- ============================================================
-- 10. verification_submissions
-- ============================================================

create table verification_submissions (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  submitted_by uuid not null references venue_users(id),
  status verification_status not null default 'pending',
  trade_license_url varchar(500),
  trade_license_verified boolean default false,
  phone_otp_verified boolean default false,
  google_maps_verified boolean default false,
  live_photo_url varchar(500),
  live_photo_verified boolean default false,
  optional_check_used optional_check_type,
  optional_check_verified boolean default false,
  admin_reviewed_by uuid references admin_users(id),
  admin_notes text,
  approved_at timestamp,
  rejected_at timestamp,
  rejection_reason text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- ============================================================
-- 11. subscription_events
-- ============================================================

create table subscription_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  stripe_event_id varchar(100) not null unique,
  event_type varchar(100) not null,
  stripe_customer_id varchar(100),
  tier_before user_tier,
  tier_after user_tier,
  amount int,
  status subscription_event_status not null,
  raw_payload jsonb not null,
  created_at timestamp not null default now()
);

-- ============================================================
-- updated_at auto-update trigger (Developer Note #2)
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at before update on users for each row execute function set_updated_at();
create trigger trg_venues_updated_at before update on venues for each row execute function set_updated_at();
create trigger trg_bookings_updated_at before update on bookings for each row execute function set_updated_at();
create trigger trg_notification_preferences_updated_at before update on notification_preferences for each row execute function set_updated_at();
create trigger trg_verification_submissions_updated_at before update on verification_submissions for each row execute function set_updated_at();

-- ============================================================
-- Realtime — enabled only on bookings (Developer Note #3)
-- ============================================================

alter publication supabase_realtime add table bookings;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table users enable row level security;
alter table venue_users enable row level security;
alter table admin_users enable row level security;
alter table venues enable row level security;
alter table venue_availability enable row level security;
alter table blackout_dates enable row level security;
alter table bookings enable row level security;
alter table saved_venues enable row level security;
alter table notification_preferences enable row level security;
alter table verification_submissions enable row level security;
alter table subscription_events enable row level security;

-- users: read own row only
create policy users_select_own on users for select using (auth.uid() = id);
create policy users_update_own on users for update using (auth.uid() = id);

-- venues: any authenticated user can read live venues; admin-only write
create policy venues_select_live on venues for select using (status = 'live' or auth.role() = 'service_role');
create policy venues_write_admin on venues for all using (auth.role() = 'service_role');

-- venue_availability / blackout_dates: read all, write venue staff + admin
create policy venue_availability_select_all on venue_availability for select using (true);
create policy venue_availability_write_service on venue_availability for all using (auth.role() = 'service_role');

create policy blackout_dates_select_all on blackout_dates for select using (true);
create policy blackout_dates_write_service on blackout_dates for all using (auth.role() = 'service_role');

-- bookings: user reads/writes own bookings; venue users read their venue's bookings; status updates by venue/admin
create policy bookings_select_own on bookings for select using (auth.uid() = user_id);
create policy bookings_insert_own on bookings for insert with check (auth.uid() = user_id);
create policy bookings_write_service on bookings for all using (auth.role() = 'service_role');

-- saved_venues: read/write own
create policy saved_venues_all_own on saved_venues for all using (auth.uid() = user_id);

-- notification_preferences: read/write own
create policy notification_preferences_all_own on notification_preferences for all using (auth.uid() = user_id);

-- verification_submissions, subscription_events, admin_users, venue_users: service role / admin only for now
create policy verification_submissions_service on verification_submissions for all using (auth.role() = 'service_role');
create policy subscription_events_service on subscription_events for all using (auth.role() = 'service_role');
create policy admin_users_service on admin_users for all using (auth.role() = 'service_role');
create policy venue_users_service on venue_users for all using (auth.role() = 'service_role');
