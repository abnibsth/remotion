"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

export default function Magnetic({
  children,
  href,
  className,
  strength = 0.22,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.25 });

  function onMove(e: MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}
