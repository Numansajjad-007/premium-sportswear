export default function AboutPage() {
  return (
    <main className="bg-black min-h-screen">
      <header className="px-12 pt-40 pb-16 border-b border-white/10">
        <span className="font-mono text-xs tracking-[2px] uppercase text-red">About Us</span>
        <h1 className="font-display font-black uppercase text-5xl md:text-7xl leading-none mt-4 mb-4">
          A Factory Floor<br />in Sialkot.
        </h1>
        <p className="text-creamDim max-w-xl">
          Premium Sports Wear has spent over two decades manufacturing racing and team
          apparel — built by hand, worn on podiums around the world.
        </p>
      </header>

      <section className="px-12 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div className="aspect-[4/5] bg-gradient-to-br from-carbon2 to-carbon border border-white/10" />
        <div>
          <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl mb-6 leading-tight">
            From Local Workshop<br />to Global Supplier.
          </h2>
          <p className="text-creamDim leading-relaxed mb-5">
            We started as a small stitching workshop in Sialkot, a city with a manufacturing
            heritage that runs generations deep. Today we supply racing teams, clubs, and
            dealers across more than 40 countries — but the process hasn&apos;t changed: every
            suit is still cut, stitched, and inspected by hand.
          </p>
          <p className="text-creamDim leading-relaxed">
            The Design Studio puts the same customization process our OEM clients have
            always had access to directly in front of every racer, team, and dealer.
          </p>
        </div>
      </section>

      <section className="px-12 py-20 bg-carbon">
        <h2 className="font-display font-extrabold uppercase text-4xl mb-10">
          How a Suit Gets Built.
        </h2>
        <div className="grid md:grid-cols-4 gap-10">
          {[
            ["01", "Pattern", "Your specs and measurements are cut into a pattern by hand and machine."],
            ["02", "Cut & Stitch", "Panels are cut, reinforced, and stitched by our in-house production teams."],
            ["03", "Branding", "Sponsor logos, numbers and flags are applied to your exact placement."],
            ["04", "QC & Ship", "Every suit is inspected before it's packed and tracked to your door."],
          ].map(([n, title, desc]) => (
            <div key={n} className="border-t border-white/15 pt-6">
              <span className="font-mono text-red text-sm">{n}</span>
              <h4 className="font-display font-bold uppercase text-xl mt-3 mb-2">{title}</h4>
              <p className="text-creamDim text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
