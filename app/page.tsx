import Link from "next/link";
import { listLiveVenues } from "../lib/venues";
import HomeDiscover from "../components/home/HomeDiscover";
import { getCurrentUser } from "../lib/auth";
import { signOutAction } from "./actions/auth";

// Screen B1 — Home / Discover. Per Screen Inventory v1.0: "hero carousel,
// AI search bar, category filters, venue grid." Replaces the placeholder
// stub that previously sat at "/" and just linked straight to one booking
// page. Ported from the old MVP prototype (Play_V11.jsx) — see
// components/home/HomeDiscover.tsx for what changed in the port.
export default async function Home() {
  const [venues, user] = await Promise.all([listLiveVenues(), getCurrentUser()]);

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 80px" }}>
      <div style={{ padding: "24px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="heading" style={{ fontSize: 30 }}>
          PLAY
        </span>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {user ? (
            <>
              <Link
                href="/notifications"
                style={{ fontSize: 20, textDecoration: "none" }}
                aria-label="Notifications"
              >
                🔔
              </Link>
              <Link
                href="/bookings"
                style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
              >
                My bookings
              </Link>
              <Link
                href="/profile"
                style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
              >
                Profile
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="btn"
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
                }}
              >
                Sign up
              </Link>
            </>
          )}
          <Link
            href="/claim"
            style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
          >
            List your venue
          </Link>
        </div>
      </div>
      <HomeDiscover venues={venues} />
    </main>
  );
}
