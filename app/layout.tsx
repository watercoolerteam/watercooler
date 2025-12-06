import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Watercooler - Discover Early-Stage Startups",
  description: "A public directory of early-stage startups. Browse, search, and discover the next big thing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
