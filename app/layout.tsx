import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/session-provider";
import { GoogleAnalytics } from "@/components/google-analytics";

export const metadata: Metadata = {
  title: "Watercooler - Discover Early-Stage Startups",
  description: "A public directory of early-stage startups. Browse, search, and discover the next big thing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body className="antialiased">
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
