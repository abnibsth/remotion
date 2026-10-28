"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";
import { Kicker, Reveal } from "@/components/reveal";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import ProductModal from "@/components/product-modal";

export default function FeaturedProducts() {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  // Simulasi fetch singkat agar skeleton loading terlihat.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 700);
    return () => window.clearTimeout(t);
  }, []);

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);

  return (
    <section id="pilihan" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <Kicker>Kurasi Mingguan</Kicker>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-950 md:text-5xl">
              Pilihan Lokal Minggu Ini
            </h2>
            <p className="mt-3 max-w-xl text-ink-600">
              Delapan produk yang paling banyak dicari minggu ini — dipilih langsung
              dari dapur, studio, dan bengkel para pembuatnya.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="/belanja"
              className="group inline-flex items-center gap-1.5 text-sm font-extrabold text-forest-700"
            >
              Lihat semua
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {!ready
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onSelect={setSelected} />
              ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-xs text-ink-500"
        >
          Semua toko dan produk di LokalMart adalah demo ilustratif.
        </motion.p>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
