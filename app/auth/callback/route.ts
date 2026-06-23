import { NextResponse } from "next/server";
import { getSupabaseRouteClient } from "../../../lib/supabaseRoute";
import { getSupabaseServerClient } from "../../../lib/supabaseServer";

// A3/A4 — handles both:
//   1. Email confirmation links (if the Supabase project requires email
//      confirmation before a session is issued)
//   2. Google/Apple/Facebook OAuth redirect-back (once each provider is
//      enabled in the Supabase dashboard — see SignInForm.tsx)
// Both flows redirect here with a `code` query param that gets exchanged
// for a real session.
//
// What this didn't handle until now: a brand-new OAuth sign-in has an
// auth.users row (from exchangeCodeForSession) but no public.users row —
// only signUpAction's manual upsert creates that, and OAuth never goes
// through signUpAction. getAccountProfile (lib/account.ts) does a
// `.single()` select against `users` and returns null with no row,
// which is exactly the "Couldn't load your profile" error. So once the
// session exists, this also creates that row the first time an OAuth
// user shows up — same upsert shape as signUpAction — and sends
// first-timers to the same /onboarding/profile step as a fresh
// email/password signup instead of `next`.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=auth_callback_failed", url.origin));
  }

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/sign-in?error=auth_callback_failed", url.origin));
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in?error=auth_callback_failed", url.origin));
  }

  const serviceClient = getSupabaseServerClient();
  const { data: existing } = await serviceClient
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    const name =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Player";
    const avatarUrl =
      (user.user_metadata?.avatar_url as string | undefined) ||
      (user.user_metadata?.picture as string | undefined) ||
      null;

    const { error: insertError } = await serviceClient.from("users").upsert(
      { id: user.id, name, email: user.email ?? "", tier: "free", avatar_url: avatarUrl },
      { onConflict: "email" },
    );

    // Same graceful-degradation as signUpAction: migration 0002
    // (avatar_url) may not be applied yet — retry without that column
    // rather than leaving the new OAuth user with no row at all.
    if (insertError?.message?.includes("avatar_url")) {
      const { error: retryError } = await serviceClient
        .from("users")
        .upsert({ id: user.id, name, email: user.email ?? "", tier: "free" }, { onConflict: "email" });
      if (retryError) {
        console.error("OAuth user upsert (retry) failed:", retryError.message);
      }
    } else if (insertError) {
      console.error("OAuth user upsert failed:", insertError.message);
    }

    return NextResponse.redirect(new URL("/onboarding/profile", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
