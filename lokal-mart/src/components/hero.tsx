"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import Magnetic from "@/components/magnetic";

const AVATARS = [
  "/images/products/kopi-nusantara.jpg",
  "/images/products/tote-bag.jpg",
  "/images/products/madu.jpg",
];

export default function Hero() {
  const { introDone } = useStore();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yDeco = useTransform(scrollYProgress, [0, 1], [0, 160]);

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: introDone ? { opacity: 1, y: 0 } : {},
    transition: { delay, type: "spring" as const, stiffness: 110, damping: 19 },
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-24"
      aria-label="Hero LokalMart"
    >
      {/* Decorations */}
      <motion.div style={{ y: yDeco }} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 -right-40 size-[560px] rounded-full bg-forest-100" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-24 right-[8%] hidden size-72 rounded-full border-2 border-dashed border-forest-200 lg:block"
        />
        <div
          className="absolute bottom-10 left-[6%] hidden size-44 opacity-70 lg:block"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-forest-300) 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute top-40 left-[42%] hidden size-3 rounded-full bg-sun-400 md:block" />
        <div className="absolute top-64 right-[38%] hidden size-2 rounded-full bg-clay-400 md:block" />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:gap-8">
        {/* Copy */}
        <motion.div style={{ y: yText }}>
          <motion.span
            {...reveal(0.15)}
            className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-xs font-bold text-forest-700 ring-1 ring-forest-900/10"
          >
            <span className="relative grid size-6 place-items-center rounded-full bg-forest-700">
              <span className="absolute inset-0 animate-ping rounded-full bg-forest-400 opacity-60" />
              <span className="relative size-1.5 rounded-full bg-sun-300" />
            </span>
            Marketplace UMKM Indonesia
          </motion.span>

          <h1 className="mt-5 text-[2.6rem] leading-[1.04] font-extrabold tracking-tight text-ink-950 md:text-6xl">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: "112%" }}
                animate={introDone ? { y: "0%" } : {}}
                transition={{ delay: 0.25, type: "spring", stiffness: 90, damping: 20 }}
              >
                Cerita Lokal,
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block"
                initial={{ y: "112%" }}
                animate={introDone ? { y: "0%" } : {}}
                transition={{ delay: 0.38, type: "spring", stiffness: 90, damping: 20 }}
              >
                Temukan{" "}
                <em className="font-display text-forest-700 italic">Favoritmu.</em>
              </motion.span>
            </span>
          </h1>

          <motion.p {...reveal(0.55)} className="mt-5 max-w-lg text-base leading-relaxed text-ink-600 md:text-lg">
            Dari kopi pegunungan Gayo sampai keramik Kasongan — semua dibuat tangan
            pelaku UMKM Indonesia. Setiap belanjaanmu memberi dampak langsung
            untuk mereka.
          </motion.p>

          <motion.div {...reveal(0.68)} className="mt-8 flex flex-wrap items-center gap-3.5">
            <Magnetic
              href="/belanja"
              className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-7 py-3.5 text-sm font-extrabold text-cream-50 shadow-lg shadow-forest-700/30 transition-colors hover:bg-forest-800"
            >
              Mulai Belanja
              <ArrowRight className="size-4" />
            </Magnetic>
            <Magnetic
              href="/#cerita"
              strength={0.14}
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-7 py-3.5 text-sm font-extrabold text-forest-800 ring-1 ring-forest-700/25 backdrop-blur transition-colors hover:bg-forest-50"
            >
              Jelajahi UMKM
            </Magnetic>
          </motion.div>

          <motion.div {...reveal(0.8)} className="mt-9 flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATARS.map((src) => (
                <span
                  key={src}
                  className="relative size-10 overflow-hidden rounded-full ring-2 ring-cream-50"
                >
                  <Image src={src} alt="" fill sizes="40px" className="object-cover" />
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-sun-500 text-sun-500" />
                ))}
                <span className="ml-1 text-sm font-extrabold text-ink-900">4,9</span>
              </div>
              <p className="text-xs text-ink-500">dari 12.400+ ulasan pembeli</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual composition */}
        <motion.div
          style={{ y: yVisual }}
          className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[500px] md:h-[560px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: 4 }}
            animate={introDone ? { opacity: 1, scale: 1, rotate: 2 } : {}}
            transition={{ delay: 0.45, type: "spring", stiffness: 90, damping: 18 }}
            className="absolute top-1/2 left-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.2rem] shadow-2xl shadow-forest-900/30">
              <Image
                src="/images/products/keramik.jpg"
                alt="Set cup keramik handmade dari Tanah Liat Studio"
                fill
                priority
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -14 }}
            animate={introDone ? { opacity: 1, y: 0, rotate: -8 } : {}}
            transition={{ delay: 0.62, type: "spring", stiffness: 110, damping: 16 }}
            className="absolute top-4 left-0 w-[34%]"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square overflow-hidden rounded-3xl shadow-xl shadow-forest-900/20 ring-4 ring-cream-50"
            >
              <Image
                src="/images/products/tote-bag.jpg"
                alt="Tote bag kanvas handmade"
                fill
                sizes="(max-width: 1024px) 30vw, 16vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 14 }}
            animate={introDone ? { opacity: 1, y: 0, rotate: 7 } : {}}
            transition={{ delay: 0.74, type: "spring", stiffness: 110, damping: 16 }}
            className="absolute right-0 bottom-20 w-[36%]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              className="relative aspect-square overflow-hidden rounded-3xl shadow-xl shadow-forest-900/20 ring-4 ring-cream-50"
            >
              <Image
                src="/images/products/cokelat.jpg"
                alt="Cokelat artisan 70% single origin"
                fill
                sizes="(max-width: 1024px) 30vw, 16vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, type: "spring", stiffness: 120, damping: 17 }}
            className="absolute bottom-2 left-4 md:left-10"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-xl shadow-forest-900/15 ring-1 ring-forest-900/5 backdrop-blur"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                <BadgeCheck className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-ink-900">100% Produk Lokal</span>
                <span className="block text-xs text-ink-500">Dikirim langsung oleh UMKM</span>
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
