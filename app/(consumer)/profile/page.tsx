import Link from "next/link";
import { requireUserId } from "../../../lib/auth";
import { getAccountProfile } from "../../../lib/account";
import { getUserBillingProfile } from "../../../lib/users";
import { getBookingsForUser } from "../../../lib/bookings";
import StatusBadge from "../../../components/booking/StatusBadge";
import { signOutAction } from "../../actions/auth";

const TIER_LABEL: Record<string, string> = { free: "Explorer", insider: "Insider", elite: "Elite" };

// B9 — User Profile.
// Per Screen Inventory v1.0: "User's name, email, tier, city, saved
// count. Sign out + upgrade buttons." This screen never existed in the
// v1 codebase at all (the Tasks Tracker description assumed it carried
// over from the MVP prototype, but no /profile route or component was
// ever ported — same gap as A1/A3/A4/A5/B4) — built from scratch here.
// "Saved count" is omitted: there's no saved/favorited-venues table or
// feature anywhere in this schema (Screen B7 Saved Venues is itself
// unbuilt), so showing a count would mean inventing data Play doesn't
// actually track yet.
export default async function ProfilePage() {
  const userId = await requireUserId("/sign-in?next=/profile");
  const [account, billing, bookings] = await Promise.all([
    getAccountProfile(userId),
    getUserBillingProfile(userId),
    getBookingsForUser(userId),
  ]);

  if (!account) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Couldn't load your profile.</div>
      </main>
    );
  }

  const tier = billing?.tier ?? "free";
  const recentBookings = bookings.slice(0, 3);

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        {account.avatar_url ? (
          <img
            src={account.avatar_url}
            alt={account.name}
            style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {account.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div>
          <div className="heading" style={{ fontSize: 24 }}>{account.name}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{account.email}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            padding: "6px 14px",
            borderRadius: 20,
            background: tier === "free" ? "rgba(255,255,255,0.06)" : "rgba(255,184,0,0.12)",
            color: tier === "free" ? "var(--text-muted)" : "var(--accent-gold)",
            border: `1px solid ${tier === "free" ? "rgba(255,255,255,0.1)" : "rgba(255,184,0,0.3)"}`,
          }}
        >
          {tier === "free" ? "Explorer (Free)" : `👑 ${TIER_LABEL[tier]}`}
        </span>
        <span
          style={{
            fontSize: 12,
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-muted)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          📍 {account.city}
        </span>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 36, flexWrap: "wrap" }}>
        {tier === "free" && (
          <Link
            href="/upgrade/checkout"
            className="btn"
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Upgrade plan
          </Link>
        )}
        <Link
          href="/settings/account"
          className="btn"
          style={{
            padding: "10px 18px",
            borderRadius: "var(--radius-md)",
            background: "rgba(255,255,255,0.05)",
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Edit profile
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="btn"
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              background: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-muted)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="heading" style={{ fontSize: 20 }}>Recent bookings</span>
        <Link href="/bookings" style={{ fontSize: 12, color: "var(--accent-pink)", textDecoration: "none" }}>
          View all →
        </Link>
      </div>

      {recentBookings.length === 0 ? (
        <div
          style={{
            padding: "28px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 13,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
          }}
        >
          No bookings yet —{" "}
          <Link href="/" style={{ color: "var(--accent-pink)", textDecoration: "none" }}>
            browse venues
          </Link>
          .
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recentBookings.map((b) => (
            <Link
              key={b.id}
              href={`/booking/${b.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{b.venue.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {b.date} · {b.time_slot} · {b.party_size} guests
                </div>
              </div>
              <StatusBadge status={b.status} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
