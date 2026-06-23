import Link from "next/link";
import type { NotificationItem, NotificationType } from "../../lib/notifications";

const META: Record<NotificationType, { emoji: string; label: string; color: string }> = {
  confirmed: { emoji: "✅", label: "Confirmed your request", color: "var(--accent-pink)" },
  declined: { emoji: "❌", label: "Couldn't confirm your request", color: "var(--text-muted)" },
  expired: { emoji: "⏱", label: "Request expired before confirmation", color: "var(--accent-gold)" },
  cancelled_by_venue: { emoji: "⚠️", label: "Cancelled your booking", color: "var(--text-muted)" },
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// C5 — Booking Confirmed Notification.
// Surfaces every notable booking-status change (confirmed / declined /
// expired / cancelled by venue) as an in-app feed item, each linking back
// to the full booking. See lib/notifications.ts for how these are derived
// from the bookings table.
export default function NotificationsList({ items }: { items: NotificationItem[] }) {
  if (items.length === 0) {
    return (
      <div
        style={{
          padding: "50px 20px",
          textAlign: "center",
          color: "var(--text-muted)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18,
        }}
      >
        Nothing yet — we'll let you know here when a venue responds to a request.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item) => {
        const meta = META[item.type];
        return (
          <Link
            key={item.bookingId + item.type}
            href={`/booking/${item.bookingId}`}
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${item.venueAccentColor}33`,
              borderRadius: 16,
              padding: 16,
              textDecoration: "none",
              color: "var(--text-primary)",
            }}
          >
            <div style={{ fontSize: 22 }}>{meta.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                {item.venueName}
              </div>
              <div style={{ fontSize: 13, color: meta.color, marginBottom: 4 }}>{meta.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {item.date} · {item.timeSlot} · {formatWhen(item.occurredAt)}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
