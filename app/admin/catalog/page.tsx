"use client";
import { useEffect, useState } from "react";
import {
  fetchAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory,
  fetchAdminBrands, createAdminBrand, updateAdminBrand, deleteAdminBrand,
} from "@/lib/api";
import type { Category, Brand } from "@/lib/types";

// ── tiny modal ────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h3>{title}</h3>
          <button className="adm-modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Category form ─────────────────────────────────────────────────────────────

function CategoryForm({ initial, categories, onSave, onClose }: {
  initial?: Category;
  categories: Category[];
  onSave: (cat: Category) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: initial?.name ?? "", icon: initial?.icon ?? "", blurb: initial?.blurb ?? "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const cat = initial
        ? await updateAdminCategory(initial.slug, form)
        : await createAdminCategory(form);
      onSave(cat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally { setSaving(false); }
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      {error && <div className="adm-form-error">{error}</div>}
      <label>Name *<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Icon <span className="adm-hint">emoji or icon name</span>
        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="📱" />
      </label>
      <label>Blurb <span className="adm-hint">short description</span>
        <input value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
      </label>
      <div className="adm-form-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
}

// ── Brand form ────────────────────────────────────────────────────────────────

function BrandForm({ initial, categories, onSave, onClose }: {
  initial?: Brand;
  categories: Category[];
  onSave: (brand: Brand) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [catId, setCatId] = useState<number>(initial?.category ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!catId) { setError("Please select a category."); return; }
    setError(""); setSaving(true);
    try {
      const brand = initial
        ? await updateAdminBrand(initial.id, { name, category: catId })
        : await createAdminBrand({ name, category: catId });
      onSave(brand);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally { setSaving(false); }
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      {error && <div className="adm-form-error">{error}</div>}
      <label>Name *<input required value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>Category *
        <select required value={catId || ""} onChange={(e) => setCatId(Number(e.target.value))}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <div className="adm-form-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [catModal, setCatModal] = useState<"new" | Category | null>(null);
  const [brandModal, setBrandModal] = useState<"new" | Brand | null>(null);

  useEffect(() => {
    Promise.all([fetchAdminCategories(), fetchAdminBrands()])
      .then(([cats, brs]) => { setCategories(cats); setBrands(brs); })
      .finally(() => setLoading(false));
  }, []);

  async function deleteCategory(slug: string) {
    if (!confirm("Delete this category? Products assigned to it will lose their category.")) return;
    await deleteAdminCategory(slug);
    setCategories((p) => p.filter((c) => c.slug !== slug));
  }

  async function deleteBrand(id: number) {
    if (!confirm("Delete this brand?")) return;
    await deleteAdminBrand(id);
    setBrands((p) => p.filter((b) => b.id !== id));
  }

  return (
    <div className="adm-page">
      <h1 className="adm-title">Catalog — Categories &amp; Brands</h1>

      {loading ? <p className="adm-loading">Loading…</p> : (
        <div className="adm-catalog-grid">
          {/* ── Categories ── */}
          <section>
            <div className="adm-section-head">
              <h2>Categories <span className="adm-count">{categories.length}</span></h2>
              <button className="btn btn-primary btn-sm" onClick={() => setCatModal("new")}>+ New</button>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Name</th><th>Icon</th><th>Brands</th><th></th></tr></thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.icon}</td>
                      <td className="adm-sub">{brands.filter((b) => b.category === c.id).length} brand{brands.filter((b) => b.category === c.id).length !== 1 ? "s" : ""}</td>
                      <td>
                        <button className="adm-action-link" onClick={() => setCatModal(c)}>Edit</button>
                        {" · "}
                        <button className="adm-action-link adm-action-link--danger" onClick={() => deleteCategory(c.slug)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Brands ── */}
          <section>
            <div className="adm-section-head">
              <h2>Brands <span className="adm-count">{brands.length}</span></h2>
              <button className="btn btn-primary btn-sm" onClick={() => setBrandModal("new")}>+ New</button>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Name</th><th>Category</th><th></th></tr></thead>
                <tbody>
                  {brands.map((b) => (
                    <tr key={b.id}>
                      <td>{b.name}</td>
                      <td className="adm-sub">{b.category_name}</td>
                      <td>
                        <button className="adm-action-link" onClick={() => setBrandModal(b)}>Edit</button>
                        {" · "}
                        <button className="adm-action-link adm-action-link--danger" onClick={() => deleteBrand(b.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Category modal */}
      {catModal && (
        <Modal title={catModal === "new" ? "New category" : "Edit category"} onClose={() => setCatModal(null)}>
          <CategoryForm
            initial={catModal === "new" ? undefined : catModal}
            categories={categories}
            onClose={() => setCatModal(null)}
            onSave={(cat) => {
              setCategories((p) => catModal === "new" ? [...p, cat] : p.map((c) => c.id === cat.id ? cat : c));
              setCatModal(null);
            }}
          />
        </Modal>
      )}

      {/* Brand modal */}
      {brandModal && (
        <Modal title={brandModal === "new" ? "New brand" : "Edit brand"} onClose={() => setBrandModal(null)}>
          <BrandForm
            initial={brandModal === "new" ? undefined : brandModal}
            categories={categories}
            onClose={() => setBrandModal(null)}
            onSave={(brand) => {
              setBrands((p) => brandModal === "new" ? [...p, brand] : p.map((b) => b.id === brand.id ? brand : b));
              setBrandModal(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
