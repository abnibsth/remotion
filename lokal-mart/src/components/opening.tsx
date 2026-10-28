"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const WORD = "LokalMart".split("");

export default function Opening() {
  const { introDone, finishIntro } = useStore();
  const [phase, setPhase] = useState<"idle" | "leaving">("idle");
  const show = !introDone && phase === "idle";

  useEffect(() => {
    if (introDone) return;
    const t = window.setTimeout(() => setPhase("leaving"), 1650);
    return () => window.clearTimeout(t);
  }, [introDone]);

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {show && (
        <motion.div
          key="opening"
          onClick={() => setPhase("leaving")}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-forest-950 select-none"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          aria-label="Pembuka LokalMart"
        >
          <motion.div
            initial={{ scale: 0, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="relative mb-6 grid size-16 place-items-center rounded-2xl bg-forest-700 shadow-2xl shadow-forest-500/20"
          >
            <span className="text-3xl font-extrabold text-cream-50">L</span>
            <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-sun-400 ring-4 ring-forest-950" />
          </motion.div>

          <div className="flex overflow-hidden text-4xl font-extrabold tracking-tight md:text-5xl">
            {WORD.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.28 + i * 0.045 }}
                className={i < 5 ? "text-cream-50" : "text-sun-400"}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.4, ease: "easeOut" }}
            className="mt-3 text-sm font-medium tracking-wide text-cream-50/60"
          >
            Belanja Lokal, Dampak Maksimal.
          </motion.p>

          <div className="mt-8 h-1 w-44 overflow-hidden rounded-full bg-cream-50/15">
            <motion.div
              className="h-full rounded-full bg-sun-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.15, ease: "easeInOut", delay: 0.4 }}
              onAnimationComplete={() => setPhase("leaving")}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
