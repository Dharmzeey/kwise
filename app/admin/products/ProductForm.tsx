"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  createAdminProduct,
  updateAdminProduct,
  uploadProductImage,
  deleteProductImage,
  updateProductSpecs,
  fetchCategories,
  fetchAdminProducts,
} from "@/lib/api";
import type { AdminProduct, ProductWritePayload, Category, ProductTint, ProductStatus } from "@/lib/types";

interface Props { initial?: AdminProduct; }

const TINTS = ["blue", "indigo", "orange"] as const;
const STATUSES = ["Brand New", "Foreign Used", "Nigeria-Used"] as const;
const THUMBS = ["phone", "laptop", "charger", "powerbank", "cable", "case", "shield", "battery"];

export default function ProductForm({ initial }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catId, setCatId] = useState<number>(initial?.category ?? 0);
  const [brandId, setBrandId] = useState<number>(initial?.brand ?? 0);

  // "Base on an existing product" — lets a one-time offer (a specific, flawed
  // unit of a phone we already sell) reuse that phone's specs/description
  // instead of being typed in from scratch.
  const [sourceProducts, setSourceProducts] = useState<AdminProduct[]>([]);
  const [baseSlug, setBaseSlug] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removingImage, setRemovingImage] = useState(false);

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initial?.specs?.length ? initial.specs : [{ key: "", value: "" }]
  );
  const [colorsStr, setColorsStr] = useState((initial?.colors ?? []).join(", "));

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    thumb: initial?.thumb ?? "phone",
    tint: initial?.tint ?? "blue",
    price: initial?.price ?? 0,
    old_price: initial?.old_price ?? ("" as number | ""),
    status: initial?.status ?? "Brand New",
    is_visible: initial?.is_visible ?? true,
    is_featured: initial?.is_featured ?? false,
    badge: initial?.badge ?? "",
    is_one_time: initial?.is_one_time ?? false,
    stock: initial?.stock ?? 25,
    description: initial?.description ?? "",
    one_time_note: initial?.one_time_note ?? "",
    video_url: initial?.video_url ?? "",
  });

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
    if (!initial) {
      fetchAdminProducts()
        .then((all) => setSourceProducts(all.filter((p) => !p.is_one_time)))
        .catch(console.error);
    }
  }, [initial]);

  const brandsForCat = categories.find((c) => c.id === catId)?.brands ?? [];

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleRemoveImage() {
    if (!initial?.slug) { setImagePreview(null); setImageFile(null); return; }
    setRemovingImage(true);
    try {
      await deleteProductImage(initial.slug);
      setImagePreview(null);
      setImageFile(null);
    } catch { alert("Failed to remove image."); }
    finally { setRemovingImage(false); }
  }

  function handleBaseSelect(slug: string) {
    setBaseSlug(slug);
    const src = sourceProducts.find((p) => p.slug === slug);
    if (!src) return;

    setCatId(src.category);
    setBrandId(src.brand);
    setSpecs(src.specs.length ? src.specs.map(({ key, value }) => ({ key, value })) : [{ key: "", value: "" }]);
    setColorsStr((src.colors ?? []).join(", "));
    setForm((prev) => ({
      ...prev,
      name: src.name,
      thumb: src.thumb,
      tint: src.tint,
      price: 0,
      old_price: src.price,
      status: src.status,
      is_one_time: true,
      stock: 1,
      description: src.description,
      one_time_note: "",
    }));
    // Never carry over the source image — a one-time offer is a specific
    // physical unit, so it needs real photos of its own condition/defect.
    setImagePreview(null);
    setImageFile(null);
  }

  function addSpecRow() { setSpecs((p) => [...p, { key: "", value: "" }]); }
  function removeSpecRow(i: number) { setSpecs((p) => p.filter((_, idx) => idx !== i)); }
  function setSpec(i: number, field: "key" | "value", val: string) {
    setSpecs((p) => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!catId || !brandId) { setError("Please select a category and brand."); return; }
    if (!form.price) { setError("Please set a price."); return; }
    setError(""); setSaving(true);
    try {
      const payload: ProductWritePayload = {
        name: form.name,
        category: catId,
        brand: brandId,
        thumb: form.thumb,
        tint: form.tint as ProductWritePayload["tint"],
        price: form.price,
        old_price: form.old_price === "" ? null : Number(form.old_price),
        status: form.status as ProductWritePayload["status"],
        is_visible: form.is_visible,
        is_featured: form.is_featured,
        badge: form.badge,
        is_one_time: form.is_one_time,
        stock: form.stock,
        description: form.description,
        one_time_note: form.one_time_note,
        video_url: form.video_url,
        colors: colorsStr.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const product = initial
        ? await updateAdminProduct(initial.slug, payload)
        : await createAdminProduct(payload);

      if (imageFile) await uploadProductImage(product.slug, imageFile);

      const cleanSpecs = specs.filter((s) => s.key.trim() && s.value.trim());
      await updateProductSpecs(product.slug, cleanSpecs);

      router.push("/admin/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally { setSaving(false); }
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      {error && <div className="adm-form-error">{error}</div>}

      {/* One-time offer quick start */}
      {!initial && sourceProducts.length > 0 && (
        <div className="adm-form-section">
          <h3>One-time offer?</h3>
          <label>Base this on an existing product <span className="adm-hint">optional</span>
            <select value={baseSlug} onChange={(e) => handleBaseSelect(e.target.value)}>
              <option value="">Start from scratch</option>
              {sourceProducts.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </select>
          </label>
          {baseSlug && (
            <p className="adm-hint">
              Copied name, specs, description &amp; category. Now set the discounted price,
              describe this unit&apos;s condition in the one-time note below, and upload real photos of it.
            </p>
          )}
        </div>
      )}

      {/* Image */}
      <div className="adm-form-section">
        <h3>Product image</h3>
        <div className="adm-img-upload">
          <div className={`adm-img-preview${imagePreview ? "" : " empty"}`} onClick={() => !imagePreview && fileRef.current?.click()}>
            {imagePreview
              ? <Image src={imagePreview} alt="Preview" fill style={{ objectFit: "contain" }} />
              : <span>Click to upload</span>}
          </div>
          <div className="adm-img-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
              {imagePreview ? "Change" : "Upload image"}
            </button>
            {imagePreview && (
              <button type="button" className="btn btn-sm adm-btn-danger" onClick={handleRemoveImage} disabled={removingImage}>
                {removingImage ? "…" : "Remove"}
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
          <p className="adm-img-hint">JPG, PNG or WebP.<br />Displayed at 1:1 ratio.</p>
        </div>
      </div>

      {/* Identity */}
      <div className="adm-form-section">
        <h3>Identity</h3>
        <div className="adm-form-row">
          <label>Name *<input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="iPhone 15 Pro Max" /></label>
        </div>
        <div className="adm-form-row">
          <label>Category *
            <select required value={catId || ""} onChange={(e) => { setCatId(Number(e.target.value)); setBrandId(0); }}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>Brand *
            <select required value={brandId || ""} onChange={(e) => setBrandId(Number(e.target.value))} disabled={!catId}>
              <option value="">Select brand</option>
              {brandsForCat.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Pricing */}
      <div className="adm-form-section">
        <h3>Pricing &amp; stock</h3>
        <div className="adm-form-row">
          <label>Price (₦) *<input required type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></label>
          <label>Old price (₦) <span className="adm-hint">optional</span>
            <input type="number" min={0} value={form.old_price} onChange={(e) => set("old_price", e.target.value ? Number(e.target.value) : "")} />
          </label>
          <label>Stock<input type="number" min={0} value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} /></label>
        </div>
      </div>

      {/* Appearance */}
      <div className="adm-form-section">
        <h3>Appearance</h3>
        <div className="adm-form-row">
          <label>Icon fallback
            <select value={form.thumb} onChange={(e) => set("thumb", e.target.value)}>
              {THUMBS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label>Colour tint
            <select value={form.tint} onChange={(e) => set("tint", e.target.value as ProductTint)}>
              {TINTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <label>Colour variants <span className="adm-hint">comma-separated</span>
          <input value={colorsStr} onChange={(e) => setColorsStr(e.target.value)} placeholder="Black, White, Blue" />
        </label>
      </div>

      {/* Details */}
      <div className="adm-form-section">
        <h3>Details</h3>
        <div className="adm-form-row">
          <label>Condition *
            <select required value={form.status} onChange={(e) => set("status", e.target.value as ProductStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>Badge <span className="adm-hint">optional</span>
            <input value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Best Seller" />
          </label>
        </div>
        <div className="adm-checks">
          <label className="adm-check">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => set("is_visible", e.target.checked)} />
            Visible on site
          </label>
          <label className="adm-check">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
            Featured product
          </label>
          <label className="adm-check">
            <input type="checkbox" checked={form.is_one_time} onChange={(e) => set("is_one_time", e.target.checked)} />
            One-time offer
          </label>
        </div>
        <label>Description *<textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></label>
        {form.is_one_time && (
          <>
            <label>One-time note *<span className="adm-hint">why it's discounted — e.g. &quot;Face ID not working&quot;, &quot;small crack on back glass&quot;</span>
              <textarea required rows={2} value={form.one_time_note} onChange={(e) => set("one_time_note", e.target.value)} />
            </label>
            <label>Video link <span className="adm-hint">optional — a post on X, Instagram, TikTok etc. showing this exact unit</span>
              <input type="url" value={form.video_url} onChange={(e) => set("video_url", e.target.value)} placeholder="https://x.com/kwiseworld/status/..." />
            </label>
          </>
        )}
      </div>

      {/* Specs */}
      <div className="adm-form-section">
        <h3>Specifications</h3>
        <div className="adm-specs">
          {specs.map((s, i) => (
            <div key={i} className="adm-spec-row">
              <input placeholder="Key e.g. Storage" value={s.key} onChange={(e) => setSpec(i, "key", e.target.value)} />
              <input placeholder="Value e.g. 256GB" value={s.value} onChange={(e) => setSpec(i, "value", e.target.value)} />
              <button type="button" className="adm-spec-del" onClick={() => removeSpecRow(i)}>×</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={addSpecRow}>+ Add row</button>
        </div>
      </div>

      {/* Actions */}
      <div className="adm-form-actions">
        <button type="button" className="btn btn-outline btn-md" onClick={() => router.back()}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}
