import AuthShell from "../../../components/auth/AuthShell";
import SignUpForm from "../../../components/auth/SignUpForm";

// A3 — Sign Up.
export default function SignUpPage() {
  return (
    <AuthShell title="Create your account" subtitle="Book Dubai's best venues in seconds.">
      <SignUpForm />
    </AuthShell>
  );
}
