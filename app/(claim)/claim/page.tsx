import Link from "next/link";
import ClaimShell from "../../../components/claim/ClaimShell";

// G1 — Claim Entry Point. Spec says this should be a banner on Ghost
// listing cards in the Discover grid, but listLiveVenues() (the anon
// client lib/venues.ts uses for that grid) is filtered by the
// venues_select_live RLS policy to status='live' only — ghost venues
// aren't returned to it at all, and adding an RLS policy isn't something
// this environment can apply to the live database. So this is a
// standalone landing page instead, linked from the home header ("List
// your venue") — the practical entry point into the same flow.
export default function ClaimLandingPage() {
  return (
    <ClaimShell
      title="Run a restaurant, café, or bar?"
      subtitle="Claim your free Play listing, or create a new one, and start taking booking requests."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Link
          href="/claim/find"
          className="btn"
          style={{
            display: "block",
            textAlign: "center",
            padding: "14px 20px",
            borderRadius: 14,
            background: "var(--accent-pink)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          Find my venue
        </Link>
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Already listed on Play? Search for your venue's name to claim it. We'll verify you're
          the owner with a quick check (trade license, phone number, and a couple of others)
          before handing over the keys.
        </div>
      </div>
    </ClaimShell>
  );
}
