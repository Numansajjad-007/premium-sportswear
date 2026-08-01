"use client";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire this up to an /api/messages route once accounts (Stage 2) exist
    setSent(true);
  }

  return (
    <main className="bg-black min-h-screen">
      <header className="px-12 pt-40 pb-16 border-b border-white/10">
        <span className="font-mono text-xs tracking-[2px] uppercase text-red">Contact</span>
        <h1 className="font-display font-black uppercase text-5xl md:text-7xl leading-none mt-4 mb-4">
          Talk to<br />Our Team.
        </h1>
        <p className="text-creamDim max-w-xl">
          Custom orders, OEM manufacturing, dealer applications, or general questions —
          send us the details and we&apos;ll follow up within one business day.
        </p>
      </header>

      <section className="px-12 py-20 grid md:grid-cols-2 gap-16">
        <div>
          <div className="mb-10">
            <h5 className="font-mono text-xs uppercase text-gold mb-2">Factory & HQ</h5>
            <p className="text-creamDim">Premium Sports Wear<br />Sialkot, Punjab, Pakistan</p>
          </div>
          <div className="mb-10">
            <h5 className="font-mono text-xs uppercase text-gold mb-2">Motorbike Gears & Sportswear items Inquirey</h5>
            <p className="text-creamDim">premiumsportswear00@gmail.com</p>
          </div>
          <div>
            <h5 className="font-mono text-xs uppercase text-gold mb-2">Kart racing Gears Order & inquirey</h5>
            <p className="text-creamDim">Kartxracingwear@gmail.com</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input required placeholder="Full Name" className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm" />
          <input required type="email" placeholder="Email" className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm" />
          <select className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm">
            <option>Custom Order / Quote</option>
            <option>OEM / Bulk Manufacturing</option>
            <option>Dealer Application</option>
            <option>General Question</option>
          </select>
          <textarea required placeholder="Tell us about your team, quantity, and timeline..." className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm min-h-[120px]" />
          <button type="submit" className="bg-gold text-black px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-goldBright transition">
            Send Message
          </button>
          {sent && (
            <div className="bg-gold/10 border border-gold text-goldBright text-sm px-5 py-4">
              Thanks — your message has been received. (This is stored locally in your browser for now; a real inbox comes with Stage 2/accounts.)
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
