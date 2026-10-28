"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch, Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "@/lib/products";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import { Kicker } from "@/components/reveal";

type SortKey = "populer" | "harga-asc" | "harga-desc" | "rating";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "populer", label: "Paling Populer" },
  { key: "rating", label: "Rating Tertinggi" },
  { key: "harga-asc", label: "Harga Terendah" },
  { key: "harga-desc", label: "Harga Tertinggi" },
];

function BelanjaInner() {
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category | "Semua">("Semua");
  const [sort, setSort] = useState<SortKey>("populer");
  const [selected, setSelected] = useState<Product | null>(null);
  const [prevParams, setPrevParams] = useState(params);

  // Sinkronkan state dengan ?q= / ?kategori= dari URL saat params berubah.
  // Pola "adjust state during render" — bukan effect.
  if (prevParams !== params) {
    setPrevParams(params);
    setQ(params.get("q") ?? "");
    const k = params.get("kategori");
    setCategory(k && CATEGORIES.some((c) => c.name === k) ? (k as Category) : "Semua");
  }

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      const matchQ =
        !needle ||
        p.name.toLowerCase().includes(needle) ||
        p.umkm.toLowerCase().includes(needle) ||
        p.location.toLowerCase().includes(needle) ||
        p.categories.some((c) => c.toLowerCase().includes(needle));
      const matchCat = category === "Semua" || p.categories.includes(category);
      return matchQ && matchCat;
    });
    const sorted = [...filtered];
    switch (sort) {
      case "harga-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "harga-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => b.reviews - a.reviews);
    }
    return sorted;
  }, [q, category, sort]);

  return (
    <main className="pt-24 pb-24 md:pt-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Kicker>Katalog</Kicker>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-950 md:text-5xl">
          Belanja Produk Lokal
        </h1>
        <p className="mt-3 max-w-xl text-ink-600">
          Cari berdasarkan nama produk atau nama UMKM, saring per kategori, dan
          urutkan sesuai kebutuhanmu.
        </p>

        {/* Controls */}
        <div className="sticky top-16 z-30 mt-8 rounded-3xl bg-cream-50/90 p-4 ring-1 ring-forest-900/10 backdrop-blur-md md:top-20 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-ink-500" />
              <span className="sr-only">Cari produk</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari kopi, tote bag, madu…"
                className="h-12 w-full rounded-2xl bg-white pr-10 pl-11 text-sm font-semibold text-ink-900 ring-1 ring-forest-900/10 outline-none transition-shadow placeholder:text-ink-500/70 focus:ring-2 focus:ring-forest-600"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  aria-label="Bersihkan pencarian"
                  className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ink-500 hover:bg-forest-50"
                >
                  <X className="size-4" />
                </button>
              )}
            </label>
            <label className="lg:w-56">
              <span className="sr-only">Urutkan</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-12 w-full cursor-pointer rounded-2xl bg-white px-4 text-sm font-bold text-ink-900 ring-1 ring-forest-900/10 outline-none focus:ring-2 focus:ring-forest-600"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {(["Semua", ...CATEGORIES.map((c) => c.name)] as const).map((c) => {
              const active = category === c;
              return (
                <motion.button
                  key={c}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-extrabold whitespace-nowrap transition-all duration-300 ${
                    active
                      ? "bg-forest-700 text-cream-50 shadow-md shadow-forest-700/25"
                      : "bg-white text-ink-600 ring-1 ring-forest-900/10 hover:bg-forest-50 hover:text-forest-700"
                  }`}
                >
                  {c}
                </motion.button>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-ink-500" aria-live="polite">
          Menampilkan {results.length} dari {PRODUCTS.length} produk
          {category !== "Semua" && <> dalam kategori <strong className="text-forest-700">{category}</strong></>}
          {q && <> untuk “<strong className="text-forest-700">{q}</strong>”</>}
        </p>

        {/* Grid */}
        {!ready ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid place-items-center rounded-[2rem] bg-white py-20 text-center ring-1 ring-forest-900/5"
          >
            <div>
              <div className="mx-auto grid size-24 place-items-center rounded-full bg-forest-50">
                <PackageSearch className="size-10 text-forest-400" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-ink-950">
                Tidak ada produk yang cocok
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
                Coba kata kunci lain, atau reset filter untuk melihat semua produk
                lokal yang tersedia.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setCategory("Semua");
                  setSort("populer");
                }}
                className="mt-6 inline-flex h-11 cursor-pointer items-center rounded-full bg-forest-700 px-6 text-sm font-extrabold text-cream-50 transition-colors hover:bg-forest-800"
              >
                Reset Filter
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence initial={false} mode="popLayout">
              {results.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
                  transition={{ type: "spring", stiffness: 240, damping: 26 }}
                >
                  <ProductCard product={p} index={i} onSelect={setSelected} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

export default function BelanjaPage() {
  return (
    <Suspense fallback={null}>
      <BelanjaInner />
    </Suspense>
  );
}
