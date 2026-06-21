import { getSupabaseServerClient } from "./supabaseServer";
import { TEMP_USER_ID } from "./bookings";
import type { NotificationPreferences } from "../types/database";

// Defaults mirror the column defaults in
// supabase/migrations/0001_init_schema.sql (notification_preferences table)
// — used when a user has no row yet, since the seed data doesn't create one
// for TEMP_USER_ID.
const DEFAULT_PREFERENCES: Omit<NotificationPreferences, "user_id" | "updated_at"> = {
  in_app_enabled: true,
  email_enabled: true,
  whatsapp_enabled: false,
  reminder_hours_before: 3,
  weekly_picks_enabled: true,
  elite_drop_enabled: true,
};

// E1 Notification Preferences — read the user's row, or fall back to
// schema defaults if one doesn't exist yet (no real signup flow has run).
export async function getNotificationPreferences(
  userId: string = TEMP_USER_ID,
): Promise<NotificationPreferences> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getNotificationPreferences error:", error.message);
  }

  if (!data) {
    return {
      user_id: userId,
      updated_at: new Date().toISOString(),
      ...DEFAULT_PREFERENCES,
    };
  }

  return data as NotificationPreferences;
}

export type NotificationPreferencesUpdate = Partial<
  Omit<NotificationPreferences, "user_id" | "updated_at">
>;

// Upserts since the row may not exist yet (see getNotificationPreferences).
export async function updateNotificationPreferences(
  userId: string,
  updates: NotificationPreferencesUpdate,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("notification_preferences")
    .upsert(
      {
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

  if (error) {
    console.error("updateNotificationPreferences error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
