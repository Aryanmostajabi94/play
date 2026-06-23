import Link from "next/link";

// Top nav for the internal admin panel (Section H). Per Tasks Tracker:
// "low visual priority — functional over beautiful" — reuses VenueNav's
// layout pattern rather than inventing a new one.
export default function AdminNav() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "18px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="heading" style={{ fontSize: 18 }}>
        PLAY <span style={{ color: "var(--text-muted)" }}>admin</span>
      </div>
      <Link href="/admin" style={navLink}>
        Home
      </Link>
      <Link href="/admin/venues" style={navLink}>
        Venues
      </Link>
      <Link href="/admin/verification" style={navLink}>
        Verification Queue
      </Link>
      <Link href="/admin/bookings" style={navLink}>
        Bookings
      </Link>
      <Link href="/admin/users" style={navLink}>
        Users
      </Link>
    </nav>
  );
}

const navLink: React.CSSProperties = {
  color: "var(--text-primary)",
  fontSize: 13,
  fontWeight: 600,
  textDecoration: "none",
};
