import { listLiveVenues } from "../../../lib/venues";
import AreaMap from "../../../components/map/AreaMap";

// Map nav item lives in the header (see components/layout/HeaderNav.tsx)
// alongside Discover/Saved/Membership. Ported from Play_V11.jsx's MapCanvas
// (area-heat blobs + glowing venue pins on a stylized grid) — V11 hardcoded
// Dubai lat/lng for a fixed list of areas, but this app's venues table has
// no lat/lng column, so positions are laid out deterministically by area
// instead of inventing coordinates. See components/map/AreaMap.tsx for the
// full writeup. Was previously a static "coming soon" placeholder.
export default async function MapPage() {
  const venues = await listLiveVenues();

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 20px 80px" }}>
      <div className="heading" style={{ fontSize: 32, marginBottom: 6 }}>
        Venue Map
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>
        Hover an area or pin to preview, click to book.
      </div>

      {venues.length === 0 ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            border: "1px solid var(--border-soft)",
            borderRadius: 18,
          }}
        >
          No live venues yet — check back soon.
        </div>
      ) : (
        <AreaMap venues={venues} />
      )}
    </main>
  );
}
