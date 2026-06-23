import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// A3/A4 — Connect real Supabase Auth.
// Standard Supabase + Next.js App Router pattern: middleware refreshes
// the auth session (rotates the access token using the refresh token in
// the sb-* cookies) on every request, so Server Components reading the
// session via lib/supabaseRoute.ts always see an up-to-date user instead
// of a stale/expired one.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Touch the session so expired access tokens get refreshed.
  await supabase.auth.getUser();

  // A1 — Globe Intro. First-time visitors land on the city-selection
  // intro before Home; the cookie (set client-side once a city is chosen,
  // see components/onboarding/GlobeIntro.tsx) means returning visitors
  // skip straight to "/". Scoped to "/" only so every other route (sign
  // in, deep links to a venue/booking, etc.) is never blocked by it.
  const { pathname } = request.nextUrl;
  if (pathname === "/" && !request.cookies.get("play_seen_intro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/welcome";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
