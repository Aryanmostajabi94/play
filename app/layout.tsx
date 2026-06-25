import "../styles/globals.css";
import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import AutoTheme from "../components/theme/AutoTheme";

// Sets html[data-theme] before first paint so there's no flash of the
// wrong palette — must match the day/night boundary used by
// components/theme/AutoTheme.tsx (6am-6pm local = day) exactly, or the
// page would flicker once AutoTheme's effect runs on mount.
const THEME_BOOT_SCRIPT = `
(function () {
  try {
    var h = new Date().getHours();
    document.documentElement.dataset.theme = (h >= 6 && h < 18) ? "day" : "night";
  } catch (e) {}
})();
`;

// Setup — Configure Tailwind + design tokens. Bebas Neue was referenced in
// globals.css (.heading) but never actually loaded, so headings were
// silently falling back to sans-serif. next/font loads it and exposes it
// as a CSS variable so it's a real design token, not just a CSS string.
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// Body font — the original Play_V11 prototype used DM Sans throughout
// (loaded via @import in its own <style> block). The app had been falling
// back to the system UI font stack instead, which is most of why it reads
// as visually "different" from V11 despite already sharing the same accent
// palette and Bebas Neue headings. Purely a typeface swap — no component
// markup/logic changes.
const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Play",
  description: "Book the best tables, beach clubs, and nightlife in Dubai.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <AutoTheme />
        {children}
      </body>
    </html>
  );
}
