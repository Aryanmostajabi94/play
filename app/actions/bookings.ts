"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "../../lib/supabaseServer";
import { requireUserId, requireVerifiedUserId } from "../../lib/auth";
import { LARGE_GROUP_THRESHOLD } from "../../types/database";
import type { NotificationChannel } from "../../types/database";

// Whole-years-old as of today, from a YYYY-MM-DD date_of_birth string.
function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

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
  needsEmailVerification?: boolean;
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

  // A3/A4 — booking on someone's behalf now requires knowing who they
  // actually are; redirects to /sign-in (with a return path) rather than
  // silently attributing the booking to TEMP_USER_ID.
  const { userId, verified } = await requireVerifiedUserId(`/sign-in?next=/book`);

  // Per the new onboarding flow, signup no longer blocks on a confirmed
  // email — verification is deferred to right here, the actual point a
  // booking is created, instead of gating account access entirely.
  if (!verified) {
    return {
      success: false,
      needsEmailVerification: true,
      error: "Please verify your email before booking — check your inbox for the confirmation link.",
    };
  }

  const supabase = getSupabaseServerClient();

  let { data: venue, error: venueError } = await supabase
    .from("venues")
    .select(
      "id, booking_type, confirmation_window_hrs, cancellation_policy, cancellation_window_hrs, min_party_size, max_party_size, min_age",
    )
    .eq("id", input.venueId)
    .single();

  // Fallback for before migration 0004_add_dob_and_age_limit.sql has
  // been applied — min_age won't exist on `venues` yet. Degrade to "no
  // age restriction" rather than failing every booking on this venue.
  if (venueError?.message?.includes("min_age")) {
    const fallback = await supabase
      .from("venues")
      .select(
        "id, booking_type, confirmation_window_hrs, cancellation_policy, cancellation_window_hrs, min_party_size, max_party_size",
      )
      .eq("id", input.venueId)
      .single();
    if (!fallback.error && fallback.data) {
      venue = { ...fallback.data, min_age: null };
      venueError = null;
    }
  }

  if (venueError || !venue) {
    return { success: false, error: "Venue not found." };
  }

  if (input.partySize < venue.min_party_size) {
    return {
      success: false,
      error: `Minimum party size for this venue is ${venue.min_party_size}.`,
    };
  }

  // Age-limit enforcement (migration 0004_add_dob_and_age_limit.sql).
  // venue.min_age is nullable — null means no restriction, so most venues
  // skip this entirely. When set, the user needs date_of_birth on file
  // (collected in onboarding/Account Settings) to prove eligibility; no
  // DOB on file is treated the same as under-age rather than silently
  // letting the booking through.
  if (venue.min_age != null) {
    const { data: userRow, error: userRowError } = await supabase
      .from("users")
      .select("date_of_birth")
      .eq("id", userId)
      .single();

    const dob = !userRowError ? userRow?.date_of_birth : null;
    if (!dob) {
      return {
        success: false,
        error: `This venue requires guests to be ${venue.min_age}+. Add your date of birth in Account Settings to book.`,
      };
    }

    const age = calculateAge(dob);
    if (age < venue.min_age) {
      return {
        success: false,
        error: `This venue requires guests to be ${venue.min_age}+.`,
      };
    }
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
      user_id: userId,
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

export interface CancelBookingResult {
  success: boolean;
  error?: string;
}

// C9 Cancel Booking — cancels a pending/confirmed booking on the user's
// behalf. Eligibility (cancellation_policy / cancellation_window_hrs) is
// checked client-side for the warning shown in BookingDetail (C8); this
// guards server-side only against cancelling a booking that's already in
// a terminal state.
export async function cancelBooking(
  bookingId: string,
  reason?: string,
): Promise<CancelBookingResult> {
  const userId = await requireUserId();
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled_by_user",
      cancelled_at: new Date().toISOString(),
      cancelled_by: "user",
      cancellation_reason: reason || null,
    })
    .eq("id", bookingId)
    .eq("user_id", userId)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    console.error("cancelBooking error:", error.message);
    return { success: false, error: "Could not cancel this booking. Please try again." };
  }

  revalidatePath("/bookings");
  revalidatePath(`/booking/${bookingId}`);
  return { success: true };
}
