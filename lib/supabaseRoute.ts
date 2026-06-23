import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cookie-bound Supabase client — used in Server Components, Server
// Actions, and Route Handlers wherever we need to know who's actually
// signed in. Distinct from:
//   - lib/supabase.ts        — anon client for the browser (no cookies)
//   - lib/supabaseServer.ts  — service-role client, bypasses RLS entirely,
//                              used for app-trusted reads/writes once an
//                              identity has already been established
//
// This one reads/writes the sb-* auth cookies via next/headers, which is
// what lets supabase.auth.getUser() below actually resolve to a real
// signed-in user instead of always being null.
export function getSupabaseRouteClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll is called from Server Components sometimes (e.g. via
            // middleware-less session reads) where cookies() is read-only.
            // Safe to ignore — middleware.ts is what actually keeps the
            // session refreshed across requests.
          }
        },
      },
    },
  );
}
