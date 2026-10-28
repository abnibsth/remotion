"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import MobileMenu from "@/components/mobile-menu";

const LINKS = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/belanja", label: "Belanja", exact: true },
  { href: "/#kategori", label: "Kategori", exact: false },
  { href: "/#cerita", label: "Cerita UMKM", exact: false },
];

function CountBadge({ count, className }: { count: number; className: string }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className={className}
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const { introDone, cartCount, wishlist, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 32));

  return (
    <>
      <motion.header
        initial={{ y: -96, opacity: 0 }}
        animate={introDone ? { y: 0, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 130, damping: 19, delay: 0.15 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          scrolled
            ? "bg-cream-50/85 shadow-[0_1px_0_0_rgba(20,45,34,0.08),0_16px_40px_-24px_rgba(20,45,34,0.35)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="LokalMart — beranda">
            <span className="relative grid size-10 place-items-center rounded-xl bg-forest-700 text-cream-50 shadow-md shadow-forest-700/25 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <span className="text-lg font-extrabold leading-none">L</span>
              <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-sun-400 ring-2 ring-cream-50" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-ink-900">
              Lokal<span className="text-forest-600">Mart</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => {
              const active = l.exact ? pathname === l.href : pathname + "/" === l.href + "/";
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative py-2 text-sm font-bold transition-colors ${
                    active ? "text-forest-700" : "text-ink-600 hover:text-forest-700"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-clay-500 transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-2.5">
            <motion.span whileHover={{ y: -2, scale: 1.06 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/belanja"
                aria-label="Cari produk"
                className="grid size-10 place-items-center rounded-full text-ink-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
              >
                <Search className="size-[18px]" />
              </Link>
            </motion.span>

            <motion.span whileHover={{ y: -2, scale: 1.06 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative grid size-10 place-items-center rounded-full text-ink-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
              >
                <Heart className="size-[18px]" />
                <CountBadge
                  count={wishlist.length}
                  className="absolute -top-0.5 -right-0.5 grid min-w-[18px] place-items-center rounded-full bg-forest-700 px-1 text-[10px] font-extrabold text-cream-50"
                />
              </Link>
            </motion.span>

            <motion.span whileHover={{ y: -2, scale: 1.06 }} whileTap={{ scale: 0.9 }}>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Buka keranjang"
                className="relative grid size-10 place-items-center rounded-full text-ink-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
              >
                <ShoppingBag className="size-[18px]" />
                <CountBadge
                  count={cartCount}
                  className="absolute -top-0.5 -right-0.5 grid min-w-[18px] place-items-center rounded-full bg-clay-500 px-1 text-[10px] font-extrabold text-white"
                />
              </button>
            </motion.span>

            <motion.span whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }} className="lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Buka menu"
                className="grid size-10 place-items-center rounded-full text-ink-600 transition-colors hover:bg-forest-50"
              >
                <Menu className="size-5" />
              </button>
            </motion.span>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
