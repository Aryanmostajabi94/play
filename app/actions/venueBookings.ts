"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "../../lib/supabaseServer";

export interface VenueActionResult {
  success: boolean;
  error?: string;
}

// Confirm/Decline a pending request, per Booking Engine Spec v1.0 section 5:
// "Actions: Confirm / Decline (with optional reason)."
export async function confirmBookingRequest(
  bookingId: string,
): Promise<VenueActionResult> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("status", "pending"); // guard against double-actioning an already-resolved request

  if (error) {
    console.error("confirmBookingRequest error:", error.message);
    return { success: false, error: "Could not confirm this request. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/requests");
  return { success: true };
}

export async function declineBookingRequest(
  bookingId: string,
  reason?: string,
): Promise<VenueActionResult> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "declined",
      declined_at: new Date().toISOString(),
      cancellation_reason: reason || null,
    })
    .eq("id", bookingId)
    .eq("status", "pending");

  if (error) {
    console.error("declineBookingRequest error:", error.message);
    return { success: false, error: "Could not decline this request. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/requests");
  return { success: true };
}
