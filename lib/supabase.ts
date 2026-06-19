import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client — safe to use in the browser.
// Reads the URL + anon (public) key from env vars set in .env.local.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
