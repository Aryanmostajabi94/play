import { cache } from "react";
import { getSupabaseServerClient } from "./supabaseServer";
import type { VenueBookingRow, VenueDashboardSummary } from "../types/database";

// TEMPORARY: stands in for the logged-in venue staff member until real
// venue auth (Section G — Claim & Verification Flow) is built. Matches the
// seed venue in supabase/seed/0001_seed_venue.sql.
// Mirrors TEMP_USER_ID in app/actions/bookings.ts — same reasoning, same
// "revisit once auth lands" caveat.
export const TEMP_VENUE_ID = "00000000-0000-0000-0000-0000000000a1";

const BOOKING_ROW_SELECT = `
  id, date, time_slot, party_size, occasion, special_requests, status,
  confirmation_deadline, user_tier_at_booking,
  user:users ( name )
`;

function toVenueBookingRow(row: any): VenueBookingRow {
  return {
    id: row.id,
    date: row.date,
    time_slot: row.time_slot,
    party_size: row.party_size,
    occasion: row.occasion,
    special_requests: row.special_requests,
    status: row.status,
    confirmation_deadline: row.confirmation_deadline,
    user_tier_at_booking: row.user_tier_at_booking,
    guest_name: row.user?.name ?? "Guest",
  };
}

// F2 Pending Requests — sorted by confirmation deadline, soonest first,
// per Booking Engine Spec v1.0 section 5 ("List sorted by confirmation
// deadline (soonest first)").
export async function getPendingRequests(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueBookingRow[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_ROW_SELECT)
    .eq("venue_id", venueId)
    .eq("status", "pending")
    .order("confirmation_deadline", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("getPendingRequests error:", error.message);
    return [];
  }

  return (data ?? []).map(toVenueBookingRow);
}

// F3 Upcoming Bookings — all confirmed bookings for the next 14 days,
// soonest first. Per Screen Inventory v1.0: "All confirmed bookings for
// next 14 days. Guest details, tier badge, special requests."
export async function getUpcomingBookings(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueBookingRow[]> {
  const supabase = getSupabaseServerClient();

  const today = new Date().toISOString().slice(0, 10);
  const twoWeeksOut = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_ROW_SELECT)
    .eq("venue_id", venueId)
    .eq("status", "confirmed")
    .gte("date", today)
    .lte("date", twoWeeksOut)
    .order("date", { ascending: true })
    .order("time_slot", { ascending: true });

  if (error) {
    console.error("getUpcomingBookings error:", error.message);
    return [];
  }

  return (data ?? []).map(toVenueBookingRow);
}

// F1 Venue Dashboard Home — today's bookings, pending count, week summary.
// Wrapped in React's cache() so the shared (venue) layout and the
// dashboard page (both calling this per request) hit Supabase once, not
// twice, for the same render.
export const getDashboardSummary = cache(async function getDashboardSummary(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueDashboardSummary> {
  const supabase = getSupabaseServerClient();

  const today = new Date().toISOString().slice(0, 10);
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [venueRes, todayRes, pendingCountRes, weekConfirmedRes, weekPendingRes] =
    await Promise.all([
      supabase.from("venues").select("name").eq("id", venueId).single(),
      supabase
        .from("bookings")
        .select(BOOKING_ROW_SELECT)
        .eq("venue_id", venueId)
        .eq("date", today)
        .in("status", ["confirmed", "pending"])
        .order("time_slot", { ascending: true }),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("venue_id", venueId)
        .eq("status", "pending"),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("venue_id", venueId)
        .eq("status", "confirmed")
        .gte("date", today)
        .lte("date", weekFromNow),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("venue_id", venueId)
        .eq("status", "pending")
        .gte("date", today)
        .lte("date", weekFromNow),
    ]);

  return {
    venueName: venueRes.data?.name ?? "Your venue",
    todayBookings: (todayRes.data ?? []).map(toVenueBookingRow),
    pendingRequestCount: pendingCountRes.count ?? 0,
    weekConfirmedCount: weekConfirmedRes.count ?? 0,
    weekPendingCount: weekPendingRes.count ?? 0,
  };
});
