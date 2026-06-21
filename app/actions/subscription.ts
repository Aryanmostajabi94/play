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
