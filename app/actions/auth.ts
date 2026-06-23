"use server";

import { redirect } from "next/navigation";
import { getSupabaseRouteClient } from "../../lib/supabaseRoute";
import { getSupabaseServerClient } from "../../lib/supabaseServer";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
}

// A3 — Sign Up. Per Screen Inventory: "Create a new Play account. Name,
// email, password, choose tier." Creates the real Supabase Auth user,
// then a matching public.users row (id = auth user id, per the
// users_select_own/users_update_own RLS policies which assume
// auth.uid() = users.id). Tier selection (A5) is handled by the caller
// redirecting into the existing D1 checkout flow for paid tiers — this
// action always creates the row as 'free' and lets the upgrade flow be
// the single place tier changes happen.
export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const tier = String(formData.get("tier") || "free");

  if (!name) return { success: false, error: "Name is required." };
  if (!email) return { success: false, error: "Email is required." };
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = getSupabaseRouteClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error || !data.user) {
    return { success: false, error: error?.message ?? "Could not create your account." };
  }

  // Upsert the matching public.users row — this is the table the rest of
  // the app actually reads (ProfilePage, Account Settings, Billing all
  // query `users`, not `profiles`). Keyed by the authenticated user's own
  // id/email from auth.signUp, not re-derived from form input, so it
  // can't drift from what Supabase Auth actually created.
  //
  // Always the service-role client: `users` has no insert policy (only
  // users_select_own / users_update_own), matching how every other read
  // of this table in the codebase (lib/account.ts, lib/users.ts) already
  // goes through the service-role client rather than RLS.
  //
  // Separately, a DB trigger (handle_new_user) auto-inserts a bare
  // {id, email} row into `profiles` on auth.users insert — that's fine
  // to leave running on its own; nothing in the app reads `profiles`.
  const { error: insertError } = await getSupabaseServerClient().from("users").upsert(
    {
      id: data.user.id,
      name,
      email: data.user.email ?? email,
      tier: "free",
    },
    { onConflict: "id" },
  );

  // Non-fatal: the auth user and confirmation email already exist by
  // this point. Failing the whole signup over this would falsely tell a
  // successfully-registered user their account didn't work, and would
  // also hide the "check your email" step below. Log it server-side
  // (check Vercel's function logs for the real Postgres error) instead
  // of blocking the user on it.
  if (insertError) {
    console.error("signUpAction: users upsert failed (non-fatal):", insertError);
  }

  // No session means the Supabase project requires email confirmation —
  // show a "check your email" state instead of redirecting straight in.
  if (!data.session) {
    return { success: true, needsEmailConfirmation: true };
  }

  if (tier === "insider" || tier === "elite") {
    redirect(`/upgrade/checkout?tier=${tier}`);
  }
  redirect("/");
}

// A4 — Sign In.
export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: "Incorrect email or password." };
  }

  redirect("/");
}

// A4 — "Continue with Google." Requires the Google provider to be
// enabled in the Supabase dashboard (Authentication > Providers) with a
// Google OAuth client id/secret — that's a console step this environment
// can't perform on your behalf, same caveat as the Stripe test keys. The
// code path is otherwise complete: once the provider is on, this just
// works.
export async function signInWithGoogleAction(): Promise<void> {
  const supabase = getSupabaseRouteClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${siteUrl}/auth/callback` },
  });

  if (error || !data.url) {
    redirect("/sign-in?error=google_not_configured");
  }
  redirect(data.url);
}

export async function signOutAction(): Promise<void> {
  const supabase = getSupabaseRouteClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
