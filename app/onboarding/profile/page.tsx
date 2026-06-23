import { getAccountProfile } from "../../../lib/account";
import { requireUserId } from "../../../lib/auth";
import CompleteProfileForm from "../../../components/onboarding/CompleteProfileForm";

// New post-signup step: signUpAction now redirects here right after
// account creation (instead of straight to "/") so people fill in
// phone / date of birth / avatar before they start browsing. Distinct
// route from app/welcome (the existing globe-intro animation, A1/A2) —
// that one's a one-time visual intro, this one's a real form.
export default async function CompleteProfilePage() {
  const userId = await requireUserId("/sign-in?next=/onboarding/profile");
  const profile = await getAccountProfile(userId);

  if (!profile) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Couldn't load your profile.</div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px" }}>
      <div className="heading" style={{ fontSize: 28, marginBottom: 6 }}>
        Welcome to Play, {profile.name.split(" ")[0]}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
        A few more details before you start booking.
      </div>
      <CompleteProfileForm profile={profile} />
    </main>
  );
}
