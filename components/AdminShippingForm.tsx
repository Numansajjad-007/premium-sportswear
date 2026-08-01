"use client";
import { useState } from "react";

export default function AdminShippingForm({ initialFee }: { initialFee: string }) {
  const [fee, setFee] = useState(initialFee);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/shipping", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flatFee: parseFloat(fee) }),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  return (
    <div className="bg-carbon border border-white/10 p-8 max-w-md">
      <h3 className="font-display font-bold uppercase text-xl mb-2">Shipping</h3>
      <p className="text-creamDim text-sm mb-5">
        This flat fee is added to every order&apos;s total on the checkout page.
      </p>
      <div className="flex gap-3 items-center">
        <span className="text-creamDim">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="w-32 bg-black border border-white/15 px-4 py-3 text-sm text-cream"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gold text-black px-6 py-3 text-sm font-bold uppercase hover:bg-goldBright disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {saved && <p className="text-goldBright text-xs mt-3">Shipping fee updated.</p>}
    </div>
  );
}
