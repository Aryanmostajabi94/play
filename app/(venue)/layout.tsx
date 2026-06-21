import { getDashboardSummary } from "../../lib/venueBookings";
import VenueNav from "../../components/venue/VenueNav";

// Shared layout for the venue dashboard product (Section F — Screen
// Inventory v1.0). Desktop-first, separate product surface from the
// mobile-first consumer app under app/(consumer)/.
export default async function VenueLayout({ children }: { children: React.ReactNode }) {
  const summary = await getDashboardSummary();

  return (
    <div style={{ minHeight: "100vh" }}>
      <VenueNav venueName={summary.venueName} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 60px" }}>
        {children}
      </div>
    </div>
  );
}
