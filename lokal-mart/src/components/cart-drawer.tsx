"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { rupiah } from "@/lib/format";
import { useStore } from "@/lib/store";

const FREE_SHIPPING_THRESHOLD = 200000;

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartLines, subtotal, setQty, removeFromCart, cartCount } =
    useStore();
  const router = useRouter();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, setCartOpen]);

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-forest-950/55 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="absolute top-0 right-0 flex h-dvh w-full max-w-md flex-col bg-cream-50 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Keranjang belanja"
          >
            <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
              <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink-950">
                Keranjang
                {cartCount > 0 && (
                  <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-extrabold text-forest-700">
                    {cartCount} barang
                  </span>
                )}
              </h3>
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => setCartOpen(false)}
                aria-label="Tutup keranjang"
                className="grid size-10 cursor-pointer place-items-center rounded-full text-ink-600 transition-transform duration-300 hover:rotate-90 hover:bg-forest-50"
              >
                <X className="size-5" />
              </motion.button>
            </div>

            {cartLines.length > 0 && (
              <div className="border-b border-forest-900/10 px-5 pt-4 pb-5">
                <p className="text-xs font-semibold text-ink-600">
                  {remaining > 0 ? (
                    <>
                      Tambah <strong className="text-forest-700">{rupiah(remaining)}</strong> lagi
                      untuk gratis ongkir (ilustrasi)
                    </>
                  ) : (
                    <>
                      <strong className="text-forest-700">Selamat!</strong> Pesananmu dapat gratis
                      ongkir (ilustrasi)
                    </>
                  )}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-forest-100">
                  <motion.div
                    className="h-full rounded-full bg-forest-600"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5">
              {cartLines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 16 }}
                      className="mx-auto grid size-24 place-items-center rounded-full bg-forest-50"
                    >
                      <ShoppingBag className="size-10 text-forest-300" />
                    </motion.div>
                    <h4 className="mt-5 text-lg font-extrabold text-ink-950">
                      Keranjangmu masih kosong
                    </h4>
                    <p className="mx-auto mt-1 max-w-[240px] text-sm text-ink-500">
                      Yuk, temukan produk lokal favoritmu dan dukung UMKM Indonesia.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCartOpen(false);
                        router.push("/belanja");
                      }}
                      className="mt-6 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-forest-700 px-6 text-sm font-extrabold text-cream-50 transition-colors hover:bg-forest-800"
                    >
                      Mulai Belanja
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {cartLines.map((line) => (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 48, transition: { duration: 0.22 } }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        className="flex gap-3.5 rounded-3xl bg-white p-3 ring-1 ring-forest-900/5"
                      >
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-cream-100">
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-ink-950">{line.name}</p>
                          <p className="mt-0.5 text-xs text-ink-500">{line.umkm}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full bg-cream-100 ring-1 ring-forest-900/5">
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.8 }}
                                onClick={() => setQty(line.id, line.qty - 1)}
                                aria-label={`Kurangi ${line.name}`}
                                className="grid size-7 cursor-pointer place-items-center rounded-full text-ink-600 hover:text-forest-700"
                              >
                                <Minus className="size-3.5" />
                              </motion.button>
                              <span className="w-7 text-center text-xs font-extrabold">{line.qty}</span>
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.8 }}
                                onClick={() => setQty(line.id, line.qty + 1)}
                                aria-label={`Tambah ${line.name}`}
                                className="grid size-7 cursor-pointer place-items-center rounded-full text-ink-600 hover:text-forest-700"
                              >
                                <Plus className="size-3.5" />
                              </motion.button>
                            </div>
                            <p className="text-sm font-extrabold text-forest-800">
                              {rupiah(line.price * line.qty)}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.8 }}
                          onClick={() => removeFromCart(line.id)}
                          aria-label={`Hapus ${line.name} dari keranjang`}
                          className="h-fit cursor-pointer rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-clay-100 hover:text-clay-600"
                        >
                          <Trash2 className="size-4" />
                        </motion.button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {cartLines.length > 0 && (
              <div className="border-t border-forest-900/10 bg-white/70 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink-600">Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-extrabold text-ink-950"
                  >
                    {rupiah(subtotal)}
                  </motion.span>
                </div>
                <p className="mt-1 text-xs text-ink-500">
                  Ongkir dihitung saat checkout. Checkout pada demo ini hanya simulasi.
                </p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCartOpen(false);
                    router.push("/checkout");
                  }}
                  className="mt-4 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-forest-700 text-sm font-extrabold text-cream-50 shadow-lg shadow-forest-700/25 transition-colors hover:bg-forest-800"
                >
                  Lanjut ke Checkout
                  <ArrowRight className="size-4" />
                </motion.button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
