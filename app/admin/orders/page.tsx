import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderRow, QuoteRow } from "@/components/AdminOrderQuoteRows";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-black pt-40 px-12">
        <p className="text-creamDim">Not authorized.</p>
      </main>
    );
  }

  const [ordersRaw, quotesRaw] = await Promise.all([
    prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.quoteRequest.findMany({
      include: { user: true, design: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const orders = ordersRaw.map((o) => ({ ...o, total: o.total.toString() }));
  const quotes = quotesRaw.map((q) => ({
    ...q,
    quotedPrice: q.quotedPrice ? q.quotedPrice.toString() : null,
  }));

  return (
    <main className="min-h-screen bg-black pt-32 px-6 md:px-12 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin" className="text-xs text-creamDim hover:text-cream underline">
          ← Back to Admin
        </Link>
      </div>
      <h1 className="font-display font-extrabold uppercase text-3xl md:text-4xl mb-10">
        Orders & Quote Requests.
      </h1>

      <h2 className="font-display font-bold uppercase text-2xl mb-4">
        Orders ({orders.length})
      </h2>
      {orders.length === 0 ? (
        <p className="text-creamDim mb-14">No orders yet.</p>
      ) : (
        <div className="mb-14">
          {orders.map((o) => <OrderRow key={o.id} order={o as any} />)}
        </div>
      )}

      <h2 className="font-display font-bold uppercase text-2xl mb-4">
        Quote Requests ({quotes.length})
      </h2>
      {quotes.length === 0 ? (
        <p className="text-creamDim">No quote requests yet.</p>
      ) : (
        <div>
          {quotes.map((q) => <QuoteRow key={q.id} quote={q as any} />)}
        </div>
      )}
    </main>
  );
}
