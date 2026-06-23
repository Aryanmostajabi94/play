import { NextResponse } from "next/server";
import { getSupabaseRouteClient } from "../../../lib/supabaseRoute";

// A3/A4 — handles both:
//   1. Email confirmation links (if the Supabase project requires email
//      confirmation before a session is issued)
//   2. Google OAuth redirect-back (once the Google provider is enabled
//      in the Supabase dashboard — see SignInForm.tsx for that caveat)
// Both flows redirect here with a `code` query param that gets exchanged
// for a real session.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = getSupabaseRouteClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL("/sign-in?error=auth_callback_failed", url.origin));
}
