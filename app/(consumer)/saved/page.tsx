import { requireUserId } from "../../../lib/auth";

// Saved nav item now lives in the header alongside Discover/Map/Membership.
// Favoriting venues (the "favs" state from Play_V11.jsx) hasn't been wired
// up to a real table in this app yet — this is a placeholder so the nav
// link resolves to a real, auth-gated page rather than a 404 in the
// meantime.
export default async function SavedPage() {
  await requireUserId("/sign-in?next=/saved");

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>♡</div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 10 }}>
        Saving venues is coming soon
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
        Soon you'll be able to save your favorite venues here for quick
        access.
      </div>
    </main>
  );
}
