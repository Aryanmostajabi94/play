import { notFound } from "next/navigation";
import Link from "next/link";
import { listUsersAdmin, getUserBookingHistoryAdmin } from "../../../../../lib/admin";

// H5 — User Management drill-down: a single user's booking history.
export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [users, history] = await Promise.all([listUsersAdmin(), getUserBookingHistoryAdmin(id)]);
  const user = users.find((u) => u.id === id);
  if (!user) notFound();

  return (
    <div>
      <Link href="/admin/users" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
        ← All users
      </Link>
      <div className="heading" style={{ fontSize: 28, marginTop: 12, marginBottom: 4 }}>
        {user.name}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
        {user.email} · {user.tier} · {user.city}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Booking history</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {history.map((b) => (
          <div
            key={b.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 700 }}>{b.venue_name}</div>
            <div style={{ color: "var(--text-muted)" }}>
              {b.date} · {b.time_slot}
            </div>
            <div>{b.status}</div>
          </div>
        ))}
        {history.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No bookings yet.</div>
        )}
      </div>
    </div>
  );
}
