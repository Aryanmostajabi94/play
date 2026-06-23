import { getSupabaseServerClient } from "./supabaseServer";
import type { BookingWithVenue } from "../types/database";

// TEMPORARY: stands in for the logged-in user until real Supabase Auth
// (a separate P0 item) is wired up. Matches the seed user in
// supabase/seed/0001_seed_venue.sql. Canonical home for this constant —
// app/actions/bookings.ts imports it from here rather than redeclaring it.
// Mirrors TEMP_VENUE_ID in lib/venueBookings.ts — same reasoning, same
// "revisit once auth lands" caveat.
export const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

const BOOKING_WITH_VENUE_SELECT = `
  id, user_id, venue_id, status, booking_type, date, time_slot, party_size,
  occasion, special_requests, notification_channels, cancellation_policy,
  cancellation_window_hrs, confirmation_deadline, confirmed_at, declined_at,
  cancelled_at, cancellation_reason, cancelled_by, user_tier_at_booking, created_at,
  venue:venues ( name, area, price_display, accent_color, cover_image, cancellation_fee_per_person )
`;

// Server-only: used by the booking-status screens (Instant Confirm /
// Request Sent / Booking Detail) at app/(consumer)/booking/[id]/page.tsx.
//
// Uses the service-role client rather than the anon client because the
// `bookings_select_own` RLS policy requires auth.uid() = user_id, and real
// Supabase Auth isn't wired up yet (see TEMP_USER_ID above). Once auth
// lands, this should be revisited to read with the user's own session
// instead.
export async function getBookingById(id: string): Promise<BookingWithVenue | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_WITH_VENUE_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("getBookingById error:", error?.message);
    return null;
  }

  return data as unknown as BookingWithVenue;
}

// C7 Booking History — all of a user's past and upcoming bookings, most
// recent date first. Per Screen Inventory v1.0 ("List of all past and
// upcoming bookings with status badges").
export async function getBookingsForUser(userId: string): Promise<BookingWithVenue[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_WITH_VENUE_SELECT)
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("time_slot", { ascending: false });

  if (error) {
    console.error("getBookingsForUser error:", error.message);
    return [];
  }

  return (data ?? []) as unknown as BookingWithVenue[];
}
