import ClaimShell from "../../../../components/claim/ClaimShell";
import ClaimFindForm from "../../../../components/claim/ClaimFindForm";

// G2 — Find Your Listing.
export default function ClaimFindPage() {
  return (
    <ClaimShell title="Find your venue" subtitle="Search by name to find your unclaimed listing.">
      <ClaimFindForm />
    </ClaimShell>
  );
}
