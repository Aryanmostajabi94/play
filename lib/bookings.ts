import { getSupabaseServerClient } from "./supabaseServer";
import type { BookingWithVenue } from "../types/database";

// Server-only: used by the booking-status screens (Instant Confirm /
// Request Sent) at app/(consumer)/booking/[id]/page.tsx.
//
// Uses the service-role client rather than the anon client because the
// `bookings_select_own` RLS policy requires auth.uid() = user_id, and real
// Supabase Auth isn't wired up yet (see TEMP_USER_ID in
// app/actions/bookings.ts). Once auth lands, this should be revisited to
// read with the user's own session instead.
export async function getBookingById(id: string): Promise<BookingWithVenue | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, user_id, venue_id, status, booking_type, date, time_slot, party_size,
       occasion, special_requests, notification_channels, cancellation_policy,
       confirmation_deadline, confirmed_at, user_tier_at_booking, created_at,
       venue:venues ( name, area, price_display, accent_color, cover_image )`,
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("getBookingById error:", error?.message);
    return null;
  }

  return data as unknown as BookingWithVenue;
}
