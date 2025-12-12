import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/session-provider";
import { GoogleAnalytics } from "@/components/google-analytics";

export const metadata: Metadata = {
  title: "Watercooler - Discover Early-Stage Startups",
  description: "A public directory of early-stage startups. Browse, search, and discover the next big thing.",
  icons: {
    icon: [
      { url: "/logo-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-icon.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo-icon.png",
  },
  openGraph: {
    title: "Watercooler - Discover Early-Stage Startups",
    description: "A public directory of early-stage startups. Browse, search, and discover the next big thing.",
    url: "https://www.watercooler.world",
    siteName: "Watercooler",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Watercooler Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watercooler - Discover Early-Stage Startups",
    description: "A public directory of early-stage startups. Browse, search, and discover the next big thing.",
    images: ["/logo.png"],
  },
  manifest: "/manifest.json",
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
