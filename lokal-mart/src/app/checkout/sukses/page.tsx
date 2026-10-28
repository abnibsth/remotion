"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CircleCheck, Mail } from "lucide-react";
import { useSyncExternalStore } from "react";
import { rupiah } from "@/lib/format";

type Order = {
  id: string;
  name: string;
  email: string;
  payment: string;
  itemCount: number;
  total: number;
  date: string;
};

const ORDER_KEY = "lokal-mart:order";
const noopSubscribe = () => () => {};

let cachedOrder: Order | null | undefined;

function readOrderOnce(): Order | null {
  if (cachedOrder === undefined) {
    try {
      const raw = window.sessionStorage.getItem(ORDER_KEY);
      cachedOrder = raw ? (JSON.parse(raw) as Order) : null;
    } catch {
      cachedOrder = null;
    }
  }
  return cachedOrder;
}

export default function CheckoutSuccessPage() {
  const order = useSyncExternalStore(noopSubscribe, readOrderOnce, () => null);

  return (
    <main className="grid min-h-[80vh] place-items-center px-5 pt-24 pb-16">
      {!order ? (
        <div className="w-full max-w-md rounded-[2rem] bg-white p-10 text-center ring-1 ring-forest-900/5">
          <h1 className="text-xl font-extrabold text-ink-950">Belum ada pesanan</h1>
          <p className="mt-2 text-sm text-ink-500">
            Halaman ini menampilkan konfirmasi setelah simulasi checkout dijalankan.
          </p>
          <Link
            href="/belanja"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-forest-700 px-6 text-sm font-extrabold text-cream-50 transition-colors hover:bg-forest-800"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center ring-1 ring-forest-900/5 md:p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.15 }}
            className="mx-auto grid size-24 place-items-center rounded-full bg-forest-700 shadow-xl shadow-forest-700/30"
          >
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.35 }}
            >
              <CircleCheck className="size-12 text-cream-50" strokeWidth={2.4} />
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-ink-950 md:text-4xl">
              Pesanan Diterima!
            </h1>
            <p className="mt-2 text-ink-600">
              Terima kasih, <strong className="text-forest-700">{order?.name}</strong>. Pesananmu
              sudah kami terima dan (dalam demo ini) langsung “diproses”.
            </p>

            {order && (
              <>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-50 px-5 py-2.5 ring-1 ring-forest-700/15">
                  <span className="text-xs font-bold text-ink-500 uppercase">No. Pesanan</span>
                  <span className="font-mono text-sm font-extrabold text-forest-700">{order.id}</span>
                </div>

                <dl className="mt-7 space-y-2.5 rounded-2xl bg-cream-50 p-5 text-left text-sm ring-1 ring-forest-900/5">
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Jumlah barang</dt>
                    <dd className="font-bold text-ink-900">{order.itemCount} pcs</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Metode pembayaran</dt>
                    <dd className="font-bold text-ink-900">{order.payment}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Total dibayar</dt>
                    <dd className="font-extrabold text-forest-800">{rupiah(order.total)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Konfirmasi dikirim ke</dt>
                    <dd className="flex items-center gap-1 font-bold text-ink-900">
                      <Mail className="size-3.5 text-forest-600" />
                      {order.email}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-xs text-ink-500">
                  Catatan: checkout LokalMart versi demo hanya simulasi frontend — tidak ada
                  pembayaran atau pengiriman nyata.
                </p>
              </>
            )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/belanja"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-forest-700 px-7 text-sm font-extrabold text-cream-50 shadow-lg shadow-forest-700/25 transition-colors hover:bg-forest-800"
              >
                Lanjut Belanja
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-7 text-sm font-extrabold text-forest-800 ring-1 ring-forest-700/25 transition-colors hover:bg-forest-50"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
