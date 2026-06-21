import { getPendingRequests } from "../../../../lib/venueBookings";
import PendingRequestRow from "../../../../components/venue/PendingRequestRow";

// F2 — Pending Requests (Screen Inventory v1.0 / Booking Engine Spec v1.0
// §5): list of requests awaiting venue confirm/decline, sorted by
// confirmation deadline soonest first (handled in getPendingRequests()).
export default async function PendingRequestsPage() {
  const requests = await getPendingRequests();

  return (
    <div>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Pending Requests
      </div>

      {requests.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
          No pending requests right now.
        </div>
      ) : (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 0.8fr 1.6fr 1fr 1.4fr",
              gap: 16,
              padding: "12px 20px",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "var(--text-muted)",
              fontWeight: 700,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>Guest</div>
            <div>Date / Time</div>
            <div>Party</div>
            <div>Special requests</div>
            <div>Deadline</div>
            <div>Action</div>
          </div>

          {requests.map((booking) => (
            <PendingRequestRow key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
