"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Magnetic from "@/components/magnetic";
import { Kicker, Reveal } from "@/components/reveal";

const MARQUEE = Array.from({ length: 8 });

const FLOATERS = [
  { src: "/images/products/kopi-nusantara.jpg", alt: "Kopi Nusantara", className: "top-10 left-10 w-32 lg:w-40 -rotate-8", duration: 6 },
  { src: "/images/products/kaos.jpg", alt: "Kaos brand lokal", className: "top-24 right-8 w-28 lg:w-36 rotate-6", duration: 7.5 },
  { src: "/images/products/keramik.jpg", alt: "Keramik handmade", className: "bottom-8 left-24 w-28 lg:w-32 rotate-3", duration: 8.5 },
  { src: "/images/products/sabun.jpg", alt: "Sabun natural", className: "bottom-12 right-20 w-24 lg:w-28 -rotate-6", duration: 7 },
];

export default function PromoBanner() {
  return (
    <section className="py-20 md:py-28" aria-label="Kampanye Bangga Buatan Indonesia">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-forest-800 px-6 pt-24 pb-14 text-center text-cream-50 md:px-16 md:pt-28 md:pb-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(251,247,239,0.12) 1.5px, transparent 1.5px)",
                backgroundSize: "22px 22px",
              }}
              aria-hidden
            />

            {/* Marquee strip */}
            <div className="absolute inset-x-[-4%] top-9 -rotate-1 bg-sun-400 py-2.5 shadow-lg md:top-12" aria-hidden>
              <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-sm font-extrabold tracking-[0.25em] text-forest-950 uppercase">
                {MARQUEE.map((_, i) => (
                  <span key={i} className="flex items-center gap-10">
                    Bangga Buatan Indonesia
                    <span className="inline-block size-2 rounded-full bg-forest-950" />
                  </span>
                ))}
              </div>
            </div>

            {/* Floating product shots */}
            {FLOATERS.map((f) => (
              <motion.div
                key={f.src}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.3 }}
                className={`pointer-events-none absolute hidden md:block ${f.className}`}
                aria-hidden
              >
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: f.duration, repeat: Infinity, ease: "easeInOut" }}
                  className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl ring-4 ring-cream-50/10"
                >
                  <Image src={f.src} alt="" fill sizes="160px" className="object-cover" />
                </motion.div>
              </motion.div>
            ))}

            <div className="relative mx-auto max-w-2xl">
              <Kicker light>Kampanye Spesial</Kicker>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
                Bangga{" "}
                <em className="font-display text-sun-400 italic">Buatan Indonesia.</em>
              </h2>
              <p className="mt-5 leading-relaxed text-cream-50/70">
                Jutaan cerita kecil, satu semangat besar. Pindahkan belanjamu ke
                produk lokal dan rasakan bedanya — kualitas yang tidak kalah,
                dampak yang jauh lebih besar.
              </p>
              <div className="mt-9">
                <Magnetic
                  href="/belanja"
                  strength={0.18}
                  className="inline-flex items-center gap-2 rounded-full bg-sun-400 px-8 py-4 text-sm font-extrabold text-forest-950 shadow-xl shadow-sun-500/25 transition-colors hover:bg-sun-300"
                >
                  Temukan Produk Lokal
                  <ArrowRight className="size-4" />
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
