import AuthShell from "../../../components/auth/AuthShell";
import SignUpForm from "../../../components/auth/SignUpForm";

// A3 — Sign Up.
export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <AuthShell
      title="Join Play"
      subtitle="Your access to Dubai's best venues and exclusive experiences."
      maxWidth={440}
      activeTab="sign-up"
    >
      <SignUpForm providerError={searchParams.error} />
    </AuthShell>
  );
}
