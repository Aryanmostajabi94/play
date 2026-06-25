-- Seed: the remaining 11 venues from Play_V11.jsx's demo catalog.
-- Cove Beach (the 12th) is already seeded in 0001_seed_venue.sql.
--
-- Why: production only ever had that one venue live, which makes Discover,
-- Map, and Saved all look broken/empty next to the V11 reference. This adds
-- the same venue names/descriptions/areas V11 ships with so the real app's
-- grid matches what the V11 file shows, instead of inventing new content.
--
-- Run this in the Supabase SQL editor (same as the other pending seed/
-- migration files) — no destructive statements, safe to re-run (on conflict
-- do nothing).

insert into venues (
  id, name, slug, listing_tier, status, category, area, address, lat, lng,
  description, price_range, price_display, phone, instagram_handle,
  amenities, vibe_tags, play_tags, access_tier, accent_color, cover_image,
  rating, review_count, booking_type, confirmation_window_hrs,
  cancellation_policy, cancellation_fee_per_person, requires_card,
  min_party_size, max_party_size, is_featured
)
values
(
  '00000000-0000-0000-0000-0000000000a2', 'Nobu Dubai', 'nobu-dubai-palm-jumeirah',
  'ghost', 'live', 'finedining', 'Palm Jumeirah', 'Palm Jumeirah, Dubai, UAE',
  25.122000, 55.138000,
  'World-renowned Japanese-Peruvian fusion with an oceanfront terrace dining at its finest.',
  '$$$$', 'AED 450+ pp', null, null,
  array['Dress Code','Reservations','Terrace','Bar'], array['Upscale'], array['Michelin'],
  'insider', '#FFB800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  4.9, 1872, 'request', 4, 'flexible', 0, false, 1, 20, true
),
(
  '00000000-0000-0000-0000-0000000000a3', 'Sunset Sessions', 'sunset-sessions-jbr',
  'ghost', 'live', 'events', 'JBR', 'JBR, Dubai, UAE',
  25.078000, 55.132000,
  'Live DJ sets, fire dancers and craft cocktails against the Arabian Gulf backdrop.',
  '$$', 'AED 200 entry', null, null,
  array['Live DJ','Bar','Sea View','Dance Floor'], array['Lively'], array['This Weekend'],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
  4.7, 934, 'instant', 4, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-0000000000a4', 'Ruya', 'ruya-difc',
  'ghost', 'live', 'restaurants', 'DIFC', 'DIFC, Dubai, UAE',
  25.212000, 55.281000,
  'Authentic Anatolian cuisine, famous for mezze spreads and the fire-lit open kitchen.',
  '$$$', 'AED 180–280 pp', null, null,
  array['Private Rooms','Valet','Terrace','Bar'], array['Upscale'], array['Award Winning'],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  4.8, 1120, 'request', 4, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-0000000000a5', 'WHITE Dubai', 'white-dubai-business-bay',
  'ghost', 'live', 'nightlife', 'Business Bay', 'Meydan Racecourse, Business Bay, Dubai, UAE',
  25.160000, 55.285000,
  'Dubai''s most iconic open-air rooftop club, perched atop Meydan Racecourse.',
  '$$$', 'AED 300 entry', null, null,
  array['Rooftop','VIP Tables','DJ','Dress Code'], array['Lively'], array['Tonight'],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&q=80',
  4.9, 5210, 'request', 4, '24hr', 0, true, 1, 20, true
),
(
  '00000000-0000-0000-0000-0000000000a6', 'STK Brunch', 'stk-brunch-downtown',
  'ghost', 'live', 'brunch', 'Downtown', 'Downtown Dubai, UAE',
  25.197000, 55.274000,
  'The most talked-about Friday brunch in Downtown — live music, steakhouse style.',
  '$$$', 'AED 450 / 650', null, null,
  array['Live Music','Free Flow','Rooftop','Valet'], array['Lively'], array['Selling Fast'],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80',
  4.6, 789, 'request', 4, '48hr', 0, true, 2, 20, false
),
(
  '00000000-0000-0000-0000-0000000000a7', 'Zero Gravity', 'zero-gravity-marina',
  'ghost', 'live', 'beach', 'Marina', 'Skydive Dubai Drop Zone, Dubai Marina, UAE',
  25.071000, 55.133000,
  'Legendary beach and pool club — day parties that evolve into epic sunset sessions.',
  '$$', 'AED 100 min', null, null,
  array['Pool','Skydive Zone','Bar','Restaurant'], array['Lively','Scenic'], array['Day to Night'],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
  4.5, 3102, 'instant', 4, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-0000000000a8', 'Zuma Dubai', 'zuma-dubai-difc',
  'ghost', 'live', 'finedining', 'DIFC', 'Gate Village, DIFC, Dubai, UAE',
  25.213000, 55.283000,
  'Contemporary Japanese izakaya at the heart of DIFC — a Dubai institution since 2008.',
  '$$$$', 'AED 500+ pp', null, null,
  array['Bar','Private Dining','Sushi Bar','Terrace'], array['Upscale'], array['Celebrity Spot'],
  'insider', '#FFB800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  4.9, 4450, 'request', 4, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-0000000000a9', 'Cavalli Club', 'cavalli-club-marina',
  'ghost', 'live', 'nightlife', 'Marina', 'Dubai Marina, UAE',
  25.076000, 55.130000,
  'Roberto Cavalli''s legendary club — the most opulent interior in Dubai nightlife.',
  '$$$', 'AED 250 entry', null, null,
  array['VIP Tables','Dress Code','DJ','Bar'], array['Lively'], array['Iconic'],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
  4.7, 2890, 'request', 4, '24hr', 0, true, 1, 20, false
),
(
  '00000000-0000-0000-0000-0000000000aa', 'Art Dubai 2026', 'art-dubai-2026-jumeirah',
  'ghost', 'live', 'events', 'Jumeirah', 'Madinat Jumeirah, Dubai, UAE',
  25.145000, 55.186000,
  'The region''s leading contemporary art fair returns to Madinat Jumeirah.',
  '$', 'AED 75 / day', null, null,
  array['Guided Tours','VIP Preview','Workshops','Café'], array['Scenic'], array['Coming Up'],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200&q=80',
  4.7, 612, 'instant', 4, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-0000000000ab', 'Private Yacht Brunch', 'private-yacht-brunch-jbr',
  'ghost', 'live', 'exclusive', 'JBR', 'Dubai Marina Yacht Club, JBR, Dubai, UAE',
  25.082000, 55.134000,
  '6-hour private yacht experience — chef-prepared brunch, open bar and DJ on the water.',
  '$$$$', 'Elite Only · AED 1,200 pp', null, null,
  array['Private Yacht','Chef','Open Bar','DJ'], array['Scenic'], array['ELITE'],
  'elite', '#FFB800',
  'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80',
  5.0, 44, 'request', 24, 'non_refundable', 0, true, 2, 12, false
),
(
  '00000000-0000-0000-0000-0000000000ac', 'Billionaire Mansion Night', 'billionaire-mansion-night-palm-jumeirah',
  'ghost', 'live', 'exclusive', 'Palm Jumeirah', 'Palm Jumeirah, Dubai, UAE',
  25.118000, 55.140000,
  'Invite-only private event at Dubai''s most lavish private venue — hosted dinner, open bar, live act.',
  '$$$$', 'Elite Members Only', null, null,
  array['Hosted Dinner','Open Bar','Live Act','Transfer'], array['Upscale'], array['VIP ONLY'],
  'elite', '#FF2D78',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
  5.0, 88, 'request', 24, 'non_refundable', 0, true, 2, 10, false
)
on conflict (id) do nothing;

-- Standard daily availability (10:00–23:00, 30-min slots) for each, same
-- shape as Cove Beach's existing row in 0001_seed_venue.sql.
insert into venue_availability (venue_id, day_of_week, open_time, close_time, slot_duration_mins)
select v.id, d, '10:00', '23:00', 30
from venues v
cross join generate_series(0, 6) as d
where v.id in (
  '00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000a3',
  '00000000-0000-0000-0000-0000000000a4', '00000000-0000-0000-0000-0000000000a5',
  '00000000-0000-0000-0000-0000000000a6', '00000000-0000-0000-0000-0000000000a7',
  '00000000-0000-0000-0000-0000000000a8', '00000000-0000-0000-0000-0000000000a9',
  '00000000-0000-0000-0000-0000000000aa', '00000000-0000-0000-0000-0000000000ab',
  '00000000-0000-0000-0000-0000000000ac'
)
on conflict do nothing;
