"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Banknote, Landmark, LoaderCircle, Lock, ShoppingBag, Wallet } from "lucide-react";
import { rupiah } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Kicker } from "@/components/reveal";

type Payment = "transfer" | "ewallet" | "cod";

const PAYMENTS: { key: Payment; label: string; detail: string; icon: typeof Landmark }[] = [
  { key: "transfer", label: "Transfer Bank", detail: "BCA · BNI · Mandiri (ilustrasi)", icon: Landmark },
  { key: "ewallet", label: "E-Wallet", detail: "GoPay · OVO · DANA (ilustrasi)", icon: Wallet },
  { key: "cod", label: "Bayar di Tempat", detail: "Tunai saat pesanan tiba", icon: Banknote },
];

type Errors = Partial<Record<"name" | "email" | "phone" | "address" | "city" | "postal", string>>;

const FREE_SHIPPING_THRESHOLD = 200000;
const SHIPPING_FLAT = 15000;

export default function CheckoutPage() {
  const { cartLines, subtotal, hydrated, clearCart, pushToast } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postal: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [payment, setPayment] = useState<Payment>("transfer");
  const [processing, setProcessing] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (form.name.trim().length < 3) e.name = "Nama minimal 3 karakter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid.";
    if (!/^(\+62|62|0)8\d{7,12}$/.test(form.phone.replace(/[\s-]/g, "")))
      e.phone = "Gunakan nomor HP Indonesia, mis. 0812xxxxxxx.";
    if (form.address.trim().length < 10) e.address = "Alamat terlalu pendek — tulis lengkap ya.";
    if (!form.city.trim()) e.city = "Kota/kabupaten wajib diisi.";
    if (!/^\d{5}$/.test(form.postal)) e.postal = "Kode pos 5 digit angka.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function placeOrder() {
    if (!validate()) {
      pushToast("Form belum lengkap", "Periksa kembali data pengirimanmu.");
      return;
    }
    setProcessing(true);
    // Simulasi pemrosesan pesanan di sisi frontend.
    window.setTimeout(() => {
      const orderId = `LM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      window.sessionStorage.setItem(
        "lokal-mart:order",
        JSON.stringify({
          id: orderId,
          name: form.name,
          email: form.email,
          payment: PAYMENTS.find((p) => p.key === payment)?.label ?? payment,
          itemCount: cartLines.reduce((n, l) => n + l.qty, 0),
          total,
          date: new Date().toISOString(),
        }),
      );
      clearCart();
      router.push("/checkout/sukses");
    }, 900);
  }

  if (hydrated && cartLines.length === 0 && !processing) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-5 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[2rem] bg-white p-10 text-center ring-1 ring-forest-900/5"
        >
          <div className="mx-auto grid size-24 place-items-center rounded-full bg-forest-50">
            <ShoppingBag className="size-10 text-forest-300" />
          </div>
          <h1 className="mt-5 text-xl font-extrabold text-ink-950">
            Tidak ada yang bisa di-checkout
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Keranjangmu kosong. Pilih dulu produk lokal yang kamu mau.
          </p>
          <a
            href="/belanja"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-forest-700 px-6 text-sm font-extrabold text-cream-50 transition-colors hover:bg-forest-800"
          >
            Mulai Belanja
          </a>
        </motion.div>
      </main>
    );
  }

  const field =
    "h-12 w-full rounded-2xl bg-white px-4 text-sm font-semibold text-ink-900 ring-1 outline-none transition-shadow placeholder:text-ink-500/60 focus:ring-2 focus:ring-forest-600";

  return (
    <main className="pt-24 pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Kicker>Langkah Terakhir</Kicker>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-950 md:text-5xl">
          Checkout
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
          <Lock className="size-3.5 text-forest-600" />
          Demo simulasi — tidak ada pembayaran nyata yang diproses.
        </p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <section className="rounded-[2rem] bg-white p-6 ring-1 ring-forest-900/5 md:p-8">
            <h2 className="text-lg font-extrabold text-ink-950">Data Pengiriman</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-ink-600">Nama Lengkap</span>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="cth. Putri Ayu Lestari"
                  className={field}
                />
                <FieldError msg={errors.name} />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold text-ink-600">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="nama@email.com"
                  className={field}
                />
                <FieldError msg={errors.email} />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold text-ink-600">No. WhatsApp</span>
                <input
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="0812xxxxxxx"
                  className={field}
                />
                <FieldError msg={errors.phone} />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-ink-600">Alamat Lengkap</span>
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                  rows={3}
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink-900 ring-1 ring-forest-900/10 outline-none transition-shadow placeholder:text-ink-500/60 focus:ring-2 focus:ring-forest-600"
                />
                <FieldError msg={errors.address} />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold text-ink-600">Kota / Kabupaten</span>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="cth. Bandung"
                  className={field}
                />
                <FieldError msg={errors.city} />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold text-ink-600">Kode Pos</span>
                <input
                  inputMode="numeric"
                  maxLength={5}
                  value={form.postal}
                  onChange={(e) => set("postal", e.target.value.replace(/\D/g, ""))}
                  placeholder="40123"
                  className={field}
                />
                <FieldError msg={errors.postal} />
              </label>
            </div>

            <h2 className="mt-8 text-lg font-extrabold text-ink-950">Metode Pembayaran</h2>
            <p className="mt-1 text-xs text-ink-500">
              Pilihan berikut hanya simulasi UI — tidak ada transaksi diproses.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Metode pembayaran">
              {PAYMENTS.map((p) => {
                const active = payment === p.key;
                const Icon = p.icon;
                return (
                  <motion.button
                    key={p.key}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPayment(p.key)}
                    role="radio"
                    aria-checked={active}
                    className={`cursor-pointer rounded-2xl p-4 text-left ring-1 transition-all duration-300 ${
                      active
                        ? "bg-forest-50 ring-2 ring-forest-700"
                        : "bg-white ring-forest-900/10 hover:ring-forest-300"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <Icon className={`size-5 ${active ? "text-forest-700" : "text-ink-500"}`} />
                      <motion.span
                        initial={false}
                        animate={{ scale: active ? 1 : 0 }}
                        className="grid size-5 place-items-center rounded-full bg-forest-700 text-[10px] font-extrabold text-cream-50"
                      >
                        ✓
                      </motion.span>
                    </span>
                    <span className="mt-3 block text-sm font-extrabold text-ink-950">{p.label}</span>
                    <span className="mt-0.5 block text-xs text-ink-500">{p.detail}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={placeOrder}
                disabled={processing}
                className="inline-flex h-13 min-w-56 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-forest-700 px-6 text-sm font-extrabold text-cream-50 shadow-lg shadow-forest-700/25 transition-colors hover:bg-forest-800 disabled:cursor-wait disabled:opacity-80"
              >
                {processing ? (
                  <>
                    <LoaderCircle className="size-4.5 animate-spin" />
                    Memproses…
                  </>
                ) : (
                  <>Buat Pesanan — {rupiah(total)}</>
                )}
              </motion.button>
              <p className="text-xs text-ink-500 sm:max-w-56">
                Dengan membuat pesanan, kamu menyetujui syarat demo ini.
              </p>
            </div>
          </section>

          {/* Summary */}
          <aside className="rounded-[2rem] bg-white p-6 ring-1 ring-forest-900/5 lg:sticky lg:top-24">
            <h2 className="text-lg font-extrabold text-ink-950">Ringkasan Pesanan</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {cartLines.map((l) => (
                <li key={l.id} className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                    <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-950">{l.name}</p>
                    <p className="text-xs text-ink-500">
                      {l.qty} × {rupiah(l.price)}
                    </p>
                  </div>
                  <p className="text-sm font-extrabold text-forest-800">
                    {rupiah(l.price * l.qty)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-forest-900/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Subtotal</dt>
                <dd className="font-bold text-ink-900">{rupiah(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Ongkos kirim</dt>
                <dd className="font-bold text-ink-900">
                  {shipping === 0 ? (
                    <span className="text-forest-600">Gratis (ilustrasi)</span>
                  ) : (
                    rupiah(shipping)
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-forest-900/10 pt-3 text-base">
                <dt className="font-extrabold text-ink-950">Total</dt>
                <dd className="font-extrabold text-forest-800">{rupiah(total)}</dd>
              </div>
            </dl>
            {shipping > 0 && (
              <p className="mt-3 rounded-xl bg-cream-100 px-3 py-2 text-xs font-semibold text-ink-600">
                Belanja {rupiah(FREE_SHIPPING_THRESHOLD - subtotal)} lagi untuk gratis ongkir.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.span
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 6 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          className="block overflow-hidden text-xs font-semibold text-clay-600"
          role="alert"
        >
          {msg}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
