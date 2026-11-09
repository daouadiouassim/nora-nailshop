import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Pencil, Plus, Trash2, X, Upload } from "lucide-react";
import { fetchCategories } from "@/lib/catalog";
import { formatDA, slugify } from "@/lib/format";
import { NAIL_SHAPES, NAIL_SIZES } from "@/data/wilayas";

const INPUT =
  "mt-1.5 h-11 w-full border border-brand-gold/35 bg-white px-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none";
const LABEL = "font-body text-xs text-brand-blue/55";

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "French",
  images: [],
  shapes: ["Almond"],
  sizes: ["XS", "S", "M", "L"],
  customization_enabled: true,
  is_available: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    base44.entities.Product.list({ sort: "sort_order", limit: 100 }).then((result) => {
      setProducts(Array.isArray(result) ? result : result?.items || []);
    });

  useEffect(() => {
    load();
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const openNew = () => setDraft({ ...EMPTY, category: categories[0]?.name || "French" });
  const openEdit = (product) =>
    setDraft({
      ...EMPTY,
      ...product,
      price: String(product.price ?? ""),
      images: product.images || [],
      shapes: product.shapes?.length ? product.shapes : ["Almond"],
      sizes: product.sizes?.length ? product.sizes : ["XS", "S", "M", "L"],
    });

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setDraft((current) => ({ ...current, images: [...(current.images || []), file_url] }));
    } catch {
      setError("The image could not be uploaded. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setError("");
    if (!draft.name.trim()) return setError("Please add a product name.");
    if (draft.price === "" || Number.isNaN(Number(draft.price))) return setError("Please add a price in DA.");
    if (!draft.slug.trim()) draft.slug = slugify(draft.name);

    setSaving(true);
    const payload = {
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      category: draft.category,
      images: draft.images || [],
      shapes: draft.shapes,
      sizes: draft.sizes,
      customization_enabled: Boolean(draft.customization_enabled),
      is_available: Boolean(draft.is_available),
      is_sample: false,
    };

    try {
      if (draft.id) {
        await base44.entities.Product.update(draft.id, payload);
      } else {
        await base44.entities.Product.create({ ...payload, sort_order: products.length + 1 });
      }
      setDraft(null);
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || "The product could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? Past orders keep their own snapshot.`)) return;
    await base44.entities.Product.delete(product.id);
    await load();
  };

  const toggleArray = (key, value) =>
    setDraft((current) => {
      const list = current[key] || [];
      return {
        ...current,
        [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-blue/45">Catalogue</p>
          <h1 className="mt-3 font-heading text-3xl font-light text-brand-blue">
            {products.length} product{products.length === 1 ? "" : "s"}
          </h1>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex min-h-[46px] items-center gap-2 bg-brand-blue px-5 font-body text-[0.65rem] uppercase tracking-[0.16em] text-white"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="mt-7 overflow-x-auto border border-brand-gold/25 bg-white">
        {products.length === 0 ? (
          <p className="p-8 text-center font-body text-sm text-brand-blue/50">
            No products yet. Add your first set.
          </p>
        ) : (
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-brand-gold/25 font-body text-[0.6rem] uppercase tracking-[0.14em] text-brand-blue/45">
                <th className="px-4 py-3">Set</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-brand-gold/10 font-body text-sm text-brand-blue/80">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 shrink-0 overflow-hidden bg-brand-cream">
                        {product.images?.[0] && (
                          <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-brand-blue">{product.name}</p>
                        {product.is_sample && (
                          <p className="font-body text-[0.6rem] uppercase tracking-[0.12em] text-brand-gold">
                            Sample content
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{formatDA(product.price)}</td>
                  <td className="px-4 py-3">
                    {product.is_available ? "Available" : "Hidden"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`} className="p-2 text-brand-blue/60 hover:text-brand-blue">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => remove(product)} aria-label={`Delete ${product.name}`} className="p-2 text-brand-blue/40 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand-ink/40 p-4 py-10">
          <div className="w-full max-w-2xl bg-brand-cream p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <h2 className="font-heading text-2xl text-brand-blue">
                {draft.id ? "Edit set" : "New set"}
              </h2>
              <button type="button" onClick={() => setDraft(null)} aria-label="Close" className="p-2 text-brand-blue/60">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL}>Name</label>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Price (DA)</label>
                <input
                  type="number"
                  min="0"
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Category</label>
                <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={INPUT}>
                  {[...new Set([...categories.map((c) => c.name), "French", "Minimalist", "Elegant", "Glam", "Everyday", "Custom"])].map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Slug</label>
                <input
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  placeholder="auto from name"
                  className={INPUT}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL}>Description</label>
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5">
              <p className={LABEL}>Images</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {(draft.images || []).map((image) => (
                  <div key={image} className="relative h-16 w-14 overflow-hidden border border-brand-gold/30">
                    <img src={image} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, images: draft.images.filter((i) => i !== image) })}
                      aria-label="Remove image"
                      className="absolute right-0 top-0 bg-white/90 p-0.5 text-brand-blue/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="inline-flex h-16 w-14 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-brand-gold/50 font-body text-[0.55rem] uppercase tracking-[0.1em] text-brand-blue/50">
                  <Upload className="h-4 w-4" />
                  {uploading ? "…" : "Add"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => upload(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className={LABEL}>Shapes</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {NAIL_SHAPES.map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => toggleArray("shapes", shape)}
                      className={`border px-2.5 py-1 font-body text-[0.6rem] uppercase tracking-[0.1em] ${
                        draft.shapes?.includes(shape)
                          ? "border-brand-blue bg-brand-blue text-white"
                          : "border-brand-gold/35 text-brand-blue/60"
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={LABEL}>Sizes</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {NAIL_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleArray("sizes", size)}
                      className={`border px-2.5 py-1 font-body text-[0.6rem] uppercase tracking-[0.1em] ${
                        draft.sizes?.includes(size)
                          ? "border-brand-blue bg-brand-blue text-white"
                          : "border-brand-gold/35 text-brand-blue/60"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-5">
              <label className="flex items-center gap-2 font-body text-sm text-brand-blue/70">
                <input
                  type="checkbox"
                  checked={draft.is_available}
                  onChange={(e) => setDraft({ ...draft, is_available: e.target.checked })}
                />
                Available to order
              </label>
              <label className="flex items-center gap-2 font-body text-sm text-brand-blue/70">
                <input
                  type="checkbox"
                  checked={draft.customization_enabled}
                  onChange={(e) => setDraft({ ...draft, customization_enabled: e.target.checked })}
                />
                Allow customisation
              </label>
            </div>

            {error && <p className="mt-4 font-body text-sm text-destructive">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDraft(null)} className="min-h-[46px] border border-brand-blue/30 px-5 font-body text-[0.65rem] uppercase tracking-[0.16em] text-brand-blue">
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="min-h-[46px] bg-brand-blue px-5 font-body text-[0.65rem] uppercase tracking-[0.16em] text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save set"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}