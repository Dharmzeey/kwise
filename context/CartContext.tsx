"use client";
/**
 * Kwise World — Cart context.
 *
 * Persists to localStorage.  Provides helpers used by all cart-related UI.
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { CartItem, ProductListItem } from "@/lib/types";
import { clamp } from "@/lib/utils";

interface CartContextValue {
  items: CartItem[];
  /** Number of individual units in cart */
  cartCount: number;
  /** Sum of price × qty for all cart items */
  subtotal: number;
  addItem: (product: ProductListItem, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("kw_cart") ?? "[]");
      const valid = stored.filter((i: CartItem) => i.id && i.qty && i.product);
      if (valid.length) setItems(valid);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("kw_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: ProductListItem, qty = 1) => {
    if (product.sold_out) return;
    const cap = product.is_one_time ? 1 : 99;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: clamp(i.qty + qty, 1, cap), product } : i
        );
      }
      return [...prev, { id: product.id, qty: clamp(qty, 1, cap), product }];
    });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ items, cartCount, subtotal, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
