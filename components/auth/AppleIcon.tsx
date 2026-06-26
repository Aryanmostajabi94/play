// Apple's logo as inline SVG (currentColor fill) instead of the bare
// "" glyph the OAuth buttons used to render — that glyph depends on an
// emoji/icon font being installed, so it showed up as a missing-glyph box
// on some platforms. Shared by SignInForm and SignUpForm.
export default function AppleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 814 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.2c-52.3-75.1-94.7-191.3-94.7-301.6 0-167.6 109.8-256.2 217.4-256.2 55.1 0 101.3 36.2 136.2 36.2 33.3 0 85.2-38.1 147.2-38.1 23.4 0 108.1 2 168.2 77.2zm-188.5-167.3c31.6-37.6 54.1-89.9 54.1-142.2 0-7.1-.6-14.3-1.9-20.1-51.6 1.9-112.3 34.4-149.2 75.8-28.5 32.4-55.1 84.7-55.1 137.8 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 46.5 0 102.5-31 136.6-70.7z" />
    </svg>
  );
}
