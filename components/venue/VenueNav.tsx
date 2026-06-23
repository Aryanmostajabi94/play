import Link from "next/link";

// Top nav for the venue dashboard product (venues.play.app — desktop-first,
// per Play HQ — Home "Platform" note, separate from the mobile-first
// consumer app).
export default function VenueNav({ venueName }: { venueName: string }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div className="heading" style={{ fontSize: 20 }}>
          PLAY <span style={{ color: "var(--text-muted)" }}>for venues</span>
        </div>
        <Link href="/dashboard" style={navLink}>
          Dashboard
        </Link>
        <Link href="/dashboard/requests" style={navLink}>
          Pending Requests
        </Link>
        <Link href="/dashboard/upcoming" style={navLink}>
          Upcoming Bookings
        </Link>
        <Link href="/dashboard/history" style={navLink}>
          Booking History
        </Link>
        <Link href="/dashboard/availability" style={navLink}>
          Availability
        </Link>
        <Link href="/dashboard/analytics" style={navLink}>
          Analytics
        </Link>
        <Link href="/dashboard/listing" style={navLink}>
          Edit Listing
        </Link>
        <Link href="/dashboard/settings" style={navLink}>
          Settings
        </Link>
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{venueName}</div>
    </nav>
  );
}

const navLink: React.CSSProperties = {
  color: "var(--text-primary)",
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
};
