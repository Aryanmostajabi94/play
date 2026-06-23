import { notFound } from "next/navigation";
import Link from "next/link";
import ClaimShell from "../../../../components/claim/ClaimShell";
import { getVerificationSubmission } from "../../../../lib/venueClaim";

// G10 — Approved.
export default async function ClaimApprovedPage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid } = await searchParams;
  if (!sid) notFound();
  const submission = await getVerificationSubmission(sid);
  if (!submission) notFound();

  return (
    <ClaimShell title="You're verified 🎉" subtitle="Your listing is now claimed and live on Play.">
      <Link
        href="/dashboard"
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
        Go to your dashboard
      </Link>
    </ClaimShell>
  );
}
