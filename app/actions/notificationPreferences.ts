"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "../../lib/auth";
import {
  updateNotificationPreferences,
  type NotificationPreferencesUpdate,
} from "../../lib/notificationPreferences";

// E1 Notification Preferences — single save action for the whole form.
export async function saveNotificationPreferences(
  updates: NotificationPreferencesUpdate,
): Promise<{ success: boolean; error?: string }> {
  const userId = await requireUserId();
  const result = await updateNotificationPreferences(userId, updates);

  if (result.success) {
    revalidatePath("/settings/notifications");
  }

  return result;
}
