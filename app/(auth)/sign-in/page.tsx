import AuthShell from "../../../components/auth/AuthShell";
import SignInForm from "../../../components/auth/SignInForm";

// A4 — Sign In.
export default function SignInPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your bookings.">
      <SignInForm providerError={searchParams.error} />
    </AuthShell>
  );
}
