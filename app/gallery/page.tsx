import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="bg-black min-h-screen">
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 border-b border-white/10">
        <span className="font-mono text-xs tracking-[2px] uppercase text-red">Gallery</span>
        <h1 className="font-display font-black uppercase text-4xl md:text-7xl leading-none mt-4 mb-4">
          On the Grid.
        </h1>
        <p className="text-creamDim max-w-xl">
          Suits, kits, and gear we&apos;ve built, on and off the track.
        </p>
      </header>

      {images.length === 0 ? (
        <div className="px-6 md:px-12 py-20">
          <p className="text-creamDim">
            No gallery photos yet.{" "}
            <Link href="/studio" className="text-gold underline">Design your own</Link> or check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1">
          {images.map((img) => (
            <div key={img.id} className="aspect-square relative overflow-hidden group">
              <img
                src={img.imageUrl}
                alt={img.caption || "Gallery photo"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {img.caption && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-cream text-sm">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
