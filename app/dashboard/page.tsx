"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Design = {
  id: string;
  name: string;
  panelColors: Record<string, string>;
  driverName: string | null;
  raceNumber: string | null;
  createdAt: string;
};

type QuoteRequest = {
  id: string;
  status: string;
  quantity: number;
  quotedPrice: string | null;
  createdAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      const userId = (session!.user as any).id;
      Promise.all([
        fetch(`/api/designs?userId=${userId}`).then((r) => r.json()),
        fetch(`/api/quote-requests?userId=${userId}`).then((r) => r.json()),
      ])
        .then(([designData, quoteData]) => {
          setDesigns(Array.isArray(designData) ? designData : []);
          setQuotes(Array.isArray(quoteData) ? quoteData : []);
        })
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-black pt-32 px-12">
        <p className="text-creamDim">Loading your account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-32 px-12 pb-20">
      <h1 className="font-display font-extrabold uppercase text-4xl mb-2">
        Welcome, {session?.user?.name?.split(" ")[0]}.
      </h1>
      <p className="text-creamDim mb-12">Here are the designs you've saved in the Design Studio.</p>

      {designs.length === 0 ? (
        <div className="border border-white/10 bg-carbon p-10 max-w-lg">
          <p className="text-creamDim mb-5">You haven&apos;t saved any designs yet.</p>
          <Link href="/studio" className="bg-gold text-black px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-goldBright transition">
            Go to Design Studio
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {designs.map((d) => (
            <div key={d.id} className="bg-carbon p-6">
              <div className="flex gap-1 mb-4">
                {Object.values(d.panelColors).map((hex, i) => (
                  <span key={i} className="w-6 h-6 rounded-full border border-white/20" style={{ background: hex }} />
                ))}
              </div>
              <h4 className="font-display font-bold uppercase text-lg mb-1">{d.name}</h4>
              <p className="text-creamDim text-xs font-mono">
                Saved {new Date(d.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display font-extrabold uppercase text-3xl mt-16 mb-6">
        Your Quote Requests
      </h2>
      {quotes.length === 0 ? (
        <p className="text-creamDim">No quote requests yet — send one from the Design Studio.</p>
      ) : (
        <div className="border border-white/10">
          {quotes.map((q) => (
            <div key={q.id} className="flex justify-between items-center px-6 py-4 border-b border-white/10 last:border-b-0 bg-carbon">
              <div>
                <span className="font-mono text-xs uppercase text-gold">{q.status}</span>
                <p className="text-sm text-creamDim mt-1">Quantity: {q.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-cream">
                  {q.quotedPrice ? `$${q.quotedPrice}` : "Awaiting quote"}
                </p>
                <p className="text-xs text-creamDim font-mono">
                  {new Date(q.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
