-- Seed: ~48 additional real, well-known Dubai venues across all 7
-- categories (beach, finedining, restaurants, nightlife, brunch, events,
-- exclusive), on top of the 12 V11 demo venues already seeded in
-- 0001_seed_venue.sql / 0003_seed_v11_catalog.sql.
--
-- Why: the user wants the Discover/Map/Saved grid to reflect actual
-- places in Dubai, not just the 12 fictional/demo venues V11 ships with.
-- There's no Google Places/Foursquare API key wired up yet, so this batch
-- is generated from Claude's own knowledge of real, well-known Dubai
-- venues rather than pulled from a live API — names, areas, and category
-- are real, but exact ratings, review counts, prices, coordinates, and
-- cover images are approximate placeholders (description_source defaults
-- to 'ai_generated' per the schema), the same way a scraped/unverified
-- listing would look before anyone touches it.
--
-- listing_tier = 'ghost' + status = 'live' on all of these, same pattern
-- as 0003: visible and bookable-looking in the consumer feed, but with no
-- venue_users row attached, so any real owner can find and claim their
-- listing through the existing G2 "Find Your Listing" flow
-- (lib/venueClaim.ts -> searchGhostVenues) and correct/expand the details
-- at that point. Once a real Places/Foursquare integration exists, this
-- file should be superseded rather than relied on long-term.
--
-- Run this in the Supabase SQL editor, same as 0001/0003 — no destructive
-- statements, safe to re-run (on conflict do nothing).

