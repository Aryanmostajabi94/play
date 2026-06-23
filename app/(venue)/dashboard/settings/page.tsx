import {
  getVenueOwner,
  getVenueStaff,
  getVenueNotificationPrefs,
  getVenueBillingInfo,
} from "../../../../lib/venueSettings";
import VenueSettingsForm from "../../../../components/venue/VenueSettingsForm";

// F8 — Venue Settings. Per Tasks Tracker: "Account details, staff
// management (max 5 venue_users), notification preferences, billing."
export default async function VenueSettingsPage() {
  const [owner, staff, prefs, billing] = await Promise.all([
    getVenueOwner(),
    getVenueStaff(),
    getVenueNotificationPrefs(),
    getVenueBillingInfo(),
  ]);

  return (
    <div>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Settings
      </div>
      <VenueSettingsForm owner={owner} staff={staff} initialPrefs={prefs} billing={billing} />
    </div>
  );
}
