import { getWeeklyAvailability, getBlackoutDates } from "../../../../lib/venueAvailability";
import AvailabilityManagerForm from "../../../../components/venue/AvailabilityManagerForm";

// F6 — Availability Manager.
export default async function AvailabilityManagerPage() {
  const [days, blackouts] = await Promise.all([getWeeklyAvailability(), getBlackoutDates()]);

  return (
    <div>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Availability
      </div>
      <AvailabilityManagerForm initialDays={days} initialBlackouts={blackouts} />
    </div>
  );
}
