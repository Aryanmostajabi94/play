import { getBookingById } from "../../../../../lib/bookings";
import { requireUserId } from "../../../../../lib/auth";
import CancelBookingScreen from "../../../../../components/booking/CancelBookingScreen";

// C9 — Cancel Booking Screen, at /booking/[id]/cancel.
export default async function CancelBookingPage({ params }: { params: { id: string } }) {
  const userId = await requireUserId(`/sign-in?next=/booking/${params.id}/cancel`);
  const booking = await getBookingById(params.id);

  if (!booking || booking.user_id !== userId || !["pending", "confirmed"].includes(booking.status)) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>
          {booking ? "This booking can't be cancelled." : "Booking not found."}
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px" }}>
      <CancelBookingScreen booking={booking} />
    </main>
  );
}
