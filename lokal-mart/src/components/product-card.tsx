"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Check, Heart, ShoppingBag, Star, Store } from "lucide-react";
import type { Product } from "@/lib/products";
import { rupiah } from "@/lib/format";
import { useStore } from "@/lib/store";

const BADGE_STYLE: Record<NonNullable<Product["badge"]>, string> = {
  "Best Seller": "bg-clay-500 text-white",
  "Produk Lokal": "bg-forest-700 text-cream-50",
  Baru: "bg-sun-400 text-ink-950",
  Terbatas: "bg-ink-900 text-cream-50",
};

export default function ProductCard({
  product,
  index = 0,
  onSelect,
}: {
  product: Product;
  index?: number;
  onSelect?: (p: Product) => void;
}) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const wished = wishlist.includes(product.id);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: (index % 4) * 0.07 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-28px_rgba(20,45,34,0.4)]"
    >
      <button
        type="button"
        onClick={() => onSelect?.(product)}
        className="relative block w-full cursor-pointer overflow-hidden rounded-t-3xl text-left"
        aria-label={`Lihat detail ${product.name}`}
      >
        <motion.div layoutId={`product-image-${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-cream-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </motion.div>
        {product.badge && (
          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase shadow-sm ${BADGE_STYLE[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.82 }}
        onClick={() => toggleWishlist(product.id)}
        aria-label={wished ? `Hapus ${product.name} dari wishlist` : `Simpan ${product.name} ke wishlist`}
        aria-pressed={wished}
        className="absolute top-3 right-3 grid size-9 cursor-pointer place-items-center rounded-full bg-cream-50/90 shadow-sm ring-1 ring-forest-900/10 backdrop-blur transition-colors hover:bg-cream-50"
      >
        <motion.span
          key={String(wished)}
          initial={{ scale: wished ? 1.4 : 1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 16 }}
        >
          <Heart
            className={`size-4 transition-colors ${
              wished ? "fill-clay-500 text-clay-500" : "text-ink-600"
            }`}
          />
        </motion.span>
      </motion.button>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-[11px] font-bold tracking-[0.14em] text-forest-600 uppercase">
          {product.categories[0]}
        </p>
        <button
          type="button"
          onClick={() => onSelect?.(product)}
          className="mt-1 cursor-pointer text-left text-[15px] leading-snug font-bold text-ink-950 transition-colors hover:text-forest-700"
        >
          {product.name}
        </button>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-500">
          <Store className="size-3.5 shrink-0" />
          <span className="truncate">
            {product.umkm} · {product.location}
          </span>
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-xs">
          <Star className="size-3.5 fill-sun-500 text-sun-500" />
          <span className="font-bold text-ink-900">{product.rating.toFixed(1).replace(".", ",")}</span>
          <span className="text-ink-500">({product.reviews.toLocaleString("id-ID")} ulasan)</span>
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-forest-900/5 pt-3">
          <div>
            {product.oldPrice && (
              <p className="text-xs font-semibold text-ink-500 line-through">
                {rupiah(product.oldPrice)}
              </p>
            )}
            <p className="text-lg leading-tight font-extrabold text-forest-800">
              {rupiah(product.price)}
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={handleAdd}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl px-3.5 text-sm font-extrabold shadow-sm transition-colors ${
              added
                ? "bg-forest-500 text-cream-50"
                : "bg-forest-700 text-cream-50 hover:bg-forest-800"
            }`}
          >
            {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
            {added ? "Masuk" : "Tambah"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/5" aria-hidden>
      <div className="aspect-[4/5] animate-pulse bg-cream-200" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-cream-200" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-cream-200" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-cream-200" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-24 animate-pulse rounded-full bg-cream-200" />
          <div className="h-10 w-24 animate-pulse rounded-xl bg-cream-200" />
        </div>
      </div>
    </div>
  );
}
