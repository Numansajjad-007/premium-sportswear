import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const revalidate = 60; // re-fetch products at most once a minute

export default async function HomePage() {
  // Falls back gracefully if the DB isn't connected yet during early setup
  let categories: { id: string; name: string; slug: string; imageUrl: string | null }[] = [];
  try {
    categories = await prisma.category.findMany({ where: { parentId: null } });
  } catch {
    categories = [];
  }

  return (
    <main>
      <header
        className="min-h-screen flex items-end px-6 md:px-12 pb-16 md:pb-24 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 30% 20%, rgba(200,16,46,0.16), transparent 60%), radial-gradient(ellipse 70% 50% at 80% 10%, rgba(198,161,91,0.14), transparent 60%), linear-gradient(180deg, #141416 0%, #0a0a0b 100%)",
        }}
      >
        {/* subtle carbon-fiber texture overlay */}
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 5px)",
          }}
        />
        {/* diagonal livery stripes, echoing the racing-suit paneling */}
        <div className="absolute top-[-10%] right-[8%] w-[2px] h-[130%] opacity-70 rotate-[14deg]"
          style={{ background: "linear-gradient(180deg, transparent, #c8102e 30%, #c6a15b 70%, transparent)" }} />
        <div className="absolute top-[-10%] right-[14%] w-[2px] h-[130%] opacity-30 rotate-[14deg]"
          style={{ background: "linear-gradient(180deg, transparent, #c8102e 30%, #c6a15b 70%, transparent)" }} />

        <div className="relative z-10 max-w-3xl animate-hero">
          <div className="font-mono text-xs tracking-[3px] uppercase text-goldBright mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red rounded-full" />
            Manufactured in Sialkot · Raced Worldwide
          </div>
          <h1 className="font-display font-black uppercase leading-[0.86] text-[clamp(56px,9vw,132px)] mb-6">
            Built for <span className="[-webkit-text-stroke:1.5px_#f2f1ee] text-transparent">the Apex.</span>
          </h1>
          <p className="text-lg text-creamDim max-w-xl mb-10 leading-relaxed">
            Race suits, karting gear, and team kit engineered on the factory floor and finished to a
            standard the paddock notices.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/studio"
              className="bg-gold text-black px-8 py-4 text-sm font-bold tracking-wide uppercase hover:bg-goldBright transition"
            >
              Enter Design Studio
            </Link>
            <Link
              href="/shop"
              className="border border-white/30 px-8 py-4 text-sm font-bold tracking-wide uppercase hover:border-white hover:bg-white/5 transition"
            >
              Browse the Range
            </Link>
          </div>
        </div>
      </header>

      <section className="px-6 md:px-12 py-16 md:py-24 bg-carbon">
        <Reveal>
          <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl mb-10">
            Shop by Category
          </h2>
        </Reveal>
        {categories.length === 0 ? (
          <p className="text-creamDim font-mono text-sm">
            No categories yet — seed the database (see prisma/seed.ts) to populate this section.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 80}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="relative hover:brightness-110 hover:scale-[1.02] transition-all duration-300 p-8 min-h-[220px] md:min-h-[260px] flex items-end overflow-hidden group"
                  style={{
                    backgroundImage: cat.imageUrl
                      ? `linear-gradient(180deg, rgba(10,10,11,0.15), rgba(10,10,11,0.85)), url(${cat.imageUrl})`
                      : "linear-gradient(155deg, #1c1c1f, #141416)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!cat.imageUrl && (
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 6px)",
                      }}
                    />
                  )}
                  <h3 className="relative font-display font-bold uppercase text-2xl transition-transform duration-300 group-hover:translate-x-1">{cat.name}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Design Studio teaser */}
      <section className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Reveal className="order-2 md:order-1">
          <div className="aspect-[4/5] bg-gradient-to-br from-carbon2 to-carbon border border-white/10 transition-transform duration-500 hover:scale-[1.02]" />
        </Reveal>
        <Reveal delay={150} className="order-1 md:order-2">
          <div>
            <span className="font-mono text-xs uppercase text-red tracking-widest">The Studio</span>
            <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl mt-4 mb-6 leading-none">
              Design It<br />Panel by Panel.
            </h2>
            <p className="text-creamDim mb-8 leading-relaxed max-w-md">
              Choose your product, colour every panel, place your sponsors, and watch it come together
              in real time — then send it straight to the factory floor.
            </p>
            <Link href="/studio" className="bg-gold text-black px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-goldBright hover:scale-105 transition-all inline-block">
              Launch the Design Studio
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Manufacturing teaser */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-carbon">
        <Reveal>
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase text-red tracking-widest">From Sialkot</span>
            <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl mt-4 mb-6 leading-none">
              How a Suit<br />Gets Built.
            </h2>
            <p className="text-creamDim mb-8 leading-relaxed">
              Decades of manufacturing craft behind every stitch — the same process whether it&apos;s
              one suit or a full grid order.
            </p>
            <Link href="/manufacturing" className="border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-white/5 hover:border-white transition-all inline-block">
              See Our Manufacturing Process
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Why choose us */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <Reveal>
          <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl mb-10">
            Why Teams Choose Us.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            ["Direct Manufacturing", "No middlemen — every order is produced in our own Sialkot facility, which is how we hold both price and quality."],
            ["Fit Consistency", "Reorder next season and get the exact same fit — patterns are stored and never redrawn from scratch."],
            ["Real Turnaround Times", "We quote production windows we can actually hit — 12 to 18 days on standard custom orders."],
          ].map(([title, desc], i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="bg-carbon p-8 h-full transition-colors duration-300 hover:bg-carbon2">
                <h4 className="font-display font-bold uppercase text-xl mb-3">{title}</h4>
                <p className="text-creamDim text-sm leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-carbon">
        <Reveal>
          <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl mb-10">
            Trusted Trackside.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            ["The custom studio let our whole karting team submit designs themselves — no back-and-forth emails.", "Marcus Feld", "Team Principal, Junior Karting"],
            ["We reorder every season and the fit is identical every time.", "Elena Vidal", "Club Racing, Spain"],
            ["Dealer onboarding took a day. Wholesale pricing was laid out clearly from the first call.", "Daniel Ortiz", "Distributor, North America"],
          ].map(([quote, name, role], i) => (
            <Reveal key={name} delay={i * 100}>
              <div className="bg-black p-8 h-full transition-transform duration-300 hover:-translate-y-1">
                <p className="text-cream text-base leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
                <p className="font-mono text-xs text-goldBright">{name}</p>
                <p className="text-creamDim text-xs mt-1">{role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-20 text-center">
        <Reveal>
          <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl mb-10">
            Made in Sialkot, Racing Everywhere.
          </h2>
        </Reveal>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {[["40+", "Countries Served"], ["120K", "Suits Manufactured"], ["25", "Years of Craft"]].map(([num, label], i) => (
            <Reveal key={label} delay={i * 100}>
              <div>
                <div className="font-display font-black text-4xl md:text-5xl text-goldBright">{num}</div>
                <div className="font-mono text-xs uppercase tracking-widest text-creamDim mt-2">{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-6 md:px-12 py-16 md:py-24 text-center bg-gradient-to-br from-carbon2 to-black border-t border-white/10 border-b border-white/10">
        <Reveal>
          <h2 className="font-display font-black uppercase text-3xl md:text-6xl mb-6">
            Ready to Suit Up?
          </h2>
          <p className="text-creamDim max-w-md mx-auto mb-8">
            Start in the Design Studio or talk to our team about a custom OEM order.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/studio" className="bg-gold text-black px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-goldBright hover:scale-105 transition-all">
              Start Designing
            </Link>
            <Link href="/contact" className="border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-white/5 hover:border-white transition-all">
              Talk to Sales
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
