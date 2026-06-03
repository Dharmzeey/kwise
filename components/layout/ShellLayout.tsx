"use client";
/**
 * ShellLayout — renders Header + Footer + CartDrawer.
 * Client component so it can hold the cartDrawerOpen state.
 * Receives pre-fetched categories (server-fetched in root layout).
 */
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import type { Category, ProductListItem } from "@/lib/types";

interface ShellLayoutProps {
  children: React.ReactNode;
  categories: Category[];
  /** All products — needed by CartDrawer to resolve ids → details */
  products: ProductListItem[];
}

export default function ShellLayout({ children, categories, products }: ShellLayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="app">
      <Header categories={categories} onOpenCart={() => setCartOpen(true)} />
      <main className="main">{children}</main>
      <Footer categories={categories} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
    </div>
  );
}
