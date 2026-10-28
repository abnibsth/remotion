import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "LokalMart — Belanja Lokal, Dampak Maksimal.",
    template: "%s — LokalMart",
  },
  description:
    "LokalMart membantu UMKM Indonesia menjual produk lokal secara digital. Belanja kopi, kerajinan, fashion, dan makanan rumahan langsung dari pembuatnya.",
};

export const viewport: Viewport = {
  themeColor: "#fbf7ef",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body
        className={`${jakarta.variable} ${fraunces.variable} bg-cream-50 font-sans text-ink-900 antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
