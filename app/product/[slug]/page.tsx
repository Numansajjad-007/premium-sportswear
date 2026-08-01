import { prisma } from "@/lib/prisma";
import ProductOrderForm from "@/components/ProductOrderForm";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-black pt-28">
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="bg-carbon flex items-center justify-center p-10 lg:min-h-[70vh]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="max-h-[65vh] object-contain" />
          ) : (
            <div className="w-full aspect-[4/5] bg-gradient-to-br from-carbon2 to-carbon flex items-center justify-center">
              <span className="text-creamDim text-sm font-mono">No photo yet</span>
            </div>
          )}
        </div>

        <div className="px-8 md:px-14 py-12">
          <p className="font-mono text-xs uppercase text-gold tracking-widest mb-3">
            {product.category.name}
          </p>
          <h1 className="font-display font-extrabold uppercase text-3xl md:text-4xl mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-creamDim leading-relaxed mb-6">{product.description}</p>
          <p className="font-mono text-goldBright text-2xl mb-10">
            ${Number(product.basePrice).toFixed(2)}
          </p>

          <ProductOrderForm productName={product.name} basePrice={Number(product.basePrice)} />
        </div>
      </div>
    </main>
  );
}
