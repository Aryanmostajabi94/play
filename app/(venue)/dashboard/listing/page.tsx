import { getVenueListing } from "../../../../lib/venueListing";
import ListingEditorForm from "../../../../components/venue/ListingEditorForm";

// Screen F5 — Listing Editor.
// Per Screen Inventory v1.0: "Edit all venue fields — description, photos,
// hours, amenities, pricing, booking settings." Hours/availability are
// excluded here — see the VenueListingDetail type comment for why (that's
// F6 Availability Manager's table, not this one).
export default async function ListingEditorPage() {
  const listing = await getVenueListing();

  if (!listing) {
    return (
      <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
        Couldn't load this venue's listing.
      </div>
    );
  }

  return (
    <div>
      <div className="heading" style={{ fontSize: 30, marginBottom: 6 }}>
        Edit Listing
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
        Update how your venue appears to guests across Play.
      </div>

      <ListingEditorForm listing={listing} />
    </div>
  );
}
