import { getSupabaseServerClient } from "./supabaseServer";

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string;
  avatar_url: string | null;
  date_of_birth: string | null;
}

// E2 — Account Settings, plus the new post-signup onboarding step
// (app/onboarding/profile) reads/writes this same row.
export async function getAccountProfile(userId: string): Promise<AccountProfile | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, phone, city, avatar_url, date_of_birth")
    .eq("id", userId)
    .single();

  if (!error && data) {
    return data as AccountProfile;
  }

  // Fallback for before migration 0002_add_user_avatar.sql /
  // 0004_add_dob_and_age_limit.sql have been applied — avatar_url /
  // date_of_birth won't exist on `users` yet. Degrade gracefully rather
  // than failing the whole settings page.
  if (error?.message?.includes("avatar_url") || error?.message?.includes("date_of_birth")) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("users")
      .select("id, name, email, phone, city")
      .eq("id", userId)
      .single();

    if (!fallbackError && fallbackData) {
      return { ...fallbackData, avatar_url: null, date_of_birth: null } as AccountProfile;
    }
  }

  console.error("getAccountProfile error:", error?.message);
  return null;
}
