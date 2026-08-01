import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 px-12 pt-16 pb-8">
      <div className="grid md:grid-cols-4 gap-12 pb-10 border-b border-white/10">
        <div>
          <div className="inline-flex items-center mb-5">
            <Image src="/logo.png" alt="Premium Sports Wear" width={280} height={84} className="h-16 w-auto" />
          </div>
          <p className="text-creamDim text-sm max-w-xs leading-relaxed">
            Motorsports and team apparel, engineered and manufactured in Sialkot, Pakistan,
            shipped worldwide.
          </p>
        </div>

        <div>
          <h5 className="font-mono text-xs uppercase tracking-widest text-gold mb-5">Shop</h5>
          <ul className="space-y-3 text-sm text-creamDim">
            <li><Link href="/shop" className="hover:text-cream">Motorcycle Racing</Link></li>
            <li><Link href="/shop" className="hover:text-cream">Kart Racing</Link></li>
            <li><Link href="/shop" className="hover:text-cream">Sportswear</Link></li>
            <li><Link href="/shop" className="hover:text-cream">Team Uniforms</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-mono text-xs uppercase tracking-widest text-gold mb-5">Company</h5>
          <ul className="space-y-3 text-sm text-creamDim">
            <li><Link href="/about" className="hover:text-cream">About Us</Link></li>
            <li><Link href="/about" className="hover:text-cream">OEM Manufacturing</Link></li>
            <li><Link href="/contact" className="hover:text-cream">Dealer Program</Link></li>
            <li><Link href="/studio" className="hover:text-cream">Design Studio</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-mono text-xs uppercase tracking-widest text-gold mb-5">Support</h5>
          <ul className="space-y-3 text-sm text-creamDim">
            <li><Link href="/contact" className="hover:text-cream">Contact</Link></li>
            <li><Link href="/dashboard" className="hover:text-cream">My Account</Link></li>
            <li><Link href="/signup" className="hover:text-cream">Create Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3 text-xs text-creamDim pt-6">
        <span>© {new Date().getFullYear()} Premium Sports Wear. All rights reserved.</span>
        <span>Sialkot, Pakistan</span>
      </div>
    </footer>
  );
}
