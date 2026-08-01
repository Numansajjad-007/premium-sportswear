"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type GalleryImage = { id: string; imageUrl: string; caption: string | null };

export default function AdminGallery({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
    const uploadData = await uploadRes.json();
    if (uploadData.url) {
      await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploadData.url, caption: caption || undefined }),
      });
      setCaption("");
      router.refresh();
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this photo from the gallery?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="bg-carbon border border-white/10 p-6 mb-6 max-w-xl">
        <label className="block text-xs text-creamDim uppercase tracking-wide mb-2">
          Caption (optional)
        </label>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="e.g. Club Racing Team, Spain"
          className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-cream mb-4"
        />
        <input type="file" accept="image/*" onChange={handleFileChange}
          className="text-sm text-creamDim file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gold file:text-black file:cursor-pointer" />
        {uploading && <p className="text-xs text-goldBright mt-2">Uploading...</p>}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <img src={img.imageUrl} alt={img.caption || ""} className="w-full aspect-square object-cover border border-white/10" />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 bg-red text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-creamDim text-sm">No gallery photos yet.</p>}
    </div>
  );
}
