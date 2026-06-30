import AuthShell from "../../../components/auth/AuthShell";
import SignInForm from "../../../components/auth/SignInForm";

export default function SignInPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to access your bookings and member benefits." maxWidth={440} activeTab="sign-in">
      <SignInForm providerError={searchParams.error} />
    </AuthShell>
  );
}
