"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/belanja", label: "Belanja" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/#kategori", label: "Kategori" },
  { href: "/#cerita", label: "Cerita UMKM" },
];

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex flex-col bg-forest-950/97 px-6 pb-10 pt-5 backdrop-blur-md lg:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-cream-50">
              Lokal<span className="text-sun-400">Mart</span>
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
              aria-label="Tutup menu"
              className="grid size-11 place-items-center rounded-full bg-cream-50/10 text-cream-50"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          <nav className="mt-14 flex flex-col gap-2">
            {LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: 0.08 + i * 0.06, type: "spring", stiffness: 200, damping: 24 }}
              >
                <Link
                  href={l.href}
                  onClick={onClose}
                  className={`flex items-center justify-between border-b border-cream-50/10 py-4 text-3xl font-extrabold tracking-tight ${
                    pathname === l.href ? "text-sun-400" : "text-cream-50"
                  }`}
                >
                  {l.label}
                  <svg viewBox="0 0 24 24" className="size-6 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-auto text-sm text-cream-50/50"
          >
            Belanja Lokal, Dampak Maksimal.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
