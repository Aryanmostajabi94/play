import { getSupabaseServerClient } from "./supabaseServer";
import type { BookingStatus, UserTier } from "../types/database";

// Section H — Admin Panel (Play Internal). Like venue accounts, there's
// no Supabase Auth wiring for admins either, so every read/write here
// goes through the service-role client (bypasses RLS, which is
// service-role-only on admin_users/venue_users/verification_submissions
// anyway — see supabase/migrations/0001_init_schema.sql). TEMP_ADMIN_ID
// stands in for "the logged-in admin" until real admin auth lands —
// matches the seed row in supabase/seed/0002_seed_admin.sql (not yet
// applied to the live DB, same as the two pending migrations).
export const TEMP_ADMIN_ID = "00000000-0000-0000-0000-0000000000ad";

// ============================================================
// H1 — Admin Home
// ============================================================

export interface AdminOverview {
  totalVenues: number;
  liveVenues: number;
  ghostVenues: number;
  totalBookings: number;
  pendingBookings: number;
  totalSubscribers: number; // tier in (insider, elite)
  pendingVerifications: number; // status in (pending, manual_review)
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = getSupabaseServerClient();

  const [venues, bookings, subscribers, verifications] = await Promise.all([
    supabase.from("venues").select("listing_tier, status"),
    supabase.from("bookings").select("status"),
    supabase.from("users").select("tier"),
    supabase.from("verification_submissions").select("status"),
  ]);

  const venueRows = venues.data ?? [];
  const bookingRows = bookings.data ?? [];
  const userRows = subscribers.data ?? [];
  const verificationRows = verifications.data ?? [];

  return {
    totalVenues: venueRows.length,
    liveVenues: venueRows.filter((v) => v.status === "live").length,
    ghostVenues: venueRows.filter((v) => v.listing_tier === "ghost").length,
    totalBookings: bookingRows.length,
    pendingBookings: bookingRows.filter((b) => b.status === "pending").length,
    totalSubscribers: userRows.filter((u) => u.tier !== "free").length,
    pendingVerifications: verificationRows.filter(
      (v) => v.status === "pending" || v.status === "manual_review",
    ).length,
  };
}

// ============================================================
// H2 — Venue Management
// ============================================================

export interface AdminVenueRow {
  id: string;
  name: string;
  area: string;
  category: string;
  listing_tier: "ghost" | "claimed" | "partner";
  status: "draft" | "live" | "suspended" | "removed";
  created_at: string;
}

export async function listVenuesAdmin(filters: {
  tier?: string;
  status?: string;
} = {}): Promise<AdminVenueRow[]> {
  const supabase = getSupabaseServerClient();
  let q = supabase
    .from("venues")
    .select("id, name, area, category, listing_tier, status, created_at")
    .order("created_at", { ascending: false });

  if (filters.tier) q = q.eq("listing_tier", filters.tier);
  if (filters.status) q = q.eq("status", filters.status);

  const { data, error } = await q;
  if (error) {
    console.error("listVenuesAdmin error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function updateVenueStatusAdmin(
  venueId: string,
  status: "draft" | "live" | "suspended" | "removed",
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("venues").update({ status }).eq("id", venueId);
  if (error) {
    console.error("updateVenueStatusAdmin error:", error.message);
    return { success: false, error: "Could not update venue status." };
  }
  return { success: true };
}

// ============================================================
// H3 — Verification Queue
// ============================================================

export interface AdminVerificationRow {
  id: string;
  venue_id: string;
  venue_name: string;
  status: string;
  trade_license_verified: boolean;
  phone_otp_verified: boolean;
  google_maps_verified: boolean;
  live_photo_verified: boolean;
  optional_check_used: string | null;
  optional_check_verified: boolean;
  admin_notes: string | null;
  created_at: string;
}

// Per Tasks Tracker: "List of pending manual verification submissions" —
// scoped to pending + manual_review (the ones actually needing admin
// eyes); approved/rejected submissions have already been actioned.
export async function listVerificationQueue(): Promise<AdminVerificationRow[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("verification_submissions")
    .select(
      `id, venue_id, status, trade_license_verified, phone_otp_verified,
       google_maps_verified, live_photo_verified, optional_check_used,
       optional_check_verified, admin_notes, created_at,
       venue:venues ( name )`,
    )
    .in("status", ["pending", "manual_review"])
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listVerificationQueue error:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    venue_id: row.venue_id,
    venue_name: row.venue?.name ?? "Unknown venue",
    status: row.status,
    trade_license_verified: row.trade_license_verified,
    phone_otp_verified: row.phone_otp_verified,
    google_maps_verified: row.google_maps_verified,
    live_photo_verified: row.live_photo_verified,
    optional_check_used: row.optional_check_used,
    optional_check_verified: row.optional_check_verified,
    admin_notes: row.admin_notes,
    created_at: row.created_at,
  }));
}

