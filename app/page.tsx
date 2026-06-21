import { listLiveVenues } from "../lib/venues";
import HomeDiscover from "../components/home/HomeDiscover";

// Screen B1 — Home / Discover. Per Screen Inventory v1.0: "hero carousel,
// AI search bar, category filters, venue grid." Replaces the placeholder
// stub that previously sat at "/" and just linked straight to one booking
// page. Ported from the old MVP prototype (Play_V11.jsx) — see
// components/home/HomeDiscover.tsx for what changed in the port.
export default async function Home() {
  const venues = await listLiveVenues();

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 80px" }}>
      <div style={{ padding: "24px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="heading" style={{ fontSize: 30 }}>
          PLAY
        </span>
      </div>
      <HomeDiscover venues={venues} />
    </main>
  );
}
