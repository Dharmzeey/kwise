"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchAdminProduct } from "@/lib/api";
import type { AdminProduct } from "@/lib/types";
import ProductForm from "../../ProductForm";

export default function EditProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProduct(slug).then(setProduct).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="adm-page"><p className="adm-loading">Loading…</p></div>;
  if (!product) return <div className="adm-page"><p className="adm-loading">Product not found.</p></div>;

  return (
    <div className="adm-page">
      <h1 className="adm-title">Edit — {product.name}</h1>
      <ProductForm initial={product} />
    </div>
  );
}
