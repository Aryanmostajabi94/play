import "../styles/globals.css";
import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";

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
    <html lang="en" className={bebasNeue.variable}>
      <body>{children}</body>
    </html>
  );
}
