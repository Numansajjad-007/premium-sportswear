"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = ["PENDING", "IN_PRODUCTION", "QUALITY_CHECK", "SHIPPED", "DELIVERED", "CANCELLED"];
const QUOTE_STATUSES = ["NEW", "REVIEWED", "QUOTED", "ACCEPTED", "DECLINED"];

type Order = {
  id: string;
  status: string;
  total: string;
  trackingNumber: string | null;
  createdAt: string;
  user: { name: string; email: string };
  items: { product: { name: string }; quantity: number }[];
};

type Quote = {
  id: string;
  status: string;
  quantity: number;
  quotedPrice: string | null;
  notes: string | null;
  createdAt: string;
  user: { name: string; email: string };
  design: { product: { name: string } } | null;
};

export function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, trackingNumber: tracking }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-carbon border border-white/10 p-5 mb-3">
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <div>
          <p className="font-display font-bold uppercase text-sm">{order.user.name}</p>
          <p className="text-creamDim text-xs font-mono">{order.user.email}</p>
        </div>
        <span className="font-mono text-goldBright text-sm">${order.total}</span>
      </div>
      <p className="text-creamDim text-sm mb-4">
        {order.items.map((it) => `${it.product.name} × ${it.quantity}`).join(", ")}
      </p>
      <div className="flex flex-wrap gap-3 items-center">
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="bg-black border border-white/15 px-3 py-2 text-xs text-cream">
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          placeholder="Tracking number"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="bg-black border border-white/15 px-3 py-2 text-xs text-cream w-40"
        />
        <button onClick={save} disabled={saving}
          className="bg-gold text-black px-4 py-2 text-xs font-bold uppercase hover:bg-goldBright disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export function QuoteRow({ quote }: { quote: Quote }) {
  const router = useRouter();
  const [status, setStatus] = useState(quote.status);
  const [price, setPrice] = useState(quote.quotedPrice || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/quotes/${quote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, quotedPrice: price }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-carbon border border-white/10 p-5 mb-3">
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <div>
          <p className="font-display font-bold uppercase text-sm">{quote.user.name}</p>
          <p className="text-creamDim text-xs font-mono">{quote.user.email}</p>
        </div>
        <span className="text-creamDim text-xs font-mono">Qty: {quote.quantity}</span>
      </div>
      {quote.design?.product && (
        <p className="text-creamDim text-sm mb-2">Product: {quote.design.product.name}</p>
      )}
      {quote.notes && (
        <p className="text-cream text-sm mb-4 whitespace-pre-line bg-black/40 p-3 border border-white/10">
          {quote.notes}
        </p>
      )}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="bg-black border border-white/15 px-3 py-2 text-xs text-cream">
          {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Quoted price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-black border border-white/15 px-3 py-2 text-xs text-cream w-32"
        />
        <button onClick={save} disabled={saving}
          className="bg-gold text-black px-4 py-2 text-xs font-bold uppercase hover:bg-goldBright disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
