"use server";

import { revalidatePath } from "next/cache";
import { TEMP_VENUE_ID } from "../../lib/venueBookings";
import {
  updateStaffName as updateStaffNameImpl,
  addVenueStaff as addVenueStaffImpl,
  removeVenueStaff as removeVenueStaffImpl,
  saveVenueNotificationPrefs as saveVenueNotificationPrefsImpl,
  type VenueNotificationPrefs,
} from "../../lib/venueSettings";

// F8 — Venue Settings.
export async function updateStaffName(
  staffId: string,
  name: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await updateStaffNameImpl(staffId, name);
  if (result.success) revalidatePath("/dashboard/settings");
  return result;
}

export async function addVenueStaff(
  name: string,
  email: string,
  role: "manager" | "host",
): Promise<{ success: boolean; error?: string }> {
  const result = await addVenueStaffImpl(TEMP_VENUE_ID, name, email, role);
  if (result.success) revalidatePath("/dashboard/settings");
  return result;
}

export async function removeVenueStaff(
  staffId: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await removeVenueStaffImpl(staffId);
  if (result.success) revalidatePath("/dashboard/settings");
  return result;
}

export async function saveVenueNotificationPrefs(
  prefs: VenueNotificationPrefs,
): Promise<{ success: boolean; error?: string }> {
  const result = await saveVenueNotificationPrefsImpl(TEMP_VENUE_ID, prefs);
  if (result.success) revalidatePath("/dashboard/settings");
  return result;
}
