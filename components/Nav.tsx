"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

type Category = { id: string; name: string; slug: string; children: { id: string; name: string; slug: string }[] };

export default function Nav() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const links = [
    { href: "/studio", label: "Design Studio" },
    { href: "/manufacturing", label: "Manufacturing" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 md:py-4 bg-black/90 backdrop-blur border-b border-white/10">
      <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
        <Image src="/logo.png" alt="Premium Sports Wear" width={280} height={84} className="h-10 md:h-16 w-auto transition-transform hover:scale-105" priority />
      </Link>

      <ul className="hidden md:flex gap-9 list-none">
        <li
          className="relative"
          onMouseEnter={() => setShopOpen(true)}
          onMouseLeave={() => setShopOpen(false)}
        >
          <Link href="/shop" className="text-xs font-semibold uppercase tracking-widest text-creamDim hover:text-cream transition-colors">
            Shop
          </Link>
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${
              shopOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="bg-carbon border border-white/10 shadow-2xl min-w-[520px] grid grid-cols-2 gap-x-8 gap-y-4 p-6">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <Link href={`/shop?category=${cat.slug}`} className="text-gold text-xs font-bold uppercase tracking-wide hover:text-goldBright">
                    {cat.name}
                  </Link>
                  <ul className="mt-2 space-y-1.5">
                    {cat.children.slice(0, 5).map((child) => (
                      <li key={child.id}>
                        <Link href={`/shop?category=${child.slug}`} className="text-creamDim text-xs hover:text-cream transition-colors">
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </li>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-xs font-semibold uppercase tracking-widest text-creamDim hover:text-cream transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-5">
        {status === "authenticated" ? (
          <>
            <Link href="/dashboard" className="text-xs text-creamDim hover:text-cream transition-colors">
              Hi, {session.user?.name?.split(" ")[0]}
            </Link>
            {(session.user as any).role === "ADMIN" && (
              <Link href="/admin" className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-goldBright transition-colors">
                Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs font-semibold uppercase tracking-widest text-creamDim hover:text-cream transition-colors"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-xs font-semibold uppercase tracking-widest text-creamDim hover:text-cream transition-colors">
              Log In
            </Link>
            <Link
              href="/studio"
              className="border border-gold text-gold px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all"
            >
              Start Designing
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="md:hidden w-8 h-6 flex flex-col justify-between relative z-[110]"
      >
        <span className={`block h-[2px] bg-white transition-transform ${open ? "translate-y-[11px] rotate-45" : ""}`} />
        <span className={`block h-[2px] bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
        <span className={`block h-[2px] bg-white transition-transform ${open ? "-translate-y-[11px] -rotate-45" : ""}`} />
      </button>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed inset-0 bg-black/98 backdrop-blur transition-[height] overflow-y-auto ${
          open ? "h-screen" : "h-0"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col pt-28 px-6 pb-10">
          <Link href="/shop" onClick={() => setOpen(false)} className="py-4 border-b border-white/10 text-base uppercase tracking-wide text-cream">
            Shop — All Categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              onClick={() => setOpen(false)}
              className="py-2.5 pl-4 text-sm text-creamDim border-b border-white/5"
            >
              {cat.name}
            </Link>
          ))}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-4 border-b border-white/10 text-base uppercase tracking-wide text-cream"
            >
              {l.label}
            </Link>
          ))}
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="py-4 border-b border-white/10 text-base uppercase tracking-wide text-cream">
                My Account
              </Link>
              {(session.user as any).role === "ADMIN" && (
                <Link href="/admin" onClick={() => setOpen(false)} className="py-4 border-b border-white/10 text-base uppercase tracking-wide text-gold">
                  Admin
                </Link>
              )}
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                className="py-4 text-left text-base uppercase tracking-wide text-creamDim"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="py-4 border-b border-white/10 text-base uppercase tracking-wide text-cream">
                Log In
              </Link>
              <Link
                href="/studio"
                onClick={() => setOpen(false)}
                className="mt-6 bg-gold text-black text-center py-4 text-sm font-bold uppercase tracking-widest"
              >
                Start Designing
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
