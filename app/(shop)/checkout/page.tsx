import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout — Kwise World",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
