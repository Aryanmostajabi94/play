import SiteHeader from "../../components/layout/SiteHeader";
import BottomNav from "../../components/layout/BottomNav";

// Wraps every page under app/(consumer)/ — profile, bookings, settings,
// billing, notifications, etc. — with the same header Home already had.
// Those pages previously rendered with no nav at all, no way back to
// Home short of the browser back button. Pages keep their own <main>
// wrapper/max-width below this; this layout only adds the header.
export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader />
      {children}
      {/* Spacer so BottomNav (fixed, mobile-only) doesn't sit on top of
          page content — only takes up space when the bar is visible. */}
      <div className="play-bottom-nav-spacer" style={{ display: "none", height: 64 }} />
      <BottomNav />
    </div>
  );
}
