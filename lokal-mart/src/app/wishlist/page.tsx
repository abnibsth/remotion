"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import { Kicker } from "@/components/reveal";

export default function WishlistPage() {
  const { wishlist, hydrated } = useStore();
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <main className="pt-24 pb-24 md:pt-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Kicker>Tersimpan</Kicker>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-950 md:text-5xl">
          Wishlist Kamu
        </h1>
        <p className="mt-3 max-w-xl text-ink-600">
          Produk lokal yang kamu simpan. Tekan ikon hati untuk menghapusnya dari
          daftar.
        </p>

        {!hydrated ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid place-items-center rounded-[2rem] bg-white py-20 text-center ring-1 ring-forest-900/5"
          >
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.15, 1] }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                className="mx-auto grid size-24 place-items-center rounded-full bg-clay-100"
              >
                <Heart className="size-10 fill-clay-500 text-clay-500" />
              </motion.div>
              <h2 className="mt-5 text-xl font-extrabold text-ink-950">
                Belum ada yang disimpan
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
                Tekan ikon hati pada produk yang kamu suka, nanti muncul di sini
                biar gampang ditemukan lagi.
              </p>
              <a
                href="/belanja"
                className="mt-6 inline-flex h-11 items-center rounded-full bg-forest-700 px-6 text-sm font-extrabold text-cream-50 transition-colors hover:bg-forest-800"
              >
                Jelajahi Produk Lokal
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((id, i) => {
              const product = PRODUCTS.find((p) => p.id === id);
              return product ? (
                <ProductCard key={id} product={product} index={i} onSelect={setSelected} />
              ) : null;
            })}
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
