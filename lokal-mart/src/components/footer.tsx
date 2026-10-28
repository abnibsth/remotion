"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { useStore } from "@/lib/store";
import { Reveal } from "@/components/reveal";

const EXPLORE = [
  { href: "/", label: "Beranda" },
  { href: "/belanja", label: "Belanja" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/checkout", label: "Checkout" },
];

function SocialIcon({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full bg-cream-50/10 text-cream-50 transition-all duration-300 hover:-translate-y-1 hover:bg-sun-400 hover:text-forest-950"
    >
      {children}
    </a>
  );
}

export default function SiteFooter() {
  const { pushToast } = useStore();
  const [email, setEmail] = useState("");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      pushToast("Email belum valid", "Cek kembali alamat emailmu ya.");
      return;
    }
    pushToast("Terima kasih sudah berlangganan!", "Cerita UMKM terbaru akan dikirim tiap minggu. (Demo)");
    setEmail("");
  }

  return (
    <footer className="mt-4 overflow-hidden bg-forest-950 text-cream-50">
      <div className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-20">
        <Reveal>
          <div className="grid gap-8 rounded-[2rem] bg-forest-900/70 p-8 ring-1 ring-cream-50/10 md:grid-cols-2 md:items-center md:p-10">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                Cerita UMKM baru,{" "}
                <em className="font-display text-sun-400 italic">tiap minggu.</em>
              </h3>
              <p className="mt-2 text-sm text-cream-50/60">
                Daftar dan dapatkan kurasi produk serta kisah pembuatnya langsung di inbox.
              </p>
            </div>
            <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                Alamat email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="h-12 flex-1 rounded-full bg-forest-950 px-5 text-sm text-cream-50 ring-1 ring-cream-50/15 outline-none transition-shadow placeholder:text-cream-50/35 focus:ring-2 focus:ring-sun-400"
              />
              <button
                type="submit"
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-sun-400 px-6 text-sm font-extrabold text-forest-950 transition-all hover:bg-sun-300 active:scale-95"
              >
                Berlangganan
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </Reveal>

        <div className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
          <Reveal>
            <div className="flex items-center gap-2.5">
              <span className="relative grid size-10 place-items-center rounded-xl bg-forest-700 text-cream-50">
                <span className="text-lg font-extrabold leading-none">L</span>
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-sun-400 ring-2 ring-forest-950" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                Lokal<span className="text-sun-400">Mart</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-50/55">
              Platform belanja online yang mempertemukan pembeli dengan pelaku
              UMKM Indonesia. Belanja Lokal, Dampak Maksimal.
            </p>
            <div className="mt-5 flex gap-2.5">
              <SocialIcon label="Instagram LokalMart" href="https://instagram.com">
                <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Facebook LokalMart" href="https://facebook.com">
                <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor">
                  <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.2v3h2.5v7h2.8Z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="X (Twitter) LokalMart" href="https://x.com">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M17.8 4h2.7l-6 6.9L21.5 20h-5.5l-4.3-5.6L6.7 20H4l6.4-7.4L3.6 4h5.7l3.9 5.1L17.8 4Zm-1 14.4h1.5L8.5 5.5H6.9l9.9 12.9Z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="YouTube LokalMart" href="https://youtube.com">
                <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor">
                  <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
                </svg>
              </SocialIcon>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h4 className="text-sm font-extrabold tracking-[0.18em] text-cream-50/50 uppercase">Jelajahi</h4>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-0 text-sm font-semibold text-cream-50/80 transition-colors hover:text-sun-400"
                  >
                    <span className="w-0 overflow-hidden transition-all duration-300 group-hover:w-3 group-hover:pr-1 text-sun-400">→</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.14}>
            <h4 className="text-sm font-extrabold tracking-[0.18em] text-cream-50/50 uppercase">Kategori</h4>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.name}>
                  <Link
                    href={`/belanja?kategori=${encodeURIComponent(c.name)}`}
                    className="group inline-flex items-center text-sm font-semibold text-cream-50/80 transition-colors hover:text-sun-400"
                  >
                    <span className="w-0 overflow-hidden transition-all duration-300 group-hover:w-3 group-hover:pr-1 text-sun-400">→</span>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <h4 className="text-sm font-extrabold tracking-[0.18em] text-cream-50/50 uppercase">Hubungi Kami</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream-50/80">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-sun-400" />
                halo@lokalMart.id
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-sun-400" />
                +62 812 3456 7890
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sun-400" />
                Jl. Kreasi Lokal No. 17, Jakarta Selatan
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-cream-50/10 py-6 text-xs text-cream-50/45 md:flex-row">
          <p>© 2026 LokalMart — Demo frontend. Toko, produk, dan angka bersifat ilustratif.</p>
          <p className="font-bold tracking-wide">Belanja Lokal, Dampak Maksimal.</p>
        </div>
      </div>

      <div className="pointer-events-none -mb-[3vw] select-none text-center text-[16vw] leading-none font-extrabold tracking-tight text-cream-50/[0.04]" aria-hidden>
        LokalMart
      </div>
    </footer>
  );
}
