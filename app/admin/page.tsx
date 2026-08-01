import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminProductForm from "@/components/AdminProductForm";
import AdminProductList from "@/components/AdminProductList";
import AdminShippingForm from "@/components/AdminShippingForm";
import AdminCategoryPhotos from "@/components/AdminCategoryPhotos";
import AdminCategoryManager from "@/components/AdminCategoryManager";
import AdminGallery from "@/components/AdminGallery";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-black pt-40 px-12">
        <p className="text-creamDim">
          You need to be logged in to view this page.{" "}
          <Link href="/login" className="text-gold underline">Log in</Link>
        </p>
      </main>
    );
  }

  if ((session.user as any).role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-black pt-40 px-12">
        <h1 className="font-display font-extrabold uppercase text-3xl mb-4">Not authorized</h1>
        <p className="text-creamDim max-w-lg">
          This account doesn&apos;t have admin access. If this is your store, open Prisma
          Studio (<code className="text-gold">npx prisma studio</code>), find your user in the
          <code className="text-gold"> User</code> table, and change its <code className="text-gold">role</code> field
          from <code className="text-gold">CUSTOMER</code> to <code className="text-gold">ADMIN</code>.
        </p>
      </main>
    );
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true },
    orderBy: { name: "asc" },
  });

  const productsRaw = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  const products = productsRaw.map((p) => ({ ...p, basePrice: p.basePrice.toString() }));

  let shipping = await prisma.shippingSettings.findFirst();
  if (!shipping) {
    shipping = await prisma.shippingSettings.create({ data: { flatFee: 0 } });
  }

  const topCategories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  const categoryTree = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });

  const galleryImages = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="min-h-screen bg-black pt-32 px-12 pb-20">
      <span className="font-mono text-xs uppercase text-red tracking-widest">Admin</span>
      <h1 className="font-display font-extrabold uppercase text-4xl mt-2 mb-4">
        Manage Products.
      </h1>
      <Link href="/admin/orders" className="inline-block text-gold hover:text-goldBright underline text-sm mb-10">
        View Orders & Quote Requests →
      </Link>

      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 mb-16">
        <AdminProductForm categories={categories} />

        <div>
          <h3 className="font-display font-bold uppercase text-xl mb-4">
            Current Products ({products.length})
          </h3>
          <AdminProductList products={products} categories={categories} />
        </div>
      </div>

      <AdminShippingForm initialFee={shipping.flatFee.toString()} />

      <h3 className="font-display font-bold uppercase text-xl mt-16 mb-4">
        Category Photos
      </h3>
      <p className="text-creamDim text-sm mb-6 max-w-xl">
        These photos appear on the homepage category tiles. Free, commercial-use photos:{" "}
        <a href="https://unsplash.com" target="_blank" className="text-gold underline">unsplash.com</a> or{" "}
        <a href="https://pexels.com" target="_blank" className="text-gold underline">pexels.com</a> —
        right-click any photo → copy image address → paste it here, or upload one from your computer.
      </p>
      <AdminCategoryPhotos categories={topCategories} />

      <h3 className="font-display font-bold uppercase text-xl mt-16 mb-4">
        Manage Categories
      </h3>
      <p className="text-creamDim text-sm mb-6 max-w-xl">
        Add, rename, or delete main categories and their sub-categories. You can&apos;t delete a
        category that still has products or sub-categories in it.
      </p>
      <AdminCategoryManager categories={categoryTree} />

      <h3 className="font-display font-bold uppercase text-xl mt-16 mb-4">
        Gallery
      </h3>
      <p className="text-creamDim text-sm mb-6 max-w-xl">
        Photos shown on the public Gallery page.
      </p>
      <AdminGallery images={galleryImages} />
    </main>
  );
}
