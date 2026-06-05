import type { Metadata } from "next";
import ProductForm from "../ProductForm";

export const metadata: Metadata = { title: "New product — Admin" };

export default function NewProductPage() {
  return (
    <div className="adm-page">
      <h1 className="adm-title">New product</h1>
      <ProductForm />
    </div>
  );
}
