import { requireUserId } from "../../../lib/auth";
import ChoosePlanForm from "../../../components/onboarding/ChoosePlanForm";

// A5 — Choose Plan. Used to be folded into the Sign Up screen as a
// second column; now it's its own step right after /onboarding/profile,
// for both email/password and OAuth signups (auth/callback also lands
// first-timers on /onboarding/profile, which now forwards here too).
// Picking Explorer (free) just continues into the app — signUpAction /
// the OAuth upsert already created the row as 'free'. Picking Insider
// or Elite hands off into the existing D1 checkout flow.
export default async function ChoosePlanPage() {
  await requireUserId("/sign-in?next=/onboarding/plan");

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <div className="heading" style={{ fontSize: 28, marginBottom: 6, textAlign: "center" }}>
        Choose your plan
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28, textAlign: "center" }}>
        You can change this anytime from your account settings.
      </div>
      <ChoosePlanForm />
    </main>
  );
}
