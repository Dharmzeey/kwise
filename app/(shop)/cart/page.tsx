import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart — Kwise World",
};

export default function CartPage() {
  return <CartPageClient />;
}
