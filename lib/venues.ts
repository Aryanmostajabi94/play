import { supabase } from "./supabase";
import type { DiscoverVenue, Venue } from "../types/database";

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from("venues")
    .select(
      "id, name, slug, area, description, price_display, accent_color, cover_image, rating, booking_type, confirmation_window_hrs, cancellation_policy, cancellation_fee_per_person, requires_card, min_party_size, max_party_size",
    )
    .eq("slug", slug)
    .eq("status", "live")
    .single();

  if (error) {
    console.error("getVenueBySlug error:", error.message);
    return null;
  }

  return data as Venue;
}

// B1 Home/Discover. Per Screen Inventory v1.0: hero, search, category
// filters, venue grid. Pulls every live venue — featured first, then by
// rating — so the grid grows automatically as venues are seeded/claimed
// (currently just the one row from supabase/seed/0001_seed_venue.sql).
export async function listLiveVenues(): Promise<DiscoverVenue[]> {
  const { data, error } = await supabase
    .from("venues")
    .select(
      "id, name, slug, category, area, description, price_display, accent_color, cover_image, rating, review_count, access_tier, play_tags, amenities, is_featured",
    )
    .eq("status", "live")
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("listLiveVenues error:", error.message);
    return [];
  }

  return data as DiscoverVenue[];
}
