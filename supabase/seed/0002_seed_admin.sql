-- Seed: one admin user, matching TEMP_ADMIN_ID in lib/admin.ts.
-- Same temporary stand-in pattern as the test consumer user / Cove Beach
-- venue in 0001_seed_venue.sql — there's no Supabase Auth for admins yet,
-- so H3's approve/reject actions need a real admin_users row to stamp
-- admin_reviewed_by with. Replace once real admin auth is built.
-- NOT YET APPLIED to the live database — run alongside the two pending
-- migrations (0002_add_user_avatar.sql, 0003_add_venue_notification_preferences.sql).

insert into admin_users (id, email, name, role)
values (
  '00000000-0000-0000-0000-0000000000ad',
  'admin@play.app',
  'Play Admin',
  'super_admin'
)
on conflict (id) do nothing;
