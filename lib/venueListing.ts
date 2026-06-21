import { getSupabaseServerClient } from "./supabaseServer";
import { TEMP_VENUE_ID } from "./venueBookings";
import type { VenueListingDetail } from "../types/database";

const LISTING_SELECT = `
  id, name, category, area, address, description, price_range, price_display,
  phone, website, instagram_handle, whatsapp_number, amenities, cover_image,
  images, booking_type, confirmation_window_hrs, cancellation_policy,
  cancellation_window_hrs, cancellation_fee_per_person, requires_card,
  min_party_size, max_party_size
`;

// F5 Listing Editor — full editable venue record. See the
// VenueListingDetail type comment for why hours/availability are excluded
// (that's F6's table, not this one).
export async function getVenueListing(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueListingDetail | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("venues")
    .select(LISTING_SELECT)
    .eq("id", venueId)
    .single();

  if (error || !data) {
    console.error("getVenueListing error:", error?.message);
    return null;
  }

  return data as unknown as VenueListingDetail;
}

export type VenueListingUpdate = Partial<Omit<VenueListingDetail, "id">>;

export async function updateVenueListing(
  venueId: string,
  updates: VenueListingUpdate,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.from("venues").update(updates).eq("id", venueId);

  if (error) {
    console.error("updateVenueListing error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
