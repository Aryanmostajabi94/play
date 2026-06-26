import AuthShell from "../../../components/auth/AuthShell";
import SignUpForm from "../../../components/auth/SignUpForm";

// A3 — Sign Up.
export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <AuthShell title="Create your account" subtitle="Book Dubai's best venues in seconds." maxWidth={760} activeTab="sign-up">
      <SignUpForm providerError={searchParams.error} />
    </AuthShell>
  );
}
