"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const WHATSAPP_NUMBER = "923221686274";
const CONTACT_EMAIL = "premiumsportswear@gmail.com";

export default function CheckoutPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/shipping")
      .then((r) => r.json())
      .then((data) => setShippingFee(parseFloat(data.flatFee)))
      .catch(() => setShippingFee(0));
  }, []);

  const product = params.get("product") || "Custom Order";
  const price = parseFloat(params.get("price") || "0");
  const size = params.get("size");
  const color = params.get("color");
  const design = params.get("design");
  const logo = params.get("logo");
  const sponsor = params.get("sponsor");
  const notes = params.get("notes");

  const shipping = shippingFee ?? 0;
  const total = price + shipping;

  function buildMessage() {
    const lines = [
      `Hi Premium Sports Wear, I'd like to confirm this order:`,
      ``,
      `${product}`,
      `Price: $${price.toFixed(2)}`,
      `Shipping: $${shipping.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
    ];
    if (size) lines.push(`Size: ${size}`);
    if (color) lines.push(`Color: ${color}`);
    if (design) lines.push(`Reference design: ${design}`);
    if (logo) lines.push(`My logo: ${logo}`);
    if (sponsor) lines.push(`Sponsor logo: ${sponsor}`);
    if (notes) lines.push(`Notes: ${notes}`);
    lines.push(``, `Please send me payment details.`);
    return lines.join("\n");
  }

  async function handleConfirm(via: "whatsapp" | "email") {
    const message = buildMessage();

    if (session?.user) {
      try {
        await fetch("/api/quote-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: (session.user as any).id,
            quantity: 1,
            notes: message,
          }),
        });
      } catch {
        // non-blocking
      }
    }
    setSent(true);

    if (via === "whatsapp") {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        "Order: " + product
      )}&body=${encodeURIComponent(message)}`;
    }
  }

  return (
    <main className="min-h-screen bg-black pt-32 px-6 md:px-12 pb-20">
      <div className="max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase text-gold tracking-widest">Checkout</span>
        <h1 className="font-display font-extrabold uppercase text-3xl md:text-4xl mt-3 mb-8">
          Confirm Your Order.
        </h1>

        <div className="bg-carbon border border-white/10 p-6 md:p-8 mb-8">
          <div className="flex justify-between items-start pb-5 border-b border-white/10 mb-5">
            <div>
              <h2 className="font-display font-bold uppercase text-xl">{product}</h2>
              {size && <p className="text-creamDim text-sm mt-1">Size: {size}</p>}
              {color && <p className="text-creamDim text-sm">Color: {color}</p>}
            </div>
            <span className="font-mono text-goldBright text-lg">${price.toFixed(2)}</span>
          </div>

          {(design || logo || sponsor) && (
            <div className="flex gap-3 pb-5 border-b border-white/10 mb-5">
              {design && <img src={design} alt="Design reference" className="w-14 h-14 object-cover border border-white/20" />}
              {logo && <img src={logo} alt="Your logo" className="w-14 h-14 object-cover border border-white/20" />}
              {sponsor && <img src={sponsor} alt="Sponsor logo" className="w-14 h-14 object-cover border border-white/20" />}
            </div>
          )}

          {notes && (
            <div className="pb-5 border-b border-white/10 mb-5">
              <p className="text-xs text-creamDim uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-cream">{notes}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-creamDim">
              <span>Subtotal</span>
              <span>${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-creamDim">
              <span>Shipping</span>
              <span>{shippingFee === null ? "Calculating..." : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10 mt-2">
              <span>Total</span>
              <span className="text-goldBright font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p className="text-creamDim text-sm mb-6">
          We don&apos;t take card payments online yet — confirming below sends your order straight
          to us on WhatsApp or email, and we&apos;ll reply with payment details.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleConfirm("whatsapp")}
            className="bg-gold text-black px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-goldBright transition"
          >
            Confirm via WhatsApp
          </button>
          <button
            onClick={() => handleConfirm("email")}
            className="border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-white/5"
          >
            Confirm via Email
          </button>
        </div>

        {sent && (
          <div className="bg-gold/10 border border-gold text-goldBright text-sm px-5 py-4 mt-6">
            Order sent! We&apos;ll get back to you shortly. You can also check your{" "}
            <Link href="/dashboard" className="underline">dashboard</Link> for a record of this request.
          </div>
        )}
      </div>
    </main>
  );
}
