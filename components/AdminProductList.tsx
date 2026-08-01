"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; parentId: string | null };
type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: string | number;
  categoryId: string;
  category: { name: string };
  imageUrl: string | null;
};

export default function AdminProductList({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  const parents = categories.filter((c) => !c.parentId);
  const childrenOf = (id: string) => categories.filter((c) => c.parentId === id);

  return (
    <div className="border border-white/10">
      {products.map((p) =>
        editingId === p.id ? (
          <EditRow
            key={p.id}
            product={p}
            parents={parents}
            childrenOf={childrenOf}
            onDone={() => {
              setEditingId(null);
              router.refresh();
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div key={p.id} className="flex justify-between items-center px-5 py-4 border-b border-white/10 last:border-b-0 bg-carbon">
            <div className="flex items-center gap-3">
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover border border-white/20" />
              )}
              <div>
                <p className="font-display font-bold uppercase text-sm">{p.name}</p>
                <p className="text-creamDim text-xs font-mono mt-1">{p.category.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-goldBright text-sm">
                ${Number(p.basePrice).toFixed(2)}
              </span>
              <button
                onClick={() => setEditingId(p.id)}
                className="text-xs uppercase text-creamDim hover:text-gold border border-white/20 px-3 py-1.5"
              >
                Edit
              </button>
            </div>
          </div>
        )
      )}
      {products.length === 0 && (
        <p className="text-creamDim text-sm p-5">No products yet — add your first one.</p>
      )}
    </div>
  );
}

function EditRow({
  product,
  parents,
  childrenOf,
  onDone,
  onCancel,
}: {
  product: Product;
  parents: Category[];
  childrenOf: (id: string) => Category[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [basePrice, setBasePrice] = useState(String(product.basePrice));
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setImageUrl(data.url);
    else setError(data.error || "Upload failed");
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        basePrice: parseFloat(basePrice),
        categoryId,
        imageUrl: imageUrl || undefined,
      }),
    });
    setSaving(false);
    if (res.ok) {
      onDone();
    } else {
      const data = await res.json();
      setError(data.error?.formErrors?.[0] || "Something went wrong.");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setSaving(true);
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    setSaving(false);
    if (res.ok) {
      onDone();
    } else {
      const data = await res.json();
      setError(data.error || "Couldn't delete this product.");
    }
  }

  return (
    <div className="px-5 py-5 border-b border-white/10 last:border-b-0 bg-carbon2 space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-cream"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-cream min-h-[70px]"
      />
      <div className="flex gap-3">
        <input
          type="number"
          step="0.01"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-cream"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-cream"
        >
          {parents.map((p) => (
            <optgroup key={p.id} label={p.name}>
              {childrenOf(p.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <input type="file" accept="image/*" onChange={handleFileChange}
          className="text-xs text-creamDim file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-bold file:bg-gold file:text-black file:cursor-pointer" />
        {uploading && <p className="text-xs text-goldBright mt-1">Uploading...</p>}
        {imageUrl && !uploading && (
          <img src={imageUrl} alt="Preview" className="w-12 h-12 object-cover border border-white/20 mt-2" />
        )}
      </div>

      {error && <p className="text-red text-xs">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button onClick={handleSave} disabled={saving}
          className="bg-gold text-black px-4 py-2 text-xs font-bold uppercase hover:bg-goldBright disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={onCancel} disabled={saving}
          className="border border-white/20 px-4 py-2 text-xs uppercase text-creamDim hover:bg-white/5">
          Cancel
        </button>
        <button onClick={handleDelete} disabled={saving}
          className="border border-red text-red px-4 py-2 text-xs uppercase hover:bg-red/10 ml-auto">
          Delete
        </button>
      </div>
    </div>
  );
}
