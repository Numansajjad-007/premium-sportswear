import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {

  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: true,
    },
  });


  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    where: searchParams.category
      ? {
          category: {
            slug: searchParams.category,
          },
        }
      : undefined,
  });


  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">

      <div className="max-w-7xl mx-auto">


        {/* Header */}

        <h1 className="text-5xl font-bold mb-4">
          Premium Racing Gear
        </h1>

        <p className="text-gray-400 mb-12">
          Professional motorcycle racing and kart racing equipment
          designed for performance, safety, and comfort.
        </p>



        {/* Categories */}

        <section className="mb-16">

          <h2 className="text-3xl font-bold mb-6">
            Explore Categories
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


            {categories.map((category) => (

              <div
                key={category.id}
                className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-6
                hover:border-yellow-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10
                transition
                "
              >

                <h3 className="text-xl font-bold mb-4">
                  {category.name}
                </h3>


                {category.children.length > 0 && (

                  <div className="space-y-2">

                    {category.children.map((child) => (

                      <a
                        key={child.id}
                        href={`/shop?category=${child.slug}`}
                        className="
                        block
                        text-gray-400
                        hover:text-yellow-500
                        transition
                        "
                      >
                        → {child.name}
                      </a>

                    ))}

                  </div>

                )}

              </div>

            ))}


          </div>

        </section>





        {/* Products */}

        <section>

          <h2 className="text-3xl font-bold mb-6">
            Products
          </h2>


          {products.length === 0 ? (

            <p className="text-gray-400">
              No products found in this category.
            </p>

          ) : (


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


              {products.map((product) => (

                <div
                  key={product.id}
                  className="
                  bg-zinc-900
                  rounded-2xl
                  overflow-hidden
                  border
                  border-zinc-800
                  hover:border-yellow-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10
                  transition
                  "
                >


                  {/* Image */}

                  <Link href={`/product/${product.slug}`} className="
                    h-64
                    bg-zinc-800
                    flex
                    items-center
                    justify-center
                  block
                  ">

                    {product.imageUrl ? (

                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="
                        w-full
                        h-full
                        object-cover
                        "
                      />

                    ) : (

                      <span className="text-gray-500">
                        Product Image
                      </span>

                    )}

                  </Link>



                  {/* Details */}

                  <div className="p-6">


                    <p className="text-yellow-500 text-sm mb-2">
                      {product.category.name}
                    </p>


                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-2xl font-bold hover:text-yellow-500 transition">
                        {product.name}
                      </h3>
                    </Link>


                    <p className="text-gray-400 mt-3">
                      {product.description}
                    </p>



                    <div className="
                    mt-6
                    flex
                    justify-between
                    items-center
                    ">


                      <span className="
                      text-yellow-500
                      text-xl
                      font-bold
                      ">
                        €{product.basePrice.toString()}
                      </span>



                      <Link
                        href={`/product/${product.slug}`}
                        className="
                        bg-yellow-500
                        text-black
                        px-5
                        py-2
                        rounded-full
                        font-bold
                        hover:bg-yellow-400
                        inline-block
                        text-center
                        "
                      >
                        Customize & Order
                      </Link>


                    </div>


                  </div>


                </div>

              ))}


            </div>

          )}


        </section>


      </div>


    </main>
  );
}