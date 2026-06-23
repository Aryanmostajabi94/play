import { getNotificationPreferences } from "../../../../lib/notificationPreferences";
import { requireUserId } from "../../../../lib/auth";
import NotificationPreferencesForm from "../../../../components/settings/NotificationPreferencesForm";

// Screen E1 — Notification Preferences.
// Per Screen Inventory v1.0: "Toggle in-app, email, WhatsApp on/off. Set
// reminder timing." Also covers the weekly-picks / Elite-drop digest
// toggles backed by the same notification_preferences table.
export default async function NotificationPreferencesPage() {
  const userId = await requireUserId("/sign-in?next=/settings/notifications");
  const preferences = await getNotificationPreferences(userId);

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>
      <div className="heading" style={{ fontSize: 30, marginBottom: 6 }}>
        Notifications
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
        Choose how and when Play reaches you.
      </div>

      <NotificationPreferencesForm preferences={preferences} />
    </main>
  );
}
