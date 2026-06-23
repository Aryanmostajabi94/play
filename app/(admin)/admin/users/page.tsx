import Link from "next/link";
import { listUsersAdmin } from "../../../../lib/admin";

const TIER_OPTIONS = ["free", "insider", "elite"];

// H5 — User Management. Per Tasks Tracker: "View all users. Filter by
// tier. View booking history." The per-user booking history drill-down
// lives at /admin/users/[id].
export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const { tier } = await searchParams;
  const users = await listUsersAdmin({ tier });

  return (
    <div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 24 }}>
        Users ({users.length})
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Link
          href="/admin/users"
          style={{ fontSize: 12, color: !tier ? "var(--accent-pink)" : "var(--text-muted)", textDecoration: "none" }}
        >
          All
        </Link>
        {TIER_OPTIONS.map((t) => (
          <Link
            key={t}
            href={`/admin/users?tier=${t}`}
            style={{ fontSize: 12, color: tier === t ? "var(--accent-pink)" : "var(--text-muted)", textDecoration: "none" }}
          >
            {t}
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.6fr 1fr 1fr", gap: 8, padding: "0 14px", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
        <div>Name</div>
        <div>Email</div>
        <div>Tier</div>
        <div>City</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {users.map((u) => (
          <Link
            key={u.id}
            href={`/admin/users/${u.id}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1.6fr 1fr 1fr",
              gap: 8,
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 13,
              textDecoration: "none",
              color: "var(--text-primary)",
            }}
          >
            <div style={{ fontWeight: 700 }}>{u.name}</div>
            <div style={{ color: "var(--text-muted)" }}>{u.email}</div>
            <div>{u.tier}</div>
            <div>{u.city}</div>
          </Link>
        ))}
        {users.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-muted)", padding: 14 }}>No users match this filter.</div>
        )}
      </div>
    </div>
  );
}
