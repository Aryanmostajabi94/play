import { getSupabaseServerClient } from "./supabaseServer";
import { TEMP_VENUE_ID } from "./venueBookings";

export const MAX_VENUE_STAFF = 5;

export interface VenueStaffMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "host";
  is_active: boolean;
}

export interface VenueNotificationPrefs {
  new_request_email: boolean;
  new_request_whatsapp: boolean;
  cancellation_email: boolean;
  daily_summary_email: boolean;
}

const DEFAULT_PREFS: VenueNotificationPrefs = {
  new_request_email: true,
  new_request_whatsapp: true,
  cancellation_email: true,
  daily_summary_email: false,
};

export interface VenueBillingInfo {
  listingTier: "ghost" | "claimed" | "partner";
}

// F8 — Venue Settings: "account details" for a venue is really the owner
// venue_users row (name + email) — venue-level fields like name/phone
// already belong to F5's Listing Editor (lib/venueListing.ts), so this
// intentionally doesn't duplicate them.
export async function getVenueOwner(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueStaffMember | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("venue_users")
    .select("id, name, email, role, is_active")
    .eq("venue_id", venueId)
    .eq("role", "owner")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getVenueOwner error:", error.message);
    return null;
  }

  return (data as VenueStaffMember) ?? null;
}

export async function updateStaffName(
  staffId: string,
  name: string,
): Promise<{ success: boolean; error?: string }> {
  if (!name.trim()) {
    return { success: false, error: "Name is required." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("venue_users")
    .update({ name: name.trim() })
    .eq("id", staffId);

  if (error) {
    console.error("updateStaffName error:", error.message);
    return { success: false, error: "Could not save." };
  }

  return { success: true };
}

export async function getVenueStaff(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueStaffMember[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("venue_users")
    .select("id, name, email, role, is_active")
    .eq("venue_id", venueId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getVenueStaff error:", error.message);
    return [];
  }

  return (data as VenueStaffMember[]) ?? [];
}

// Per Tasks Tracker: "staff management (max 5 venue_users)" — enforced
// here since there's no DB-level constraint on venue_users.
export async function addVenueStaff(
  venueId: string,
  name: string,
  email: string,
  role: "manager" | "host",
): Promise<{ success: boolean; error?: string }> {
  if (!name.trim() || !email.trim()) {
    return { success: false, error: "Name and email are required." };
  }

  const supabase = getSupabaseServerClient();

  const { count } = await supabase
    .from("venue_users")
    .select("id", { count: "exact", head: true })
    .eq("venue_id", venueId);

  if ((count ?? 0) >= MAX_VENUE_STAFF) {
    return { success: false, error: `Venues can have at most ${MAX_VENUE_STAFF} staff accounts.` };
  }

  const { error } = await supabase.from("venue_users").insert({
    venue_id: venueId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    is_active: true,
  });

  if (error) {
    console.error("addVenueStaff error:", error.message);
    return {
      success: false,
      error: error.message.includes("unique") ? "That email is already in use." : "Could not add staff member.",
    };
  }

  return { success: true };
}

export async function removeVenueStaff(
  staffId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("venue_users").delete().eq("id", staffId);

  if (error) {
    console.error("removeVenueStaff error:", error.message);
    return { success: false, error: "Could not remove staff member." };
  }

  return { success: true };
}

// Graceful fallback for before migration 0003 has been applied, same
// pattern as lib/account.ts's avatar_url handling — degrade rather than
// fail the whole settings page.
export async function getVenueNotificationPrefs(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueNotificationPrefs> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("venue_notification_preferences")
    .select("new_request_email, new_request_whatsapp, cancellation_email, daily_summary_email")
    .eq("venue_id", venueId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getVenueNotificationPrefs error:", error.message);
    return DEFAULT_PREFS;
  }

  return data as VenueNotificationPrefs;
}

export async function saveVenueNotificationPrefs(
  venueId: string,
  prefs: VenueNotificationPrefs,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("venue_notification_preferences")
    .upsert({ venue_id: venueId, ...prefs, updated_at: new Date().toISOString() }, { onConflict: "venue_id" });

  if (error) {
    console.error("saveVenueNotificationPrefs error:", error.message);
    return {
      success: false,
      error: error.message.includes("venue_notification_preferences")
        ? "Couldn't save — migration 0003_add_venue_notification_preferences.sql needs to be applied in Supabase."
        : "Could not save your changes.",
    };
  }

  return { success: true };
}

// Billing for venues isn't Stripe-subscription based like consumer tiers
// (D3) — it's the free listing_tier ladder (ghost → claimed → partner).
// Reads the real column rather than inventing new state.
export async function getVenueBillingInfo(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueBillingInfo> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("venues")
    .select("listing_tier")
    .eq("id", venueId)
    .single();

  if (error || !data) {
    console.error("getVenueBillingInfo error:", error?.message);
    return { listingTier: "claimed" };
  }

  return { listingTier: data.listing_tier };
}
