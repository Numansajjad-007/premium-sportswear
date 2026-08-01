"use client";
import { useState } from "react";

type Category = { id: string; name: string; imageUrl: string | null };

function CategoryRow({ category }: { category: Category }) {
  const [imageUrl, setImageUrl] = useState(category.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="bg-carbon border border-white/10 p-5 flex flex-wrap items-center gap-4">
      {imageUrl ? (
        <img src={imageUrl} alt={category.name} className="w-16 h-16 object-cover border border-white/20" />
      ) : (
        <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[10px] text-creamDim text-center">
          No photo
        </div>
      )}
      <div className="flex-1 min-w-[160px]">
        <p className="font-display font-bold uppercase text-sm mb-2">{category.name}</p>
        <div className="flex flex-wrap gap-2 items-center">
          <input type="file" accept="image/*" onChange={handleFileChange}
            className="text-xs text-creamDim file:mr-2 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-bold file:bg-gold file:text-black file:cursor-pointer" />
          <input
            placeholder="or paste an image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="bg-black border border-white/15 px-3 py-1.5 text-xs text-cream w-52"
          />
        </div>
      </div>
      <button onClick={handleSave} disabled={saving || uploading}
        className="bg-gold text-black px-4 py-2 text-xs font-bold uppercase hover:bg-goldBright disabled:opacity-50">
        {saving ? "Saving..." : uploading ? "Uploading..." : "Save"}
      </button>
      {saved && <span className="text-goldBright text-xs">✓ Saved</span>}
    </div>
  );
}

export default function AdminCategoryPhotos({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-3 max-w-2xl">
      {categories.map((c) => (
        <CategoryRow key={c.id} category={c} />
      ))}
    </div>
  );
}
