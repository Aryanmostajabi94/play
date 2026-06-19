import { getBookingById } from "../../../../lib/bookings";
import BookingConfirmed from "../../../../components/booking/BookingConfirmed";
import BookingRequestSent from "../../../../components/booking/BookingRequestSent";

// Booking-status screen: shown right after a booking is created.
// - C3 Instant Confirm: booking.status === "confirmed"
// - C4 Request Sent: booking.status === "pending"
// (Other statuses fall back to a plain status readout — cancellations/
// declines get their own dedicated screens later.)
export default async function BookingStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Booking not found.</div>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      {booking.status === "confirmed" && <BookingConfirmed booking={booking} />}
      {booking.status === "pending" && <BookingRequestSent booking={booking} />}
      {booking.status !== "confirmed" && booking.status !== "pending" && (
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 28,
            textAlign: "center",
          }}
        >
          <div className="heading" style={{ fontSize: 24, marginBottom: 8 }}>
            Booking status: {booking.status}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Booking ID: {booking.id}
          </div>
        </div>
      )}
    </main>
  );
}
