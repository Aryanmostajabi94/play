import { notFound } from "next/navigation";
import ClaimShell from "../../../../components/claim/ClaimShell";
import ClaimAccountForm from "../../../../components/claim/ClaimAccountForm";
import { getGhostVenue } from "../../../../lib/venueClaim";

// G3 — Create Venue Account.
export default async function ClaimAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ venue?: string }>;
}) {
  const { venue: venueId } = await searchParams;
  if (!venueId) notFound();

  const venue = await getGhostVenue(venueId);
  if (!venue) notFound();

  return (
    <ClaimShell title="Create your account" subtitle="This is what you'll use to manage your listing.">
      <ClaimAccountForm venueId={venue.id} venueName={venue.name} />
    </ClaimShell>
  );
}
