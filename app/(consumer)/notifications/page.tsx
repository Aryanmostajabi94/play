import { getNotificationsForUser } from "../../../lib/notifications";
import { requireUserId } from "../../../lib/auth";
import NotificationsList from "../../../components/notifications/NotificationsList";

// C5 — Booking Confirmed Notification (and siblings: declined / expired /
// cancelled-by-venue). Standalone /notifications route for now — same
// reasoning as C7 Booking History: the consumer Profile shell hasn't been
// ported into this app yet, so this can be nested under Profile later.
export default async function NotificationsPage() {
  const userId = await requireUserId("/sign-in?next=/notifications");
  const items = await getNotificationsForUser(userId);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Notifications
      </div>
      <NotificationsList items={items} />
    </main>
  );
}
