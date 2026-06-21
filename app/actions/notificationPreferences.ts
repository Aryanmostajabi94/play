"use server";

import { revalidatePath } from "next/cache";
import { TEMP_USER_ID } from "../../lib/bookings";
import {
  updateNotificationPreferences,
  type NotificationPreferencesUpdate,
} from "../../lib/notificationPreferences";

// E1 Notification Preferences — single save action for the whole form.
export async function saveNotificationPreferences(
  updates: NotificationPreferencesUpdate,
): Promise<{ success: boolean; error?: string }> {
  const result = await updateNotificationPreferences(TEMP_USER_ID, updates);

  if (result.success) {
    revalidatePath("/settings/notifications");
  }

  return result;
}
