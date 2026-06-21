"use server";

import { revalidatePath } from "next/cache";
import { TEMP_VENUE_ID } from "../../lib/venueBookings";
import {
  updateVenueListing,
  type VenueListingUpdate,
} from "../../lib/venueListing";

// F5 Listing Editor — single save action for the whole form.
export async function saveVenueListing(
  updates: VenueListingUpdate,
): Promise<{ success: boolean; error?: string }> {
  const result = await updateVenueListing(TEMP_VENUE_ID, updates);

  if (result.success) {
    revalidatePath("/dashboard/listing");
  }

  return result;
}
