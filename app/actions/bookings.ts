"use server";

import { getSupabaseServerClient } from "../../lib/supabaseServer";
import { LARGE_GROUP_THRESHOLD } from "../../types/database";
import type { NotificationChannel } from "../../types/database";

// TEMPORARY: stands in for the logged-in user until real Supabase Auth
// (a separate P0 item) is wired up. Matches the seed user in
// supabase/seed/0001_seed_venue.sql.
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

export interface CreateBookingInput {
  venueId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  partySize: number;
  occasion?: string;
  specialRequests?: string;
  notificationChannels: NotificationChannel[];
}

export interface CreateBookingResult {
  success: boolean;
  bookingId?: string;
  status?: string;
  error?: string;
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  if (!input.date || !input.timeSlot) {
    return { success: false, error: "Date and time are required." };
  }
  if (!input.partySize || input.partySize < 1) {
    return { success: false, error: "Party size is required." };
  }
  if ((input.specialRequests?.length ?? 0) > 280) {
    return { success: false, error: "Special requests must be 280 characters or fewer." };
  }
  if (!input.notificationChannels?.length) {
    return { success: false, error: "Pick at least one notification preference." };
  }

  const supabase = getSupabaseServerClient();

  const { data: venue, error: venueError } = await supabase
    .from("venues")
    .select(
      "id, booking_type, confirmation_window_hrs, cancellation_policy, cancellation_window_hrs, min_party_size, max_party_size",
    )
    .eq("id", input.venueId)
    .single();

  if (venueError || !venue) {
    return { success: false, error: "Venue not found." };
  }

  if (input.partySize < venue.min_party_size) {
    return {
      success: false,
      error: `Minimum party size for this venue is ${venue.min_party_size}.`,
    };
  }

  // Large groups (20+) are request-only regardless of the venue's normal
  // booking_type, per Booking Engine Spec v1.0.
  const isLargeGroup = input.partySize >= LARGE_GROUP_THRESHOLD;
  const bookingType = isLargeGroup ? "request" : venue.booking_type;

  if (bookingType === "none") {
    return { success: false, error: "This venue isn't accepting bookings yet." };
  }

  const status = bookingType === "instant" ? "confirmed" : "pending";
  const confirmationDeadline =
    bookingType === "request"
      ? new Date(
          Date.now() + (venue.confirmation_window_hrs ?? 4) * 60 * 60 * 1000,
        ).toISOString()
      : null;

  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      user_id: TEMP_USER_ID,
      venue_id: input.venueId,
      status,
      booking_type: bookingType,
      date: input.date,
      time_slot: input.timeSlot,
      party_size: input.partySize,
      occasion: input.occasion || null,
      special_requests: input.specialRequests || null,
      notification_channels: input.notificationChannels,
      cancellation_policy: venue.cancellation_policy,
      cancellation_window_hrs: venue.cancellation_window_hrs,
      confirmation_deadline: confirmationDeadline,
      confirmed_at: status === "confirmed" ? new Date().toISOString() : null,
      user_tier_at_booking: "free",
    })
    .select("id, status")
    .single();

  if (insertError || !booking) {
    console.error("createBooking insert error:", insertError?.message);
    return { success: false, error: "Could not create booking. Please try again." };
  }

  return { success: true, bookingId: booking.id, status: booking.status };
}
