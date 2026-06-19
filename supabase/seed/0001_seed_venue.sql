-- Seed: one real, live venue + one test consumer user.
-- The test user stands in for real auth (not built yet) so the Booking Form
-- has somewhere to attach bookings to. Replace with real Supabase Auth users
-- once the auth system (P0 item) is built.

insert into users (id, email, name, tier, city)
values (
  '00000000-0000-0000-0000-000000000001',
  'test.user@play.app',
  'Test User',
  'free',
  'Dubai'
)
on conflict (id) do nothing;

insert into venues (
  id, name, slug, listing_tier, status, category, area, address, lat, lng,
  description, price_range, price_display, phone, instagram_handle,
  amenities, vibe_tags, play_tags, access_tier, accent_color, cover_image,
  rating, review_count, booking_type, confirmation_window_hrs,
  cancellation_policy, cancellation_fee_per_person, requires_card,
  min_party_size, max_party_size, is_featured
)
values (
  '00000000-0000-0000-0000-0000000000a1',
  'Cove Beach',
  'cove-beach-bluewaters',
  'claimed',
  'live',
  'beach',
  'Bluewaters',
  'Bluewaters Island, Dubai, UAE',
  25.073000,
  55.130000,
  'A beachfront club with daybeds, an infinity pool, and a DJ booth that gets going by mid-afternoon.',
  '$$$',
  'AED 150 min spend',
  '+971501234567',
  'covebeachdubai',
  array['Pool','Bar','Restaurant','Cabanas','DJ'],
  array['Lively','Scenic'],
  array['Trending'],
  'free',
  '#00D4FF',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  4.8,
  2341,
  'instant',
  4,
  'flexible',
  0,
  false,
  1,
  20,
  true
)
on conflict (id) do nothing;

-- Standard daily hours, 30-min slots, every day of the week.
insert into venue_availability (venue_id, day_of_week, open_time, close_time, slot_duration_mins)
select '00000000-0000-0000-0000-0000000000a1', d, '10:00', '23:00', 30
from generate_series(0, 6) as d
on conflict do nothing;
