"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; parentId: string | null };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) {
      setImageUrl(data.url);
    } else {
      setError(data.error || "Upload failed — try again.");
    }
  }

  // Sort so sub-categories show indented under their parent, easier to pick the right one
  const parents = categories.filter((c) => !c.parentId);
  const childrenOf = (id: string) => categories.filter((c) => c.parentId === id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!categoryId) {
      setError("Please choose a category.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slugify(name),
        description,
        basePrice: parseFloat(basePrice),
        categoryId,
        imageUrl: imageUrl || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.formErrors?.[0] || "Something went wrong — check the fields and try again.");
      return;
    }
    setName("");
    setDescription("");
    setBasePrice("");
    setCategoryId("");
    setImageUrl("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-carbon border border-white/10 p-8 space-y-4 max-w-xl">
      <h3 className="font-display font-bold uppercase text-xl mb-2">Add a Product</h3>

      <input
        required
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-cream"
      />

      <textarea
        required
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-cream min-h-[90px]"
      />

      <input
        required
        type="number"
        step="0.01"
        min="0"
        placeholder="Price (e.g. 149.00)"
        value={basePrice}
        onChange={(e) => setBasePrice(e.target.value)}
        className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-cream"
      />

      <select
        required
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-cream"
      >
        <option value="">Select a category...</option>
        {parents.map((p) => (
          <optgroup key={p.id} label={p.name}>
            {childrenOf(p.id).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <div>
        <label className="block text-xs text-creamDim uppercase tracking-wide mb-2">
          Product Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-creamDim file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gold file:text-black hover:file:bg-goldBright file:cursor-pointer"
        />
        {uploading && <p className="text-xs text-goldBright mt-2">Uploading...</p>}
        {imageUrl && !uploading && (
          <div className="mt-3 flex items-center gap-3">
            <img src={imageUrl} alt="Preview" className="w-16 h-16 object-cover border border-white/20" />
            <span className="text-xs text-creamDim">Uploaded ✓</span>
          </div>
        )}
      </div>

      <input
        placeholder="Or paste a photo URL directly (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-cream"
      />

      {error && <p className="text-red text-sm">{error}</p>}

      <button
        disabled={saving}
        type="submit"
        className="bg-gold text-black px-8 py-3 text-sm font-bold uppercase tracking-wide hover:bg-goldBright transition disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add Product"}
      </button>
    </form>
  );
}