insert into venues (
  id, name, slug, listing_tier, status, category, area, address, lat, lng,
  description, price_range, price_display, phone, instagram_handle,
  amenities, vibe_tags, play_tags, access_tier, accent_color, cover_image,
  rating, review_count, booking_type, confirmation_window_hrs,
  cancellation_policy, cancellation_fee_per_person, requires_card,
  min_party_size, max_party_size, is_featured
)
values
-- ===================== BEACH =====================
(
  '00000000-0000-0000-0000-000000000101', 'Nikki Beach Dubai', 'nikki-beach-dubai-pearl-jumeirah',
  'ghost', 'live', 'beach', 'Pearl Jumeirah', 'Pearl Jumeirah, Dubai, UAE',
  25.2230000, 55.2640000,
  'The Dubai outpost of the global beach club brand — daybeds, a lively pool scene, and a Sunday brunch crowd that goes late.',
  '$$$', 'AED 200 min spend', null, null,
  array['Pool','Bar','Restaurant','Daybeds','DJ'], array['Lively','Scenic'], array['Trending'],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80',
  4.6, 1540, 'request', 4, 'flexible', 0, true, 2, 20, true
),
(
  '00000000-0000-0000-0000-000000000102', 'Barasti Beach', 'barasti-beach-dubai-marina',
  'ghost', 'live', 'beach', 'Marina', 'Le Méridien Mina Seyahi, Dubai Marina, UAE',
  25.0950000, 55.1530000,
  'Dubai''s original beach bar — a sprawling wooden deck right on the sand, known for sunset drinks and a younger crowd.',
  '$$', 'No min spend', null, null,
  array['Beach Bar','Live Music','Sea View','Sports Screens'], array['Lively'], array['Tonight'],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80',
  4.5, 3210, 'instant', 2, 'flexible', 0, false, 1, 20, true
),
(
  '00000000-0000-0000-0000-000000000103', 'Drift Beach Dubai', 'drift-beach-dubai-palm-jumeirah',
  'ghost', 'live', 'beach', 'Palm Jumeirah', 'One&Only Royal Mirage, Palm Jumeirah, Dubai, UAE',
  25.1010000, 55.1640000,
  'A quieter, more upscale beach club with private cabanas, calm water, and views across to the Marina skyline.',
  '$$$', 'AED 250 min spend', null, null,
  array['Cabanas','Pool','Bar','Sea View'], array['Upscale','Scenic'], array['Selling Fast'],
  'insider', '#FF2D78',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
  4.7, 980, 'request', 4, '24hr', 0, true, 2, 16, false
),
(
  '00000000-0000-0000-0000-000000000104', 'Bla Bla Dubai', 'bla-bla-dubai-jbr',
  'ghost', 'live', 'beach', 'JBR', 'JBR, Dubai, UAE',
  25.0770000, 55.1340000,
  'Beachfront sports bar and lounge with a big screens-and-shisha crowd by day, live bands and DJs by night.',
  '$$', 'No min spend', null, null,
  array['Sports Screens','Live Music','Shisha','Bar'], array['Lively'], array['This Weekend'],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
  4.3, 1670, 'instant', 2, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-000000000105', 'Sunset Beach Lounge', 'sunset-beach-lounge-jumeirah',
  'ghost', 'live', 'beach', 'Jumeirah', 'Jumeirah Beach Hotel, Jumeirah, Dubai, UAE',
  25.1410000, 55.1860000,
  'Relaxed daytime beach lounge in the shadow of the Burj Al Arab — sun loungers, light bites, and calm water.',
  '$$', 'AED 150 min spend', null, null,
  array['Loungers','Bar','Sea View'], array['Scenic'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  4.4, 612, 'instant', 4, 'flexible', 0, false, 1, 20, false
),
-- ===================== FINE DINING =====================
(
  '00000000-0000-0000-0000-000000000106', 'La Petite Maison', 'la-petite-maison-difc',
  'ghost', 'live', 'finedining', 'DIFC', 'Gate Village, DIFC, Dubai, UAE',
  25.2110000, 55.2800000,
  'A DIFC institution — French-Mediterranean cooking, a buzzy courtyard terrace, and a reservations list that fills up fast.',
  '$$$$', 'AED 400+ pp', null, null,
  array['Terrace','Valet','Reservations Recommended'], array['Upscale'], array['Award Winning'],
  'insider', '#FFB800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  4.7, 2010, 'request', 4, 'flexible', 0, false, 2, 12, true
),
(
  '00000000-0000-0000-0000-000000000107', 'Coya Dubai', 'coya-dubai-four-seasons-jumeirah',
  'ghost', 'live', 'finedining', 'Jumeirah Beach', 'Four Seasons Resort Dubai at Jumeirah Beach, UAE',
  25.1930000, 55.2450000,
  'Peruvian fine dining with a late-night bar scene — pisco cocktails, ceviche, and a DJ that takes over after dinner.',
  '$$$$', 'AED 450+ pp', null, null,
  array['Bar','Live DJ','Terrace','Dress Code'], array['Upscale','Lively'], array['Trending'],
  'insider', '#FF2D78',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
  4.6, 1430, 'request', 4, '24hr', 0, true, 2, 16, false
),
(
  '00000000-0000-0000-0000-000000000108', 'Hakkasan Dubai', 'hakkasan-dubai-difc',
  'ghost', 'live', 'finedining', 'DIFC', 'Emirates Towers, DIFC, Dubai, UAE',
  25.2180000, 55.2820000,
  'Michelin-recognised Cantonese cooking in a moody, lantern-lit dining room — a long-running DIFC favourite for special occasions.',
  '$$$$', 'AED 400+ pp', null, null,
  array['Private Rooms','Bar','Dress Code'], array['Upscale'], array['Michelin'],
  'insider', '#FF2D78',
  'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&q=80',
  4.7, 1190, 'request', 4, 'flexible', 0, false, 2, 14, false
),
(
  '00000000-0000-0000-0000-000000000109', 'Pierchic', 'pierchic-madinat-jumeirah',
  'ghost', 'live', 'finedining', 'Madinat Jumeirah', 'Al Qasr, Madinat Jumeirah, Dubai, UAE',
  25.1330000, 55.1830000,
  'Seafood restaurant on a private pier over the water, with the Burj Al Arab lit up just across the bay — one of the most-photographed tables in Dubai.',
  '$$$$', 'AED 500+ pp', null, null,
  array['Overwater','Sea View','Dress Code','Valet'], array['Upscale','Scenic'], array['Award Winning'],
  'insider', '#00D4FF',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80',
  4.8, 1760, 'request', 8, '48hr', 100, true, 2, 10, true
),
(
  '00000000-0000-0000-0000-000000000110', 'Tresind Studio', 'tresind-studio-palm-jumeirah',
  'ghost', 'live', 'finedining', 'Palm Jumeirah', 'The Pointe, Palm Jumeirah, Dubai, UAE',
  25.1160000, 55.1340000,
  'Multi-Michelin-starred tasting-menu experience reinventing Indian cuisine course by course — one of the hardest tables in the city to get.',
  '$$$$', 'AED 950 tasting menu', null, null,
  array['Tasting Menu','Reservations Required','Sommelier'], array['Upscale'], array['Michelin'],
  'elite', '#FFB800',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  4.9, 540, 'request', 24, 'non_refundable', 200, true, 2, 8, true
),
(
  '00000000-0000-0000-0000-000000000111', 'Cipriani Dubai', 'cipriani-dubai-difc',
  'ghost', 'live', 'finedining', 'DIFC', 'DIFC, Dubai, UAE',
  25.2130000, 55.2790000,
  'Classic Venetian-Italian dining and people-watching on a sun-drenched terrace in the heart of DIFC.',
  '$$$$', 'AED 400+ pp', null, null,
  array['Terrace','Valet','Bar'], array['Upscale'], array[]::text[],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  4.5, 980, 'request', 4, 'flexible', 0, false, 2, 14, false
),
(
  '00000000-0000-0000-0000-000000000112', 'At.mosphere', 'at-mosphere-burj-khalifa',
  'ghost', 'live', 'finedining', 'Downtown', 'Burj Khalifa, Downtown Dubai, UAE',
  25.1972000, 55.2744000,
  'Fine dining on the 122nd floor of the Burj Khalifa — the views are the main event, the menu is built to match.',
  '$$$$', 'AED 600+ pp', null, null,
  array['Views','Dress Code','Reservations Required'], array['Upscale','Scenic'], array['Bucket List'],
  'insider', '#FFB800',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  4.6, 2870, 'request', 24, '48hr', 0, true, 2, 10, true
),
(
  '00000000-0000-0000-0000-000000000113', 'BOCA Dubai', 'boca-dubai-difc',
  'ghost', 'live', 'finedining', 'DIFC', 'Indigo Icon Tower, DIFC, Dubai, UAE',
  25.2105000, 55.2785000,
  'Spanish tapas and natural wine in a relaxed, low-lit room — a favourite for long, unhurried dinners.',
  '$$$', 'AED 250–350 pp', null, null,
  array['Wine List','Small Plates','Bar'], array['Upscale'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80',
  4.6, 670, 'request', 4, 'flexible', 0, false, 2, 12, false
),
(
  '00000000-0000-0000-0000-000000000114', 'Armani/Ristorante', 'armani-ristorante-burj-khalifa',
  'ghost', 'live', 'finedining', 'Downtown', 'Armani Hotel Dubai, Burj Khalifa, Downtown Dubai, UAE',
  25.1958000, 55.2750000,
  'Refined Italian dining inside the Armani Hotel at the base of the Burj Khalifa, with Dubai Fountain views.',
  '$$$$', 'AED 450+ pp', null, null,
  array['Fountain View','Dress Code','Valet'], array['Upscale','Scenic'], array[]::text[],
  'insider', '#FFB800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
  4.6, 740, 'request', 8, '48hr', 0, true, 2, 10, false
),
-- ===================== RESTAURANTS =====================
(
  '00000000-0000-0000-0000-000000000115', 'La Cantine du Faubourg', 'la-cantine-du-faubourg-difc',
  'ghost', 'live', 'restaurants', 'DIFC', 'Gate Village, DIFC, Dubai, UAE',
  25.2113000, 55.2802000,
  'French brasserie classics by day, a packed bar scene by night — one of DIFC''s longest-running see-and-be-seen spots.',
  '$$$', 'AED 250–350 pp', null, null,
  array['Bar','Terrace','Live DJ (Fri)'], array['Lively','Upscale'], array['Trending'],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  4.5, 1280, 'request', 4, 'flexible', 0, false, 2, 14, false
),
(
  '00000000-0000-0000-0000-000000000116', 'SUSHISAMBA Dubai', 'sushisamba-dubai-difc',
  'ghost', 'live', 'restaurants', 'DIFC', 'ICD Brookfield Place, DIFC, Dubai, UAE',
  25.2140000, 55.2825000,
  'Japanese-Brazilian-Peruvian fusion with a rooftop terrace and one of the city''s most photogenic dining rooms.',
  '$$$$', 'AED 350+ pp', null, null,
  array['Rooftop','Bar','Terrace'], array['Upscale','Lively'], array['Trending'],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80',
  4.5, 1640, 'request', 4, 'flexible', 0, false, 2, 16, false
),
(
  '00000000-0000-0000-0000-000000000117', 'Asia Asia', 'asia-asia-madinat-jumeirah',
  'ghost', 'live', 'restaurants', 'Madinat Jumeirah', 'Madinat Jumeirah, Dubai, UAE',
  25.1320000, 55.1850000,
  'Pan-Asian dining with sweeping waterway views across Madinat Jumeirah, and a popular post-dinner lounge scene.',
  '$$$', 'AED 250–350 pp', null, null,
  array['Waterway View','Bar','Terrace'], array['Lively'], array[]::text[],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&q=80',
  4.4, 1310, 'request', 4, 'flexible', 0, false, 2, 16, false
),
(
  '00000000-0000-0000-0000-000000000118', 'Bombay Bustle', 'bombay-bustle-difc',
  'ghost', 'live', 'restaurants', 'DIFC', 'Gate Village, DIFC, Dubai, UAE',
  25.2116000, 55.2798000,
  'Colonial-era Bombay-inspired dining room with train-carriage booths and modern Indian small plates.',
  '$$$', 'AED 250–300 pp', null, null,
  array['Bar','Reservations Recommended'], array['Upscale'], array[]::text[],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80',
  4.6, 890, 'request', 4, 'flexible', 0, false, 2, 12, false
),
(
  '00000000-0000-0000-0000-000000000119', '3Fils', '3fils-jumeirah-fishing-harbour',
  'ghost', 'live', 'restaurants', 'Jumeirah', 'Jumeirah Fishing Harbour, Dubai, UAE',
  25.2030000, 55.2440000,
  'Tiny waterside Japanese-inspired spot that punches well above its size — a long-time local favourite, no reservations for walk-ins.',
  '$$', 'AED 150–220 pp', null, null,
  array['Waterfront','Walk-ins Welcome'], array['Casual'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
  4.7, 1050, 'instant', 2, 'flexible', 0, false, 1, 10, false
),
(
  '00000000-0000-0000-0000-000000000120', 'Ossiano', 'ossiano-atlantis-the-palm',
  'ghost', 'live', 'restaurants', 'Palm Jumeirah', 'Atlantis The Palm, Palm Jumeirah, Dubai, UAE',
  25.1304000, 55.1172000,
  'Seafood-focused fine dining set against a floor-to-ceiling aquarium window inside Atlantis The Palm.',
  '$$$$', 'AED 600+ pp', null, null,
  array['Aquarium View','Dress Code','Reservations Required'], array['Upscale','Scenic'], array['Bucket List'],
  'insider', '#FFB800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  4.7, 920, 'request', 24, '48hr', 150, true, 2, 8, false
),
(
  '00000000-0000-0000-0000-000000000121', 'Maya Modern Mexican Kitchen', 'maya-modern-mexican-le-royal-meridien',
  'ghost', 'live', 'restaurants', 'Marina', 'Le Royal Méridien Beach Resort, Dubai Marina, UAE',
  25.0890000, 55.1450000,
  'Chef Richard Sandoval''s modern Mexican menu with a lively bar and beachfront terrace seating.',
  '$$$', 'AED 250–300 pp', null, null,
  array['Terrace','Bar','Sea View'], array['Lively'], array[]::text[],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  4.4, 760, 'request', 4, 'flexible', 0, false, 2, 14, false
),
(
  '00000000-0000-0000-0000-000000000122', 'Reform Social & Grill', 'reform-social-grill-the-lakes',
  'ghost', 'live', 'restaurants', 'The Lakes', 'The Lakes, Dubai, UAE',
  25.0700000, 55.1700000,
  'Neighbourhood British-grill spot popular with residents of the Lakes/Meadows community for weekend lunches and grills.',
  '$$', 'AED 150–220 pp', null, null,
  array['Garden Seating','Family Friendly'], array['Casual'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  4.3, 540, 'instant', 2, 'flexible', 0, false, 1, 16, false
),
(
  '00000000-0000-0000-0000-000000000123', 'Lowe', 'lowe-al-quoz',
  'ghost', 'live', 'restaurants', 'Al Quoz', 'Al Quoz, Dubai, UAE',
  25.1390000, 55.2280000,
  'Warehouse-district favourite serving modern share-style plates with an emphasis on seasonal, local produce.',
  '$$', 'AED 150–200 pp', null, null,
  array['Industrial Setting','Brunch Spot'], array['Casual'], array[]::text[],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80',
  4.5, 480, 'instant', 2, 'flexible', 0, false, 1, 12, false
),
-- ===================== NIGHTLIFE =====================
(
  '00000000-0000-0000-0000-000000000124', 'Soho Garden', 'soho-garden-meydan',
  'ghost', 'live', 'nightlife', 'Meydan', 'Meydan Racecourse, Dubai, UAE',
  25.1600000, 55.3100000,
  'Sprawling multi-venue nightlife complex at Meydan — outdoor club, garden lounge, and regular international DJ bookings.',
  '$$$', 'AED 250 entry', null, null,
  array['Outdoor','VIP Tables','DJ'], array['Lively'], array['Tonight'],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&q=80',
  4.5, 2870, 'request', 4, '24hr', 0, true, 1, 20, true
),
(
  '00000000-0000-0000-0000-000000000125', 'Armani/Privé', 'armani-prive-burj-khalifa',
  'ghost', 'live', 'nightlife', 'Downtown', 'Armani Hotel Dubai, Burj Khalifa, Downtown Dubai, UAE',
  25.1955000, 55.2748000,
  'Members-leaning nightclub inside the Armani Hotel — sleek, dressy, and one of Downtown''s longest-running late-night spots.',
  '$$$$', 'AED 300+ entry', null, null,
  array['VIP Tables','Dress Code','DJ'], array['Upscale','Lively'], array[]::text[],
  'insider', '#FF2D78',
  'https://images.unsplash.com/photo-1571266028243-d220c6e8d8d8?w=1200&q=80',
  4.5, 1340, 'request', 4, '24hr', 0, true, 2, 14, false
),
(
  '00000000-0000-0000-0000-000000000126', 'The Penthouse', 'the-penthouse-five-palm-jumeirah',
  'ghost', 'live', 'nightlife', 'Palm Jumeirah', 'FIVE Palm Jumeirah, Dubai, UAE',
  25.1080000, 55.1380000,
  'Rooftop nightclub and lounge atop FIVE Palm Jumeirah, known for its pool deck and high-energy late nights.',
  '$$$', 'AED 250 entry', null, null,
  array['Rooftop','Pool','VIP Tables','DJ'], array['Lively'], array['Trending'],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&q=80',
  4.6, 2120, 'request', 4, '24hr', 0, true, 1, 20, true
),
(
  '00000000-0000-0000-0000-000000000127', 'Maddox NYC', 'maddox-nyc-jbr',
  'ghost', 'live', 'nightlife', 'JBR', 'JBR, Dubai, UAE',
  25.0775000, 55.1325000,
  'New York-styled nightclub on JBR''s beachfront strip — bottle service, resident DJs, and a younger late-night crowd.',
  '$$$', 'AED 200 entry', null, null,
  array['Bottle Service','DJ','Dance Floor'], array['Lively'], array[]::text[],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1571266028243-d220c6e8d8d8?w=1200&q=80',
  4.3, 980, 'request', 4, '24hr', 0, true, 1, 20, false
),
(
  '00000000-0000-0000-0000-000000000128', 'Brass Monkey', 'brass-monkey-madinat-jumeirah',
  'ghost', 'live', 'nightlife', 'Madinat Jumeirah', 'Madinat Jumeirah, Dubai, UAE',
  25.1315000, 55.1845000,
  'British-style pub and late-night bar with live sport, DJs on weekends, and a reliably busy beer garden.',
  '$$', 'No entry fee', null, null,
  array['Beer Garden','Live Sport','DJ (weekends)'], array['Lively','Casual'], array[]::text[],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
  4.4, 1420, 'instant', 2, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-000000000129', 'Mercury Lounge', 'mercury-lounge-studio-one-hotel',
  'ghost', 'live', 'nightlife', 'Al Barsha', 'Studio One Hotel, Al Barsha, Dubai, UAE',
  25.1100000, 55.1980000,
  'Pool-deck lounge and nightclub at Studio One Hotel — known for themed nights and a loyal regular crowd.',
  '$$', 'AED 150 entry', null, null,
  array['Pool','DJ','Bottle Service'], array['Lively'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1571266028243-d220c6e8d8d8?w=1200&q=80',
  4.2, 760, 'request', 4, '24hr', 0, true, 1, 16, false
),
(
  '00000000-0000-0000-0000-000000000130', 'Base Dubai', 'base-dubai-meydan',
  'ghost', 'live', 'nightlife', 'Meydan', 'The Theatre by Avalon, Meydan, Dubai, UAE',
  25.1610000, 55.3120000,
  'Large-format nightclub and concert venue at Meydan hosting touring international DJs and big production nights.',
  '$$$', 'AED 300+ entry', null, null,
  array['Live Acts','VIP Tables','DJ','Large Capacity'], array['Lively'], array['This Weekend'],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&q=80',
  4.5, 1680, 'request', 4, '24hr', 0, true, 1, 20, false
),
(
  '00000000-0000-0000-0000-000000000131', 'Boudoir', 'boudoir-le-royal-meridien',
  'ghost', 'live', 'nightlife', 'Marina', 'Le Royal Méridien Beach Resort, Dubai Marina, UAE',
  25.0885000, 55.1455000,
  'French cabaret-styled nightclub with live performers, a long-running fixture on the Marina nightlife circuit.',
  '$$$', 'AED 200 entry', null, null,
  array['Live Performers','VIP Tables','DJ'], array['Upscale','Lively'], array[]::text[],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1571266028243-d220c6e8d8d8?w=1200&q=80',
  4.3, 690, 'request', 4, '24hr', 0, true, 1, 16, false
),
-- ===================== BRUNCH =====================
(
  '00000000-0000-0000-0000-000000000132', 'Bubbalicious Brunch', 'bubbalicious-brunch-madinat-jumeirah',
  'ghost', 'live', 'brunch', 'Madinat Jumeirah', 'Madinat Jumeirah, Dubai, UAE',
  25.1325000, 55.1855000,
  'Long-running, high-energy Friday brunch with free-flow bubbles and a poolside party atmosphere.',
  '$$$', 'AED 495 / 695', null, null,
  array['Free Flow','Pool Access','Live DJ'], array['Lively'], array['Selling Fast'],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80',
  4.5, 1340, 'request', 4, '48hr', 0, true, 2, 20, true
),
(
  '00000000-0000-0000-0000-000000000133', 'Toro Toro Brunch', 'toro-toro-brunch-grosvenor-house',
  'ghost', 'live', 'brunch', 'Marina', 'Grosvenor House, Dubai Marina, UAE',
  25.0775000, 55.1395000,
  'Latin American sharing-style Saturday brunch with a rooftop terrace and live percussion.',
  '$$$', 'AED 450 / 600', null, null,
  array['Rooftop','Live Music','Free Flow'], array['Lively'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  4.6, 720, 'request', 4, '48hr', 0, true, 2, 16, false
),
(
  '00000000-0000-0000-0000-000000000134', 'Bread Street Kitchen Brunch', 'bread-street-kitchen-brunch-atlantis',
  'ghost', 'live', 'brunch', 'Palm Jumeirah', 'Atlantis The Palm, Palm Jumeirah, Dubai, UAE',
  25.1300000, 55.1175000,
  'Gordon Ramsay''s Friday brunch at Atlantis The Palm — family-friendly by day, with waterpark access add-ons.',
  '$$$', 'AED 495 / 695', null, null,
  array['Family Friendly','Waterpark Access (optional)','Free Flow'], array['Lively'], array[]::text[],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  4.5, 880, 'request', 4, '48hr', 0, true, 2, 20, false
),
(
  '00000000-0000-0000-0000-000000000135', 'Folly Brunch', 'folly-brunch-madinat-jumeirah',
  'ghost', 'live', 'brunch', 'Madinat Jumeirah', 'Madinat Jumeirah, Dubai, UAE',
  25.1305000, 55.1825000,
  'Relaxed, garden-set Saturday brunch from Folly by Nick & Scott — lighter, more food-focused than the party brunches nearby.',
  '$$', 'AED 350 / 450', null, null,
  array['Garden Seating','Free Flow (optional)'], array['Casual'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80',
  4.4, 410, 'request', 4, 'flexible', 0, false, 2, 14, false
),
(
  '00000000-0000-0000-0000-000000000136', 'AOC Brunch', 'aoc-brunch-difc',
  'ghost', 'live', 'brunch', 'DIFC', 'DIFC, Dubai, UAE',
  25.2118000, 55.2808000,
  'French wine-bar brunch in DIFC — smaller and quieter than the big party brunches, built around food and natural wine.',
  '$$$', 'AED 395 / 545', null, null,
  array['Wine List','Indoor Seating'], array['Upscale'], array[]::text[],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  4.5, 360, 'request', 4, 'flexible', 0, false, 2, 12, false
),
(
  '00000000-0000-0000-0000-000000000137', 'La Brasserie Brunch', 'la-brasserie-brunch-renaissance-downtown',
  'ghost', 'live', 'brunch', 'Downtown', 'Renaissance Downtown Hotel, Dubai, UAE',
  25.1860000, 55.2660000,
  'Easygoing hotel-restaurant Friday brunch popular with Downtown residents for its value and relaxed pace.',
  '$$', 'AED 295 / 395', null, null,
  array['Free Flow (optional)','Family Friendly'], array['Casual'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80',
  4.2, 290, 'instant', 2, 'flexible', 0, false, 1, 16, false
),
-- ===================== EVENTS =====================
(
  '00000000-0000-0000-0000-000000000138', 'Dubai World Cup', 'dubai-world-cup-meydan',
  'ghost', 'live', 'events', 'Meydan', 'Meydan Racecourse, Dubai, UAE',
  25.1590000, 55.3110000,
  'The world''s richest horse race day — fashion, fine dining marquees, and a star-studded crowd at Meydan Racecourse.',
  '$$$$', 'AED 500+ entry', null, null,
  array['Live Racing','Fine Dining','Dress Code'], array['Upscale','Lively'], array['This Weekend'],
  'insider', '#FFB800',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80',
  4.8, 3400, 'request', 24, 'non_refundable', 200, true, 2, 20, true
),
(
  '00000000-0000-0000-0000-000000000139', 'Global Village', 'global-village-dubailand',
  'ghost', 'live', 'events', 'Dubailand', 'Dubai Land Residence Complex, Dubai, UAE',
  25.0695000, 55.3060000,
  'Seasonal cultural and entertainment park (typically open Oct–Apr) with international pavilions, rides, and nightly shows.',
  '$', 'AED 25 entry', null, null,
  array['Family Friendly','Live Shows','Shopping'], array['Lively'], array[]::text[],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
  4.6, 8900, 'instant', 1, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-000000000140', 'Sole DXB', 'sole-dxb-dubai-design-district',
  'ghost', 'live', 'events', 'Dubai Design District', 'Dubai Design District (d3), Dubai, UAE',
  25.1880000, 55.3150000,
  'Annual streetwear, music, and culture festival in d3 — sneaker drops, live performances, and panel talks.',
  '$$', 'AED 100 entry', null, null,
  array['Live Music','Vendors','Talks'], array['Lively'], array['Seasonal'],
  'free', '#FF2D78',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
  4.5, 1240, 'instant', 2, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-000000000141', 'Dubai Jazz Festival', 'dubai-jazz-festival-media-city',
  'ghost', 'live', 'events', 'Dubai Media City', 'Dubai Media City Amphitheatre, Dubai, UAE',
  25.0940000, 55.1610000,
  'Annual open-air jazz and live-music festival drawing international headliners to an outdoor amphitheatre.',
  '$$$', 'AED 250+ entry', null, null,
  array['Live Music','Outdoor','Food Trucks'], array['Lively'], array['Seasonal'],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80',
  4.6, 1980, 'request', 24, '48hr', 0, true, 1, 20, false
),
(
  '00000000-0000-0000-0000-000000000142', 'Dubai Shopping Festival', 'dubai-shopping-festival-citywide',
  'ghost', 'live', 'events', 'Citywide', 'Multiple locations, Dubai, UAE',
  25.2048000, 55.2708000,
  'Annual citywide retail festival with mall promotions, fireworks, and entertainment across Dubai''s main shopping districts.',
  '$', 'Free entry', null, null,
  array['Fireworks','Shopping','Family Friendly'], array['Lively'], array['Seasonal'],
  'free', '#00D4FF',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
  4.4, 4500, 'instant', 1, 'flexible', 0, false, 1, 20, false
),
(
  '00000000-0000-0000-0000-000000000143', 'Taste of Dubai', 'taste-of-dubai-media-city',
  'ghost', 'live', 'events', 'Dubai Media City', 'Dubai Media City Amphitheatre, Dubai, UAE',
  25.0945000, 55.1615000,
  'Annual outdoor food festival bringing together dozens of Dubai restaurants for tasting-size dishes and live cooking demos.',
  '$$', 'AED 150 entry', null, null,
  array['Food Stalls','Live Cooking','Outdoor'], array['Lively'], array['Seasonal'],
  'free', '#FFB800',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80',
  4.5, 1320, 'instant', 2, 'flexible', 0, false, 1, 20, false
),
-- ===================== EXCLUSIVE =====================
(
  '00000000-0000-0000-0000-000000000144', 'Buddha-Bar Beach Dubai', 'buddha-bar-beach-dubai-jumeirah',
  'ghost', 'live', 'exclusive', 'Jumeirah', 'Jumeirah Beach, Dubai, UAE',
  25.1420000, 55.1870000,
  'Members-leaning beachfront lounge with the global Buddha-Bar sound and a dressier, more exclusive door policy than nearby beach clubs.',
  '$$$$', 'AED 500 min spend', null, null,
  array['Beach Access','VIP Tables','Door Policy'], array['Upscale','Lively'], array['VIP'],
  'elite', '#FF2D78',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80',
  4.6, 410, 'request', 24, 'non_refundable', 200, true, 2, 10, false
),
(
  '00000000-0000-0000-0000-000000000145', 'Twiggy by La Cantine', 'twiggy-by-la-cantine-bluewaters',
  'ghost', 'live', 'exclusive', 'Bluewaters', 'Bluewaters Island, Dubai, UAE',
  25.0790000, 55.1190000,
  'Exclusive rooftop restaurant and bar on Bluewaters with sweeping views of Ain Dubai and the Marina skyline.',
  '$$$$', 'AED 450+ pp', null, null,
  array['Rooftop','Views','Dress Code'], array['Upscale','Scenic'], array['Trending'],
  'elite', '#00D4FF',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80',
  4.7, 520, 'request', 24, '48hr', 150, true, 2, 10, true
),
(
  '00000000-0000-0000-0000-000000000146', 'AURA Skypool', 'aura-skypool-palm-jumeirah',
  'ghost', 'live', 'exclusive', 'Palm Jumeirah', 'Address Beach Resort, Palm Jumeirah, Dubai, UAE',
  25.1140000, 55.1370000,
  'The world''s highest 360-degree infinity pool, with a strict capacity cap and entry-fee-credited dining — Dubai''s most exclusive pool day.',
  '$$$$', 'AED 595 entry (credited to F&B)', null, null,
  array['Infinity Pool','Views','Limited Capacity'], array['Upscale','Scenic'], array['VIP'],
  'elite', '#FFB800',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80',
  4.8, 690, 'request', 24, 'non_refundable', 300, true, 1, 6, true
),
(
  '00000000-0000-0000-0000-000000000147', 'Cé La Vi Dubai', 'ce-la-vi-dubai-address-sky-view',
  'ghost', 'live', 'exclusive', 'Downtown', 'Address Sky View, Downtown Dubai, UAE',
  25.1900000, 55.2790000,
  'Sky-high rooftop bar and restaurant linking two towers with a glass skybridge, overlooking the Burj Khalifa and fountain.',
  '$$$$', 'AED 450+ pp', null, null,
  array['Rooftop','Burj Khalifa View','Dress Code'], array['Upscale','Scenic'], array['Bucket List'],
  'elite', '#FF2D78',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  4.7, 1080, 'request', 24, '48hr', 150, true, 2, 10, true
),
(
  '00000000-0000-0000-0000-000000000148', 'Tape Dubai', 'tape-dubai-four-seasons-difc',
  'ghost', 'live', 'exclusive', 'DIFC', 'Four Seasons Hotel DIFC, Dubai, UAE',
  25.2160000, 55.2840000,
  'Intimate, members-club-style nightspot inside the Four Seasons DIFC — known for a tightly managed guest list and a fashion-forward crowd.',
  '$$$$', 'AED 350+ entry', null, null,
  array['Door Policy','VIP Tables','DJ'], array['Upscale','Lively'], array['VIP'],
  'elite', '#FFB800',
  'https://images.unsplash.com/photo-1571266028243-d220c6e8d8d8?w=1200&q=80',
  4.5, 380, 'request', 24, 'non_refundable', 200, true, 2, 10, false
)
on conflict (id) do nothing;

-- Standard daily availability (10:00–23:00, 30-min slots), same shape as
-- the existing seeded venues. Event-type venues (Dubai World Cup, Global
-- Village, etc.) get this too for consistency, even though in practice
-- they're date-bound rather than daily-recurring — fine for now since
-- there's no separate "one-off event date" concept in the schema yet.
insert into venue_availability (venue_id, day_of_week, open_time, close_time, slot_duration_mins)
select v.id, d, '10:00', '23:00', 30
from venues v
cross join generate_series(0, 6) as d
where v.id in (
  '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000106',
  '00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000108',
  '00000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000110',
  '00000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000112',
  '00000000-0000-0000-0000-000000000113', '00000000-0000-0000-0000-000000000114',
  '00000000-0000-0000-0000-000000000115', '00000000-0000-0000-0000-000000000116',
  '00000000-0000-0000-0000-000000000117', '00000000-0000-0000-0000-000000000118',
  '00000000-0000-0000-0000-000000000119', '00000000-0000-0000-0000-000000000120',
  '00000000-0000-0000-0000-000000000121', '00000000-0000-0000-0000-000000000122',
  '00000000-0000-0000-0000-000000000123', '00000000-0000-0000-0000-000000000124',
  '00000000-0000-0000-0000-000000000125', '00000000-0000-0000-0000-000000000126',
  '00000000-0000-0000-0000-000000000127', '00000000-0000-0000-0000-000000000128',
  '00000000-0000-0000-0000-000000000129', '00000000-0000-0000-0000-000000000130',
  '00000000-0000-0000-0000-000000000131', '00000000-0000-0000-0000-000000000132',
  '00000000-0000-0000-0000-000000000133', '00000000-0000-0000-0000-000000000134',
  '00000000-0000-0000-0000-000000000135', '00000000-0000-0000-0000-000000000136',
  '00000000-0000-0000-0000-000000000137', '00000000-0000-0000-0000-000000000138',
  '00000000-0000-0000-0000-000000000139', '00000000-0000-0000-0000-000000000140',
  '00000000-0000-0000-0000-000000000141', '00000000-0000-0000-0000-000000000142',
  '00000000-0000-0000-0000-000000000143', '00000000-0000-0000-0000-000000000144',
  '00000000-0000-0000-0000-000000000145', '00000000-0000-0000-0000-000000000146',
  '00000000-0000-0000-0000-000000000147', '00000000-0000-0000-0000-000000000148'
)
on conflict do nothing;
