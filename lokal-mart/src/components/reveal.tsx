"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${
        light ? "text-sun-400" : "text-clay-600"
      }`}
    >
      <span className={`h-px w-6 ${light ? "bg-sun-400" : "bg-clay-500"}`} aria-hidden />
      {children}
    </p>
  );
}