export async function approveVerification(
  submissionId: string,
  notes: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  const { data: submission, error: fetchError } = await supabase
    .from("verification_submissions")
    .select("venue_id")
    .eq("id", submissionId)
    .single();

  if (fetchError || !submission) {
    return { success: false, error: "Submission not found." };
  }

  const { error } = await supabase
    .from("verification_submissions")
    .update({
      status: "approved",
      admin_reviewed_by: TEMP_ADMIN_ID,
      admin_notes: notes || null,
      approved_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) {
    console.error("approveVerification error:", error.message);
    return { success: false, error: "Could not approve." };
  }

  await supabase
    .from("venues")
    .update({ listing_tier: "claimed", verified_at: new Date().toISOString() })
    .eq("id", submission.venue_id);

  return { success: true };
}

export async function rejectVerification(
  submissionId: string,
  reason: string,
  notes: string,
): Promise<{ success: boolean; error?: string }> {
  if (!reason.trim()) {
    return { success: false, error: "A rejection reason is required." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("verification_submissions")
    .update({
      status: "rejected",
      admin_reviewed_by: TEMP_ADMIN_ID,
      admin_notes: notes || null,
      rejection_reason: reason.trim(),
      rejected_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) {
    console.error("rejectVerification error:", error.message);
    return { success: false, error: "Could not reject." };
  }

  return { success: true };
}

// ============================================================
// H4 — Booking Overview
// ============================================================

export interface AdminBookingRow {
  id: string;
  venue_name: string;
  guest_name: string;
  status: BookingStatus;
  date: string;
  time_slot: string;
  party_size: number;
}

export async function listBookingsAdmin(filters: {
  status?: string;
  venueId?: string;
  date?: string;
} = {}): Promise<AdminBookingRow[]> {
  const supabase = getSupabaseServerClient();
  let q = supabase
    .from("bookings")
    .select(
      `id, status, date, time_slot, party_size,
       venue:venues ( name ), user:users ( name )`,
    )
    .order("date", { ascending: false })
    .limit(200);

  if (filters.status) q = q.eq("status", filters.status);
  if (filters.venueId) q = q.eq("venue_id", filters.venueId);
  if (filters.date) q = q.eq("date", filters.date);

  const { data, error } = await q;
  if (error) {
    console.error("listBookingsAdmin error:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    venue_name: row.venue?.name ?? "Unknown venue",
    guest_name: row.user?.name ?? "Unknown guest",
    status: row.status,
    date: row.date,
    time_slot: row.time_slot,
    party_size: row.party_size,
  }));
}

// ============================================================
// H5 — User Management
// ============================================================

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  tier: UserTier;
  city: string;
  created_at: string;
}

export async function listUsersAdmin(filters: { tier?: string } = {}): Promise<AdminUserRow[]> {
  const supabase = getSupabaseServerClient();
  let q = supabase
    .from("users")
    .select("id, name, email, tier, city, created_at")
    .order("created_at", { ascending: false });

  if (filters.tier) q = q.eq("tier", filters.tier);

  const { data, error } = await q;
  if (error) {
    console.error("listUsersAdmin error:", error.message);
    return [];
  }
  return data ?? [];
}

export interface AdminUserBookingSummary {
  id: string;
  venue_name: string;
  status: BookingStatus;
  date: string;
  time_slot: string;
}

export async function getUserBookingHistoryAdmin(userId: string): Promise<AdminUserBookingSummary[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, status, date, time_slot, venue:venues ( name )")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getUserBookingHistoryAdmin error:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    venue_name: row.venue?.name ?? "Unknown venue",
    status: row.status,
    date: row.date,
    time_slot: row.time_slot,
  }));
}
