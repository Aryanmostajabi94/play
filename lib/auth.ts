import { redirect } from "next/navigation";
import { getSupabaseRouteClient } from "./supabaseRoute";

export interface CurrentUser {
  id: string;
  email: string | null;
}

// A3/A4 — the real signed-in user, read from the session cookie via
// lib/supabaseRoute.ts. Returns null when signed out — callers decide
// whether that's an error (requireUserId) or just a different UI state
// (e.g. the home header showing Sign In / Sign Up).
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = getSupabaseRouteClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

// For pages/actions that require a signed-in user — redirects to Sign In
// (with a `next` param so the user lands back where they started) rather
// than silently falling back to a temp/seed id the way every screen did
// before real auth existed.
export async function requireUserId(redirectTo: string = "/sign-in"): Promise<string> {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return user.id;
}
