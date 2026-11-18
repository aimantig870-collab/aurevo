import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Aurevo — Golden Hour Coffee House (concept)", template: "%s · Aurevo" },
  description: "Aurevo is a proposed premium café brand: original signature drinks inspired by world pantries, a warm design language and a franchise-ready system. Concept stage.",
  openGraph: { title: "Aurevo — Golden Hour Coffee House", description: "Slow down. Glow up. A proposed premium café brand concept.", type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#1B120D", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-aurum focus:px-5 focus:py-3 focus:font-semibold">Skip to content</a>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
