import SiteHeader from "../../components/layout/SiteHeader";

// Sign In / Sign Up previously had no header at all — (auth) had no
// layout.tsx, so they fell outside both the (consumer) layout and Home's
// inline mount, the only two places SiteHeader was wired up. Same fix
// as app/(consumer)/layout.tsx.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader />
      {children}
    </div>
  );
}
