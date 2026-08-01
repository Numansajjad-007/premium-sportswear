"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom (I'll provide measurements)"];
const COLORS = [
  { name: "Black", hex: "#0a0a0b" },
  { name: "Carbon Grey", hex: "#38383e" },
  { name: "Racing Red", hex: "#c8102e" },
  { name: "Gold", hex: "#c6a15b" },
  { name: "White", hex: "#f2f1ee" },
];


function UploadField({
  label,
  onUploaded,
}: {
  label: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      setUrl(data.url);
      onUploaded(data.url);
    } else {
      setError(data.error || "Upload failed — please log in and try again.");
    }
  }

  return (
    <div className="mb-5">
      <label className="block text-xs text-creamDim uppercase tracking-wide mb-2">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full text-sm text-creamDim file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gold file:text-black hover:file:bg-goldBright file:cursor-pointer"
      />
      {uploading && <p className="text-xs text-goldBright mt-2">Uploading...</p>}
      {error && <p className="text-xs text-red mt-2">{error}</p>}
      {url && !uploading && (
        <div className="mt-2 flex items-center gap-2">
          <img src={url} alt="Uploaded" className="w-12 h-12 object-cover border border-white/20" />
          <span className="text-xs text-creamDim">Uploaded ✓</span>
        </div>
      )}
    </div>
  );
}

export default function ProductOrderForm({
  productName,
  basePrice,
}: {
  productName: string;
  basePrice: number;
}) {
  const router = useRouter();
  const [size, setSize] = useState(SIZES[2]);
  const [color, setColor] = useState(COLORS[0].name);
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  function handleCheckout() {
    const params = new URLSearchParams({
      product: productName,
      price: String(basePrice),
      size,
      color,
    });
    if (designUrl) params.set("design", designUrl);
    if (logoUrl) params.set("logo", logoUrl);
    if (sponsorLogoUrl) params.set("sponsor", sponsorLogoUrl);
    if (notes) params.set("notes", notes);
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div>
      <div className="mb-7">
        <label className="block text-xs text-creamDim uppercase tracking-wide mb-3">Size</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-2 text-xs uppercase border ${
                size === s ? "border-gold text-goldBright bg-gold/10" : "border-white/20 text-creamDim"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <label className="block text-xs text-creamDim uppercase tracking-wide mb-3">Color</label>
        <div className="flex gap-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              title={c.name}
              onClick={() => setColor(c.name)}
              style={{ background: c.hex }}
              className={`w-10 h-10 rounded-full border-2 ${
                color === c.name ? "border-white ring-2 ring-gold" : "border-white/15"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-creamDim mt-2">Selected: {color}</p>
      </div>

      <UploadField label="Upload a Reference Design (optional)" onUploaded={setDesignUrl} />
      <UploadField label="Upload Your Logo (optional)" onUploaded={setLogoUrl} />
      <UploadField label="Upload Sponsor Logo (optional)" onUploaded={setSponsorLogoUrl} />

      <div className="mb-8">
        <label className="block text-xs text-creamDim uppercase tracking-wide mb-2">
          Describe What You Want
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tell us anything else — placement, panel colors, name/number, deadline, quantity..."
          className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm text-cream min-h-[110px]"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleCheckout}
          className="bg-gold text-black px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-goldBright transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
