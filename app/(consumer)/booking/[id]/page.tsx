import { getBookingById } from "../../../../lib/bookings";
import { requireUserId } from "../../../../lib/auth";
import { listLiveVenues } from "../../../../lib/venues";
import BookingConfirmed from "../../../../components/booking/BookingConfirmed";
import BookingRequestSent from "../../../../components/booking/BookingRequestSent";
import BookingDetail from "../../../../components/booking/BookingDetail";
import BookingDeclined from "../../../../components/booking/BookingDeclined";

// Booking detail route — serves several distinct screens from the
// Screen Inventory at the same URL:
//
// - `?new=1` (set only by the redirect right after creating a booking):
//   - C3 Instant Confirm: booking.status === "confirmed"
//   - C4 Request Sent: booking.status === "pending"
// - status === "declined" (always, regardless of `?new=1` — a decline
//   only ever happens after the fact, never at creation time):
//   - C6 Booking Declined, with alternative venue suggestions
// - everything else (revisiting from C7 Booking History, or any other
//   link, for any other status):
//   - C8 Booking Detail — full detail for any status, with a link to
//     C9 Cancel Booking when the booking is still eligible.
export default async function BookingStatusPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { new?: string };
}) {
  const userId = await requireUserId(`/sign-in?next=/booking/${params.id}`);
  const booking = await getBookingById(params.id);

  if (!booking || booking.user_id !== userId) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Booking not found.</div>
      </main>
    );
  }

  const isFreshBooking = searchParams.new === "1";

  let declinedView = null;
  if (booking.status === "declined") {
    const allVenues = await listLiveVenues();
    const alternatives = allVenues
      .filter((v) => v.name !== booking.venue.name && v.area === booking.venue.area)
      .slice(0, 3);
    declinedView = <BookingDeclined booking={booking} alternatives={alternatives} />;
  }

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      {declinedView}
      {!declinedView && isFreshBooking && booking.status === "confirmed" && (
        <BookingConfirmed booking={booking} />
      )}
      {!declinedView && isFreshBooking && booking.status === "pending" && (
        <BookingRequestSent booking={booking} />
      )}
      {!declinedView &&
        (!isFreshBooking || (booking.status !== "confirmed" && booking.status !== "pending")) && (
          <BookingDetail booking={booking} />
        )}
    </main>
  );
}
