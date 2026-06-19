import { supabase } from "./supabase";
import type { Venue } from "../types/database";

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
