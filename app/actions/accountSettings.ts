"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "../../lib/supabaseServer";
import { requireUserId } from "../../lib/auth";

export interface UpdateAccountInput {
  name: string;
  phone: string;
  city: string;
  avatarUrl: string;
}

export interface UpdateAccountResult {
  success: boolean;
  error?: string;
}

// E2 — Account Settings. Per Tasks Tracker: "Edit name, phone number,
// city, avatar." Writes directly to the `users` row for the real
// signed-in user (see lib/auth.ts).
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
    })
    .eq("id", userId);

  if (error) {
    console.error("updateAccount error:", error.message);
    return {
      success: false,
      error: error.message.includes("avatar_url")
        ? "Couldn't save — the avatar_url column needs migration 0002_add_user_avatar.sql applied in Supabase."
        : "Could not save your changes. Please try again.",
    };
  }

  revalidatePath("/settings/account");
  return { success: true };
}
