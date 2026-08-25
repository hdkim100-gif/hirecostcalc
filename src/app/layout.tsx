import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Analytics from "@/components/Analytics";
import AdSenseScript from "@/components/AdSenseScript";
import ConsentBanner from "@/components/ConsentBanner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hirecostcalc.com"),
  title: {
    default: "HireCost — What an Employee Really Costs",
    template: "%s | HireCost",
  },
  description:
    "See the true annual cost of hiring an employee in your state — salary plus employer payroll taxes and benefits, in one number. Free, no sign-up.",
  openGraph: {
    title: "HireCost — What an Employee Really Costs",
    description:
      "Salary is the sticker price. See the real bill: employer payroll taxes, benefits, and total cost per hire, by state.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#14181c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <ConsentBanner />
        <Analytics />
        <AdSenseScript />
      </body>
    </html>
  );
}
