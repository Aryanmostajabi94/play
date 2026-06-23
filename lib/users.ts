import { getSupabaseServerClient } from "./supabaseServer";

// D3 Billing Portal / D4 Payment Failed.
// Reads the real `users` row for billing/tier state — no separate
// "subscription" table exists; tier + Stripe linkage live directly on
// `users` (tier, stripe_customer_id, subscription_status,
// subscription_expires_at) per Database Schema v1.0.
export interface UserBillingProfile {
  id: string;
  name: string;
  email: string;
  tier: "free" | "insider" | "elite";
  subscription_status: "inactive" | "active" | "past_due" | "cancelled";
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
}

export async function getUserBillingProfile(userId: string): Promise<UserBillingProfile | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, tier, subscription_status, subscription_expires_at, stripe_customer_id")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("getUserBillingProfile error:", error?.message);
    return null;
  }

  return data as UserBillingProfile;
}

export interface SubscriptionEventRow {
  id: string;
  event_type: string;
  tier_before: string | null;
  tier_after: string | null;
  amount: number | null;
  status: string;
  created_at: string;
}

// Billing history shown on D3 — most recent subscription_events for this
// user, used as a stand-in for "receipts" until real Stripe invoices are
// wired up (see Notion task "Wire up real Stripe Checkout for D1/D2").
export async function getSubscriptionEvents(userId: string): Promise<SubscriptionEventRow[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("subscription_events")
    .select("id, event_type, tier_before, tier_after, amount, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("getSubscriptionEvents error:", error.message);
    return [];
  }

  return (data ?? []) as SubscriptionEventRow[];
}
