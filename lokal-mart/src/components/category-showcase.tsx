"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { Kicker, Reveal } from "@/components/reveal";

const SPANS = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export default function CategoryShowcase() {
  return (
    <section id="kategori" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <Kicker>Kategori</Kicker>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-950 md:text-5xl">
              Jelajahi Sesuai Selera
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/belanja"
              className="group inline-flex items-center gap-1.5 text-sm font-extrabold text-forest-700"
            >
              Lihat semua produk
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid auto-rows-[190px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[220px] md:gap-5 lg:grid-cols-12">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 110, damping: 20, delay: i * 0.06 }}
              className={SPANS[i]}
            >
              <Link
                href={`/belanja?kategori=${encodeURIComponent(c.name)}`}
                className="group relative block h-full w-full overflow-hidden rounded-3xl bg-forest-950"
                aria-label={`Kategori ${c.name}`}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/25 to-transparent" aria-hidden />
                <span className="absolute inset-0 bg-forest-600/0 transition-colors duration-500 group-hover:bg-forest-600/20" aria-hidden />
                <span className="absolute top-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full bg-cream-50 text-forest-800 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="size-4.5" />
                </span>
                <span className="absolute right-0 bottom-0 left-0 p-5 text-cream-50 md:p-6">
                  <span className="block text-xs font-semibold text-cream-50/70">{c.blurb}</span>
                  <span className="mt-0.5 block text-xl font-extrabold tracking-tight md:text-2xl">
                    {c.name}
                  </span>
                  <span className="mt-1 block text-[11px] font-bold tracking-wide text-cream-50/60 uppercase">
                    {c.count} produk
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
