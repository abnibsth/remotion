"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, X } from "lucide-react";
import { useStore } from "@/lib/store";

export default function Toasts() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[90] flex flex-col items-end gap-2 md:right-6 md:bottom-6">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            type="button"
            onClick={() => dismissToast(t.id)}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 12, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="pointer-events-auto flex w-72 cursor-pointer items-start gap-3 rounded-2xl bg-forest-950/95 px-4 py-3 text-left text-cream-50 shadow-2xl ring-1 ring-cream-50/10 backdrop-blur"
            aria-label={`Tutup notifikasi: ${t.title}`}
          >
            <CircleCheck className="mt-0.5 size-4.5 shrink-0 text-sun-400" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{t.title}</span>
              {t.body && <span className="mt-0.5 block truncate text-xs text-cream-50/65">{t.body}</span>}
            </span>
            <X className="mt-0.5 size-3.5 shrink-0 text-cream-50/40" />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
