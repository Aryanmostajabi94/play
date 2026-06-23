"use server";

import { revalidatePath } from "next/cache";
import { TEMP_VENUE_ID } from "../../lib/venueBookings";
import {
  saveWeeklyAvailability as saveWeeklyAvailabilityImpl,
  addBlackoutDate as addBlackoutDateImpl,
  removeBlackoutDate as removeBlackoutDateImpl,
  type DayAvailability,
} from "../../lib/venueAvailability";

// F6 — Availability Manager.
export async function saveWeeklyAvailability(
  days: DayAvailability[],
): Promise<{ success: boolean; error?: string }> {
  const result = await saveWeeklyAvailabilityImpl(TEMP_VENUE_ID, days);

  if (result.success) {
    revalidatePath("/dashboard/availability");
  }

  return result;
}

export async function addBlackoutDate(
  date: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await addBlackoutDateImpl(TEMP_VENUE_ID, date, reason);

  if (result.success) {
    revalidatePath("/dashboard/availability");
  }

  return result;
}

export async function removeBlackoutDate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await removeBlackoutDateImpl(id);

  if (result.success) {
    revalidatePath("/dashboard/availability");
  }

  return result;
}
