"use client";
/**
 * ShellLayout — renders Header + Footer + CartDrawer for shop routes.
 * Admin routes (/admin/*) bypass this shell entirely.
 */
import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import type { Category, ProductListItem } from "@/lib/types";

interface ShellLayoutProps {
  children: React.ReactNode;
  categories: Category[];
  products: ProductListItem[];
}

export default function ShellLayout({ children, categories, products }: ShellLayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="app">
      <Header categories={categories} onOpenCart={() => setCartOpen(true)} />
      <main className="main">{children}</main>
      <Footer categories={categories} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
    </div>
  );
}
