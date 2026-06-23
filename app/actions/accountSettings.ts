"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "../../lib/supabaseServer";
import { requireUserId } from "../../lib/auth";

export interface UpdateAccountInput {
  name: string;
  phone: string;
  city: string;
  avatarUrl: string;
  dateOfBirth?: string; // YYYY-MM-DD, optional — venues with min_age can't be booked without it
}

export interface UpdateAccountResult {
  success: boolean;
  error?: string;
}

// E2 — Account Settings. Per Tasks Tracker: "Edit name, phone number,
// city, avatar." Also the save target for the post-signup onboarding
// step (app/onboarding/profile), which is why date_of_birth lives here
// too rather than a separate action. Writes directly to the `users` row
// for the real signed-in user (see lib/auth.ts).
export async function updateAccount(input: UpdateAccountInput): Promise<UpdateAccountResult> {
  if (!input.name.trim()) {
    return { success: false, error: "Name is required." };
  }

  const userId = await requireUserId();
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("users")
    .update({
      name: input.name.trim(),
      phone: input.phone.trim() || null,
      city: input.city.trim() || "Dubai",
      avatar_url: input.avatarUrl.trim() || null,
      date_of_birth: input.dateOfBirth?.trim() || null,
    })
    .eq("id", userId);

  if (error) {
    console.error("updateAccount error:", error.message);
    if (error.message.includes("avatar_url")) {
      return {
        success: false,
        error: "Couldn't save — the avatar_url column needs migration 0002_add_user_avatar.sql applied in Supabase.",
      };
    }
    if (error.message.includes("date_of_birth")) {
      return {
        success: false,
        error: "Couldn't save — the date_of_birth column needs migration 0004_add_dob_and_age_limit.sql applied in Supabase.",
      };
    }
    return { success: false, error: "Could not save your changes. Please try again." };
  }

  revalidatePath("/settings/account");
  revalidatePath("/onboarding/profile");
  return { success: true };
}
