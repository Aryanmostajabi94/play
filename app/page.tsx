import { listLiveVenues } from "../lib/venues";
import HomeDiscover from "../components/home/HomeDiscover";
import SiteHeader from "../components/layout/SiteHeader";
import BottomNav from "../components/layout/BottomNav";

// Screen B1 — Home / Discover. Per Screen Inventory v1.0: "hero carousel,
// AI search bar, category filters, venue grid." Replaces the placeholder
// stub that previously sat at "/" and just linked straight to one booking
// page. Ported from the old MVP prototype (Play_V11.jsx) — see
// components/home/HomeDiscover.tsx for what changed in the port.
//
// The header used to be hand-rolled inline here (it was the only page
// that had one at all). Pulled out into components/layout/SiteHeader.tsx
// so every consumer page gets the same nav — see app/(consumer)/layout.tsx.
// "/" lives outside that route group, so it's mounted directly here.
export default async function Home() {
  const venues = await listLiveVenues();

  return (
    <>
      <SiteHeader />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 80px" }}>
        <HomeDiscover venues={venues} />
      </main>
      <div className="play-bottom-nav-spacer" style={{ display: "none", height: 64 }} />
      <BottomNav />
    </>
  );
}
