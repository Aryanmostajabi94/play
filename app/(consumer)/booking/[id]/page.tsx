import { getBookingById } from "../../../../lib/bookings";
import BookingConfirmed from "../../../../components/booking/BookingConfirmed";
import BookingRequestSent from "../../../../components/booking/BookingRequestSent";
import BookingDetail from "../../../../components/booking/BookingDetail";

// Booking detail route — serves two distinct screens from the Screen
// Inventory at the same URL, distinguished by the `?new=1` query param:
//
// - `?new=1` (set only by the redirect right after creating a booking):
//   - C3 Instant Confirm: booking.status === "confirmed"
//   - C4 Request Sent: booking.status === "pending"
// - No `?new=1` (revisiting from C7 Booking History, or any other link):
//   - C8 Booking Detail — full detail for any status, with a Cancel
//     button when the booking is still eligible.
export default async function BookingStatusPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { new?: string };
}) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Booking not found.</div>
      </main>
    );
  }

  const isFreshBooking = searchParams.new === "1";

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      {isFreshBooking && booking.status === "confirmed" && (
        <BookingConfirmed booking={booking} />
      )}
      {isFreshBooking && booking.status === "pending" && (
        <BookingRequestSent booking={booking} />
      )}
      {(!isFreshBooking || (booking.status !== "confirmed" && booking.status !== "pending")) && (
        <BookingDetail booking={booking} />
      )}
    </main>
  );
}
