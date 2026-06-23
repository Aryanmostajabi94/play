import { redirect } from "next/navigation";
import { getSupabaseRouteClient } from "./supabaseRoute";

export interface CurrentUser {
  id: string;
  email: string | null;
  emailConfirmedAt: string | null;
}

// A3/A4 — the real signed-in user, read from the session cookie via
// lib/supabaseRoute.ts. Returns null when signed out — callers decide
// whether that's an error (requireUserId) or just a different UI state
// (e.g. the home header showing Sign In / Sign Up).
//
// emailConfirmedAt comes straight off the Supabase auth user
// (email_confirmed_at) — signup no longer blocks on this (see
// app/actions/auth.ts / app/onboarding/profile), so it's surfaced here
// instead, for requireVerifiedUserId below to gate on at booking time.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = getSupabaseRouteClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    emailConfirmedAt: data.user.email_confirmed_at ?? null,
  };
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

export interface VerifiedUserResult {
  userId: string;
  verified: boolean;
}

// Booking-time email-verification gate. Signup itself no longer requires
// a confirmed email (see app/actions/auth.ts) — verification is deferred
// to the moment someone actually tries to book, per the new flow. Unlike
// requireUserId, this doesn't redirect on its own: createBooking needs to
// return a normal error result (not a hard redirect) so the booking UI
// can show a "verify your email" message inline instead of bouncing the
// user away from the page they were on.
export async function requireVerifiedUserId(
  redirectTo: string = "/sign-in",
): Promise<VerifiedUserResult> {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return { userId: user.id, verified: Boolean(user.emailConfirmedAt) };
}
