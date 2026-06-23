"use server";

import type { BillingCycle, PaidTier } from "../../types/database";

// D1 Checkout/Payment.
//
// TEMPORARY STUB — no Stripe test keys are configured yet (see Notion D1/D2
// task notes). Once STRIPE_SECRET_KEY + a price ID per tier/cycle are added
// as env vars, replace this with a real
// `stripe.checkout.sessions.create(...)` call and return its hosted `url`
// instead of the local mock success route. The screen-level UI (plan
// picker, billing-cycle toggle) is already built for that swap — only this
// function's body needs to change.
export async function startCheckout(
  tier: PaidTier,
  cycle: BillingCycle,
): Promise<{ redirectUrl: string }> {
  return {
    redirectUrl: `/upgrade/success?tier=${tier}&cycle=${cycle}&mock=1`,
  };
}

// D3 Billing Portal.
//
// TEMPORARY STUB — same reasoning as startCheckout above. Once Stripe is
// connected, replace this with a real
// `stripe.billingPortal.sessions.create({ customer, return_url })` call
// and return its hosted `url`. Until then there's nowhere real to send
// the user, so D3 stays a custom (not Stripe-hosted) screen, per the
// Screen Inventory note "Stripe hosted portal — minimal custom" — this is
// the minimal-custom fallback for when hosted isn't wired up yet.
export async function manageBilling(): Promise<{ redirectUrl: string }> {
  return { redirectUrl: "/billing?mock=1" };
}

// D3 cancel-subscription action. Same stub status as above — once Stripe
// is connected this should cancel the real subscription
// (`stripe.subscriptions.update(id, { cancel_at_period_end: true })`) and
// let the webhook update `users.subscription_status`. For now it writes
// directly to the `users` row so the UI reflects a believable end state.
export async function cancelSubscription(userId: string): Promise<{ success: boolean }> {
  const { getSupabaseServerClient } = await import("../../lib/supabaseServer");
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("users")
    .update({ subscription_status: "cancelled" })
    .eq("id", userId);

  if (error) {
    console.error("cancelSubscription error:", error.message);
    return { success: false };
  }

  return { success: true };
}
