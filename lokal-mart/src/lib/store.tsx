"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { getProduct, type Product } from "@/lib/products";

export type CartItem = { id: string; qty: number };
export type CartLine = Product & { qty: number };
export type Toast = { id: number; title: string; body?: string };

const CART_KEY = "lokal-mart:cart";
const WISHLIST_KEY = "lokal-mart:wishlist";
const INTRO_KEY = "lokal-mart:intro-done";

/* ------------------------------------------------------------------ */
/* External store (localStorage-backed) — dibaca lewat useSyncExternalStore */
/* ------------------------------------------------------------------ */

type Persisted = { cart: CartItem[]; wishlist: string[]; introDone: boolean };

const EMPTY: Persisted = { cart: [], wishlist: [], introDone: false };
let state: Persisted = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function ensureInit(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  let introDone = false;
  try {
    introDone = window.sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    /* private mode */
  }
  state = {
    cart: readJSON<CartItem[]>(CART_KEY, []),
    wishlist: readJSON<string[]>(WISHLIST_KEY, []),
    introDone,
  };
}

function getSnapshot(): Persisted {
  ensureInit();
  return state;
}

function getServerSnapshot(): Persisted {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(next: Partial<Persisted>, persist: boolean): void {
  state = { ...state, ...next };
  if (persist) {
    try {
      if (next.cart) window.localStorage.setItem(CART_KEY, JSON.stringify(next.cart));
      if (next.wishlist)
        window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next.wishlist));
    } catch {
      /* storage penuh / private mode */
    }
  }
  listeners.forEach((l) => l());
}

/* ------------------------------------------------------------------ */
/* Context                                                            */
/* ------------------------------------------------------------------ */

type StoreContextValue = {
  hydrated: boolean;
  introDone: boolean;
  finishIntro: () => void;
  cart: CartItem[];
  cartLines: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toasts: Toast[];
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const persisted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => {
      ensureInit();
      return initialized;
    },
    () => false,
  );
  const { cart, wishlist, introDone } = persisted;

  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (title: string, body?: string) => {
      const id = ++toastId.current;
      setToasts((prev) => [...prev.slice(-2), { id, title, body }]);
      window.setTimeout(() => dismissToast(id), 2800);
    },
    [dismissToast],
  );

  const finishIntro = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode */
    }
    update({ introDone: true }, false);
  }, []);

  const addToCart = useCallback(
    (id: string, qty = 1) => {
      const existing = state.cart.find((i) => i.id === id);
      const nextCart = existing
        ? state.cart.map((i) =>
            i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i,
          )
        : [...state.cart, { id, qty }];
      update({ cart: nextCart }, true);
      const product = getProduct(id);
      if (product) pushToast("Masuk keranjang", product.name);
    },
    [pushToast],
  );

  const setQty = useCallback((id: string, qty: number) => {
    const nextCart =
      qty <= 0
        ? state.cart.filter((i) => i.id !== id)
        : state.cart.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 99) } : i));
    update({ cart: nextCart }, true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    update({ cart: state.cart.filter((i) => i.id !== id) }, true);
  }, []);

  const clearCart = useCallback(() => {
    update({ cart: [] }, true);
  }, []);

  const toggleWishlist = useCallback(
    (id: string) => {
      const exists = state.wishlist.includes(id);
      const nextWishlist = exists
        ? state.wishlist.filter((w) => w !== id)
        : [...state.wishlist, id];
      update({ wishlist: nextWishlist }, true);
      const product = getProduct(id);
      if (product) {
        pushToast(exists ? "Dihapus dari wishlist" : "Disimpan ke wishlist", product.name);
      }
    },
    [pushToast],
  );

  const cartLines = useMemo(
    () =>
      cart
        .map((i) => {
          const product = getProduct(i.id);
          return product ? { ...product, qty: i.qty } : null;
        })
        .filter((l): l is CartLine => l !== null),
    [cart],
  );

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);
  const subtotal = useMemo(() => cartLines.reduce((s, l) => s + l.price * l.qty, 0), [cartLines]);

  const value = useMemo<StoreContextValue>(
    () => ({
      hydrated,
      introDone,
      finishIntro,
      cart,
      cartLines,
      cartCount,
      subtotal,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      cartOpen,
      setCartOpen,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      hydrated,
      introDone,
      finishIntro,
      cart,
      cartLines,
      cartCount,
      subtotal,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      cartOpen,
      toasts,
      pushToast,
      dismissToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
