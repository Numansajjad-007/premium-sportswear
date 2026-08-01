import Link from "next/link";

export default function ManufacturingPage() {
  return (
    <main className="bg-black min-h-screen">
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 border-b border-white/10">
        <span className="font-mono text-xs tracking-[2px] uppercase text-red">Manufacturing</span>
        <h1 className="font-display font-black uppercase text-4xl md:text-7xl leading-none mt-4 mb-4">
          Built On Our<br />Own Factory Floor.
        </h1>
        <p className="text-creamDim max-w-xl">
          Every piece we sell — and every OEM order we produce for other brands — comes out of the
          same Sialkot facility, under the same quality process, no subcontracting shortcuts.
        </p>
      </header>

      <section className="px-6 md:px-12 py-16 md:py-20 bg-carbon">
        <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl mb-10">
          From Pattern to Podium.
        </h2>
        <div className="grid md:grid-cols-4 gap-10">
          {[
            ["01", "Pattern & Cut", "Patterns are drafted to your specs and cut from leather, textile, or performance fabric on our own cutting floor."],
            ["02", "Stitch & Reinforce", "Panels are stitched and reinforced by our production teams — impact zones and stress points get extra passes."],
            ["03", "Brand & Finish", "Sponsor logos, names, numbers, and flags are applied to your exact placement, then finished and pressed."],
            ["04", "QC & Ship", "Every unit is inspected against spec before packing, then tracked door to door."],
          ].map(([n, title, desc]) => (
            <div key={n} className="border-t border-white/15 pt-6">
              <span className="font-mono text-red text-sm">{n}</span>
              <h4 className="font-display font-bold uppercase text-xl mt-3 mb-2">{title}</h4>
              <p className="text-creamDim text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-20">
        <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl mb-10">
          What We&apos;re Set Up to Build.
        </h2>
        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            ["Materials", "Full-grain and split leather, ballistic and abrasion-resistant textiles, mesh, CE-rated armor inserts, moisture-wicking performance fabric."],
            ["Order Volume", "From a single custom race suit to full team and club orders in the hundreds of units, without changing our QC process."],
            ["Turnaround", "Standard custom orders: 12–18 days. Bulk/OEM orders: scoped and confirmed against your deadline before production starts."],
            ["Private Label / OEM", "We manufacture under your brand — your labels, your packaging, your spec sheet."],
            ["Sampling", "Physical samples before full production runs, so what you approve is exactly what you receive at scale."],
            ["Quality Control", "Multi-point inspection on stitching, seam strength, sizing accuracy, and branding placement before anything ships."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-carbon p-8">
              <h4 className="font-display font-bold uppercase text-xl mb-3">{title}</h4>
              <p className="text-creamDim text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 bg-carbon">
        <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl mb-10">
          Sialkot, Pakistan.
        </h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {[["40+", "Countries Served"], ["120K", "Units Manufactured"], ["25", "Years of Craft"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="font-display font-black text-4xl md:text-5xl text-goldBright">{num}</div>
              <div className="font-mono text-xs uppercase tracking-widest text-creamDim mt-2">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 text-center border-t border-white/10">
        <h2 className="font-display font-black uppercase text-3xl md:text-5xl mb-6">
          Have an OEM Order in Mind?
        </h2>
        <p className="text-creamDim max-w-lg mx-auto mb-8">
          Tell us your quantity, materials, and deadline — we&apos;ll scope it and send a real quote.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/contact" className="bg-gold text-black px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-goldBright transition">
            Request OEM Quote
          </Link>
          <Link href="/studio" className="border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-white/5">
            Try the Design Studio
          </Link>
        </div>
      </section>
    </main>
  );
}
