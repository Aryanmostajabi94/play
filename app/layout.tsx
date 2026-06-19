import "../styles/globals.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
