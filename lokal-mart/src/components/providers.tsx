"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { StoreProvider } from "@/lib/store";
import Opening from "@/components/opening";
import CartDrawer from "@/components/cart-drawer";
import Toasts from "@/components/toasts";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <MotionConfig reducedMotion="user">
        <Opening />
        {children}
        <CartDrawer />
        <Toasts />
      </MotionConfig>
    </StoreProvider>
  );
}
