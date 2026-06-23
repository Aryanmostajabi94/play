import { getAccountProfile } from "../../../../lib/account";
import { requireUserId } from "../../../../lib/auth";
import AccountSettingsForm from "../../../../components/settings/AccountSettingsForm";

// E2 — Account Settings.
export default async function AccountSettingsPage() {
  const userId = await requireUserId("/sign-in?next=/settings/account");
  const profile = await getAccountProfile(userId);

  if (!profile) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Couldn't load your account.</div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px" }}>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Account settings
      </div>
      <AccountSettingsForm profile={profile} />
    </main>
  );
}
