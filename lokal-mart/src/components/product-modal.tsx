"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck, X } from "lucide-react";
import type { Product } from "@/lib/products";
import { rupiah } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {product && (
        <ProductModalInner key={product.id} product={product} onClose={onClose} />
      )}
    </AnimatePresence>
  );
}

function ProductModalInner({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  const wished = product ? wishlist.includes(product.id) : false;

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-forest-950/55 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="absolute inset-0 overflow-y-auto p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
          >
            <div
              className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] bg-cream-50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup detail produk"
                className="absolute top-4 right-4 z-10 grid size-10 cursor-pointer place-items-center rounded-full bg-cream-50/90 text-ink-700 shadow-md ring-1 ring-forest-900/10 backdrop-blur transition-transform duration-300 hover:rotate-90"
              >
                <X className="size-4.5" />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[560px]">
                  <motion.div
                    layoutId={`product-image-${product.id}`}
                    className="absolute inset-0 overflow-hidden bg-cream-100"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>
                  {product.badge && (
                    <span className="absolute top-4 left-4 rounded-full bg-forest-700 px-3 py-1 text-[11px] font-extrabold tracking-wide text-cream-50 uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-4 p-6 md:overflow-y-auto md:p-8">
                  <p className="text-[11px] font-bold tracking-[0.16em] text-clay-600 uppercase">
                    {product.categories.join(" · ")}
                  </p>
                  <h3 className="text-2xl leading-tight font-extrabold tracking-tight text-ink-950 md:text-3xl">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="flex items-center gap-1">
                      <Star className="size-4 fill-sun-500 text-sun-500" />
                      <span className="font-extrabold text-ink-900">
                        {product.rating.toFixed(1).replace(".", ",")}
                      </span>
                      <span className="text-ink-500">
                        ({product.reviews.toLocaleString("id-ID")} ulasan)
                      </span>
                    </span>
                    <span className="text-ink-500">
                      oleh <strong className="text-forest-700">{product.umkm}</strong> · {product.location}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-ink-600">{product.description}</p>

                  <div className="rounded-2xl bg-white p-4 ring-1 ring-forest-900/5">
                    <p className="text-xs font-bold tracking-wide text-forest-600 uppercase">
                      Cerita di balik produk
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600 italic">
                      “{product.story}”
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center rounded-full bg-white ring-1 ring-forest-900/10">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        aria-label="Kurangi jumlah"
                        className="grid size-10 cursor-pointer place-items-center rounded-full text-ink-600 hover:text-forest-700"
                      >
                        <Minus className="size-4" />
                      </motion.button>
                      <span className="relative grid w-10 place-items-center text-center text-sm font-extrabold">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={qty}
                            initial={{ y: qty > 0 ? 12 : -12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: qty > 0 ? -12 : 12, opacity: 0 }}
                            transition={{ duration: 0.16 }}
                          >
                            {qty}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setQty((q) => Math.min(99, q + 1))}
                        aria-label="Tambah jumlah"
                        className="grid size-10 cursor-pointer place-items-center rounded-full text-ink-600 hover:text-forest-700"
                      >
                        <Plus className="size-4" />
                      </motion.button>
                    </div>
                    <div className="text-right">
                      {product.oldPrice && (
                        <p className="text-xs font-semibold text-ink-500 line-through">
                          {rupiah(product.oldPrice * qty)}
                        </p>
                      )}
                      <p className="text-2xl font-extrabold text-forest-800">
                        {rupiah(product.price * qty)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCart(product.id, qty)}
                      className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-forest-700 text-sm font-extrabold text-cream-50 shadow-lg shadow-forest-700/25 transition-colors hover:bg-forest-800"
                    >
                      <ShoppingBag className="size-4.5" />
                      Tambah ke Keranjang
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={wished ? "Hapus dari wishlist" : "Simpan ke wishlist"}
                      aria-pressed={wished}
                      className="grid size-12 cursor-pointer place-items-center rounded-2xl bg-white ring-1 ring-forest-900/10 hover:bg-forest-50"
                    >
                      <Heart
                        className={`size-5 transition-colors ${
                          wished ? "fill-clay-500 text-clay-500" : "text-ink-600"
                        }`}
                      />
                    </motion.button>
                  </div>

                  <ul className="space-y-2 text-xs text-ink-500">
                    <li className="flex items-center gap-2">
                      <Truck className="size-4 shrink-0 text-forest-500" />
                      Dikirim dari {product.location} · estimasi 1–3 hari (ilustrasi)
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-forest-500" />
                      Barang rusak saat pengiriman dijamin diganti (ilustrasi)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-forest-500" />
                      Berat bersih {product.weight}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
